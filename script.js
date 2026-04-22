// ─── NAV: show after scrolling past hero ───────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const heroH = document.getElementById('hero').offsetHeight;
  if (window.scrollY > heroH * 0.6) {
    nav.classList.add('visible');
  } else {
    nav.classList.remove('visible');
  }
}, { passive: true });

// ─── INTERSECTION OBSERVER: animate timeline cards ─────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.08}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item, .route-card, .highlight-item').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ─── ADD VISIBLE CLASS FOR CSS ANIMATION ───────────────────
const style = document.createElement('style');
style.textContent = `
  .timeline-item, .route-card, .highlight-item {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .timeline-item.visible, .route-card.visible, .highlight-item.visible {
    opacity: 1 !important;
    animation: slideIn 0.5s ease both;
  }
`;
document.head.appendChild(style);

// ─── SMOOTH ACTIVE NAV LINK ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ─── STAMP: subtle rotation on hover ───────────────────────
const stamp = document.querySelector('.hero-stamp');
if (stamp) {
  stamp.addEventListener('mouseenter', () => {
    stamp.style.transform = 'rotate(0deg) scale(1.08)';
    stamp.style.transition = 'transform 0.3s ease';
  });
  stamp.addEventListener('mouseleave', () => {
    stamp.style.transform = 'rotate(12deg) scale(1)';
  });
}

// ─── LEAFLET MAP ────────────────────────────────────────────
if (document.getElementById('leaflet-map')) {
  const map = L.map('leaflet-map', { scrollWheelZoom: false, zoomControl: true });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
    maxZoom: 13,
  }).addTo(map);

  const RED  = '#C8102E';
  const BLUE = '#0B4F70';
  const tipOpts = { direction: 'top', className: 'map-tip', offset: [0, -4] };

  function dot(latlng, color, label) {
    return L.circleMarker(latlng, {
      radius: 6, color, fillColor: '#fff', fillOpacity: 1, weight: 2.5,
    }).bindTooltip(label, tipOpts);
  }

  // ── Route 1: Küste & Vancouver Island ──
  const r1 = L.layerGroup([
    L.polyline([[49.283,-123.121],[49.007,-123.131]], { color: RED, weight: 3 }),
    L.polyline([[49.007,-123.131],[48.754,-123.393]], { color: RED, weight: 2, dashArray: '7 6' }),
    L.polyline([[48.754,-123.393],[48.428,-123.366],[48.566,-123.469],[49.308,-124.530],[49.153,-125.907],[49.166,-123.940]], { color: RED, weight: 3 }),
    L.polyline([[49.166,-123.940],[49.374,-123.273]], { color: RED, weight: 2, dashArray: '7 6' }),
    L.polyline([[49.374,-123.273],[49.702,-123.156],[50.116,-122.957],[49.283,-123.121]], { color: RED, weight: 3 }),
    dot([49.283,-123.121], RED, 'Vancouver'),
    dot([48.428,-123.366], RED, 'Victoria'),
    dot([48.566,-123.469], RED, 'Butchart Gardens'),
    dot([49.153,-125.907], RED, 'Tofino'),
    dot([50.116,-122.957], RED, 'Whistler'),
  ]);

  // ── Route 2: Rockies & Okanagan ──
  const r2 = L.layerGroup([
    L.polyline([[49.283,-123.121],[51.045,-114.072]], { color: BLUE, weight: 2, dashArray: '8 5', opacity: 0.7 }),
    L.polyline([[51.045,-114.072],[51.178,-115.571],[51.425,-116.177],[52.220,-117.224],[51.299,-116.966],[50.998,-118.196],[51.299,-117.524],[49.888,-119.496]], { color: BLUE, weight: 3 }),
    L.polyline([[49.888,-119.496],[50.300,-121.500],[50.116,-122.957],[49.702,-123.156],[49.283,-123.121]], { color: BLUE, weight: 3 }),
    dot([49.283,-123.121], BLUE, 'Vancouver'),
    dot([51.045,-114.072], BLUE, 'Calgary ✈'),
    dot([51.178,-115.571], BLUE, 'Banff'),
    dot([51.425,-116.177], BLUE, 'Lake Louise'),
    dot([52.220,-117.224], BLUE, 'Athabasca Gletscher'),
    dot([49.888,-119.496], BLUE, 'Kelowna'),
    dot([50.116,-122.957], BLUE, 'Whistler'),
  ]);

  r1.addTo(map);
  map.fitBounds(L.polyline([[48.4,-125.9],[50.2,-122.9]]).getBounds().pad(0.1));

  document.querySelectorAll('.map-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.map-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.route === '1') {
        map.removeLayer(r2);
        r1.addTo(map);
        map.flyToBounds(L.polyline([[48.4,-125.9],[50.2,-122.9]]).getBounds().pad(0.1), { duration: 0.7 });
      } else {
        map.removeLayer(r1);
        r2.addTo(map);
        map.flyToBounds(L.polyline([[48.4,-123.1],[52.4,-114.0]]).getBounds().pad(0.1), { duration: 0.7 });
      }
    });
  });
}
