(() => {
  const VKID = window.VKIDSDK;
  const BASE_URL = 'https://stay-in-touch.ru/auth';

  if (VKID) {
    // NOTE  ВК кнопка
    const oneTap = new VKID.OneTap();

    const container = document.getElementById('VkIdSdkOneTap');

    if (container) {
      oneTap
        .render({
          container: container,
          scheme: VKID.Scheme.LIGHT,
          lang: VKID.Languages.RUS,
          fastAuthEnabled: false,
          ConfigAuthMode: VKID.WidgetEvents.REDIRECT,
          styles: {
            width: 350,
          },
        })
        .on(VKID.WidgetEvents.ERROR, handleError);
    }

    // NOTE Своя кнопка
    const loginButton = document.getElementById('login');
    loginButton.addEventListener('click', login);

    async function login() {
      const verificationParams = await fetchVerificationParams();
      console.log(verificationParams);
      VKID.Config.init({
        ...verificationParams,
      });
      VKID.Auth.login();
    }

    function fetchVerificationParams() {
      return fetch(`${BASE_URL}/verification`, {
        method: 'GET',
      }).then((res) => res.json());
    }
  }
})();
