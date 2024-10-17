(() => {
  const btnToggleGroupContext = document.querySelector(
    '#group-context-btn-toggle',
  );
  const context = document.querySelector('#group-context');

  btnToggleGroupContext.addEventListener('click', () => {
    if (context) {
      context.classList.toggle('context--close');
    }
  });
})();
