// Получение кода
(async () => {
  const searchParams = new URLSearchParams(window.location.search);

  const params = getBodyJson();
  console.log(params);
  const data = await sendCode(params);
  console.log(data);

  function getBodyJson() {
    const body = {
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      device_id: searchParams.get('device_id'),
    };

    return JSON.stringify(body);
  }

  function sendCode(body) {
    return fetch('https://stay-in-touch.ru/api/auth/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((res) => res.json());
  }
})();

// Получение групп
(async () => {
  const btnGetGroups = document.getElementById('get-groups');
  btnGetGroups.addEventListener('click', () => {
    return fetch('https://stay-in-touch.ru/api/vkdata/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_vkid: 1267318,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  });
})();
