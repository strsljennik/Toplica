const animations = {
  rotateLetters: `@keyframes rotateLetters {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(360deg); }
  }
  .rotate-letter {
    display: inline-block;
    animation-name: rotateLetters;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }`,

  glowBlink: `@keyframes glowBlink {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .glow-letter {
    display: inline-block;
    animation-name: glowBlink;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`,

  fadeInOut: `@keyframes fadeInOut {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  .fade-letter {
    display: inline-block;
    animation-name: fadeInOut;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`,

  bounce: `@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  .bounce-letter {
    display: inline-block;
    animation-name: bounce;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }`,

  superCombo: `@keyframes superCombo {
    0%   { transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) skew(0deg,0deg); opacity: 1; }
    10%  { transform: translateY(-4px) rotateX(15deg) rotateY(5deg) rotateZ(-5deg) scale(1.05) skew(2deg,-2deg); opacity: 0.9; }
    20%  { transform: translateY(5px) rotateX(-15deg) rotateY(-5deg) rotateZ(5deg) scale(1.1) skew(-2deg,2deg); opacity: 0.95; }
    30%  { transform: translateY(-5px) rotateX(20deg) rotateY(10deg) rotateZ(-10deg) scale(1.08) skew(1deg,-1deg); opacity: 1; }
    40%  { transform: translateY(3px) rotateX(-20deg) rotateY(-10deg) rotateZ(8deg) scale(1.12) skew(-1deg,1deg); opacity: 0.9; }
    50%  { transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) skew(0deg,0deg); opacity: 1; }
    60%  { transform: translateY(-4px) rotateX(12deg) rotateY(6deg) rotateZ(-6deg) scale(1.07) skew(2deg,-2deg); opacity: 0.95; }
    70%  { transform: translateY(4px) rotateX(-12deg) rotateY(-6deg) rotateZ(6deg) scale(1.09) skew(-2deg,2deg); opacity: 0.9; }
    80%  { transform: translateY(-3px) rotateX(15deg) rotateY(5deg) rotateZ(-4deg) scale(1.06) skew(1deg,-1deg); opacity: 1; }
    90%  { transform: translateY(3px) rotateX(-15deg) rotateY(-5deg) rotateZ(4deg) scale(1.08) skew(-1deg,1deg); opacity: 0.95; }
    100% { transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1) skew(0deg,0deg); opacity: 1; }
  }
  .superCombo-letter {
    display: inline-block;
    transform-origin: center center;
    animation-name: superCombo;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }`,

  guestGradientGlow: `@keyframes guestGradientGlow {
    0% { background-position: 0% center; filter: brightness(1.5) saturate(1.5); }
    50% { background-position: 50% center; filter: brightness(2.5) saturate(2.5); }
    100% { background-position: 100% center; filter: brightness(1.5) saturate(1.5); }
  }
  .guest-gradient-anim {
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    animation-name: guestGradientGlow;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }`
};
const animationAuthorizedUsers = new Set(['Radio Galaksija','R-Galaksija','ZI ZU','*___F117___*','*__X__*','Dia💎','Dia', 'Najlepsa Ciganka',',,Sandra,,','_L i l i_','ViRuS_LiLi','𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊']);
let allUserAnimations = {};
let currentAnimation = null;
let animationSpeed = 2;

const nikBtn = document.getElementById('nik');
const popnik = document.createElement('div');
popnik.id = 'popnik';
popnik.style.position = 'absolute';
popnik.style.top = '50px';
popnik.style.left = '50px';
popnik.style.background = 'black';
popnik.style.padding = '5px';
popnik.style.border = '1px solid #fff';
popnik.style.zIndex = 1000;
popnik.style.display = 'none';

// Dodaj širinu i visinu
popnik.style.width = '300px';
popnik.style.height = '300px';

document.body.appendChild(popnik);


// ===== Custom aniprompt =====
const aniprompt = document.createElement('div');
aniprompt.style.position = 'fixed';
aniprompt.style.top = '50%';
aniprompt.style.left = '50%';
aniprompt.style.transform = 'translate(-50%, -50%)';
aniprompt.style.background = '#000';
aniprompt.style.border = '2px solid #fff'; // bele neon linije
aniprompt.style.padding = '20px';
aniprompt.style.zIndex = 10000;
aniprompt.style.display = 'none';
aniprompt.style.color = '#fff';
aniprompt.style.fontFamily = 'monospace';
aniprompt.style.textAlign = 'center';
aniprompt.style.borderRadius = '10px';
aniprompt.style.boxShadow = '0 0 10px #fff, 0 0 20px #fff';

