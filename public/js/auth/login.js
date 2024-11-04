(() => {
  //   const STAY_API_URL = 'https://stay-in-touch.ru/api';
  const VK_URL = ' https://id.vk.com/authorize';
  const stayAPIUrl = `${new URL(window.location.href).origin}/api`;
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', login);

  async function login() {
    const verificationParams = await fetchVerificationParams();
    const url = createRequestURL(verificationParams);
    window.location.href = url;
  }

  function fetchVerificationParams() {
    return fetch(`${stayAPIUrl}/auth/verification`, {
      method: 'GET',
    }).then((res) => res.json());
  }

  function createRequestURL(params) {
    return `${VK_URL}?${new URLSearchParams(params)}`;
  }
})();
