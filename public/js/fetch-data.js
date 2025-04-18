function fetchWSData(params, method = 'post') {
  const url = document.location.href;
  console.log(JSON.stringify(params));
  console.log(url);

  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
