const menu = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');

if (menu && links) {
  menu.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    menu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', () => {
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
      if (menu) menu.setAttribute('aria-expanded', 'false');
    }
  });
});

