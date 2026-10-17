/* Shared responsive navigation for JFT Kanji. Adds navigation only; app logic is unchanged. */
(() => {
  const links = [
    { href: 'home.html', icon: '⌂', label: 'Home', key: ['home.html'] },
    { href: 'quiz.html', icon: '✎', label: 'Latihan', key: ['quiz.html', 'result.html'] },
    { href: 'kanji.html', icon: '文', label: 'Kanji', key: ['kanji.html', 'kamus-kanji.html'] },
    { href: 'flashcards.html', icon: '▤', label: 'Flashcard', key: ['flashcards.html'] },
    { href: 'history.html', icon: '◷', label: 'Riwayat', key: ['history.html'] },
    { href: 'war.html', icon: '✦', label: 'Kanji War', key: ['war.html', 'war-quiz.html', 'war-result.html'] }
  ];
  const file = (location.pathname.split('/').pop() || 'home.html').toLowerCase();
  const active = item => item.key.includes(file);
  const makeLink = (item, mobile = false) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = `pp-nav-link${active(item) ? ' is-active' : ''}${mobile ? ' pp-mobile-link' : ''}`;
    a.setAttribute('aria-label', item.label);
    if (active(item)) a.setAttribute('aria-current', 'page');
    const icon = document.createElement('span'); icon.className = 'pp-nav-icon'; icon.setAttribute('aria-hidden', 'true'); icon.textContent = item.icon;
    const label = document.createElement('span'); label.className = 'pp-nav-label'; label.textContent = item.label;
    a.append(icon, label);
    return a;
  };
  const build = () => {
    if (document.querySelector('.pp-desktop-nav')) return;
    const desktop = document.createElement('nav');
    desktop.className = 'pp-desktop-nav'; desktop.setAttribute('aria-label', 'Navigasi utama');
    const brand = document.createElement('a'); brand.className = 'pp-nav-brand'; brand.href = 'home.html';
    const logo = document.createElement('span'); logo.className = 'pp-nav-logo'; logo.textContent = '文';
    const name = document.createElement('span'); name.className = 'pp-nav-brand-name'; name.textContent = 'JFT KANJI';
    brand.append(logo, name);
    const navLinks = document.createElement('div'); navLinks.className = 'pp-nav-links';
    links.forEach(item => navLinks.appendChild(makeLink(item)));
    desktop.append(brand, navLinks);
    const header = document.querySelector('body > header, #app > header, main > header');
    if (header && header.parentNode) header.parentNode.insertBefore(desktop, header.nextSibling);
    else document.body.insertBefore(desktop, document.body.firstChild);

    const mobile = document.createElement('nav'); mobile.className = 'pp-mobile-nav'; mobile.setAttribute('aria-label', 'Navigasi bawah');
    links.filter(item => item.label !== 'Flashcard').forEach(item => mobile.appendChild(makeLink(item, true)));
    document.body.appendChild(mobile);
    document.body.classList.add('pp-nav-enabled');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build, { once: true });
  else build();
})();
