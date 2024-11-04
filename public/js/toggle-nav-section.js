(() => {
  const btnToggleGroupContext = document.querySelector('#header-btn-toggle');
  const context = document.querySelector('#nav-section');

  btnToggleGroupContext.addEventListener('click', () => {
    if (context) {
      context.classList.toggle('slide-section--close');
      context.classList.toggle('page-layout__section');
    }
  });
})();
