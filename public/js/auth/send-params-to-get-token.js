// Получение кода
// TODO сделать сообщения о процессе авторизации (перед редиректом показать спинер и сообщение "перенаправляем обратно")
(async () => {
  const searchParams = new URLSearchParams(window.location.search);

  if (window.location.search.includes('code')) {
    const bodyJson = getBodyJson();
    const response = await sendCode(bodyJson);

    if (response.status === 'ok') {
      const origin = window.location.origin;
      const href = `${origin}/${response.redirectTo}`.replace('.ru//', '.ru/');
      window.location.href = href;
    }
  }

  function getBodyJson() {
    const body = {
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      device_id: searchParams.get('device_id'),
    };

    return JSON.stringify(body);
  }

  function sendCode(body) {
    return fetch('https://smm-toolkit.ru/api/auth/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((res) => res.json());
  }

  // todo удалить если не будет выбрасывать ошибок. Закомментированно 22.01.2024
  // function hideLoginButton() {
  //   const loginButton = document.getElementById('login');
  //   loginButton.classList.add('hide');
  // }
  //
  // function popupMessage(message) {
  //   alert(message);
  // }
})();
