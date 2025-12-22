const hiddenImageUsers = new Set(['ZI ZU', '*___F117___*', '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','Najlepsa Ciganka','Dia💎', 'Dia']);
let myNickname = ''; // biće postavljen od servera

socket.off('yourNickname');
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
  { nickname: 'Jasmina', color: 'hotpink' },
  { nickname: 'Elena ukrajinka', color: 'orchid' },
  { nickname: 'Miki', color: 'lightgreen' },
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

function resetInputVisuals(input) {
    input.style.backgroundImage = 'none';
    input.style.background = 'none';
    input.style.backgroundClip = 'initial';
    input.style.webkitBackgroundClip = 'initial';
    input.style.webkitTextFillColor = 'initial';
    input.style.color = 'initial';
}
function updateInputStyle() {
    const inputField = document.getElementById('chatInput');

    resetInputVisuals(inputField);

    inputField.style.fontWeight = isBold ? 'bold' : 'normal';
    inputField.style.fontStyle = isItalic ? 'italic' : 'normal';
    inputField.style.textDecoration =
        (isUnderline ? 'underline ' : '') + (isOverline ? 'overline' : '');

    // GLITTER
    if (currentGlitter) {
        inputField.style.background = `url('/glit/${currentGlitter}')`;
        inputField.style.backgroundSize = 'cover';
        inputField.style.backgroundClip = 'text';
        inputField.style.webkitBackgroundClip = 'text';
        inputField.style.webkitTextFillColor = 'transparent';
        inputField.style.color = 'transparent';
        return;
    }

    // GRADIENT
    if (currentGradient) {
        inputField.style.backgroundImage =
            getComputedStyle(document.querySelector(`.${currentGradient}`)).backgroundImage;
        inputField.style.backgroundClip = 'text';
        inputField.style.webkitBackgroundClip = 'text';
        inputField.style.webkitTextFillColor = 'transparent';
        inputField.style.color = 'transparent';
        return;
    }

    // COLOR
    inputField.style.color = currentColor || '#fff';
}

let lastMessages = {};

function applyAnimationToMessageName(strongElement, nickname) {
    if (!strongElement) return;
    if (!animationAuthorizedUsers.has(nickname)) return;

    const animData = allUserAnimations[nickname];
    if (!animData || !animData.animation) return;

    const animationName = animData.animation;
    const speed = animData.speed || 2;

    // Uzmemo tekst imena (bez : )
    const originalName = strongElement.textContent.replace(':', '').trim();

    // Očistimo ime
    strongElement.innerHTML = '';

    const problematicChars = [
        ' ', '*', '(', ')', '-', '_', '[', ']', '{', '}', '^', '$', '#', '@',
        '!', '+', '=', '~', '`', '|', '\\', '/', '<', '>', ',', '.', '?', ':', ';', '"', "'"
    ];

    for (let i = 0; i < originalName.length; i++) {
        const char = originalName[i];

        if (problematicChars.includes(char)) {
            strongElement.appendChild(document.createTextNode(char));
            continue;
        }

        const span = document.createElement('span');
        span.textContent = char;

        // postojeće klase — iste kao u glavnom animacija fajlu
        if (animationName === 'rotateLetters') span.classList.add('rotate-letter');
        else if (animationName === 'glowBlink') span.classList.add('glow-letter');
        else if (animationName === 'fadeInOut') span.classList.add('fade-letter');
        else if (animationName === 'bounce') span.classList.add('bounce-letter');
        else if (animationName === 'superCombo') span.classList.add('superCombo-letter');
         else if (animationName === 'guestGradientGlow') span.classList.add('guest-gradient-anim');

        span.style.animationDuration = `${speed}s`;
        span.style.animationIterationCount = 'infinite';
        span.style.animationDelay = `${i * 0.1}s`;

        strongElement.appendChild(span);
    }

    // vratimo ":" iza animiranog imena
    strongElement.innerHTML += ': ';
}
function canSeeHiddenImage(userName) {
  return hiddenImageUsers.has(userName);
}

