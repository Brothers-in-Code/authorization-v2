(() => {
  const inputNameSearch = document.getElementById('nameSearch');

  inputNameSearch.addEventListener('input', (event) => {
    const value = event.target.value;
    const filteredData = filterColumn(data, 'name', value);
    return filteredData;
  });

  function filterColumn(data, column, value) {
    return data.filter((row) => row[column] === value);
  }
})();
