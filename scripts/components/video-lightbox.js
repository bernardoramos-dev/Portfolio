/* ============================================================
   components/video-lightbox.js — premium fullscreen video player.
   Opens by zooming from the clicked tile (FLIP-style), custom
   controls (play/scrub/time/mute/fullscreen), closes back to the
   tile. Keyboard + focus friendly.
   ============================================================ */
import { env, lockScroll } from "../core/smooth-scroll.js";

const fmt = (t) => {
  if (!isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

export function initVideoLightbox() {
  let modal = document.querySelector(".vplayer");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "vplayer";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="vplayer__backdrop" data-vp-close></div>
      <div class="vplayer__stage" role="dialog" aria-modal="true" aria-label="Player de vídeo">
        <div class="vplayer__frame" data-vp-frame>
          <video class="vplayer__video" playsinline preload="auto"></video>
          <button class="vplayer__big" type="button" data-vp-toggle aria-label="Reproduzir ou pausar">
            <svg class="vplayer__ico-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg class="vplayer__ico-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
          </button>
          <div class="vplayer__bar">
            <button class="vplayer__ctrl" type="button" data-vp-toggle aria-label="Play/pause">
              <svg class="vplayer__ico-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <svg class="vplayer__ico-pause" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
            </button>
            <span class="vplayer__time" data-vp-cur>0:00</span>
            <div class="vplayer__track" data-vp-track><span class="vplayer__buffer"></span><i data-vp-prog></i><span class="vplayer__knob"></span></div>
            <span class="vplayer__time" data-vp-dur>0:00</span>
            <button class="vplayer__ctrl" type="button" data-vp-mute aria-label="Mudo">
              <svg class="vplayer__ico-vol" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z"/></svg>
              <svg class="vplayer__ico-mute" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>
            </button>
            <button class="vplayer__ctrl" type="button" data-vp-full aria-label="Tela cheia">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>
            </button>
          </div>
        </div>
        <button class="vplayer__close" type="button" data-vp-close aria-label="Fechar vídeo · Esc">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4l8 8M12 4l-8 8"/></svg>
        </button>
        <span class="vplayer__label" data-vp-label></span>
      </div>`;
    document.body.appendChild(modal);
  }

  const frame = modal.querySelector("[data-vp-frame]");
  const video = modal.querySelector(".vplayer__video");
  const track = modal.querySelector("[data-vp-track]");
  const prog = modal.querySelector("[data-vp-prog]");
  const curEl = modal.querySelector("[data-vp-cur]");
  const durEl = modal.querySelector("[data-vp-dur]");
  const labelEl = modal.querySelector("[data-vp-label]");
  let lastFocus = null;
  let sourceRect = null;

  const setPlaying = (p) => modal.classList.toggle("is-playing", p);
  const setMuted = (m) => modal.classList.toggle("is-muted", m);

  function zoom(fromRect, opening) {
    if (!env.gsap || env.reduce || !fromRect) return;
    const last = frame.getBoundingClientRect();
    if (last.width < 10) return;
    const dx = (fromRect.left + fromRect.width / 2) - (last.left + last.width / 2);
    const dy = (fromRect.top + fromRect.height / 2) - (last.top + last.height / 2);
    const sx = fromRect.width / last.width;
    const sy = fromRect.height / last.height;
    if (opening) {
      env.gsap.fromTo(frame,
        { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0.5 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.62, ease: "expo.out", clearProps: "all" });
    } else {
      return env.gsap.to(frame, { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0, duration: 0.42, ease: "power3.in" });
    }
  }

  function open(src, label, sourceEl, sound = false) {
    if (!src) return;
    lastFocus = document.activeElement;
    sourceRect = sourceEl?.getBoundingClientRect?.() || null;
    labelEl.textContent = label || "";
    video.src = src;
    video.currentTime = 0;
    video.volume = 1;
    video.muted = !sound;
    setMuted(video.muted);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    requestAnimationFrame(() => zoom(sourceRect, true));
    video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    modal.querySelector(".vplayer__close")?.focus();
  }

  function close() {
    if (!modal.classList.contains("is-open")) return;
    const done = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      video.pause();
      video.removeAttribute("src");
      video.load();
      setPlaying(false);
      lockScroll(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const tween = zoom(sourceRect, false);
    modal.classList.add("is-closing");
    if (tween && tween.then) tween.then(() => { modal.classList.remove("is-closing"); done(); });
    else { modal.classList.remove("is-closing"); done(); }
  }

  const toggle = () => {
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  /* controls */
  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-vp-close]")) { event.preventDefault(); close(); return; }
    if (event.target.closest("[data-vp-toggle]")) { toggle(); return; }
    if (event.target.closest("[data-vp-mute]")) { video.muted = !video.muted; setMuted(video.muted); return; }
    if (event.target.closest("[data-vp-full]")) {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else frame.requestFullscreen?.().catch(() => {});
      return;
    }
  });

  video.addEventListener("timeupdate", () => {
    const d = video.duration || 0;
    if (d) prog.style.transform = `scaleX(${video.currentTime / d})`;
    curEl.textContent = fmt(video.currentTime);
  });
  video.addEventListener("loadedmetadata", () => { durEl.textContent = fmt(video.duration); });
  video.addEventListener("ended", () => setPlaying(false));
  video.addEventListener("play", () => setPlaying(true));
  video.addEventListener("pause", () => setPlaying(false));

  /* scrub (click + drag) */
  const seekTo = (clientX) => {
    const r = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    if (video.duration) video.currentTime = ratio * video.duration;
    prog.style.transform = `scaleX(${ratio})`;
  };
  let scrubbing = false;
  track.addEventListener("pointerdown", (e) => { scrubbing = true; track.setPointerCapture?.(e.pointerId); seekTo(e.clientX); });
  track.addEventListener("pointermove", (e) => { if (scrubbing) seekTo(e.clientX); });
  track.addEventListener("pointerup", (e) => { scrubbing = false; track.releasePointerCapture?.(e.pointerId); });

  /* delegated open triggers */
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-video-open]");
    if (!trigger || modal.contains(trigger)) return;
    event.preventDefault();
    const src = trigger.dataset.videoOpen || trigger.querySelector("video")?.currentSrc;
    const label = trigger.querySelector(".lab-item__name")?.textContent || trigger.getAttribute("aria-label") || "";
    open(src, label, trigger, trigger.dataset.videoSound === "true");
  });

  document.addEventListener("keydown", (event) => {
    const openTrigger = event.target.closest?.("[data-video-open]");
    if (openTrigger && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      const src = openTrigger.dataset.videoOpen || openTrigger.querySelector("video")?.currentSrc;
      open(src, openTrigger.querySelector(".lab-item__name")?.textContent || "", openTrigger, openTrigger.dataset.videoSound === "true");
      return;
    }
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    else if (event.key === " " || event.key === "k") { event.preventDefault(); toggle(); }
    else if (event.key === "ArrowRight") video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
    else if (event.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 5);
    else if (event.key === "m") { video.muted = !video.muted; setMuted(video.muted); }
    else if (event.key === "f") { document.fullscreenElement ? document.exitFullscreen?.() : frame.requestFullscreen?.().catch(() => {}); }
  });
}