const input = document.createElement('input');
input.type = 'password';
input.placeholder = 'Unesi lozinku';
input.style.padding = '10px';
input.style.marginTop = '10px';
input.style.border = '1px solid #fff';
input.style.background = '#000';
input.style.color = '#fff';
input.style.outline = 'none';
input.style.width = '200px';
input.style.fontFamily = 'monospace';
aniprompt.appendChild(input);

// dugme za zatvaranje prompta
const closeBtn = document.createElement('button');
closeBtn.textContent = 'Zatvori';
closeBtn.style.marginTop = '10px';
closeBtn.style.padding = '5px 12px';
closeBtn.style.cursor = 'pointer';
closeBtn.onclick = () => {
    aniprompt.style.display = 'none';
};
aniprompt.appendChild(closeBtn);

document.body.appendChild(aniprompt);

function showAniprompt(correctPassword, callback) {
    aniprompt.style.display = 'block';
    input.value = '';
    input.focus();

    function keyHandler(e) {
        if (e.key === 'Enter') {
            if (input.value === correctPassword) {
                aniprompt.style.display = 'none';
                input.removeEventListener('keydown', keyHandler);
                callback(true);
            } else {
                input.value = '';
                input.focus();
                input.style.border = '1px solid red';
                setTimeout(() => input.style.border = '1px solid #fff', 300);
            }
        }
    }

    input.addEventListener('keydown', keyHandler);
}

// ===== Animacije =====
function injectAnimationStyles() {
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = Object.values(animations).join('\n');
    document.head.appendChild(style);
  }
}
injectAnimationStyles();

let popnikOpen = false;
let isAuthorized = false;

