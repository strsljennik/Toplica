document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     TVOJE – NE DIRAM
  ========================= */

  const authorizedUsers = new Set([
    'Radio Galaksija','R-Galaksija','ZI ZU',
    '*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊',
    'Najlepsa Ciganka','Dia💎','Dia'
  ]);

  let hasBanPrivilege = false;
  let isBanned = false;
  let username = null;

  const guestList = document.getElementById("guestList");
  const chatInput = document.getElementById("chatInput");
  const messageArea = document.getElementById("messageArea");

  /* =========================
     DODATAK – TOKEN + FP
  ========================= */

  function getBanToken() {
    let t = localStorage.getItem("banToken");
    if (!t) {
      t = crypto.randomUUID();
      localStorage.setItem("banToken", t);
    }
    return t;
  }

  function getFingerprint() {
    return [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height
    ].join("|");
  }

  const banToken = getBanToken();
  const fingerprint = getFingerprint();

  /* =========================
     LOGIN (TVOJE + DODATAK)
  ========================= */

  document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-socket-id': socket.id
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) return;

      socket.emit('userLoggedIn', username);

      // PRIVILEGIJA
      if (authorizedUsers.has(username)) {
        hasBanPrivilege = true;
      }

      // IDENTIFIKACIJA ZA BAN
      socket.emit("identifyUser", {
        username,
        banToken,
        fingerprint
      });

      this.reset();
    });
  });

  /* =========================
     BAN UI (NOVO)
  ========================= */

  function applyBanUI() {
    isBanned = true;
    chatInput.disabled = true;
    messageArea.style.display = "none";
  }

  function removeBanUI() {
    isBanned = false;
    chatInput.disabled = false;
    messageArea.style.display = "block";
  }

  /* =========================
     DVOKLIK BAN (TVOJE)
  ========================= */

  guestList.addEventListener("dblclick", (e) => {
    const target = e.target;
    if (!target.classList.contains("guest")) return;

    const nickname = target.textContent
      .split(" (")[0]
      .trim()
      .replace(/( (B|I))/g, '');

    // *__X__* NIKAD NE MOŽE BITI BANOVAN
    if (nickname === '*__X__*') return;

    if (!hasBanPrivilege) return;

    const action = target.classList.toggle("banned")
      ? "banUser"
      : "unbanUser";

    target.style.backgroundColor = action === "banUser" ? "red" : "";
    target.textContent = `${nickname}${action === "banUser" ? " (B)" : ""}`;

    socket.emit(action, {
      nickname,
      banToken,
      fingerprint
    });
  });

  /* =========================
     SOCKET – BAN DOGAĐAJI
  ========================= */

  socket.on("sessionBan", applyBanUI);
  socket.on("permanentBan", applyBanUI);

  socket.on("userUnbanned", (nick) => {
    if (nick === username) {
      removeBanUI();
    }
  });

});
