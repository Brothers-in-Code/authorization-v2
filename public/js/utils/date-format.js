function dateFormat(date) {
  let dateLocal;
  if (typeof date === 'string') {
    dateLocal = new Date(date);
  } else {
    dateLocal = date;
  }
  const formatedDate = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateLocal);
  return formatedDate;
}
