/* ============================================================
   components/cursor.js — minimal ring cursor with states:
   view / open / play / drag. Fine pointers only.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

const LABELS = { view: "Ver", open: "Abrir", play: "Play", drag: "Arrastar" };

export function initCursor() {
  if (env.touch || env.reduce || !env.gsap) return;
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const cursor = document.querySelector(".cursor");
  const label = cursor?.querySelector(".cursor__label");
  if (!cursor) return;

  const xTo = env.gsap.quickTo(cursor, "x", { duration: 0.32, ease: "power3.out" });
  const yTo = env.gsap.quickTo(cursor, "y", { duration: 0.32, ease: "power3.out" });

  let seen = false;
  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    xTo(event.clientX);
    yTo(event.clientY);
    if (!seen) { seen = true; document.body.classList.add("has-cursor"); }
  }, { passive: true });

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest("[data-cursor]");
    const state = target?.dataset.cursor || "";
    cursor.dataset.state = state;
    if (label && LABELS[state]) label.textContent = LABELS[state];
  });
  document.addEventListener("pointerout", (event) => {
    if (event.target.closest("[data-cursor]")) cursor.dataset.state = "";
  });
}
