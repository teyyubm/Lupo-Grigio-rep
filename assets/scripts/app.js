const PRODUCTS_JSON_URL = 'assets/data/products.json';

const state = {
  products: [],
  cart: /** @type {Record<string, number>} */ ({}),
  instagram: /** @type {{profile:string, posts:{id:string,image:string,url:string}[]}|null} */ (null),
  visibleProductsCount: 9,
  loadMoreIncrement: 3,
};

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('lg_cart');
    state.cart = raw ? JSON.parse(raw) : {};
  } catch {
    state.cart = {};
  }
}

function saveCartToStorage() {
  localStorage.setItem('lg_cart', JSON.stringify(state.cart));
}

function formatCurrency(cents) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

async function loadProducts() {
  try {
    // Try to load from database first
    const dbResponse = await fetch('/api/products', { cache: 'no-store' });
    if (dbResponse.ok) {
      const data = await dbResponse.json();
      state.products = data.products || [];
      // Reset pagination to show only 9 products initially
      state.visibleProductsCount = 9;
      console.log('✅ Products loaded from database');
      return;
    }
  } catch (error) {
    console.log('Database not available, falling back to JSON file');
  }
  
  // Fallback to JSON file
  try {
    const res = await fetch(PRODUCTS_JSON_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load products');
    const data = await res.json();
    state.products = data.products || data; // Handle both nested and direct array formats
    // Reset pagination to show only 9 products initially
    state.visibleProductsCount = 9;
    console.log('✅ Products loaded from JSON file');
  } catch (error) {
    console.error('Failed to load products:', error);
    state.products = [];
  }
}

// Load more products function
function loadMoreProducts() {
  state.visibleProductsCount += state.loadMoreIncrement;
  renderProducts();
}

// Make loadMoreProducts globally accessible
window.loadMoreProducts = loadMoreProducts;

function getCartCount() {
  return Object.values(state.cart).filter(qty => qty > 0).reduce((a, b) => a + b, 0);
}

function getCartTotalCents() {
  return Object.entries(state.cart).reduce((sum, [id, qty]) => {
    if (qty <= 0) return sum;
    const product = state.products.find(p => String(p.id) === String(id));
    return sum + (product ? product.priceCents * qty : 0);
  }, 0);
}

function renderMiniCartCount() {
  const badge = document.getElementById('miniCartCount');
  if (badge) badge.textContent = String(getCartCount());
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = '';

  // Get products to show (limited by visibleProductsCount)
  const productsToShow = state.products.slice(0, state.visibleProductsCount);
  
  productsToShow.forEach(product => {
    const isSold = product.soldOut === true || (product.limited && product.remaining === 0);
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-media" style="background-image:url('${product.image || "assets/images/product-fallback.jpg"}')"></div>
      <div class="card-body">
        <div class="card-title">${product.name}</div>
        <div class="card-sub">${formatCurrency(product.priceCents)} · ${product.material}</div>
      </div>
      <div class="card-footer">
        <div class="pills">
          ${product.limited ? '<span class="pill limited">Limited</span>' : ''}
          ${isSold ? '<span class="pill sold">Sold Out</span>' : ''}
        </div>
        ${isSold ? '<span class="muted">Unavailable</span>' : `<div style="display:flex; gap:8px"><button class=\"button small\" data-add=\"${product.id}\">Add</button><button class=\"button small ghost\" data-qv=\"${product.id}\">View</button></div>`}
      </div>
    `;
    grid.appendChild(card);
  });
  
  // Add Load More button if there are more products
  const remainingProducts = state.products.length - state.visibleProductsCount;
  if (remainingProducts > 0) {
    const loadMoreDiv = document.createElement('div');
    loadMoreDiv.className = 'load-more-container';
    loadMoreDiv.style.cssText = 'text-align: center; margin: 2rem 0; grid-column: 1 / -1;';
    loadMoreDiv.innerHTML = `
      <button class="load-more-btn" onclick="loadMoreProducts()">
        <span class="btn-text">Load More</span>
      </button>
    `;
    grid.appendChild(loadMoreDiv);
  }

  grid.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t instanceof HTMLElement && t.matches('button[data-add]')) {
      const id = String(t.getAttribute('data-add'));
      state.cart[id] = (state.cart[id] || 0) + 1;
      saveCartToStorage();
      renderMiniCartCount();
      renderCart();
      showToast('Added to cart');
      return;
    }
    if (t && t instanceof HTMLElement && t.matches('button[data-qv]')) {
      const id = String(t.getAttribute('data-qv'));
      openQuickView(id);
    }
  });
}

function renderCart() {
  const list = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!list || !totalEl) return;
  list.innerHTML = '';

  const entries = Object.entries(state.cart).filter(([id, qty]) => qty > 0);
  if (entries.length === 0) {
    list.innerHTML = '<p class="muted">Your cart is empty.</p>';
  } else {
    entries.forEach(([id, qty]) => {
      const product = state.products.find(p => String(p.id) === String(id));
      if (!product) return;
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '1fr auto auto';
      row.style.gap = '10px';
      row.style.alignItems = 'center';
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px">
          <img src="${product.image || 'assets/images/product-fallback.jpg'}" alt="${product.name}" style="width:50px; height:50px; object-fit:cover; border-radius:6px; border:1px solid var(--color-border)">
          <div>
            <div style="font-weight:600">${product.name}</div>
            <div class="muted small">${formatCurrency(product.priceCents)}</div>
          </div>
        </div>
        <div>
          <button class="icon-button" data-dec="${product.id}">−</button>
          <span style="display:inline-block; width:24px; text-align:center">${qty}</span>
          <button class="icon-button" data-inc="${product.id}">+</button>
        </div>
        <div style="text-align:right">${formatCurrency(product.priceCents * qty)}</div>
      `;
      list.appendChild(row);
    });
  }

  totalEl.textContent = formatCurrency(getCartTotalCents());

  list.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t && t instanceof HTMLElement)) return;
    const inc = t.getAttribute('data-inc');
    const dec = t.getAttribute('data-dec');
    if (inc) {
      state.cart[inc] = (state.cart[inc] || 0) + 1;
    } else if (dec) {
      const currentQty = state.cart[dec] || 0;
      if (currentQty > 0) {
        state.cart[dec] = currentQty - 1;
      }
    } else {
      return;
    }
    saveCartToStorage();
    renderMiniCartCount();
    renderCart();
  });
}

function setupCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const openBtn = document.getElementById('miniCartButton');
  const closeBtn = document.getElementById('closeCart');
  const checkoutBtn = document.getElementById('checkoutButton');
  if (!drawer || !openBtn || !closeBtn || !checkoutBtn) return;

  const open = () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
  const close = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); };

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Checkout placeholder. Integrate Stripe/Shopify to accept payments.');
  });
}

function setupCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('acceptCookies');
  const decline = document.getElementById('declineCookies');
  const key = 'lg_cookie_consent';
  if (!banner || !accept || !decline) return;

  const saved = localStorage.getItem(key);
  if (!saved) banner.classList.add('visible');

  function set(value) {
    localStorage.setItem(key, value);
    banner.classList.remove('visible');
  }
  accept.addEventListener('click', () => set('accepted'));
  decline.addEventListener('click', () => set('declined'));
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
}

async function init() {
  setYear();
  loadCartFromStorage();
  renderMiniCartCount();
  setupCartDrawer();
  setupCookieBanner();
  setupAnalytics();
  setupHeaderScroll();
  setupRevealOnScroll();
  setupSmoothScrolling();
  setupHeroParallax();
  setupBackToTop();
  try {
    await loadProducts();
    renderProducts();
    renderCart();
    await loadInstagram();
    renderInstagram();
  } catch (err) {
    console.error(err);
  }
}

// Back to top button
function setupBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const onScroll = () => {
    const show = window.scrollY > 400;
    btn.classList.toggle('visible', show);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

init();

// Lightweight analytics stub (respects cookie consent)
function setupAnalytics() {
  const consent = localStorage.getItem('lg_cookie_consent');
  const allowed = !consent || consent === 'accepted';
  const endpoint = 'https://example-analytics.invalid/collect';
  function send(eventName, payload) {
    if (!allowed) return;
    const body = {
      event: eventName,
      url: location.href,
      ts: Date.now(),
      ...payload,
    };
    // Fire-and-forget; replace with real endpoint/provider.
    try { navigator.sendBeacon?.(endpoint, JSON.stringify(body)); } catch {}
  }
  // Page view
  send('page_view', {});
  // Track add to cart via delegated listener
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t instanceof HTMLElement && t.matches('button[data-add]')) {
      send('add_to_cart', { productId: t.getAttribute('data-add') });
    }
  });
}

// Header on-scroll shadow
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    const scrolled = window.scrollY > 8;
    header.style.boxShadow = scrolled ? '0 8px 30px rgba(0,0,0,.25)' : 'none';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Reveal elements on scroll
function setupRevealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add('visible');
  }, { threshold: 0.1 });
  items.forEach(el => io.observe(el));
}

// Smooth scrolling for internal anchors
function setupSmoothScrolling() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!(t && t instanceof HTMLAnchorElement)) return;
    const href = t.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Subtle parallax on hero media
function setupHeroParallax() {
  const media = document.querySelector('.hero-media');
  if (!media) return;
  const onScroll = () => {
    const rect = media.getBoundingClientRect();
    const offset = Math.min(20, Math.max(-20, (window.innerHeight - rect.top) * 0.04));
    media.style.transform = `translateY(${offset}px)`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Quick View Modal
function openQuickView(productId) {
  const product = state.products.find(p => String(p.id) === String(productId));
  const modal = document.getElementById('quickView');
  const media = document.getElementById('qvMedia');
  const info = document.getElementById('qvInfo');
  if (!product || !modal || !media || !info) return;
  media.style.backgroundImage = `url('${product.image || 'assets/images/product-fallback.jpg'}')`;
  info.innerHTML = `
    <h3 style="margin:0 0 6px 0">${product.name}</h3>
    <div class="muted" style="margin:0 0 8px 0">${product.material}</div>
    <strong>${formatCurrency(product.priceCents)}</strong>
    <div style="display:flex; gap:8px; margin-top:10px">
      <button class="button" data-add-qv="${product.id}">Add to cart</button>
      <button class="button ghost" data-close="modal">Close</button>
    </div>
  `;
  modal.setAttribute('aria-hidden', 'false');
  modal.addEventListener('click', onModalClick);
}

function closeQuickView() {
  const modal = document.getElementById('quickView');
  if (!modal) return;
  modal.setAttribute('aria-hidden', 'true');
  modal.removeEventListener('click', onModalClick);
}

function onModalClick(e) {
  const t = e.target;
  if (!(t && t instanceof HTMLElement)) return;
  if (t.hasAttribute('data-close')) { closeQuickView(); return; }
  const add = t.getAttribute('data-add-qv');
  if (add) {
    state.cart[add] = (state.cart[add] || 0) + 1;
    saveCartToStorage();
    renderMiniCartCount();
    renderCart();
    showToast('Added to cart');
    closeQuickView();
  }
}

// Toast
let toastTimer;
function showToast(message) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 1600);
}

// Instagram gallery
async function loadInstagram() {
  try {
    // Prefer live proxy if configured
    let usedProxy = false;
    try {
      const { INSTAGRAM_PROXY_URL } = await import('./config.js');
      if (INSTAGRAM_PROXY_URL) {
        const live = await fetch(INSTAGRAM_PROXY_URL, { cache: 'no-store' });
        if (live.ok) {
          state.instagram = await live.json();
          usedProxy = true;
        }
      }
    } catch {}

    if (!usedProxy) {
      const res = await fetch('assets/data/instagram.json', { cache: 'no-store' });
      if (!res.ok) return;
      state.instagram = await res.json();
    }
  } catch {}
}

function renderInstagram() {
  const grid = document.getElementById('instagramGrid');
  const cta = document.getElementById('igProfileCta');
  const footer = document.getElementById('igFooterLink');
  if (!grid || !state.instagram) return;
  if (cta && state.instagram.profile) cta.setAttribute('href', state.instagram.profile);
  if (footer && state.instagram.profile) footer.setAttribute('href', state.instagram.profile);
  grid.innerHTML = '';
  const posts = (state.instagram.posts || []).slice(0, 12);
  if (!posts.length) {
    const note = document.createElement('p');
    note.className = 'muted';
    note.textContent = 'No Instagram posts configured yet.';
    grid.appendChild(note);
    return;
  }

  const fallback = 'assets/images/banner.jpg';
  posts.forEach(post => {
    const tile = document.createElement('div');
    tile.className = 'ig-tile';
    tile.style.backgroundImage = `url('${fallback}')`;
    tile.innerHTML = `<a href="${post.url}" target="_blank" rel="noopener" aria-label="Open Instagram post"></a>`;
    grid.appendChild(tile);
    // Try to load provided image; if it loads, replace background
    if (post.image) {
      const img = new Image();
      img.onload = () => { tile.style.backgroundImage = `url('${post.image}')`; };
      img.onerror = () => { /* keep fallback */ };
      img.src = post.image;
    }
  });
}

