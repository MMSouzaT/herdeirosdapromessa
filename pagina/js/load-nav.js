document.addEventListener('DOMContentLoaded', () => {
  const includeEls = document.querySelectorAll('[data-include="nav"]');
  if (!includeEls.length) return;

  includeEls.forEach(async (el) => {
    try {
      const resp = await fetch('/pagina/includes/nav.html');
      if (!resp.ok) {
        console.error('Failed to load nav include:', resp.status);
        return;
      }
      const html = await resp.text();
      el.innerHTML = html;

      // Initialize icons for injected content
      if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();

      // Mobile toggle inside the injected nav
      const mobileToggle = el.querySelector('#mobile-menu-toggle');
      const mobileMenu = el.querySelector('#mobile-menu');
      const menuOpenIcon = el.querySelector('#menu-open');
      const menuCloseIcon = el.querySelector('#menu-close');

      if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
          if (menuOpenIcon) menuOpenIcon.classList.toggle('hidden');
          if (menuCloseIcon) menuCloseIcon.classList.toggle('hidden');
        });
      }
    } catch (err) {
      console.error('Error loading nav include:', err);
    }
  });
});
