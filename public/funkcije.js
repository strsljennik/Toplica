document.addEventListener("DOMContentLoaded", () => {

  const authorizedUsers = new Set([
    'Radio Galaksija','R-Galaksija','ZI ZU',
    '*___F117___*','*__X__*','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊',
    'Najlepsa Ciganka','Dia💎','Dia'
  ]);

  const chatInput = document.getElementById("chatInput");
  const messageArea = document.getElementById("messageArea");
  const guestList = document.getElementById("guestList");

  let username = null;
  let hasBanPrivilege = false;
  let isBanned = false;

  // BAN UI
  function applyBanUI() {
    if (isBanned) return;
    isBanned = true;
    chatInput.disabled = true;
    messageArea.style.display = "none";
  }

  function removeBanUI() {
    if (!isBanned) return;
    isBanned = false;
    chatInput.disabled = false;
    messageArea.style.display = "block";
  }

  // LOGIN
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    username = document.getElementById('loginUsername').value.trim();
    if (!username) return;

    const banToken = localStorage.getItem("banToken") || crypto.randomUUID();
    localStorage.setItem("banToken", banToken);

    socket.emit("identifyUser", { username, banToken });

    hasBanPrivilege = authorizedUsers.has(username);
  });

  // DVOKLIK NA GOSTE – SAMO AUTH MOŽE BANOVATI
  guestList.addEventListener("dblclick", e => {
    const target = e.target;
    if (!target.classList.contains("guest")) return;

    const nickname = target.textContent.split(" (")[0].trim();

    // *__X__* nikad ne može biti banovan
    if (nickname === '*__X__*') return;
    if (!hasBanPrivilege) return;

    const action = target.classList.toggle("banned") ? "banUser" : "unbanUser";
    target.style.backgroundColor = action === "banUser" ? "red" : "";
    target.textContent = `${nickname}${action === "banUser" ? " (B)" : ""}`;

    socket.emit(action, { nickname });
  });

  // CHAT PORUKE – OČUVANJE jedinstvenog listener-a
  socket.off("chatMessage");
  socket.on("chatMessage", data => {
    if (!data || !data.message) return;
    const div = document.createElement("div");
    div.textContent = `${data.username}: ${data.message}`;
    messageArea.appendChild(div);
  });

  // BAN EVENTS – samo ciljani korisnik
  socket.off("permanentBan");
  socket.on("permanentBan", applyBanUI);

  socket.off("sessionBan");
  socket.on("sessionBan", applyBanUI);

  socket.off("userUnbanned");
  socket.on("userUnbanned", nick => {
    if (nick === username) removeBanUI();
  });

  // SLANJE PORUKA
  chatInput.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (isBanned) return;

    const msg = chatInput.value.trim();
    if (!msg) return;

    socket.emit("chatMessage", { username, message: msg });
    chatInput.value = "";
  });

});
