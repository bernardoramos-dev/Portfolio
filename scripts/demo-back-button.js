/* ============================================================
   demo-back-button.js — floating "Voltar ao portfólio" pill,
   injected into every standalone demo page.

   These demos are opened from the main portfolio in a NEW TAB.
   "Voltar" here must never dump the visitor onto some dead page
   or an unrelated site: it should retrace the demo's own internal
   navigation first, then return to the portfolio tab that opened
   it (by closing this tab) and only fall back to navigating this
   same tab to the portfolio home if the tab can't be closed.
   ============================================================ */
(function () {
  function goBackToPortfolio(event) {
    if (event) event.preventDefault();

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.close();

    window.setTimeout(function () {
      if (!window.closed) window.location.href = "/";
    }, 200);
  }

  function mount() {
    var pill = document.createElement("a");
    pill.href = "/";
    pill.id = "portfolio-back-pill";
    pill.setAttribute("aria-label", "Voltar ao portfólio de Bernardo Ramos");
    pill.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 3L4.5 8L10 13"/></svg>' +
      "<span>Portfólio</span>";

    var style = document.createElement("style");
    style.textContent =
      "#portfolio-back-pill{position:fixed;top:16px;left:16px;z-index:2147483000;" +
      "display:inline-flex;align-items:center;gap:7px;padding:9px 16px 9px 13px;" +
      "background:rgba(5,5,5,0.72);color:#f3f3ef;border:1px solid rgba(255,255,255,0.16);" +
      "border-radius:999px;font:500 13px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;" +
      "text-decoration:none;letter-spacing:0.01em;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);" +
      "box-shadow:0 4px 16px rgba(0,0,0,0.35);transition:background .18s ease,transform .18s ease;}" +
      "#portfolio-back-pill:hover{background:rgba(20,20,20,0.88);transform:translateY(-1px);}" +
      "#portfolio-back-pill svg{flex:none;}" +
      "@media (max-width:640px){#portfolio-back-pill{top:auto;bottom:16px;left:16px;}}";

    document.head.appendChild(style);
    pill.addEventListener("click", goBackToPortfolio);
    document.body.appendChild(pill);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
