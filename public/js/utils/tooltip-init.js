// TODO удалять из DOM тултип при обновлении
// NOTE инициализация tooltip
(() => {
  init();

  document.addEventListener('reload-main', () => {
    init();
  });

  function init() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );

    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    );
  }
})();
