/* ==========================================================================
   Fernlight: behaviour
   1. Keeps section links clear of the sticky nav
   2. Waitlist form (Buttondown)
   3. Footer year
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

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
