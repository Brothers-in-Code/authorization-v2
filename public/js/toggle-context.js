(() => {
  const btnToggleGroupContext = document.querySelector('#context-btn-toggle');
  const context = document.querySelector('#context');

  btnToggleGroupContext.addEventListener('click', () => {
    if (context) {
      context.classList.toggle('context--close');
    }
  });
})();
