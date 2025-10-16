const authorizedUsers = new Set(['Radio Galaksija','R-Galaksija', 'ZI ZU', '*___F117___*', '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊','Najlepsa Ciganka', 'Dia']);

const functionModal = document.getElementById('functionModal');
let isDraggingFunc = false;
let offsetXFunc = 0;
let offsetYFunc = 0;

document.getElementById('openModal').addEventListener('click', function () {
    if (authorizedUsers.has(currentUser)) {
        functionModal.style.display = "block";
    } else {
        alert('Nemate dozvolu da otvorite ovaj panel.');
    }
});

document.getElementById('closeModal').addEventListener('click', function () {
    functionModal.style.display = "none";
});

// Drag start
functionModal.addEventListener('mousedown', function (e) {
    isDraggingFunc = true;
    offsetXFunc = e.clientX - functionModal.offsetLeft;
    offsetYFunc = e.clientY - functionModal.offsetTop;
});

// Drag move
document.addEventListener('mousemove', function (e) {
    if (isDraggingFunc) {
        functionModal.style.left = (e.clientX - offsetXFunc) + 'px';
        functionModal.style.top = (e.clientY - offsetYFunc) + 'px';
    }
});

// Drag end
document.addEventListener('mouseup', function () {
    isDraggingFunc = false;
});

