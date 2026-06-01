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

const API_KEY = "9dbb6117f36540e18b67b393759f41a1";

let nieuwsArticles = [];
let currentNewsIndex = 0;
const NIEUWS_PER_PAGE = 3;

function showNieuwsItems() {
    const nieuwsContainer = document.getElementById("nieuws-container");
    const switchButton = document.getElementById("nieuws-switch-btn");
    if (!nieuwsContainer) {
        return;
    }

    nieuwsContainer.innerHTML = "";

    if (!nieuwsArticles || nieuwsArticles.length === 0) {
        nieuwsContainer.innerHTML = "<p>Geen nieuwsartikelen gevonden.</p>";
        if (switchButton) switchButton.style.display = 'none';
        return;
    }

    const endIndex = Math.min(currentNewsIndex + NIEUWS_PER_PAGE, nieuwsArticles.length);
    const pageArticles = nieuwsArticles.slice(currentNewsIndex, endIndex);

    pageArticles.forEach(article => {
        const nieuwsItem = document.createElement("div");
        nieuwsItem.classList.add("news-item");

        nieuwsItem.innerHTML = `
            ${article.urlToImage ? `
                <img src="${article.urlToImage}" alt="${article.title}">
            ` : ""}
            <h2>${article.title}</h2>
            <p>${article.description || "Geen beschrijving beschikbaar."}</p>
            <a href="${article.url}" target="_blank">
                Lees verder →
            </a>
        `;

        nieuwsContainer.appendChild(nieuwsItem);
    });

    if (switchButton) {
        switchButton.style.display = nieuwsArticles.length > NIEUWS_PER_PAGE ? 'inline-block' : 'none';
    }
}

function showNextNieuws() {
    if (!nieuwsArticles || nieuwsArticles.length === 0) return;

    currentNewsIndex += NIEUWS_PER_PAGE;
    if (currentNewsIndex >= nieuwsArticles.length) {
        currentNewsIndex = 0;
    }
    showNieuwsItems();
}

async function laadNieuws() {
    const nieuwsContainer = document.getElementById("nieuws-container");
    const switchButton = document.getElementById("nieuws-switch-btn");
    if (!nieuwsContainer) {
        return;
    }

    nieuwsContainer.innerHTML = "<p>Nieuws laden...</p>";
    if (switchButton) switchButton.style.display = 'none';

    try {
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=nieuws&language=nl&pageSize=10&apiKey=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error(data.message || 'Ongeldige antwoordstatus van de NewsAPI');
        }

        nieuwsArticles = data.articles || [];
        currentNewsIndex = 0;
        showNieuwsItems();
    } catch (error) {
        nieuwsContainer.innerHTML =
            `<p>Er is een fout opgetreden bij het laden van het nieuws: ${error.message}</p>`;
        console.error(error);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const switchButton = document.getElementById("nieuws-switch-btn");
    if (switchButton) {
        switchButton.addEventListener('click', showNextNieuws);
    }
    laadNieuws();
});