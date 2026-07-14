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

  /* pure position indicator — not interactive. It used to double as a
     seek control, but tapping/dragging it to jump the cylinder was the
     source of most of the "carousel breaks" reports, so now it only
     ever reflects state, it never sets it. */
  function createScrubber(total) {
    const root = document.createElement("div");
    root.className = "lab-scrub";
    root.innerHTML = `
      <div class="lab-scrub__track" role="status" aria-label="Posição no carrossel de vídeos">
        <span class="lab-scrub__rail"><i><b></b></i></span>
        <span class="lab-scrub__readout">
          <em data-lab-current>01</em><span>/</span><em>${String(total).padStart(2, "0")}</em>
        </span>
      </div>`;
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
    pointerId: 0,
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
  function frame() {
    if (!state.dragging) {
      state.rotation += state.velocity;
      state.velocity *= 0.94;
      if (Math.abs(state.velocity) < 0.02) {
        state.velocity = 0;
        if (!state.hovering) state.rotation += AUTO_SPEED;
      }
    }
    /* keep the accumulator bounded so it never drifts into huge numbers
       over a long idle session (harmless for CSS, but tidy) */
    if (state.rotation > 100000 || state.rotation < -100000) {
      state.rotation = ((state.rotation % 360) + 360) % 360;
    }
    state.total = state.rotation + state.scrollRot;
    stage.style.transform = `rotateY(${state.total}deg)`;
    updateFaces();
    updateScrubber();
    state.raf = requestAnimationFrame(frame);
  }
  function start() { if (!state.raf && state.visible) frame(); }
  function stop() { cancelAnimationFrame(state.raf); state.raf = 0; }

  /* drag to spin — pointer capture is only grabbed once a real drag is
     confirmed (see pointermove below). Capturing on every pointerdown,
     including plain clicks, was interfering with the browser's normal
     click dispatch on these 3D-transformed faces on desktop (mouse) —
     touch happened to tolerate it, which is why this only broke clicks
     with a mouse, never with a finger. */
  cyl.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    state.dragging = true;
    state.moved = false;
    state.pointerId = event.pointerId;
    state.startX = state.lastX = event.clientX;
    state.velocity = 0;
  });
  cyl.addEventListener("pointermove", (event) => {
    if (!state.dragging) return;
    const dx = event.clientX - state.lastX;
    state.lastX = event.clientX;
    /* a real drag moves tens of pixels; a click on a trackpad or mouse
       commonly jitters a few px between down/up — grabbing capture only
       here, past the threshold, keeps plain clicks completely untouched */
    if (!state.moved && Math.abs(event.clientX - state.startX) > 10) {
      state.moved = true;
      grabPointer(cyl, state.pointerId);
      cyl.classList.add("is-dragging");
    }
    if (!state.moved) return;
    const delta = dx * 0.34;
    state.rotation += delta;
    state.velocity = delta;
  });
  const endDrag = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    if (state.moved) freePointer(cyl, event.pointerId);
    cyl.classList.remove("is-dragging");
  };
  cyl.addEventListener("pointerup", endDrag);
  cyl.addEventListener("pointercancel", endDrag);

  /* swallow the click that ends a drag so it doesn't open the player */
  cyl.addEventListener("click", (event) => {
    if (state.moved) { event.preventDefault(); event.stopPropagation(); state.moved = false; }
  }, true);

  /* hover: pause the idle spin and pull the hovered face forward */
  cyl.addEventListener("pointerenter", () => { state.hovering = true; });
  cyl.addEventListener("pointerleave", () => { state.hovering = false; clearHover(); });
  faces.forEach((face) => {
    face.addEventListener("pointerenter", () => {
      if (state.dragging) return;
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
    if (event.key === "ArrowRight") state.velocity = -step * 0.5;
    if (event.key === "ArrowLeft") state.velocity = step * 0.5;
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
