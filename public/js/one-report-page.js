(() => {
  const textareaPostComment = document.querySelectorAll('.js-post-comment');

  const btnSaveReportData = document.getElementById('btn-save-report-data');
  const btnDeleteCommentList = document.querySelectorAll(
    '.js-btn-delete-comment',
  );
  const btnSaveCommentList = document.querySelectorAll('.js-btn-save-comment');

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

  if (btnDeleteCommentList) {
    btnDeleteCommentList.forEach((btn) => {
      const commentId = btn.dataset.commentId;
      btn.addEventListener('click', () => {
        fetchWSData({ commentId }, 'delete').then(() => {
          window.location.reload();
        });
      });
    });
  }
})();
