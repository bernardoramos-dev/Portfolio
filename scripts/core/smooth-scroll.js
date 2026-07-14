/* ============================================================
   core/smooth-scroll.js — Lenis + GSAP single ticker loop
   ============================================================ */
const motionSetting = new URLSearchParams(location.search).get("motion");
/* LOCKED PRODUCT DECISION — keep full motion ALWAYS. The premium 3D video
   cylinder (Lab) and the expanding project panels (Work) are core to the
   experience, so the OS "prefers-reduced-motion" flag is intentionally NOT
   honored here (honoring it collapsed both into flat fallbacks). Motion can
   still be dialed down explicitly per-visit with ?motion=reduce | off. */
const reduceMotion = motionSetting === "reduce" || motionSetting === "off";
document.documentElement.classList.toggle("reduce-motion", reduceMotion);
document.documentElement.classList.toggle("motion-rich", !reduceMotion);

export const env = {
  reduce: reduceMotion,
  touch: matchMedia("(hover: none)").matches || matchMedia("(pointer: coarse)").matches,
  saveData: !!(navigator.connection && navigator.connection.saveData),
  gsap: window.gsap || null,
  ScrollTrigger: window.ScrollTrigger || null,
  motion: window.Motion || null
};

let lenis = null;

export function initSmoothScroll() {
  const { gsap, ScrollTrigger } = env;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (env.reduce || env.touch || env.saveData || !window.Lenis || !gsap) return null;

  lenis = new window.Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 0.9
  });

  if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() { return lenis; }

export function scrollToTarget(target, offset = -20) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top, behavior: env.reduce ? "auto" : "smooth" });
  }
}

export function lockScroll(lock) {
  document.body.classList.toggle("is-locked", lock);
  if (!lenis) return;
  if (lock) lenis.stop(); else lenis.start();
}
