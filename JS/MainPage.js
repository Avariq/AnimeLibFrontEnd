const animePerPage = 6;
let genres = null;

let timer;

$('#logout').click((event) => {
  event.preventDefault();

  localStorage.removeItem('JwtToken');
  removeExpiration();
  window.location.href = '/index.html?page=1';
});

function GetAPI(sourceUrl, successCallback) {
  $.ajax({
    type: 'GET',
    url: sourceUrl,
    dataType: 'json',
    success: successCallback,
    error(errorThrown) {
      console.error(errorThrown);
    },
  });
}

function GetRecent(pageNumber, pageSize) {
  let obj = '';
  const sourceUrl = `${apiServerAddress}/api/Anime/GetRecent?pageNumber=${pageNumber}&pageSize=${pageSize}`;
  GetAPI(sourceUrl, onSuccess);

  return obj;

  function onSuccess(jsonData) {
    obj = jsonData;
    const data = Object.entries(jsonData);
    const pageCount = jsonData.totalPagesAmount;
    $.displayPages(pageCount);
    for (let i = 0; i < data[0][1].length; i += 1) {
      const elem = data[0][1][i];
      let html = '';
      html += '<div class="preview-block">';
      html += `<a href="/HTML/Anime.html?Id=${elem.id}">`;
      html += `<img class="preview-img" src="${elem.image}" alt=""/></a>`;
      html += '<div class="preview-info-block">';
      html += `<a href="/HTML/Anime.html?Id=${elem.id}" class="preview-title">${elem.title}</a>`;

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
}

$.extend({
  displayPages(pageCount) {
    for (let i = 0; i < pageCount; i += 1) {
      $('#pagination-block').append(`<a href="?page=${i + 1}">${i + 1}</a>`);
    }
  },
  getUrlVars() {
    const vars = []; let
      hash;
    const hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (let i = 0; i < hashes.length; i += 1) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  displayPage() {
    const vars = $.getUrlVars();
    const pageNumber = vars.page;
    GetRecent(pageNumber, animePerPage);
  },
});

function keypressInBox(e) {
  const code = (e.keyCode ? e.keyCode : e.which);
  if (code === 13) {
    e.preventDefault();

    const input = $('#search').val().toString();

    const url = `?titleFragment=${input}&page=1`;

    window.location.href = `/HTML/Search.html${url}`;
  }
}

$('#search').bind('keypress', {}, keypressInBox);

function InjectGenres() {
  for (let i = 0; i < genres.length; i += 1) {
    const genre = genres[i];
    const newOption = `<option value="${genre.id}">${genre.name}</option>`;
    $('#genre-multichoice').append(newOption);
  }
}

$('#filter-form').submit((event) => {
  event.preventDefault();
  const statusInput = $('#status-multichoice').val();
  let statuses = '';
  for (let i = 0; i < statusInput.length; i += 1) {
    statuses += `statusIds=${$.getStatusId(statusInput[i])}`;
    if (i + 1 >= statusInput.length) {
      break;
    }
    statuses += '&';
  }
  const arsInput = $('#ar-multichoice').val();
  let ars = '&';
  for (let i = 0; i < arsInput.length; i += 1) {
    ars += `arIds=${$.getAgeRestrictionId(arsInput[i])}`;
    if (i + 1 >= arsInput.length) {
      break;
    }
    ars += '&';
  }
  const genresInput = $('#genre-multichoice').val();
  genres = '&';
  for (let i = 0; i < genresInput.length; i += 1) {
    genres += `genreIds=${genresInput[i]}`;
    if (i + 1 >= genresInput.length) {
      break;
    }
    genres += '&';
  }
  if (ars === '&') ars = '';
  if (genres === '&') genres = '';
  let fromYear = `&from_year=${$('#filter_year_from').val()}`;
  if (fromYear === '&from_year=') fromYear = '';
  let toYear = `&to_year=${$('#filter_year_to').val()}`;
  if (toYear === '&to_year=') toYear = '';
  let titleFragment = `&titleFragment=${$('#search').val()}`;
  if (titleFragment === '&titleFragment=') titleFragment = '';
  let orderBy = `&orderBy=${$('#order-choice').val()}`;
  if (orderBy === '&orderBy=') orderBy = '';
  let isDescending = `&isDescending=${$('#isDescending').val()}`;
  if (isDescending === '&isDescending=false') isDescending = '';

  const url = `?${statuses}${ars}${genres}${fromYear}${toYear}${titleFragment}${orderBy}${isDescending}`;
  localStorage.setItem('FilterUrl', url);
  window.location.href = `/HTML/Search.html${url}&page=1`;
});

$(document).ready(() => {
  setExpiration();
  RandomAnime();
  timer = window.setInterval(refreshExpiration, 5000);
  displayAdminPage();
  displayLogInOut();
  displayUserPage();
  $.displayPage(1, animePerPage);
  genres = $.getAllGenres();
  InjectGenres();
  $('#status-multichoice').select2();
  $('#ar-multichoice').select2();
  $('#genre-multichoice').select2();
  $('#order-choice').select2();
  $('#isDescending').select2();
});
