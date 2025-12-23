let privilegedUsers = new Set([
  'Radio Galaksija','R-Galaksija','ZI ZU',
  '*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊',
  'Najlepsa Ciganka','Dia💎','Dia'
]);

const userSockets = new Map(); // socket.id -> username
const bannedTokens = new Set(); // token -> ban
const bannedSockets = new Set(); // session ban po socket.id

function setupSocketEvents(io, guests) {

  io.on('connection', (socket) => {

    // IDENTIFIKACIJA KORISNIKA
    socket.on("identifyUser", ({ username, banToken }) => {
      userSockets.set(socket.id, username);
      socket.banToken = banToken;

      if (bannedTokens.has(banToken)) {
        socket.emit("permanentBan"); // blokira UI samo ciljanom
        bannedSockets.add(socket.id);
      }
    });

    // LOGIN EVENT (opcionalno)
    socket.on('userLoggedIn', (username) => {
      userSockets.set(socket.id, username);
    });

    // BAN EVENT – SAMO PRIVILEGOVANI
    socket.on('banUser', ({ nickname }) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;
      if (nickname === '*__X__*') return;

      const targetSocketId = Object.keys(guests).find(id => guests[id] === nickname);
      if (!targetSocketId) return;

      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (!targetSocket) return;

      // session ban
      bannedSockets.add(targetSocketId);

      // persistent ban po tokenu
      if (targetSocket.banToken) {
        bannedTokens.add(targetSocket.banToken);
      }

      targetSocket.emit("permanentBan"); // samo ciljanom
      io.to(socket.id).emit("userBanned", nickname); // admin vidi da je ban uspeo
    });

    // UNBAN EVENT
    socket.on('unbanUser', ({ nickname }) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;

      const targetSocketId = Object.keys(guests).find(id => guests[id] === nickname);
      if (!targetSocketId) return;

      bannedSockets.delete(targetSocketId);
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      if (targetSocket?.banToken) bannedTokens.delete(targetSocket.banToken);

      io.to(targetSocketId)?.emit("userUnbanned", nickname); // samo ciljanom
      io.to(socket.id).emit("userUnbanned", nickname); // admin vidi
    });

    // CHAT PORUKE
    socket.on("chatMessage", (msg) => {
      if (bannedSockets.has(socket.id)) return; // ignorisi poruke banovanih
      io.emit("chatMessage", msg); // svi vide poruku
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      userSockets.delete(socket.id);
      bannedSockets.delete(socket.id); // session ban se gubi
    });

  });
}

module.exports = { setupSocketEvents };
