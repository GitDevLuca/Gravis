// Login-Daten
const benutzername = 'admin';
const passwort = '1234';

// DOM-Elemente
const loginForm = document.getElementById('loginForm');
const notenManager = document.getElementById('notenManager');
const logoutButton = document.getElementById('logoutButton');
const gotoLogin = document.getElementById('gotoLogin');
const submitLogin = document.getElementById('submitLogin');
const gotoRegister = document.getElementById('gotoRegister');
const submitRegister = document.getElementById('submitRegister');
const loginError = document.getElementById('loginError');
const registerrror = document.getElementById('registerError');
const error = document.getElementsByClassName('error');
const darkModeToggle = document.getElementById('darkModeToggle');

const fachListeContainer = document.getElementById('fachListeContainer');

// Dark Mode Toggle Functionality
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.remove('body-light');
    document.body.classList.add('body-dark');
  } else {
    document.body.classList.remove('body-dark');
    document.body.classList.add('body-light');
  }
}

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.selected) {
    localStorage.setItem('theme', 'dark');
    applyTheme('dark');
  } else {
    localStorage.setItem('theme', 'light');
    applyTheme('light');
  }
});

// Check for saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    darkModeToggle.selected = true;
    applyTheme('dark');
  } else {
    // Default to light theme if no preference or preference is light
    darkModeToggle.selected = false;
    applyTheme('light'); // Ensure light theme is applied if no saved preference
  }

  // Ensure body always starts with one of the theme classes
  if (!document.body.classList.contains('body-light') && !document.body.classList.contains('body-dark')) {
    document.body.classList.add('body-light'); // Default to light
  }
});

// Initialisieren der Noten
let noten = {};
let aktuellesFach = '';

// Go To Login
gotoLogin.onclick = () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'flex';
  loginError.style.display = 'none';
};

// Login
submitLogin.onclick = () => {
  const user = document.getElementById('username').value;
  const pw = document.getElementById('password').value;

  if (user === benutzername && pw === passwort) {
    loginForm.style.display = 'none';
    notenManager.style.display = 'flex';
    loginError.style.display = 'none';
    error.style.display = 'none';
  } else {
    loginError.style.display = 'block';
  }
};

// Go To Registrierung
gotoRegister.onclick = () => {
  registerForm.style.display = 'flex';
  loginForm.style.display = 'none';
  registerError.style.display = 'none';
};

// Registrierung
submitRegister.onclick = () => {
  const registeruser = document.getElementById('registerusername').value;
  const registerpw = document.getElementById('registerpassword').value;
  const registerpwrepeat = document.getElementById('registerpasswordrepeat').value;

  if (registerpw === registerpwrepeat) {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
    registerError.style.display = 'none';
    error.style.display = 'none';
  } else {
    registerError.style.display = 'block';
  }
};

// Logout
logoutButton.onclick = () => {
  loginForm.style.display = 'flex';
  notenManager.style.display = 'none';
  document.getElementById('notenDetails').style.display = 'none';
};

// Fach hinzufügen mit Kategorieauswahl
function fachHinzufuegen() {
  const name = document.getElementById('fachNameInput').value.trim();
  const select = document.getElementById('kategorieSelect');
  const kategorie = select.value;

  if (!name || select.selectedIndex === 0) {
    alert("Bitte Fachname eingeben und Kategorie auswählen.");
    return;
  }

  if (!noten[name]) noten[name] = [];

  let kategorieDiv = document.getElementById('kat_' + kategorie);
  if (!kategorieDiv) {
    kategorieDiv = document.createElement('div');
    kategorieDiv.classList.add('kategorie-block');
    kategorieDiv.id = 'kat_' + kategorie;
    kategorieDiv.innerHTML = `<h4>${kategorie}</h4>`;
    fachListeContainer.appendChild(kategorieDiv);
  }

  const fachDiv = document.createElement('div');
  fachDiv.classList.add('fach-eintrag');
  fachDiv.id = `fach_${name}`;
  fachDiv.onclick = () => fachAuswaehlen(name);

  const nameSpan = document.createElement('span');
  nameSpan.textContent = name;

  const durchschnittSpan = document.createElement('span');
  durchschnittSpan.className = 'durchschnitt';
  durchschnittSpan.textContent = ' | Durchschnitt: -';

  fachDiv.appendChild(nameSpan);
  fachDiv.appendChild(durchschnittSpan);

  kategorieDiv.appendChild(fachDiv);

  document.getElementById('fachNameInput').value = '';
  select.selectedIndex = 0;
}

