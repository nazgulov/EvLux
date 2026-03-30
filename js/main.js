/**
 * EvLux – Main JavaScript
 * Handles: navbar, smooth scroll, animations, contact form, particles
 */

(function () {
  'use strict';

  /* ===================================================
     SVG ICON TEMPLATES
     =================================================== */
  var SVG = {
    spinner: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin-icon"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
    check:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    send:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  /* ===================================================
     NAVBAR – scroll behaviour + mobile toggle
     =================================================== */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  function updateNavbar () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ===================================================
     ACTIVE NAV LINK on scroll
     =================================================== */
  const sections     = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ===================================================
     SCROLL ANIMATIONS
     =================================================== */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  animatedEls.forEach(function (el) { observer.observe(el); });

  /* ===================================================
     ANIMATED NUMBER COUNTERS
     =================================================== */
  function animateCounter (el, target, duration) {
    const start     = performance.now();
    const isDecimal = String(target).includes('.');
    const decimals  = isDecimal ? String(target).split('.')[1].length : 0;

    function step (timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value    = eased * target;
      el.textContent = isDecimal
        ? value.toFixed(decimals)
        : Math.floor(value).toLocaleString('cs-CZ');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.getAttribute('data-counter'));
        animateCounter(el, target, 1600);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(function (el) { counterObserver.observe(el); });

  /* ===================================================
     HERO PARTICLES
     =================================================== */
  const particleContainer = document.querySelector('.hero-particles');

  if (particleContainer) {
    const count = window.innerWidth < 768 ? 10 : 22;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');
      particle.style.left     = Math.random() * 100 + '%';
      particle.style.animationDuration  = (8 + Math.random() * 14) + 's';
      particle.style.animationDelay     = (Math.random() * 12)      + 's';
      particle.style.width  = (3 + Math.random() * 5) + 'px';
      particle.style.height = particle.style.width;
      particleContainer.appendChild(particle);
    }
  }

  /* ===================================================
     CONTACT FORM
     =================================================== */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn  = form.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = SVG.spinner + ' Odesílám...';
      btn.disabled  = true;

      // Simulate async send
      setTimeout(function () {
        btn.innerHTML = orig;
        btn.disabled  = false;
        form.reset();
        if (success) {
          success.classList.add('visible');
          setTimeout(function () { success.classList.remove('visible'); }, 5000);
        }
        showToast('✓ Zpráva byla úspěšně odeslána!');
      }, 1400);
    });
  }

  /* ===================================================
     TOAST NOTIFICATION
     =================================================== */
  function showToast (message) {
    let toast = document.getElementById('evToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'evToast';
      toast.className = 'toast';
      toast.innerHTML = SVG.check + '<span></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  /* ===================================================
     SMOOTH SCROLL for anchor links
     =================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===================================================
     LAZY-LOAD style fix: ensure visible on no-JS
     =================================================== */
  document.documentElement.classList.add('js-loaded');

})();
