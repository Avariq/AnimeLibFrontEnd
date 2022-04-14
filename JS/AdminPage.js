function FilterBody(name, tname, values, pname) {
  this.Name = name;
  this.TypeName = tname;
  this.Values = values;
  this.PropertyName = pname;
}

function getAnimesByFilter(filters) {
  let animes = null;
  const request = $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    url: `${apiServerAddress}/api/Anime/GetByFilter`,
    type: 'post',
    dataType: 'json',
    async: false,
    data: JSON.stringify({ pageArguments: null, filters }),
  });
  request.done((response) => {
    animes = response;
  });

  request.fail((responce) => {
    console.error(
      `The following error occurred: ${
        responce.responseText}`,
    );
  });

  return animes;
}

function postImage(formData) {
  $.ajax({
    headers: { Authorization: `Bearer ${localStorage.getItem('JwtToken')}` },
    url: `${apiServerAddress}/api/FileUpload`,
    data: formData,
    processData: false,
    contentType: false,
    async: false,
    type: 'post',
    success() {
      console.log('Posting');
    },
  });
}

$('#logout').click((event) => {
  event.preventDefault();

  localStorage.removeItem('JwtToken');
  removeExpiration();
  window.location.href = '../index.html?page=1';
});

$.extend({
  getAllGenres() {
    let genres = [];
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetAllGenres`,
      dataType: 'json',
      async: false,
      success(data) {
        genres = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return genres;
  },
});

let genres = null;
let animes = [];

let timer;

$(document).ready(() => {
  setExpiration();
  displayLogInOut();
  timer = window.setInterval(refreshExpiration, 5000);
  genres = $.getAllGenres();
  displayGenres();
});

$('.autofill-anime-title').keypress(function () {
  if ($(this).val().length > 2 && $(this).val().length <= 4) {
    const titleContainsTextFilter = new FilterBody('TitleContainsText', 'string', [$(this).val().toString()], 'some');
    const filters = [];
    filters.push(titleContainsTextFilter);
    animes = [];
    animesJson = getAnimesByFilter(filters);
    for (let i = 0; i < animesJson.animes.length; i += 1) {
      animes.push(animesJson.animes[i].title);
    }
    fieldsAutoComplete();
  }
});

function fieldsAutoComplete() {
  $('#arc-anime-title').autocomplete({
    source: animes,
    minLength: 2,
  });

  let arcs = null;

  $('#ep-anime-title').autocomplete({
    source: animes,
    minLength: 2,
  });

  $('#ep-anime-title').blur(() => {
    const animeTitle = document.getElementById('ep-anime-title').value;
    if ($.inArray(animeTitle, animes) === -1) {
      console.error('Such anime does not exist.');
      return;
    }
    const Id = $.getAnimeId(animeTitle);
    arcs = $.getArcTitles(Id);
    $('#ep-arc-title').autocomplete({
      source: arcs,
      minLength: 0,
    })
      .focus(function () {
        $(this).autocomplete('search', $(this).val());
      });
  });
}

function displayGenres() {
  for (let i = 0; i < genres.length; i += 1) {
    $('#genre-choice').append(`<label><input type="checkbox" name="anime-genre" value="${genres[i].name}" />${genres[i].name}</label>`);
  }
}

$('#new-anime').click(() => {
  $('#new-arc').removeClass('viewing');
  $('#new-episode').removeClass('viewing');
  $('#new-arc-block').hide();
  $('#new-episode-block').hide();
  $('#new-anime-block').fadeIn();
  $('#new-anime').addClass('viewing');
});
$('#new-arc').click(() => {
  $('#new-anime').removeClass('viewing');
  $('#new-episode').removeClass('viewing');
  $('#new-anime-block').hide();
  $('#new-episode-block').hide();
  $('#new-arc-block').fadeIn();
  $('#new-arc').addClass('viewing');
});
$('#new-episode').click(() => {
  $('#new-anime').removeClass('viewing');
  $('#new-anime-block').hide();
  $('#new-arc-block').hide();
  $('#new-arc').removeClass('viewing');
  $('#new-episode-block').fadeIn();
  $('#new-episode').addClass('viewing');
});

$.extend({
  getAnimeId(animeTitle) {
    let Id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetAnimeIdByTitle?title=${animeTitle}`,
      dataType: 'json',
      async: false,
      success(data) {
        Id = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return Id;
  },
});
$.extend({
  getAnimeTitles() {
    let animes = null;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetAnimeTitles`,
      dataType: 'json',
      async: false,
      success(data) {
        animes = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return animes;
  },
});
$.extend({
  getArcTitles(animeId) {
    let arcs = null;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Arc/GetArcs?animeId=${animeId}`,
      dataType: 'json',
      async: false,
      success(data) {
        arcs = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return arcs;
  },
});
$.extend({
  getArcId(arcName, animeId) {
    let id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Arc/GetArcId?arcName=${arcName}&animeId=${animeId}`,
      dataType: 'json',
      async: false,
      success(data) {
        id = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return id;
  },
});
$.extend({
  getEpId(arcId, epName) {
    let id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Episode/GetEpisodeId?arcId=${arcId}&epName=${epName}`,
      dataType: 'json',
      async: false,
      success(data) {
        id = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });

    return id;
  },
});
$.extend({
  getStatusId(statusName) {
    let id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetStatusId?statusName=${statusName}`,
      dataType: 'json',
      async: false,
      success(data) {
        console.log('retrieved data:', data);
        id = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return id;
  },
});
$.extend({
  getAgeRestrictionId(ARCode) {
    let id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetAgeRestrictionId?ageRestrictionCode=${ARCode}`,
      dataType: 'json',
      async: false,
      success(data) {
        id = data;
      },
      error(errorThrown) {
        console.error(errorThrown);
      },
    });
    return id;
  },
});

