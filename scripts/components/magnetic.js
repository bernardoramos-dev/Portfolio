/* ============================================================
   components/magnetic.js — subtle magnetic pull on key CTAs
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

export function attachMagnetic(element, { strength = 0.16, max = 12 } = {}) {
  if (env.touch || env.reduce || !env.gsap) return () => {};

  const xTo = env.gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
  const yTo = env.gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });

  function move(event) {
    const rect = element.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    xTo(env.gsap.utils.clamp(-max, max, dx * strength));
    yTo(env.gsap.utils.clamp(-max, max, dy * strength));
  }
  function reset() { xTo(0); yTo(0); }

  element.addEventListener("pointermove", move);
  element.addEventListener("pointerleave", reset);
  return () => {
    element.removeEventListener("pointermove", move);
    element.removeEventListener("pointerleave", reset);
  };
}

export function initMagnetic() {
  document.querySelectorAll("[data-magnetic]").forEach((el) => attachMagnetic(el));
}
