(() => {
  // TODO добавить блокировку кнопки "отправить отчет" если не выбран отчет
  (() => {
    const report = { report: {}, postList: [] };
    const commentMap = new Map();
    let reportDetails = {};

    const main = document.getElementById('main');

    const btnCommentList = document.querySelectorAll('.btn-comment');
    const checkboxAddPostToReportList = document.querySelectorAll(
      '.checkbox-add-to-report',
    );

    const reportFormModal = document.getElementById('reportFormModal');
    const textCommentModal = document.getElementById('textCommentModal');

    const btnSaveCommentModal = document.getElementById('btnSaveCommentModal');
    const btnSendReport = document.getElementById('btnSendReport');

    //   NOTE handle report form
    if (reportFormModal) {
      reportFormModal.addEventListener('submit', (e) => {
        e.preventDefault();
        const report = {};

        for (el of e.target) {
          const { name } = el;
          if (name) {
            const { type, value, checked } = el;
            report[name] = isCheckBoxOrRadio(type) ? checked : value;
          }
        }
        reportDetails = report;
      });
    }

    if (btnCommentList) {
      btnCommentList.forEach((btn) => {
        btn.addEventListener('click', () => {
          textCommentModal.value = commentMap.get(btn.dataset.wsPostId) || '';
          textCommentModal.dataset.wsPostId = btn.dataset.wsPostId;
        });
      });
    }

    //   NOTE handle checkbox add to report
    if (checkboxAddPostToReportList) {
      checkboxAddPostToReportList.forEach((checkbox) => {
        checkbox.addEventListener('click', () => {
          const postId = checkbox.dataset.wsPostId;

          if (checkbox.checked) {
            commentMap.set(postId, '');
          } else {
            commentMap.delete(postId);
          }
        });
      });
    }

    //   NOTE handle comment form
    if (btnSaveCommentModal) {
      btnSaveCommentModal.addEventListener('click', () => {
        const comment = textCommentModal.value;
        const postId = textCommentModal.dataset.wsPostId;
        textCommentModal.value = '';
        commentMap.set(postId, comment);
        const checkbox = findRelativeCheckbox(postId);

        if (checkbox) {
          checkbox.setAttribute('checked', 'true');
        }
      });
    }

    //   NOTE handle send report
    // TODO добавить обработку then и сообщение о сохранении
    if (btnSendReport) {
      btnSendReport.addEventListener('click', () => {
        const dataset = getDataset();
        report.postList = formatCommentsData(commentMap);
        report.report = reportDetails;

        fetchWSData({
          ...dataset,
          report,
        }).then((res) => {
          if (res.ok) {
            document.location.reload();
          }
        });
      });
    }

    function findRelativeCheckbox(postId) {
      const checkbox = document.querySelector(
        `.checkbox-add-to-report[data-ws-post-id="${postId}"]`,
      );
      return checkbox;
    }

    function formatCommentsData(map) {
      return Array.from(map.entries()).map(([id, comment]) => {
        return {
          post_id: Number(id),
          comment,
        };
      });
    }

    function isCheckBoxOrRadio(type) {
      return ['checkbox', 'radio'].includes(type);
    }
  })();

  // NOTE  toggle new report form
  (() => {
    const checkboxNewReportPostModal = document.getElementById(
      'isNewReportPostModal',
    );
    const fieldSetNewReportPostModal =
      document.getElementById('newReportPostModal');

    const selectReport = document.getElementById('selectReport');

    if (checkboxNewReportPostModal) {
      isNewReportPostModal.addEventListener('click', () => {
        if (checkboxNewReportPostModal.checked) {
          fieldSetNewReportPostModal.classList.remove('close');
          selectReport.value = 'undefined';
          selectReport.setAttribute('disabled', true);
        } else {
          fieldSetNewReportPostModal.classList.add('close');
          selectReport.removeAttribute('disabled', true);
        }
      });
    }
  })();

  //   NOTE сортировка по лайкам
  (() => {
    const btnSortLikes = document.getElementById('likes-btn-sort');

    if (btnSortLikes) {
      btnSortLikes.addEventListener('click', () => {
        const dataset = getDataset();
        const sortByLikes = changeSortIndex(dataset.sortByLikes);
        dataset.sortByLikes = sortByLikes;
        const url = window.location.pathname;
        const params = new URLSearchParams(dataset);
        console.log(url);

        window.location.href = `${url}?${params}`;
      });
    }
  })();

  //   NOTE utils

  function changeSortIndex(index) {
    let localIndex;
    if (index === '2') {
      localIndex = 0;
    } else {
      localIndex = Number(index) + 1;
    }
    return String(localIndex);
  }

  function getDataset() {
    return {
      likesMin: main.dataset.wsLikesMin,
      viewsMin: main.dataset.wsViewsMin,
      begDate: main.dataset.wsBegDate,
      endDate: main.dataset.wsEndDate,
      sortByLikes: main.dataset.wsSortByLikes,
    };
  }

  // NOTE инициализация tooltip
  (() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    );

    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    );
  })();
})();
