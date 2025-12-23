const mongoose = require('mongoose');

// Šema i model za banirane korisnike (po tokenu)
const frontBanSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
});
const FrontBan = mongoose.model('FrontBan', frontBanSchema);

function setupSocketEvents(io, guests, authorizedUsers) {

    io.on('connection', async (socket) => {
        const nickname = guests[socket.id];
        const token = socket.handshake.headers.cookie?.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        // Ako je korisnik baniran, odmah šalje ban
        if (token) {
            const banEntry = await FrontBan.findOne({ token });
            if (banEntry) {
                socket.emit('userBanned', nickname);
            }
        }

        // Ban/unban toggle (samo autorizovani)
        socket.on('banUser', async (targetNickname) => {
            const username = guests[socket.id];
            if (!authorizedUsers || !authorizedUsers.has(username)) return;

            // Nađi token banovanog korisnika iz guests
            const targetSocketId = Object.keys(guests).find(id => guests[id] === targetNickname);
            if (!targetSocketId) return;
            const targetToken = targetSocketId ? guests[targetSocketId] : null;

            const existingBan = await FrontBan.findOne({ token: targetToken });
            if (existingBan) {
                await FrontBan.deleteOne({ token: targetToken });
                io.emit('userUnbanned', targetNickname);
            } else {
                if (!targetToken) return;
                const newBan = new FrontBan({ token: targetToken });
                await newBan.save();
                io.emit('userBanned', targetNickname);
            }
        });

        // Chat blokada za banovane korisnike
        socket.on('chatMessage', async (msg) => {
            const nickname = guests[socket.id];
            if (token) {
                const isBanned = await FrontBan.findOne({ token });
                if (isBanned) return;
            }
            io.emit('chatMessage', nickname, msg);
        });
    });
}

module.exports = { setupSocketEvents };
