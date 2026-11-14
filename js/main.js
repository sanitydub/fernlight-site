/* ==========================================================================
   Fernlight: behaviour
   1. Sticky nav: scroll offset and background once scrolled
   2. Fade sections in as they scroll into view
   3. Inkwell preview: Write / Split / Read switch
   4. Updates signup form (Buttondown)
   5. Footer year
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 1. Nav ---------- */
  var navBar = document.querySelector('[data-nav]');
  function syncNavHeight() {
    if (!navBar) return;
    root.style.scrollPaddingTop = (navBar.offsetHeight + 8) + 'px';
    root.style.setProperty('--nav-h', navBar.offsetHeight + 'px');
  }
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight, { passive: true });

  if (navBar) {
    var onScroll = function () { navBar.classList.toggle('scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 3. Inkwell preview: Write / Split / Read ---------- */
  var ink = document.querySelector('[data-ink]');
  if (ink) {
    var views = ink.querySelectorAll('button[data-view]');
    views.forEach(function (b) {
      b.addEventListener('click', function () {
        var view = b.getAttribute('data-view');
        ink.setAttribute('data-view', view);
        views.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      });
    });
  }

  /* ---------- 4. Updates signup (Buttondown) ---------- */
  // The form posts to Buttondown in a new tab (their docs require a real form
  // submit, so they can show a CAPTCHA or error page if needed).
  var form = document.querySelector('[data-signup]');
  var status = document.querySelector('[data-form-status]');
  if (form && status) {
    var email = form.querySelector('input[type="email"]');
    form.addEventListener('submit', function (e) {
      if (form.action.indexOf('[BUTTONDOWN USERNAME]') !== -1) {
        e.preventDefault();
        status.textContent = 'Signups open soon. Please check back shortly.';
        return;
      }
      if (email && !email.checkValidity()) {
        e.preventDefault();
        status.textContent = 'Please enter a valid email address, like you@example.com.';
        email.focus();
        return;
      }
      status.textContent = 'Almost done. Finish signing up in the tab that just opened, then confirm your subscription using the link in our email.';
      setTimeout(function () { form.reset(); }, 0);
    });
  }

  /* ---------- 5. Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
