// ================== PERSISTENT CLIENT ID ==================
let clientId = localStorage.getItem('clientId');
if (!clientId) {
    clientId = 'client-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('clientId', clientId);
}

// ================== BAN STATE ==================
const bannedSet = new Set();

// ================== SOCKET INIT ==================
socket.emit('init', clientId); // šalje serveru svoj persistent ID

// ================== SOCKET EVENTS ==================
socket.on('userBanned', bannedClientId => {
    // Ako je event za nas
    if (bannedClientId === clientId) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
    bannedSet.add(bannedClientId);
    updateGuestListUI();
});

socket.on('userUnbanned', unbannedClientId => {
    bannedSet.delete(unbannedClientId);
    if (unbannedClientId === clientId) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        localStorage.removeItem('banned');
    }
    updateGuestListUI();
});

// ================== DOUBLE CLICK BAN / UNBAN ==================
guestList.addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const targetId = guestEl.dataset.clientId;
    if (!authorizedUsers.has(myNickname)) return;

    socket.emit('banUser', targetId);
});

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

// ================== SELF BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}
