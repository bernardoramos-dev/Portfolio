/* ================================================================
 TECKSART V4 - Product Store
 ================================================================ */

const ProductStore = (() => {
 let _data = null;

 async function load() {
 if (_data) return _data;
 try {
 const r = await fetch('/api/v4/products');
 _data = await r.json();
 } catch {
 _data = { products: [], collections: [], settings: {}, drops: [] };
 }
 return _data;
 }

 function getAll() { return _data?.products || []; }
 function getFeatured() { return getAll().filter(p => p.featured); }
 function getById(id) { return getAll().find(p => p.id === id); }
 function getBySlug(s) { return getAll().find(p => p.slug === s); }
 function getByCollection(c) { return getAll().filter(p => p.collection?.toLowerCase() === c.toLowerCase()); }
 function getByDrop(d) { return getAll().filter(p => p.drop === d); }
 function getCollections() { return _data?.collections || []; }
 function getSettings() { return _data?.settings || {}; }
 function getDrops() { return _data?.drops || []; }

 return { load, getAll, getFeatured, getById, getBySlug, getByCollection, getByDrop, getCollections, getSettings, getDrops };
})();


/* Product Card Renderer */
const ProductCard = (() => {
 function render(product, opts = {}) {
 const { fromRoot = false } = opts;
 const base = fromRoot? 'pages/': '';
 const href = `${base}product.html?id=${product.id}`;

 const badge = product.badge? `<span class="product-card-badge">${product.badge}</span>`: '';

 return `
 <article class="product-card" data-product-id="${product.id}">
 <div class="product-card-media">
 <img
 src="${product.images[0]}"
 alt="${product.name}"
 class="product-card-img"
 loading="lazy"
 />
 ${badge}
 <div class="product-card-actions">
 <button
 class="product-card-add"
 data-add-to-cart="${product.id}"
 aria-label="Adicionar ao carrinho"
 >Adicionar</button>
 </div>
 </div>
 <div class="product-card-body">
 <p class="product-card-collection">${product.collection}</p>
 <h3 class="product-card-name">${product.name}</h3>
 <p class="product-card-edition">${product.edition || ''}</p>
 <p class="product-card-price">${product.priceFormatted}</p>
 </div>
 </article>
 `;
 }

 function bindEvents(container, opts = {}) {
 container.querySelectorAll('[data-add-to-cart]').forEach(btn => {
 btn.addEventListener('click', e => {
 e.preventDefault();
 e.stopPropagation();
 const product = ProductStore.getById(btn.dataset.addToCart);
 if (product) {
 Cart.add(product);
 Toast.show(`${product.name} adicionado`, 'success');
 Analytics.track('add_to_cart', { product_id: product.id });
 }
 });
 });

 container.querySelectorAll('.product-card').forEach(card => {
 card.addEventListener('click', e => {
 if (e.target.closest('[data-add-to-cart]')) return;
 const { fromRoot } = opts;
 const base = fromRoot? 'pages/': '';
 window.location.href = `${base}product.html?id=${card.dataset.productId}`;
 });
 });
 }

 return { render, bindEvents };
})();
