/* ============================================================
   components/project-chapters.js — pinned scroll storytelling
   for the featured chapters (desktop only) + catalog filters
   + process rail.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

export function initProjectChapters() {
  if (!env.gsap || !env.ScrollTrigger) return;
  const mm = env.gsap.matchMedia();

  mm.add("(min-width: 900px)", () => {
    const triggers = [];

    document.querySelectorAll("[data-chapter-pin]").forEach((chapter) => {
      const stage = chapter.querySelector("[data-chapter-stage]");
      const media = chapter.querySelector("[data-chapter-media]");
      const main = chapter.querySelector(".chapter__main");
      const mainImg = chapter.querySelector(".chapter__main img");
      const copyItems = chapter.querySelectorAll(".chapter__copy-main > *, .chapter__copy > :not(.chapter__copy-main)");
      const screens = chapter.querySelectorAll(".chapter__screen");
      const mark = chapter.querySelector(".chapter__mark");
      const labels = chapter.querySelectorAll(".chapter__stage-labels span");
      if (!main) return;

      const tl = env.gsap.timeline({
        scrollTrigger: {
          trigger: chapter,
          start: "top top",
          end: "+=155%",
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          toggleClass: { targets: chapter, className: "is-active" }
        }
      });

      tl.fromTo(stage,
        { autoAlpha: 0.78, yPercent: 4, rotateX: 4, rotateY: chapter.classList.contains("chapter--mainstage") ? -3 : 3 },
        { autoAlpha: 1, yPercent: 0, rotateX: 0, rotateY: 0, duration: 0.52, ease: "power2.out" },
        0
      )
      .fromTo(mark,
        { autoAlpha: 0, xPercent: 14, scale: 0.82 },
        { autoAlpha: 1, xPercent: 0, scale: 1, duration: 0.64, ease: "power2.out" },
        0.02
      )
      .fromTo(media || main,
        { scale: 0.93, yPercent: 3, rotateX: 5, transformOrigin: "50% 58%" },
        { scale: 1, yPercent: 0, rotateX: 0, duration: 0.72, ease: "power2.out" },
        0
      )
      .fromTo(main,
        { clipPath: "inset(6% 7% round 34px)", filter: "brightness(0.9) saturate(0.9)" },
        { clipPath: "inset(0% 0% round 24px)", filter: "brightness(1) saturate(1)", duration: 0.72, ease: "power2.out" },
        0
      )
      .fromTo(mainImg,
        { scale: 1.12, yPercent: -5 },
        { scale: 1, yPercent: 0, duration: 0.82, ease: "none" },
        0
      )
      .fromTo(screens,
        {
          autoAlpha: 0,
          yPercent: (i) => 34 + i * 12,
          xPercent: (i) => i % 2 ? 16 : -10,
          rotateZ: (i) => i % 2 ? -5 : 5,
          scale: 0.9
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          xPercent: 0,
          rotateZ: 0,
          scale: 1,
          stagger: 0.11,
          duration: 0.52,
          ease: "power3.out"
        },
        0.22
      )
      .fromTo(labels,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.34, ease: "power2.out" },
        0.32
      )
      .fromTo(copyItems,
        { y: 24, autoAlpha: 0.45, filter: "blur(2px)" },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", stagger: 0.045, duration: 0.48, ease: "power3.out" },
        0.12
      )
      .to({}, { duration: 0.28 })
      .to(media || main, { yPercent: -5, scale: 0.965, rotateX: -4, duration: 0.34, ease: "none" })
      .to(mainImg, { yPercent: 5, scale: 1.06, duration: 0.34, ease: "none" }, "<")
      .to(copyItems, { y: -22, autoAlpha: 0.24, stagger: 0.025, duration: 0.24, ease: "none" }, "<")
      .to(screens, { yPercent: -14, autoAlpha: 0.58, stagger: 0.035, duration: 0.24, ease: "none" }, "<");

      triggers.push(tl.scrollTrigger);
    });

    document.querySelectorAll("[data-chapter-grid]").forEach((grid) => {
      const cells = grid.querySelectorAll(".chapter__cell");
      const tween = env.gsap.fromTo(cells,
        { autoAlpha: 0, y: 56, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.82,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 76%",
            end: "bottom 62%",
            scrub: 0.65
          }
        }
      );
      triggers.push(tween.scrollTrigger);
    });

    /* hero media recede on scroll */
    const heroMedia = document.querySelector(".hero__media video, .hero__media img");
    if (heroMedia) {
      env.gsap.to(heroMedia, {
        yPercent: 10, scale: 1.12, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }
    const heroGrid = document.querySelector(".hero__grid");
    if (heroGrid) {
      env.gsap.to(heroGrid, {
        y: -46, opacity: 0.4, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "30% top", end: "bottom top", scrub: true }
      });
    }

    /* footer wordmark movement */
    const wordmark = document.querySelector(".footer__wordmark svg");
    if (wordmark) {
      env.gsap.fromTo(wordmark,
        { yPercent: 42, opacity: 0.35 },
        {
          yPercent: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: ".footer__wordmark",
            start: "top 96%",
            end: "top 60%",
            scrub: 0.6
          }
        }
      );
    }

    return () => triggers.forEach((t) => t && t.kill());
  });
}

/* ---------- catalog filters ---------- */
export function initCatalogFilters() {
  const buttons = document.querySelectorAll(".catalog__filter");
  const items = document.querySelectorAll(".catalog-item");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.filter;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      items.forEach((item) => {
        const show = key === "todos" || item.dataset.category === key;
        item.classList.toggle("is-filtered", !show);
      });
      if (env.gsap && !env.reduce) {
        env.gsap.fromTo(".catalog-item:not(.is-filtered)",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.05, ease: "power3.out", overwrite: true }
        );
      }
      env.ScrollTrigger?.refresh();
    });
  });
}

/* ---------- process rail ---------- */
export function initProcess() {
  const steps = [...document.querySelectorAll(".process-step")];
  const current = document.querySelector(".process__current");
  const track = document.querySelector(".process__track i");
  if (!steps.length || !current) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = steps.indexOf(entry.target);
        steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
        current.textContent = String(idx + 1).padStart(2, "0");
        if (track) {
          const p = (idx + 1) / steps.length;
          track.style.transform =
            matchMedia("(max-width: 899px)").matches ? `scaleX(${p})` : `scaleY(${p})`;
        }
      });
    },
    { rootMargin: "-38% 0px -52% 0px" }
  );
  steps.forEach((s) => io.observe(s));
}
