(() => {
  // TODO добавить блокировку кнопки "отправить отчет" если не выбран отчет
  (() => {
    const inputPostId = document.getElementById('postIdInputModal');
    const addPostToReportModal = new bootstrap.Modal('#reportPostModal');

    const btnAddPostToReportList = document.querySelectorAll(
      '.js-btn-add-to-report',
    );

    const reportFormModal = document.getElementById('reportFormModal');

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

    //   NOTE handle button add to report
    if (btnAddPostToReportList) {
      btnAddPostToReportList.forEach((btn) => {
        btn.addEventListener('click', () => {
          const postId = btn.dataset.wsPostId;
          inputPostId.setAttribute('value', postId);
          addPostToReportModal.show();
        });
      });
    }

    //   NOTE handle send report
    // TODO добавить обработку then и сообщение о сохранении
    if (btnSendReport) {
      const form = document.getElementById('reportFormModal');
      form.addEventListener('submit', (event) => {
        const dataset = getDataset();

        event.preventDefault();
        const report = serializeForm(event.target);
        fetchWSData({
          ...dataset,
          report,
        }).then((response) => {
          if (response.ok) {
            document.location.reload();
          }
        });
      });
    }

    function serializeForm(formNode) {
      const report = { report: {}, postList: [] };
      const { elements } = formNode;

      Array.from(elements)
        .filter((item) => !!item.name)
        .forEach((element) => {
          const value =
            element.type === 'checkbox' ? element.checked : element.value;
          report.report[element.name] = value;
        });
      return report;
    }

    //  NOTE в данный момент не используется. оставил на будущее
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

  //   NOTE сортировка
  (() => {
    //   NOTE по лайкам
    const btnSortLikes = document.getElementById('likes-btn-sort');
    if (btnSortLikes) {
      btnSortLikes.addEventListener('click', () => {
        const dataset = getDataset();
        const sortParam = changeSortIndex(dataset.sortByLikes);
        dataset.sortByLikes = sortParam;
        setLocationHref(dataset);
      });
    }

    // NOTE по просмотрам
    const btnSortViews = document.getElementById('views-btn-sort');
    if (btnSortViews) {
      btnSortViews.addEventListener('click', () => {
        const dataset = getDataset();
        const sortParam = changeSortIndex(dataset.sortByViews);
        dataset.sortByViews = sortParam;
        setLocationHref(dataset);
      });
    }

    // NOTE по комментариям
    const btnSortComments = document.getElementById('comments-btn-sort');
    if (btnSortComments) {
      btnSortComments.addEventListener('click', () => {
        const dataset = getDataset();
        const sortParam = changeSortIndex(dataset.sortByComments);
        dataset.sortByComments = sortParam;
        setLocationHref(dataset);
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

  function setLocationHref(dataset) {
    const url = window.location.pathname;
    const params = new URLSearchParams(dataset);
    window.location.href = `${url}?${params}`;
  }

  function getDataset() {
    return {
      likesMin: main.dataset.wsLikesMin,
      viewsMin: main.dataset.wsViewsMin,
      begDate: main.dataset.wsBegDate,
      endDate: main.dataset.wsEndDate,
      sortByLikes: main.dataset.wsSortByLikes,
      sortByViews: main.dataset.wsSortByViews,
      sortByComments: main.dataset.wsSortByComments,
    };
  }
})();
