/* ============================================================
   components/project-shelf.js
   Projects surface: InteractiveSelector-style expanding panels
   that advance ONE BY ONE as you scroll down (GSAP pin), plus a
   static hero rail. Touch / reduced-motion get a swipe strip.
   ============================================================ */
import { projects, byId } from "../data/projects.js";
import { env, getLenis } from "../core/smooth-scroll.js";

const esc = (s) => String(s ?? "").replace(/"/g, "&quot;");

/* ---------- category icons ---------- */
const ICONS = {
  sistemas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><path d="M17.5 14.5v6M14.5 17.5h6"/></svg>',
  plataformas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  produtos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
  marcas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2.6"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/></svg>'
};
const iconFor = (p) => ICONS[p.category] || ICONS.produtos;

/* ---------- hero rail (static covers, no autoplay video) ---------- */
function railCard(p) {
  return `
  <button type="button" class="rail-card" data-open-project="${p.id}" data-cursor="view"
          aria-label="Ver storytelling do projeto ${esc(p.name)}">
    <span class="rail-card__media" data-media>
      <img src="${p.cover}" alt="Interface real de ${esc(p.name)}" width="1440" height="900" decoding="async" fetchpriority="high">
    </span>
    <span class="rail-card__meta">
      <span class="rail-card__name">${p.name}</span>
      <span class="rail-card__type">${p.type}</span>
    </span>
    <span class="rail-card__index" aria-hidden="true">/${p.index}</span>
  </button>`;
}

/* ---------- project panel ---------- */
function panel(p, i) {
  const video = p.previewVideo
    ? `<video class="work-panel__video" src="${esc(p.previewVideo)}" poster="${esc(p.cover)}" muted loop playsinline preload="none" aria-hidden="true"></video>`
    : "";
  return `
  <article class="work-panel${i === 0 ? " is-active" : ""}" data-work-panel data-index="${i}"
           data-open-project="${p.id}" role="button" tabindex="0"
           aria-label="Ver projeto ${esc(p.name)}">
    <span class="work-panel__media" data-media>
      <img class="work-panel__cover" src="${p.cover}" alt="Interface real do projeto ${esc(p.name)}"
           width="1440" height="900" ${i < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
      ${video}
      <span class="work-panel__shade" aria-hidden="true"></span>
    </span>
    <span class="work-panel__spine" aria-hidden="true">
      <span class="work-panel__icon">${iconFor(p)}</span>
      <span class="work-panel__spine-name">${p.name}</span>
    </span>
    <span class="work-panel__label">
      <span class="work-panel__kicker">/${p.index} · ${p.type}</span>
      <h3 class="work-panel__name">${p.name}</h3>
      <p class="work-panel__desc">${p.shortDescription}</p>
      <span class="work-panel__cta">Ver projeto
        <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 13L13 2M5 2h8v8"/></svg>
      </span>
    </span>
  </article>`;
}

function panelsMarkup() {
  return `
  <div class="work-scroll" data-work-scroll>
    <div class="work-sticky">
      <div class="work-panels" data-work-panels>
        <div class="work-panels__hud" aria-hidden="true">
          <span>Selected work</span>
          <span data-work-counter>01 / ${String(projects.length).padStart(2, "0")}</span>
        </div>
        <div class="work-panels__strip" data-work-strip role="group" aria-label="Projetos">
          ${projects.map(panel).join("")}
        </div>
        <div class="work-panels__progress" aria-hidden="true"><i data-work-progress></i></div>
        <p class="work-swipe-hint" aria-hidden="true">Arraste para o lado
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h15M13 6l6 6-6 6"/></svg>
        </p>
      </div>
    </div>
  </div>`;
}

export function renderProjects() {
  const railMount = document.querySelector('[data-mount="hero-rail"]');
  if (railMount) {
    railMount.innerHTML = ["tradeflow", "mainstage", "vant"].map((id) => railCard(byId[id])).join("");
  }
  const shelfMount = document.querySelector('[data-mount="shelf"]');
  if (shelfMount) shelfMount.innerHTML = panelsMarkup();
}

/* kept for main.js compatibility — work videos are driven by the
   panel logic, hero rail is static, so this is now a light no-op. */
export function initPreviewVideos() {
  const videos = document.querySelectorAll("[data-preview-video]");
  if (!videos.length) return;
}

/* ---------- gallery behaviour ---------- */
export function initProjectGallery() {
  const scrollEl = document.querySelector("[data-work-scroll]");
  const wrap = document.querySelector("[data-work-panels]");
  const strip = wrap?.querySelector("[data-work-strip]");
  if (!wrap || !strip) return;

  const panels = [...strip.querySelectorAll("[data-work-panel]")];
  const counter = wrap.querySelector("[data-work-counter]");
  const progress = wrap.querySelector("[data-work-progress]");
  const N = panels.length;
  let active = -1;
  let scrollActive = 0;
  let hovering = false;
  let hoverSyncTimer = 0;

  function playVideo(panelEl) {
    const v = panelEl.querySelector(".work-panel__video");
    if (!v || env.saveData) return;
    v.muted = true; v.playsInline = true;
    if (v.readyState < 2) { v.preload = "auto"; v.load(); }
    v.play().then(() => panelEl.classList.add("is-video-ready")).catch(() => {});
  }
  function stopVideo(panelEl) {
    panelEl.querySelector(".work-panel__video")?.pause();
  }

  function setActive(idx) {
    idx = Math.max(0, Math.min(N - 1, idx));
    if (idx === active) return;
    if (active > -1) stopVideo(panels[active]);
    active = idx;
    panels.forEach((el, i) => el.classList.toggle("is-active", i === idx));
    playVideo(panels[idx]);
    if (counter) counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
  }

  function syncScrollToPanel(idx) {
    if (!desktop || !scrollEl || N < 2) return;
    clearTimeout(hoverSyncTimer);
    hoverSyncTimer = setTimeout(() => {
      const start = scrollEl.getBoundingClientRect().top + window.scrollY;
      const end = start + Math.max(0, scrollEl.offsetHeight - window.innerHeight);
      const target = start + ((end - start) * (idx / (N - 1)));
      if (Math.abs(window.scrollY - target) < 10) return;
      const lenis = getLenis?.();
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 0.55,
          easing: (t) => 1 - Math.pow(1 - t, 3)
        });
      } else {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    }, 0);
  }

  /* HOVER wins: hovering a panel highlights exactly that panel; leaving
     the strip hands control back to the scroll position. */
  panels.forEach((el, i) => {
    el.addEventListener("pointerenter", () => {
      hovering = true;
      scrollActive = i;
      setActive(i);
      syncScrollToPanel(i);
      if (progress) progress.style.transform = `scaleX(${N > 1 ? i / (N - 1) : 1})`;
    });
  });
  strip.addEventListener("pointerleave", () => {
    hovering = false;
    clearTimeout(hoverSyncTimer);
    setActive(scrollActive);
  });
  strip.addEventListener("wheel", () => {
    if (!desktop) return;
    hovering = false;
    clearTimeout(hoverSyncTimer);
    setActive(scrollActive);
  }, { passive: true });

  const { gsap, ScrollTrigger } = env;
  const desktop = !env.touch && !env.reduce && gsap && ScrollTrigger &&
    matchMedia("(min-width: 900px)").matches;

  if (desktop && scrollEl) {
    /* sticky + scrub — the panels stay centred while a tall scroll track
       advances the active project. No pin means no fixed→flow jump. */
    scrollEl.style.height = `${Math.round(N * 82)}vh`;
    setActive(0);
    ScrollTrigger.create({
      trigger: scrollEl,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const raw = self.progress * (N - 1);
        const target = Math.max(0, Math.min(N - 1, Math.round(raw)));
        if (target !== scrollActive && Math.abs(raw - scrollActive) > 0.5) scrollActive = target;
        if (progress) progress.style.transform = `scaleX(${self.progress})`;
        if (!hovering) setActive(scrollActive);
      }
    });
  } else {
    /* touch / small / reduced-motion: horizontal swipe strip */
    scrollEl?.classList.add("is-flat");
    wrap.classList.add("is-strip");
    setActive(0);
    let raf = 0;
    const onScroll = () => {
      raf = 0;
      const center = strip.scrollLeft + strip.clientWidth / 2;
      let best = 0, bestD = Infinity;
      panels.forEach((el, i) => {
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestD) { bestD = d; best = i; }
      });
      scrollActive = best;
      if (!hovering) setActive(best);
      if (progress) progress.style.transform = `scaleX(${N > 1 ? best / (N - 1) : 1})`;
    };
    strip.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
    panels.forEach((el, i) => {
      el.addEventListener("pointerenter", () => {
        const left = el.offsetLeft - (strip.clientWidth - el.offsetWidth) / 2;
        strip.scrollTo({ left, behavior: "smooth" });
        scrollActive = i;
        setActive(i);
      });
    });

    /* one-time gentle nudge the first time the strip comes into view,
       so it reads as swipeable instead of a static row of cards */
    if (!env.reduce && N > 1) {
      const nudge = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        nudge.disconnect();
        setTimeout(() => {
          strip.scrollTo({ left: 48, behavior: "smooth" });
          setTimeout(() => strip.scrollTo({ left: 0, behavior: "smooth" }), 560);
        }, 550);
      }, { threshold: 0.55 });
      nudge.observe(strip);
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && active > -1) playVideo(panels[active]);
  });
}
