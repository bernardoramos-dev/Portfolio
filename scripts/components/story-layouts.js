/* ============================================================
   components/story-layouts.js — bespoke opening compositions.
   Each project opens into a genuinely different layout: no two
   share the same skeleton. The viewer injects one of these into
   .viewer__story-inner and then wires the live preview + CTA.
   ============================================================ */

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[ch]));

/* live preview slot — a real, scaled, muted view of the actual demo
   (real animations + background assets), with the still as a poster fallback */
function preview(label = "Preview ao vivo") {
  return `
    <figure class="story-preview" data-anim>
      <div class="story-preview__viewport">
        <img class="story-preview__still" data-viewer-story-still alt="" aria-hidden="true">
        <iframe class="story-preview__frame" data-viewer-story-frame title="Prévia ao vivo" tabindex="-1" aria-hidden="true" scrolling="no" loading="lazy"></iframe>
      </div>
      <span class="story-preview__scan" aria-hidden="true"></span>
      <figcaption class="story-preview__label">${esc(label)}</figcaption>
      <span class="story-preview__tap" aria-hidden="true">Toque para abrir
        <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 13L13 2M5 2h8v8"/></svg>
      </span>
    </figure>`;
}

/* one CTA class, themed per layout in CSS */
function cta(label = "Testar projeto") {
  return `
    <button class="story-cta" type="button" data-viewer-start>
      <span class="story-cta__label">${esc(label)}</span>
      <span class="story-cta__arrow" aria-hidden="true">
        <svg viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 13L13 2M5 2h8v8"/></svg>
      </span>
    </button>`;
}

const pad2 = (n) => String(n).padStart(2, "0");
const rows = (arr, fn) => (arr || []).map(fn).join("");
const atmosphere = (p, tone) => p.atmosphere
  ? `<figure class="story-world story-world--${esc(tone)}" data-anim aria-hidden="true">
      <img src="${esc(p.atmosphere)}" alt="" loading="eager" decoding="async">
      <span></span>
    </figure>`
  : "";

/* ---------- 01 · TradeFlow — operations console ---------- */
function console_(p, s) {
  return `
  <div class="st-console">
    <div class="st-console__network" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    ${atmosphere(p, "console")}
    <header class="st-console__bar" data-anim>
      <span class="st-console__dot"></span>
      <span class="st-console__id">${esc(s.codename)}</span>
      <span class="st-console__status">${esc(s.status)}</span>
      <span class="st-console__idx">/${esc(p.index)}</span>
    </header>
    <div class="st-console__grid">
      <div class="st-console__panel">
        <h2 class="st-console__name" data-anim>${esc(p.name)}</h2>
        <p class="st-console__desc" data-anim>${esc(p.shortDescription)}</p>
        <ul class="st-console__log" data-anim>
          ${rows(s.log, ([t, m, tag]) => `<li><span class="t">${esc(t)}</span><span class="m">${esc(m)}</span><span class="s">${esc(tag)}</span></li>`)}
        </ul>
        <dl class="st-console__metrics" data-anim>
          ${rows(s.metrics, ([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)}
        </dl>
        <div class="st-console__cta" data-anim>${cta(s.action || "Entrar no sistema")}</div>
      </div>
      <div class="st-console__monitor" data-anim>${preview(s.previewLabel || "Console ao vivo")}</div>
    </div>
  </div>`;
}

/* ---------- 02 · Mainstage — gig poster ---------- */
function poster(p, s) {
  return `
  <div class="st-poster">
    <div class="st-poster__lights" aria-hidden="true"><i></i><i></i><i></i></div>
    ${atmosphere(p, "poster")}
    <div class="st-poster__copy">
      <div class="st-poster__top" data-anim>
        <span>${esc(s.presenter)}</span>
        <span class="st-poster__venue">${esc(s.venue)}</span>
      </div>
      <h2 class="st-poster__name" data-anim>${esc(s.headliner || p.name)}</h2>
      <ul class="st-poster__lineup" data-anim>
        ${rows(s.lineup, (l) => `<li>${esc(l)}</li>`)}
      </ul>
      <div class="st-poster__foot" data-anim>
        <span class="st-poster__date">${esc(s.date)}</span>
        ${cta(s.action || "Subir ao palco")}
      </div>
    </div>
    <div class="st-poster__stage" data-anim>${preview(s.previewLabel || "App + painel B2B")}</div>
  </div>`;
}

