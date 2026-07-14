/* ============================================================
   components/footer.js — giant wordmark fitted with getBBox,
   refit after fonts load and on debounced resize.
   ============================================================ */
export function initFooter() {
  const svg = document.getElementById("footer-wordmark-svg");
  const text = document.getElementById("footer-wordmark-text");
  if (!svg || !text) return;

  function fit() {
    try {
      const bounds = text.getBBox();
      if (bounds.width > 0) {
        svg.setAttribute("viewBox", [bounds.x, bounds.y, bounds.width, bounds.height].join(" "));
      }
    } catch { /* detached svg — ignore */ }
  }

  if (document.fonts?.ready) document.fonts.ready.then(fit);
  fit();

  let timer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(fit, 180);
  }, { passive: true });

  const year = document.getElementById("footer-year");
  if (year) year.textContent = String(new Date().getFullYear());
}
