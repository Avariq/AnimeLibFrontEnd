$.extend({
  performLogin(username, passwordHash) {
    $.ajax({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      type: 'post',
      url: 'https://localhost:5001/api/User/Login',
      dataType: 'json',
      data: JSON.stringify({ username, passwordHash }),
      async: false,
      success(token) {
        localStorage.setItem('JwtToken', token);
        $('#login-responce')
          .text('Logged in!')
          .removeClass('unsuccessfulResponce')
          .addClass('successfulResponce')
          .show();
        window.location.href = '../index.html?page=1';
      },
      error(errorThrown) {
        $('#login-responce')
          .text(errorThrown.responseJSON)
          .removeClass('successfulResponce')
          .addClass('unsuccessfulResponce')
          .show();
      },
    });
  },
});

$(document).ready(() => {

});

$('#login-form').submit((event) => {
  event.preventDefault();

  const username = $('#username').val().toString();
  let passwordHash = sha256($('#password').val().toString()).then((res) => {
    passwordHash = res;
    $.performLogin(username, passwordHash);
  });
});
