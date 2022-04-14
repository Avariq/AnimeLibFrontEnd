const apiServerAddress = 'https://localhost:5001';
const currentHost = 'http://127.0.0.1:5500';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

$.extend({
  getStatusId(statusName) {
    let id = -1;
    $.ajax({
      type: 'get',
      url: `${apiServerAddress}/api/Anime/GetStatusId?statusName=${statusName}`,
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

function getRandomAnime() {
  let anime = null;
  $.ajax({
    type: 'get',
    url: `${apiServerAddress}/api/Anime/GetRandomAnime`,
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
}

function displayLogInOut() {
  const token = localStorage.getItem('JwtToken');
  if (token) {
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() < parsedToken.exp * 1000) {
      $('#login').hide();
      $('#logout').show();
    } else {
      window.clearInterval(timer);
      $('#login').show();
      $('#logout').hide();
      window.localStorage.removeItem('JwtToken');
    }
  } else {
    window.clearInterval(timer);
    $('#login').show();
    $('#logout').hide();
    window.localStorage.removeItem('JwtToken');
  }
}

function displayAdminPage() {
  const token = localStorage.getItem('JwtToken');
  if (token) {
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= parsedToken.exp * 1000) {
      $('#admin-page').hide();
      return false;
    }

    if (parsedToken.role === 'Admin') {
      $('#admin-page').show();
    } else {
      $('#admin-page').hide();
    }
  }
}

function displayUserPage() {
  const token = localStorage.getItem('JwtToken');
  if (token) {
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= parsedToken.exp * 1000) {
      $('#user-page').hide();
      return false;
    }

    $('#user-page').text(parsedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']);
    $('#user-page').show();
  }
}

function refreshToken() {
  $.ajax({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
    },
    type: 'post',
    url: `${apiServerAddress}/api/User/RefreshToken`,
    dataType: 'json',
    async: false,
    success(token) {
      localStorage.setItem('JwtToken', token);
    },
    error(errorThrown) {
      console.error(errorThrown.responseJSON);
    },
  });
}

function setExpiration() {
  const token = localStorage.getItem('JwtToken');
  if (token) {
    const parsedToken = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= parsedToken.exp * 1000) {
      window.localStorage.removeItem('JwtToken');
      window.localStorage.removeItem('Expires');
    } else {
      window.localStorage.setItem('Expires', parsedToken.exp * 1000);
    }
  } else {
    window.localStorage.removeItem('Expires');
  }
}

function removeExpiration() {
  if (window.localStorage.getItem('Expires')) {
    window.localStorage.removeItem('Expires');
  }
}
function refreshExpiration() {
  const curExp = window.localStorage.getItem('Expires');
  if (curExp) {
    const newExp = curExp - Date.now();
    if (newExp < 60000 * 2) {
      refreshToken();
      setExpiration();
    }
  }
}

function RandomAnime() {
  const anime = getRandomAnime();
  $('#random-anime').attr('href', `/HTML/Anime.html?Id=${anime.id}`);
}
