const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

let hobbiesLoggedIn = false;

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === 'test@mail.com' && password === '123456') {
    message.textContent = 'Succesvol ingelogd';
    hobbiesLoggedIn = true;
  } else {
    message.textContent = 'Verkeerde logingegevens';
  }
});

const links = document.querySelectorAll("nav a");

links.forEach(link => {
   link.addEventListener("click", () => {
      document.body.classList.add("fade-bg");

      setTimeout(() => {
         document.body.classList.remove("fade-bg");
      }, 600);
   });
});