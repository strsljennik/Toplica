document.addEventListener('DOMContentLoaded', function() {
const authorizedUsers = new Set(['Radio Galaksija','R-Galaksija', 'ZI ZU', '*___F117___*', '*__X__*', '𝕯𝖔𝖈𝖙𝖔𝖗 𝕷𝖔𝖛𝖊', 'Dia']);
  let activeDiv = null;

  function isAuthorized() {
    return authorizedUsers.has(currentUser);
  }

  function setupDragAndResize(element) {
    let isDragging = false;
    let isResizing = false;
    let resizeDir = '';
    let offsetX = 0;
    let offsetY = 0;
    let active = false;

    element.style.position = 'absolute';
    element.style.left = element.style.left || '100px';
    element.style.top = element.style.top || '100px';
    element.style.boxSizing = 'border-box';

    element.ondblclick = () => {
      if (!isAuthorized()) return;

      active = !active;
      element.style.border = active ? '1px solid white' : 'none';
      element.style.boxShadow = active ? '0 0 5px white' : 'none';
      element.style.cursor = active ? 'move' : 'default';
    };

    element.onmousedown = e => {
      if (!active) return;

      const rect = element.getBoundingClientRect();
      const offset = 5;

      const onLeft = e.clientX >= rect.left - offset && e.clientX <= rect.left + offset;
      const onRight = e.clientX >= rect.right - offset && e.clientX <= rect.right + offset;
      const onTop = e.clientY >= rect.top - offset && e.clientY <= rect.top + offset;
      const onBottom = e.clientY >= rect.bottom - offset && e.clientY <= rect.bottom + offset;

      if (onLeft && onTop) {
        isResizing = true; resizeDir = 'nw'; element.style.cursor = 'nw-resize';
      } else if (onRight && onTop) {
        isResizing = true; resizeDir = 'ne'; element.style.cursor = 'ne-resize';
      } else if (onLeft && onBottom) {
        isResizing = true; resizeDir = 'sw'; element.style.cursor = 'sw-resize';
      } else if (onRight && onBottom) {
        isResizing = true; resizeDir = 'se'; element.style.cursor = 'se-resize';
      } else if (onLeft) {
        isResizing = true; resizeDir = 'w'; element.style.cursor = 'w-resize';
      } else if (onRight) {
        isResizing = true; resizeDir = 'e'; element.style.cursor = 'e-resize';
      } else if (onTop) {
        isResizing = true; resizeDir = 'n'; element.style.cursor = 'n-resize';
      } else if (onBottom) {
        isResizing = true; resizeDir = 's'; element.style.cursor = 's-resize';
      } else {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
        element.style.cursor = 'move';
      }

      document.onmousemove = onMove;
      document.onmouseup = stopAction;
    };

    function onMove(e) {
      e.preventDefault();

      if (isDragging) {
        element.style.left = (e.clientX - offsetX) + 'px';
        element.style.top = (e.clientY - offsetY) + 'px';
      }

      if (isResizing) {
        let left = element.offsetLeft;
        let top = element.offsetTop;
        let width = element.offsetWidth;
        let height = element.offsetHeight;

        if (resizeDir.includes('e')) {
          width = e.clientX - left;
        }
        if (resizeDir.includes('s')) {
          height = e.clientY - top;
        }
        if (resizeDir.includes('w')) {
          let diff = e.clientX - left;
          width -= diff;
          element.style.left = (left + diff) + 'px';
        }
        if (resizeDir.includes('n')) {
          let diff = e.clientY - top;
          height -= diff;
          element.style.top = (top + diff) + 'px';
        }

        element.style.width = width + 'px';
        element.style.height = height + 'px';

        const baseWidth = width;
        const baseHeight = height;

        element.querySelectorAll('p, span').forEach(el => {
          const fontSize = Math.min(baseWidth * 0.15, baseHeight * 0.3);
          el.style.fontSize = fontSize + 'px';
        });
      }
    }

    function stopAction() {
      isDragging = false;
      isResizing = false;
      resizeDir = '';
      element.style.cursor = active ? 'move' : 'default';
      document.onmousemove = null;
      document.onmouseup = null;

      socket.emit('updateDiv', {
        id: element.id,
        left: element.style.left,
        top: element.style.top,
        width: element.style.width,
        height: element.style.height,
        color: element.style.color || '',
        backgroundImage: element.style.backgroundImage || '',
        fontSize: element.querySelector('p, span')?.style.fontSize || '',
      });
    }
  }
  function createDivs() {
    if (!document.getElementById('user-stats')) {
      const statsDiv = document.createElement('div');
      statsDiv.id = 'user-stats';
      statsDiv.innerHTML = `<span id="current-users"><b><i>Online: 0</i></b></span>
                            <span id="total-users"><b><i>Ukupno: 0</i></b></span>`;
   Object.assign(statsDiv.style, {
  position: 'absolute',
  top: '50px',
  left: '20px',
  width: '300px',       // Dodato
  height: '50px',       // Dodato
  color: 'white',
  zIndex: '2',
  fontSize: '20px',
  userSelect: 'none',
  display: 'flex',
  gap: '15px',
  alignItems: 'center',
  fontFamily: 'Arial, sans-serif',
  border: 'none',
  outline: 'none',
  whiteSpace: 'nowrap',
  boxShadow: 'none'
});

      document.body.appendChild(statsDiv);
      setupDragAndResize(statsDiv);
    }

    if (!document.getElementById('local-time-div')) {
      const timeDiv = document.createElement('div');
      timeDiv.id = 'local-time-div';
   timeDiv.innerHTML = `<p id="local-time"><b><i>--:--:--</i></b></p>`;
   Object.assign(timeDiv.style, {
  position: 'absolute',
  top: '50px',
  left: '1000px',
 width: '200px',       // Dodato
  height: '50px',       // Dodato
  color: 'white',
  zIndex: '2',
  fontSize: '20px',
  userSelect: 'none',
  fontFamily: 'Arial, sans-serif',
  border: 'none',
  outline: 'none',
  boxShadow: 'none',
  whiteSpace: 'nowrap'
 });

      document.body.appendChild(timeDiv);
      setupDragAndResize(timeDiv);

      setInterval(() => {
        const now = new Date();
        const localTimeEl = document.getElementById('local-time');
        if (localTimeEl) {
         localTimeEl.innerHTML = `<b><i>${now.toLocaleTimeString()}</i></b>`;
         }
      }, 1000);
    }
  }

  createDivs();
const style = document.createElement('style');
style.textContent = `
  #user-stats.guest::before,
  #local-time-div.guest::before {
    content: none !important;
  }
`;
document.head.appendChild(style);

const gradijent = document.getElementById('gradijent');

  function hidePickers() {
  if (gradijent) gradijent.style.display = 'none';
}
function showPickers() {
  if (gradijent) gradijent.style.display = 'grid';
}

// Primena boje ili gradijenta na tekst
function applyTextColorOrGradient(element, colorOrGradient) {
  if (!isAuthorized()) return;

  if (colorOrGradient.startsWith('linear-gradient') || colorOrGradient.startsWith('radial-gradient')) {
    element.style.backgroundImage = colorOrGradient;
    element.style.webkitBackgroundClip = 'text';
    element.style.backgroundClip = 'text';
    element.style.webkitTextFillColor = 'transparent';
    element.style.color = 'transparent';
  } else {
    element.style.backgroundImage = '';
    element.style.color = colorOrGradient;
    element.style.webkitBackgroundClip = '';
    element.style.backgroundClip = '';
    element.style.webkitTextFillColor = '';
  }
}

// Aktivacija i deaktivacija pickera za određeni div
function togglePickersForDiv(div) {
  if (!isAuthorized()) return;

  // Ako je kliknuti div već aktivan, samo ga deaktiviraj i sakrij pickere
  if (activeDiv === div) {
    hidePickers();  // Sakrij pickere
    activeDiv = null;  // Deaktiviraj div
  } else {
    // Ako nije aktivan, deaktiviraj prethodni div (ako postoji) i sakrij njegove pickere
    if (activeDiv) {
      hidePickers();  // Sakrij pickere za prethodni div
    }
    
    // Postavi novi div kao aktivan i prikaži pickere
    activeDiv = div;
    showPickers();  // Prikazi pickere za novi aktivni div
  }
  
  // Ako nijedan div nije aktivan, sakrij pickere
  if (!activeDiv) {
    hidePickers();
  }
}

// Dodavanje event listenera za dvoklik na div-ove
['user-stats', 'local-time-div'].forEach(id => {
  const div = document.getElementById(id);
  if (div) {
    div.addEventListener('dblclick', e => {
      e.stopPropagation();
      togglePickersForDiv(div);
    });
  }
});

// Event listener za color picker
if (colorPicker) {
  colorPicker.addEventListener('input', e => {
    if (activeDiv) applyTextColorOrGradient(activeDiv, e.target.value);
  });
}

// Event listener za gradijent picker
if (gradijent) {
  gradijent.querySelectorAll('.gradijent-box').forEach(box => {
    box.addEventListener('click', () => {
      if (activeDiv) {
        const bg = window.getComputedStyle(box).backgroundImage;
        applyTextColorOrGradient(activeDiv, bg);
      }
    });
  });
}



socket.on('updateDiv', (data) => {
  setTimeout(() => {
    const element = document.getElementById(data.id);
    if (!element) return;

    element.style.left = data.left;
    element.style.top = data.top;
    element.style.width = data.width;
    element.style.height = data.height;

    const isGradient = data.backgroundImage && 
      (data.backgroundImage.startsWith('linear-gradient') || data.backgroundImage.startsWith('radial-gradient'));

    if (isGradient) {
      element.style.backgroundImage = data.backgroundImage;
      element.style.webkitBackgroundClip = 'text';
      element.style.backgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.color = 'transparent';
    } else {
      element.style.backgroundImage = '';
      element.style.webkitBackgroundClip = '';
      element.style.backgroundClip = '';
      element.style.webkitTextFillColor = '';
      element.style.color = data.color || '';
    }

    element.querySelectorAll('p, span').forEach(el => {
      el.style.fontSize = data.fontSize || '';
    });
  }, 3000);
});
socket.on('usersCount', data => {
  setTimeout(() => {
    const currentUsers = document.getElementById('current-users');
    const totalUsers = document.getElementById('total-users');
    if (currentUsers) currentUsers.innerHTML = `<b><i>Online: ${data.current}</i></b>`;
    if (totalUsers) totalUsers.innerHTML = `<b><i>Ukupno: ${data.total}</i></b>`;
  }, 3000);
});
 });



