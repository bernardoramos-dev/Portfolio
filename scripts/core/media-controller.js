/* ============================================================
   core/media-controller.js — one observer governs every video:
   play in view, pause out of view, honor reduced-motion and
   Save-Data, never more than a few active at once.
   ============================================================ */
import { env } from "./smooth-scroll.js";

const observed = new Set();
let observer = null;

function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

function ensureObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.tagName === "VIDEO"
          ? entry.target
          : entry.target.querySelector("video");
        if (!video) return;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        if (video.readyState >= 2) entry.target.classList?.add("is-video-ready");
        if (entry.isIntersecting && entry.intersectionRatio > 0.12 && !env.reduce && !env.saveData && !document.hidden) {
          video.play()
            .then(() => entry.target.classList?.add("is-video-ready"))
            .catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: [0, 0.12, 0.45, 1] }
  );
  return observer;
}

export function watchMedia(el) {
  if (!el || observed.has(el)) return;
  if (el.matches?.("[data-preview-video]") || el.querySelector?.("[data-preview-video]")) return;
  if (el.closest?.("[data-lab-reel]")) return;
  observed.add(el);
  ensureObserver().observe(el);
}

export function initMediaController() {
  document.querySelectorAll("[data-media]").forEach(watchMedia);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      document.querySelectorAll("video").forEach((v) => {
        if (v.closest(".hero__media, [data-lab-reel]") || v.matches("[data-preview-video]")) return;
        v.pause();
      });
      return;
    }
    if (env.reduce || env.saveData) return;
    observed.forEach((el) => {
      if (!isInViewport(el)) return;
      const video = el.tagName === "VIDEO" ? el : el.querySelector("video");
      video?.play().catch(() => {});
    });
  });
}
