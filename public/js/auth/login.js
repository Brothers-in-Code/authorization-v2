(() => {
  //   TODO сделать сообщения о процессе авторизации
  const VK_URL = ' https://id.vk.com/authorize';
  const stayAPIUrl = `${new URL(window.location.href).origin}/api`;
  const loginButton = document.getElementById('login');

  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const redirectTo = loginButton.dataset.smmRedirectTo;
      login(redirectTo);
    });
  }

  async function login(redirectTo) {
    const verificationParams = await fetchVerificationParams(redirectTo);
    const url = createRequestURL(verificationParams);
    window.location.href = url;
  }

  function fetchVerificationParams(redirectTo) {
    return fetch(`${stayAPIUrl}/auth/verification?redirectTo=${redirectTo}`, {
      method: 'GET',
    }).then((res) => res.json());
  }

  function createRequestURL(params) {
    return `${VK_URL}?${new URLSearchParams(params)}`;
  }
})();
