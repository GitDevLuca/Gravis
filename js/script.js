// Login-Daten
const benutzername = '1';
const passwort = '';

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

const fachListeContainer = document.getElementById('fachListeContainer');

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
  loginForm.style.display = 'block';
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
    const li = document.createElement('li');
    li.textContent = `Note: ${eintrag.note}, Gewichtung: ${eintrag.gewichtung}%`;

    const btn = document.createElement('button');
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
  notenManager.style.display = 'block';
};
