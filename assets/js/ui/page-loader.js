/* Shared page-entry and navigation loading animation for JFT Basic */
(() => {
  'use strict';
  const loader = document.getElementById('jft-page-loader');
  if (!loader) return;

  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const entryStartedAt = Date.now();
  let navigating = false;

  function show(message) {
    const label = loader.querySelector('.jft-loader-message');
    if (label && message) label.textContent = message;
    loader.classList.remove('is-leaving');
    loader.setAttribute('aria-hidden', 'false');
  }

  function hide() {
    loader.classList.add('is-leaving');
    loader.setAttribute('aria-hidden', 'true');
  }

  // Keep the themed loader visible briefly on each page entry to make the
  // transition intentional, but never wait for network requests indefinitely.
  function finishEntry() {
    const minVisible = reducedMotion ? 0 : 620;
    const wait = Math.max(0, minVisible - (Date.now() - entryStartedAt));
    window.setTimeout(hide, wait);
  }

  if (document.readyState === 'complete') finishEntry();
  else window.addEventListener('load', finishEntry, { once: true });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.hasAttribute('download') || link.target && link.target !== '_self') return;

    let destination;
    try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash) return;
    if (destination.href === window.location.href) return;

    navigating = true;
    show('Menyiapkan halaman berikutnya…');
    if (reducedMotion) return;
    event.preventDefault();
    window.setTimeout(() => { window.location.href = destination.href; }, 190);
  }, true);

  // Covers JS-driven navigation (window.location / form submit redirects).
  window.addEventListener('beforeunload', () => {
    if (!navigating) show('Menyiapkan halaman berikutnya…');
  });

  // Restore a clean state when returning through the browser back-forward cache.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      navigating = false;
      hide();
    }
  });

  // Optional hook for app code that initiates a navigation after async work.
  window.JFTPageLoader = {
    show: (message) => show(message || 'Menyiapkan halaman berikutnya…'),
    hide
  };
})();