// Fach auswählen
function fachAuswaehlen(fach) {
  aktuellesFach = fach;
  document.getElementById('fachNameDetails').textContent = fach;
  document.getElementById('notenDetails').style.display = 'flex';
  notenManager.style.display = 'none';
  zeigeNoten();
}

// Noten anzeigen und Durchschnitt berechnen
function zeigeNoten() {
  const liste = document.getElementById('notenListeDetails');
  liste.innerHTML = '';

  const eintraege = noten[aktuellesFach] || [];

  eintraege.forEach((eintrag, index) => {
    const li = document.createElement('md-list-item');
    li.textContent = `Note: ${eintrag.note}, Gewichtung: ${eintrag.gewichtung}%`;

    const btn = document.createElement('md-filled-button');
    btn.textContent = 'Löschen';
    btn.onclick = () => {
      eintraege.splice(index, 1);
      zeigeNoten();
    };

    li.appendChild(btn);
    liste.appendChild(li);
  });

  // Durchschnitt berechnen und anzeigen
  let summe = 0;
  let gesamtGewichtung = 0;

  eintraege.forEach(e => {
    summe += e.note * (e.gewichtung / 100);
    gesamtGewichtung += e.gewichtung / 100;
  });

  let durchschnitt = '-';
  if (gesamtGewichtung > 0) {
    durchschnitt = (summe / gesamtGewichtung).toFixed(2);
  }

  const fachDiv = document.getElementById(`fach_${aktuellesFach}`);
  if (fachDiv) {
    const span = fachDiv.querySelector('.durchschnitt');
    if (span) span.textContent = ` | Durchschnitt: ${durchschnitt}`;
  }
}

function berechneGesamtDurchschnitt() {
  let summe = 0;
  let gesamtGewichtung = 0;

  Object.keys(noten).forEach(fach => {
    noten[fach].forEach(eintrag => {
      summe += eintrag.note * (eintrag.gewichtung / 100);
      gesamtGewichtung += eintrag.gewichtung / 100;
    });
  });

  let durchschnitt = '-';
  if (gesamtGewichtung > 0) {
    durchschnitt = (summe / gesamtGewichtung).toFixed(2);
  }
  return durchschnitt;
}

// Beispiel: Gesamt-Durchschnitt anzeigen
const gesamtDurchschnittSpan = document.getElementById('completeAverage');
if (gesamtDurchschnittSpan) {
  setInterval(() => {
    gesamtDurchschnittSpan.textContent = `${berechneGesamtDurchschnitt()}`;
  }, 1000);
}

// Note hinzufügen
document.getElementById('noteHinzufuegenButton').onclick = () => {
  const note = parseFloat(document.getElementById('noteInput').value);
  const gewichtung = parseFloat(document.getElementById('gewichtungInput').value);

  if (isNaN(note) || isNaN(gewichtung)) {
    alert("Bitte gültige Note und Gewichtung eingeben.");
    return;
  }

  if (note > 6 || note < 1){
    alert("Bitte gültige Note und Gewichtung eingeben.");
    return;
  }

  if (!noten[aktuellesFach]) noten[aktuellesFach] = [];
  noten[aktuellesFach].push({ note, gewichtung });

  document.getElementById('noteInput').value = '';
  document.getElementById('gewichtungInput').value = '';
  zeigeNoten();
};

// Zurück zur Übersicht
document.getElementById('backButton').onclick = () => {
  document.getElementById('notenDetails').style.display = 'none';
  notenManager.style.display = 'flex';
};
