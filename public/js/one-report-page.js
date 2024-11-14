(() => {
  init();

  function init() {
    const textareaPostComment = document.querySelectorAll('.js-post-comment');

    const btnDeleteCommentList = document.querySelectorAll(
      '.js-btn-delete-comment',
    );
    const btnSaveCommentList = document.querySelectorAll(
      '.js-btn-save-comment',
    );

    if (textareaPostComment) {
      textareaPostComment.forEach((textarea) => {
        const textOriginal = textarea.value;
        const btnSavePostCommentText = document.getElementById(
          textarea.dataset.btnSaveId,
        );

        textarea.addEventListener('input', () => {
          if (textarea.value !== textOriginal) {
            btnSavePostCommentText.removeAttribute('disabled');
          } else {
            btnSavePostCommentText.setAttribute('disabled', true);
          }
        });
      });
    }

    if (btnSaveCommentList) {
      btnSaveCommentList.forEach((btn) => {
        const commentId = btn.dataset.commentId;
        const textarea = document.getElementById(btn.dataset.textareaId);
        btn.addEventListener('click', () => {
          const text = textarea.value;

          fetchWSData({ commentId, comment: text }, 'PATCH')
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              renderMainSection(data);
            })
            .catch((e) => {
              callPopup('Упс. Что-то пошло не так');
              console.log(e);
            });
        });
      });
    }

    if (btnDeleteCommentList) {
      btnDeleteCommentList.forEach((btn) => {
        const commentId = btn.dataset.commentId;
        btn.addEventListener('click', () => {
          fetchWSData({ commentId }, 'delete')
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              renderMainSection(data);
            })
            .catch((e) => {
              callPopup('Упс. Что-то пошло не так');
              console.log(e);
            });
        });
      });
    }
  }

  function renderMainSection(data) {
    const main = document.getElementById('js-section-main');

    if (main) {
      main.innerHTML = data.html;
      init();
      callPopup(data.message);
    }
    document.dispatchEvent(
      new CustomEvent('reload-main', {
        bubbles: true,
      }),
    );
  }
})();
