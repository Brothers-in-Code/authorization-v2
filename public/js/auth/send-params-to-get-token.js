// Получение кода
(async () => {
  const searchParams = new URLSearchParams(window.location.search);

  if (window.location.search.includes('code')) {
    const bodyJson = getBodyJson();
    const response = await sendCode(bodyJson);
    console.log(response);

    if (response.status === 'ok') {
      hideLoginButton();
      popupMessage(response.message);
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
    return fetch('https://stay-in-touch.ru/api/auth/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    }).then((res) => res.json());
  }

  function hideLoginButton() {
    const loginButton = document.getElementById('login');
    loginButton.classList.add('hide');
  }

  function popupMessage(message) {
    alert(message);
  }
})();

// Получение групп
// (async () => {
//   const VK_DATA_URL = 'https://stay-in-touch.ru/api/vkdata';

//   const btnGetGroups = document.getElementById('get-groups');
//   const btnGetPrivetGroupWall = document.getElementById(
//     'get-wall-private-group',
//   );

//   btnGetGroups.addEventListener('click', () => {
//     return fetch(`${VK_DATA_URL}/groups`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         user_vkid: 1267318,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((e) => console.log(e));
//   });

//   btnGetPrivetGroupWall.addEventListener('click', () => {
//     return fetch(`${VK_DATA_URL}/wall`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         user_vkid: 1267318,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log(data))
//       .catch((e) => console.log(e));
//   });
// })();
