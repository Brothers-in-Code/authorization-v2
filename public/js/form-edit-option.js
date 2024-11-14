(() => {
  init();

  document.addEventListener('reload-main', () => {
    init();
  });

  function init() {
    const form = document.querySelector('.form--edit-option');
    const editButton = form.querySelector('.btn-flow');
    const submitButton = form.querySelector('button[type="submit"]');

    editButton.addEventListener('click', () => {
      const elementForEditList = form.querySelectorAll(
        'input, textarea, select',
      );

      elementForEditList.forEach((el) => {
        el.removeAttribute('disabled');
      });

      elementForEditList.forEach((el) => {
        const eventName = el.tagName == 'select' ? 'change' : 'input';
        el.addEventListener(eventName, () => {
          submitButton.removeAttribute('disabled');
        });
      });

      editButton.setAttribute('disabled', true);
    });
  }
})();
