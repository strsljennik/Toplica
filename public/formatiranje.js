let myNickname = ''; // biće postavljen od servera

socket.on('yourNickname', function(nick) {
    myNickname = nick;
});
const virtualGuests = [
  { nickname: 'Bala Hatun', color: 'deepskyblue' },
  { nickname: 'Halime', color: 'purple' },
  { nickname: 'Holofira', color: 'red' },
  { nickname: 'Robot-X', color: 'green' },
  { nickname: 'Security', color: 'blue' },
  { nickname: 'Higijenicar', color: 'olive' },
  { nickname: 'Emir-Bosanac', color: 'lightyellow' },
  { nickname: 'Jasmina', color: 'hotpink' },
  { nickname: 'Can Jaman', color: 'darkslategray' },
  { nickname: 'Elena ukrajinka', color: 'orchid' },
  { nickname: 'Beti Makedonka', color: 'mediumvioletred' }
];

let isBold = false;
let isItalic = false;
let currentColor = "rgb(168, 168, 168)"; // siva boja
let defaultColor = "#a8a8a8"; // inicijalna siva boja
let isUnderline = false;
let isOverline = false;
const guestsData = {};
window.guestsData = guestsData;
let currentGuestId = ''; 
let gradijentOpen = false; // Definiši promenljivu
let currentGradient = null;

let virtualsEnabled = false;

document.getElementById('vir').addEventListener('click', () => {
  virtualsEnabled = !virtualsEnabled;
  socket.emit('toggleVirtualGuests', virtualsEnabled);
});

document.getElementById('boldBtn').addEventListener('click', function() {
    isBold = !isBold;
    updateInputStyle();
});

document.getElementById('italicBtn').addEventListener('click', function() {
    isItalic = !isItalic;
    updateInputStyle();
});

document.getElementById('linijadoleBtn').addEventListener('click', function() {
    isUnderline = !isUnderline;
    updateInputStyle();
});

document.getElementById('linijagoreBtn').addEventListener('click', function() {
    isOverline = !isOverline;
    updateInputStyle();
});

function updateInputStyle() {
    let inputField = document.getElementById('chatInput');
    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.textDecoration = (isUnderline ? 'underline ' : '') + (isOverline ? 'overline' : '');

    if (currentGradient) {
        inputField.style.backgroundClip = 'text';
        inputField.style.webkitBackgroundClip = 'text';
        inputField.style.color = 'transparent'; // važno za rad na FireFox
        inputField.style.webkitTextFillColor = 'transparent';
        inputField.style.backgroundImage = getComputedStyle(document.querySelector(`.${currentGradient}`)).backgroundImage;
    } else {
        inputField.style.backgroundImage = '';
        inputField.style.backgroundClip = '';
        inputField.style.webkitBackgroundClip = '';
        inputField.style.webkitTextFillColor = '';
        inputField.style.color = currentColor;
    }
}

let lastMessages = {}; // Objekt koji prati poslednju poruku svakog korisnika

