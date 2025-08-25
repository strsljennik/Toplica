// Funkcija za otvaranje/zaključavanje modalnog prozora sa smajlovima
document.getElementById('smilesBtn').addEventListener('click', () => {
    const smileModal = document.getElementById('smileModal');
    const { bottom, left } = document.getElementById('smilesBtn').getBoundingClientRect();
    
    // Ako je modal trenutno skriven, prikaži ga
    if (smileModal.style.display === 'none' || smileModal.style.display === '') {
        Object.assign(smileModal.style, {
            top: `${bottom + 5}px`,
            left: `${left}px`,
            display: 'flex'
        });

        // Učitaj slike iz localStorage
        loadImagesFromLocalStorage();
    } else {
        // Ako je modal otvoren, zatvori ga
        closeSmileModal();
    }
});

// Funkcija za učitavanje slika iz localStorage
const loadImagesFromLocalStorage = () => {
    const smileContainer = document.getElementById('smileContainer');
    smileContainer.innerHTML = ''; // Očisti container pre nego što dodaš nove slike

    const allItems = JSON.parse(localStorage.getItem('emojiData')) || [];
    allItems.forEach(item => {
        const element = document.createElement('span');
        let imgElement;

        if (item.type === 'emoji') {
            element.textContent = item.content;
            element.classList.add('smile');
            element.onclick = () => addSmile(item.content);
        } else if (item.type === 'image') {
            imgElement = document.createElement('img');
            imgElement.src = emojiFolder + item.content;
            imgElement.classList.add('smile');
            imgElement.alt = item.content;
            element.classList.add('smile');
            element.onclick = () => addImageToChat(emojiFolder + item.content);
            element.appendChild(imgElement);
        }

        smileContainer.appendChild(element);
    });
};

// Funkcija za dodavanje emojija u chat
const addSmile = (smile) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += smile;
        closeSmileModal();
    }
};

// Funkcija za dodavanje slike u chat
const addImageToChat = (imgSrc) => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.value += ` <img src="${imgSrc}" alt="emoji"> `;
        closeSmileModal();
    }
};

// Funkcija za zatvaranje modalnog prozora
const closeSmileModal = () => {
    const smileModal = document.getElementById('smileModal');
    if (smileModal) {
        smileModal.style.display = 'none';
    }
};

// Funkcija za ažuriranje localStorage sa novim podacima
const updateLocalStorage = (newItems) => {
    localStorage.setItem('emojiData', JSON.stringify(newItems));
};

// Funkcija za dodavanje novih slika ili emojija u listu
const addNewItemToLocalStorage = (newItem) => {
    // Učitavamo trenutne stavke iz localStorage
    const allItems = JSON.parse(localStorage.getItem('emojiData')) || [];
    
    // Dodajemo novi element (emoji ili sliku)
    allItems.push(newItem);
    
    // Ažuriramo localStorage sa novim podacima
    updateLocalStorage(allItems);

    // Ponovno učitavanje slika u modal
    loadImagesFromLocalStorage();
};

// HTML kod za modal
const smileModalHTML = `
<div id="smileModal" style="display:none;position:fixed;width:300px;background:black;padding:10px;border:1px solid white;z-index:1000;overflow-y:auto;border-radius:5px;color:white;flex-wrap:wrap;max-height:400px;">
    <button onclick="closeSmileModal()" style="background:red;color:white;border:none;padding:5px 10px;cursor:pointer;float:right;">X</button>
    <div id="smileContainer" style="display:flex;flex-wrap:wrap;gap:8px;overflow-y:auto;"></div>
</div>`;

// Dodavanje modala u HTML ako već nije prisutan
if (!document.getElementById('smileModal')) document.body.insertAdjacentHTML('beforeend', smileModalHTML);

