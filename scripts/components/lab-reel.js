/* ============================================================
   components/lab-reel.js — LAB videos as a true 3D cylinder.
   Faces sit on a rotateY cylinder; drag spins it with inertia,
   it idles into a slow auto-rotation, and clicking a face opens
   the premium video player. Only front-facing videos decode.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

const TARGET_FACES = 8;

export function initLabReel() {
  const cyl = document.querySelector("[data-lab-cylinder]");
  const stage = cyl?.querySelector("[data-lab-stage]");
  if (!cyl || !stage) return;

  const source = [...stage.querySelectorAll(".lab-item")];
  if (!source.length) return;

  const prepare = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
  };

  /* pointer capture can throw if the pointer is no longer active
     (pointercancel, lost capture) — never let it break a drag/seek */
  const grabPointer = (el, id) => { try { el.setPointerCapture?.(id); } catch { /* ignore */ } };
  const freePointer = (el, id) => { try { el.releasePointerCapture?.(id); } catch { /* ignore */ } };

  function createScrubber(total) {
    const root = document.createElement("div");
    root.className = "lab-scrub";
    root.innerHTML = `
      <button class="lab-scrub__track" type="button" aria-label="Controlar posição dos vídeos">
        <span class="lab-scrub__rail"><i><b></b></i></span>
        <span class="lab-scrub__readout">
          <em data-lab-current>01</em><span>/</span><em>${String(total).padStart(2, "0")}</em>
        </span>
      </button>`;
    const track = root.querySelector(".lab-scrub__track");
    const current = root.querySelector("[data-lab-current]");
    return {
      root,
      track,
      set(progress, index) {
        root.style.setProperty("--lab-progress", Math.max(0, Math.min(1, progress)).toFixed(4));
        current.textContent = String((index % total) + 1).padStart(2, "0");
      },
      pulse() {
        root.classList.remove("is-complete");
        void root.offsetWidth;
        root.classList.add("is-complete");
      }
    };
  }

  function pointerProgress(event, track) {
    const rect = track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
  }

  function initStaticStrip(items) {
    cyl.classList.add("is-static");
    cyl.removeAttribute("data-cursor");
    const scrub = createScrubber(items.length);
    cyl.after(scrub.root);

    function update() {
      const max = Math.max(1, cyl.scrollWidth - cyl.clientWidth);
      const progress = Math.max(0, Math.min(1, cyl.scrollLeft / max));
      const index = Math.round(progress * (items.length - 1));
      scrub.set(progress, index);
    }
    function seek(progress) {
      const max = Math.max(0, cyl.scrollWidth - cyl.clientWidth);
      cyl.scrollTo({ left: progress * max, behavior: env.reduce ? "auto" : "smooth" });
      scrub.pulse();
    }

    scrub.track.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      grabPointer(scrub.track, event.pointerId);
      seek(pointerProgress(event, scrub.track));
      const move = (e) => seek(pointerProgress(e, scrub.track));
      const up = () => {
        scrub.track.removeEventListener("pointermove", move);
        scrub.track.removeEventListener("pointerup", up);
        scrub.track.removeEventListener("pointercancel", up);
      };
      scrub.track.addEventListener("pointermove", move);
      scrub.track.addEventListener("pointerup", up);
      scrub.track.addEventListener("pointercancel", up);
    });

    cyl.addEventListener("scroll", update, { passive: true });
    items.forEach((item) => item.querySelector("video") && prepare(item.querySelector("video")));
    update();
  }

  /* reduced-motion fallback only — touch/mobile gets the real cylinder too,
     dragged and idly rotated via pointer events (works with touch natively) */
  if (env.reduce) {
    initStaticStrip(source);
    return;
  }

  /* fill the ring so it never looks sparse */
  while (stage.querySelectorAll(".lab-item").length < TARGET_FACES) {
    source.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.classList.add("is-loop-clone");
      stage.appendChild(clone);
    });
  }
  const faces = [...stage.querySelectorAll(".lab-item")];
  const faceCount = faces.length;
  const step = 360 / faceCount;
  const scrub = createScrubber(faceCount);
  cyl.after(scrub.root);

  let radius = 0;
  function layout() {
    const sm = matchMedia("(max-width: 720px)").matches;
    const faceWidth = sm ? 176 : 300;
    radius = Math.round((faceWidth * faceCount) / (2 * Math.PI));
    faces.forEach((face, i) => {
      face.style.width = `${faceWidth}px`;
      face.dataset.baseAngle = String(i * step);
      face.style.transform =
        `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
    cyl.style.setProperty("--cyl-h", `${Math.round(faceWidth * 0.62 + 40)}px`);
  }

  const state = {
    rotation: 0,
    scrollRot: 0,
    total: 0,
    velocity: 0,
    dragging: false,
    hovering: false,
    hovered: null,
    visible: true,
    moved: false,
    seeking: false,
    seekFrom: 0,
    seekTo: 0,
    seekStart: 0,
    seekDuration: 680,
    startX: 0,
    lastX: 0,
    raf: 0
  };
  const AUTO_SPEED = 0.05;

  function faceTransform(face, extraZ = 0, scale = 1) {
    const a = Number(face.dataset.baseAngle);
    return `translate(-50%, -50%) rotateY(${a}deg) translateZ(${radius + extraZ}px) scale(${scale})`;
  }
  function resetFace(face) {
    face.style.transform = faceTransform(face);
    face.classList.remove("is-hovered");
  }
  function clearHover() {
    if (state.hovered) resetFace(state.hovered);
    state.hovered = null;
  }

  function updateFaces() {
    faces.forEach((face) => {
      const a = (state.total + Number(face.dataset.baseAngle)) * Math.PI / 180;
      const front = Math.cos(a); // 1 = facing camera
      face.style.opacity = (0.3 + 0.7 * Math.max(0, front)).toFixed(3);
      face.style.zIndex = String(Math.round(60 + front * 40));
      const video = face.querySelector("video");
      if (!video) return;
      const shouldPlay = front > 0.42 && state.visible && !document.hidden && !env.saveData;
      if (shouldPlay && !face._playing) {
        face._playing = true;
        prepare(video);
        if (video.readyState < 2) video.load();
        video.play().then(() => face.classList.add("is-video-ready")).catch(() => {});
      } else if (!shouldPlay && face._playing) {
        face._playing = false;
        video.pause();
      }
    });
  }
  function updateScrubber() {
    const wrapped = ((-state.total % 360) + 360) % 360;
    const index = Math.round(wrapped / step) % faceCount;
    const progress = faceCount > 1 ? Math.min(1, wrapped / ((faceCount - 1) * step)) : 0;
    scrub.set(progress, index);
  }
  function seekToProgress(progress) {
    const idx = Math.round(Math.max(0, Math.min(1, progress)) * (faceCount - 1));
    /* after minutes of idle auto-rotation state.rotation can have drifted to
       thousands of degrees — always seek along the SHORTEST angular path,
       never let it sweep multiple full laps (that read as a broken freeze) */
    const target = (-idx * step) - state.scrollRot;
    const shortest = (((target - state.rotation) % 360) + 540) % 360 - 180;
    state.seeking = true;
    state.seekFrom = state.rotation;
    state.seekTo = state.rotation + shortest;
    state.seekStart = performance.now();
    state.velocity = 0;
    cyl.classList.add("is-seeking");
  }

  function frame() {
    if (state.seeking) {
      const p = Math.min(1, (performance.now() - state.seekStart) / state.seekDuration);
      const eased = 1 - Math.pow(1 - p, 3);
      state.rotation = state.seekFrom + ((state.seekTo - state.seekFrom) * eased);
      if (p >= 1) {
        state.seeking = false;
        cyl.classList.remove("is-seeking");
        state.hovering = false;
        state.velocity = -AUTO_SPEED * 1.8;
        scrub.pulse();
      }
    } else if (!state.dragging) {
      state.rotation += state.velocity;
      state.velocity *= 0.94;
      if (Math.abs(state.velocity) < 0.02) {
        state.velocity = 0;
        if (!state.hovering) state.rotation += AUTO_SPEED;
      }
    }
    state.total = state.rotation + state.scrollRot;
    stage.style.transform = `rotateY(${state.total}deg)`;
    updateFaces();
    updateScrubber();
    state.raf = requestAnimationFrame(frame);
  }
  function start() { if (!state.raf && state.visible) frame(); }
  function stop() { cancelAnimationFrame(state.raf); state.raf = 0; }

  /* drag to spin */
  cyl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    state.dragging = true;
    state.seeking = false;
    cyl.classList.remove("is-seeking");
    state.moved = false;
    state.startX = state.lastX = event.clientX;
    state.velocity = 0;
    grabPointer(cyl, event.pointerId);
    cyl.classList.add("is-dragging");
  });
  cyl.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    state.lastX = event.clientX;
    /* a real drag moves tens of pixels; a click on a trackpad or mouse
       commonly jitters a few px between down/up — 6px was swallowing
       those as "drags" and silently blocking the open-video click */
    if (Math.abs(event.clientX - state.startX) > 14) state.moved = true;
    const delta = dx * 0.34;
    state.rotation += delta;
    state.velocity = delta;
  });
  const endDrag = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    freePointer(cyl, event.pointerId);
    cyl.classList.remove("is-dragging");
  };
  cyl.addEventListener("pointerup", endDrag);
  cyl.addEventListener("pointercancel", endDrag);

  scrub.track.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    clearHover();
    state.hovering = false;
    state.dragging = false;
    state.moved = false;
    grabPointer(scrub.track, event.pointerId);
    seekToProgress(pointerProgress(event, scrub.track));
    const move = (e) => seekToProgress(pointerProgress(e, scrub.track));
    const up = () => {
      freePointer(scrub.track, event.pointerId);
      clearHover();
      state.hovering = false;
      scrub.track.removeEventListener("pointermove", move);
      scrub.track.removeEventListener("pointerup", up);
      scrub.track.removeEventListener("pointercancel", up);
    };
    scrub.track.addEventListener("pointermove", move);
    scrub.track.addEventListener("pointerup", up);
    scrub.track.addEventListener("pointercancel", up);
  });

  /* swallow the click that ends a drag so it doesn't open the player */
  cyl.addEventListener("click", (event) => {
    if (state.moved) { event.preventDefault(); event.stopPropagation(); state.moved = false; }
  }, true);

  /* hover: pause the idle spin and pull the hovered face forward */
  cyl.addEventListener("pointerenter", () => { state.hovering = true; });
  cyl.addEventListener("pointerleave", () => { state.hovering = false; clearHover(); });
  faces.forEach((face) => {
    face.addEventListener("pointerenter", () => {
      if (state.seeking || state.dragging) return;
      clearHover();
      state.hovered = face;
      face.style.transform = faceTransform(face, 90, 1.05);
      face.classList.add("is-hovered");
    });
    face.addEventListener("pointerleave", () => {
      if (state.hovered === face) state.hovered = null;
      resetFace(face);
    });
  });

  /* keyboard nudge */
  cyl.setAttribute("tabindex", "0");
  cyl.setAttribute("role", "group");
  cyl.setAttribute("aria-label", "Vídeos em carrossel 3D — arraste para girar");
  cyl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") { state.seeking = false; state.velocity = -step * 0.5; }
    if (event.key === "ArrowLeft") { state.seeking = false; state.velocity = step * 0.5; }
  });

  /* visibility gating */
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      state.visible = entry.isIntersecting;
      if (state.visible) start(); else { stop(); faces.forEach((f) => { f._playing = false; f.querySelector("video")?.pause(); }); }
    });
  }, { threshold: 0.05 }).observe(cyl);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 160);
  }, { passive: true });

  /* scrolling the section gives the cylinder a gentle spin */
  if (env.gsap && env.ScrollTrigger) {
    const section = cyl.closest(".lab") || cyl;
    env.ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => { state.scrollRot = self.progress * 320; }
    });
  }

  layout();
  state.rotation = 0;
  start();
}