socket.on('chatMessage', function (data) {
    if (!myNickname) return;

    const myName = currentUser || myNickname;

    let raw = data.text.trim();
    let text = replaceTextEmoji(raw).replace(/#n/g, myName);

const tempDiv = document.createElement('div');
tempDiv.innerHTML = text;

tempDiv.querySelectorAll('img').forEach(img => {
    if (img.src.endsWith('lm.avif') && !canSeeHiddenImage(myName)) {
        img.remove();
    }
});

text = tempDiv.innerHTML;


    if (lastMessages[data.nickname] === text) return;
    lastMessages[data.nickname] = text;

    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // FONT
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.textDecoration =
        (data.underline ? 'underline ' : '') +
        (data.overline ? 'overline' : '');

    // ===== RESET =====
    newMessage.style.background = 'none';
    newMessage.style.backgroundImage = 'none';
    newMessage.style.backgroundClip = 'initial';
    newMessage.style.webkitBackgroundClip = 'initial';
    newMessage.style.webkitTextFillColor = 'initial';
    newMessage.style.color = 'initial';

    // ===== GLITTER =====
    if (data.glitter) {
        newMessage.style.background = `url('/glit/${data.glitter}')`;
        newMessage.style.backgroundSize = 'cover';
        newMessage.style.backgroundClip = 'text';
        newMessage.style.webkitBackgroundClip = 'text';
        newMessage.style.webkitTextFillColor = 'transparent';
        newMessage.style.color = 'transparent';
    }

    // ===== GRADIENT =====
    else if (data.gradient || window.defaultAdminGradient) {
        const gradClass = data.gradient || window.defaultAdminGradient;
        const gradEl = document.querySelector(`.${gradClass}`);
        if (gradEl) {
            newMessage.style.backgroundImage = getComputedStyle(gradEl).backgroundImage;
            newMessage.style.backgroundClip = 'text';
            newMessage.style.webkitBackgroundClip = 'text';
            newMessage.style.webkitTextFillColor = 'transparent';
            newMessage.style.color = 'transparent';
        }
    }

    // ===== COLOR =====
    else if (data.color) {
        newMessage.style.color = data.color;
    }

    // CONTENT
    newMessage.innerHTML = `
        <strong>${data.nickname}:</strong>
        ${text.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')}
        <span style="font-size:0.8em;color:gray;">(${data.time})</span>
    `;

    // NAME ANIMATION
    const strongName = newMessage.querySelector('strong');
    const userAnim = allUserAnimations[data.nickname];
    if (userAnim && userAnim.animation) {
        strongName.style.animationName = userAnim.animation;
        strongName.style.animationDuration = `${userAnim.speed || 1}s`;
        strongName.style.animationIterationCount = 'infinite';
        strongName.style.display = 'inline-block';

        if (data.glitter) {
            strongName.style.background = `url('/glit/${data.glitter}')`;
            strongName.style.backgroundSize = 'cover';
        } else if (data.gradient || window.defaultAdminGradient) {
            const gradClass = data.gradient || window.defaultAdminGradient;
            const gradEl = document.querySelector(`.${gradClass}`);
            if (gradEl) {
                strongName.style.backgroundImage = getComputedStyle(gradEl).backgroundImage;
            }
        }

        strongName.style.backgroundClip = 'text';
        strongName.style.webkitBackgroundClip = 'text';
        strongName.style.webkitTextFillColor = 'transparent';
        strongName.style.color = 'transparent';
    }

    // AVATAR
    if (authorizedUsers.has(data.nickname) && data.avatar) {
        const img = document.createElement('img');
        img.src = data.avatar;
        img.className = 'inline-avatar';
        img.style.marginLeft = '5px';
        img.style.verticalAlign = 'middle';
        newMessage.appendChild(img);
    }

    messageArea.prepend(newMessage);

    while (messageArea.children.length > 100) {
        messageArea.removeChild(messageArea.lastChild);
    }

    if (window.snimanjeAktivno) {
        porukeZaSnimanje.push(newMessage.outerHTML);
    }

    if (messageArea.scrollTop < 50) {
        messageArea.scrollTop = 0;
    }
});

socket.on('private_message', function (data) {
    if (!myNickname) return;

    const myName = currentUser || myNickname;

    let raw = data.message.trim();
    let text = replaceTextEmoji(raw).replace(/#n/g, myName);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;

    tempDiv.querySelectorAll('img').forEach(img => {
        if (img.src.endsWith('lm.avif') && !canSeeHiddenImage(myName)) {
            img.remove();
        }
    });

    text = tempDiv.innerHTML;

    if (lastMessages[data.from] === text) return;
    lastMessages[data.from] = text;

    const messageArea = document.getElementById('messageArea');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // FONT
    newMessage.style.fontWeight = data.bold ? 'bold' : 'normal';
    newMessage.style.fontStyle = data.italic ? 'italic' : 'normal';
    newMessage.style.textDecoration =
        (data.underline ? 'underline ' : '') +
        (data.overline ? 'overline' : '');

    // ===== RESET =====
    newMessage.style.background = 'none';
    newMessage.style.backgroundImage = 'none';
    newMessage.style.backgroundClip = 'initial';
    newMessage.style.webkitBackgroundClip = 'initial';
    newMessage.style.webkitTextFillColor = 'initial';
    newMessage.style.color = 'initial';

    // ===== GLITTER =====
    if (data.glitter) {
        newMessage.style.background = `url('/glit/${data.glitter}')`;
        newMessage.style.backgroundSize = 'cover';
        newMessage.style.backgroundClip = 'text';
        newMessage.style.webkitBackgroundClip = 'text';
        newMessage.style.webkitTextFillColor = 'transparent';
        newMessage.style.color = 'transparent';
    }

    // ===== GRADIENT =====
    else if (data.gradient || window.defaultAdminGradient) {
        const gradClass = data.gradient || window.defaultAdminGradient;
        const gradEl = document.querySelector(`.${gradClass}`);
        if (gradEl) {
            newMessage.style.backgroundImage = getComputedStyle(gradEl).backgroundImage;
            newMessage.style.backgroundClip = 'text';
            newMessage.style.webkitBackgroundClip = 'text';
            newMessage.style.webkitTextFillColor = 'transparent';
            newMessage.style.color = 'transparent';
        }
    }

    // ===== COLOR =====
    else if (data.color) {
        newMessage.style.color = data.color;
    }

    // CONTENT
    newMessage.innerHTML = `
        <strong>${data.from}:</strong>
        ${text.replace(/\n/g, '<br>').replace(/ {2}/g, '&nbsp;&nbsp;')}
        <span style="font-size:0.8em;color:gray;">(${data.time})</span>
    `;

    // NAME ANIMATION
    const strongName = newMessage.querySelector('strong');
    const userAnim = allUserAnimations[data.from];
    if (userAnim && userAnim.animation) {
        strongName.style.animationName = userAnim.animation;
        strongName.style.animationDuration = `${userAnim.speed || 1}s`;
        strongName.style.animationIterationCount = 'infinite';
        strongName.style.display = 'inline-block';

        if (data.glitter) {
            strongName.style.background = `url('/glit/${data.glitter}')`;
            strongName.style.backgroundSize = 'cover';
        } else if (data.gradient || window.defaultAdminGradient) {
            const gradClass = data.gradient || window.defaultAdminGradient;
            const gradEl = document.querySelector(`.${gradClass}`);
            if (gradEl) {
                strongName.style.backgroundImage = getComputedStyle(gradEl).backgroundImage;
            }
        }

        strongName.style.backgroundClip = 'text';
        strongName.style.webkitBackgroundClip = 'text';
        strongName.style.webkitTextFillColor = 'transparent';
        strongName.style.color = 'transparent';
    }

    // AVATAR
    if (authorizedUsers.has(data.from) && data.avatar) {
        const img = document.createElement('img');
        img.src = data.avatar;
        img.className = 'inline-avatar';
        img.style.marginLeft = '5px';
        img.style.verticalAlign = 'middle';
        newMessage.appendChild(img);
    }

    messageArea.prepend(newMessage);

    while (messageArea.children.length > 100) {
        messageArea.removeChild(messageArea.lastChild);
    }

    if (window.snimanjeAktivno) {
        porukeZaSnimanje.push(newMessage.outerHTML);
    }

    if (messageArea.scrollTop < 50) {
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
    currentGlitter = null; 
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
                     currentGlitter = null;  
                     currentColor = '';      
                     currentGradient = this.classList[1];

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
        }, 3000);
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
