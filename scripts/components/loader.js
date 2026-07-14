/* ============================================================
   components/loader.js — premium, honest, GRADUAL loader.
   The percentage is bounded by REAL readiness (critical images +
   web fonts + hero video), so it can never reach 100% before the
   first screen is actually ready to show. Skipped on repeat visits.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

const SESSION_KEY = "brv3-booted";
const MAX_WAIT = 14000;  // hard safety net so a stalled asset can't hang the page
const MIN_SHOW = 700;    // don't flash the loader away on very fast loads
const TASK_TIMEOUT = 4200;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}
function heroVideoReady() {
  const v = document.querySelector(".hero__media video");
  if (!v) return Promise.resolve();
  if (v.readyState >= 3) return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const ok = () => { if (settled) return; settled = true; resolve(); };
    v.addEventListener("canplay", ok, { once: true });
    v.addEventListener("loadeddata", ok, { once: true });
    v.addEventListener("error", ok, { once: true });
    setTimeout(ok, TASK_TIMEOUT); // hero video alone must not block the boot
  });
}
function fontsReady() {
  return (document.fonts?.ready || Promise.resolve()).catch(() => {});
}
function windowReady() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
}
function mediaReady(el) {
  if (!el) return Promise.resolve();
  if (el.tagName === "IMG") {
    const src = el.currentSrc || el.src;
    if (!src || el.complete) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => resolve();
      el.addEventListener("load", done, { once: true });
      el.addEventListener("error", done, { once: true });
      setTimeout(done, TASK_TIMEOUT);
    });
  }
  if (el.tagName === "VIDEO") {
    const src = el.currentSrc || el.src || el.querySelector("source")?.src;
    if (!src || el.readyState >= 1) return Promise.resolve();
    return new Promise((resolve) => {
      const done = () => resolve();
      el.addEventListener("loadedmetadata", done, { once: true });
      el.addEventListener("loadeddata", done, { once: true });
      el.addEventListener("error", done, { once: true });
      setTimeout(done, TASK_TIMEOUT);
    });
  }
  return Promise.resolve();
}
function pageMediaReadyTasks(criticalImages) {
  const seen = new Set();
  const tasks = [];
  const add = (src) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    tasks.push(preloadImage(src));
  };
  criticalImages.forEach(add);
  document.querySelectorAll("img").forEach((img) => {
    add(img.currentSrc || img.src);
    tasks.push(mediaReady(img));
  });
  document.querySelectorAll("video").forEach((video) => {
    tasks.push(mediaReady(video));
  });
  return tasks;
}

export function runLoader({ criticalImages = [], onReady }) {
  const loader = document.querySelector(".loader");
  const line = loader?.querySelector(".loader__line i");
  const pctEl = loader?.querySelector("[data-loader-pct]");
  const statusEl = loader?.querySelector("[data-loader-status]");
  const startT = performance.now();

  function heroEntrance() {
    document.documentElement.classList.add("is-booted");
    if (!env.gsap || env.reduce) return;
    const tl = env.gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.from(".site-header", { yPercent: -120, opacity: 0, duration: 1, clearProps: "all" })
      .fromTo(".hero__media video, .hero__media img",
        { scale: 1.12, filter: "brightness(0.3) blur(14px)" },
        { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.6, ease: "power2.out", clearProps: "transform,filter" },
        0.1)
      .fromTo("[data-hero-fade]",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, clearProps: "opacity,transform" },
        0.55)
      .fromTo(".hero .rail-card",
        { y: 64, scale: 0.94, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 1.05, stagger: 0.1, clearProps: "opacity,transform" },
        0.7);
  }

  let skip = false;
  try { skip = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* private mode */ }

  if (env.reduce || !loader || skip) {
    loader?.classList.add("is-done");
    document.documentElement.classList.add("is-booted");
    if (!env.reduce && env.gsap && skip) heroEntrance();
    onReady?.();
    return;
  }

  /* ---------- real readiness tasks ---------- */
  let realDone = 0;
  const bump = () => { realDone += 1; };
  const tasks = [];
  pageMediaReadyTasks(criticalImages).forEach((task) => tasks.push(task.then(bump)));
  tasks.push(fontsReady().then(bump));
  tasks.push(heroVideoReady().then(bump));
  tasks.push(windowReady().then(bump));
  const total = Math.max(1, tasks.length);

  /* ---------- smooth display that never exceeds real progress ---------- */
  let shown = 0;
  let raf = 0;
  function paint(v) {
    if (pctEl) pctEl.textContent = String(Math.round(v * 100));
    if (line) line.style.transform = `scaleX(${v})`;
  }
  function loop() {
    const realRatio = realDone / total;
    const ceiling = Math.min(realRatio, 0.99);  // never fake 100% before ready
    shown += (ceiling - shown) * 0.09;
    if (Math.abs(ceiling - shown) < 0.002) shown = ceiling;
    paint(shown);
    raf = requestAnimationFrame(loop);
  }
  loop();

  if (statusEl) {
    const labels = ["Carregando experiência", "Preparando visuais", "Compondo a cena", "Finalizando"];
    let li = 0;
    const iv = setInterval(() => {
      li = Math.min(labels.length - 1, li + 1);
      statusEl.textContent = labels[li];
    }, 850);
    Promise.race([Promise.all(tasks), new Promise((r) => setTimeout(r, MAX_WAIT))]).then(() => clearInterval(iv));
  }

  function finish() {
    cancelAnimationFrame(raf);
    const hold = Math.max(0, MIN_SHOW - (performance.now() - startT));
    setTimeout(() => {
      /* animate cleanly to a true 100% before revealing */
      const settle = env.gsap
        ? env.gsap.to({ v: shown }, { v: 1, duration: 0.4, ease: "power2.out", onUpdate() { paint(this.targets()[0].v); } })
        : (paint(1), null);
      void settle;
      setTimeout(() => {
        loader.classList.add("is-done");
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* private mode */ }
        setTimeout(heroEntrance, env.reduce ? 0 : 340);
        onReady?.();
      }, 420);
    }, hold);
  }

  Promise.race([Promise.all(tasks), new Promise((resolve) => setTimeout(resolve, MAX_WAIT))]).then(finish);
}
