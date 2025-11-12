const bannedUsers = new Set();

function setupSocketEvents(io, guests, authorizedUsers) {
    io.on('connection', (socket) => {
        const nickname = guests[socket.id];

        // --- po konekciji pošalji ban status samo banovanom ---
        if (bannedUsers.has(nickname)) {
            io.to(socket.id).emit('youAreBanned');   // blokada chat-a banovanom
            io.emit('userBanned', nickname);         // svi vide crvenu liniju
        }

        // --- Ban / unban toggle ---
        socket.on('banUser', (targetNickname) => {
            const username = guests[socket.id];
            if (!authorizedUsers.has(username)) return; // samo admin/mod
            if (!targetNickname || targetNickname === '*__X__*') return;

            if (bannedUsers.has(targetNickname)) {
                // UNBAN
                bannedUsers.delete(targetNickname);
                io.emit('userUnbanned', targetNickname); // svi uklanjaju crvenu liniju
                console.log(`[BAN] ${targetNickname} unbanned`);
            } else {
                // BAN
                bannedUsers.add(targetNickname);
                io.emit('userBanned', targetNickname);   // svi vide crvenu liniju
                console.log(`[BAN] ${targetNickname} banned`);

                // samo banovanom šaljemo blokadu chat-a
                for (const [sockId, nick] of Object.entries(guests)) {
                    if (nick === targetNickname) {
                        io.to(sockId).emit('youAreBanned');
                        console.log(`[BAN] youAreBanned -> socket ${sockId}`);
                    }
                }
            }
        });
    });
}

module.exports = { setupSocketEvents, bannedUsers };
