/* ================================================================
 TECKSART V4 — User Auth Module
 ================================================================ */

'use strict';

const UserAuth = (() => {
 const TOKEN_KEY = 'ta_user_token';
 const USER_KEY = 'ta_user_data';

 function getToken() { return Store.get(TOKEN_KEY); }
 function getUser() { return Store.get(USER_KEY); }
 function isLoggedIn() { return!!getToken(); }

 async function register({ name, email, password, phone = '' }) {
 const r = await fetch('/api/v4/users/register', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name, email, password, phone })
 });
 const data = await r.json();
 if (data.success) {
 Store.set(TOKEN_KEY, data.token);
 Store.set(USER_KEY, data.user);
 }
 return data;
 }

 async function login({ email, password }) {
 const r = await fetch('/api/v4/users/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email, password })
 });
 const data = await r.json();
 if (data.success) {
 Store.set(TOKEN_KEY, data.token);
 Store.set(USER_KEY, data.user);
 }
 return data;
 }

 async function fetchMe() {
 const token = getToken();
 if (!token) return null;
 try {
 const r = await fetch('/api/v4/users/me', {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 if (r.status === 401) { logout(); return null; }
 const user = await r.json();
 Store.set(USER_KEY, user);
 return user;
 } catch { return null; }
 }

 async function updateProfile(fields) {
 const token = getToken();
 if (!token) return null;
 const r = await fetch('/api/v4/users/me', {
 method: 'PUT',
 headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
 body: JSON.stringify(fields)
 });
 const data = await r.json();
 if (!data.error) Store.set(USER_KEY, data);
 return data;
 }

 async function fetchOrders() {
 const token = getToken();
 if (!token) return [];
 try {
 const r = await fetch('/api/v4/users/me/orders', {
 headers: { 'Authorization': `Bearer ${token}` }
 });
 const data = await r.json();
 return data.orders || [];
 } catch { return []; }
 }

 function logout() {
 Store.remove(TOKEN_KEY);
 Store.remove(USER_KEY);
 }

 /* Prefill checkout form with saved address */
 function prefillCheckout() {
 const user = getUser();
 if (!user) return;
 const addr = user.address || {};

 const set = (id, val) => {
 const el = document.getElementById(id);
 if (el && val) el.value = val;
 };

 set('checkout-name', user.name);
 set('checkout-email', user.email);
 set('checkout-phone', user.phone);
 set('checkout-cep', addr.cep);
 set('checkout-street', addr.street);
 set('checkout-number', addr.number);
 set('checkout-complement', addr.complement);
 set('checkout-neighborhood', addr.neighborhood);
 set('checkout-city', addr.city);
 set('checkout-state', addr.state);
 }

 /* Update header to show account link */
 function updateHeaderUI() {
 const user = getUser();
 const actionsEl = document.querySelector('.header-actions');
 if (!actionsEl) return;

 const existing = actionsEl.querySelector('.header-account-btn');
 if (existing) existing.remove();

 const btn = document.createElement('a');
 btn.className = 'header-account-btn';
 btn.href = 'pages/account.html';

 if (user) {
 const initials = (user.name || user.email).split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
 btn.innerHTML = `<span class="header-account-avatar">${initials}</span>`;
 btn.setAttribute('aria-label', `Conta de ${user.name || user.email}`);
 } else {
 btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
 btn.setAttribute('aria-label', 'Entrar / Criar conta');
 }
 actionsEl.insertBefore(btn, actionsEl.firstChild);
 }

 return { isLoggedIn, getToken, getUser, register, login, logout, fetchMe, updateProfile, fetchOrders, prefillCheckout, updateHeaderUI };
})();
