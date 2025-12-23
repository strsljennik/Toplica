let privilegedUsers = new Set([
  'Radio Galaksija','R-Galaksija','ZI ZU',
  '*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊',
  'Najlepsa Ciganka','Dia'
]);

const userSockets = new Map(); // socket.id -> username
const bannedTokens = new Set(); // token -> ban

function setupSocketEvents(io, guests, bannedUsers) {

  io.on('connection', (socket) => {

    // IDENTIFIKACIJA KORISNIKA PRI CONNECTU
    socket.on("identifyUser", ({ username, banToken }) => {
      userSockets.set(socket.id, username);
      socket.banToken = banToken;

      if (bannedTokens.has(banToken)) {
        socket.emit("permanentBan"); // blokira UI
      }
    });

    // LOGIN EVENT
    socket.on('userLoggedIn', (username) => {
      userSockets.set(socket.id, username);

      if (privilegedUsers.has(username)) {
        socket.emit('adminAccess', "Pristup odobren.");
      }
    });

    // BAN EVENT
    socket.on('banUser', ({ nickname, banToken }) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;

      if (nickname === '*__X__*') return;

      const targetSocketId = Object.keys(guests)
        .find(id => guests[id] === nickname);
      if (!targetSocketId) return;

      // session ban
      bannedUsers.add(targetSocketId);

      // persistent ban po tokenu
      bannedTokens.add(banToken);

      io.to(targetSocketId).emit("permanentBan");
      socket.broadcast.emit("userBanned", nickname);
    });

    // UNBAN EVENT
    socket.on('unbanUser', ({ nickname, banToken }) => {
      const admin = userSockets.get(socket.id);
      if (!privilegedUsers.has(admin)) return;

      const targetSocketId = Object.keys(guests)
        .find(id => guests[id] === nickname);
      if (!targetSocketId) return;

      bannedUsers.delete(targetSocketId);
      bannedTokens.delete(banToken);

      io.emit("userUnbanned", nickname);
    });

    // CHAT PORUKE
    socket.on("chatMessage", (msg) => {
      if (bannedUsers.has(socket.id)) return;
      io.emit("chatMessage", msg);
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      userSockets.delete(socket.id);
      bannedUsers.delete(socket.id); // samo session ban
    });

  });
}

module.exports = { setupSocketEvents };

