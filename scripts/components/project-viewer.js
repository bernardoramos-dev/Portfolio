/* ============================================================
   components/project-viewer.js — Project Experience layer.
   Each project opens into its OWN bespoke intro composition
   (see story-layouts.js) — no shared skeleton. FLIP-like open,
   dialog semantics, loading / error / retry, focus trap, inert bg.
   ============================================================ */
import { byId } from "../data/projects.js";
import { env, lockScroll } from "../core/smooth-scroll.js";
import { trapFocus, setBackgroundInert } from "../core/accessibility.js";
import { renderStory, STORY_ANIM } from "./story-layouts.js";

const LOAD_TIMEOUT = 15000;

export function initProjectViewer() {
  const viewer = document.querySelector(".viewer");
  if (!viewer) return;

  const frame = viewer.querySelector(".viewer__frame");
  const nameEl = viewer.querySelector(".viewer__name");
  const typeEl = viewer.querySelector(".viewer__type");
  const poster = viewer.querySelector(".viewer__poster");
  const story = viewer.querySelector(".viewer__story");
  const storyBg = viewer.querySelector(".viewer__story-bg");
  const storyInner = viewer.querySelector("[data-viewer-story-inner]");
  const stateEl = viewer.querySelector(".viewer__state");
  const stateTitle = viewer.querySelector(".viewer__state-title");
  const stateHint = viewer.querySelector(".viewer__state-hint");
  const spinner = viewer.querySelector(".viewer__spinner");
  const retryBtn = viewer.querySelector("[data-viewer-retry]");
  const tabLink = viewer.querySelector("[data-viewer-tab]");
  const closeBtn = viewer.querySelector("[data-viewer-close]");
  const secondarySlot = viewer.querySelector(".viewer__secondary");

  let lastFocus = null;
  let releaseTrap = null;
  let loadTimer = 0;
  let currentUrl = "";
  let currentProject = null;
  let storyPreviewFrame = null; // live demo preview, rebuilt per project
  let previewDriftRaf = 0;
  let previewManualUntil = 0;

  /* keep the scaled canvas glued to the preview box through entrance
     animations, font reflow, rotation and fullscreen — one observer,
     re-pointed at each new preview viewport */
  const previewResizeObserver = typeof ResizeObserver !== "undefined"
    ? new ResizeObserver(() => { if (storyPreviewFrame) scalePreviewFrame(storyPreviewFrame); })
    : null;

  const emitViewer = (state, detail = {}) => {
    document.dispatchEvent(new CustomEvent("portfolio:viewer", {
      detail: { state, project: currentProject?.id || null, url: currentUrl || null, ...detail }
    }));
  };

  /* keep the scaled preview correct across window / fullscreen resizes */
  window.addEventListener("resize", () => {
    if (storyPreviewFrame && viewer.classList.contains("is-open") && !story.hidden) {
      scalePreviewFrame(storyPreviewFrame);
    }
  });

  /* brand-tinted glow that trails the pointer — gives each intro its own life */
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "viewer__cursorglow";
  cursorGlow.setAttribute("aria-hidden", "true");
  story?.appendChild(cursorGlow);
  viewer.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    if (!viewer.classList.contains("is-open") || story.hidden) return;
    const r = story.getBoundingClientRect();
    cursorGlow.style.transform = `translate(${event.clientX - r.left}px, ${event.clientY - r.top}px)`;
    story.classList.add("has-cursor");
  });
  viewer.addEventListener("pointerleave", () => story.classList.remove("has-cursor"));

  /* If the GSAP entrance never advances (rAF throttled / gsap missing / slow
     device), force the intro content visible so it's never stuck invisible. */
  function revealFailsafe(nodes, ms) {
    setTimeout(() => {
      nodes.forEach((n) => {
        const cs = getComputedStyle(n);
        if (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) {
          env.gsap?.killTweensOf?.(n);
          n.style.opacity = "1";
          n.style.visibility = "visible";
          n.style.filter = "none";
          n.style.transform = "none";
        }
      });
    }, ms);
  }

  /* route toggle in the bar — main experience + secondary routes (admin, etc).
     From an admin panel the "Início" button takes you back to the main page. */
  function renderRoutes(project) {
    secondarySlot.innerHTML = "";
    const routes = [
      { label: project.homeLabel || "Início", url: project.experienceUrl },
      ...project.secondaryExperiences
    ];
    if (routes.length < 2) return;
    routes.forEach((r) => {
      const btn = document.createElement("button");
      btn.className = "viewer__route";
      btn.type = "button";
      btn.dataset.url = r.url;
      btn.innerHTML = `<span>${r.label}</span>`;
      btn.addEventListener("click", () => loadUrl(r.url));
      secondarySlot.appendChild(btn);
    });
  }
  function markActiveRoute(url) {
    secondarySlot.querySelectorAll(".viewer__route").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.url === url);
    });
  }

  function setState(mode, project) {
    // mode: loading | ready | error
    clearTimeout(loadTimer);
    emitViewer(mode);
    if (mode === "ready") {
      stateEl.hidden = true;
      frame.classList.add("is-ready");
      return;
    }
    stateEl.hidden = false;
    frame.classList.remove("is-ready");
    if (mode === "loading") {
      spinner.hidden = false;
      retryBtn.hidden = true;
      stateTitle.textContent = project?.name ? `Abrindo ${project.name}` : "Carregando projeto";
      stateHint.textContent = project?.access?.passwordHint
        ? `${project.access.label}. ${project.access.passwordHint}`
        : "Preparando experiência";
      if (!project?.access?.passwordHint && project?.type) stateHint.textContent = project.type;
      loadTimer = setTimeout(() => setState("error", project), LOAD_TIMEOUT);
    } else {
      spinner.hidden = true;
      retryBtn.hidden = false;
      stateTitle.textContent = "O projeto não respondeu";
      stateHint.textContent =
        "A experiência pode precisar abrir em uma nova aba. Tente novamente ou abra fora do portfólio.";
    }
  }

  function loadUrl(url) {
    currentUrl = url;
    tabLink.href = url;
    markActiveRoute(url);
    const startLoad = () => {
      story.hidden = true;
      frame.classList.remove("is-ready");
      frame.removeAttribute("src");
      setState("loading", currentProject);
      /* defer one tick so removing + re-adding src reliably retriggers a load;
         a timer (not rAF) so a throttled/paused rAF can't stall the demo */
      setTimeout(() => { frame.src = url; }, 0);
    };
    const anim = story.querySelectorAll("[data-anim]");
    if (env.gsap && !env.reduce && !story.hidden && anim.length) {
      let fired = false;
      const run = () => { if (!fired) { fired = true; startLoad(); } };
      env.gsap.to(anim, {
        y: -26,
        autoAlpha: 0,
        duration: 0.34,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: run
      });
      /* guarantee the demo loads even if the exit tween never advances */
      setTimeout(run, 520);
    } else {
      startLoad();
    }
  }

  frame.addEventListener("load", () => {
    if (!frame.getAttribute("src")) return;
    setState("ready");
  });

  retryBtn?.addEventListener("click", () => loadUrl(currentUrl));

  /* the CTA is rebuilt per project → delegate instead of binding once */
  viewer.addEventListener("click", (event) => {
    if (event.target.closest("[data-viewer-start]")) {
      event.preventDefault();
      loadUrl(currentUrl || currentProject?.experienceUrl);
    }
  });

  function setStory(project) {
    if (!story || !storyInner) return;
    cancelAnimationFrame(previewDriftRaf);
    previewDriftRaf = 0;
    previewManualUntil = 0;
    story.hidden = false;
    stateEl.hidden = true;
    frame.classList.remove("is-ready");
    frame.removeAttribute("src");
    storyBg.src = project.atmosphere || project.cover;
    storyBg.classList.toggle("is-atmosphere", Boolean(project.atmosphere));

    const { layout, html } = renderStory(project);
    viewer.dataset.storyLayout = layout;
    storyInner.innerHTML = html;

    /* wire the live preview: a real, scaled view of the actual demo.
       The still is the poster fallback shown until the iframe is ready. */
    const still = storyInner.querySelector("[data-viewer-story-still]");
    if (still) still.src = project.cover;
    storyPreviewFrame = storyInner.querySelector("[data-viewer-story-frame]");
    if (storyPreviewFrame) {
      const purl = project.previewUrl || project.experienceUrl;
      const viewport = storyPreviewFrame.closest(".story-preview__viewport");
      viewport?.classList.remove("is-live-ready");
      storyPreviewFrame.classList.remove("is-ready");
      storyPreviewFrame.addEventListener("load", () => {
        if (!storyPreviewFrame?.getAttribute("src")) return;
        storyPreviewFrame.classList.add("is-ready");
        viewport?.classList.add("is-live-ready");
        preparePreviewDocument(storyPreviewFrame);
        wirePreviewWheel(viewport, storyPreviewFrame);
        startPreviewDrift(storyPreviewFrame);
      }, { once: true });
      scalePreviewFrame(storyPreviewFrame);
      storyPreviewFrame.src = purl;
      // rescale once layout settles (timer, not rAF — safe if rAF is throttled)
      setTimeout(() => scalePreviewFrame(storyPreviewFrame), 60);
      if (previewResizeObserver && viewport) {
        previewResizeObserver.disconnect();
        previewResizeObserver.observe(viewport);
      }

      /* the preview itself is a tap/click target — the fastest route in.
         (the iframe is pointer-events:none, so interactions land here) */
      if (viewport) {
        viewport.dataset.cursor = "open";
        viewport.setAttribute("role", "button");
        viewport.setAttribute("tabindex", "0");
        viewport.setAttribute("aria-label", `Abrir experiência de ${project.name}`);
        const openExperience = () => loadUrl(currentUrl || project.experienceUrl);
        viewport.addEventListener("click", openExperience);
        viewport.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openExperience();
          }
        });
      }
    }
  }

  /* render the demo at desktop width, then scale it to fill the preview frame
     so the intro shows the real site (not a mobile squeeze).
     On phones (≤860px) the canvas becomes a real phone width instead, so the
     preview shows the project's actual MOBILE layout — legible and alive. */
  const isMobileViewer = () => matchMedia("(max-width: 860px)").matches;
  function scalePreviewFrame(frameEl) {
    if (!frameEl) return;
    const box = frameEl.parentElement;
    if (!box) return;
    const w = box.clientWidth || 1;
    const h = box.clientHeight || 1;
    const mobile = isMobileViewer();
    const baseW = mobile ? Math.max(360, w) : 1920;
    const baseH = mobile ? Math.round(baseW * (h / w)) : 1080;
    const scale = Math.min(w / baseW, h / baseH);
    const scaledW = baseW * scale;
    const scaledH = baseH * scale;
    /* reset.css intentionally normalizes replaced elements, but this iframe
       is a desktop canvas rather than a fluid media element. Keep the
       unscaled canvas free so it is transformed exactly once below. */
    frameEl.style.maxWidth = "none";
    frameEl.style.maxHeight = "none";
    frameEl.style.width = baseW + "px";
    frameEl.style.height = baseH + "px";
    frameEl.style.left = Math.max(0, (w - scaledW) / 2) + "px";
    frameEl.style.top = Math.max(0, (h - scaledH) / 2) + "px";
    frameEl.style.transformOrigin = "top left";
    frameEl.style.transform = `scale(${scale})`;
  }

  function startPreviewDrift(frameEl) {
    cancelAnimationFrame(previewDriftRaf);
    previewDriftRaf = 0;
    if (env.reduce) return;
    try { frameEl.contentWindow?.scrollTo(0, 0); } catch (_) {}
    const start = performance.now();
    const tick = (now) => {
      if (frameEl !== storyPreviewFrame || !viewer.classList.contains("is-open") || story.hidden) return;
      try {
        const win = frameEl.contentWindow;
        const doc = frameEl.contentDocument?.documentElement;
        const body = frameEl.contentDocument?.body;
        const scrollHeight = Math.max(doc?.scrollHeight || 0, body?.scrollHeight || 0);
        const max = Math.max(0, scrollHeight - (win?.innerHeight || 1080));
        if (win && max > 24 && now >= previewManualUntil) {
          const cycle = 58000;
          const phase = ((now - start) % cycle) / cycle;
          const holdStart = 0.14;
          const travel = 0.76;
          const t = phase < holdStart ? 0 : phase < holdStart + travel ? (phase - holdStart) / travel : 1;
          const eased = t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 1.65);
          win.scrollTo(0, Math.round(max * eased));
        }
      } catch (_) {
        return;
      }
      previewDriftRaf = requestAnimationFrame(tick);
    };
    previewDriftRaf = requestAnimationFrame(tick);
  }

  function wirePreviewWheel(viewport, frameEl) {
    if (!viewport || !frameEl) return;
    viewport.addEventListener("wheel", (event) => {
      try {
        const win = frameEl.contentWindow;
        const doc = frameEl.contentDocument?.documentElement;
        const body = frameEl.contentDocument?.body;
        if (!win || !doc) return;
        const scrollHeight = Math.max(doc.scrollHeight || 0, body?.scrollHeight || 0);
        const max = Math.max(0, scrollHeight - (win.innerHeight || 1080));
        if (max <= 24) return;
        event.preventDefault();
        previewManualUntil = performance.now() + 1800;
        const next = Math.max(0, Math.min(max, win.scrollY + event.deltaY * 0.72));
        win.scrollTo({ top: next, behavior: "auto" });
      } catch (_) {}
    }, { passive: false });
  }

  function preparePreviewDocument(frameEl) {
    try {
      const doc = frameEl.contentDocument;
      if (!doc?.documentElement) return;
      if (isMobileViewer()) {
        /* phone preview: let the demo run its own responsive mobile layout */
        doc.documentElement.style.minWidth = "";
        doc.documentElement.style.width = "";
        doc.documentElement.classList.remove("portfolio-preview-desktop");
        doc.documentElement.classList.add("portfolio-preview-mobile");
        if (doc.body) {
          doc.body.style.minWidth = "";
          doc.body.style.width = "";
        }
        frameEl.contentWindow?.scrollTo(0, 0);
        return;
      }
      doc.documentElement.style.minWidth = "1920px";
      doc.documentElement.style.width = "1920px";
      doc.documentElement.classList.remove("portfolio-preview-mobile");
      doc.documentElement.classList.add("portfolio-preview-desktop");
      if (doc.body) {
        doc.body.style.minWidth = "1920px";
        doc.body.style.width = "1920px";
      }
      frameEl.contentWindow?.scrollTo(0, 0);
    } catch (_) {}
  }

  function open(projectId, sourceEl, urlOverride) {
    const project = byId[projectId];
    if (!project) return;
    currentProject = project;
    lastFocus = document.activeElement;

    /* each project brings its own accent + brand tokens → its own world */
    const brand = project.brand || {};
    viewer.dataset.project = project.id;
    viewer.dataset.brandMood = brand.mood || project.id;
    viewer.style.setProperty("--accent", brand.accent || project.accent || "#f3f3ef");
    viewer.style.setProperty("--brand-bg", brand.bg || "#050505");
    viewer.style.setProperty("--brand-ink", brand.ink || "#f3f3ef");
    viewer.style.setProperty("--brand-accent-2", brand.accent2 || brand.accent || project.accent || "#f3f3ef");
    viewer.style.setProperty("--brand-surface", brand.surface || "#101010");
    viewer.style.setProperty("--brand-type", brand.type || "var(--font-display)");
    viewer.style.setProperty("--brand-signature", `"${brand.signature || project.type || "projeto"}"`);

    nameEl.textContent = project.name;
    typeEl.textContent = project.type;
    frame.title = `Experiência ao vivo — ${project.name}`;
    poster.src = project.cover;
    poster.alt = "";
    tabLink.href = urlOverride || project.experienceUrl;
    currentUrl = urlOverride || project.experienceUrl;
    setStory(project);

    /* secondary routes → toggle (main + admin/etc) */
    renderRoutes(project);

    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setBackgroundInert(true);
    releaseTrap = trapFocus(viewer);
    emitViewer("open");

    /* cinematic reveal: a curtain in THIS project's accent wipes away —
       the transition itself is branded per project */
    viewer.querySelectorAll(".viewer__curtain").forEach((c) => c.remove());
    if (env.gsap && !env.reduce) {
      const curtain = document.createElement("div");
      curtain.className = "viewer__curtain";
      viewer.appendChild(curtain);
      env.gsap.fromTo(curtain,
        { scaleY: 1 },
        { scaleY: 0, transformOrigin: "50% 0%", duration: 0.72, ease: "expo.inOut", delay: 0.05, onComplete: () => curtain.remove() }
      );
      setTimeout(() => curtain.remove(), 1150); // failsafe if rAF is stalled
    }

    /* per-layout entrance choreography — no two open the same way */
    if (env.gsap && !env.reduce) {
      const cfg = STORY_ANIM[viewer.dataset.storyLayout] || STORY_ANIM.console;
      const anim = story.querySelectorAll("[data-anim]");
      if (anim.length) {
        env.gsap.fromTo(anim,
          { ...cfg.from, autoAlpha: 0 },
          {
            y: 0, x: 0, scale: 1, rotate: 0, filter: "blur(0px)", autoAlpha: 1,
            duration: cfg.dur, stagger: cfg.stagger, ease: cfg.ease, delay: 0.12
          }
        );
        revealFailsafe(anim, (cfg.dur + anim.length * cfg.stagger + 0.35) * 1000);
      }
      env.gsap.fromTo(
        storyBg,
        { scale: 1.08, opacity: 0 },
        {
          scale: project.atmosphere ? 1.015 : 1.04,
          opacity: project.atmosphere ? 0.72 : 0.22,
          duration: 1.3,
          ease: "power2.out"
        }
      );
    }

    /* FLIP-like transition from the clicked media */
    const media = sourceEl?.querySelector?.("img") || null;
    if (media && env.gsap && !env.reduce) {
      const rect = media.getBoundingClientRect();
      if (rect.width > 40 && rect.height > 40) {
        const ghost = media.cloneNode();
        ghost.className = "viewer-ghost";
        Object.assign(ghost.style, {
          top: `${rect.top}px`, left: `${rect.left}px`,
          width: `${rect.width}px`, height: `${rect.height}px`
        });
        document.body.appendChild(ghost);
        env.gsap.to(ghost, {
          top: 64, left: 0,
          width: window.innerWidth,
          height: window.innerHeight - 64,
          borderRadius: 0,
          duration: 0.75,
          ease: "expo.inOut",
          onComplete: () => {
            env.gsap.to(ghost, { opacity: 0, duration: 0.4, onComplete: () => ghost.remove() });
          }
        });
        env.gsap.fromTo(".viewer__bar", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.35, ease: "power3.out" });
      }
    }

    const focusViewer = () => {
      if (!viewer.classList.contains("is-open") || viewer.contains(document.activeElement)) return;
      closeBtn?.focus({ preventScroll: true });
    };
    window.setTimeout(focusViewer, 80);
    window.setTimeout(focusViewer, 500);
  }

  function close() {
    if (!viewer.classList.contains("is-open")) return;
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
    emitViewer("close");
    lockScroll(false);
    setBackgroundInert(false);
    releaseTrap?.();
    releaseTrap = null;
    clearTimeout(loadTimer);
    cancelAnimationFrame(previewDriftRaf);
    previewDriftRaf = 0;
    if (viewer.contains(document.activeElement)) document.activeElement.blur();
    const pf = storyPreviewFrame; // capture so a fast re-open isn't blanked
    setTimeout(() => {
      frame.removeAttribute("src");
      frame.classList.remove("is-ready");
      if (pf) {
        pf.removeAttribute("src");
        pf.classList.remove("is-ready");
        pf.closest(".story-preview__viewport")?.classList.remove("is-live-ready");
      }
    }, 450);
    if (lastFocus && lastFocus !== document.body && lastFocus.focus) lastFocus.focus();
  }

  closeBtn?.addEventListener("click", close);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && viewer.classList.contains("is-open")) close();
  });

  /* delegated triggers */
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-open-project]");
    if (!trigger) return;
    event.preventDefault();
    const source = trigger.querySelector(".media-frame") || trigger.closest(".media-hover") || trigger;
    open(trigger.dataset.openProject, source, trigger.dataset.openUrl || null);
  });

  return { open, close };
}
