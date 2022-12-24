const btn_raffle = document.getElementById('btn-raffle');
const img_random_cat = document.getElementById('random-cat');
const btn_like = document.getElementById('btn-like');
const favorites_cats_section = document.querySelector('.my-favorite-cats-section');
const cats_section = document.querySelector('.my-cats-section');
const cats_card_section = document.querySelector('.my-cats-cards-section');
const info_box = document.getElementById('info-box');
const btn_my_favorite_cats = document.getElementById('btn-my-favorite-cats');
const btn_my_cats = document.getElementById('btn-my-cats');
const uploading_form = document.getElementById('uploading-form');
const btn_file = document.getElementById('btn-file');
const no_cats_card = document.getElementById('no-cats-card');

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
  try {
    const response = await fetch(urlApi, options);
    const data = await response.json();
    if (response.status < 200 || response.status > 300) {
      info_box.innerText = `Hubo un error ${response.status}. ${data.message}`;
      info_box.classList.add('error');
      info_box.classList.remove('inactive');
    }
    return data;
  }
  catch (error) {
    info_box.innerText = `Hubo un error ${error}.`;
    info_box.classList.add('error');
    info_box.classList.remove('inactive');
  }
}

async function loadRandomCats() {
  btn_like.src = 'assets/unlike.png';
  img_random_cat.src = 'assets/loading.gif';
  const data = await fetchData(API_RANDOM);
  img_random_cat.src = data[0].url;
  btn_like.onclick = () => saveFavoriteCat(data[0].id, data[0].url);
};

async function loadFavouritesCats() {
  let nodes = '';
  const data = await fetchData(`${API_FAVORITES}?order=DESC`);
  data.forEach(cat => {
    nodes += `
      <article class="card">
        <img src="${cat.image.url}" class="cat-image" alt="cat image">
        <img src="assets/like.png" alt="like icon" class="unlike" onclick="ridFavoriteCat(event, ${cat.id})">
      </article>
    `;
  });
  favorites_cats_section.insertAdjacentHTML('beforeend', nodes);
  noCats(favorites_cats_section);
}

async function saveFavoriteCat(id, url) {
  btn_like.src = 'assets/loading.gif';
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
  favorites_cats_section.insertAdjacentHTML('afterbegin', `
    <article class="card">
      <img src="${url}" class="cat-image" alt="cat image">
      <img src="assets/like.png" alt="like icon" class="unlike" onclick="ridFavoriteCat(event, ${response.id})">
    </article>
  `);
  btn_like.src = 'assets/like.png';
  noCats(favorites_cats_section);
}

async function ridFavoriteCat(event, id) {
  event.target.src = 'assets/loading.gif';
  const options = {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    }
  }
  await fetchData(`${API_FAVORITES}/${id}`, options);
  favorites_cats_section.removeChild(event.target.parentNode);
  noCats(favorites_cats_section);
}

async function uploadCatPhoto() {
  const new_card = document.createElement('article');
  new_card.classList.add('card');
  const img_cat = document.createElement('img');
  img_cat.src = 'assets/loading.gif';
  img_cat.classList.add('cat-image');
  img_cat.alt = 'cat image';
  const btn_unlike_cat = document.createElement('img');
  btn_unlike_cat.src = 'assets/like.png';
  btn_unlike_cat.alt = 'like icon';
  btn_unlike_cat.classList.add('unlike');
  btn_unlike_cat.onclick = () => ridUploadedCat;

  new_card.appendChild(img_cat);
  cats_card_section.insertAdjacentElement('afterbegin', new_card);
  noCats(cats_card_section);

  const form_data_html = document.getElementById('form-data');
  const form_data = new FormData(form_data_html);
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
    },
    body: form_data
  }
  const response = await fetchData(`${API_UPLOAD}/upload`, options);
  console.log('Foto subida');
  img_cat.src = response.url;
  new_card.appendChild(btn_unlike_cat);
  cats_card_section.insertAdjacentElement('afterbegin', new_card);
  uploading_form.innerHTML = `
    <img class="img-witch-cat" src="assets/witch-cat.png" alt="witch cat">
    <label for="btn-file" class="btn-choose-img">
      <span>Choose an image</span>
    </label>
  `;
}

async function ridUploadedCat(event) {
  event.target.src = 'assets/loading.gif';
  const id = event.target.getAttribute('data-id');
  const options = {
    method: 'DELETE',
    headers: {
      'x-api-key': API_KEY,
    }
  }
  await fetch(`${API_UPLOAD}/${id}`, options);
  cats_card_section.removeChild(event.target.parentNode);
  noCats(cats_card_section);
}

async function loadUploadedCats() {
  const response = await fetchData(`${API_UPLOAD}?limit=10`);
  let nodes = '';
  response.forEach(cat => {
    nodes += `
      <article class="card">
        <img src="${cat.url}" class="cat-image" alt="cat image">
        <img src="assets/like.png" alt="like icon" class="unlike" onclick="ridUploadedCat(event)" data-id=${cat.id}>
      </article>
    `;
  });
  cats_card_section.insertAdjacentHTML('afterbegin', nodes);
}

function noCats(section) {
  if (section.childElementCount == 0) no_cats_card.classList.remove('inactive');
  else no_cats_card.classList.add('inactive');
}

btn_raffle.addEventListener('click', loadRandomCats);
btn_my_favorite_cats.addEventListener('click', () => {
  btn_my_favorite_cats.classList.add('active-section');
  btn_my_cats.classList.remove('active-section');
  favorites_cats_section.classList.remove('inactive');
  cats_section.classList.add('inactive');
  uploading_form.classList.add('inactive');
  noCats(favorites_cats_section);
})
btn_my_cats.addEventListener('click', () => {
  btn_my_cats.classList.add('active-section');
  btn_my_favorite_cats.classList.remove('active-section');
  cats_section.classList.remove('inactive');
  favorites_cats_section.classList.add('inactive');
  uploading_form.classList.remove('inactive');
  noCats(cats_card_section);
})
btn_file.addEventListener('change', () => {
  if (btn_file.files.length != 0) {
    uploading_form.innerHTML = `
      <img class="cat-image-demo" src="${URL.createObjectURL(btn_file.files[0])}" alt="witch cat">
      <label class="btn-choose-img" onclick="uploadCatPhoto()">
        <span>Upload</span>
        <img src="assets/upload-black.png" alt="upload icon" class="upload-icon">
      </label>
    `;
  }
});

loadRandomCats();
loadFavouritesCats();
loadUploadedCats();