socket.on('chatMessage', function(data) {
    if (!myNickname) return;

    const myName = currentUser ? currentUser : myNickname;
    let text = data.text.replace(/#n/g, myName);
    if (lastMessages[data.nickname] === text) return;
    lastMessages[data.nickname] = text;

    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // Stilovi za font
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');

    // Boja ili gradijent
     if (data.color) {
        newMessage.style.backgroundImage = '';
        newMessage.style.backgroundClip = '';
        newMessage.style.webkitBackgroundClip = '';
        newMessage.style.webkitTextFillColor = '';
        newMessage.style.color = data.color;
 } else if (data.gradient || window.defaultAdminGradient) {
    const gradClass = data.gradient || window.defaultAdminGradient;
    const gradElement = document.querySelector(`.${gradClass}`);
    if (gradElement) {
        newMessage.style.backgroundClip = 'text';
        newMessage.style.webkitBackgroundClip = 'text';
        newMessage.style.webkitTextFillColor = 'transparent';
        newMessage.style.backgroundImage = getComputedStyle(gradElement).backgroundImage;
    }
}

   // Dodavanje sadržaja poruke
    newMessage.innerHTML = `<strong>${data.nickname}:</strong> ${text.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);
    
      // Snimi poruku ako je aktivno snimanje
if (window.snimanjeAktivno) {
    porukeZaSnimanje.push(newMessage.outerHTML);
}

    const isNearTop = messageArea.scrollTop < 50;
    if (isNearTop) {
        messageArea.scrollTop = 0;
    }
});

socket.on('private_message', function(data) {
    if (!myNickname) return;

    const myName = currentUser ? currentUser : myNickname;
    let text = data.message.replace(/#n/g, myName);
    if (lastMessages[data.from] === text) return;
    lastMessages[data.from] = text;

    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.textDecoration = (data.underline ? 'underline ' : '') + (data.overline ? 'overline' : '');

    if (data.color) {
        newMessage.style.backgroundImage = '';
        newMessage.style.backgroundClip = '';
        newMessage.style.webkitBackgroundClip = '';
        newMessage.style.webkitTextFillColor = '';
        newMessage.style.color = data.color;
    } else if (data.gradient) {
        newMessage.style.backgroundClip = 'text';
        newMessage.style.webkitBackgroundClip = 'text';
        newMessage.style.webkitTextFillColor = 'transparent';
        newMessage.style.backgroundImage = getComputedStyle(document.querySelector(`.${data.gradient}`)).backgroundImage;
    }

    newMessage.innerHTML = `<strong>${data.from}:</strong> ${text.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')} <span style="font-size: 0.8em; color: gray;">(${data.time})</span>`;
    messageArea.prepend(newMessage);

   // Snimi poruku ako je aktivno snimanje
if (window.snimanjeAktivno) {
    porukeZaSnimanje.push(newMessage.outerHTML);
}

    const isNearTop = messageArea.scrollTop < 50;
    if (isNearTop) {
        messageArea.scrollTop = 0;
    }
});

// Kada nov gost dođe
socket.on('newGuest', function (nickname) {
    const guestId = `guest-${nickname}`;
    const guestList = document.getElementById('guestList');
    const newGuest = document.createElement('div');
    newGuest.classList.add('guest');
    newGuest.id = guestId;
    newGuest.textContent = nickname;

    if (!guestsData[guestId]) {
        guestsData[guestId] = { nickname, color: '' };
    }

    guestList.appendChild(newGuest);
});

// Ažuriranje liste gostiju bez resetovanja stilova
socket.on('updateGuestList', function (users) {
    const guestList = document.getElementById('guestList');
    const currentGuests = Array.from(guestList.children).map(guest => guest.textContent);

    // Ukloni goste koji više nisu u listi
    currentGuests.forEach(nickname => {
        if (!users.includes(nickname)) {
            delete guestsData[`guest-${nickname}`];
            const guestElement = Array.from(guestList.children).find(guest => guest.textContent === nickname);
            if (guestElement) {
                guestList.removeChild(guestElement);
            }
        }
    });
   // Reorder: "Radio Galaksija" na vrhu
    if (users.includes("Radio Galaksija")) {
        users = ["Radio Galaksija", ...users.filter(n => n !== "Radio Galaksija")];

        // Ulogovani korisnik na drugo mesto ako nije Galaksija
        if (myNickname !== "Radio Galaksija") {
            users = users.filter(n => n !== myNickname);
            users.splice(1, 0, myNickname);
        }
    } else {
        // Ako nema Galaksije, korisnik ide na prvo mesto
        users = users.filter(n => n !== myNickname);
        users.unshift(myNickname);
    }

    // Dodaj nove goste
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        if (!guestsData[guestId]) {
            const newGuest = document.createElement('div');
            newGuest.className = 'guest';
            newGuest.id = guestId;
            newGuest.textContent = nickname;

            // Dodaj boju ako je virtualni gost
            const vg = virtualGuests.find(v => v.nickname === nickname);
            if (vg) {
                newGuest.style.color = vg.color;
                guestsData[guestId] = { nickname, color: vg.color };
            } else {
                newGuest.style.color = '';
                guestsData[guestId] = { nickname, color: '' };
            }

            newGuest.setAttribute('data-guest-id', guestId);
            guestList.appendChild(newGuest);
        }
    });

    // Poređaj DOM elemente po redosledu iz `users`
    users.forEach(nickname => {
        const guestId = `guest-${nickname}`;
        const guestElement = document.getElementById(guestId);
        if (guestElement) {
            guestList.appendChild(guestElement);
        }
    });
});
// COLOR PICKER - OBICNE BOJE
document.getElementById('colorBtn').addEventListener('click', () => {
    document.getElementById('colorPicker').click();
});

