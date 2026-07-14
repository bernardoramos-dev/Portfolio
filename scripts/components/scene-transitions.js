/* ============================================================
   components/scene-transitions.js
   Cinematic page rhythm: scene markers, scroll wipes and
   controlled section reveals. Keeps the page direct, not busy.
   ============================================================ */
import { env } from "../core/smooth-scroll.js";

const SCENES = [
  { selector: ".hero", label: "Intro" },
  { selector: ".work-section", label: "Work" },
  { selector: ".process", label: "Method" },
  { selector: ".about", label: "About" },
  { selector: ".lab", label: "Lab" },
  { selector: ".site-footer", label: "Contact" }
];

function ensureHud() {
  let hud = document.querySelector(".scene-hud");
  if (hud) return hud;
  hud = document.createElement("div");
  hud.className = "scene-hud";
  hud.setAttribute("aria-hidden", "true");
  hud.innerHTML = `
    <span class="scene-hud__index">01</span>
    <span class="scene-hud__track"><i></i></span>
    <span class="scene-hud__label">Intro</span>`;
  document.body.appendChild(hud);
  return hud;
}

function sceneInner(scene) {
  return scene.matches(".hero")
    ? scene.querySelectorAll(".hero__name, .hero__intro, .hero__rail")
    : scene.querySelectorAll(".section-head, .work-reel, .process__layout, .about__layout, .lab__reel-wrap, .footer__panels, .footer__wordmark");
}

export function initSceneTransitions() {
  const scenes = SCENES
    .map((item, index) => ({ ...item, index, el: document.querySelector(item.selector) }))
    .filter((item) => item.el);
  if (!scenes.length) return;

  scenes.forEach((scene) => {
    scene.el.classList.add("scene-block");
    scene.el.style.setProperty("--scene-index", `"${String(scene.index + 1).padStart(2, "0")}"`);
    scene.el.dataset.sceneLabel = scene.label;
  });

  const hud = ensureHud();
  const hudIndex = hud.querySelector(".scene-hud__index");
  const hudLabel = hud.querySelector(".scene-hud__label");
  const hudTrack = hud.querySelector(".scene-hud__track i");

  function setActiveScene(scene, progress = 0.12) {
    scenes.forEach((item) => item.el.classList.toggle("is-scene-active", item === scene));
    hudIndex.textContent = String(scene.index + 1).padStart(2, "0");
    hudLabel.textContent = scene.label;
    hudTrack.style.transform = `scaleY(${Math.max(0.08, progress)})`;
  }

  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const scene = scenes.find((item) => item.el === visible.target);
    if (scene) setActiveScene(scene, visible.intersectionRatio);
  }, { threshold: [0.18, 0.32, 0.48, 0.64, 0.8], rootMargin: "-18% 0px -24% 0px" });
  scenes.forEach((scene) => io.observe(scene.el));

  if (!env.gsap || !env.ScrollTrigger || env.reduce) {
    if (scenes[0]) setActiveScene(scenes[0], 0.12);
    return;
  }

  scenes.forEach((scene) => {
    env.ScrollTrigger.create({
      trigger: scene.el,
      start: "top 56%",
      end: "bottom 44%",
      onToggle(self) {
        if (!self.isActive) return;
        setActiveScene(scene, self.progress);
        env.gsap.fromTo(hud, { autoAlpha: 0.2, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" });
      },
      onUpdate(self) {
        if (scene.el.classList.contains("is-scene-active")) {
          hudTrack.style.transform = `scaleY(${Math.max(0.08, self.progress)})`;
        }
      }
    });

    /* The footer is the contact + CTA + name — it must ALWAYS be
       visible. It sits after the pinned Work section, whose pin-spacer
       shifts scroll positions and left this reveal stuck hidden. */
    if (!scene.el.matches(".site-footer")) {
      env.gsap.fromTo(sceneInner(scene.el),
        { y: 80, autoAlpha: 0, filter: "blur(12px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.15,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: scene.el,
            start: "top 74%",
            once: true
          }
        }
      );
    }

    env.gsap.to(scene.el, {
      "--scene-wipe": 1,
      ease: "none",
      scrollTrigger: {
        trigger: scene.el,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}
