document.getElementById('smilesBtn').addEventListener('click', () => {
    const smileModal = document.getElementById('smileModal');
    const { bottom, left } = document.getElementById('smilesBtn').getBoundingClientRect();
    
    // Ako je modal trenutno skriven, prikaži ga
     if (smileModal.style.display === 'none' || smileModal.style.display === '') {
        Object.assign(smileModal.style, {
            top: `100px`,                // bliže vrhu ekrana
            left: `50%`,                // centrirano horizontalno
            transform: `translateX(-50%)`,
            zIndex: '1000',
            display: 'flex',
            position: 'fixed',
            width: '90vw',              // širina 90% ekrana
            maxHeight: '80vh',          // visina 80% ekrana
            overflowY: 'auto',
            overflowX: 'auto',
             flexWrap: 'wrap'
        });

        // Učitaj slike iz localStorage
        loadImagesFromLocalStorage();

        // ✅ Dodaj CSS ograničenje veličine slika (ako već nije dodato)
        if (!document.getElementById('smileModalStyle')) {
            const style = document.createElement('style');
            style.id = 'smileModalStyle'; // da ne dodaš duplikate
            style.textContent = `
                #smileModal img {
                    max-width: 100px;
                    max-height: 100px;
                    object-fit: contain;
                }
            `;
            document.head.appendChild(style);
        }

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
<div id="smileModal" style="display:none;position:fixed;width:900px;background:black;padding:10px;border:1px solid white;z-index:1000;overflow-y:auto;overflow-x:auto;border-radius:5px;color:white;flex-wrap:wrap;max-height:600px;">
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
        
        'kj.avifs','tresnja.avifs', 'mesa.webp', 'luster.webp', 'bye.webp', 'crveni.webp','vestica.webp', 
         'box.avifs', 'gal.avifs', 'gal1.avifs','sl.webp', 'slika9.avifs', 'himen.webp',
         'slika10.avifs', 'slika11.avifs','slika12.avifs','slika13.avifs','dia1.gif', 'strumf.avifs',
          'nov6.gif','slika1.avifs', 'slika3.avifs', 'bub.gif', 'ok.gif', 
         'slika6.avifs', 'slika7.avifs', 'nag1.webp', 'ily1.gif', 'ily2.gif', 'beba.gif', 
        'uzivam.gif', 'stik10.png', 'dance.gif', 'dance1.gif', 'jerry3.avifs', 'jerry.webp', 
        'rg.gif', 'x.gif', 'x1.gif', 'kiss.gif', 'kiss1.gif', 'jerry2.avifs', 'srce3.gif', 'srce2.gif', 
        'patak1.avifs', 'patak2.avifs', 'jerry1.avifs', 'nov17.gif', 'nov18.gif', 'nov20.gif',
        'kiss2.gif', 'nov1.gif', 'nov3.gif', 'nov4.gif', 'nov5.gif',  'nov19.gif',
        'nov7.gif', 'nov8.gif', 'nov9.gif', 'nov10.gif', 'nov11.gif', 'nov12.gif', 
        'nov13.gif', 'nov15.gif', 'nov16.gif','nov21.gif','dia.gif','tg.avifs',
        'tre.avifs','tre1.avifs','tre2.avifs','tre.webp'
      
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
                width: "1px",
                height: "1px",
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
        }, 9000); // trajanje animacije 5s
    }
};

// Ograničenja
let lastAnimTime = 0;
let animInProgress = false;

// === Custom modal (za unos i obaveštenja) ===
function showCustomModal(message, options = {}, callback = null, autoClose = false) {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
    });
