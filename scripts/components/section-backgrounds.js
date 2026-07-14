/* ============================================================
   components/section-backgrounds.js
   Cinematic background videos per section (vanilla equivalent of
   a reusable <SectionVideoBackground>). Each is decorative:
   lazy-mounted near the viewport, driven by a light GSAP scrub,
   dimmed by an overlay for legibility, paused off-screen, and
   skipped on phones / reduced-motion / save-data.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

/* phones get hero + footer only (data + decode budget) */
const allowSectionBg = () =>
  !env.reduce && !env.saveData && matchMedia("(min-width: 641px)").matches;
const isTablet = () => matchMedia("(max-width: 1024px)").matches;

const CONFIGS = [
  { mount: ".work-panels", src: "assets/video/projects-flow.mp4", opacity: 0.42, blend: "screen", brightness: 1.0, contrast: 1.15, motion: "x" },
  { mount: ".process",     src: "assets/video/process-grid.mp4",  opacity: 0.5, blend: "screen", brightness: 1.0, contrast: 1.2, motion: "y" },
  { mount: ".about",       src: "assets/video/about-signal.mp4",  opacity: 0.42, blend: "screen", brightness: 1.0, contrast: 1.05, motion: "soft" },
  { mount: ".lab",         src: "assets/video/lab-orbit.mp4",     opacity: 0.62, blend: "screen", brightness: 1.15, contrast: 1.2, motion: "orbit" }
];

function makeVideo(cfg) {
  const video = document.createElement("video");
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("loop", "");
  video.setAttribute("aria-hidden", "true");
  video.preload = "none";
  video.className = "section-bg__video";
  video.dataset.src = cfg.src;
  video.style.mixBlendMode = cfg.blend;
  video.style.filter = `brightness(${cfg.brightness}) contrast(${cfg.contrast})`;
  return video;
}

function mountSrc(video) {
  if (video.dataset.mounted) { video.play?.().catch(() => {}); return; }
  video.dataset.mounted = "1";
  video.src = video.dataset.src;
  video.load();
  video.play().catch(() => {});
}
function unmountSrc(video) {
  video.pause();
  if (isTablet() && video.dataset.mounted) {
    /* free memory on constrained devices */
    delete video.dataset.mounted;
    video.removeAttribute("src");
    video.load();
  }
}

function addMotion(host, video, motion) {
  if (!env.gsap || !env.ScrollTrigger) return;
  const g = env.gsap;
  const scrub = { trigger: host, start: "top bottom", end: "bottom top", scrub: true };
  if (motion === "x") g.fromTo(video, { xPercent: -3 }, { xPercent: 3, ease: "none", scrollTrigger: scrub });
  else if (motion === "y") g.fromTo(video, { yPercent: 8, scale: 1.03 }, { yPercent: -8, scale: 1.07, ease: "none", scrollTrigger: scrub });
  else if (motion === "soft") g.fromTo(video, { scale: 1.03 }, { scale: 1.06, ease: "none", scrollTrigger: scrub });
  else if (motion === "orbit") g.fromTo(video, { scale: 1.05, rotate: -0.8 }, { scale: 1.12, rotate: 0.9, ease: "none", scrollTrigger: scrub });
}

function initSection(cfg) {
  const host = document.querySelector(cfg.mount);
  if (!host) return;
  host.classList.add("has-section-bg");

  const bg = document.createElement("div");
  bg.className = "section-bg";
  bg.setAttribute("aria-hidden", "true");
  bg.style.setProperty("--bg-op", String(cfg.opacity));

  const video = makeVideo(cfg);
  const scrim = document.createElement("span");
  scrim.className = "section-bg__scrim";
  bg.append(video, scrim);
  host.prepend(bg);

  addMotion(host, video, cfg.motion);

  new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? mountSrc(video) : unmountSrc(video));
  }, { rootMargin: "40% 0px 40% 0px", threshold: 0.01 }).observe(host);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else if (video.dataset.mounted) video.play().catch(() => {});
  });
}

/* ---------- hero: Asset 5 as the "energy core" that wakes on scroll ---------- */
function initHeroEnergy() {
  const hero = document.querySelector(".hero");
  const media = hero?.querySelector(".hero__media");
  if (!hero || !media) return;

  let glow = hero.querySelector(".hero__glow");
  if (!glow) {
    glow = document.createElement("div");
    glow.className = "hero__glow";
    glow.setAttribute("aria-hidden", "true");
    media.after(glow);
  }

  if (!env.gsap || !env.ScrollTrigger || env.reduce) return;
  const g = env.gsap;
  g.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
    .fromTo(glow, { opacity: 0.1 }, { opacity: 0.52, ease: "none" }, 0)
    .fromTo(media, { filter: "brightness(0.74) contrast(1)" }, { filter: "brightness(1.08) contrast(1.16)", ease: "none" }, 0)
    .fromTo(media, { scale: 1 }, { scale: 1.06, ease: "none" }, 0);
}

export function initSectionBackgrounds() {
  initHeroEnergy();
  if (!allowSectionBg()) return;
  CONFIGS.forEach(initSection);
}
