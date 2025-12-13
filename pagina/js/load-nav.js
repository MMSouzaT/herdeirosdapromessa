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

      // Gerenciar dropdown de Produtos no desktop
      const produtosBtn = el.querySelector('#produtos-btn');
      const produtosMenu = el.querySelector('#produtos-menu');
      const produtosDropdown = el.querySelector('#produtos-dropdown');

      if (produtosBtn && produtosMenu && produtosDropdown) {
        // Abrir/fechar ao clicar no botão
        produtosBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isOpen = !produtosMenu.classList.contains('opacity-0');
          if (isOpen) {
            produtosMenu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
          } else {
            produtosMenu.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
          }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
          if (!produtosDropdown.contains(e.target)) {
            produtosMenu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
          }
        });
      }
    } catch (err) {
      console.error('Error loading nav include:', err);
    }
  });
});
