const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  total: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

let currentUsers = 0;

async function setupUserCounter(io) {
  io.on('connection', async (socket) => {
    try {
      currentUsers++;

      let counter = await Counter.findOne() || new Counter();
      counter.total++;
      await counter.save();

      // Emitovanje svima
      io.emit('usersCount', { 
        current: currentUsers, 
        total: counter.total 
      });

      // Obrada zahtjeva za podacima
      socket.on('requestUsersCount', async () => {
        socket.emit('usersCount', {
          current: currentUsers,
          total: counter.total
        });
      });

      socket.on('disconnect', async () => {
        currentUsers--;
        io.emit('usersCount', { 
          current: currentUsers, 
          total: counter.total 
        });
      });

    } catch (err) {
      console.error('Greška u brojaču:', err);
    }
  });
}

module.exports = setupUserCounter;