/* ============================================================
   core/asset-guard.js — light, honest deterrent against casual
   image lifting from the case-study covers/previews.
   Scope is intentionally narrow: only the portfolio's own cover/
   preview images lose right-click-save and drag-out. Text
   selection, page right-click elsewhere, and dev tools are left
   completely alone — this must never cost usability to add a
   speed bump. Real protection is the CDN hotlink header
   (Cross-Origin-Resource-Policy in _headers/vercel.json), which
   stops OTHER SITES embedding these files; this script only
   raises friction for a casual "save image as" in-browser.
   ============================================================ */
const GUARDED_SELECTOR = [
  ".rail-card__media img",
  ".work-panel__cover",
  ".viewer__poster",
  ".story-preview__still",
  ".shelf-cinema img"
].join(", ");

export function initAssetGuard() {
  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest(GUARDED_SELECTOR)) event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    if (event.target.closest(GUARDED_SELECTOR)) event.preventDefault();
  });
}
