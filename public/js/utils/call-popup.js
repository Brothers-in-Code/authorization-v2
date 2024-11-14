function callPopup(message) {
  document.dispatchEvent(
    new CustomEvent('new-message', { bubbles: true, detail: { message } }),
  );
}
