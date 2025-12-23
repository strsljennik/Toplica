const userSockets = new Map(); // socket.id → username

function setupSocketEvents(io, guests, bannedUsers, authorizedUsers) {
    io.on('connection', (socket) => {

        socket.on('userLoggedIn', (username) => {
            userSockets.set(socket.id, username);
            guests[socket.id] = username;

            // Pošalji svima novu listu korisnika
            io.emit('updateGuestList', Object.values(guests));

            // Pošalji svim klijentima sve trenutne banove
            bannedUsers.forEach(banNick => {
                io.emit('userBanned', banNick);
            });
        });

        socket.on('banUser', (targetNickname) => {
            const username = userSockets.get(socket.id);
            if (!authorizedUsers.has(username)) return;
            if (targetNickname === '*__X__*') return;

            if (bannedUsers.has(targetNickname)) {
                bannedUsers.delete(targetNickname);
                io.emit('userUnbanned', targetNickname);
            } else {
                bannedUsers.add(targetNickname);
                io.emit('userBanned', targetNickname);
            }
        });

        socket.on('chatMessage', (msg) => {
            const nickname = guests[socket.id];
            if (bannedUsers.has(nickname)) return;
            io.emit('chatMessage', nickname, msg);
        });

        // Disconnect handler se koristi samo u glavnom fajlu
    });
}

module.exports = { setupSocketEvents };
