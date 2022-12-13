const btn_sort = document.querySelector('input');
const img = document.querySelector('img');
const API = 'https://dog.ceo/api/breeds/image/random';

async function fetchData() {
  img.src = 'https://i.stack.imgur.com/IA7jp.gif';
  const response = await fetch(API);
  const data = await response.json();
  img.src = data.message;
};

btn_sort.addEventListener('click', fetchData);

fetchData();