// edit before going live
const CONFIG = {
  enquiryEmail: 'enquiry@shopname.example',
  formspreeUrl: '' // e.g. 'https://formspree.io/f/xxxxxxxx'. Empty means mailto fallback
};

const CATALOG = {
  'Readymade Suits': [['Cotton Straight Suit', 1299], ['Chanderi Anarkali Set', 2499], ['Embroidered Palazzo Suit', 3199], ['Festive Silk Suit', 5499]],
  "Ladies' Suit Fabrics": [['Cotton Print 3-Piece', 699], ['Georgette Embroidered Fabric', 1850], ['Banarasi Dupatta Suit Fabric', 3400], ['Pure Silk Suit Fabric', 6200]],
  'Gift Boxes (Pant & Shirt)': [['Poly-Viscose Pant & Shirt Box', 899], ['Cotton Shirt & Trouser Box', 1450], ['Linen Blend Gift Box', 2600], ['Wool Blend Gift Box', 5200]],
  'Coat Pants': [['Two-Piece Casual Suit', 4500], ['Slim Fit Party Wear', 6800], ['Wedding Coat Pant', 9500], ['Jodhpuri Set', 12500]],
  'Sarees': [['Cotton Tant Saree', 950], ['Block Print Cotton Saree', 1650], ['Bandhej Georgette Saree', 3200], ['Banarasi Katan Silk Saree', 14500]],
  'Shirting & Suiting': [['Cotton Shirting', 790], ['Linen Shirting', 1190], ['Poly-Wool Suiting', 2400], ['Pure Wool Suiting', 5900]]
};

const $ = id => document.getElementById(id);
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rupees = n => '₹' + n.toLocaleString('en-IN');

const toggle = $('nav-toggle');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = $('nav').classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

const yr = $('yr');
if (yr) yr.textContent = new Date().getFullYear();

if ($('products')) initRange();
if ($('enquiry-form')) initEnquiry($('enquiry-form'));

function initRange() {
  const items = Object.entries(CATALOG).flatMap(([cat, list]) =>
    list.map(([name, price]) => ({ cat, name, price })));
  // read selects too, browsers restore their values on reload
  const state = { cat: 'all', sort: $('sort').value, range: $('range').value };
  const chipBox = $('chips');

  ['all', ...Object.keys(CATALOG)].forEach(cat => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.cat = cat;
    b.textContent = cat === 'all' ? 'All' : cat;
    chipBox.appendChild(b);
  });

  function render() {
    const [min, max] = state.range === 'all' ? [0, Infinity] : state.range.split('-').map(Number);
    const list = items.filter(p =>
      (state.cat === 'all' || p.cat === state.cat) && p.price >= min && p.price <= max);
    if (state.sort === 'asc') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') list.sort((a, b) => b.price - a.price);

    chipBox.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.cat === state.cat));
    $('count').textContent = list.length + (list.length === 1 ? ' product' : ' products');
    $('products').innerHTML = list.length
      ? list.map(p => `<article class="card"><img src="images/placeholder.svg" alt="${esc(p.name)}" width="400" height="500" loading="lazy"><div class="card-b"><span class="tag">${esc(p.cat)}</span><h3>${esc(p.name)}</h3><p class="price">${rupees(p.price)}</p></div></article>`).join('')
      : '<p class="empty">No products match these filters. Pick another price range or reset the filters.</p>';
  }

  chipBox.addEventListener('click', e => {
    const c = e.target.closest('.chip');
    if (!c) return;
    state.cat = c.dataset.cat;
    render();
  });
  $('sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('range').addEventListener('change', e => { state.range = e.target.value; render(); });
  $('reset').addEventListener('click', () => {
    Object.assign(state, { cat: 'all', sort: 'default', range: 'all' });
    $('sort').value = 'default';
    $('range').value = 'all';
    render();
  });
  render();
}

function initEnquiry(form) {
  const msg = $('form-msg');
  const say = (text, ok) => { msg.textContent = text; msg.className = ok ? 'ok' : 'err'; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));

    if (CONFIG.formspreeUrl) {
      try {
        const res = await fetch(CONFIG.formspreeUrl, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(d)
        });
        if (!res.ok) throw new Error('status ' + res.status);
        form.reset();
        say('Thanks, we have your enquiry and will call you back soon.', true);
      } catch (err) {
        console.error(err);
        say('Could not send your enquiry. Please call us or try again in a minute.', false);
      }
      return;
    }

    const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nInterested in: ${d.product}\n\n${d.message}`;
    const subject = 'Enquiry: ' + d.product;
    location.href = `mailto:${CONFIG.enquiryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    say('Opening your email app. If nothing opens, write to ' + CONFIG.enquiryEmail + ' or call us.', true);
  });
}

// PERFORMANCE: Prefetch internal pages when visitors show navigation intent.
(function () {
  const prefetched = new Set();

  function prefetchPage(event) {
    const element = event.target;
    if (!(element instanceof Element)) return;

    const link = element.closest('a[href]');

    if (
      !link ||
      link.target === '_blank' ||
      link.hasAttribute('download')
    ) return;

    const url = new URL(link.href, window.location.href);

    // Only prefetch pages hosted on this website.
    if (url.origin !== window.location.origin) return;

    if (!/\.html?$/i.test(url.pathname)) return;
    if (url.pathname === window.location.pathname) return;
    if (prefetched.has(url.href)) return;

    prefetched.add(url.href);

    const hint = document.createElement('link');
    hint.rel = 'prefetch';
    hint.href = url.href;
    document.head.appendChild(hint);
  }

  document.addEventListener('pointerover', prefetchPage, {
    passive: true
  });

  document.addEventListener('focusin', prefetchPage);
})();
