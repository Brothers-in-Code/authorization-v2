(() => {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      let cookie = document.cookie
        .split(';')
        .find((item) => item.includes('user_token'));
      console.log(cookie);
      document.cookie = 'user_token=; path=/; max-age=-1;';

      console.log(document.cookie);
      window.location.href = `${window.location.origin}`;
    });
  }
})();
