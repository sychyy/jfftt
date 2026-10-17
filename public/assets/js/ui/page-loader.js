/* Shared minimal loading animation for JFT Basic pages. */
(() => {
  'use strict';
  const loader = document.getElementById('jft-page-loader');
  if (!loader) return;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const entryStartedAt = Date.now();
  let navigating = false;
  function show() {
    loader.classList.remove('is-leaving');
    loader.setAttribute('aria-hidden', 'false');
  }
  function hide() {
    loader.classList.add('is-leaving');
    loader.setAttribute('aria-hidden', 'true');
  }
  function finishEntry() {
    const minVisible = reducedMotion ? 0 : 420;
    window.setTimeout(hide, Math.max(0, minVisible - (Date.now() - entryStartedAt)));
  }
  if (document.readyState === 'complete') finishEntry();
  else window.addEventListener('load', finishEntry, { once: true });
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    let destination;
    try { destination = new URL(link.href, window.location.href); } catch (_) { return; }
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;
    if (destination.href === window.location.href) return;
    navigating = true;
    show();
    if (reducedMotion) return;
    event.preventDefault();
    window.setTimeout(() => { window.location.href = destination.href; }, 140);
  }, true);
  window.addEventListener('beforeunload', () => { if (!navigating) show(); });
  window.addEventListener('pageshow', (event) => { if (event.persisted) { navigating = false; hide(); } });
  window.JFTPageLoader = { show, hide };
})();
