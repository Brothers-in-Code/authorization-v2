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

// "code":"vk2.a.dXWtUFo3V8Gbjlh-UeB4LKTtK4n41R5LG70OYnkj2xDTW0rRQUwP2DTwK-qsJuLdR-YZYGWOYXKHQIGFkw75EiHZrPvSb3FX1i7rmLp96y1qeh0wITqDkKmIjB-xo6VT2CTzMv7gEGmKiNYQyhNs_pEbMv4HwkHiaS38FKuPkWPFuCKfGmQJFWOgvnoefV6DwLWB7BglHJcs3FcpFpJw_g",
// "state":"7153345f12c50663417eae8596a51a2c242e494f3d0917f66ceb1f31074a7834",
// "device_id":"4BF5GlZ-G0I1aed_zbFGdpERmhN5MqHjP1Ppj56d4a3qfPVz2y8ralEzTKhzKfMMVWAeCeqgSUgm41DG9YLY5g"

// const body = {
//   code: 'vk2.a.dXWtUFo3V8Gbjlh-UeB4LKTtK4n41R5LG70OYnkj2xDTW0rRQUwP2DTwK-qsJuLdR-YZYGWOYXKHQIGFkw75EiHZrPvSb3FX1i7rmLp96y1qeh0wITqDkKmIjB-xo6VT2CTzMv7gEGmKiNYQyhNs_pEbMv4HwkHiaS38FKuPkWPFuCKfGmQJFWOgvnoefV6DwLWB7BglHJcs3FcpFpJw_g',
//   state: '7153345f12c50663417eae8596a51a2c242e494f3d0917f66ceb1f31074a7834',
//   device_id:
//     '4BF5GlZ-G0I1aed_zbFGdpERmhN5MqHjP1Ppj56d4a3qfPVz2y8ralEzTKhzKfMMVWAeCeqgSUgm41DG9YLY5g',
// };
