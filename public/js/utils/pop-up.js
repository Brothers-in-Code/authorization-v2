(() => {
  const root = document.querySelector('#root');
  const popup = document.getElementById('js-pop-up');

  if (root && popup) {
    const btnClose = popup.querySelector('.pop-up__btn-close');

    btnClose.addEventListener('click', () => {
      popup.classList.add('pop-up--hide');
    });

    root.addEventListener('new-message', (event) => {
      showPopup(popup, event.detail.message);
      hidePopup(popup);
    });
  }

  function showPopup(popup, message) {
    const title = popup.querySelector('.pop-up__title');
    const body = popup.querySelector('.pop-up__body');
    title.textContent = 'Сообщение';
    body.textContent = message;
    popup.classList.remove('pop-up--hide');
  }

  function hidePopup(popup) {
    setTimeout(() => {
      popup.classList.add('pop-up--hide');
    }, 5000);
  }
})();
