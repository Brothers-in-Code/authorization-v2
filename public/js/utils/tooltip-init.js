// TODO удалять из DOM тултип при обновлении
// NOTE инициализация tooltip
(() => {
  init();

  document.addEventListener('reload-main', () => {
    destroyShownTooltip();
    init();
  });

  function init() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );

    [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    );
  }

  function destroyShownTooltip() {
    const tooltipList = document.querySelectorAll('.tooltip.show');

    tooltipList.forEach((tooltip) => {
      tooltip.remove();
    });
  }
})();
