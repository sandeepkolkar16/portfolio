/* =============================================================
   script.js — Mechanical Engineer Portfolio
   =============================================================
   1. Navbar scroll shadow
   2. Hamburger menu (mobile)
   3. Project modals (open / close)
   4. Contact form (Formspree AJAX)
   5. Scroll-to-top button
   6. Active nav link on scroll
   7. Fade-in on scroll (IntersectionObserver)
============================================================= */


/* =========================================================
   1. NAVBAR — shadow on scroll
========================================================= */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });


/* =========================================================
   2. HAMBURGER MENU (mobile)
========================================================= */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav    = document.getElementById('mobileNav');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburgerBtn.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
});

// Close when a link is tapped
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});


/* =========================================================
   3. PROJECT MODALS
========================================================= */

/** Open modal by ID */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Close modal by ID */
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on overlay background click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open')
      .forEach(o => closeModal(o.id));
  }
});

// Keyboard activation for project cards (Enter / Space)
document.querySelectorAll('.proj-item').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});


/* =========================================================
   4. CONTACT FORM — Formspree AJAX
   EDIT: set your Formspree action URL in index.html
========================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    try {
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formStatus.textContent = '✓ Sent! I\'ll get back to you within a day.';
        formStatus.className   = 'form-status success';
        contactForm.reset();
      } else {
        const data = await res.json();
        const msg  = data?.errors?.map(err => err.message).join(', ') || 'Something went wrong.';
        formStatus.textContent = '✗ ' + msg;
        formStatus.className   = 'form-status error';
      }
    } catch (_) {
      formStatus.textContent = '✗ Network error — please try again.';
      formStatus.className   = 'form-status error';
    }

    btn.disabled  = false;
    btn.innerHTML = original;
  });
}


/* =========================================================
   5. SCROLL-TO-TOP BUTTON
========================================================= */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* =========================================================
   6. ACTIVE NAV LINK HIGHLIGHT
========================================================= */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--tx-1)' : '';
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => sectionObs.observe(s));


/* =========================================================
   7. FADE-IN ON SCROLL (subtle entrance animations)
========================================================= */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

// Add fade-up class to animatable elements
const animTargets = document.querySelectorAll(
  '.phil-card, .proj-item, .skill-col, .exp-item, .cert-row, .bento-card'
);
animTargets.forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`; // stagger in groups of 4
});

const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObs.unobserve(entry.target); // animate only once
    }
  });
}, { threshold: 0.12 });

animTargets.forEach(el => fadeObs.observe(el));