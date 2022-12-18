const btn_sort = document.getElementById('btnRaffle');
const btn_add_favourite = document.getElementById('saveCat');
const img = document.getElementById('randomCat');
const favorites_cats_container = document.getElementById('favoritesCatsContainer');
const error_popup = document.getElementById('error');

const API_RANDOM = 'https://api.thecatapi.com/v1/images/search';
const API_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_KEY = 'live_tBfI6UgykfNiwdXsIQ3OufRVU617tCCv6KpYMOgr5cE8C9EmL3ybD2caffxvvE7b';
const API_UPLOAD = 'https://api.thecatapi.com/v1/images';

async function fetchData(urlApi, options = {
  method: 'GET',
  headers: {
    'x-api-key': API_KEY,
  }
}) {

  const response = await fetch(urlApi, options);
  const data = await response.json();
  if (response.status < 200 || response.status > 300) {
    error_popup.innerText = `Hubo un error ${response.status}. ${data.message}`;
  }
  return data;
}

async function loadRandomCats() {
  img.src = 'https://i.stack.imgur.com/IA7jp.gif';
  const data = await fetchData(API_RANDOM);
  img.src = data[0].url;
  btn_add_favourite.onclick = () => saveFavoriteCat(data[0].id, data[0].url);
};

async function loadFavouritesCats() {
  let nodes = '';
  const data = await fetchData(`${API_FAVORITES}?order=DESC`);
  data.forEach(cat => {
    nodes += `
      <article>
        <img src="${cat.image.url}" alt="favorite cat image" width="300px">
        <input type="button" value="Get this cat photo off my favorite list" onclick="ridFavoriteCat(event, ${cat.id})">
      </article>
    `;
  });
  favorites_cats_container.insertAdjacentHTML('beforeend', nodes);
}

async function saveFavoriteCat(id, url) {
  const image_id = id;
  const content = {
    'image_id': image_id,
  };
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(content)
  }
  const response = await fetchData(API_FAVORITES, options);
  console.log(response);
  favorites_cats_container.insertAdjacentHTML('afterbegin', `
    <article>
      <img src="${url}" alt="favorite cat image" width="300px">
      <input type="button" value="Get this cat photo off my favorite list" onclick="ridFavoriteCat(event, ${response.id})">
    </article>
  `);
}

async function ridFavoriteCat(event, id) {
  const options = {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    }
  }
  await fetchData(`${API_FAVORITES}/${id}`, options);
  favorites_cats_container.removeChild(event.target.parentNode);
}

async function uploadCatPhoto() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
    },
    body: formData
  }
  const response = await fetchData(`${API_UPLOAD}/upload`, options);
  console.log('Foto subida');
  const section = document.getElementById('uploadedCats');
  section.insertAdjacentHTML('afterbegin', `
    <article>
      <img src="${response.url}" alt="favorite cat image" width="300px">
      <input type="button" value="Get this cat photo off my favorite list" onclick="ridUploadedCat(event)" data-id=${response.id}>
    </article>
  `);
}

async function ridUploadedCat(event) {
  const section = document.getElementById('uploadedCats');
  const id = event.target.getAttribute('data-id');
  const options = {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    }
  }
  await fetch(`${API_UPLOAD}/${id}`, options);
  section.removeChild(event.target.parentNode);
}

async function loadUploadedCats() {
  const section = document.getElementById('uploadedCats');
  const response = await fetchData(`${API_UPLOAD}?limit=10`);
  let nodes = '';
  response.forEach(cat => {
    nodes += `
      <article>
        <img src="${cat.url}" alt="favorite cat image" width="300px">
        <input type="button" value="Get this cat photo off my favorite list" onclick="ridUploadedCat(event)" data-id=${cat.id}>
      </article>
    `;
  });
  section.insertAdjacentHTML('afterbegin', nodes);
}

btn_sort.addEventListener('click', loadRandomCats);

loadRandomCats();
loadFavouritesCats();
loadUploadedCats()