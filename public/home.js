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
    return fetch('https://stay-in-touch.ru/auth/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((res) => res.json());
  }
})();
