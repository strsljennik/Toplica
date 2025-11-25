let currentGlitter = null;
let glitterTable = null;

const glitterImages = [
    'g1.gif', 'g2.gif', 'g3.gif', 'g4.gif', 'g5.gif',
    'g6.gif', 'g7.gif', 'g8.gif', 'g9.gif', 'g10.gif',
    'g11.gif', 'g12.gif','g13.gif','g14.gif','g15.gif','g16.gif'
];

function createGlitterTable() {
    glitterTable = document.createElement('div');
    glitterTable.id = 'glitterTable';
    glitterTable.style.position = 'fixed';   // fiksno u viewport-u
    glitterTable.style.left = '0';           // 0 sa leve strane
    glitterTable.style.bottom = '0';         // 0 od dna ekrana
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
        glitterImg.style.margin = '';
        glitterImg.style.cursor = 'pointer';

        // ✔️ Klik na glitter sliku
        glitterImg.addEventListener('click', () => {
            applyGlitter(myNickname, img);

            currentGradient = null;
            currentColor = '';
            currentGlitter = img;   
            updateInputStyle();    

            socket.emit('glitterChange', { nickname: myNickname, glitter: img });

            glitterTable.style.display = 'none';
        });

        glitterTable.appendChild(glitterImg);
    });

    document.body.appendChild(glitterTable);
}


// ✔️ Primeni glitter na username
function applyGlitter(nickname, glitterImg) {
    const guestDiv = document.getElementById(`guest-${nickname}`);
    if (!guestDiv) return;

    guestDiv.style.color = '';
    guestDiv.style.background = `url('/glit/${glitterImg}')`;
    guestDiv.style.backgroundSize = 'cover';
    guestDiv.style.filter = 'brightness(1.5) contrast(1.5)';
    guestDiv.style.backgroundClip = 'text';
    guestDiv.style.webkitBackgroundClip = 'text';
    guestDiv.style.webkitTextFillColor = 'transparent';

    currentGlitter = glitterImg;
    guestDiv.dataset.userGlitter = glitterImg;
}


// ✔️ Socket: učitaj sve glittere
socket.on('allGlitters', (glitters) => {
    savedGlitters = glitters;
    for (const nickname in glitters) {
        applyGlitter(nickname, glitters[nickname]);
    }
});


// ✔️ Socket: promene uživo
socket.on('glitterChange', (data) => {
    applyGlitter(data.nickname, data.glitter);
});