$('#new-episode-form').submit((event) => {
  event.preventDefault();

  const $form = $(this);
  const $inputs = $form.find('input');

  $inputs.prop('disabled', true);

  const animeTitle = document.getElementById('ep-anime-title').value.toString();
  const arcTitle = document.getElementById('ep-arc-title').value.toString();

  const animeId = $.getAnimeId(animeTitle);
  const arcId = $.getArcId(arcTitle, animeId);

  const epName = document.getElementById('ep-title').value.toString();
  const epLen = document.getElementById('ep-length').value;

  const request = $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
    },
    url: `${apiServerAddress}/api/Episode/CreateEpisode`,
    type: 'post',
    dataType: 'json',
    async: false,
    data: JSON.stringify({ name: epName, duration: epLen, arcId }),
  });
  request.done(() => {
    console.log('NewEpisode: Success 201');
  });

  request.fail((responce) => {
    console.error(
      `The following error occurred: ${
        responce.responseText.split('.')[0].replace('"', '')}`,
    );
  });

  request.always(() => {
    $inputs.prop('disabled', false);
  });
});

$('#new-arc-form').submit((event) => {
  event.preventDefault();

  const $form = $(this);
  const $inputs = $form.find('input');

  $inputs.prop('disabled', true);

  const animeTitle = $('#arc-anime-title').val().toString();

  const Id = $.getAnimeId(animeTitle);

  const new_arc = $('#arc-arc-title').val().toString();

  const request = $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
    },
    url: `${apiServerAddress}/api/Arc/CreateArc`,
    type: 'post',
    dataType: 'json',
    async: false,
    data: JSON.stringify({ animeId: Id, name: new_arc }),
  });
  request.done(() => {
    console.log('NewArc: Success 201');
  });

  request.fail((responce) => {
    console.error(
      `The following error occurred: ${
        responce.responseText.split('.')[0].replace('"', '')}`,
    );
  });

  request.always(() => {
    $inputs.prop('disabled', false);
  });
});

$('#new-anime-form').submit((event) => {
  event.preventDefault();
  const $form = $(this);
  const $inputs = $form.find('input');
  $inputs.prop('disabled', true);

  const animeName = $('#anime-name').val().toString();
  const animeYear = $('#anime-year').val();
  const animeEpisodes = $('#anime-episodes').val();
  const animeDescription = $('#anime-description').val().toString();

  const animeStatus = $("input:radio[name='status']:checked").val().toString();
  const animeAgeRestriction = $("input:radio[name='ar']:checked").val().toString();

  const animeGenres = [];
  $.each($("input[name='anime-genre']:checked"), function () {
    animeGenres.push($(this).val().toString());
  });

  const genresToReturn = [];
  for (let i = 0; i < animeGenres.length; i += 1) {
    for (let j = 0; j < genres.length; j += 1) {
      if (animeGenres[i] === genres[j].name) {
        genresToReturn.push(genres[j]);
      }
    }
  }

  const { files } = document.getElementById('img-file');
  const formData = new FormData();
  formData.append('files', files[0]);

  const filename = files[0].name;

  const animeStatusId = $.getStatusId(animeStatus);
  const animeAgeRestrictionId = $.getAgeRestrictionId(animeAgeRestriction);

  const animeData = {
    Anime: {
      title: animeName,
      year: animeYear,
      episodes: animeEpisodes,
      image: `Images/${filename}`,
      description: animeDescription,
      statusId: animeStatusId,
      ageRestrictionId: animeAgeRestrictionId,
    },
    Genres: genresToReturn,
  };

  const request = $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
    },
    url: `${apiServerAddress}/api/Anime/CreateAnime`,
    type: 'post',
    dataType: 'json',
    async: false,
    data: JSON.stringify(animeData),
  });
  request.done(() => {
    console.log('NewAnime: Success 201');
    postImage(formData);
  });

  request.fail((responce) => {
    console.error(
      `The following error occurred: ${
        responce.responseText}`,
    );
  });

  request.always(() => {
    $inputs.prop('disabled', false);
  });
});
