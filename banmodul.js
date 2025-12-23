let privilegedUsers = new Set([
  'Radio Galaksija','R-Galaksija','ZI ZU',
  '*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊',
  'Najlepsa Ciganka','Dia'
]);

const userSockets = new Map();   // socket.id -> username
const socketMeta = new Map();    // socket.id -> { banToken, fingerprint }
const bannedTokens = new Map();  // banToken -> { fingerprint, by, date }

function setupSocketEvents(io, guests, bannedUsers) {

  io.on('connection', (socket) => {

    /* =========================
       IDENTIFIKACIJA (TOKEN + FP)
    ========================= */
    socket.on("identifyUser", ({ username, banToken, fingerprint }) => {
      socketMeta.set(socket.id, { banToken, fingerprint });

      // Ako ima trajni ban → samo zaključa UI
      if (bannedTokens.has(banToken)) {
        socket.emit("permanentBan");
      }
    });

    /* =========================
       LOGIN
    ========================= */
    socket.on('userLoggedIn', (username) => {
      userSockets.set(socket.id, username);

      if (privilegedUsers.has(username)) {
        socket.emit('adminAccess', "Pristup odobren.");
      }
    });

    /* =========================
       BAN USER (bez disconnect)
    ========================= */
    socket.on('banUser', ({ nickname }) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;

      // *__X__* nikad ne može biti banovan
      if (nickname === '*__X__*') return;

      const targetSocketId = Object.keys(guests)
        .find(id => guests[id] === nickname);

      if (!targetSocketId) return;

      const meta = socketMeta.get(targetSocketId);
      if (!meta) return;

      // SESSION BAN
      bannedUsers.add(targetSocketId);
      io.to(targetSocketId).emit("sessionBan");

      // TRAJNI BAN (token)
      bannedTokens.set(meta.banToken, {
        fingerprint: meta.fingerprint,
        by: admin,
        date: Date.now()
      });

      io.emit("userBanned", nickname);
    });

    /* =========================
       UNBAN USER
    ========================= */
    socket.on('unbanUser', (nickname) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;

      const targetSocketId = Object.keys(guests)
        .find(id => guests[id] === nickname);

      if (!targetSocketId) return;

      const meta = socketMeta.get(targetSocketId);
      if (meta) {
        bannedTokens.delete(meta.banToken);
      }

      bannedUsers.delete(targetSocketId);
      io.emit("userUnbanned", nickname);
    });

    /* =========================
       BLOKIRANJE CHAT PORUKA
    ========================= */
    socket.on("chatMessage", (msg) => {
      if (bannedUsers.has(socket.id)) return;
      io.emit("chatMessage", msg);
    });

    /* =========================
       DISCONNECT (čisto čišćenje)
    ========================= */
    socket.on('disconnect', () => {
      userSockets.delete(socket.id);
      socketMeta.delete(socket.id);
      bannedUsers.delete(socket.id); // samo session ban
    });

  });
}

module.exports = { setupSocketEvents };

