/* ============================================================
   scenes/hero-background.js — cinematic treatment of the real
   abstract video: blur-resolve entrance, pointer drift,
   visibility-aware playback. Static poster is the fallback.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

export function initHeroBackground() {
  const wrap = document.querySelector(".hero__media");
  const video = wrap?.querySelector("video");
  if (!wrap) return;
  let ambientTween = null;

  /* playback gating */
  if (video) {
    if (env.reduce || env.saveData) {
      video.removeAttribute("autoplay");
      video.pause();
    } else {
      const play = () => video.play().catch(() => {});
      if (video.readyState >= 2) play();
      else video.addEventListener("canplay", play, { once: true });

      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) play();
          else video.pause();
        });
      }, { threshold: 0.04 }).observe(wrap);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) video.pause();
        else if (wrap.getBoundingClientRect().bottom > 0) play();
      });
    }
  }

  /* subtle cinematic drift (fine pointers, motion allowed) */
  if (!env.touch && !env.reduce && env.gsap) {
    const target = video || wrap.querySelector("img");
    if (!target) return;
    ambientTween = env.gsap.to(target, {
      scale: 1.07,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true
    });
    const startAmbient = () => ambientTween?.resume();
    if (document.documentElement.classList.contains("is-booted")) {
      window.setTimeout(startAmbient, 900);
    } else {
      const bootObserver = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("is-booted")) return;
        bootObserver.disconnect();
        window.setTimeout(startAmbient, 900);
      });
      bootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }
    const xTo = env.gsap.quickTo(target, "xPercent", { duration: 1.4, ease: "power2.out" });
    const yTo = env.gsap.quickTo(target, "yPercent", { duration: 1.4, ease: "power2.out" });
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      xTo(nx * -1.6);
      yTo(ny * -1.2);
    }, { passive: true });

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !document.hidden && document.documentElement.classList.contains("is-booted")) {
          ambientTween?.resume();
        }
        else ambientTween?.pause();
      });
    }, { threshold: 0.08 }).observe(wrap);
  }
}
