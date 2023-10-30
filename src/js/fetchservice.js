import axios from 'axios';

const API_KEY = `40349045-40ce8f9906407a6daca01a4c4`;
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  }
);

async function fetchServise(query, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}

export { fetchServise };
