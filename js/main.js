/**
 * SpeedLinks – main.js
 * Handles: sticky navbar, mobile menu, billing toggle,
 * counter animation, contact form submission feedback.
 */

(function () {
  'use strict';

  /* ── Navbar scroll shadow ────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger menu ───────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    const setMobileMenuState = (open) => {
      hamburger.classList.toggle('active', open);
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    hamburger.addEventListener('click', () => {
      setMobileMenuState(!hamburger.classList.contains('active'));
    });

    // Close menu on any link tap
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMobileMenuState(false));
    });
  }

  /* ── Billing toggle (monthly / annual) ──────────────── */
  const billingToggle = document.getElementById('billingToggle');
  const prices = document.querySelectorAll('[data-monthly][data-annual]');

  if (billingToggle && prices.length) {
    const periodEls = document.querySelectorAll('.plan-period');
    const update = () => {
      const annual = billingToggle.checked;
      prices.forEach(el => {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
      periodEls.forEach(el => {
        el.textContent = annual ? '/yr' : '/month';
      });
    };
    billingToggle.addEventListener('change', update);
    update(); // set initial state
  }

  /* ── Animated counters ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => obs.observe(el));
  }

  /* ── Contact form ────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields before proceeding
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('.form-submit');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      // Simulate async send
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        if (formMsg) {
          formMsg.textContent = '✓ Thank you! We will get back to you shortly.';
          formMsg.style.color = 'var(--clr-success)';
          formMsg.style.marginTop = '12px';
          formMsg.style.fontSize = '0.9rem';
        }
        form.reset();
      }, 1200);
    });
  }

  /* ── Smooth active nav link highlighting ─────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navAnchors.length) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => sectionObs.observe(s));
  }

})();
