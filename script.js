function getFrameElement() {
  if (window.parent && window.parent !== window) {
    return window.parent.document.getElementById('mainframe');
  }
  return document.getElementById('mainframe');
}

function setFrameSrc(src) {
  const frame = getFrameElement();
  if (frame) {
    frame.src = src;
  }
}

function isLoggedIn() {
  return localStorage.getItem('hobbiesLoggedIn') === 'true';
}

function showLoginError(messageText) {
  const message = document.getElementById('message');
  if (message) {
    message.textContent = messageText;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const frame = document.getElementById('mainframe');
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      if (email === 'test@mail.com' && password === '123456') {
        localStorage.setItem('hobbiesLoggedIn', 'true');
        showLoginError('');
        window.location.href = 'Hobbiesin.html';
      } else {
        showLoginError('Verkeerde logingegevens');
      }
    });
  }

  if (frame) {
    frame.addEventListener('load', function () {
      const loggedIn = isLoggedIn();
      const currentSrc = frame.src || '';

      if (loggedIn && !currentSrc.includes('Hobbiesin.html')) {
        localStorage.removeItem('hobbiesLoggedIn');
      }

      if (!isLoggedIn() && currentSrc.includes('Hobbiesin.html')) {
        frame.src = 'Hobbies.html';
      }
    });

    const hobbiesLinks = document.querySelectorAll('a[href="Hobbies.html"][target="mainframe"]');
    hobbiesLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        gaNaarHobbies();
      });
    });
  }
});

function gaNaarHobbies() {
  if (isLoggedIn()) {
    setFrameSrc('Hobbiesin.html');
  } else {
    setFrameSrc('Hobbies.html');
  }
}