const box = document.createElement("div");
Object.assign(box.style, {
    background: "black",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #0ff",
    boxShadow: "0 0 15px #0ff",
    textAlign: "center",
    color: "#fff",
    fontFamily: "monospace",
    position: "fixed",        // mora fixed da bi top/left radili u odnosu na viewport
    top: "100px",
    left: "50%",
    transform: "translateX(-50%)", // da bude centriran horizontalno
    minWidth: "300px",
    maxWidth: "90vw",
});

    const label = document.createElement("div");
    label.textContent = message;
    label.style.marginBottom = "15px";
    box.appendChild(label);

    let input = null;
    if (options.input) {
        input = document.createElement("input");
        input.type = "text";
        Object.assign(input.style, {
            padding: "8px",
            background: "black",
            color: "#0ff",
            border: "2px solid #0ff",
            borderRadius: "6px",
            outline: "none",
            boxShadow: "0 0 8px #0ff",
            textAlign: "center",
        });
        box.appendChild(input);
    }

    // Dodajemo X dugme za zatvaranje
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "X";
    Object.assign(closeBtn.style, {
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "red",
        border: "none",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "16px",
    });
    closeBtn.onclick = () => close(null);
    box.appendChild(closeBtn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const close = (val = null) => {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        if (callback) callback(val);
    };

    document.addEventListener("keydown", function handler(e) {
        if (e.key === "Enter") {
            document.removeEventListener("keydown", handler);
            if (options.input && input) {
                close(input.value.trim());
            } else {
                close(null);
            }
        }
    });

    if (input) input.focus();

    if (autoClose) {
        setTimeout(() => {
            close(null);
        }, 5000);
    }
}

// === Trigger animacije ===
const triggerImageAnimation = (imgSrc, codeOverride, nickname, userText, color, gradient, isRemote = false) => {
    // === GLOBALNA BLOKADA AKO ANIMACIJA VEĆ TRAJE ===
    if (animInProgress && !isRemote) {
        showCustomModal("Već je u toku animacija – sačekaj da završi.");
        return;
    }

    // === RATE LIMIT 1 animacija / 5 min za neovlašćene ===
    if (!authorizedUsers.has(nickname || myNickname) && !isRemote) {
        const now = Date.now();
      if (now - lastAnimTime < 5 * 60 * 1000) {
    showCustomModal("Možeš poslati samo 1 animaciju na svakih 5 minuta.", {}, () => {}, true);
    return;
}
 lastAnimTime = now;
    }

    const proceedWithCode = (finalCode) => {
        if (!finalCode) return;

        // uzima samo prvi token (npr. "#1" od "#1    bla")
        finalCode = finalCode.split(/\s+/)[0];
        if (!imageAnimations[finalCode]) return;

        const proceedWithText = (finalText) => {
            const modal = document.getElementById('smileModal');
            if (modal) modal.style.display = 'none';

            if (!codeOverride && !isRemote) {
                socket.emit('imageAnimation', { 
                    src: imgSrc, 
                    code: finalCode, 
                    nickname: nickname || myNickname, 
                    text: finalText, 
                    color: currentColor, 
                    gradient: currentGradient 
                });
            }

            // === START animacije ===
            animInProgress = true;

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
            img.style.maxWidth = "400px";
            img.style.maxHeight = "400px";
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
                color: "#fff",
            });

            // Text ispod nicka
            const textTag = document.createElement("div");
            textTag.innerText = finalText || "";
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
                color: "#fff",
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

            imageAnimations[finalCode](img);

            setTimeout(() => {
                chatContainer.removeChild(animContainer);
                chatContainer.removeChild(nameTag);
                chatContainer.removeChild(textTag);

                // === KRAJ animacije ===
                animInProgress = false;
            }, 9000);
        };

        if (!userText && !isRemote) {
            showCustomModal("Unesi tekst koji želiš da prikažeš:", { input: true }, proceedWithText);
        } else {
            proceedWithText(userText);
        }
    };

    if (!codeOverride && !isRemote) {
        showCustomModal("Unesi kod animacije (#1 - #5):", { input: true }, proceedWithCode);
    } else {
        proceedWithCode(codeOverride);
    }
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
    triggerImageAnimation(data.src, data.code, data.nickname, data.text, data.color, data.gradient, true);
});



