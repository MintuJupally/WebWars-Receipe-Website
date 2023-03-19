const searchBox = document.getElementById('search-box');

let lastValue = '';

const clearResults = () => {
  const resultsBox = document.getElementById('results-box');

  resultsBox.innerHTML="";

  const pagination = document.getElementById('pagination');
  
  pagination.innerHTML=""
};

let searchTimer = null;

let currentPage = 1;

const openModal = (index) => {
  const receipeModal = document.getElementById('receipe-modal');
  const modalClose = document.getElementById('close-modal');

  receipeModal.innerHTML = `${
    results.slice(10 * (currentPage - 1), 10 * currentPage)[index]
      .strInstructions
  }`;

  receipeModal.classList.toggle('hideModal');
  modalClose.classList.toggle('hideModal');
};

const prevPage = () => {
  if (currentPage === 1) return;

  document.getElementById('page-number').innerHTML = `${currentPage - 1}`;
  currentPage--;

  renderPage(currentPage);
};

const nextPage = () => {
  if (currentPage === Math.ceil(results.length / 10)) return;

  document.getElementById('page-number').innerHTML = `${currentPage + 1}`;
  currentPage++;

  renderPage(currentPage);
};

const renderPagination = (pages) => {
  const pagination = document.getElementById('pagination');

  pagination.innerHTML = `<button onClick=${'prevPage()'} id="prev-page"><</button><span id="page-number">${1}</span>/${pages}<button onClick=${'nextPage()'} id="next-page">></button>`;
};

const closeModal = () => {
  const modal = document.getElementById('receipe-modal');
  const modalClose = document.getElementById('close-modal');

  modal.innerHTML = '';

  modal.classList.toggle('hideModal');
  modalClose.classList.toggle('hideModal');
};

const renderPage = (pageNum) => {
  const resultsBox = document.getElementById('results-box');

  const innerHTML = results
    .slice(10 * (pageNum - 1), 10 * pageNum)
    .map((result, index) => {
      return `<div class="search-result">\
      <div class="content">\
      <h5>${result.strMeal}</h5>\
      <div class="food-tag">\
      <div class="category">${result.strCategory}</div>\
      <div class="area">${result.strArea}</div>\
      </div>\
      <div class="receipe-open" onclick="openModal(${index})">\
      <img style="height:30px" src="https://user-images.githubusercontent.com/57583693/226177240-e3c1389e-33db-4827-b44d-beca9036a57f.png" class="open-icon"/>
      Receipe 
      </div>\
      </div>\
      <div class="thumbnail"><img src='${result.strMealThumb}'/></div>\
      </div>`;
    })
    .join('');

  console.log({ innerHTML });

  resultsBox.innerHTML = innerHTML;
};

const renderResults = (res) => {
  renderPage(1);

  const pages = Math.ceil(res.length / 10);

  renderPagination(pages);
};

const searchReceipes = (searchText) => {
    fetch(
      `http://www.themealdb.com/api/json/v1/1/search.php?s=${searchText
        .split(' ')
        .join('%20')}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.meals);
        results=data.meals;
        renderResults(results);
    });  
};

const search = (text) => {
  if (searchTimer) clearTimeout(searchTimer);

  searchTimer = setTimeout(() => {
    console.log('Searching for ', text);
    searchReceipes(text);
    timer = null;
  }, 500);
};

searchBox.addEventListener('input', (event) => {
  let text = event.target.value;
  text = text.trimStart();

  text = text.replace(/\s\s+/g, ' ');

  searchBox.value = text;

  if (text == lastValue) return;

  if (text.length === 0) clearResults();
  else search(text);
});
