document.addEventListener('DOMContentLoaded', () => {
  filterSorting();
});

function filterSorting() {
  // variables

  const filter = document.querySelectorAll('.filter__link');
  const product = document.querySelector('.product');
  const productCard = product.querySelectorAll('.product__card');
  const sortSelect = document.querySelector('#sort-select');
  const filterActiveClass = 'filter__link--active';
  const productShownClass = 'product__card--shown';
  const productHiddenClass = 'product__card--hidden';

  // functions

  const removeActiveFilter = () =>
    filter.forEach(filterItem => {
      filterItem.classList.remove(filterActiveClass);
    });

  const addShownProductClass = () => {
    productCard.forEach(productItem => {
      productItem.classList.add(productShownClass);
    });
  };

  const addActiveFilter = target => {
    target.classList.add(filterActiveClass);
    return target.textContent.toLocaleLowerCase();
  };

  const filterProducts = category => {
    productCard.forEach(cardItem => {
      const categories = [...cardItem.querySelectorAll('.category__item')].map(
        categoryItem => categoryItem.textContent.toLocaleLowerCase()
      );

      if (category === 'all') {
        cardItem.classList.remove(productHiddenClass);
        cardItem.classList.add(productShownClass);
      } else if (categories.includes(category)) {
        cardItem.classList.remove(productHiddenClass);
        cardItem.classList.add(productShownClass);
      } else {
        cardItem.classList.remove(productShownClass);
        cardItem.classList.add(productHiddenClass);
      }
    });
  };

  const setProductDataId = () => {
    productCard.forEach((cardItem, idx) => {
      cardItem.dataset.id = idx;
    });
  };

  const getSortedProducts = (arr, name, type) => {
    return [...arr].sort((a, b) => {
      const titleA = a.querySelector('.card__title').textContent;
      const titleB = b.querySelector('.card__title').textContent;
      const priceA = parseInt(a.querySelector('.card__price').textContent);
      const priceB = parseInt(b.querySelector('.card__price').textContent);

      switch (name) {
        case 'name':
          if (
            titleA.toString().toLowerCase() < titleB.toString().toLowerCase()
          ) {
            return type === 'asc' ? -1 : 1;
          }
          if (
            titleA.toString().toLowerCase() > titleB.toString().toLowerCase()
          ) {
            return type === 'asc' ? 1 : -1;
          }
          return 0;
        case 'price':
          if (priceA < priceB) {
            return type === 'asc' ? -1 : 1;
          }
          if (priceA > priceB) {
            return type === 'asc' ? 1 : -1;
          }
          return titleA.toString().toLowerCase() <
            titleB.toString().toLowerCase()
            ? -1
            : 1;
        default:
          return arr;
      }
    });
  };

  const initialCoords = [...productCard].map(cardItem => {
    const coords = cardItem.getBoundingClientRect();
    const parentCoords = product.getBoundingClientRect();
    const x = coords.x - parentCoords.x;
    const y = coords.y - parentCoords.y;

    return { x, y };
  });

  const getCoords = (arr1, arr2) => {
    [...arr1].forEach((item, idx) => {
      const { x, y } = initialCoords[idx];
      const dataId = item.dataset.id;

      const sortedIdx = [...arr2].findIndex(item => item.dataset.id === dataId);
      const sortedItemCoords = initialCoords[sortedIdx];

      item.style.transform = `translate3d(${sortedItemCoords.x - x}px, ${
        sortedItemCoords.y - y
      }px, 0)`;
    });
  };

  const setSort = value => {
    const [name, type] = value.split('|');
    const initialArr = [...productCard].filter(item => item.classList.contains(productShownClass))
    const sortedArr = getSortedProducts(productCard, name, type).filter(item => item.classList.contains(productShownClass))

    getCoords(initialArr, sortedArr);
  };

  // attach events

  const handleFilterClick = e => {
    e.preventDefault();
    removeActiveFilter();
    const activeFilter = addActiveFilter(e.target);
    filterProducts(activeFilter);
    setSort(sortSelect.value);
  };

  const handleSort = e => {
    const sortValue = e.target.value;
    setSort(sortValue);
  };

  filter.forEach(filterItem => {
    filterItem.addEventListener('click', handleFilterClick);
  });

  sortSelect.addEventListener('change', handleSort);

  // init

  const init = () => {
    addShownProductClass();
    setProductDataId();
    setSort(sortSelect.value);
  };

  init();
}
