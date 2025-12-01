let socket;
let interval;

function startSocket() {
  if (socket) {
    socket.off();
    socket.disconnect();
  }

  socket = io();

  socket.on("msg", data => {
    // obrada bez gomilanja nizova
  });

  // interval obavezno čuvaj da može da se obriše
  interval = setInterval(() => {
    socket.emit("ping");
  }, 5000);
}

window.onload = startSocket;

window.onbeforeunload = () => {
  if (interval) clearInterval(interval);
  if (socket) socket.off();
};
