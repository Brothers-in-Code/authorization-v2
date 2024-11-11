(() => {
  init();
  const root = document.querySelector('#root');

  if (root) {
    root.addEventListener('reload-main', () => {
      init();
    });
  }

  function init() {
    const textareaList = document.querySelectorAll('textarea');

    textareaList.forEach((textarea) => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    });
  }
})();
