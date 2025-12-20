const mongoose = require('mongoose');

// Šema i model za banirane korisnike (preko nick-a ili tokena)
const frontBanSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true }, // token iz cookie-ja
});
const FrontBan = mongoose.model('FrontBan', frontBanSchema);

function setupSocketEvents(io, guests, authorizedUsers) {

    io.on('connection', async (socket) => {
        const nickname = guests[socket.id];
        const token = socket.handshake.headers.cookie?.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        // Proveri da li je korisnik baniran i pošalji mu 🔒
        if (token) {
            const banEntry = await FrontBan.findOne({ token });
            if (banEntry) {
                socket.emit('userBanned', nickname);
            }
        }

        // Ban/unban funkcija (samo autorizovani)
        socket.on('banUser', async (targetToken) => {
            const username = guests[socket.id];
            if (!authorizedUsers || !authorizedUsers.has(username)) return;

            const existingBan = await FrontBan.findOne({ token: targetToken });
            if (existingBan) {
                await FrontBan.deleteOne({ token: targetToken });
                io.emit('userUnbanned', targetToken);
            } else {
                const newBan = new FrontBan({ token: targetToken });
                await newBan.save();
                io.emit('userBanned', targetToken);
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
