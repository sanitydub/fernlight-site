/* ==========================================================================
   Fernlight: behaviour
   1. Light/dark toggle (remembers the visitor's choice)
   2. Keeps section links clear of the sticky top bar
   3. Highlights the current section in the nav
   4. Scroll motion: section reveals, reading progress, hero parallax
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
  // Section reveals: the same time-based fade in every browser, triggered by
  // an IntersectionObserver as each element enters the screen.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('js-motion');

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

  // Reading progress and hero parallax, written straight onto those elements
  // (compositor-only properties) so a scroll frame triggers no page-wide style
  // or layout work. Safari's native scroll() timelines jumped backwards on each
  // new swipe, so this runs in every browser.
  var bar = document.querySelector('.progress span');
  var leaves = [
    [document.querySelector('.leaf1'), -40],
    [document.querySelector('.leaf2'), -96],
    [document.querySelector('.leaf3'), -24]
  ];
  var maxScroll = 1;
  var measure = function () {
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  };
  var lastHero = -1;
  var ticking = false;
  var update = function () {
    ticking = false;
    var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
    if (bar) bar.style.transform = 'scaleX(' + Math.min(1, y / maxScroll).toFixed(4) + ')';
    var hero = Math.min(1, y / 900);
    if (!reduceMotion && hero !== lastHero) {
      lastHero = hero;
      leaves.forEach(function (l) {
        if (l[0]) l[0].style.translate = '0 ' + (hero * l[1]).toFixed(1) + 'px';
      });
    }
  };
  var onScroll = function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);
  measure();
  update();

  // Pause looping animations (fern, glow, orbit, waitlist leaves) while their
  // section is off screen, so they cost nothing there.
  if ('IntersectionObserver' in window) {
    var loopObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
      });
    });
    document.querySelectorAll('.hero-leaves, .tile-rings, .cta').forEach(function (el) {
      loopObserver.observe(el);
    });
  }

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
