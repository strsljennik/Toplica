function setupSocketEvents(io, guests, authorizedUsers) {
    // Trenutno banovani korisnici (samo povezani klijenti)
    const bannedSet = new Set();

    io.on('connection', socket => {
        const { clientId, banToken } = socket.handshake.query;
        const nickname = guests[socket.id];

        // Ako klijent ima banToken, automatski ga označava kao banovanog
        if (banToken) {
            bannedSet.add(clientId);
            io.emit('userBanned', clientId);
        }

        // Ban event od autorizovanih korisnika
        socket.on('banUser', targetClientId => {
            const username = guests[socket.id];
            if (!authorizedUsers.has(username)) return;
            if (guests[socket.id] === '*__X__*') return; // __X__ ne može biti banovan

            if (!bannedSet.has(targetClientId)) {
                bannedSet.add(targetClientId);
                io.emit('userBanned', targetClientId);
            }
        });

        // Unban event od autorizovanih korisnika
        socket.on('unbanUser', targetClientId => {
            const username = guests[socket.id];
            if (!authorizedUsers.has(username)) return;

            if (bannedSet.has(targetClientId)) {
                bannedSet.delete(targetClientId);
                io.emit('userUnbanned', targetClientId);
            }
        });

        // Chat blokada za banovane korisnike
        socket.on('chatMessage', msg => {
            if (bannedSet.has(clientId)) return;
            io.emit('chatMessage', nickname, msg);
        });
    });
}

module.exports = { setupSocketEvents };
