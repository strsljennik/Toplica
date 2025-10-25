let images = [];

document.getElementById('addImage').addEventListener('click', function () {
    // Proveri da li vec postoji prompt
    if (document.getElementById("imgprompt")) return;

    let wrapper = document.createElement("div");
    wrapper.id = "imgprompt";
    wrapper.style.position = "fixed";
    wrapper.style.top = "30px";   // malo niže od background prompta
    wrapper.style.left = "100px";
    wrapper.style.background = "black";
    wrapper.style.padding = "10px";
    wrapper.style.borderRadius = "8px";

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Unesi URL Slike";
    input.style.padding = "5px";
    input.style.marginRight = "10px";

    let okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.style.background = "white";
    okBtn.style.color = "black";
    okBtn.style.fontWeight = "bold";
    okBtn.style.padding = "5px 10px";
    okBtn.style.border = "none";
    okBtn.style.cursor = "pointer";
    okBtn.style.boxShadow = "0 0 10px white, 0 0 20px white"; // neon efekat
    okBtn.style.borderRadius = "4px";

    wrapper.appendChild(input);
    wrapper.appendChild(okBtn);
    document.body.appendChild(wrapper);

    function applyImage() {
        const imageSource = input.value.trim();
        if (imageSource) {
            const position = { x: 100, y: 300 };
            const dimensions = { width: 200, height: 200 };
            socket.emit('add-image', imageSource, position, dimensions);
        } else {
            alert('URL slike nije unet.');
        }
        wrapper.remove(); // zatvori prompt
    }

    okBtn.addEventListener("click", applyImage);

    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            applyImage();
        }
    });
});

socket.on('display-image', (data) => {
    addImageToDOM(data.imageUrl, data.position, data.dimensions, data.id);
});

socket.on('initial-images', (images) => {
    images.forEach((imageData) => {
        addImageToDOM(imageData.imageUrl, imageData.position, imageData.dimensions, imageData.id);
    });
});

socket.on('update-images', (updatedImages) => {
    document.querySelectorAll('img').forEach(slika => {
        if (slika.id !== "playerCover") {
            slika.remove();
        }
    });

    updatedImages.forEach((imageData) => {
        addImageToDOM(imageData.imageUrl, imageData.position, imageData.dimensions, imageData.id);
    });
});

function addImageToDOM(imageUrl, position, dimensions, id = null) {
    const newImage = document.createElement('img');
    newImage.src = imageUrl;
    newImage.style.width = dimensions.width + 'px';
    newImage.style.height = dimensions.height + 'px';
    newImage.style.position = "absolute";
    newImage.style.left = position.x + 'px';
    newImage.style.top = position.y + 'px';
    newImage.style.zIndex = "3";
    newImage.classList.add('draggable', 'resizable');

    const authorizedUsers = new Set(['Radio Galaksija','ZI ZU', '*___F117___*', '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊', 'Dia']);

    newImage.addEventListener('contextmenu', function (event) {
        event.preventDefault();
        if (authorizedUsers.has(currentUser)) {
            if (confirm("Da li želiš da obrišeš ovu sliku?")) {
                newImage.remove();
                socket.emit('remove-image', newImage.dataset.id);
                // Obriši iz niza images
                images = images.filter(img => img.id !== newImage.dataset.id);
            }
        }
    });

    if (authorizedUsers.has(currentUser)) {
        enableDragAndResize(newImage);
    }

    // Dodavanje u niz za čuvanje
    const imgId = id || ('img-' + Date.now()); // koristi postojeći id ili generiši novi
    newImage.dataset.id = imgId;
    images.push({
        id: imgId,
        src: imageUrl,
        top: position.y + 'px',
        left: position.x + 'px',
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
    });

    document.body.appendChild(newImage);
}

