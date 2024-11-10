(() => {
  const btnSaveReportData = document.getElementById('btn-save-report-data');
  const btnDeleteCommentList = document.querySelectorAll(
    '.js-btn-delete-comment',
  );
  const btnSaveCommentList = document.querySelectorAll('.js-btn-save-comment');
  const textareaPostComment = document.querySelectorAll('.js-post-comment');

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
      btn.addEventListener('click', () => {
        const url = btn.dataset.wsUrl;
        const commentId = btn.dataset.wsCommentId;
        fetch(url, {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentId }),
        }).then((res) => {
          if (res.ok) {
            document.location.reload();
          }
        });
      });
    });
  }
})();
