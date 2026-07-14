/* ============================================================
 TecksArt - STATIC API SHIM
 Makes the demo fully publishable with no Python backend.
 Intercepts /api/v4/* calls and serves them from the bundled
 JSON files + localStorage. Read paths are real; write paths
 persist locally so cart, checkout and account stay usable.
 ============================================================ */
(function () {
 const SCRIPT_URL = document.currentScript?.src || new URL('scripts/api-shim.js', location.href).href;
 const BASE = new URL('../data/', SCRIPT_URL).href;
 const LS = {
 users: 'ta_users',
 me: 'ta_me',
 orders: 'ta_orders',
 };
 const J = (k, d) => { try { return JSON.parse(localStorage.getItem(k))?? d; } catch { return d; } };
 const S = (k, v) => localStorage.setItem(k, JSON.stringify(v));
 const ok = (body, status = 200) =>
 new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

 async function loadJSON(file) {
 const r = await _fetch(BASE + file, { cache: 'no-store' });
 return r.json();
 }
 function assetUrl(value) {
 if (typeof value!== 'string') return value;
 const marker = '/demos/tecksart/';
 value = value.replace(/(assets\/images\/products\/(?:vaso|baleia|bowl|elefantinho|lampada|luminaria))\.png/g, '$1.webp');
 if (value.startsWith(marker)) return new URL('../' + value.slice(marker.length), SCRIPT_URL).href;
 if (value.startsWith('assets/')) return new URL('../' + value, SCRIPT_URL).href;
 return value;
 }
 function normalizeProduct(product) {
 if (!product || typeof product!== 'object') return product;
 return {...product,
 images: Array.isArray(product.images)? product.images.map(assetUrl): product.images,
 image: assetUrl(product.image)
 };
 }

 const _fetch = window.fetch.bind(window);

 window.fetch = async function (input, init = {}) {
 const url = typeof input === 'string'? input: (input && input.url) || '';
 // Anything that isn't our API real network (fonts, viacep, assets&)
 if (!/\/api\/v4\//.test(url)) return _fetch(input, init);

 const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
 const path = url.replace(/^.*\/api\/v4/, '').replace(/\?.*$/, '');
 let payload = {};
 try { payload = init && init.body? JSON.parse(init.body): {}; } catch {}

 try {
 /* ---------- PRODUCTS ---------- */
 if (path === '/products' && method === 'GET') {
 const data = await loadJSON('products.json');
 const items = (data.products || []).map(normalizeProduct);
 return ok({ products: items, total: items.length });
 }
 const pm = path.match(/^\/products\/(.+)$/);
 if (pm && method === 'GET') {
 const data = await loadJSON('products.json');
 const prod = (data.products || []).map(normalizeProduct).find(p => p.id === pm[1] || p.slug === pm[1]);
 return prod? ok(prod): ok({ error: 'not found' }, 404);
 }
 if (pm && ['POST', 'PUT', 'DELETE'].includes(method)) {
 return ok({ ok: true, product: normalizeProduct({ id: pm[1],...payload }) });
 }
 if (path === '/products' && ['POST', 'PUT'].includes(method)) {
 return ok({ ok: true, product: normalizeProduct({ id: payload.id || 'demo-' + Date.now(),...payload }) });
 }

 /* ---------- ADMIN DATA ---------- */
 if (path === '/orders' && method === 'GET') {
 const data = await loadJSON('orders.json');
 const orders = (data.orders || J(LS.orders, []) || []).map((order) => ({...order,
 items: Array.isArray(order.items)? order.items.map((item) => ({...item, image: assetUrl(item.image) })): order.items
 }));
 return ok({ orders, total: orders.length });
 }
 if (path === '/subscribers' && method === 'GET') {
 const data = await loadJSON('subscribers.json');
 const subscribers = data.subscribers || [];
 return ok({ subscribers, total: subscribers.length });
 }
 if (path === '/coupons' && method === 'GET') {
 const data = await loadJSON('coupons.json');
 const coupons = data.coupons || [];
 return ok({ coupons, total: coupons.length });
 }
 if (path === '/drops' && method === 'GET') {
 const data = await loadJSON('drops.json');
 const drops = data.drops || [];
 return ok({ drops, total: drops.length });
 }
 if (path === '/users' && method === 'GET') {
 const users = J(LS.users, []);
 return ok({ users, total: users.length });
 }

 /* ---------- AUTH / ACCOUNT (local) ---------- */
 if (path === '/users/register' && method === 'POST') {
 const users = J(LS.users, []);
 if (users.some(u => u.email === payload.email))
 return ok({ error: 'E-mail já cadastrado' }, 409);
 const user = { id: 'u_' + Date.now(), name: payload.name, email: payload.email };
 users.push({...user, password: payload.password });
 S(LS.users, users); S(LS.me, user);
 return ok({ token: 'demo-' + user.id, user });
 }
 if (path === '/users/login' && method === 'POST') {
 const users = J(LS.users, []);
 const u = users.find(x => x.email === payload.email && x.password === payload.password);
 if (!u) return ok({ error: 'Credenciais invlidas' }, 401);
 const user = { id: u.id, name: u.name, email: u.email };
 S(LS.me, user);
 return ok({ token: 'demo-' + u.id, user });
 }
 if (path === '/users/me' && method === 'GET') {
 const me = J(LS.me, null);
 return me? ok(me): ok({ error: 'unauthenticated' }, 401);
 }
 if (path === '/users/me' && method === 'PUT') {
 const me = {...(J(LS.me, {})),...payload };
 S(LS.me, me);
 return ok(me);
 }
 if (path === '/users/me/orders' && method === 'GET') {
 return ok(J(LS.orders, []));
 }

 /* ---------- COUPONS ---------- */
 if (path === '/coupons/validate') {
 return ok({ valid: false, message: 'Cupom inválido (demo)' });
 }

 /* ---------- ORDERS ---------- */
 if (path === '/orders' && method === 'POST') {
 const orders = J(LS.orders, []);
 const order = { id: 'TA-' + Date.now(),...payload, created: new Date().toISOString(), status: 'received' };
 orders.unshift(order); S(LS.orders, orders);
 return ok({ ok: true, order, id: order.id });
 }
 if (/^\/orders\/.+$/.test(path) && method === 'PUT') {
 return ok({ ok: true });
 }
 if (/^\/subscribers\/.+$/.test(path) && method === 'DELETE') {
 return ok({ ok: true });
 }
 if (/^\/coupons(\/.+)?$/.test(path) && ['POST', 'PUT', 'DELETE'].includes(method)) {
 return ok({ ok: true, coupon: { id: payload.id || 'coupon-' + Date.now(),...payload } });
 }

 /* ---------- ANALYTICS / SUBSCRIBERS / fallthrough ---------- */
 return ok({ ok: true });
 } catch (e) {
 return ok({ ok: true, demo: true });
 }
 };
})();
