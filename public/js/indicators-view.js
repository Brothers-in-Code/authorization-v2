(() => {
  const INDICATORS_VIEW_MODAL = document.getElementById('indicators-view');
  const CONTENT = INDICATORS_VIEW_MODAL.querySelector('.view-modal__content');
  const BTN_CLOSE = INDICATORS_VIEW_MODAL.querySelector('.js-btn-close');
  const BTN_OPEN_LIST = document.querySelectorAll('.js-btn-indicators-view');
  const CHART_CANVAS = document.getElementById('js-indicators-chart');

  const dateFormater = Intl.DateTimeFormat('ru-Ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  if (BTN_CLOSE) {
    BTN_CLOSE.addEventListener('click', () => {
      INDICATORS_VIEW_MODAL.classList.add('view-modal--hide');
    });
  }

  if (BTN_OPEN_LIST.length > 0) {
    BTN_OPEN_LIST.forEach((btn) => {
      btn.addEventListener('click', handleBtnOpenClick);
    });
  }

  function handleBtnOpenClick(event) {
    const btn = event.currentTarget;

    const indicatorsTitle = btn.dataset.wsIndicatorsTitle;
    const { labels, datasets } = formatData(
      JSON.parse(btn.dataset.wsIndicatorsList),
    );

    openChart(indicatorsTitle);

    const chart = createChart(CHART_CANVAS, labels, datasets);

    if (BTN_CLOSE) {
      BTN_CLOSE.addEventListener('click', () => {
        chart.destroy();
      });
    }
  }

  function formatData(dataList) {
    const labels = [];
    const dataMap = new Map();
    if (dataList.length > 0) {
      dataList.forEach((item) => {
        for (let [key, value] of Object.entries(item)) {
          if (key === 'datetime') {
            const date = new Date(Number(value));
            labels.push(dateFormater.format(date));
          } else {
            if (!dataMap.has(key)) {
              dataMap.set(key, []);
            }
            dataMap.get(key).push(value);
          }
        }
      });
    }

    const datasets = Array.from(dataMap.entries()).reduce((acc, item) => {
      const obj = {
        label: item[0],
        data: item[1],
      };
      acc.push(obj);
      return acc;
    }, []);

    return {
      labels,
      datasets,
    };
  }

  function openChart(title) {
    INDICATORS_VIEW_MODAL.classList.remove('view-modal--hide');
    const header = createHeader(title);
    CONTENT.replaceChildren(header);
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
