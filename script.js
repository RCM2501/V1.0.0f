if (window === window.parent && !window.location.pathname.endsWith('/index.html')) {
  window.location.replace('index.html');
}

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

const storedEmail = 'ricomourik@mail.com';
const PEPPER = 'SuperSecretPepper123';
const STORED_SALT = 'abcd1234wxyz5678';
// Wachtwoord: HobbieRico#2026
const STORED_HASH = 'eac41056b9d3437e59971cf27d272d05d9acf004889ca7defc99c66d670fd9b9';

async function generateHash(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hashSaltedPassword(password) {
  return generateHash(password + STORED_SALT + PEPPER);
}

function openArticleFrame(src) {
  const overlay = document.getElementById('article-overlay');
  const articleFrame = document.getElementById('article-frame');
  if (!overlay || !articleFrame) {
    return;
  }
  articleFrame.src = src;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticleFrame() {
  const overlay = document.getElementById('article-overlay');
  const articleFrame = document.getElementById('article-frame');
  if (!overlay || !articleFrame) {
    return;
  }
  overlay.classList.remove('active');
  articleFrame.src = 'about:blank';
  document.body.style.overflow = '';
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
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;

      const passwordHash = await hashSaltedPassword(password);
      if (email === storedEmail.toLowerCase() && passwordHash === STORED_HASH) {
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

  const articleButtons = document.querySelectorAll('.lees-meer');
  const articleOverlay = document.getElementById('article-overlay');
  const overlayClose = document.querySelector('.overlay-close');

  articleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const src = button.getAttribute('data-src');
      if (src) {
        openArticleFrame(src);
      }
    });
  });

  if (overlayClose) {
    overlayClose.addEventListener('click', closeArticleFrame);
  }

  if (articleOverlay) {
    articleOverlay.addEventListener('click', (event) => {
      if (event.target === articleOverlay) {
        closeArticleFrame();
      }
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
