document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!navToggle || !mobileMenu) return;

  const mobileIcon = navToggle.querySelector('i');

  function openNav() {
    mobileMenu.style.display = '';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-xmark text-lg pointer-events-none';
    navToggle.setAttribute('aria-label', 'Cerrar menú');
  }

  function closeNav() {
    mobileMenu.style.display = 'none';
    if (mobileIcon) mobileIcon.className = 'fa-solid fa-bars text-lg pointer-events-none';
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }

  navToggle.addEventListener('click', () => {
    if (mobileMenu.style.display === 'none') openNav();
    else closeNav();
  });

  document.querySelectorAll('.nav-mobile-link').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
});
