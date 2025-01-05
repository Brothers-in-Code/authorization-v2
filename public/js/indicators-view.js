(() => {
  const indicatorsViewModal = document.getElementById('indicators-view');
  const content = indicatorsViewModal.querySelector('.view-modal__content');
  const btnClose = indicatorsViewModal.querySelector('.js-btn-close');
  const btnOpenList = document.querySelectorAll('.js-btn-indicators-view');
  const chartCanvas = document.getElementById('js-indicators-chart');

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      indicatorsViewModal.classList.add('view-modal--hide');
    });
  }

  if (btnOpenList.length > 0) {
    btnOpenList.forEach((btn) => {
      btn.addEventListener('click', () => {
        openChart('test title');
      });
    });
  }

  // note для тестов
  const labels = [
    '01.01.2024 12:00',
    '01.01.2024 13:00',
    '01.01.2024 14:00',
    '01.01.2024 15:00',
    '02.01.2024',
    '03.01.2024',
    '04.01.2024',
    '05.01.2024',
    '06.01.2024',
    '07.01.2024',
  ];

  const data = [
    {
      label: 'likes',
      data: [1, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      label: 'views',
      data: [10, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    {
      label: 'comments',
      data: [2, 3, 7, 9, 9, 9, 9, 9, 15],
    },
    {
      label: 'reposts',
      data: [2, 5, 6, 9, 9, 9, 9, 9, 12],
    },
  ];

  function openChart(title) {
    indicatorsViewModal.classList.remove('view-modal--hide');
    const header = createHeader(title);
    content.replaceChildren(header);
    const chart = createChart(chartCanvas, labels, data);

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        chart.destroy();
      });
    }
  }

  function createChart(ctx, labels, datasets) {
    Chart.defaults.datasets.line.borderWidth = 1;
    Chart.defaults.plugins.legend.position = 'right';
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createHeader(text) {
    const header = createEl('div');
    const title = createEl('h2');

    title.textContent = text;
    title.classList.add('view-modal__title');

    header.append(title);
    return header;
  }
  function createEl(el) {
    return document.createElement(el);
  }
})();
