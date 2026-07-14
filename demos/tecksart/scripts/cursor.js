/* ================================================================
 TECKSART V4 — Premium Cursor
 ================================================================ */

const CustomCursor = (() => {
 let dot, ring, mouseX = -200, mouseY = -200, ringX = -200, ringY = -200;

 function init() {
 if (window.matchMedia('(pointer: coarse)').matches) return;

 dot = document.querySelector('.cursor-dot');
 ring = document.querySelector('.cursor-ring');
 if (!dot ||!ring) return;

 document.addEventListener('mousemove', onMove);
 document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
 document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
 document.addEventListener('mousedown', () => { dot.classList.add('is-clicking'); ring.classList.add('is-clicking'); });
 document.addEventListener('mouseup', () => { dot.classList.remove('is-clicking'); ring.classList.remove('is-clicking'); });

 _bindHovers();
 _tick();
 }

 function onMove(e) {
 mouseX = e.clientX;
 mouseY = e.clientY;
 }

 function _bindHovers() {
 const selector = 'a, button, [role="button"],.product-card,.drop-card,.faq-question,.filter-btn, input, label';
 document.addEventListener('mouseover', e => {
 if (e.target.closest(selector)) {
 dot.classList.add('is-hovering');
 ring.classList.add('is-hovering');
 }
 });
 document.addEventListener('mouseout', e => {
 if (e.target.closest(selector)) {
 dot.classList.remove('is-hovering');
 ring.classList.remove('is-hovering');
 }
 });
 }

 function _tick() {
 if (dot) {
 dot.style.left = mouseX + 'px';
 dot.style.top = mouseY + 'px';
 }

 const lag = 0.10;
 ringX += (mouseX - ringX) * lag;
 ringY += (mouseY - ringY) * lag;

 if (ring) {
 ring.style.left = ringX + 'px';
 ring.style.top = ringY + 'px';
 }

 requestAnimationFrame(_tick);
 }

 return { init };
})();
