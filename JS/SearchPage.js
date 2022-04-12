$.extend({
  getUrlVars() {
    const vars = []; let
      hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i += 1) {
      hash = hashes[i].split('=');
      if (vars[hash[0]]) {
        vars[hash[0]].push(hash[1]);
      } else {
        vars.push(hash[0]);
        vars[hash[0]] = [];
        vars[hash[0]].push(hash[1]);
      }
    }
    return vars;
  },
});

function GeneratePageArgs() {
  const vars = $.getUrlVars();

  const pageNumber = vars.page[0];
  const pageSize = 8;
  const pageArguments = { pageNumber, pageSize };

  return pageArguments;
}

function ConstructFilters() {
  const filters = [];
  function FilterBody(name, tname, values, pname) {
    this.Name = name;
    this.TypeName = tname;
    this.Values = values;
    this.PropertyName = pname;
  }

  const vars = $.getUrlVars();

  const titlefragment = vars.titleFragment;
  const { statusIds } = vars;
  const yearFrom = vars.from_year;
  const yearTo = vars.to_year;
  const { genreIds } = vars;
  const { isDescending } = vars;
  const { orderBy } = vars;
  if (statusIds) {
    for (let i = 0; i < statusIds.length; i += 1) {
      statusIds[i] = parseInt(statusIds[i], 10);
    }
    const StatusFilter = new FilterBody('HasStatus', 'string', statusIds, 'Status');
    filters.push(StatusFilter);
  }
  const { arIds } = vars;
  if (arIds) {
    for (let i = 0; i < arIds.length; i += 1) {
      arIds[i] = parseInt(arIds[i], 10);
    }
    const ARFilter = new FilterBody('HasAgeRestriction', 'string', arIds, 'AgeRestriction');
    filters.push(ARFilter);
  }
  if (titlefragment) {
    const TitleContainsTextFilter = new FilterBody('TitleContainsText', 'string', titlefragment, 'Title');
    filters.push(TitleContainsTextFilter);
  }
  if (yearFrom) {
    const YearSpanFromFilter = new FilterBody('YearSpanFrom', 'string', yearFrom, 'Year');
    filters.push(YearSpanFromFilter);
  }
  if (yearTo) {
    const YearSpanToFilter = new FilterBody('YearSpanTo', 'string', yearTo, 'Year');
    filters.push(YearSpanToFilter);
  }
  if (genreIds) {
    const HasGenresFilter = new FilterBody('HasGenres', 'string', genreIds, 'Genres');
    filters.push(HasGenresFilter);
  }
  if (orderBy) {
    if (isDescending) {
      const OrderDescendingFilter = new FilterBody('OrderDescending', 'string', '', orderBy[0]);
      filters.push(OrderDescendingFilter);
    } else {
      const OrderAscendingFilter = new FilterBody('OrderAscending', 'string', '', orderBy[0]);
      filters.push(OrderAscendingFilter);
    }
  }
  return filters;
}

function displayPages(pageCount) {
  for (let i = 0; i < pageCount; i += 1) {
    $('#pagination-block').append(`<a href="${localStorage.getItem('FilterUrl')}&page=${i + 1}">${i + 1}</a>`);
  }
}

function displaySearchResults(animes, totalAnimesAmount) {
  const foundTotal = totalAnimesAmount;
  $('#search-result').text(`${foundTotal} Animes found`);

  for (let i = 0; i < foundTotal; i += 1) {
    const elem = animes[i];
    let html = '';
    html += '<div class="preview-block">';
    html += `<a href="${currentHost}/HTML/Anime.html?Id=${elem.id}">`;
    html += `<img class="preview-img" src="../${elem.image}" alt=""/></a>`;
    html += '<div class="preview-info-block">';
    html += `<a href="${currentHost}/HTML/Anime.html?Id=${elem.id}" class="preview-title">${elem.title}</a>`;

    html += '<div>';
    const { rating } = elem;
    html += `<span class="main-rating">${rating}</span>`;
    html += `<span class="main-rating-info">${elem.votes} total votes</span>`;
    html += '</div>';

    html += '<ul class="content-main-info"><li>';
    if (elem.year) {
      html += `${elem.year} | `;
    }
    html += elem.status.statusName;
    html += ' | Episodes: ';
    if (elem.episodes) {
      html += elem.episodes;
    } else {
      html += '1+';
    }
    html += '</li>';
    if (elem.genres.length > 0) {
      html += '<li class="categories-list">';
      html += '<span>Genres:</span>';
      html += '<ul>';
      elem.genres.forEach((cat) => {
        html += `<li>${cat.genre.name}</li>`;
      });
      html += '</ul>';
    }
    html += `<li class="ageRestr"><span>Age Restriction:</span>${elem.ageRestriction.restrictionCode} (${elem.ageRestriction.ageRequired}+)` + '</li>';
    html += '</ul></div></div>';
    $('#new').append(html);
  }
}

let animesToDisplay = null;
let pageAmount = 0;
let totalAnimesRetrieved;
let timer;

$('#logout').click((event) => {
  event.preventDefault();

  localStorage.removeItem('JwtToken');
  removeExpiration();
  window.location.href = '../index.html?page=1';
});

$(document).ready(() => {
  setExpiration();
  displayAdminPage();
  displayLogInOut();
  displayUserPage();
  RandomAnime();
  timer = window.setInterval(refreshExpiration, 5000);

  const filters = ConstructFilters();
  const pageArguments = GeneratePageArgs();

  const request = $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    url: 'https://localhost:5001/api/Anime/GetByFilter',
    type: 'post',
    dataType: 'json',
    async: false,
    data: JSON.stringify({ pageArguments, filters }),
  });
  request.done((response) => {
    animesToDisplay = response.animes;
    pageAmount = response.totalPagesAmount;
    totalAnimesRetrieved = response.totalAnimesFound;
  });

  request.fail((responce) => {
    console.error(
      `The following error occurred: ${
        responce.responseText}`,
    );
  });

  displayPages(pageAmount);
  displaySearchResults(animesToDisplay, totalAnimesRetrieved);
});
