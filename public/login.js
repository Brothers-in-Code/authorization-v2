(() => {
  const VERIFICATION_URL = 'https://stay-in-touch.ru/auth/verification';
  const VK_URL = ' https://id.vk.com/authorize';
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', login);

  async function login() {
    const verificationParams = await fetchVerificationParams();
    const url = createRequestURL(verificationParams);
    window.location.href = url;
  }

  function fetchVerificationParams() {
    return fetch(VERIFICATION_URL, {
      method: 'GET',
    }).then((res) => res.json());
  }

  function createRequestURL(params) {
    return `${VK_URL}?${new URLSearchParams(params)}`;
  }

  //   NOTE для тестирования отправки cookies
  const btnAccess = document.getElementById('access');
  btnAccess.addEventListener('click', () => {
    return (
      fetch('https://stay-in-touch.ru/auth/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: 'code',
          state: 'state',
          device_id: 'device_id',
        }),
      })
        // NOTE не ловит ошибку, показывает then
        .then((res) => console.log(res))
        .catch((e) => console.log('test'))
    );
  });
})();