// Folder za slike
const emojiFolder = 'emoji gif/';
const allItems = [
    ...['☕', '🖤', '💛', '💚','👀'].map(e => ({ type: 'emoji', content: e })),
    ...[
        
         'mesa.webp', 'luster.webp', 'bye.webp', 'crveni.webp', 'sl.webp', 
         'slika9.avifs', 'slika10.avifs', 'slika11.avifs','slika12.avifs','slika13.avifs',
        'slika1.avifs', 'slika3.avifs', 'slika4.avifs', 'bub.gif', 'ok.gif', 
         'slika5.avifs', 'slika6.avifs', 'slika7.avifs','slika8.avifs', 'nag1.webp', 
        'uzivam.gif', 'stik10.png', 'dance.gif', 'dance1.gif', 'dance2.gif', 
        'dance3.gif', 'ily1.gif', 'ily2.gif', 'beba.gif', 
        'rg.gif', 'x.gif', 'x1.gif', 'kiss.gif', 'kiss1.gif', 
        'patak1.avifs', 'patak2.avifs', 'jerry1.avifs', 'jerry2.avifs', 'jerry3.avifs', 'jerry.webp', 
        'mx.avifs', 'kiss2.gif', 'srce2.gif', 'srce3.gif', 'srce4.gif', 
  'nov1.gif', 'nov3.gif', 'nov4.gif', 'nov5.gif', 'nov6.gif', 
  'nov7.gif', 'nov8.gif', 'nov9.gif', 'nov10.gif', 'nov11.gif', 'nov12.gif', 
  'nov13.gif', 'nov15.gif', 'nov16.gif', 'nov17.gif', 'nov18.gif', 
           'nov19.gif', 'nov20.gif', 'nov21.gif'
].map(img => ({ type: 'image', content: img }))
];

console.log(allItems); // Proveri da li su svi podaci pravilno učitani

// Čuvanje slika u localStorage
const saveImagesToLocalStorage = () => {
    localStorage.setItem('emojiData', JSON.stringify(allItems));
};

// Pozivamo funkciju da sačuvamo slike u localStorage
saveImagesToLocalStorage();


// === Nezavisne animacije za slike iz modala ===
const imageAnimations = {
    "#1": (img) => {
        img.style.transform = "scale(0)";
        img.style.transition = "transform 5s ease-out";
        setTimeout(() => {
            img.style.transform = "scale(3)";
        }, 50);
    },
    "#2": (img) => {
        img.style.transform = "rotate(0deg) scale(0)";
        img.style.transition = "transform 5s ease-in-out";
        setTimeout(() => {
            img.style.transform = "rotate(360deg) scale(2)";
        }, 50);
    },
    "#3": (img) => {
        img.style.transform = "translate(-50%, -50%) scale(0)";
        img.style.transition = "transform 5s cubic-bezier(0.68,-0.55,0.27,1.55)";
        setTimeout(() => {
            img.style.transform = "translate(-50%, -50%) scale(2.5)";
        }, 50);
    },
    "#4": (img) => {
        img.style.transform = "scale(0)";
        img.style.transition = "transform 5s ease-in";
        setTimeout(() => {
            img.style.transform = "scale(4)";
        }, 50);
    },
    "#5": (img) => {
        img.style.transform = "scale(0)";
        img.style.transition = "transform 5s linear";
        setTimeout(() => {
            img.style.transform = "scale(3.5)";
        }, 50);
    },
    "#6": (img) => {
        img.style.opacity = "0";
        img.style.transition = "opacity 3s ease-in-out";
        setTimeout(() => {
            img.style.opacity = "1";
        }, 50);

        // dodaj sjajne tačkice direktno u animContainer
        const animContainer = img.parentElement;
        for (let i = 0; i < 50; i++) {
            const dot = document.createElement("div");
            Object.assign(dot.style, {
                position: "absolute",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "white",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: "0",
                boxShadow: "0 0 8px white"
            });
            animContainer.appendChild(dot);

            setTimeout(() => {
                dot.style.transition = "opacity 0.5s ease-in-out";
                dot.style.opacity = "1";
                setTimeout(() => {
                    dot.style.opacity = "0";
                }, 1500 + Math.random() * 1000);
            }, Math.random() * 2000);
        }
    },
    "#7": (img) => {
        img.style.transform = "scale(0)";
        img.style.transition = "transform 5s ease-out";
        setTimeout(() => {
            img.style.transform = "scale(2)";
        }, 50);

        // lepršava zastava efekat
        let angle = 0;
        const flap = setInterval(() => {
            angle = Math.sin(Date.now() / 200) * 10; // oscilacija -10° do 10°
            img.style.transform = `scale(2) rotate(${angle}deg)`;
        }, 30);

        setTimeout(() => {
            clearInterval(flap);
            img.style.transform = "scale(2) rotate(0deg)";
        }, 5000); // trajanje animacije 5s
    }
};

