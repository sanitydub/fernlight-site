/* ==========================================================================
   Fernlight: behaviour
   0. Starts at the top on reload
   1. Keeps section links clear of the sticky nav
   2. Waitlist form (Buttondown)
   3. Footer year
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 0. Reload → back to the top ---------- */
  // A reload always starts at the top so the hero animation is seen. A fresh
  // visit to a link like /#waitlist still jumps to that section.
  var navEntry = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (navEntry && navEntry.type === 'reload' && location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  /* ---------- 1. Nav height → scroll offset ---------- */
  var navBar = document.querySelector('.nav-bar');
  function syncNavHeight() {
    if (navBar) root.style.scrollPaddingTop = (navBar.offsetHeight + 8) + 'px';
  }
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight, { passive: true });

  // Hairline under the nav once the page has scrolled
  if (navBar) {
    var onScroll = function () {
      navBar.style.borderBottomColor = window.scrollY > 8 ? 'var(--line)' : 'transparent';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 2. Waitlist (Buttondown) ---------- */
  // The form posts to Buttondown in a new tab (their docs require a real form
  // submit, so they can show a CAPTCHA or error page if needed).
  var form = document.querySelector('[data-waitlist]');
  var status = document.querySelector('[data-form-status]');
  if (form && status) {
    var email = form.querySelector('input[type="email"]');
    form.addEventListener('submit', function (e) {
      if (email && !email.checkValidity()) {
        e.preventDefault();
        status.textContent = 'Please enter a valid email address, like you@example.com.';
        email.focus();
        return;
      }
      status.textContent = 'Almost done. Check your inbox and click the link in our email to confirm your spot on the Frond waitlist.';
      setTimeout(function () { form.reset(); }, 0);
    });
  }

  /* ---------- 3. Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