document.getElementById('colorPicker').addEventListener('input', function() {
    currentColor = this.value;
    currentGradient = null; // reset gradijenta

    const myDiv = document.getElementById(`guest-${myNickname}`);
    if (!myDiv) return;

    // Ukloni gradijent sa teksta (user i admin)
    myDiv.classList.forEach(cls => {
        if (cls.startsWith('gradient-') || cls.startsWith('grad-admin-')) {
            myDiv.classList.remove(cls);
        }
    });
    myDiv.classList.remove('use-gradient', 'gradient-user');
    myDiv.style.background = '';
    myDiv.style.backgroundImage = '';
    myDiv.style.webkitBackgroundClip = '';
    myDiv.style.webkitTextFillColor = '';

    // Postavi novu boju teksta
    myDiv.style.color = currentColor;

    // **Obeleži korisnika da je sam birao boju**
    myDiv.dataset.userColor = currentColor;

    updateInputStyle();

    // Emit preko socket-a
    socket.emit('colorChange', { nickname: myNickname, color: currentColor });
});

// Slušanje svih boja pri povezivanju
socket.on('allColors', (colors) => {
    for (const nickname in colors) {
        const myDiv = document.getElementById(`guest-${nickname}`);
        if (!myDiv) continue;

        myDiv.style.background = '';
        myDiv.style.backgroundImage = '';
        myDiv.style.webkitBackgroundClip = '';
        myDiv.style.webkitTextFillColor = '';
        myDiv.style.color = colors[nickname];

        // **Održavamo podatak da je korisnik birao svoju boju**
        myDiv.dataset.userColor = colors[nickname];

        myDiv.classList.remove('use-gradient', 'gradient-user');
        myDiv.classList.forEach(cls => {
            if (cls.startsWith('gradient-') || cls.startsWith('grad-admin-')) {
                myDiv.classList.remove(cls);
            }
        });
    }
});

// Kada neko promeni boju
socket.on('colorChange', (data) => {
    const myDiv = document.getElementById(`guest-${data.nickname}`);
    if (!myDiv) return;

    myDiv.style.background = '';
    myDiv.style.backgroundImage = '';
    myDiv.style.webkitBackgroundClip = '';
    myDiv.style.webkitTextFillColor = '';
    myDiv.style.color = data.color;

    // **Označavamo da je korisnik birao boju**
    myDiv.dataset.userColor = data.color;

    myDiv.classList.remove('use-gradient', 'gradient-user');
    myDiv.classList.forEach(cls => {
        if (cls.startsWith('gradient-') || cls.startsWith('grad-admin-')) {
            myDiv.classList.remove(cls);
        }
    });
});
// ZA GRADIJENTE
document.getElementById('farbe').addEventListener('click', function () {
    const gradijentDiv = document.getElementById('gradijent');
    gradijentOpen = !gradijentOpen;
    gradijentDiv.style.display = gradijentOpen ? 'grid' : 'none';

    if (gradijentOpen) {
        setTimeout(() => {
            const boxes = document.querySelectorAll('.gradijent-box');
            boxes.forEach(box => {
                box.onclick = function () {
                    currentGradient = this.classList[1];
                    currentColor = ''; // Resetuj boju kada izabereš gradijent

                    const myDivId = `guest-${myNickname}`;
                    const myDiv = document.getElementById(myDivId);
                    if (myDiv) {
                        // Uklanjanje stare boje i gradijenata
                        myDiv.classList.forEach(cls => {
                            if (cls.startsWith('gradient-')) {
                                myDiv.classList.remove(cls);
                            }
                        });
                        myDiv.classList.remove('use-gradient', 'gradient-user');
                        myDiv.style.color = '';
                        myDiv.style.backgroundImage = '';

                        // Dodavanje novog gradijenta
                        myDiv.classList.add(currentGradient, 'use-gradient', 'gradient-user');
                        myDiv.style.backgroundImage = getComputedStyle(this).backgroundImage;

                        // **Dodato kao kod userColor**
                        myDiv.dataset.userGradient = currentGradient;
                    }

                    updateInputStyle();

                    socket.emit('gradientChange', { nickname: myNickname, gradient: currentGradient });
                };
            });
        }, 300);
    }
});

