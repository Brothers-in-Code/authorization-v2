(() => {
  const postViewModal = document.getElementById('post-view');
  const content = postViewModal.querySelector('.view-modal__content');
  const btnClose = postViewModal.querySelector('.view-modal__btn-close');
  const btnViewPostList = document.querySelectorAll('.btn-post-view');

  btnClose.addEventListener('click', () => {
    postViewModal.classList.add('view-modal--hide');
  });

  btnViewPostList.forEach((btn) => {
    btn.addEventListener('click', () => {
      const groupName = btn.dataset.wsGroupName;
      const text = btn.dataset.wsText;
      const imgPath = btn.dataset.wsImgPath;

      const header = createHeader(groupName);
      const body = createBody(text, imgPath);

      content.replaceChildren(header, body);
      postViewModal.classList.remove('view-modal--hide');
    });
  });

  function createHeader(text) {
    const header = createEl('div');
    const title = createEl('h2');

    title.textContent = text;
    title.classList.add('view-modal__title');

    header.append(title);
    return header;
  }

  function createBody(text, imgPath) {
    const body = createEl('div');
    const paragraph = createParagraph(text);
    const img = createImg(imgPath);

    body.append(paragraph, img);
    body.classList.add('view-modal__body');
    return body;
  }

  function createParagraph(text) {
    const paragraph = createEl('pre');
    paragraph.textContent = text;
    paragraph.classList.add('view-modal__text');
    return paragraph;
  }

  function createImg(path) {
    const img = createEl('img');
    img.setAttribute('src', path);
    img.classList.add('view-modal__img');
    return img;
  }

  function createEl(el) {
    return document.createElement(el);
  }
})();
