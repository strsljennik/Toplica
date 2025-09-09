const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  total: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// GLOBALNO stanje svih divova
const divStates = {};

// Funkcija za čuvanje stanja diva
function updateDivState(data) {
  divStates[data.id] = {
    id: data.id,
    left: data.left,
    top: data.top,
    width: data.width,
    height: data.height,
    color: data.color,
    backgroundImage: data.backgroundImage,
    isGradientText: data.isGradientText,
    fontSize: data.fontSize || ''
  };
}

async function setupUserCounter(io) {
  io.on('connection', async (socket) => {
    try {
      // 👉 Uzimamo broj trenutnih konekcija preko socket.io (pouzdano)
      const current = io.engine.clientsCount;

      // 👉 Povećavamo ukupan broj korisnika u bazi
      let counter = await Counter.findOne() || new Counter();
      counter.total++;
      await counter.save();

      io.emit('usersCount', {
        current: current,
        total: counter.total
      });

      // Pošalji SVE divove odmah novom korisniku
      Object.values(divStates).forEach(div => {
        socket.emit('updateDiv', div);
      });

      socket.on('requestUsersCount', () => {
        const current = io.engine.clientsCount;
        socket.emit('usersCount', {
          current: current,
          total: counter.total
        });
      });

      socket.on('updateDiv', (data) => {
        updateDivState(data);
        io.emit('updateDiv', data); // šalji svima, uključujući pošiljaoca
      });

      socket.on('disconnect', () => {
        const current = io.engine.clientsCount;
        io.emit('usersCount', {
          current: current,
          total: counter.total
        });
      });

    } catch (err) {
      console.error('Greška:', err);
    }
  });
}

module.exports = setupUserCounter;