// Brisanje sadržaja chata
document.getElementById('clearChat').addEventListener('click', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata

    // Emituj događaj serveru za brisanje chata
    socket.emit('clear-chat'); 
});
socket.on('chat-cleared', function() {
    const chatWindow = document.getElementById('messageArea');
    chatWindow.innerHTML = ""; // Briše sve unutar chata

    const newMessage = document.createElement('div');
    newMessage.classList.add('message');

    // Stil za gradijent + bold, italic, underline
    newMessage.style.fontWeight = 'bold';
    newMessage.style.fontStyle = 'italic';
    newMessage.style.textDecoration = 'underline';
    newMessage.style.backgroundClip = 'text';
    newMessage.style.webkitBackgroundClip = 'text';
    newMessage.style.webkitTextFillColor = 'transparent';
    newMessage.style.backgroundImage = 'linear-gradient(90deg, white,  yellow, red, green, purple)';

    // Sadržaj poruke
    newMessage.innerHTML = `<strong>Radio Galaksija:</strong> Chat je obrisan <span style="font-size: 0.8em; color: gray;">(${new Date().toLocaleTimeString()})</span>`;

    chatWindow.prepend(newMessage);
});
// ZENO PLAYER NA DUGME
document.addEventListener("DOMContentLoaded", function() {
    var audio = document.getElementById('radioStream');
    var button = document.getElementById('sound');
    var isPlaying = false;

    // Ako je korisnik već kliknuo Play ranije, automatski pokreni stream
    if (localStorage.getItem('radioPlayed') === 'true') {
        playStream();
    }

    button.addEventListener('click', function() {
        button.blur();
        if (isPlaying) {
            audio.pause();
            button.textContent = "Play";
            isPlaying = false;
            localStorage.setItem('radioPlayed', 'false'); // pamti da je pauziran
        } else {
            playStream();
        }
    });

    function playStream() {
        audio.src = "https://stream.zeno.fm/krdfduyswxhtv";  
        audio.load();  
        audio.play().then(() => {
            button.textContent = "Stop";  // dugme uvek pokazuje Stop kada se emituje
            isPlaying = true;
            localStorage.setItem('radioPlayed', 'true'); // pamti da je stream pušten
        }).catch(error => console.error("Greška pri puštanju zvuka:", error));
    }

    // Automatsko ponovno pokretanje pri gubitku konekcije
    audio.addEventListener('error', function() {
        setTimeout(playStream, 3000);
    });
});
//  REGISTRACIJA I LOGIN TABLA
document.getElementById('NIK').addEventListener('click', function() {
    var container = document.getElementById('authContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });
//  BANIRANJE SA IP ADRESOM I MODAL LISTOM
let lozinkaProverena = false;

document.getElementById('govna').addEventListener('click', function () {
    const uuidModal = document.getElementById('uuidModal');

    if (!lozinkaProverena) {
        if (document.getElementById('banprompt')) return;

        const overlay = document.createElement('div');
        overlay.id = 'banprompt';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'flex-start';
        overlay.style.alignItems = 'flex-start';

        const promptBox = document.createElement('div');
        promptBox.style.position = 'absolute';
        promptBox.style.top = '50px';
        promptBox.style.left = '100px';
        promptBox.style.padding = '20px';
        promptBox.style.border = '2px solid #fff';
        promptBox.style.borderRadius = '10px';
        promptBox.style.boxShadow = '0 0 10px #0ff, 0 0 20px #0ff';
        promptBox.style.backgroundColor = '#000';
        promptBox.style.display = 'flex';
        promptBox.style.flexDirection = 'column';
        promptBox.style.alignItems = 'flex-start';

        const input = document.createElement('input');
        input.type = 'password';
        input.placeholder = 'Unesite lozinku';
        input.style.padding = '5px';
        input.style.border = '1px solid #0ff';
        input.style.backgroundColor = '#111';
        input.style.color = '#0ff';
        input.style.outline = 'none';
        input.style.marginBottom = '10px';

        const greska = document.createElement('div');
        greska.id = 'greska-msg';
        greska.style.color = 'red';
        greska.style.fontSize = '14px';

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (input.value === 'babaroga') {
                    lozinkaProverena = true;
                    document.body.removeChild(overlay);
                    uuidModal.style.display = (uuidModal.style.display === "block") ? "none" : "block";
                } else {
                    greska.textContent = 'Netačna lozinka!';
                }
            }
        });

        promptBox.appendChild(input);
        promptBox.appendChild(greska);
        overlay.appendChild(promptBox);
        document.body.appendChild(overlay);

        // Klik bilo gde van promptBox-a zatvara overlay bez unosa lozinke
overlay.addEventListener('click', function (e) {
    if (!promptBox.contains(e.target)) {
        document.body.removeChild(overlay);
    }
});
      input.focus();
    } else {
        uuidModal.style.display = (uuidModal.style.display === "block") ? "none" : "block";
    }
});

  uuidModal.addEventListener('mousedown', function (e) {
        isDragging = true;
        offsetX = e.clientX - uuidModal.offsetLeft;
        offsetY = e.clientY - uuidModal.offsetTop;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
           uuidModal.style.left = e.clientX - offsetX + 'px';
           uuidModal.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

const uuidList = document.getElementById('uuidList');

socket.on('new-log', (message) => {
    const ipMatch = message.match(/(.+?) se povezao\. IP adresa korisnika: ([\d\.]+)/);
    const renameMatch = message.match(/(.+?) je sada (.+?)\./);

    let listItem = document.createElement('li');

    if (ipMatch) {
        let nickname = ipMatch[1];
        let ipAddress = ipMatch[2];

        listItem.textContent = `Korisnik: ${nickname} | IP: ${ipAddress}`;
        listItem.setAttribute('data-ip', ipAddress);

        let infoInput = document.createElement('input');
        infoInput.type = 'text';
        infoInput.placeholder = 'Dodaj informaciju...';
        infoInput.style.marginLeft = '10px';

        infoInput.addEventListener('blur', function() {
            socket.emit('saveUserNote', { ipAddress, note: infoInput.value });
        });

        listItem.appendChild(infoInput);
        uuidList.appendChild(listItem);

    } else if (renameMatch) {
        let from = renameMatch[1];
        let to = renameMatch[2];
        listItem.textContent = `Preimenovan: ${from} → ${to}`;
        uuidList.appendChild(listItem);
    }
});

// SAMO OVAJ DEO ZA DODAVANJE INFO U POSTOJEĆE POLJE
socket.on('logMessage', (message) => {
    const match = message.match(/IP adresa: ([\d\.]+) \(Info: (.*)\)/);
    if (!match) return;

    const ipAddress = match[1];
    const infoText = match[2];

    const existingItem = [...uuidList.children].find(li => li.getAttribute('data-ip') === ipAddress);
    if (!existingItem) return;

    const input = existingItem.querySelector('input');
    if (input && infoText && infoText !== "Nema dodatnog info") {
        input.value = infoText;
    }
});

// Selektovanje liste
let selectedItem = null;

// Dodavanje event listener-a za klik na stavku u listi
document.getElementById('uuidList').addEventListener('click', function(event) {
    // Ako je kliknuto na <li> stavku, postavi je kao selektovanu
    if (event.target.tagName === 'LI') {
        // Ako je već selektovana ista stavka, poništi selektovanje
        if (selectedItem === event.target) {
            selectedItem.classList.remove('selected');
            selectedItem = null;
        } else {
            // Poništi selektovanje prethodne stavke, ako postoji
            if (selectedItem) {
                selectedItem.classList.remove('selected');
            }
            // Selektuj novu stavku
            selectedItem = event.target;
            selectedItem.classList.add('selected');
        }
    }
});

// Akcija za brisanje
document.getElementById('delete').addEventListener('click', function() {
    if (selectedItem) {
        // Ukloni selektovanu stavku sa liste
        selectedItem.remove();

      }
});

document.getElementById('blokip').addEventListener('click', function() {
    if (selectedItem) {
        // Ekstrakcija IP adrese pomoću regularnog izraza
        let ipMatch = selectedItem.textContent.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
        
        if (ipMatch) {
            let ipAddress = ipMatch[0]; // Prava IP adresa iz teksta
            
            // Emitovanje događaja za banovanje
            socket.emit('banUser', ipAddress);
            
            console.log(`Banovan korisnik sa IP adresom: ${ipAddress}`);
        } else {
            alert("Nije pronađena validna IP adresa!");
        }
    } else {
        alert("Niste izabrali korisnika za banovanje!");
    }
});