nikBtn.addEventListener('click', () => {

    // Ako je korisnik u grupi sa dozvolom
    if (animationAuthorizedUsers.has(myNickname)) {

        // TOGGLE
        if (!popnikOpen) {
            popnik.style.display = 'block';
            popnikOpen = true;
        } else {
            popnik.style.display = 'none';
            popnikOpen = false;
        }

        return; // završi klik
    }

    // Ako NIJE autorizovan → još nema lozinku
    if (!isAuthorized) {

        showAniprompt('lsx', (success) => {

            if (success) {
                isAuthorized = true;

                // Prvi put posle lozinke → otvori
                popnik.style.display = 'block';
                popnikOpen = true;
            }
        });

        return; // završi klik
    }

    // Ako korisnik ima lozinku → normalan toggle
    if (!popnikOpen) {
        popnik.style.display = 'block';
        popnikOpen = true;
    } else {
        popnik.style.display = 'none';
        popnikOpen = false;
    }
});


  // rotateLetters dugme
  const btnRotate = document.createElement('button');
  btnRotate.textContent = 'rotateLetters';
  btnRotate.style.margin = '5px';
  btnRotate.style.padding = '5px 12px';
  btnRotate.style.cursor = 'pointer';
  btnRotate.onclick = () => {
    currentAnimation = 'rotateLetters';
    applyAnimationToNick(myNickname, 'rotateLetters', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'rotateLetters',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnRotate);

  // glowBlink dugme
  const btnGlow = document.createElement('button');
  btnGlow.textContent = 'glowBlink';
  btnGlow.style.margin = '5px';
  btnGlow.style.padding = '5px 12px';
  btnGlow.style.cursor = 'pointer';
  btnGlow.onclick = () => {
    currentAnimation = 'glowBlink';
    applyAnimationToNick(myNickname, 'glowBlink', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'glowBlink',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnGlow);

  // fadeInOut dugme
  const btnFade = document.createElement('button');
  btnFade.textContent = 'fadeInOut';
  btnFade.style.margin = '5px';
  btnFade.style.padding = '5px 12px';
  btnFade.style.cursor = 'pointer';
  btnFade.onclick = () => {
    currentAnimation = 'fadeInOut';
    applyAnimationToNick(myNickname, 'fadeInOut', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'fadeInOut',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnFade);

  // bounce dugme
  const btnBounce = document.createElement('button');
  btnBounce.textContent = 'bounce';
  btnBounce.style.margin = '5px';
  btnBounce.style.padding = '5px 12px';
  btnBounce.style.cursor = 'pointer';
  btnBounce.onclick = () => {
    currentAnimation = 'bounce';
    applyAnimationToNick(myNickname, 'bounce', animationSpeed);
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: 'bounce',
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(btnBounce);

// superCombo dugme
const btnSuperCombo = document.createElement('button');
btnSuperCombo.textContent = 'superCombo';
btnSuperCombo.style.margin = '5px';
btnSuperCombo.style.padding = '5px 12px';
btnSuperCombo.style.cursor = 'pointer';
btnSuperCombo.onclick = () => {
  currentAnimation = 'superCombo';
  applyAnimationToNick(myNickname, 'superCombo', animationSpeed);
  socket.emit('animationChange', {
    nickname: myNickname,
    animation: 'superCombo',
    speed: animationSpeed
  });
  popnik.style.display = 'none';
};
popnik.appendChild(btnSuperCombo);

const btnGuestGradient = document.createElement('button');
btnGuestGradient.textContent = 'Sjajni Gradijent';
btnGuestGradient.style.margin = '5px';
btnGuestGradient.style.padding = '5px 12px';
btnGuestGradient.style.cursor = 'pointer';
btnGuestGradient.onclick = () => {
    currentAnimation = 'guestGradientGlow';
    applyAnimationToNick(myNickname, 'guestGradientGlow', animationSpeed); // primeni lokalno
    socket.emit('animationChange', { // pošalji svima
        nickname: myNickname,
        animation: 'guestGradientGlow',
        speed: animationSpeed
    });
    popnik.style.display = 'none';
 };
popnik.appendChild(btnGuestGradient);

// Kreiraj samo dugme unutar popnik
const glitterBtn = document.createElement('button');
glitterBtn.id = 'glit';
glitterBtn.textContent = 'glitter';
glitterBtn.style.margin = '5px';
glitterBtn.style.padding = '5px 12px';
glitterBtn.style.cursor = 'pointer';

// Dodaj dugme u popnik
popnik.appendChild(glitterBtn);

// Toggle event listener
glitterBtn.addEventListener('click', () => {
    // Ako tabla nije kreirana, kreiraj je (samo jednom)
    if (!glitterTable) createGlitterTable();

    // Toggle prikaza
    glitterTable.style.display = glitterTable.style.display === 'none' ? 'block' : 'none';

   });

 // Slider za brzinu animacije
  const speedLabel = document.createElement('label');
  speedLabel.textContent = `Brzina animacije: ${animationSpeed}s`;
  speedLabel.style.display = 'block';
  speedLabel.style.color = '#fff';
  speedLabel.style.marginTop = '10px';

  const speedInput = document.createElement('input');
  speedInput.type = 'range';
  speedInput.min = 1;
  speedInput.max = 20;
  speedInput.step = 0.1;
  speedInput.value = animationSpeed;
  speedInput.style.width = '100%';

  speedInput.oninput = () => {
    animationSpeed = parseFloat(speedInput.value);
    speedLabel.textContent = `Brzina animacije: ${animationSpeed}s`;
    if (currentAnimation) {
      applyAnimationToNick(myNickname, currentAnimation, animationSpeed);
    }
  };

  popnik.appendChild(speedLabel);
  popnik.appendChild(speedInput);

  // Dugme za stop animacije
  const stopBtn = document.createElement('button');
  stopBtn.textContent = 'Iskljuci Animaciju';
  stopBtn.style.marginTop = '10px';
  stopBtn.style.padding = '5px 12px';
  stopBtn.style.cursor = 'pointer';
  stopBtn.onclick = () => {
    currentAnimation = null;
    const userDiv = document.getElementById(`guest-${myNickname}`);
    if (!userDiv) return;
    userDiv.style.animation = 'none';
    userDiv.innerHTML = userDiv.textContent;
    socket.emit('animationChange', {
      nickname: myNickname,
      animation: null,
      speed: animationSpeed
    });
    popnik.style.display = 'none';
  };
  popnik.appendChild(stopBtn);

function applyAnimationToNick(nickname, animationName, speed = animationSpeed) {
    const userDiv = document.getElementById(`guest-${nickname}`);
    if (!userDiv) return;

    // Resetuj prethodnu animaciju
    userDiv.style.animation = 'none';
    userDiv.innerHTML = userDiv.textContent || userDiv.innerText;

    // Provera da li korisnik ima gradijent
    const isGradient = Array.from(userDiv.classList).some(cls => cls.startsWith('gradient-'));
    const isGuestGradientAnim = userDiv.classList.contains('guest-gradient-anim');

    if (isGuestGradientAnim) {
        // Animacija sjajnog gradijenta samo za guest listu
        userDiv.style.animationName = 'guestGradientGlow';
        userDiv.style.animationDuration = `1s`;
        userDiv.style.animationIterationCount = 'infinite';
        userDiv.style.animationTimingFunction = 'ease-in-out';
        return;
    }

    // --- Ako korisnik ima gradijent, dodaj originalnu animaciju + guestGradientGlow (gradijent je konstantno 1s) ---
    if (isGradient) {
        userDiv.style.animationName = `${animationName}, guestGradientGlow`;
        userDiv.style.animationDuration = `${speed}s, 1s`;
        userDiv.style.animationIterationCount = 'infinite, infinite';
        userDiv.style.animationTimingFunction = 'ease-in-out, ease-in-out';
        return;
    }

    // --- JS animacija po slovima za obične korisnike ---
    const text = userDiv.textContent || userDiv.innerText;
    userDiv.innerHTML = '';

    const problematicChars = [
        ' ', '*', '(', ')', '-', '_', '[', ']', '{', '}', '^', '$', '#', '@',
        '!', '+', '=', '~', '`', '|', '\\', '/', '<', '>', ',', '.', '?', ':', ';', '"', "'"
    ];

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (problematicChars.includes(char)) {
            userDiv.appendChild(document.createTextNode(char));
        } else {
            const span = document.createElement('span');
            span.textContent = char;

            if (animationName === 'rotateLetters') span.classList.add('rotate-letter');
            else if (animationName === 'glowBlink') span.classList.add('glow-letter');
            else if (animationName === 'fadeInOut') span.classList.add('fade-letter');
            else if (animationName === 'bounce') span.classList.add('bounce-letter');
            else if (animationName === 'superCombo') span.classList.add('superCombo-letter');

            span.style.animationDuration = `${speed}s`;
            span.style.animationIterationCount = 'infinite';
            span.style.animationDelay = `${i * 0.1}s`;

            // Ako je gradijent, dodaj guestGradientGlow klasu
            if (isGradient) span.classList.add('guest-gradient-anim');

            userDiv.appendChild(span);
        }
    }

    if (animationName === 'rotateLetters') {
        const spans = userDiv.querySelectorAll('.rotate-letter');
        let completedSpans = 0;
        spans.forEach(span => {
            span.addEventListener('animationend', () => {
                completedSpans++;
                if (completedSpans === spans.length) {
                    setTimeout(() => {
                        if (currentAnimation === 'rotateLetters') {
                            applyAnimationToNick(nickname, animationName, speed);
                        }
                    }, 15000);
                }
            });
        });
    }
}

function applyAnimationToNickWhenReady(nickname, animation, speed) {
    const tryApply = () => {
        const userDiv = document.getElementById(`guest-${nickname}`);
        if (userDiv) {
            applyAnimationToNick(nickname, animation, speed);
        } else {
            setTimeout(tryApply, 500);
        }
    };
    tryApply();
}

// --- Socket deo ---
socket.on('animationChange', data => {
    if (data && typeof data.nickname === 'string') {
        if (data.animation) {
            allUserAnimations[data.nickname] = {
                animation: data.animation,
                speed: data.speed || 2
            };
        } else {
            delete allUserAnimations[data.nickname];
        }
    }

    currentAnimation = data.animation;
    animationSpeed = data.speed || 2;
    applyAnimationToNickWhenReady(data.nickname, data.animation, animationSpeed);
});

socket.on('currentAnimations', (allAnimations) => {
    if (allAnimations && typeof allAnimations === 'object') {
        allUserAnimations = allAnimations;
    } else {
        allUserAnimations = {};
    }

    for (const [nickname, info] of Object.entries(allUserAnimations)) {
        const animation = info && info.animation ? info.animation : null;
        const speed = info && info.speed ? info.speed : 2;
        applyAnimationToNickWhenReady(nickname, animation, speed);
    }
});

