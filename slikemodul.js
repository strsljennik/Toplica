let io;
let newImage = [];
let userImages = {}; // Mapa korisničkih slika
const authorizedUsers = new Set(['Radio Galaksija','R-Galaksija', 'ZI ZU', '*___F117___*', '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊', 'Dia']);

// Funkcija za setovanje io objekta
function setSocket(serverIo) {
    io = serverIo;

    io.on('connection', (socket) => {
        userImages[socket.id] = []; // Inicializacija korisničkih slika

        socket.emit('initial-images', newImage);

        socket.on('add-image', (imageSource, position, dimensions) => {
            if (!imageSource || !position || !dimensions) return;

            const id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000); // jedinstveni ID
            const image = {
                id,
                imageUrl: imageSource,
                position: position,
                dimensions: dimensions
            };

            newImage.push(image);
            userImages[socket.id].push(image);

            io.emit('display-image', image);
        });

        socket.on('update-image', (data) => {
            const image = newImage.find(img => img.id === data.id);
            if (image) {
                image.position = data.position;
                image.dimensions = data.dimensions;
            }
            io.emit('sync-image', data);
        });

        socket.on('remove-image', (id) => {
            const index = newImage.findIndex(img => img.id === id);
            if (index !== -1) {
                newImage.splice(index, 1);
                userImages[socket.id] = userImages[socket.id].filter(img => img.id !== id);
            }
            io.emit('update-images', newImage);
        });

        socket.on('delete-all', (username) => {
            if (authorizedUsers.has(username)) { 
                newImage = []; // Briše sve slike
                userImages = {}; // Briše sve korisničke slike
                io.emit('update-images', newImage);
            } else {
                socket.emit('error', 'Nemate privilegije da obrišete slike!');
            }
        });
    });
}

// Izvoz funkcije setSocket
module.exports = { setSocket };
