document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('user-stats')) {
    const statsDiv = document.createElement('div');
    statsDiv.id = 'user-stats';
    statsDiv.innerHTML = `<p id="current-users"><b><i>Online: 0</i></b></p> / <p id="total-users"><b><i>Ukupno: 0</i></b></p>`;
    document.body.appendChild(statsDiv);

    const style = document.createElement('style');
    style.textContent = `
      #user-stats {
        position: fixed;
        top: 20px;
        left: 20px;
        background: transparent;
        color: white;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        z-index: 1;
        padding: 10px;
       font-size: 20px;
        cursor: move;
      }
      #user-stats p {
        display: inline;
        margin: 0 5px;
      }
      #local-time-div {
        position: fixed;
        top: 20px;
        right: 20px;
        background: transparent;
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        z-index: 1;
        font-size: 20px;
        cursor: move;
      }
    `;
    document.head.appendChild(style);

    if (authorizedUsers.has(currentUser)) {
      setupInteract(statsDiv);
    }
  }

  if (!document.getElementById('local-time-div')) {
    const timeDiv = document.createElement('div');
    timeDiv.id = 'local-time-div';
    timeDiv.innerHTML = `<p id="local-time"><b><i>Vreme: --:--:--</i></b></p>`;
    document.body.appendChild(timeDiv);

    setInterval(() => {
      const now = new Date();
      document.getElementById('local-time').innerHTML = `<b><i>Vreme: ${now.toLocaleTimeString()}</i></b>`;
    }, 1000);

    if (authorizedUsers.has(currentUser)) {
      setupInteract(timeDiv);
    }
  }

  socket.on('usersCount', (data) => {
    document.getElementById('current-users').innerHTML = `<b><i>Online: ${data.current}</i></b>`;
    document.getElementById('total-users').innerHTML = `<b><i>Ukupno: ${data.total}</i></b>`;
  });

  socket.emit('requestUsersCount');
});
