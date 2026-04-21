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
