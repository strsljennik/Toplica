// --- CSS direktno iz JS ---
const style = document.createElement('style');
style.textContent = `
  #avatar {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 500px;
    border: 5px solid;
    border-image: linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff) 1;
    background: black;
    padding: 10px;
    box-sizing: border-box;
    z-index: 999;
    overflow-y: auto;
  }
  #avatar img {
    width: 20px;
    height: 20px;
    margin: 5px;
    cursor: pointer;
  }
  .inline-avatar {
    width: 20px;
    height: 20px;
    margin-left: 5px;
    vertical-align: middle;
  }
  #clear-avatar, #avatar-chat-toggle {
    margin-top: 10px;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
    display: block;
  }
  #clear-avatar { background-color: #f44336; color: white; }
  #avatar-chat-toggle { background-color: #4caf50; color: white; }
`;
document.head.appendChild(style);

// --- Globalni objekti ---
let avatars = {};
let showAvatarInChat = localStorage.getItem('showAvatarInChat') === '1' ? true : false;

// --- Storage funkcije ---
function loadAvatarsFromStorage() {
  const stored = localStorage.getItem('avatars');
  avatars = stored ? JSON.parse(stored) : {};
}

function saveAvatarsToStorage() {
  localStorage.setItem('avatars', JSON.stringify(avatars));
  localStorage.setItem('showAvatarInChat', showAvatarInChat ? '1' : '0');
}

function createAvatarImg(src) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'inline-avatar';
  return img;
}

loadAvatarsFromStorage();

// --- Guest list avatar logika ---
socket.on('initialAvatars', avatarsFromServer => {
  avatars = avatarsFromServer || avatars;
  saveAvatarsToStorage();
  for (const username in avatars) {
    (function tryAppend() {
      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(avatars[username]));
      } else {
        setTimeout(tryAppend, 100);
      }
    })();
  }
});

socket.on('updateGuestList', guests => {
  for (const username of guests) {
    const avatar = avatars[username];
    if (avatar) {
      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(avatar));
      }
    }
  }
});

socket.on('avatarChange', data => {
  if (data.avatar) avatars[data.username] = data.avatar;
  else delete avatars[data.username];
  saveAvatarsToStorage();
  const guestDiv = document.getElementById(`guest-${data.username}`);
  if (guestDiv) {
    guestDiv.querySelector('.inline-avatar')?.remove();
    if (data.avatar) guestDiv.appendChild(createAvatarImg(data.avatar));
  }
});

// --- Glavni panel za izbor avatara ---
document.getElementById('sl').addEventListener('click', () => {
  const avatarDiv = document.getElementById('avatar');
  if (!avatarDiv) return;

  avatarDiv.style.display = avatarDiv.style.display === 'block' ? 'none' : 'block';
  if (avatarDiv.style.display === 'none' || !window.currentUser?.username) return;

  const username = window.currentUser.username;

  // Očisti prethodni sadržaj
  avatarDiv.innerHTML = '';

  // Dodaj slike avatara za guestlist
  for (let i = 1; i <= 20; i++) {
    const img = document.createElement('img');
    img.src = `nik/sl${i}.webp`;
    img.alt = `Slika ${i}`;
    img.addEventListener('click', () => {
      avatars[username] = img.src;
      saveAvatarsToStorage();

      const guestDiv = document.getElementById(`guest-${username}`);
      if (guestDiv) {
        guestDiv.querySelector('.inline-avatar')?.remove();
        guestDiv.appendChild(createAvatarImg(img.src));
      }

      socket.emit('avatarChange', { username, avatar: img.src });
    });
    avatarDiv.appendChild(img);
  }

  // Dugme za brisanje avatara za guestlist
  const clearBtn = document.createElement('button');
  clearBtn.id = 'clear-avatar';
  clearBtn.textContent = 'Obriši Avatar';
  clearBtn.addEventListener('click', () => {
    const guestDiv = document.getElementById(`guest-${username}`);
    if (guestDiv) guestDiv.querySelector('.inline-avatar')?.remove();
    delete avatars[username];
    saveAvatarsToStorage();
    socket.emit('avatarChange', { username, avatar: '' });
  });
  avatarDiv.appendChild(clearBtn);
 // --- Dugme za chat avatar SAMO za auth korisnike ---
if (authorizedUsers.has(username)) {
  const chatToggle = document.createElement('button');
  chatToggle.id = 'avatar-chat-toggle';
  chatToggle.textContent = showAvatarInChat
    ? 'Avatar u porukama: UKLJUČEN'
    : 'Avatar u porukama: ISKLJUČEN';
  chatToggle.style.display = 'block';
  chatToggle.style.marginTop = '10px';

  chatToggle.addEventListener('click', () => {
    showAvatarInChat = !showAvatarInChat; // toggle stanje
    chatToggle.textContent = showAvatarInChat
      ? 'Avatar u porukama: UKLJUČEN'
      : 'Avatar u porukama: ISKLJUČEN';
    saveAvatarsToStorage();

    // Emitujemo trenutni avatar za chat, svi ga vide u porukama
    const avatarSrc = showAvatarInChat ? avatars[username] || '' : '';
    socket.emit('avatarChange', { username, avatar: avatarSrc });
  });

  avatarDiv.appendChild(chatToggle);
}
});

