/* ================================================================
 TECKSART V4 - Cart System
 ================================================================ */

const Cart = (() => {
 const CART_KEY = 'ta_cart_v4';
 let items = [];
 let _settings = {};

 /* State */
 function load() {
 items = Store.get(CART_KEY, []);
 _render();
 _updateCount();
 }

 function save() {
 Store.set(CART_KEY, items);
 }

 function add(product, qty = 1) {
 const existing = items.find(i => i.id === product.id);
 if (existing) {
 existing.qty += qty;
 } else {
 items.push({
 id: product.id,
 name: product.name,
 edition: product.edition || '',
 price: product.price,
 priceFormatted: product.priceFormatted,
 image: product.images?.[0] || '',
 qty
 });
 }
 save();
 _render();
 _updateCount();
 openDrawer();
 }

 function remove(id) {
 items = items.filter(i => i.id!== id);
 save();
 _render();
 _updateCount();
 }

 function updateQty(id, delta) {
 const item = items.find(i => i.id === id);
 if (!item) return;
 item.qty = Math.max(1, item.qty + delta);
 save();
 _render();
 _updateCount();
 }

 function clear() {
 items = [];
 save();
 _render();
 _updateCount();
 }

 function getItems() { return [...items]; }
 function getCount() { return items.reduce((s, i) => s + i.qty, 0); }
 function getTotal() { return items.reduce((s, i) => s + i.price * i.qty, 0); }
 function isEmpty() { return items.length === 0; }

 /* Coupon */
 let _coupon = null;

 async function applyCoupon(code) {
 try {
 const r = await fetch('/api/v4/coupons/validate', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ code, total: getTotal() })
 });
 const data = await r.json();
 if (data.valid) {
 _coupon = data.coupon;
 _render();
 return { ok: true, coupon: data.coupon };
 }
 return { ok: false, error: data.message || 'Cupom inválido' };
 } catch {
 return { ok: false, error: 'Erro ao validar cupom' };
 }
 }

 function getDiscount() {
 if (!_coupon) return 0;
 if (_coupon.type === 'percentage') return getTotal() * (_coupon.value / 100);
 if (_coupon.type === 'fixed') return Math.min(_coupon.value, getTotal());
 return 0;
 }

 function getFinalTotal() { return Math.max(0, getTotal() - getDiscount()); }

 /* Drawer */
 function openDrawer() {
 document.querySelector('.cart-overlay')?.classList.add('is-open');
 document.querySelector('.cart-drawer')?.classList.add('is-open');
 document.body.classList.add('no-scroll');
 Analytics.track('cart_open');
 }

 function closeDrawer() {
 document.querySelector('.cart-overlay')?.classList.remove('is-open');
 document.querySelector('.cart-drawer')?.classList.remove('is-open');
 document.body.classList.remove('no-scroll');
 }

 /* Render */
 function _render() {
 const itemsContainer = document.querySelector('.cart-items');
 const emptyEl = document.querySelector('.cart-empty');
 const footerEl = document.querySelector('.cart-footer');
 const subtotalEl = document.querySelector('.cart-subtotal-value');
 const shippingFill = document.querySelector('.cart-shipping-fill');
 const shippingLabel = document.querySelector('.cart-shipping-bar span');

 if (!itemsContainer) return;

 const free = _settings.freeShippingAbove || 500;
 const total = getTotal();

 if (isEmpty()) {
 itemsContainer.style.display = 'none';
 if (emptyEl) { emptyEl.style.display = 'flex'; }
 if (footerEl) { footerEl.style.display = 'none'; }
 } else {
 itemsContainer.style.display = 'block';
 if (emptyEl) { emptyEl.style.display = 'none'; }
 if (footerEl) { footerEl.style.display = 'flex'; }

 itemsContainer.innerHTML = items.map(item => `
 <div class="cart-item" data-item-id="${item.id}">
 <img class="cart-item-img" src="${item.image}" alt="${item.name}" />
 <div class="cart-item-info">
 <p class="cart-item-name">${item.name}</p>
 <p class="cart-item-edition">${item.edition}</p>
 <div class="cart-item-controls">
 <button class="qty-btn" data-qty="-1" data-id="${item.id}" aria-label="Diminuir"></button>
 <span class="qty-value">${item.qty}</span>
 <button class="qty-btn" data-qty="1" data-id="${item.id}" aria-label="Aumentar">+</button>
 </div>
 </div>
 <div class="cart-item-price">
 <span class="cart-item-price-val">${formatBRL(item.price * item.qty)}</span>
 <button class="cart-item-remove" data-remove="${item.id}" aria-label="Remover"></button>
 </div>
 </div>
 `).join('');

 /* Bind qty & remove */
 itemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
 btn.addEventListener('click', () => updateQty(btn.dataset.id, parseInt(btn.dataset.qty)));
 });
 itemsContainer.querySelectorAll('[data-remove]').forEach(btn => {
 btn.addEventListener('click', () => remove(btn.dataset.remove));
 });

 if (subtotalEl) subtotalEl.textContent = formatBRL(getFinalTotal());
 }

 /* Shipping bar */
 const pct = Math.min(1, total / free);
 if (shippingFill) shippingFill.style.width = `${pct * 100}%`;
 if (shippingLabel) {
 if (total >= free) {
 shippingLabel.textContent = 'Frete grátis!';
 } else {
 shippingLabel.textContent = `Faltam ${formatBRL(free - total)} para frete grátis`;
 }
 }
 }

 function _updateCount() {
 const count = getCount();
 document.querySelectorAll('.cart-count').forEach(badge => {
 if (count > 0) {
 badge.textContent = count;
 badge.style.display = 'flex';
 } else {
 badge.style.display = 'none';
 }
 });
 }

 /* Init */
 function init(settings = {}) {
 _settings = settings;
 load();

 /* Overlay click */
 document.querySelector('.cart-overlay')?.addEventListener('click', closeDrawer);

 /* Cart button */
 document.getElementById('cart-btn')?.addEventListener('click', openDrawer);
 document.querySelector('.cart-close')?.addEventListener('click', closeDrawer);

 /* Coupon */
 const couponInput = document.querySelector('.cart-coupon-input');
 const couponBtn = document.querySelector('.cart-coupon-apply');
 if (couponBtn && couponInput) {
 couponBtn.addEventListener('click', async () => {
 const code = couponInput.value.trim().toUpperCase();
 if (!code) { Toast.show('Insira um cupom', 'error'); return; }
 const result = await applyCoupon(code);
 if (result.ok) {
 Toast.show(`Cupom ${code} aplicado!`, 'success');
 couponInput.value = '';
 } else {
 Toast.show(result.error || 'Cupom inválido', 'error');
 }
 });
 }

 /* Checkout button */
 document.querySelector('.cart-checkout-btn')?.addEventListener('click', () => {
 if (isEmpty()) { Toast.show('Carrinho vazio'); return; }
 closeDrawer();
 Checkout.open();
 });
 }

 return {
 init, load, add, remove, updateQty, clear,
 getItems, getCount, getTotal, getFinalTotal, getDiscount, isEmpty,
 applyCoupon,
 openDrawer, closeDrawer
 };
})();
