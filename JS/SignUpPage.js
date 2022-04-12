function SignUpUser() {
  const username = $('#username').val().toString();
  const email = $('#email').val().toString();
  const pass1 = $('#password').val().toString();
  const pass2 = $('#password2').val().toString();

  if (pass1 !== pass2) {
    $('#signup-responce').text('Passwords do not match.');
    $('#signup-responce').addClass('unsuccessfulResponce');
    $('#signup-responce').show();

    return null;
  }

  let passwordHash = sha256(pass1).then((res) => {
    passwordHash = res;

    $.ajax({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      type: 'post',
      url: `${apiServerAddress}/api/User/SignUp`,
      dataType: 'json',
      data: JSON.stringify({ username, passwordHash, email }),
      async: false,
      success(token) {
        localStorage.setItem('JwtToken', token);
        $('#signup-responce')
          .text('Account created!')
          .removeClass('unsuccessfulResponce')
          .addClass('successfulResponce')
          .show();
        window.location.href = '../index.html?page=1';
      },
      error(errorThrown) {
        console.error(errorThrown);
        $('#signup-responce')
          .text(errorThrown.responseJSON)
          .removeClass('successfulResponce')
          .addClass('unsuccessfulResponce')
          .show();
      },
    });
  });
}

$('#submit').click(() => {
  SignUpUser();
});
