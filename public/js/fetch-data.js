// FIX убрать обработку then
function fetchWSData(params) {
  const url = document.location.href;
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then((res) => {
    if (res.ok) {
      document.location.reload();
    }
  });
}
