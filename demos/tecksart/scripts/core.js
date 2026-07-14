/* ================================================================
 TECKSART V4 - Core Utilities
 ================================================================ */

'use strict';

/* Toast */
const Toast = (() => {
 let el, timer;

 function _getEl() {
 if (!el) el = document.getElementById('site-toast');
 return el;
 }

 function show(msg, type = 'default', duration = 3000) {
 const t = _getEl();
 if (!t) return;
 clearTimeout(timer);
 t.textContent = msg;
 t.className = 'toast';
 if (type!== 'default') t.classList.add(`toast--${type}`);
 requestAnimationFrame(() => {
 requestAnimationFrame(() => t.classList.add('is-visible'));
 });
 timer = setTimeout(() => {
 t.classList.remove('is-visible');
 }, duration);
 }

 return { show };
})();

/* Expose globally for backwards compat */
function showToast(msg, type, dur) { Toast.show(msg, type, dur); }


/* Storage helpers */
const Store = {
 get(key, fallback = null) {
 try { const v = localStorage.getItem(key); return v? JSON.parse(v): fallback; }
 catch { return fallback; }
 },
 set(key, val) {
 try { localStorage.setItem(key, JSON.stringify(val)); }
 catch {}
 },
 remove(key) { try { localStorage.removeItem(key); } catch {} }
};


/* Format currency */
function formatBRL(val) {
 return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
}


/* Debounce */
function debounce(fn, ms) {
 let t;
 return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}


/* IntersectionObserver reveal */
const RevealObserver = (() => {
 const io = new IntersectionObserver(
 (entries) => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 entry.target.classList.add('is-visible');
 io.unobserve(entry.target);
 }
 });
 },
 { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
 );

 function observe(selector) {
 document.querySelectorAll(selector).forEach(el => io.observe(el));
 }

 return { observe };
})();


/* Analytics */
const Analytics = (() => {
 const SESSION_KEY = 'ta_session';

 function _session() {
 let s = Store.get(SESSION_KEY);
 if (!s) {
 s = { id: `s_${Date.now()}`, start: Date.now(), events: [] };
 Store.set(SESSION_KEY, s);
 }
 return s;
 }

 function track(event, data = {}) {
 const s = _session();
 s.events.push({ e: event, d: data, t: Date.now() });
 Store.set(SESSION_KEY, s);

 /* Also fire to server (best-effort) */
 fetch('/api/v4/analytics', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ session: s.id, event, data, ts: Date.now() })
 }).catch(() => {});
 }

 return { track };
})();


/* Admin Auth */
const AdminAuth = (() => {
 const KEY = 'ta_admin_token';

 function isLoggedIn() { return!!Store.get(KEY); }

 async function login(password) {
 try {
 const r = await fetch('/api/v4/auth/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ password })
 });
 const data = await r.json();
 if (data.success && data.token) {
 Store.set(KEY, data.token);
 return true;
 }
 return false;
 } catch {
 return false;
 }
 }

 function logout() {
 Store.remove(KEY);
 window.location.href = 'index.html';
 }

 function guard() {
 if (!isLoggedIn()) window.location.href = 'index.html';
 }

 return { isLoggedIn, login, logout, guard };
})();


/* Loading Screen */
const LoadingScreen = (() => {
 function init() {
 const screen = document.getElementById('loading-screen');
 if (!screen) return;

 const loadVid = document.getElementById('loading-video');
 const logoWrap = document.getElementById('loading-logo-wrap');
 const progress = document.getElementById('loading-progress');
 const fill = document.getElementById('loading-bar-fill');
 const pct = document.getElementById('loading-pct');
 const t0 = performance.now();
 let done = 0;
 const total = 2;

 /* Slow the particles video way down */
 if (loadVid) {
 loadVid.playbackRate = 0.3;
 loadVid.addEventListener('canplay', () => {
 loadVid.classList.add('is-ready');
 }, { once: true });
 /* Fallback: show video even if canplay fires late */
 setTimeout(() => loadVid.classList.add('is-ready'), 500);
 }

 /* Animate logo in after a short delay */
 setTimeout(() => {
 if (logoWrap) logoWrap.classList.add('is-visible');
 }, 300);

 /* Show progress bar */
 setTimeout(() => {
 if (progress) progress.classList.add('is-visible');
 }, 800);

 function setProgress(p) {
 if (fill) fill.style.transform = `scaleX(${p / 100})`;
 if (pct) pct.textContent = `${Math.round(p)}%`;
 }

 /* Smooth progress: animate to 80% over first 3s, wait for tasks */
 let fakeP = 0;
 const fakeTick = setInterval(() => {
 fakeP = Math.min(fakeP + (Math.random() * 3 + 1), 80);
 setProgress(fakeP);
 if (fakeP >= 80) clearInterval(fakeTick);
 }, 120);

 function advance() {
 done++;
 if (done >= total) {
 clearInterval(fakeTick);
 setProgress(100);
 /* Minimum 4.5s total display time */
 const elapsed = performance.now() - t0;
 const delay = elapsed < 4500? (4500 - elapsed): 600;
 setTimeout(hide, delay);
 }
 }

 setProgress(0);

 /* Task 1: products fetch */
 fetch('/api/v4/products').then(() => advance()).catch(() => advance());

 /* Task 2: hero video canplay */
 const heroVideo = document.querySelector('.hero-video');
 if (heroVideo && heroVideo.readyState < 3) {
 heroVideo.addEventListener('canplay', () => advance(), { once: true });
 setTimeout(() => { if (done < 2) advance(); }, 3000);
 } else {
 advance();
 }
 }

 function hide() {
 const screen = document.getElementById('loading-screen');
 const logoWrap = document.getElementById('loading-logo-wrap');
 const overlay = screen?.querySelector('.loading-video-overlay');
 if (!screen) return;

 /* 1. Logo exits, overlay darkens simultaneously */
 if (logoWrap) logoWrap.classList.add('is-exiting');
 if (overlay) overlay.classList.add('is-darkening');

 /* 2. Whole screen fades out 700ms later */
 setTimeout(() => {
 screen.classList.add('is-exiting');
 document.body.classList.remove('no-scroll');
 }, 700);

 /* 3. Remove from DOM after transition */
 setTimeout(() => {
 screen.classList.add('is-hidden');
 screen.remove();
 }, 2100);
 }

 return { init, hide };
})();