/* ---------- 03 · TecksArt — gallery placard ---------- */
function gallery(p, s) {
  return `
  <div class="st-gallery">
    <div class="st-gallery__ambient" aria-hidden="true"></div>
    ${atmosphere(p, "gallery")}
    <div class="st-gallery__wall" data-anim>
      <div class="st-gallery__frame">${preview(s.previewLabel || "Vitrine")}</div>
    </div>
    <div class="st-gallery__plaque" data-anim>
      <span class="st-gallery__idx">Nº /${esc(p.index)}</span>
      <h2 class="st-gallery__name">${esc(p.name)}</h2>
      <p class="st-gallery__piece">${esc(s.piece)}</p>
      <dl class="st-gallery__meta">
        ${rows(s.meta, ([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)}
      </dl>
      <p class="st-gallery__note">${esc(s.plaque)}</p>
      ${cta(s.action || "Entrar na galeria")}
    </div>
  </div>`;
}

/* ---------- 04 · Vant — technical blueprint ---------- */
function blueprint(p, s) {
  return `
  <div class="st-blueprint">
    <div class="st-blueprint__map" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    ${atmosphere(p, "blueprint")}
    <header class="st-blueprint__head" data-anim>
      <span class="st-blueprint__code">${esc(p.name)}</span>
      <span class="st-blueprint__ver">${esc(s.version)}</span>
    </header>
    <div class="st-blueprint__grid">
      <div class="st-blueprint__col">
        <p class="st-blueprint__desc" data-anim>${esc(p.shortDescription)}</p>
        <table class="st-blueprint__specs" data-anim>
          <tbody>
            ${rows(s.specs, ([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)}
          </tbody>
        </table>
        <p class="st-blueprint__note" data-anim>${esc(s.note)}</p>
        <div data-anim>${cta(s.action || "Compilar demo")}</div>
      </div>
      <div class="st-blueprint__render" data-anim>
        <span class="reg reg--tl"></span><span class="reg reg--tr"></span>
        <span class="reg reg--bl"></span><span class="reg reg--br"></span>
        ${preview(s.previewLabel || "Render ao vivo")}
      </div>
    </div>
  </div>`;
}

/* ---------- 06 · Conutric — deep-green editorial cover (preview LEFT) ---------- */
function editorial(p, s) {
  return `
  <div class="st-editorial">
    <div class="st-editorial__seal" aria-hidden="true">BR</div>
    ${atmosphere(p, "editorial")}
    <header class="st-editorial__masthead" data-anim>
      <span class="st-editorial__title">${esc(s.masthead || p.name)}</span>
      <span class="st-editorial__rule" aria-hidden="true"></span>
      <span class="st-editorial__issue">${esc(s.issue)}</span>
    </header>
    <div class="st-editorial__body">
      <figure class="st-editorial__plate" data-anim>
        <span class="st-editorial__folio" aria-hidden="true">${esc(p.index)}</span>
        ${preview(s.caption || "Sistema de marca")}
      </figure>
      <div class="st-editorial__lead">
        <p class="st-editorial__kicker" data-anim>${esc(p.type)}</p>
        <h2 class="st-editorial__headline" data-anim>${esc(s.headline)}</h2>
        <ol class="st-editorial__index" data-anim>
          ${rows(s.index, (it, i) => `<li><span>${pad2(i + 1)}</span><em>${esc(it)}</em></li>`)}
        </ol>
        <div class="st-editorial__cta" data-anim>${cta(s.action || "Abrir o caderno")}</div>
      </div>
    </div>
    <footer class="st-editorial__colophon" data-anim>
      <span>${esc(s.caption || "Caderno de marca")}</span>
      <span>Identidade · Narrativa · Presença</span>
      <span>Rio de Janeiro · BR</span>
    </footer>
  </div>`;
}

