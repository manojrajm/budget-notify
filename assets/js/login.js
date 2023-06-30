function login(event) {
  event.preventDefault();

  // Get the login form inputs
  var usernameInput = document.getElementById('login-username');
  var passwordInput = document.getElementById('login-password');
  var signupInput = document.getElementById('signup-username');
  var signupps = document.getElementById('signup-password');
  var signupInput = signupInput.value;
  var signupps = signupps.value;
  var username = usernameInput.value;
  var password = passwordInput.value;

  // Perform the login authentication here
  // You can make an AJAX request to your backend or use any other authentication method

  // For simplicity, let's assume the login is successful if the username is "admin" and password is "password"
  if (username === 'admin' && password === 'password') {
    // Redirect the user to the budget app
    window.location.href = 'app.html';
  } else {
    // Clear the input fields
    usernameInput.value = '';
    passwordInput.value = '';

    // Display an error message or perform any other desired action
    alert('Invalid username or password. Please try again.');
  }
}

