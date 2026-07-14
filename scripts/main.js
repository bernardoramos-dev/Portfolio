/* ============================================================
   BERNARDO RAMOS — PORTFÓLIO V3 · main.js (module entry)
   ============================================================ */
import { featured } from "./data/projects.js";
import { env, initSmoothScroll } from "./core/smooth-scroll.js";
import { initMediaController } from "./core/media-controller.js";
import { initAssetGuard } from "./core/asset-guard.js";
import { initDiagnostics } from "./core/diagnostics.js?v=20260711-3";
import { initTextSplit } from "./core/text-split.js";
import { initReveals } from "./core/accessibility.js";
import { initNavigation } from "./components/navigation.js";
import { initCursor } from "./components/cursor.js";
import { initMagnetic } from "./components/magnetic.js";
import { initProjectViewer } from "./components/project-viewer.js?v=20260711-3";
import { initProjectChapters, initCatalogFilters, initProcess } from "./components/project-chapters.js";
import { initLabReel } from "./components/lab-reel.js";
import { initFooter } from "./components/footer.js";
import { initVideoLightbox } from "./components/video-lightbox.js";
import { initSceneTransitions } from "./components/scene-transitions.js";
import { initHeroBackground } from "./scenes/hero-background.js";
import { initSectionBackgrounds } from "./components/section-backgrounds.js";
import { runLoader } from "./components/loader.js";
import { renderProjects, initProjectGallery, initPreviewVideos } from "./components/project-shelf.js";

document.documentElement.classList.add("js");
initDiagnostics();

renderProjects();
initSmoothScroll();
initTextSplit();
initNavigation();
initProjectGallery();
initPreviewVideos();
initHeroBackground();
initSectionBackgrounds();
initProjectViewer();
initCatalogFilters();
initProcess();
initLabReel();
initVideoLightbox();
initSceneTransitions();
initFooter();
initMediaController();
initAssetGuard();
initCursor();
initMagnetic();

document.addEventListener("pointermove", (event) => {
  if (env?.touch || env?.reduce) return;
  document.querySelectorAll(".glow-edge").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (
      event.clientX < rect.left - 80 || event.clientX > rect.right + 80 ||
      event.clientY < rect.top - 80 || event.clientY > rect.bottom + 80
    ) return;
    el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`);
  });
}, { passive: true });

runLoader({
  criticalImages: [
    ...featured.slice(0, 3).map((p) => p.cover)
  ],
  onReady() {
    initReveals();
    initProjectChapters();
    window.ScrollTrigger?.refresh();
  }
});

window.addEventListener("load", () => window.ScrollTrigger?.refresh());
