(() => {
  const STAY_API_URL = 'https://stay-in-touch.ru/api';
  const VK_URL = ' https://id.vk.com/authorize';
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', login);

  async function login() {
    const verificationParams = await fetchVerificationParams();
    const url = createRequestURL(verificationParams);
    window.location.href = url;
  }

  function fetchVerificationParams() {
    return fetch(`${STAY_API_URL}/auth/verification`, {
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
      fetch(`${STAY_API_URL}/auth/access`, {
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
        .catch((e) => console.log(e))
    );
  });
})();
