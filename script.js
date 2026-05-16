const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Simpele demo login
  if (email === 'test@mail.com' && password === '123456') {
    message.textContent = 'Succesvol ingelogd!';
  } else {
    message.textContent = 'Verkeerde logingegevens';
  }
});