/* ---------- 07 · Prisma Viral — living design-system console ---------- */
function system(p, s) {
  return `
  <div class="st-system">
    <div class="st-system__aura" aria-hidden="true"></div>
    <div class="st-system__prism" aria-hidden="true"></div>
    ${atmosphere(p, "system")}
    <div class="st-system__head" data-anim>
      <div class="st-system__title">
        <span class="st-system__badge"><i></i> Sistema vivo</span>
        <h2 class="st-system__name">${esc(p.name)}</h2>
        <span class="st-system__sub">${esc(s.subtitle)}</span>
      </div>
      <div class="st-system__spectrum">
        ${rows(s.swatches, (c) => `<span class="sw" style="--sw:${esc(c)}"><b>${esc(c)}</b></span>`)}
      </div>
    </div>
    <div class="st-system__grid">
      <div class="st-system__tokens" data-anim>
        ${rows(s.tokens, ([k, v]) => `<div class="tok"><span class="tok__k">${esc(k)}</span><span class="tok__v">${esc(v)}</span></div>`)}
      </div>
      <div class="st-system__canvas" data-anim>${preview(s.previewLabel || "Gerador ao vivo")}</div>
    </div>
    <div class="st-system__foot" data-anim>
      <p>${esc(s.note)}</p>
      ${cta(s.action || "Gerar peça")}
    </div>
  </div>`;
}

/* ---------- 08 · Hulkinho — handmade hangtag ---------- */
function craft(p, s) {
  return `
  <div class="st-craft">
    <div class="st-craft__threads" aria-hidden="true"><i></i><i></i><i></i></div>
    ${atmosphere(p, "craft")}
    <div class="st-craft__tag" data-anim>
      <span class="st-craft__hole" aria-hidden="true"></span>
      <span class="st-craft__stamp">${esc(s.stamp)}</span>
      <h2 class="st-craft__name">${esc(p.name)}</h2>
      <p class="st-craft__sub">${esc(s.tagline)}</p>
      <dl class="st-craft__details">
        ${rows(s.details, ([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)}
      </dl>
      ${cta(s.action || "Ver a peça")}
    </div>
    <figure class="st-craft__photo" data-anim>${preview(s.previewLabel || "Feito à mão")}</figure>
  </div>`;
}

const RENDERERS = {
  console: console_,
  poster,
  gallery,
  blueprint,
  editorial,
  system,
  craft
};

/* entrance choreography — every layout enters differently */
export const STORY_ANIM = {
  console:   { from: { y: 26, x: 0, scale: 1, rotate: 0, filter: "blur(6px)" },  stagger: 0.05,  ease: "power3.out",   dur: 0.7 },
  poster:    { from: { y: 64, x: 0, scale: 1.08, rotate: 0, filter: "blur(0px)" }, stagger: 0.07, ease: "expo.out",     dur: 0.85 },
  gallery:   { from: { y: 0, x: 0, scale: 1.03, rotate: 0, filter: "blur(12px)" }, stagger: 0.09, ease: "power2.out",   dur: 0.95 },
  blueprint: { from: { y: 16, x: -18, scale: 1, rotate: 0, filter: "blur(4px)" },  stagger: 0.045, ease: "power3.out",  dur: 0.62 },
  editorial: { from: { y: 32, x: 0, scale: 1, rotate: 0, filter: "blur(6px)" },   stagger: 0.08,  ease: "expo.out",     dur: 0.8 },
  system:    { from: { y: 24, x: 0, scale: 1.04, rotate: 0, filter: "blur(9px)" }, stagger: 0.055, ease: "power3.out",  dur: 0.72 },
  craft:     { from: { y: 36, x: 0, scale: 1, rotate: -1.4, filter: "blur(5px)" }, stagger: 0.06,  ease: "back.out(1.5)", dur: 0.78 }
};

/* map a project → its layout id (explicit story.layout wins) */
const FALLBACK_LAYOUT = {
  tradeflow: "console",
  mainstage: "poster",
  tecksart: "gallery",
  vant: "blueprint",
  conutric: "editorial",
  prisma: "system",
  hulk: "craft"
};

export function layoutOf(project) {
  return project.story?.layout || FALLBACK_LAYOUT[project.id] || "console";
}

export function renderStory(project) {
  const layout = layoutOf(project);
  const fn = RENDERERS[layout] || console_;
  return { layout, html: fn(project, project.story || {}) };
}
