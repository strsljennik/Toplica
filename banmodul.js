const mongoose = require('mongoose');

// Šema i model za ban po nickname-u
const frontBanSchema = new mongoose.Schema({
    nickname: { type: String, required: true, unique: true },
});
const FrontBan = mongoose.model('FrontBan', frontBanSchema);

function setupSocketEvents(io, guests, authorizedUsers) {

    io.on('connection', async (socket) => {
        const nickname = guests[socket.id];

        // Proveri da li je korisnik banovan
        const banEntry = await FrontBan.findOne({ nickname });
        if (banEntry) {
            socket.emit('userBanned', nickname);
        }

        // Ban korisnika
        socket.on('banUser', async (targetNickname) => {
            const username = guests[socket.id];
            if (!authorizedUsers.has(username)) return;

            const existingBan = await FrontBan.findOne({ nickname: targetNickname });
            if (!existingBan) {
                const newBan = new FrontBan({ nickname: targetNickname });
                await newBan.save();
                io.emit('userBanned', targetNickname);
            }
        });

        // Unban korisnika
        socket.on('unbanUser', async (targetNickname) => {
            const username = guests[socket.id];
            if (!authorizedUsers.has(username)) return;

            const existingBan = await FrontBan.findOne({ nickname: targetNickname });
            if (existingBan) {
                await FrontBan.deleteOne({ nickname: targetNickname });
                io.emit('userUnbanned', targetNickname);
            }
        });

        // Chat blokada
        socket.on('chatMessage', async (msg) => {
            const username = guests[socket.id];
            const isBanned = await FrontBan.findOne({ nickname: username });
            if (isBanned) return;
            io.emit('chatMessage', username, msg);
        });
    });
}

module.exports = { setupSocketEvents };
