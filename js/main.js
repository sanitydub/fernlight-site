/* ==========================================================================
   Fernlight: behaviour
   1. Light/dark toggle (remembers the visitor's choice)
   2. Keeps section links clear of the sticky top bar
   3. Highlights the current section in the nav
   4. Scroll-motion fallback for browsers without CSS scroll-driven animations
   5. Waitlist form "coming soon" message
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_KEY = 'fernlight-theme';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Theme ---------- */
  var toggle = document.querySelector('[data-theme-toggle]');

  function storedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      var label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
    }
  }

  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }

  // Follow the system setting until the visitor picks one themselves
  var systemLight = window.matchMedia('(prefers-color-scheme: light)');
  var onSystemChange = function (e) {
    var saved = storedTheme();
    if (saved !== 'light' && saved !== 'dark') applyTheme(e.matches ? 'light' : 'dark');
  };
  if (systemLight.addEventListener) systemLight.addEventListener('change', onSystemChange);
  else if (systemLight.addListener) systemLight.addListener(onSystemChange);

  /* ---------- 2. Top bar height → scroll offset ---------- */
  var topbar = document.querySelector('.topbar');
  function syncHeaderHeight() {
    if (topbar) root.style.setProperty('--header-h', topbar.offsetHeight + 'px');
  }
  syncHeaderHeight();
  if (topbar && 'ResizeObserver' in window) new ResizeObserver(syncHeaderHeight).observe(topbar);
  else window.addEventListener('resize', syncHeaderHeight);

  /* ---------- 3. Active section in the nav ---------- */
  var navLinks = document.querySelectorAll('.nav .navlink');
  var sectionIds = ['top', 'make', 'grow', 'note', 'waitlist'];

  function setActive(id) {
    navLinks.forEach(function (link) {
      var on = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
  }
  setActive('top');

  /* ---------- 4. Scroll motion ---------- */
  // Section reveals: Chromium and Safari 26+ use native CSS; others get the
  // IntersectionObserver fallback below.
  var nativeScrollMotion = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');

  if (!nativeScrollMotion && !reduceMotion) {
    root.classList.add('no-sdt');

    var targets = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      targets.forEach(function (el) { revealObserver.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  // Reading progress and hero parallax run from here in every browser:
  // Safari's native scroll() timelines jump backwards whenever a new swipe
  // starts, which made the progress line under the top bar flicker.
  var ticking = false;
  var update = function () {
    ticking = false;
    var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (!reduceMotion) root.style.setProperty('--hero-p', Math.min(1, y / 900).toFixed(4));
    root.style.setProperty('--read', Math.min(1, y / max).toFixed(4));
  };
  var onScroll = function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- 5. Waitlist (Buttondown) ---------- */
  // The form posts to Buttondown in a new tab (their docs require a real form
  // submit, so they can show a CAPTCHA or error page if needed).
  var form = document.querySelector('[data-waitlist]');
  var status = document.querySelector('[data-form-status]');
  if (form && status) {
    var email = form.querySelector('input[type="email"]');
    var connected = form.getAttribute('action').indexOf('[BUTTONDOWN') === -1;

    form.addEventListener('submit', function (e) {
      if (!connected) {
        e.preventDefault();
        status.textContent = 'The waitlist isn’t open yet, so nothing was sent. Please check back soon.';
        return;
      }
      if (email && !email.checkValidity()) {
        e.preventDefault();
        status.textContent = 'Please enter a valid email address, like you@example.com.';
        email.focus();
        return;
      }
      // Let the browser submit, then confirm on this page
      status.textContent = 'Almost done. Buttondown opened in a new tab and sent you an email. Click the link in it to confirm your spot.';
      setTimeout(function () { form.reset(); }, 0);
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
