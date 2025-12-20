const userSockets = new Map(); // socket.id → username

function setupSocketEvents(io, guests, bannedUsers, authorizedUsers) {
    io.on('connection', (socket) => {
        const nickname = guests[socket.id];

        // Odmah po konekciji pošalji listu banovanih korisnika ovom socketu
        bannedUsers.forEach(banNick => {
            io.to(socket.id).emit('userBanned', banNick);
        });

        // Praćenje prijavljenih korisnika (za autorizaciju ban/unban)
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

        // Ban/unban funkcija (samo autorizovani)
        socket.on('banUser', (targetNickname) => {
            const username = userSockets.get(socket.id);
            if (!authorizedUsers || !authorizedUsers.has(username)) return;
            if (targetNickname === '*__X__*') return;

            if (bannedUsers.has(targetNickname)) {
                bannedUsers.delete(targetNickname);
                io.emit('userUnbanned', targetNickname);
            } else {
                bannedUsers.add(targetNickname);
                io.emit('userBanned', targetNickname);
            }
        });

        // Chat blokada za banovane
        socket.on('chatMessage', (msg) => {
            const currentNickname = guests[socket.id];
            if (bannedUsers.has(currentNickname)) return;
            io.emit('chatMessage', currentNickname, msg);
        });
    });
}

module.exports = { setupSocketEvents };
