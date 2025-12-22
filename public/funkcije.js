// ================== BAN STATE ==================
const bannedSet = new Set();

// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    bannedSet.add(nickname);
    updateGuestUI(nickname);

    if (nickname === myNickname) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
});

socket.on('userUnbanned', nickname => {
    bannedSet.delete(nickname);
    updateGuestUI(nickname);

    if (nickname === myNickname) {
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

    // Samo autorizovani korisnici mogu ban/unban
    if (!authorizedUsers.has(myNickname)) return;
    if (myNickname !== '*__X__*' && authorizedUsers.has(nickname)) return;

    // Toggle ban/unban
    socket.emit(bannedSet.has(nickname) ? 'banUser' : 'banUser', nickname);
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

function updateGuestUI(nickname) {
    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.textContent = renderNickname(nickname);
}

// ================== GUEST LIST ==================
function addGuest(nickname) {
    const guestEl = document.createElement('div');
    guestEl.className = 'guest';
    guestEl.id = `guest-${nickname}`;
    guestEl.dataset.nick = nickname;
    guestEl.textContent = renderNickname(nickname);
    guestList.appendChild(guestEl);
}

socket.on('updateGuestList', users => {
    guestList.innerHTML = '';
    users.forEach(addGuest);
});
