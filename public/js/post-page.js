(() => {
  (() => {
    const addPostToReportModal = new bootstrap.Modal('#reportPostModal');

    const btnAddPostToReportList = document.querySelectorAll(
      '.js-btn-add-to-report',
    );

    //   NOTE handle button add to report
    if (btnAddPostToReportList) {
      const main = document.querySelector('#main');
      btnAddPostToReportList.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          const params = getDataset();

          params.postId = btn.dataset.wsPostId;
          params.offset = main.dataset.wsOffset;
          params.limit = main.dataset.wsLimit;
          params.keywords = event.target.dataset.keywords;
          setParamsToReportModalForm(params);
          addPostToReportModal.show();
        });
      });
    }

    function setParamsToReportModalForm(params) {
      const form = document.getElementById('reportFormModal');
      for (let [key, value] of Object.entries(params)) {
        console.log(key, value);
        const input = document.createElement('input');
        input.classList.add('hide');
        input.setAttribute('type', 'text');
        input.setAttribute('name', key);
        input.setAttribute('value', value);
        form.append(input);
      }
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
    const form = document.getElementById('form-sort');
    if (form) {
      form.addEventListener('reset', () => {
        window.location.href = `${window.location.pathname}`;
      });
    }

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
    const main = document.querySelector('#main');
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
