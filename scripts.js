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

    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    for (let i = 0; i < companyList.length; i += 1) {
      const dl = document.createElement('dl');
      dl.classList.add('company');

      const nameElement = document.createElement('dt');
      nameElement.appendChild(document.createTextNode('Lén'));
      dl.appendChild(nameElement);

      const nameValueElement = document.createElement('dd');
      nameValueElement.appendChild(document.createTextNode(companyList[i].name));
      dl.appendChild(nameValueElement);

      const kennitalaElement = document.createElement('dt');
      kennitalaElement.appendChild(document.createTextNode('Kennitala'));
      dl.appendChild(kennitalaElement);

      const kennitalaValueElement = document.createElement('dd');
      kennitalaValueElement.appendChild(document.createTextNode(companyList[i].sn));
      dl.appendChild(kennitalaValueElement);

      if (companyList[i].active === 1) {
        dl.classList.add('company--active');

        const addressElement = document.createElement('dt');
        addressElement.appendChild(document.createTextNode('Heimilisfang'));
        dl.appendChild(addressElement);

        const addressValueElement = document.createElement('dd');
        addressValueElement.appendChild(document.createTextNode(companyList[i].address));
        dl.appendChild(addressValueElement);
      } else {
        dl.classList.add('company--inactive');
      }

      container.appendChild(dl);
    }
  }

  function loading() {
    const div = document.createElement('div');
    div.classList.add('loading');
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    img.classList.add('img');
    div.appendChild(img);

    const text = document.createElement('div');
    text.appendChild(document.createTextNode('Leita að fyrirtækjum...'));
    div.appendChild(text);

    const container = companies.querySelector('.results');

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(div);
  }


  function fetchData(number) {
    loading();
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
        displayError('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();

    const input = e.target.querySelector('input');

    if (input.value === ' ' || input.value === '') {
      displayError('Lén verður að vera strengur');
    } else {
      fetchData(input.value);
    }
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
