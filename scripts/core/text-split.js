/* ============================================================
   core/text-split.js — accessible line/word splitting.
   Original text is preserved via aria-label; visual spans are
   aria-hidden. No paid plugins.
   ============================================================ */
import { env } from "./smooth-scroll.js";

export function splitLines(element) {
  const original = element.textContent.trim().replace(/\s+/g, " ");
  element.setAttribute("aria-label", original);

  // First split into words so the browser can wrap them,
  // then group words by rendered line.
  element.textContent = "";
  const probe = document.createDocumentFragment();
  const words = original.split(" ").map((word) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.style.display = "inline-block";
    probe.appendChild(span);
    return span;
  });
  element.appendChild(probe);

  const lines = [];
  let currentTop = null;
  words.forEach((word) => {
    const top = word.offsetTop;
    if (top !== currentTop) { lines.push([]); currentTop = top; }
    lines[lines.length - 1].push(word.textContent);
  });

  element.textContent = "";
  const frag = document.createDocumentFragment();
  lines.forEach((lineWords, i) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    mask.setAttribute("aria-hidden", "true");
    const inner = document.createElement("span");
    inner.className = "line-inner";
    inner.textContent = lineWords.join("").trimEnd();
    inner.style.setProperty("--line-delay", `${i * 90}ms`);
    mask.appendChild(inner);
    frag.appendChild(mask);
  });
  element.appendChild(frag);
}

export function initTextSplit() {
  if (env.reduce) return;
  const targets = [...document.querySelectorAll("[data-split]")];
  targets.forEach(splitLines);

  let raf = 0;
  let lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (Math.abs(window.innerWidth - lastW) < 80) return;
      lastW = window.innerWidth;
      targets.forEach((el) => {
        const label = el.getAttribute("aria-label");
        if (!label) return;
        el.textContent = label;
        splitLines(el);
        el.querySelectorAll(".line-mask").forEach((m) => m.classList.add("in"));
      });
    });
  }, { passive: true });
}
