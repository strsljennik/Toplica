// glitter.js

let currentGlitter = null; // samo za trenutnog korisnika
let glitterTable = null;

const glitterImages = [
    'g1.gif','g2.gif','g3.gif','g4.gif','g5.gif',
    'g6.gif','g7.gif','g8.gif','g9.gif','g10.gif',
    'g11.gif','g12.gif','g13.gif','g14.gif','g15.gif','g16.gif',
    'g17.gif','g18.gif','g19.gif','g20.gif'
];


// Kreiranje table za izbor glittera
function createGlitterTable() {
    glitterTable = document.createElement('div');
    glitterTable.id = 'glitterTable';
    glitterTable.style.position = 'fixed';
    glitterTable.style.left = '0';
    glitterTable.style.bottom = '0';
    glitterTable.style.background = 'black';
    glitterTable.style.padding = '10px';
    glitterTable.style.display = 'none';
    glitterTable.style.border = '1px solid #444';
    glitterTable.style.borderRadius = '8px';
    glitterTable.style.zIndex = '1000';

    glitterImages.forEach(img => {
        const glitterImg = document.createElement('img');
        glitterImg.src = `/glit/${img}`;
        glitterImg.style.width = '50px';
        glitterImg.style.height = '50px';
        glitterImg.style.cursor = 'pointer';

        // Klik na glitter sliku
        glitterImg.addEventListener('click', () => {
            applyGlitter(myNickname, img, true); // samo trenutni korisnik
            currentGradient = null;
            currentColor = '';
            socket.emit('glitterChange', { nickname: myNickname, glitter: img });
            glitterTable.style.display = 'none';
        });

        glitterTable.appendChild(glitterImg);
    });

    document.body.appendChild(glitterTable);
}

// Primeni glitter na username
// isCurrentUser = true -> updateuje input
function applyGlitter(nickname, glitterImg, isCurrentUser = false) {
    const guestDiv = document.getElementById(`guest-${nickname}`);
    if (!guestDiv) return;

    // Ne overrideuj boju ili gradijent
    if (!guestDiv.dataset.userColor && !guestDiv.dataset.userGradient) {
        guestDiv.style.color = '';
        guestDiv.style.background = `url('/glit/${glitterImg}')`;
        guestDiv.style.backgroundSize = 'cover';
        guestDiv.style.filter = 'brightness(1.5) contrast(1.5)';
        guestDiv.style.backgroundClip = 'text';
        guestDiv.style.webkitBackgroundClip = 'text';
        guestDiv.style.webkitTextFillColor = 'transparent';
    }

    guestDiv.dataset.userGlitter = glitterImg;

    if (isCurrentUser) {
        currentGlitter = glitterImg;
        updateInputStyle();
    }
}

// Socket: učitaj sve glittere na konekciju
socket.on('allGlitters', (glitters) => {
    for (const nickname in glitters) {
        applyGlitter(nickname, glitters[nickname], false);
    }
});

// Socket: promene uživo od drugih korisnika
socket.on('glitterChange', (data) => {
    applyGlitter(data.nickname, data.glitter, false);
});

