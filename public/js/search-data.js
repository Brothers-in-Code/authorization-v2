function createParam(key, value) {
  return `?${key}=${value}`;
}

function createRequest(key, value) {
  const currentUrl = new URL(window.location.href);
  if (value === '') {
    currentUrl.searchParams.delete(key);
  } else {
    currentUrl.searchParams.set(key, value);
  }

  window.location.href = currentUrl.toString();
}
