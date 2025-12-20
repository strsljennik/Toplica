// ================== BAN STATE ==================
const bannedSet = new Set();

// Dohvati token iz cookie-ja
function getToken() {
    const match = document.cookie.match(/(?:^|;\s*)token\s*=\s*([^;]*)/);
    return match ? match[1] : null;
}

const myToken = getToken();

// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    bannedSet.add(nickname);

    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.textContent = renderNickname(nickname);

    if (nicknameTokenMap[nickname] === myToken) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
});

socket.on('userUnbanned', nickname => {
    bannedSet.delete(nickname);

    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.textContent = renderNickname(nickname);

    if (nicknameTokenMap[nickname] === myToken) {
        chatInput.disabled = false;
        messageArea.style.display = 'block';
        localStorage.removeItem('banned');
    }
});

// ================== DOUBLE CLICK BAN / UNBAN ==================
guestList.addEventListener('dblclick', e => {
    const guestEl = e.target.closest('.guest');
    if (!guestEl) return;

    const nickname = guestEl.dataset.nick;
    if (!authorizedUsers.has(myNickname)) return;

    if (myNickname === '*__X__*' || !authorizedUsers.has(nickname)) {
        const targetToken = nicknameTokenMap[nickname];
        socket.emit('banUser', targetToken);
    }
});

// ================== SELF BAN STATE ==================
if (localStorage.getItem('banned')) {
    chatInput.disabled = true;
    messageArea.style.display = 'none';
}

// ================== RENDER ==================
function renderNickname(nickname) {
    return bannedSet.has(nickname)
        ? `${nickname} 🔒`
        : nickname;
}

// ================== NICKNAME → TOKEN MAP ==================
const nicknameTokenMap = {}; // čuva token za svakog korisnika

// ================== GUEST LIST ==================
function addGuest(nickname, token) {
    const guestEl = document.createElement('div');
    guestEl.className = 'guest';
    guestEl.id = `guest-${nickname}`;
    guestEl.dataset.nick = nickname;
    nicknameTokenMap[nickname] = token;

    guestEl.textContent = renderNickname(nickname);
    guestList.appendChild(guestEl);
}

// ================== UPDATE LIST ==================
socket.on('updateGuestList', users => {
    guestList.innerHTML = '';
    users.forEach(({ nickname, token }) => addGuest(nickname, token));
});

// ================== INITIAL BAN CHECK ==================
socket.emit('requestBanStatus', myToken);
