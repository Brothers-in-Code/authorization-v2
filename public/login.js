(() => {
  const VERIFICATION_URL = 'https://stay-in-touch.ru/auth/verification';
  const VK_URL = ' https://id.vk.com/authorize';
  const loginButton = document.getElementById('login');

  loginButton.addEventListener('click', login);

  async function login() {
    const verificationParams = await fetchVerificationParams();
    const url = createRequestURL(verificationParams);
    // window.location.href = url;
    console.log(verificationParams);
    console.log('cookie', document.cookie);
  }

  function fetchVerificationParams() {
    return fetch(VERIFICATION_URL, {
      method: 'GET',
    }).then((res) => res.json());
  }

  function createRequestURL(params) {
    return `${VK_URL}?${new URLSearchParams(params)}`;
  }
})();