const triggerImageAnimation = (imgSrc, codeOverride, nickname, userText, color, gradient) => {
    const code = codeOverride || prompt("Unesi kod animacije (#1 - #5):");
    if (!code || !imageAnimations[code]) return;

    if (!userText) {
        userText = prompt("Unesi tekst koji želiš da prikažeš:");
    }

    const modal = document.getElementById('smileModal');
    if (modal) modal.style.display = 'none';

    if (!codeOverride) {
        socket.emit('imageAnimation', { 
            src: imgSrc, 
            code: code, 
            nickname: nickname || myNickname, 
            text: userText, 
            color: currentColor, 
            gradient: currentGradient 
        });
    }

    const chatContainer = document.getElementById('chatContainer');
    const animContainer = document.createElement("div");
    Object.assign(animContainer.style, {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: "9999",
        textAlign: "center",
    });

    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.maxWidth = "600px";
    img.style.maxHeight = "600px";
    img.style.display = "block";
    animContainer.appendChild(img);
    chatContainer.appendChild(animContainer);

    // Nickname na dnu
    const nameTag = document.createElement("div");
    nameTag.innerText = nickname || myNickname;
    Object.assign(nameTag.style, {
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: "24px",
        zIndex: "10000",
        pointerEvents: "none",
    });

    // Text ispod nicka
    const textTag = document.createElement("div");
    textTag.innerText = userText;
    Object.assign(textTag.style, {
        position: "absolute",
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        fontWeight: "bold",
        fontStyle: "italic",
        fontSize: "20px",
        zIndex: "10000",
        pointerEvents: "none",
    });

    const divId = `guest-${nickname || myNickname}`;
    const userDiv = document.getElementById(divId);

    if (color) {
        nameTag.style.color = color;
        textTag.style.color = color;
    } else if (gradient || (userDiv && userDiv.classList.contains('use-gradient'))) {
        const gradientClass = gradient || (userDiv ? Array.from(userDiv.classList).find(c => c.startsWith('gradient-')) : null);
        if (gradientClass) {
            const bg = getComputedStyle(document.querySelector(`.${gradientClass}`)).backgroundImage;
            [nameTag, textTag].forEach(tag => {
                tag.style.backgroundImage = bg;
                tag.style.backgroundClip = 'text';
                tag.style.webkitBackgroundClip = 'text';
                tag.style.webkitTextFillColor = 'transparent';
            });
        }
    }

    chatContainer.appendChild(nameTag);
    chatContainer.appendChild(textTag);

    imageAnimations[code](img);

    setTimeout(() => {
        chatContainer.removeChild(animContainer);
        chatContainer.removeChild(nameTag);
        chatContainer.removeChild(textTag);
    }, 9000);
};

// Desni klik
document.getElementById('smileContainer').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = e.target.closest('img');
    if (target) {
        triggerImageAnimation(target.src);
    }
});

// Socket listener
socket.on('imageAnimation', (data) => {
    triggerImageAnimation(data.src, data.code, data.nickname, data.text, data.color, data.gradient);
});
