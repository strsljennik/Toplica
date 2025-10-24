// ================= BAN SISTEM =================

// helperi za sakrivanje i prikaz messageArea
function hideMessageArea() {
    const el = document.getElementById('messageArea');
    if (!el) return;
    el.dataset._wasVisible = getComputedStyle(el).display !== 'none';
    el.style.display = 'none';
}

function showMessageArea() {
    const el = document.getElementById('messageArea');
    if (!el) return;
    el.style.display = (el.dataset._wasVisible === 'true') ? '' : 'block';
    delete el.dataset._wasVisible;
}

// Event delegation za dvoklik na goste
document.addEventListener('dblclick', function(e) {
    const target = e.target.closest('.guest');
    if (!target) return;

    if (typeof currentUser === 'undefined' || !authorizedUsers.has(currentUser)) {
        console.log('[BAN-SYSTEM] Trenutni korisnik nije admin, dvoklik ne radi.');
        return;
    }

    const nickname = target.textContent.trim();
    console.log(`[BAN-SYSTEM] Kliknuti gost: ${nickname}`);

    if (nickname === '*__X__*') {
        console.log('[BAN-SYSTEM] Ovaj korisnik se ne može banovati.');
        return;
    }

    const banId = target.dataset.banid;
    if (!banId) {
        console.log('[BAN-SYSTEM] Nema banId u div-u.');
        return;
    }

    if (target.classList.contains('banned')) {
        console.log(`[BAN-SYSTEM] Odbanovanje korisnika sa banId: ${banId}`);
        socket.emit('unban-user', banId);

        if (currentUser === nickname) {
            console.log('[BAN-SYSTEM] Ja sam odbanovan, otključavam sajt.');
            localStorage.removeItem('banid');
            document.body.style.pointerEvents = 'auto';
            document.body.style.backgroundColor = '';
            showMessageArea();
        }
    } else {
        console.log(`[BAN-SYSTEM] Banovanje korisnika sa banId: ${banId}`);
        socket.emit('ban-user', banId);

        if (currentUser === nickname) {
            console.log('[BAN-SYSTEM] Ja sam banovan, odmah blokiram ceo sajt.');
            localStorage.setItem('banid', banId);
            document.body.style.pointerEvents = 'none';
            document.body.style.backgroundColor = 'black';
            hideMessageArea();
        }
    }
});

// ================= BAN/UNBAN VIZUAL =================
socket.on('user-banned', function(banId) {
    console.log(`[BAN-SYSTEM] Server javi: korisnik banovan banId=${banId}`);
    const userDiv = document.querySelector(`[data-banid="${banId}"]`);
    if (!userDiv) return;

    userDiv.classList.add('banned');
    userDiv.style.position = 'relative';

    let overlay = userDiv.querySelector('.ban-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'ban-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(255,0,0,0.5)';
        overlay.style.pointerEvents = 'none';
        overlay.style.borderRadius = '4px';
        userDiv.appendChild(overlay);
    }

    if (currentUser && currentUser === userDiv.textContent.trim()) {
        console.log('[BAN-SYSTEM] Ja sam banovan (server event), odmah blokiram sajt.');
        localStorage.setItem('banid', banId);
        document.body.style.pointerEvents = 'none';
        document.body.style.backgroundColor = 'black';
        hideMessageArea();
    }
});

socket.on('user-unbanned', function(banId) {
    console.log(`[BAN-SYSTEM] Server javi: korisnik odbanovan banId=${banId}`);
    const userDiv = document.querySelector(`[data-banid="${banId}"]`);
    if (!userDiv) return;

    userDiv.classList.remove('banned');
    const overlay = userDiv.querySelector('.ban-overlay');
    if (overlay) overlay.remove();

    if (currentUser && currentUser === userDiv.textContent.trim()) {
        console.log('[BAN-SYSTEM] Ja sam odbanovan, otključavam sajt.');
        localStorage.removeItem('banid');
        document.body.style.pointerEvents = 'auto';
        document.body.style.backgroundColor = '';
        showMessageArea();
    }
});

// ================= PROVERA PRI UČITAVANJU =================
window.addEventListener('load', () => {
    const banId = localStorage.getItem('banid');
    if (!banId) return;

    console.log('[BAN-SYSTEM] Lokalni banId pronađen pri učitavanju, blokiram sajt.');
    document.body.style.pointerEvents = 'none';
    document.body.style.backgroundColor = 'black';
    hideMessageArea();
});