/* Header */
const Header = (() => {
 function init() {
 const header = document.querySelector('.site-header');
 const hamburger = document.querySelector('.header-hamburger');
 const mobileNav = document.querySelector('.mobile-nav');
 if (!header) return;

 window.addEventListener('scroll', () => {
 header.classList.toggle('is-scrolled', window.scrollY > 60);
 }, { passive: true });

 if (hamburger && mobileNav) {
 hamburger.addEventListener('click', () => {
 const open = hamburger.classList.toggle('is-open');
 mobileNav.classList.toggle('is-open', open);
 document.body.style.overflow = open? 'hidden': '';
 });
 mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
 hamburger.classList.remove('is-open');
 mobileNav.classList.remove('is-open');
 document.body.style.overflow = '';
 }));
 }
 }
 return { init };
})();


/* FAQ Accordion */
function initFAQ() {
 document.querySelectorAll('.faq-item').forEach(item => {
 const btn = item.querySelector('.faq-question');
 const answer = item.querySelector('.faq-answer');
 if (!btn ||!answer) return;

 btn.addEventListener('click', () => {
 const open = item.classList.contains('is-open');

 /* Close all */
 document.querySelectorAll('.faq-item.is-open').forEach(o => {
 o.classList.remove('is-open');
 const a = o.querySelector('.faq-answer');
 if (typeof gsap!== 'undefined') {
 gsap.to(a, { height: 0, duration: 0.35, ease: 'power2.inOut' });
 } else {
 a.style.height = '0';
 }
 });

 /* Open clicked */
 if (!open) {
 item.classList.add('is-open');
 if (typeof gsap!== 'undefined') {
 gsap.fromTo(answer,
 { height: 0 },
 { height: 'auto', duration: 0.4, ease: 'power2.out' }
 );
 } else {
 const inner = answer.querySelector('.faq-answer-inner');
 answer.style.height = inner.offsetHeight + 'px';
 }
 }
 });
 });
}


/* Newsletter */
function initNewsletter() {
 const form = document.querySelector('.newsletter-form');
 const input = document.querySelector('.newsletter-input');
 const btn = form?.querySelector('button');
 if (!form) return;

 form.addEventListener('submit', async e => {
 e.preventDefault();
 const email = input.value.trim().toLowerCase();
 if (!email ||!email.includes('@')) { Toast.show('Email inválido', 'error'); return; }

 const stored = Store.get('ta_nl', []);
 if (stored.includes(email)) { Toast.show('Você já está na lista!'); return; }

 if (btn) { btn.textContent = '...'; btn.disabled = true; }

 try {
 await fetch('/api/v4/subscribers', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email })
 });
 } catch {}

 stored.push(email);
 Store.set('ta_nl', stored);
 Analytics.track('newsletter_subscribe', { email });

 /* Show inline success message */
 form.style.opacity = '0';
 form.style.transition = 'opacity 0.3s';
 setTimeout(() => {
 form.style.display = 'none';
 const ok = document.createElement('p');
 ok.className = 'newsletter-success';
 ok.textContent = 'Você está na lista!';
 ok.style.cssText = 'font-family:var(--font-mono);font-size:var(--fs-sm);letter-spacing:var(--ls-wide);color:var(--c-white);text-align:center;padding:var(--sp-6) 0;opacity:0;transition:opacity 0.4s';
 form.parentElement.insertBefore(ok, form.nextSibling);
 requestAnimationFrame(() => { requestAnimationFrame(() => { ok.style.opacity = '1'; }); });
 setTimeout(() => {
 ok.style.opacity = '0';
 setTimeout(() => {
 ok.remove();
 input.value = '';
 if (btn) { btn.textContent = 'Inscrever'; btn.disabled = false; }
 form.style.display = '';
 form.style.opacity = '';
 }, 400);
 }, 5000);
 }, 300);
 });
}
