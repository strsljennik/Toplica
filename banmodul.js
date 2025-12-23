const userSockets = new Map(); // socket.id → username

function setupSocketEvents(io, guests, bannedUsers, authorizedUsers) {
    io.on("connection", socket => {

        socket.on("userLoggedIn", username => {
            userSockets.set(socket.id, username);
            guests[socket.id] = username;

            // 🔑 pošalji postojeće banove SAMO novom klijentu
            bannedUsers.forEach(banNick => {
                socket.emit("userBanned", banNick);
            });
        });

        socket.on("banUser", targetNickname => {
            const username = userSockets.get(socket.id);
            if (!authorizedUsers.has(username)) return;
            if (targetNickname === "*__X__*") return;

            if (bannedUsers.has(targetNickname)) {
                bannedUsers.delete(targetNickname);
                console.log(`ODBAN: ${targetNickname}`);
                io.emit("userUnbanned", targetNickname);
            } else {
                bannedUsers.add(targetNickname);
                console.log(`BAN: ${targetNickname}`);
                io.emit("userBanned", targetNickname);
            }
        });

        socket.on("chatMessage", msg => {
            const nickname = guests[socket.id];
            if (bannedUsers.has(nickname)) return;
            io.emit("chatMessage", nickname, msg);
        });

        socket.on("disconnect", () => {
            userSockets.delete(socket.id);
        });
    });
}

module.exports = { setupSocketEvents };
