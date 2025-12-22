// ================== BAN STATE ==================
const bannedSet = new Set();

// ================== SOCKET EVENTS ==================
socket.on('userBanned', nickname => {
    bannedSet.add(nickname);

    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.textContent = renderNickname(nickname);

    if (nickname === myNickname) {
        chatInput.disabled = true;
        messageArea.style.display = 'none';
        localStorage.setItem('banned', '1');
    }
});

socket.on('userUnbanned', nickname => {
    bannedSet.delete(nickname);

    const el = document.getElementById(`guest-${nickname}`);
    if (el) el.textContent = renderNickname(nickname);

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
    if (!authorizedUsers.has(myNickname)) return;
    if (myNickname !== '*__X__*' && authorizedUsers.has(nickname)) return;

    if (bannedSet.has(nickname)) {
        socket.emit('unbanUser', nickname);
    } else {
        socket.emit('banUser', nickname);
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

socket.on('userBanned', nick => bannedSet.add(nick));
socket.on('userUnbanned', nick => bannedSet.delete(nick));
