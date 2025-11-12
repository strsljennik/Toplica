(function insertBanCss() {
    if (!document.getElementById('ban-css-marker')) {
        const style = document.createElement('style');
        style.id = 'ban-css-marker';
        style.textContent = `
            .guest.banned {
                position: relative;
                opacity: 0.6;
            }
            .guest.banned::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                height: 3px;
                background-color: red;
                transform: translateY(-50%);
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    }
})();

// === GLOBALNA LISTA BANOVANIH KORISNIKA ===
const bannedUsers = new Set();

// === BAN / UNBAN ===
socket.on('userBanned', nickname => {
    bannedUsers.add(nickname);
    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.classList.add('banned');
});

socket.on('userUnbanned', nickname => {
    bannedUsers.delete(nickname);
    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.classList.remove('banned');

    if (nickname === myNickname) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        localStorage.removeItem('banned');
    }
});

socket.on('youAreBanned', () => {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
    localStorage.setItem('banned', '1');
});

// === DVOKLIK ZA BAN/UNBAN (samo admin/mod) ===
guestList.addEventListener('dblclick', e => {
    const g = e.target.closest('.guest');
    if (!g) return;
    const nickname = g.textContent.trim();
    if (!authorizedUsers.has(myNickname)) return;
    socket.emit('banUser', nickname);
});

// === LISTA GOSTIJU ===
function addGuestIfNotExist(nickname) {
    if (!document.getElementById(`guest-${nickname}`)) {
        const gEl = document.createElement('div');
        gEl.id = `guest-${nickname}`;
        gEl.className = 'guest';
        gEl.textContent = nickname;
        guestList.appendChild(gEl);

        // dodaj .banned ako je korisnik banovan
        if (bannedUsers.has(nickname) || (localStorage.getItem('banned') && nickname === myNickname)) {
            gEl.classList.add('banned');
            if (nickname === myNickname) {
                chatInput.disabled = true;
                messageArea.style.display = 'none';
            }
        }
    }
}

socket.on('updateGuestList', users => {
    guestList.innerHTML = '';
    users.forEach(addGuestIfNotExist);
});

// === RESTORE POSLE RELOADA ===
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}

// === PROVERA PRI RECONNECTU / reload-u ===
if (localStorage.getItem('ban1')) {
    console.log('[CLIENT] Emitujem userStillBanned jer je ban1 setovan');
    socket.emit('userStillBanned');
}

// === Ponovni emit pri reconnect-u socket-a ===
socket.on('connect', () => {
    if (localStorage.getItem('ban1')) {
        console.log('[CLIENT] Socket reconnected, ponovo emitujem userStillBanned');
        socket.emit('userStillBanned');
    }
});
