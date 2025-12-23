// ================== PERSISTENT CLIENT ID ==================
let clientId = localStorage.getItem('clientId');
if (!clientId) {
    clientId = 'client-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('clientId', clientId);
}

// ================== BAN TOKEN ==================
let banToken = localStorage.getItem('banToken');

// ================== SOCKET INIT ==================
socket.emit('init', { clientId, banToken });
// ================== BAN STATE ==================
const bannedSet = new Set();
if (banToken) bannedSet.add(clientId);

// ================== RENDER NICKNAMES ==================
function renderNickname(nickname, clientId) {
    const guestElement = document.getElementById(`guest-${nickname}`);
    if (!guestElement) return;
    guestElement.textContent = bannedSet.has(clientId) ? `${nickname} 🔒` : nickname;
}

// ================== SOCKET EVENTS ==================
socket.on('userBanned', targetClientId => {
    bannedSet.add(targetClientId);

    // Update guest list vizuelno
    Object.values(guestsData).forEach(g => renderNickname(g.nickname, targetClientId));

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

    // Update guest list vizuelno
    Object.values(guestsData).forEach(g => renderNickname(g.nickname, targetClientId));

    if (targetClientId === clientId) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        banToken = null;
        localStorage.removeItem('banToken');
    }
});

// ================== DOUBLE CLICK BAN/UNBAN ==================
document.getElementById('guestList').addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const nickname = guestEl.textContent.replace(' 🔒', '');
    const targetClientId = Object.entries(guestsData)
        .find(([id, g]) => g.nickname === nickname)?.[0];

    if (!targetClientId) return;

    if (!authorizedUsers.has(myNickname)) return;
    if (nickname === '*__X__*') return;

    // Toggle ban/unban
    if (bannedSet.has(targetClientId)) {
        socket.emit('unbanUser', targetClientId);
    } else {
        socket.emit('banUser', targetClientId);
    }
});
