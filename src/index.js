import { fetchServise } from './js/fetchservice';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const selectors = {
  serchForm: document.querySelector(`.search-form`),
  blockGallery: document.querySelector(`.gallery`),
  loader: document.querySelector(`.load-more`),
};
let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;
selectors.loader.classList.add('is-hidden');

selectors.serchForm.addEventListener(`submit`, searchForm);
selectors.loader.addEventListener('click', loadMore);

function createMarkup(img) {
  const markup = img
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
   <div class="card-container">   
     <a class="link-gallery" href="${largeImageURL}" >
       <div class="photo-card" id=${id}>
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes</b>${likes}</p>
            <p class="info-item"><b>Views</b>${views}</p>     
            <p class="info-item"><b>Comments</b>${comments}</p>
            <p class="info-item"><b>Downloads</b>${downloads}</p>         
          </div>
       </div> 
     </a>
   </div>`;
    })
    .join(``);
  selectors.blockGallery.insertAdjacentHTML(`beforeend`, markup);
}

function searchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  selectors.blockGallery.innerHTML = '';

  if (query === ``) {
    selectors.loader.classList.add('is-hidden');
    Notify.failure(
      'The search string cannot be empty. Please indicate your search query.'
    );
    return;
  }
  fetchServise(query, page, perPage)
    .then(data => {
      console.log(data);
      selectors.loader.classList.remove('is-hidden');
      if (data.total === 0) {
        selectors.loader.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        createMarkup(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      selectors.serchForm.reset();
    });
}

function loadMore() {
  page += 1;
  //   simpleLightBox.destroy();
  fetchServise(query, page, perPage)
    .then(data => {
      console.log(perPage);
      console.log(data);
      //   selectors.loader.classList.remove('is-hidden');
      const allPage = Math.ceil(data.totalHits / perPage);
      if (page > allPage) {
        selectors.loader.classList.add('is-hidden');
        Notify.failure(
          `We're sorry, but you've reached the end of search results.`
        );
      } else {
        fetchServise(query, page, perPage)
          .then(data => {
            if (data.total === 0) {
              selectors.loader.classList.add('is-hidden');
              Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.'
              );
            } else {
              createMarkup(data.hits);
              simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            }
          })
          .catch(error => console.log(error))
          .finally(() => {
            selectors.serchForm.reset();
          });
      }
      console.log(page);
    })
    .catch(error => console.log(error))
    .finally(() => {
      selectors.serchForm.reset();
    });
}
