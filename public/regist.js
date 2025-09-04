let currentUser = null;

// ===== Custom prompt funkcije =====
let __promptHost = null;
function promptHost() {
    if (!__promptHost) {
        __promptHost = document.createElement('div');
        Object.assign(__promptHost.style, {
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: '99999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none',
        });
        document.body.appendChild(__promptHost);
    }
    return __promptHost;
}

function showPrompt(msg, opts = {}) {
    const duration = opts.duration ?? 3000;

    const box = document.createElement('div');
    Object.assign(box.style, {
        background: '#000',
        color: '#fff',
        fontWeight: '800',
        fontStyle: 'italic',
        padding: '12px 14px',
        borderRadius: '10px',
        boxShadow: '0 0 18px rgba(255,255,255,0.25), inset 0 0 6px rgba(255,255,255,0.15)',
        textShadow: '0 0 6px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.2)',
        maxWidth: '340px',
        pointerEvents: 'auto',
        opacity: '0',
        transform: 'translateY(-6px)',
        transition: 'opacity 160ms ease, transform 160ms ease',
        backdropFilter: 'blur(2px)',
    });
    box.textContent = msg;

    box.addEventListener('click', () => remove());

    const host = promptHost();
    host.appendChild(box);

    requestAnimationFrame(() => {
        box.style.opacity = '1';
        box.style.transform = 'translateY(0)';
    });

    function remove() {
        box.style.opacity = '0';
        box.style.transform = 'translateY(-6px)';
        setTimeout(() => {
            host.removeChild(box);
        }, 180);
    }

    setTimeout(remove, duration);
}

// ===== Funkcija za prikaz auth diva =====
function showAuthContainer() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.style.display = 'block';
    }
}

// ===== Funkcija za sakrivanje auth diva =====
function hideAuthContainer() {
    const authContainer = document.getElementById('authContainer');
    if (authContainer) {
        authContainer.style.display = 'none';
    }
}

// ===== Registracija korisnika =====
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            showPrompt('Registracija uspešna');
            this.reset();
        } else {
            showPrompt('Greška pri registraciji');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showPrompt('Došlo je do greške. Pokušajte ponovo.');
    });
});

// ===== Prijava korisnika =====
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-socket-id': socket.id
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            showPrompt('Prijava uspešna');
            socket.emit('userLoggedIn', username);
            this.reset();
            hideAuthContainer(); // sakrij div, ne uklanjaj ga
        } else {
            showPrompt('Nevažeći podaci za prijavu');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showPrompt('Došlo je do greške. Pokušajte ponovo.');
    });
});

// ===== Socket.IO događaji =====
socket.on('userLoggedIn', (data) => {
    currentUser = data.username;
    myNickname = data.username;
    window.currentUser = { username: data.username };
    console.log("Prijavljeni korisnik:", currentUser);

    // Sakrij authContainer, ne uklanjaj ga
    hideAuthContainer();

    if (data.role === 'admin') enableAdminFeatures();
    else enableGuestFeatures();
});

socket.on('setNickname', (nickname) => {
    console.log('Dobijen nadimak:', nickname);
    currentUser = nickname;
    myNickname = nickname;
    window.currentUser = { username: nickname };
    enableGuestFeatures();
});

// ===== Funkcije za funkcionalnosti =====
function enableAdminFeatures() {
    console.log("Admin funkcionalnosti omogućene!");
}

function enableGuestFeatures() {
    console.log("Gost funkcionalnosti omogućene!");
}
