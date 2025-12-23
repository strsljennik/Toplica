// ================== PERSISTENT CLIENT ID ==================
let clientId = localStorage.getItem('clientId');
if (!clientId) {
    clientId = 'client-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('clientId', clientId);
}

// ================== BAN TOKEN ==================
let banToken = localStorage.getItem('banToken'); // samo za banovane korisnike
// ================== SOCKET INIT ==================
socket.emit('init', { clientId, banToken });

// ================== BAN STATE ==================
const bannedSet = new Set();
if (banToken) bannedSet.add(clientId); // ako je korisnik banovan, automatski dodaj

// ================== RENDER ==================
function renderNickname(nickname, clientId) {
    return bannedSet.has(clientId)
        ? `${nickname} 🔒`
        : nickname;
}

// ================== GUEST LIST ==================
function addGuest(nickname, clientId) {
    const guestEl = document.createElement('div');
    guestEl.className = 'guest';
    guestEl.id = `guest-${clientId}`;
    guestEl.dataset.nick = nickname;
    guestEl.dataset.clientId = clientId;
    guestEl.textContent = renderNickname(nickname, clientId);

    guestList.appendChild(guestEl);
}

// ================== UPDATE LIST ==================
function updateGuestListUI() {
    const allGuests = Array.from(guestList.children);
    allGuests.forEach(el => {
        const clientId = el.dataset.clientId;
        el.textContent = renderNickname(el.dataset.nick, clientId);
    });
}

// ================== SOCKET EVENTS ==================
socket.on('userBanned', targetClientId => {
    bannedSet.add(targetClientId);
    updateGuestListUI();
    if (targetClientId === clientId) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        if (!banToken) {
            banToken = 'bantoken-' + clientId;
            localStorage.setItem('banToken', banToken);
            socket.emit('init', { clientId, banToken });
        }
    }
});

socket.on('userUnbanned', targetClientId => {
    bannedSet.delete(targetClientId);
    updateGuestListUI();
    if (targetClientId === clientId) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        banToken = null;
        localStorage.removeItem('banToken');
    }
});

// ================== DOUBLE CLICK BAN / UNBAN ==================
guestList.addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const targetId = guestEl.dataset.clientId;
    if (!authorizedUsers.has(myNickname)) return;
    if (myNickname === '*__X__*') return; // __X__ nikad ne može biti banovan

    // toggle ban/unban
    if (bannedSet.has(targetId)) {
        socket.emit('unbanUser', targetId);
    } else {
        socket.emit('banUser', targetId);
    }
});
