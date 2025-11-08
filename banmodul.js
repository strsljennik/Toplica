const bannedUsers = new Set();

function setupSocketEvents(io, guests, authorizedUsers) {

    io.on('connection', (socket) => {
        const nickname = guests[socket.id] || 'Nepoznat korisnik';

        // --- Ban / unban ---
        socket.on('banUser', (targetNickname) => {
            const username = guests[socket.id] || 'Nepoznat korisnik';

            if (!authorizedUsers.has(username)) return;
            if (targetNickname === '*__X__*') return;

            if (bannedUsers.has(targetNickname)) {
                bannedUsers.delete(targetNickname);
                io.emit('userUnbanned', targetNickname);
            } else {
                bannedUsers.add(targetNickname);
                io.emit('userBanned', targetNickname);

                // Obavesti banovanog korisnika da postavi localStorage
                for (const [sockId, nick] of Object.entries(guests)) {
                    if (nick === targetNickname) {
                        io.to(sockId).emit('youAreBanned');
                    }
                }
            }
        });

        // --- Kada se korisnik reconnectuje ili ima kolačić / localStorage ---
        socket.on('userStillBanned', nickname => {
            if (!bannedUsers.has(nickname)) bannedUsers.add(nickname);
            io.emit('userBanned', nickname);
        });

        // --- Chat poruke ---
        socket.on('chatMessage', (msg) => {
            const nickname = guests[socket.id] || 'Nepoznat korisnik';
            if (bannedUsers.has(nickname)) return;
            io.emit('chatMessage', nickname, msg);
        });

        // --- Napomena: disconnect se NE dodaje u ovom modulu ---
    });
}

module.exports = { setupSocketEvents, bannedUsers };
