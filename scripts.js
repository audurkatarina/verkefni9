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
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng');
      return;
    }

    const [{ name }] = companyList;
    debugger;
    const [{ sn }] = companyList;
    const [{ active }] = companyList;

    const dl = document.createElement('dl');
    dl.classList.add('company');

    const nameElement = document.createElement('dt');
    nameElement.appendChild(document.createTextNode('Lén'));
    dl.appendChild(nameElement);

    const nameValueElement = document.createElement('dd');
    nameValueElement.appendChild(document.createTextNode(name));
    dl.appendChild(nameValueElement);

    const kennitalaElement = document.createElement('dt');
    kennitalaElement.appendChild(document.createTextNode('Kennitala'));
    dl.appendChild(kennitalaElement);

    const kennitalaValueElement = document.createElement('dd');
    kennitalaValueElement.appendChild(document.createTextNode(sn));
    dl.appendChild(kennitalaValueElement);

    if (active === 1) {
      const [{ address }] = companyList;

      dl.classList.add('company--active');

      const addressElement = document.createElement('dt');
      addressElement.appendChild(document.createTextNode('Heimilisfang'));
      dl.appendChild(addressElement);

      const addressValueElement = document.createElement('dd');
      addressValueElement.appendChild(document.createTextNode(address));
      dl.appendChild(addressValueElement);
    }

    dl.classList.add('company--inactive');

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

        throw new Error('Villa við að sækja gögn');
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
