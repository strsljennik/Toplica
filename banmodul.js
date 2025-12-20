const { getDB } = require('./mongo'); // funkcija koja vraća connected DB
const userSockets = new Map(); // socket.id → username

async function isBanned(clientId) {
    const db = getDB();
    const ban = await db.collection('fronban').findOne({ clientId });
    return !!ban;
}

async function banClient(clientId) {
    const db = getDB();
    await db.collection('fronban').updateOne(
        { clientId },
        { $set: { clientId, date: new Date() } },
        { upsert: true }
    );
}

async function unbanClient(clientId) {
    const db = getDB();
    await db.collection('fronban').deleteOne({ clientId });
}

function setupSocketEvents(io, guests, authorizedUsers) {
    io.on('connection', async (socket) => {
        const nickname = guests[socket.id];

        // kada se front pošalje init sa clientId
        socket.on('init', async clientId => {
            // proveri u bazi da li je banovan
            if (await isBanned(clientId)) {
                socket.emit('userBanned', clientId);
            }
        });

        // Praćenje prijavljenih korisnika (za autorizaciju ban/unban)
        socket.on('userLoggedIn', (username) => {
            userSockets.set(socket.id, username);
            guests[socket.id] = username;
            io.emit('updateGuestList', Object.values(guests));
        });

        // Ban/unban funkcija (samo autorizovani)
        socket.on('banUser', async (targetClientId) => {
            const username = userSockets.get(socket.id);
            if (!authorizedUsers || !authorizedUsers.has(username)) return;

            if (await isBanned(targetClientId)) {
                await unbanClient(targetClientId);
                io.emit('userUnbanned', targetClientId);
            } else {
                await banClient(targetClientId);
                io.emit('userBanned', targetClientId);
            }
        });

        // Chat blokada za banovane
        socket.on('chatMessage', async (msg) => {
            const clientId = socket.handshake.query.clientId; // ili iz init
            if (await isBanned(clientId)) return;
            io.emit('chatMessage', guests[socket.id], msg);
        });
    });
}

module.exports = { setupSocketEvents };
