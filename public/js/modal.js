(() => {
  const btnCommentList = document.querySelectorAll('.btn-comment');
  const commentModal = document.getElementById('commentModal');
  const textCommentModal = document.getElementById('textCommentModal');
  const btnSaveCommentModal = document.getElementById('btnSaveCommentModal');
  const btnSaveComments = document.getElementById('btnSaveComments');

  const commentMap = new Map();

  if (btnCommentList) {
    btnCommentList.forEach((btn) => {
      btn.addEventListener('click', () => {
        textCommentModal.value = commentMap.get(btn.dataset.wsCommentId) || '';
        textCommentModal.dataset.wsCommentId = btn.dataset.wsCommentId;
      });
    });
  }

  if (btnSaveCommentModal) {
    btnSaveCommentModal.addEventListener('click', () => {
      const comment = textCommentModal.value;
      const commentId = textCommentModal.dataset.wsCommentId;
      textCommentModal.value = '';
      commentMap.set(commentId, comment);
    });
  }

  if (btnSaveComments) {
    btnSaveComments.addEventListener('click', () => {
      const comments = formatCommentsData(commentMap);
      console.log(commentModal.dataset.wsLikesMin);
      fetchWSData({
        likesMin: commentModal.dataset.wsLikesMin,
        viewsMin: commentModal.dataset.wsViewsMin,
        begDate: commentModal.dataset.wsBegDate,
        endDate: commentModal.dataset.wsEndDate,
        comments,
      });
    });
  }

  function formatCommentsData(map) {
    return Array.from(map.entries()).map(([id, text]) => {
      return {
        id: Number(id),
        text,
      };
    });
  }
})();