socket.on('gradientChange', function (data) {
    const myDivId = `guest-${data.nickname}`;
    const myDiv = document.getElementById(myDivId);
    if (myDiv) {
        myDiv.classList.forEach(cls => {
            if (cls.startsWith('gradient-')) myDiv.classList.remove(cls);
        });
        myDiv.classList.remove('use-gradient', 'gradient-user');
        myDiv.style.color = '';
        myDiv.style.backgroundImage = '';

        myDiv.classList.add(data.gradient, 'use-gradient', 'gradient-user');
        myDiv.style.backgroundImage = getComputedStyle(document.querySelector(`.${data.gradient}`)).backgroundImage;

        // **Dodato kao kod userColor**
        myDiv.dataset.userGradient = data.gradient;
    }
});
// Slušanje svih gradijenata pri povezivanju novih korisnika
socket.on('allGradients', (gradients) => {
    for (const nickname in gradients) {
        const div = document.getElementById(`guest-${nickname}`);
        if (div) {
            div.classList.add(gradients[nickname], 'use-gradient', 'gradient-user');
            div.style.backgroundImage = getComputedStyle(document.querySelector(`.${gradients[nickname]}`)).backgroundImage;

            // **Dodato kao kod userColor**
            div.dataset.userGradient = gradients[nickname];
        }
    }
});
// ZA ADMINA - DEFAULT COLOR
const applyBtn = document.getElementById('applyDefaultColor');
const adminPicker = document.getElementById('adminColorPicker');

// Klik na dugme otvara sakriveni picker
applyBtn.addEventListener('click', () => {
    adminPicker.click();
});

// Kada admin izabere boju
adminPicker.addEventListener('input', () => {
    const selectedColor = adminPicker.value;
    defaultColor = selectedColor;

    // Emituj boju svim klijentima
    socket.emit('updateDefaultColor', { color: defaultColor });

    // Primeni default boju sa 3s delay na sve goste
    setTimeout(() => {
        document.querySelectorAll('.guest').forEach(el => {
            const nickname = el.dataset.nickname || el.id.replace('guest-', '');
            const isVirtual = virtualGuests.some(v => v.nickname === nickname);
            if (isVirtual) return;
            if ('userColor' in el.dataset) return; // ne dira one koji su birali boju
            if ('userGradient' in el.dataset) return; // ne dira user gradijente

            // Ukloni samo admin gradijent
            el.classList.forEach(cls => {
                if (cls.startsWith('grad-admin-')) el.classList.remove(cls);
            });
            el.classList.remove('use-gradient', 'gradient-user');
            el.style.background = '';
            el.style.backgroundImage = '';
            el.style.webkitBackgroundClip = '';
            el.style.webkitTextFillColor = '';

            // Postavi admin default boju
            el.style.color = defaultColor;
            // Obeleži da je admin boja odabrana
            el.dataset.adminColor = defaultColor;

            // Ako je trenutni korisnik, update currentColor i reset currentGradient
            if (el.id === `guest-${myNickname}`) {
                currentColor = defaultColor;
                currentGradient = null;
                updateInputStyle();
            }
        });
    }, 3000);

    adminPicker.style.display = 'none';
});

// Socket event za update default boje od strane drugih admina
socket.on('updateDefaultColor', (data) => {
    defaultColor = data.color;

    setTimeout(() => {
        document.querySelectorAll('.guest').forEach(el => {
            const nickname = el.dataset.nickname || el.id.replace('guest-', '');
            const isVirtual = virtualGuests.some(v => v.nickname === nickname);
            if (isVirtual) return;
            if ('userColor' in el.dataset) return;
            if ('userGradient' in el.dataset) return;

            // Ukloni samo admin gradijent
            el.classList.forEach(cls => {
                if (cls.startsWith('grad-admin-')) el.classList.remove(cls);
            });
            el.classList.remove('use-gradient', 'gradient-user');
            el.style.background = '';
            el.style.backgroundImage = '';
            el.style.webkitBackgroundClip = '';
            el.style.webkitTextFillColor = '';

            // Postavi admin default boju
            el.style.color = defaultColor;
            // Obeleži da je admin boja odabrana
            el.dataset.adminColor = defaultColor;

            if (el.id === `guest-${myNickname}`) {
                currentColor = defaultColor;
                currentGradient = null;
                updateInputStyle();
            }
        });
    }, 3000);
});
// ADMIN GRADIJENT
const gradBtn = document.getElementById('admingradijent');
const adminGradTable = document.getElementById('xgradixadmin');
let adminGradOpen = false;

