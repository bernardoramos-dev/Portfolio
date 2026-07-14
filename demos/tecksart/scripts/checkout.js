/* ================================================================
 TECKSART V4 - Checkout Experience
 ================================================================ */

const Checkout = (() => {
 let _step = 1;
 let _orderData = {};
 let _paymentMethod = 'pix';

 /* Open / Close */
 function open() {
 const overlay = document.getElementById('checkout-overlay');
 if (!overlay) return;
 overlay.classList.add('is-open');
 document.body.classList.add('no-scroll');
 _step = 1;
 _renderSidebar();
 _showStep(1);
 Analytics.track('checkout_open', { items: Cart.getItems().length });
 }

 function close() {
 const overlay = document.getElementById('checkout-overlay');
 if (!overlay) return;
 overlay.classList.remove('is-open');
 document.body.classList.remove('no-scroll');
 }

 function _showStep(n) {
 _step = n;
 document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('is-active'));
 const panel = document.querySelector(`[data-step="${n}"]`);
 if (panel) panel.classList.add('is-active');

 document.querySelectorAll('.checkout-step').forEach((s, i) => {
 s.classList.toggle('is-active', i + 1 === n);
 s.classList.toggle('is-done', i + 1 < n);
 });
 }

 /* Render Order Sidebar */
 function _renderSidebar() {
 const itemsEl = document.querySelector('.order-items');
 const discount = Cart.getDiscount();

 if (itemsEl) {
 itemsEl.innerHTML = Cart.getItems().map(item => `
 <div class="order-item">
 <img class="order-item-img" src="${item.image}" alt="${item.name}" />
 <div>
 <p class="order-item-name">${item.name}</p>
 <p class="order-item-qty"> ${item.qty}</p>
 </div>
 <span class="order-item-price">${formatBRL(item.price * item.qty)}</span>
 </div>
 `).join('');
 }

 /* Totals */
 const subtotalEl = document.querySelector('.order-subtotal');
 const discountEl = document.querySelector('.order-discount-row');
 const totalEl = document.querySelector('.order-total');

 if (subtotalEl) subtotalEl.textContent = formatBRL(Cart.getTotal());
 if (totalEl) totalEl.textContent = formatBRL(Cart.getFinalTotal());
 if (discountEl) {
 if (discount > 0) {
 discountEl.style.display = 'flex';
 discountEl.querySelector('.order-line-value').textContent = `- ${formatBRL(discount)}`;
 } else {
 discountEl.style.display = 'none';
 }
 }
 }

 /* Step Navigation */
 function _initNavigation() {
 /* Step 1 2 */
 document.getElementById('checkout-to-payment')?.addEventListener('click', () => {
 if (!_validateStep1()) return;
 _collectStep1();
 _showStep(2);
 });

 /* Step 2 1 */
 document.getElementById('checkout-back-to-address')?.addEventListener('click', () => _showStep(1));

 /* Step 2 3 */
 document.getElementById('checkout-to-confirm')?.addEventListener('click', () => {
 _showStep(3);
 _renderConfirm();
 });

 /* Step 3 2 */
 document.getElementById('checkout-back-to-payment')?.addEventListener('click', () => _showStep(2));

 /* Confirm Place Order */
 document.getElementById('checkout-place-order')?.addEventListener('click', () => {
 _placeOrder();
 });

 /* Payment method selection */
 document.querySelectorAll('.payment-method').forEach(btn => {
 btn.addEventListener('click', () => {
 document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('is-selected'));
 btn.classList.add('is-selected');
 _paymentMethod = btn.dataset.method;
 _renderPaymentDetails();
 });
 });

 /* Close */
 document.getElementById('checkout-close')?.addEventListener('click', close);
 }

 /* Validate step 1 */
 function _validateStep1() {
 const required = ['checkout-name', 'checkout-email', 'checkout-phone', 'checkout-cep',
 'checkout-address', 'checkout-number', 'checkout-city', 'checkout-state'];
 let valid = true;
 required.forEach(id => {
 const el = document.getElementById(id);
 if (!el) return;
 if (!el.value.trim()) {
 el.classList.add('is-error');
 valid = false;
 } else {
 el.classList.remove('is-error');
 }
 });
 if (!valid) Toast.show('Preencha todos os campos', 'error');
 return valid;
 }

 function _collectStep1() {
 _orderData.customer = {
 name: document.getElementById('checkout-name')?.value,
 email: document.getElementById('checkout-email')?.value,
 phone: document.getElementById('checkout-phone')?.value,
 cep: document.getElementById('checkout-cep')?.value,
 address: document.getElementById('checkout-address')?.value,
 number: document.getElementById('checkout-number')?.value,
 complement: document.getElementById('checkout-complement')?.value,
 city: document.getElementById('checkout-city')?.value,
 state: document.getElementById('checkout-state')?.value,
 };
 }

 function _renderPaymentDetails() {
 const detailEl = document.getElementById('payment-detail');
 if (!detailEl) return;

 if (_paymentMethod === 'pix') {
 detailEl.innerHTML = `
 <div class="pix-panel">
 <p class="label" style="margin-bottom:0.5rem">Chave PIX gerada após confirmação</p>
 <div class="pix-qr">QR Code</div>
 <p style="font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--c-steel);text-align:center;max-width:300px;line-height:1.6">
 O QR code e a chave serão gerados após você confirmar o pedido. Você receberá por email.
 </p>
 </div>`;
 } else if (_paymentMethod === 'card') {
 detailEl.innerHTML = `
 <div class="checkout-form" style="max-width:420px">
 <div class="form-group">
 <label class="form-label">Nmero do carto</label>
 <input class="form-input" id="card-number" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric" />
 </div>
 <div class="form-row">
 <div class="form-group">
 <label class="form-label">Validade</label>
 <input class="form-input" id="card-expiry" placeholder="MM/AA" maxlength="5" inputmode="numeric" />
 </div>
 <div class="form-group">
 <label class="form-label">CVV</label>
 <input class="form-input" id="card-cvv" placeholder="123" maxlength="4" inputmode="numeric" />
 </div>
 </div>
 <div class="form-group">
 <label class="form-label">Nome no carto</label>
 <input class="form-input" id="card-name" placeholder="NOME SOBRENOME" />
 </div>
 <p class="form-error" style="color:var(--c-steel-dim)">Integrao com processador de pagamento em breve.</p>
 </div>`;
 /* Card masks */
 setTimeout(() => {
 document.getElementById('card-number')?.addEventListener('input', e => {
 let v = e.target.value.replace(/\D/g, '').slice(0, 16);
 e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
 });
 document.getElementById('card-expiry')?.addEventListener('input', e => {
 let v = e.target.value.replace(/\D/g, '').slice(0, 4);
 if (v.length > 2) v = `${v.slice(0,2)}/${v.slice(2)}`;
 e.target.value = v;
 });
 }, 0);
 } else if (_paymentMethod === 'whatsapp') {
 detailEl.innerHTML = `
 <div class="pix-panel">
 <p style="font-family:var(--font-secondary);color:var(--c-steel);text-align:center;max-width:320px;line-height:1.7">
 Confirme o pedido e entraremos em contato pelo WhatsApp para finalizar o pagamento.
 </p>
 </div>`;
 }
 }

 function _renderConfirm() {
 const el = document.getElementById('confirm-summary');
 if (!el) return;
 const c = _orderData.customer || {};
 el.innerHTML = `
 <div style="display:flex;flex-direction:column;gap:var(--sp-3)">
 <div class="spec-row"><span class="spec-key">Nome</span><span class="spec-value">${c.name || '-'}</span></div>
 <div class="spec-row"><span class="spec-key">Email</span><span class="spec-value">${c.email || '-'}</span></div>
 <div class="spec-row"><span class="spec-key">Telefone</span><span class="spec-value">${c.phone || '-'}</span></div>
 <div class="spec-row"><span class="spec-key">Endereo</span><span class="spec-value">${c.address || ''}, ${c.number || ''} - ${c.city || ''} / ${c.state || ''}</span></div>
 <div class="spec-row"><span class="spec-key">Pagamento</span><span class="spec-value">${_paymentMethod.toUpperCase()}</span></div>
 <div class="spec-row"><span class="spec-key">Total</span><span class="spec-value" style="font-size:var(--fs-lg);font-weight:700;color:var(--c-white)">${formatBRL(Cart.getFinalTotal())}</span></div>
 </div>`;
 }

 /* Place Order */
 async function _placeOrder() {
 const btn = document.getElementById('checkout-place-order');
 if (btn) { btn.textContent = 'Processando...'; btn.disabled = true; btn.classList.add('btn--loading'); }

 const order = {
 customer: _orderData.customer,
 user_id: (typeof UserAuth!== 'undefined' && UserAuth.isLoggedIn())? UserAuth.getUser()?.id: null,
 items: Cart.getItems(),
 total: Cart.getTotal(),
 discount: Cart.getDiscount(),
 finalTotal: Cart.getFinalTotal(),
 paymentMethod: _paymentMethod,
 status: 'pending',
 };

 try {
 const r = await fetch('/api/v4/orders', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(order)
 });
 const saved = await r.json();
 _showSuccess(saved.orderId || saved.id || saved.order?.id);
 } catch {
 /* Offline fallback */
 const id = `TA-${Date.now()}`;
 const offline = Store.get('ta_orders_offline', []);
 offline.push({...order, id, date: new Date().toISOString() });
 Store.set('ta_orders_offline', offline);
 _showSuccess(id);
 }

 Analytics.track('purchase', { total: Cart.getFinalTotal(), method: _paymentMethod });
 Cart.clear();
 }

 function _showSuccess(orderId) {
 document.querySelectorAll('.checkout-panel').forEach(p => p.classList.remove('is-active'));
 const success = document.getElementById('checkout-success');
 if (success) {
 success.classList.add('is-active');
 const idEl = success.querySelector('.success-order-id');
 if (idEl) idEl.textContent = `Pedido #${orderId}`;
 }
 _launchParticles();
 }

 function _launchParticles() {
 const symbols = ['+', '*', '?', '?', '?', ''];
 for (let i = 0; i < 18; i++) {
 const p = document.createElement('div');
 p.className = 'success-particle';
 p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
 p.style.cssText = `
 left: ${20 + Math.random() * 60}vw;
 top: ${60 + Math.random() * 20}vh;
 font-size: ${10 + Math.random() * 14}px;
 color: rgba(244,244,244,${0.2 + Math.random() * 0.5});
 --x: ${(Math.random() - 0.5) * 200}px;
 --r: ${(Math.random() - 0.5) * 360}deg;
 animation-delay: ${Math.random() * 0.5}s;
 animation-duration: ${1 + Math.random() * 1}s;
 `;
 document.body.appendChild(p);
 setTimeout(() => p.remove(), 2500);
 }
 }

 /* CEP lookup */
 async function _fillCEP(rawCep) {
 try {
 const r = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
 const d = await r.json();
 if (!d.erro) {
 const addrEl = document.getElementById('checkout-address');
 const cityEl = document.getElementById('checkout-city');
 const stateEl = document.getElementById('checkout-state');
 if (addrEl &&!addrEl.value) addrEl.value = d.logradouro || '';
 if (cityEl) cityEl.value = d.localidade || '';
 if (stateEl) stateEl.value = d.uf || '';
 }
 } catch {}
 }

 /* Input Masks */
 function _initMasks() {
 /* Phone: (XX) XXXXX-XXXX */
 document.getElementById('checkout-phone')?.addEventListener('input', e => {
 let v = e.target.value.replace(/\D/g, '').slice(0, 11);
 if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
 else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
 else if (v.length > 0) v = `(${v}`;
 e.target.value = v;
 });

 /* CEP: XXXXX-XXX + auto-fill on complete */
 document.getElementById('checkout-cep')?.addEventListener('input', e => {
 let v = e.target.value.replace(/\D/g, '').slice(0, 8);
 if (v.length > 5) v = `${v.slice(0,5)}-${v.slice(5)}`;
 e.target.value = v;
 if (v.replace(/\D/g, '').length === 8) _fillCEP(v.replace(/\D/g, ''));
 });
 }

 /* Init */
 function init() {
 _initNavigation();
 _initMasks();
 _renderPaymentDetails();
 /* Pre-fill form with saved user data if logged in */
 if (typeof UserAuth!== 'undefined' && UserAuth.isLoggedIn()) {
 UserAuth.prefillCheckout();
 }
 }

 return { open, close, init };
})();
