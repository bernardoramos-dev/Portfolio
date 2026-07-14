import { env } from "./smooth-scroll.js";

export function initDiagnostics() {
  const params = new URLSearchParams(location.search);
  const enabled = params.get("diagnostics") === "1" || params.get("debug") === "1";
  if (!enabled) return null;
  document.documentElement.dataset.diagnostics = "on";

  const startedAt = performance.now();
  const state = {
    startedAt: new Date().toISOString(),
    motion: {
      reduce: env.reduce,
      touch: env.touch,
      saveData: env.saveData,
      gsap: Boolean(env.gsap),
      scrollTrigger: Boolean(env.ScrollTrigger),
      motionDev: Boolean(env.motion)
    },
    errors: [],
    resources: [],
    viewer: []
  };

  const recordError = (kind, message, source = "") => {
    state.errors.push({ kind, message: String(message || "Unknown error"), source, at: performance.now() - startedAt });
  };

  window.addEventListener("error", (event) => {
    const target = event.target;
    if (target && target !== window && target.tagName) {
      const source = target.currentSrc || target.src || target.href || "";
      state.resources.push({ tag: target.tagName, source, at: performance.now() - startedAt });
      return;
    }
    recordError("error", event.message, event.filename);
  }, true);

  window.addEventListener("unhandledrejection", (event) => {
    recordError("unhandledrejection", event.reason?.message || event.reason);
  });

  document.addEventListener("portfolio:viewer", (event) => {
    state.viewer.push({ ...event.detail, at: performance.now() - startedAt });
  });

  window.__PORTFOLIO_DIAGNOSTICS__ = state;
  console.info("[portfolio] diagnostics enabled", state.motion);
  return state;
}
