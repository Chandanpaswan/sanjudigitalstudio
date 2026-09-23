/* ============================================================
   SANJU DIGITAL STUDIO — main.js
   Global JS: Nav, Parallax, Stars, Scroll Reveal,
   Stat Counters, Gallery Filter, Touch Lightbox, Form,
   Mobile Features
   ============================================================ */

(function () {
  'use strict';

  /* ── HELPERS ─────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const isMobile = () => window.innerWidth <= 768;

  /* ── NAV TOGGLE (mobile — full screen menu) ──────────── */
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });
    // Close on link click
    $$('a', navLinks).forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
        document.body.style.overflow = '';
      });
    });
  }

  /* Navbar scroll: transparent → solid */
  const navbar = $('#navbar');
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      navbar.style.background = y > 60
        ? 'rgba(8,8,8,0.97)'
        : 'rgba(8,8,8,0.85)';
      lastScroll = y;
    }, { passive: true });
  }

  /* ── HERO PARALLAX (disabled on mobile for perf) ──────── */
  const heroBg = $('#heroBg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (!isMobile()) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    }, { passive: true });
  }

  /* ── SHOOTING STARS (canvas — skip on mobile for perf) ── */
  const canvas = $('#starsCanvas');
  if (canvas && !isMobile()) {
    const ctx = canvas.getContext('2d');
    let W, H, stars = [], shooters = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Static stars
    for (let i = 0; i < 160; i++) {
      stars.push({
        x: Math.random(), y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.0004 + 0.0001,
        phase: Math.random() * Math.PI * 2
      });
    }

    function spawnShooter() {
      shooters.push({
        x: Math.random() * W, y: Math.random() * H * 0.5,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 5, life: 1,
        decay: Math.random() * 0.015 + 0.01,
        hue: 40 + Math.random() * 30
      });
    }
    setInterval(spawnShooter, 1800);

    let then = performance.now();
    function draw(now) {
      const dt = (now - then) / 16.67;
      then = now;
      ctx.clearRect(0, 0, W, H);

      stars.forEach(s => {
        s.phase += s.speed * dt;
        const alpha = s.a * (0.6 + 0.4 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,150,${alpha})`;
        ctx.fill();
      });

      shooters = shooters.filter(s => s.life > 0);
      shooters.forEach(s => {
        const cx = Math.cos(s.angle);
        const cy = Math.sin(s.angle);
        const grad = ctx.createLinearGradient(s.x, s.y, s.x - cx * s.len, s.y - cy * s.len);
        grad.addColorStop(0, `hsla(${s.hue},100%,80%,${s.life})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - cx * s.len, s.y - cy * s.len);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();
        s.x += cx * s.speed * dt;
        s.y += cy * s.speed * dt;
        s.life -= s.decay * dt;
      });

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ── SCROLL REVEAL ───────────────────────────────────── */
  const revealEls = $$('.reveal, .reveal-left, .reveal-right, .gold-underline');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── ANIMATED STAT COUNTERS ──────────────────────────── */
  const statEls = $$('.stat-number[data-target]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        const target = parseInt(e.target.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          const value = Math.floor(eased * target);
          e.target.textContent = value >= 1000
            ? (value >= 10000 ? (value / 1000).toFixed(0) + 'K+' : value.toLocaleString('en-IN') + '+')
            : value + (progress >= 1 && target < 100 ? '+' : '');
          if (progress < 1) requestAnimationFrame(step);
          else e.target.textContent = target >= 10000
            ? (target / 1000).toFixed(0) + 'K+'
            : target < 100 ? target + '+' : target.toLocaleString('en-IN') + '+';
        }
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.3 });

  statEls.forEach(el => countObserver.observe(el));

  /* ── GALLERY FILTER ──────────────────────────────────── */
  const filterBtns = $$('.filter-btn');
  const galleryItems = $$('.gal-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
          const cat = item.dataset.category;
          if (filter === 'all' || cat === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ── LIGHTBOX (Touch Swipe Support) ────────────────────── */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCaption = $('#lbCaption');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');

  if (lightbox && galleryItems.length) {
    let currentIdx = 0;
    let visibleItems = () => galleryItems.filter(i => i.style.display !== 'none');

    function openLightbox(idx) {
      const items = visibleItems();
      currentIdx = idx;
      const item = items[currentIdx];
      if (!item) return;
      const img = item.querySelector('img');
      const title = item.dataset.title || '';
      const sub = item.dataset.sub || '';
      lbImg.src = img.src;
      lbImg.alt = img.alt || 'Photography portfolio Faridabad';
      lbCaption.textContent = title + (sub ? ' — ' + sub : '');
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function prevImage() {
      const vis = visibleItems();
      currentIdx = (currentIdx - 1 + vis.length) % vis.length;
      openLightbox(currentIdx);
    }

    function nextImage() {
      const vis = visibleItems();
      currentIdx = (currentIdx + 1) % vis.length;
      openLightbox(currentIdx);
    }

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const vis = visibleItems();
        const visIdx = vis.indexOf(item);
        openLightbox(visIdx);
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    if (lbPrev) lbPrev.addEventListener('click', prevImage);
    if (lbNext) lbNext.addEventListener('click', nextImage);

    // Keyboard nav
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });

    // TOUCH SWIPE support for lightbox
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const absDX = Math.abs(deltaX);
      const absDY = Math.abs(deltaY);

      if (absDX > 50 && absDX > absDY) {
        // Horizontal swipe
        if (deltaX > 0) prevImage(); // swipe right → prev
        else nextImage();            // swipe left  → next
      } else if (absDY > 80) {
        // Vertical swipe = close
        closeLightbox();
      }
    }, { passive: true });
  }

  /* ── CONTACT FORM ────────────────────────────────────── */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = $('#fname', this)?.value.trim();
      const phone = $('#fphone', this)?.value.trim();
      const service = $('#fservice', this)?.value;
      const msg = $('#fmsg', this)?.value.trim();

      if (!name || !phone || !service || !msg) {
        alert('Please fill in all required fields (Name, Phone, Service, Message).');
        return;
      }

      // Simulate submission
      const btn = this.querySelector('.form-submit');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        const successEl = $('#formSuccess');
        if (successEl) {
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        contactForm.reset();
      }, 1500);
    });
  }

  /* ── SMOOTH PAGE TRANSITION ──────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('tel:') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('https://wa.me') &&
      !link.classList.contains('call-btn') &&
      !link.classList.contains('wa-btn-bar')
    ) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.25s ease';
        setTimeout(() => { window.location.href = href; }, 260);
      });
    }
  });

  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  /* ── FILTER BAR HORIZONTAL SCROLL (mobile) ──────────── */
  const filterBar = $('.filter-bar');
  if (filterBar && isMobile()) {
    filterBar.style.overflowX = 'auto';
    filterBar.style.flexWrap = 'nowrap';
    filterBar.style.WebkitOverflowScrolling = 'touch';
    filterBar.style.scrollbarWidth = 'none';
    filterBar.style.msOverflowStyle = 'none';
  }

  /* ── DAY / NIGHT MODE TOGGLE ──────────────────────────── */
  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    // Restore saved preference
    const saved = localStorage.getItem('sanju-theme');
    if (saved === 'day') {
      document.body.classList.add('day-mode');
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('day-mode');
      const isDayMode = document.body.classList.contains('day-mode');
      localStorage.setItem('sanju-theme', isDayMode ? 'day' : 'night');
    });
  }

})();
