/* ============================================================
   WARMTH ENGINE | Interactions & Animations
   ============================================================ */

(function () {
  'use strict';

  // --- Page Transition ---
  const pageTransition = document.getElementById('pageTransition');
  if (pageTransition) {
    // Fade out overlay on load
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        pageTransition.classList.add('loaded');
      });
    });

    // Fade in overlay before navigating away
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('http') ||
          link.getAttribute('target') === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        pageTransition.classList.remove('loaded');
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Navigation Scroll Effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (nav) {
      if (currentScroll > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger
      const spans = navToggle.querySelectorAll('span');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  // --- Metric Counter Animation ---
  const metricValues = document.querySelectorAll('.metric-card__value[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  metricValues.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = prefix + current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // --- Timeline Expand/Collapse ---
  window.toggleTimeline = function (trigger) {
    const item = trigger.closest('.timeline-item');
    if (!item) return;

    const details = item.querySelector('.timeline-item__details');
    const toggle = item.querySelector('.timeline-item__toggle');

    if (!details) return;

    const isOpen = details.classList.contains('open');

    if (isOpen) {
      details.classList.remove('open');
      if (toggle) toggle.classList.remove('open');
    } else {
      details.classList.add('open');
      if (toggle) toggle.classList.add('open');
    }
  };

  // --- Contact Form Handler ---
  window.handleSubmit = function (e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form && success) {
      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }

      setTimeout(() => {
        form.style.display = 'none';
        success.style.display = 'block';
      }, 800);
    }
  };

  // --- Smooth Anchor Scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Card Hover Tilt (subtle) ---
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -1.5;
      const rotateY = (x - centerX) / centerX * 1.5;

      card.style.transform = `translateY(-4px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // --- Cursor Glow Effect (desktop only) ---
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(glow);

    let glowVisible = false;

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      if (!glowVisible) {
        glow.style.opacity = '1';
        glowVisible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      glowVisible = false;
    });
  }

  // --- Impact Value Animation (case study pages) ---
  const impactValues = document.querySelectorAll('.impact-item__value');

  const impactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        // Animate opacity and scale
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        el.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        });

        impactObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  impactValues.forEach(el => impactObserver.observe(el));

  // --- Staggered list item reveal ---
  const detailLists = document.querySelectorAll('.timeline-item__detail-list, .learned-block ul');

  detailLists.forEach(list => {
    const items = list.querySelectorAll('li');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(8px)';
      item.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;
    });

    const listObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('li');
          items.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
          listObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    listObserver.observe(list);
  });

  // --- Skill item stagger on hover ---
  document.querySelectorAll('.skill-group').forEach(group => {
    const items = group.querySelectorAll('.skill-item');
    group.addEventListener('mouseenter', () => {
      items.forEach((item, i) => {
        item.style.transitionDelay = `${i * 30}ms`;
      });
    });
    group.addEventListener('mouseleave', () => {
      items.forEach(item => {
        item.style.transitionDelay = '0ms';
      });
    });
  });

})();
