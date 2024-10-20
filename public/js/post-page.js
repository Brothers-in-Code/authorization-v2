(() => {
  const btnCommentList = document.querySelectorAll('.btn-comment');
  const commentModal = document.getElementById('commentModal');
  const reportCommentModal = document.getElementById('reportCommentModal');

  const textCommentModal = document.getElementById('textCommentModal');
  const btnSaveCommentModal = document.getElementById('btnSaveCommentModal');
  const btnSaveReport = document.getElementById('btnSaveReport');

  const commentMap = new Map();

  if (btnCommentList) {
    btnCommentList.forEach((btn) => {
      btn.addEventListener('click', () => {
        textCommentModal.value = commentMap.get(btn.dataset.wsPostId) || '';
        textCommentModal.dataset.wsPostId = btn.dataset.wsPostId;
      });
    });
  }
  if (btnSaveCommentModal) {
    btnSaveCommentModal.addEventListener('click', () => {
      const comment = textCommentModal.value;
      const postId = textCommentModal.dataset.wsPostId;
      textCommentModal.value = '';
      commentMap.set(postId, comment);
    });
  }

  // TODO добавить обработку then и сообщение о сохранении
  if (btnSaveReport) {
    btnSaveReport.addEventListener('click', () => {
      const comments = formatCommentsData(commentMap);
      //   fetchWSData({
      //     likesMin: commentModal.dataset.wsLikesMin,
      //     viewsMin: commentModal.dataset.wsViewsMin,
      //     begDate: commentModal.dataset.wsBegDate,
      //     endDate: commentModal.dataset.wsEndDate,
      //     comments,
      //   });
    });
  }

  function formatCommentsData(map) {
    return Array.from(map.entries()).map(([id, text]) => {
      return {
        post_id: Number(id),
        text,
      };
    });
  }
})();

(() => {
  const checkboxNewReportPostModal = document.getElementById(
    'isNewReportPostModal',
  );
  const fieldSetNewReportPostModal =
    document.getElementById('newReportPostModal');

  if (checkboxNewReportPostModal) {
    isNewReportPostModal.addEventListener('click', () => {
      if (checkboxNewReportPostModal.checked) {
        fieldSetNewReportPostModal.classList.remove('close');
      } else {
        fieldSetNewReportPostModal.classList.add('close');
      }
    });
  }
})();
