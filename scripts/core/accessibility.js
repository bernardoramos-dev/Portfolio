/* ============================================================
   core/accessibility.js — focus trap, inert helpers, reveals
   ============================================================ */

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function trapFocus(container) {
  function onKeydown(event) {
    if (event.key !== "Tab") return;
    const items = [...container.querySelectorAll(FOCUSABLE)]
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
  container.addEventListener("keydown", onKeydown);
  return () => container.removeEventListener("keydown", onKeydown);
}

export function setBackgroundInert(inert, except) {
  ["main", ".site-header", ".site-footer"].forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (except && (el === except || el.contains(except))) return;
      if (inert) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
  });
}

/* IO-driven reveals: [data-reveal], .line-mask groups, .media-reveal */
export function initReveals() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        if (entry.target.hasAttribute("data-split")) {
          entry.target.querySelectorAll(".line-mask").forEach((m) => m.classList.add("in"));
        }
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
  );

  document
    .querySelectorAll("[data-reveal], [data-split]:not(.hero__name), .media-reveal")
    .forEach((el) => io.observe(el));
}
