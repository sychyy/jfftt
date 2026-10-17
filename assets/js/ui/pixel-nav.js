/* JFT Kanji responsive navigation: desktop top bar + mobile side drawer. */
(() => {
  'use strict';
  if (window.__JFT_PIXEL_NAV_INITIALIZED__) return;
  window.__JFT_PIXEL_NAV_INITIALIZED__ = true;

  const links = [
    { href: 'home.html', icon: '⌂', label: 'Beranda', key: ['home.html'] },
    { href: 'quiz.html', icon: '✎', label: 'Latihan', key: ['quiz.html', 'result.html'] },
    { href: 'kanji.html', icon: '文', label: 'Kanji', key: ['kanji.html', 'kamus-kanji.html'] },
    { href: 'flashcards.html', icon: '▤', label: 'Flashcard', key: ['flashcards.html'] },
    { href: 'history.html', icon: '◷', label: 'Riwayat', key: ['history.html'] },
    { href: 'war.html', icon: '✦', label: 'Kanji War', key: ['war.html', 'war-quiz.html', 'war-result.html'] }
  ];
  const file = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  const isAuth = file === 'index.html' || document.body.dataset.page === 'auth';
  const isAdmin = file === 'admin.html' || document.body.dataset.page === 'admin';
  const active = item => item.key.includes(file);

  const makeLink = (item, mobile = false) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = `pp-nav-link${active(item) ? ' is-active' : ''}${mobile ? ' pp-drawer-link' : ''}`;
    if (active(item)) a.setAttribute('aria-current', 'page');
    const icon = document.createElement('span'); icon.className = 'pp-nav-icon';
    icon.setAttribute('aria-hidden', 'true'); icon.textContent = item.icon;
    const label = document.createElement('span'); label.className = 'pp-nav-label'; label.textContent = item.label;
    a.append(icon, label);
    return a;
  };

  function build() {
    if (document.querySelector('.pp-site-nav')) return;
    const nav = document.createElement('div');
    nav.className = `pp-site-nav${isAuth ? ' pp-auth-nav' : ''}`;
    nav.setAttribute('role', 'region'); nav.setAttribute('aria-label', 'Navigasi JFT Kanji');

    const bar = document.createElement('div'); bar.className = 'pp-nav-bar';
    const brand = document.createElement('a'); brand.className = 'pp-nav-brand'; brand.href = isAuth ? 'index.html' : 'home.html';
    brand.setAttribute('aria-label', 'JFT Kanji — beranda');
    const logo = document.createElement('span'); logo.className = 'pp-nav-logo'; logo.setAttribute('aria-hidden', 'true'); logo.textContent = '文';
    const brandText = document.createElement('span'); brandText.className = 'pp-nav-brand-name'; brandText.textContent = 'JFT KANJI';
    brand.append(logo, brandText);

    const desktopLinks = document.createElement('nav'); desktopLinks.className = 'pp-nav-links';
    desktopLinks.setAttribute('aria-label', 'Navigasi utama');
    if (!isAuth) links.forEach(item => desktopLinks.appendChild(makeLink(item)));

    const actions = document.createElement('div'); actions.className = 'pp-nav-actions';
    if (isAdmin) {
      const adminTag = document.createElement('span'); adminTag.className = 'pp-nav-tag'; adminTag.textContent = 'ADMIN'; actions.appendChild(adminTag);
    }
    const menuButton = document.createElement('button'); menuButton.type = 'button';
    menuButton.className = 'pp-menu-toggle'; menuButton.setAttribute('aria-label', 'Buka menu navigasi');
    menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-controls', 'pp-mobile-drawer');
    menuButton.innerHTML = '<span></span><span></span><span></span>';
    actions.appendChild(menuButton);
    if (isAuth) menuButton.hidden = true;
    // Preserve existing inline logout/history actions while replacing the legacy header shell.
    const legacyHeader = document.querySelector('header#main-header');
    if (legacyHeader && !isAuth) {
      const legacyActions = legacyHeader.querySelector('nav');
      if (legacyActions) {
        Array.from(legacyActions.children).forEach(action => {
          action.classList.add('pp-utility-action');
          actions.insertBefore(action, menuButton);
        });
      }
      legacyHeader.classList.add('pp-legacy-header');
    }
    bar.append(brand, desktopLinks, actions);
    nav.appendChild(bar);

    const backdrop = document.createElement('button'); backdrop.type = 'button'; backdrop.className = 'pp-drawer-backdrop';
    backdrop.setAttribute('aria-label', 'Tutup menu navigasi');
    const drawer = document.createElement('aside'); drawer.id = 'pp-mobile-drawer'; drawer.className = 'pp-mobile-drawer';
    drawer.setAttribute('aria-label', 'Menu navigasi'); drawer.setAttribute('aria-hidden', 'true');
    const drawerHead = document.createElement('div'); drawerHead.className = 'pp-drawer-head';
    const drawerTitle = document.createElement('div'); drawerTitle.className = 'pp-drawer-title';
    const drawerMark = document.createElement('span'); drawerMark.className = 'pp-nav-logo'; drawerMark.textContent = '文';
    const drawerName = document.createElement('span'); drawerName.textContent = 'JFT KANJI';
    drawerTitle.append(drawerMark, drawerName);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'pp-drawer-close'; close.textContent = '×';
    close.setAttribute('aria-label', 'Tutup menu'); drawerHead.append(drawerTitle, close);
    const drawerCaption = document.createElement('p'); drawerCaption.className = 'pp-drawer-caption'; drawerCaption.textContent = 'Pilih pulau belajarmu';
    const drawerLinks = document.createElement('nav'); drawerLinks.className = 'pp-drawer-links'; drawerLinks.setAttribute('aria-label', 'Menu utama');
    if (!isAuth) links.forEach(item => drawerLinks.appendChild(makeLink(item, true)));
    const drawerFoot = document.createElement('div'); drawerFoot.className = 'pp-drawer-foot'; drawerFoot.textContent = '一歩ずつ — Selangkah demi selangkah';
    drawer.append(drawerHead, drawerCaption, drawerLinks, drawerFoot);
    nav.append(backdrop, drawer);

    const openMenu = () => {
      nav.classList.add('is-open'); menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Tutup menu navigasi'); drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('pp-drawer-open'); close.focus();
    };
    const closeMenu = () => {
      nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Buka menu navigasi'); drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pp-drawer-open'); menuButton.focus();
    };
    menuButton.addEventListener('click', () => nav.classList.contains('is-open') ? closeMenu() : openMenu());
    close.addEventListener('click', closeMenu); backdrop.addEventListener('click', closeMenu);
    drawerLinks.addEventListener('click', event => { if (event.target.closest('a')) { nav.classList.remove('is-open'); document.body.classList.remove('pp-drawer-open'); } });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(); });

    const anchor = document.querySelector('body > header:not(.jft-ann-dialog-head)') || document.querySelector('#app > header') || document.querySelector('main > header');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(nav, anchor.nextSibling);
    else document.body.insertBefore(nav, document.body.firstChild);
    document.body.classList.add('pp-nav-enabled');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true });
  else build();
})();