// Klik na dugme otvara/zatvara tablu
gradBtn.addEventListener('click', () => {
    adminGradOpen = !adminGradOpen;
    adminGradTable.style.display = adminGradOpen ? 'grid' : 'none';

    if (adminGradOpen) {
        setTimeout(() => {
            const gradBoxes = document.querySelectorAll('.xgradijentx-xbox');
            gradBoxes.forEach(box => {
                box.onclick = function () {
                    const selectedGrad = this.classList[1]; // npr. "grad-admin-3"

                    // Emitujemo svim klijentima i postavljamo globalni admin gradijent
                    socket.emit('updateDefaultGradient', { gradient: selectedGrad });
                    window.defaultAdminGradient = selectedGrad;

                    const clickedBox = this; // referenca na kliknuti box

                    // Primeni posle 3s delay
                    setTimeout(() => {
                        document.querySelectorAll('.guest').forEach(el => {
                            const nickname = el.dataset.nickname || el.id.replace('guest-', '');
                            const isVirtual = virtualGuests.some(v => v.nickname === nickname);
                            if (isVirtual) return;
                            if ('userColor' in el.dataset || 'userGradient' in el.dataset) return;

                            // Ukloni stare admin gradijente
                            el.classList.forEach(cls => {
                                if (cls.startsWith('grad-admin-')) el.classList.remove(cls);
                            });
                            el.classList.remove('use-gradient', 'gradient-user');

                            // Dodaj novi admin gradijent
                            el.classList.add(selectedGrad, 'use-gradient');
                            el.style.backgroundImage = getComputedStyle(clickedBox).backgroundImage;

                            // Ako postoji adminColor, ostavi style.color netaknut
                            if (!('adminColor' in el.dataset)) {
                                el.style.color = '';
                            }

                            // Ako je trenutni korisnik, update currentGradient i reset boje
                            if (el.id === `guest-${myNickname}`) {
                                currentGradient = selectedGrad;
                                if (!('adminColor' in el.dataset)) currentColor = '';
                                updateInputStyle();
                            }
                        });
                    }, 3000);

                    adminGradTable.style.display = 'none';
                    adminGradOpen = false;
                };
            });
        }, 300);
    }
});

// Socket event za update default gradijenta od strane drugih admina
socket.on('updateDefaultGradient', (data) => {
    const newGrad = data.gradient;
    window.defaultAdminGradient = newGrad;

    setTimeout(() => {
        document.querySelectorAll('.guest').forEach(el => {
            const nickname = el.dataset.nickname || el.id.replace('guest-', '');
            const isVirtual = virtualGuests.some(v => v.nickname === nickname);
            if (isVirtual) return;
            if ('userColor' in el.dataset || 'userGradient' in el.dataset) return;

            // Ukloni stare admin gradijente
            el.classList.forEach(cls => {
                if (cls.startsWith('grad-admin-')) el.classList.remove(cls);
            });
            el.classList.remove('use-gradient', 'gradient-user');

            // Dodaj novi admin gradijent
            el.classList.add(newGrad, 'use-gradient');
            const gradElem = document.querySelector(`.${newGrad}`);
            if (gradElem) el.style.backgroundImage = getComputedStyle(gradElem).backgroundImage;

            // Ako postoji adminColor, ostavi style.color netaknut
            if (!('adminColor' in el.dataset)) {
                el.style.color = '';
            }

            // Ako je trenutni korisnik, update currentGradient i reset boje
            if (el.id === `guest-${myNickname}`) {
                currentGradient = newGrad;
                if (!('adminColor' in el.dataset)) currentColor = '';
                updateInputStyle();
            }
        });
    }, 3000);
});
