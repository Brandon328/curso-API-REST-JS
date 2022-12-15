const btn_sort = document.getElementById('btnRaffle');
const img = document.getElementById('randomCat');
const favorites_cats_container = document.getElementById('favoritesCatsContainer');
const error_popup = document.getElementById('error');
const API_RANDOM = 'https://api.thecatapi.com/v1/images/search';
const API_GET_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_KEY = 'live_tBfI6UgykfNiwdXsIQ3OufRVU617tCCv6KpYMOgr5cE8C9EmL3ybD2caffxvvE7b';

async function fetchData(urlApi, options = {
  method: 'GET',
  headers: {
    'content-type': 'application/json',
    'x-api-key': API_KEY,
  }
}) {
  try {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
  }
  catch (error) {
    error_popup.innerText = `Hubo un error. ${error}`;
  }
}

async function loadRandomCats() {
  img.src = 'https://i.stack.imgur.com/IA7jp.gif';
  const data = await fetchData(API_RANDOM);
  img.src = data[0].url;
};

async function loadFavoritesCats() {
  const data = await fetchData(API_GET_FAVORITES);
}

btn_sort.addEventListener('click', loadRandomCats);

loadRandomCats();
loadFavoritesCats();