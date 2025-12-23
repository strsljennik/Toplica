const mongoose = require('mongoose');

// Šema i model za banovane korisnike (po clientId)
const frontBanSchema = new mongoose.Schema({
    clientId: { type: String, required: true, unique: true },
});
const FrontBan = mongoose.model('FrontBan', frontBanSchema);

function setupSocketEvents(io, guests, authorizedUsers) {
    io.on('connection', async (socket) => {
        const clientId = socket.handshake.query.clientId;
        const nickname = guests[socket.id];

        // Ako je korisnik već banovan, odmah šalje ban event
        if (clientId) {
            const banEntry = await FrontBan.findOne({ clientId });
            if (banEntry) {
                socket.emit('userBanned', clientId);
            }
        }

        // Ban/unban toggle (samo autorizovani)
        socket.on('banUser', async (targetClientId) => {
            const username = guests[socket.id];
            if (!authorizedUsers || !authorizedUsers.has(username)) return;

            const existingBan = await FrontBan.findOne({ clientId: targetClientId });
            if (existingBan) {
                await FrontBan.deleteOne({ clientId: targetClientId });
                io.emit('userUnbanned', targetClientId);
            } else {
                const newBan = new FrontBan({ clientId: targetClientId });
                await newBan.save();
                io.emit('userBanned', targetClientId);
            }
        });

        // Chat blokada za banovane korisnike
        socket.on('chatMessage', async (msg) => {
            if (!clientId) return;
            const isBanned = await FrontBan.findOne({ clientId });
            if (isBanned) return;
            io.emit('chatMessage', nickname, msg);
        });

        // Čisto da se frontend ažurira kad se neko poveže
        socket.on('requestGuestList', () => {
            Object.keys(guests).forEach(async id => {
                const cid = id; // pretpostavljamo da guests[id] sadrži clientId
                const isBanned = await FrontBan.findOne({ clientId: cid });
                if (isBanned) io.to(socket.id).emit('userBanned', cid);
            });
        });
    });
}

module.exports = { setupSocketEvents };
