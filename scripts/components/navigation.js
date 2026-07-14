/* ============================================================
   components/navigation.js — scroll-aware header, active
   section tracking, full-screen mobile menu
   ============================================================ */
import { scrollToTarget, lockScroll } from "../core/smooth-scroll.js";
import { trapFocus } from "../core/accessibility.js";

export function initNavigation() {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".site-menu");
  const menuButton = document.querySelector(".menu-button");
  if (!header) return;

  /* scroll behavior: morph into the floating glass capsule.
     Header stays visible the whole time so the capsule is always on. */
  let ticking = false;
  function onScroll() {
    ticking = false;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* anchor navigation */
  document.querySelectorAll("[data-goto]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      scrollToTarget(link.dataset.goto, -8);
    });
  });

  /* active section */
  const links = [...document.querySelectorAll(".site-nav__link[data-goto]")];
  const sectionIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((l) => {
          if (l.dataset.goto === id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-42% 0px -52% 0px" }
  );
  ["projetos", "processo", "sobre", "lab", "contato"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionIO.observe(el);
  });

  /* mobile menu */
  let releaseTrap = null;
  function openMenu() {
    if (!menu) return;
    menu.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    lockScroll(true);
    releaseTrap = trapFocus(menu);
    menu.querySelector("a, button")?.focus();
  }
  function closeMenu() {
    if (!menu || !menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    lockScroll(false);
    releaseTrap?.();
    releaseTrap = null;
    menuButton.focus();
  }
  menuButton?.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  return { closeMenu };
}
