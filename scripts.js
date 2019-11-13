const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let companies;

  function displayError(error) {
    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(document.createTextNode(error));
  }


  function displayCompany(companyList) {
    if (companyList.length === 0) {
      displayError('Fann ekki fyrirtæki');
      return;
    }

    const [{ name }] = companyList;

    const dl = document.createElement('dl');

    const nameElement = document.createElement('dt');
    nameElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(nameElement);

    const nameValueElement = document.createElement('dd');
    nameValueElement.appendChild(document.createTextNode(name));
    dl.appendChild(nameValueElement);

    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    container.appendChild(dl);
  }


  function fetchData(number) {
    fetch(`${API_URL}${number}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw new Error('Villa kom upp');
      })
      .then((data) => {
        displayCompany(data.results);
      })
      .catch((error) => {
        displayError('Villa!');
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const input = e.target.querySelector('input');

    fetchData(input.value);
  }

  function init(_companies) {
    companies = _companies;

    const form = companies.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');

  program.init(companies);
});