// Funkcija za omogućavanje drag-and-resize funkcionalnosti za sliku
function enableDragAndResize(img) {
    let isResizing = false;
    let resizeSide = null;

    img.style.cursor = 'default';

    img.addEventListener('mousedown', function (e) {
        const rect = img.getBoundingClientRect();
        const borderSize = 10;

        if (e.clientX >= rect.left && e.clientX <= rect.left + borderSize) {
            resizeSide = 'left';
        } else if (e.clientX >= rect.right - borderSize && e.clientX <= rect.right) {
            resizeSide = 'right';
        } else if (e.clientY >= rect.top && e.clientY <= rect.top + borderSize) {
            resizeSide = 'top';
        } else if (e.clientY >= rect.bottom - borderSize && e.clientY <= rect.bottom) {
            resizeSide = 'bottom';
        }

        if (resizeSide) {
            isResizing = true;
            const initialWidth = img.offsetWidth;
            const initialHeight = img.offsetHeight;
            const startX = e.clientX;
            const startY = e.clientY;

            document.onmousemove = function (e) {
                if (isResizing) {
                    if (resizeSide === 'right') {
                        img.style.width = initialWidth + (e.clientX - startX) + 'px';
                    } else if (resizeSide === 'bottom') {
                        img.style.height = initialHeight + (e.clientY - startY) + 'px';
                    } else if (resizeSide === 'left') {
                        const newWidth = initialWidth - (e.clientX - startX);
                        if (newWidth > 10) {
                            img.style.width = newWidth + 'px';
                            img.style.left = rect.left + (e.clientX - startX) + 'px';
                        }
                    } else if (resizeSide === 'top') {
                        const newHeight = initialHeight - (e.clientY - startY);
                        if (newHeight > 10) {
                            img.style.height = newHeight + 'px';
                            img.style.top = rect.top + (e.clientY - startY) + 'px';
                        }
                    }
                }
            };

            document.onmouseup = function () {
                isResizing = false;
                resizeSide = null;
                document.onmousemove = null;
                document.onmouseup = null;

                emitImageUpdate(img);
            };
        } else {
            dragMouseDown(e);
        }
    });

    function dragMouseDown(e) {
        e.preventDefault();
        let pos3 = e.clientX;
        let pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = function (e) {
            img.style.top = (img.offsetTop - (pos4 - e.clientY)) + 'px';
            img.style.left = (img.offsetLeft - (pos3 - e.clientX)) + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;
        };
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        emitImageUpdate(img);
    }
}

// Funkcija za emitovanje podataka o slici (pozicija i dimenzije)
function emitImageUpdate(img) {
    const position = { x: img.offsetLeft, y: img.offsetTop };
    const dimensions = { width: img.offsetWidth, height: img.offsetHeight };
    const imageUrl = img.src;

    updateImageOnServer(img.dataset.id, imageUrl, position, dimensions);

    const idx = images.findIndex(i => i.id === img.dataset.id);
    if (idx !== -1) {
        images[idx].top = position.y + 'px';
        images[idx].left = position.x + 'px';
        images[idx].width = dimensions.width + 'px';
        images[idx].height = dimensions.height + 'px';
    }
}

// Funkcija za slanje podataka o slici serveru
function updateImageOnServer(id, imageUrl, position, dimensions) {
    socket.emit('update-image', {
        id: id,
        imageUrl: imageUrl,
        position: position,
        dimensions: dimensions
    });
}

// Funkcija za sinhronizaciju slike sa servera
socket.on('sync-image', (data) => {
    const syncedImage = document.querySelector(`img[data-id="${data.id}"]`);
    if (syncedImage) {
        syncedImage.style.left = data.position.x + 'px';
        syncedImage.style.top = data.position.y + 'px';
        syncedImage.style.width = data.dimensions.width + 'px';
        syncedImage.style.height = data.dimensions.height + 'px';

        const idx = images.findIndex(i => i.id === data.id);
        if (idx !== -1) {
            images[idx].top = data.position.y + 'px';
            images[idx].left = data.position.x + 'px';
            images[idx].width = data.dimensions.width + 'px';
            images[idx].height = data.dimensions.height + 'px';
        }
    }
});
