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
$.extend({
  getAnimeById(id) {
    let anime = null;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetAnimeById?animeId=${id}`,
      dataType: 'json',
      async: false,
      success(data) {
        anime = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return anime;
  },
});

$('#spoiler-title').click(() => {
  $('#spoiler-content').toggle(200);
});

$('#logout').click((event) => {
  event.preventDefault();

  localStorage.removeItem('JwtToken');
  removeExpiration();
  window.location.href = '../index.html?page=1';
});

function displayAnime() {
  vars = $.getUrlVars();
  const animeId = parseInt(vars.Id, 10);
  const anime = $.getAnimeById(animeId);
  console.log(anime);
  $('#anime-image').attr('src', `../${anime.image}`);
  $('#title').text(anime.title);
  $('#rating').text(anime.rating);
  $('#votes').text(`Votes: ${anime.votes}`);
  $('#content-main-info').append(`<li> Views: ${anime.views}</li>`);
  $('#content-main-info').append(`<li> <span>Status:</span><span id="stat">${anime.status.statusName}</span></li>`);
  $('#content-main-info').append(`<li> Year: ${anime.year}</li>`);
  $('#content-main-info').append(`<li> Age restriction: ${anime.ageRestriction.restrictionCode} (${anime.ageRestriction.ageRequired}+)` + '</li>');
  $('#content-main-info').append('<li id="genres"> Genres: </li>');
  for (let i = 0; i < anime.genres.length; i += 1) {
    $('#genres').append(`<p> ${anime.genres[i].genre.name} </p>`);
  }
  $('#content-main-info').append(`<li> Episodes: ${anime.episodes}</li>`);
  $('#content-desc-text').append(`<p>${anime.description}</p>`);
  const arcBlock = $('.spoiler');
  $('.spoiler').hide();
  let counter = 1;
  for (let i = 0; i < anime.arcs.length; i += 1) {
    const newArcBlock = arcBlock.clone();
    newArcBlock.find('.spoiler-title > p').text(`Arc #${i + 1}: ${anime.arcs[i].name}`);
    for (let j = 0; j < anime.arcs[i].episodes.length; j += 1) {
      const episode = anime.arcs[i].episodes[j];
      newArcBlock.find('.spoiler-content').append(`<p>${counter}. ${episode.name} (${episode.duration} minutes)` + '</p > ');
      counter += 1;
      newArcBlock.find('.spoiler-content').hide();
    }
    newArcBlock.show();
    $('#spoiler-content').append(newArcBlock);
  }

  const status = anime.status.statusName;
  if (status === 'Released') {
    $('#stat').addClass('released');
  } else if (status === 'Ongoing') {
    $('#stat').addClass('ongoing');
  } else if (status === 'Announced') {
    $('#stat').addClass('announced');
  }
}

let timer;

$(document).ready(() => {
  displayAnime();
  setExpiration();
  RandomAnime();
  displayUserPage();
  displayAdminPage();
  displayLogInOut();
  timer = window.setInterval(refreshExpiration, 5000);
});

$('#spoiler-content').on('click', '.spoiler-title', function () {
  $(this).siblings('.spoiler-content').toggle(200);
});
