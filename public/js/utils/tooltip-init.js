// NOTE инициализация tooltip
(() => {
  const root = document.querySelector('#root');

  if (root) {
    root.addEventListener('reload-main', () => {
      init();
    });
  }
  init();
  function init() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );

    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    );
  }
})();
