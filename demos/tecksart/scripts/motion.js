/* ================================================================
 TECKSART V4 - Motion System (GSAP + Lenis)
 ================================================================ */

/* Lenis Smooth Scroll */
let lenis;

function initLenis() {
 if (typeof Lenis === 'undefined') return;
 lenis = new Lenis({
 duration: 1.4,
 easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
 smoothWheel: true,
 wheelMultiplier: 0.9,
 touchMultiplier: 1.5,
 });

 function raf(time) {
 lenis.raf(time);
 if (typeof ScrollTrigger!== 'undefined') ScrollTrigger.update();
 requestAnimationFrame(raf);
 }
 requestAnimationFrame(raf);

 /* Connect GSAP ScrollTrigger to Lenis */
 if (typeof gsap!== 'undefined' && typeof ScrollTrigger!== 'undefined') {
 gsap.ticker.add(time => lenis.raf(time * 1000));
 gsap.ticker.lagSmoothing(0);
 }
}


/* Hero Entrance */
function heroEntrance() {
 if (typeof gsap === 'undefined') return;

 const tl = gsap.timeline({ delay: 0.3 });

 tl.fromTo('.hero-label',
 { opacity: 0, y: 14 },
 { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
 ).fromTo('.hero-headline',
 { opacity: 0, y: 40, filter: 'blur(12px)' },
 { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
 '-=0.4'
 ).fromTo('.hero-sub',
 { opacity: 0, y: 24 },
 { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
 '-=0.6'
 ).fromTo('.hero-actions',
 { opacity: 0, y: 20 },
 { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
 '-=0.5'
 ).fromTo('.hero-stats',
 { opacity: 0 },
 { opacity: 1, duration: 0.7 },
 '-=0.3'
 );
}


/* Scroll Animations */
function initScrollAnimations() {
 if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
 gsap.registerPlugin(ScrollTrigger);

 /* Reveal elements */
 document.querySelectorAll('.reveal').forEach(el => {
 gsap.fromTo(el,
 { opacity: 0, y: 30 },
 {
 opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
 scrollTrigger: { trigger: el, start: 'top 88%', once: true }
 }
 );
 });

 /* Stagger grids */
 document.querySelectorAll('.reveal-stagger').forEach(container => {
 const children = container.querySelectorAll(':scope > *');
 gsap.fromTo(children,
 { opacity: 0, y: 40 },
 {
 opacity: 1, y: 0,
 duration: 0.8, ease: 'power3.out',
 stagger: 0.12,
 scrollTrigger: { trigger: container, start: 'top 85%', once: true }
 }
 );
 });

 /* Manifesto word reveal */
 _initManifesto();

 /* Counters */
 _initCounters();

 /* Parallax */
 _initParallax();

 /* Horizontal process scroll */
 _initProcessScroll();
}


function _initManifesto() {
 const words = document.querySelectorAll('.manifesto-word');
 if (!words.length) return;

 ScrollTrigger.create({
 trigger: '.manifesto-section',
 start: 'top 75%',
 end: 'bottom 25%',
 onUpdate: self => {
 const lit = Math.floor(self.progress * words.length);
 words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
 }
 });
}


function _initCounters() {
 document.querySelectorAll('[data-count]').forEach(el => {
 const target = parseFloat(el.dataset.count);
 const suffix = el.dataset.suffix || '';
 /* Static zero - no animation */
 if (target === 0) {
 el.textContent = '0' + suffix;
 el.style.opacity = '0.5';
 return;
 }
 const obj = { v: 0 };
 gsap.to(obj, {
 v: target,
 duration: 2.5, ease: 'power2.out',
 onUpdate() { el.textContent = Math.round(obj.v) + suffix; },
 scrollTrigger: { trigger: el, start: 'top 85%', once: true }
 });
 });
}


function _initParallax() {
 document.querySelectorAll('[data-parallax]').forEach(el => {
 const speed = parseFloat(el.dataset.parallax) || 0.25;
 gsap.to(el, {
 yPercent: speed * 100,
 ease: 'none',
 scrollTrigger: {
 trigger: el.parentElement,
 start: 'top bottom',
 end: 'bottom top',
 scrub: true
 }
 });
 });
}


function _initProcessScroll() {
 const section = document.querySelector('.process-section');
 const sticky = document.querySelector('.process-sticky');
 const track = document.querySelector('.process-track');
 const panels = document.querySelectorAll('.process-panel');
 const dots = document.querySelectorAll('.process-dot');
 if (!section ||!track ||!panels.length) return;

 /* On mobile, disable horizontal scroll */
 if (window.innerWidth <= 768) {
 panels.forEach(p => p.classList.add('is-active'));
 return;
 }

 /* Split titles into per-letter spans */
 panels.forEach(panel => {
 const title = panel.querySelector('.process-step-title');
 if (!title || title.querySelector('.process-letter')) return;
 const text = title.textContent;
 title.innerHTML = text.split('').map((char, i) => {
 if (char === ' ') return '<span style="display:inline-block;width:0.3em"> </span>';
 return `<span class="process-letter" style="transition-delay:${i * 0.045}s">${char}</span>`;
 }).join('');
 });

 const totalW = panels.length * window.innerWidth;
 section.style.height = `${totalW}px`;

 /* Activate first panel immediately */
 panels[0]?.classList.add('is-active');

 function activatePanel(index) {
 panels.forEach((p, i) => p.classList.toggle('is-active', i === index));
 dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
 }

 gsap.to(track, {
 x: () => -(totalW - window.innerWidth),
 ease: 'none',
 scrollTrigger: {
 trigger: section,
 start: 'top top',
 end: () => `+=${totalW - window.innerWidth}`,
 scrub: 1.2,
 pin: sticky,
 anticipatePin: 1,
 invalidateOnRefresh: true,
 onUpdate(self) {
 const idx = Math.round(self.progress * (panels.length - 1));
 activatePanel(idx);
 }
 }
 });
}


/* Drop card video play on hover */
function initDropCards() {
 const io = 'IntersectionObserver' in window? new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 const video = entry.target.querySelector('.drop-card-video');
 if (!video) return;
 if (entry.isIntersecting) video.play().catch(() => {});
 else video.pause();
 });
 }, { threshold: 0.22 }): null;

 document.querySelectorAll('.drop-card').forEach(card => {
 const video = card.querySelector('.drop-card-video');
 if (!video) return;
 video.muted = true;
 video.defaultMuted = true;
 video.loop = true;
 video.playsInline = true;
 video.setAttribute('muted', '');
 video.setAttribute('playsinline', '');
 video.setAttribute('autoplay', '');
 video.setAttribute('preload', 'auto');
 video.load();
 card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
 card.addEventListener('focusin', () => { video.play().catch(() => {}); });
 io?.observe(card);
 if (!io) video.play().catch(() => {});
 });
}


/* Video load */
function initVideos() {
 document.querySelectorAll('.hero-video').forEach(video => {
 video.addEventListener('canplay', () => video.classList.add('is-loaded'), { once: true });
 if (video.readyState >= 3) video.classList.add('is-loaded');
 });
}
