

socket.on('azuriraj_slike', (serverSlike) => {
  // Ukloni stare slike sa strane
  Object.values(slike).forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.remove();
  });
  Object.keys(slike).forEach(k => delete slike[k]);
  Object.assign(slike, serverSlike);

  Object.values(slike).forEach(({id, url, left, top, width, height}) => {
    let img = document.getElementById(id);
    if (!img) {
      img = document.createElement('img');
      img.id = id;
      img.src = url;
      img.style.position = 'absolute';
      img.style.cursor = 'move';
      img.style.userSelect = 'none';
      img.style.zIndex = '1600';
      img.addEventListener('contextmenu', e => {
        e.preventDefault();
        if (confirm('Obrisati sliku?')) {
          socket.emit('obrisi_sliku', id);
        }
      });
      document.body.appendChild(img);
      setupInteract(img); // tvoj originalni setupInteract
      setupSocketForImage(img, id); // dodajem socket emit na end događaje
    }
    img.style.width = width + 'px';
    img.style.height = height + 'px';
    img.style.transform = `translate(${left}px, ${top}px)`;
    img.setAttribute('data-x', left);
    img.setAttribute('data-y', top);
  });
});

function dodajSliku() {
  const url = prompt("Unesi URL slike:");
  if (!url) return;

  const id = 'img-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  const img = document.createElement('img');
  img.src = url;
  img.id = id;
  img.style.position = 'absolute';
  img.style.top = '10px';
  img.style.left = '10px';
  img.style.width = '150px';
  img.style.height = '150px';
  img.style.zIndex = '1600';
  img.style.cursor = 'move';
  img.style.userSelect = 'none';

  img.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (confirm('Obrisati sliku?')) {
      img.remove();
      delete slike[id];
      socket.emit('azuriraj_slike', slike);
    }
  });

  document.body.appendChild(img);

  slike[id] = {
    id,
    url,
    left: 10,
    top: 10,
    width: 150,
    height: 150
  };
  socket.emit('azuriraj_slike', slike);

  setupInteract(img);
  setupSocketForImage(img, id);
}

document.getElementById('chatsl').onclick = dodajSliku;

// Tvoj originalni setupInteract ne diramo!

// Dodajemo socket emit kad slika zavrsi drag ili resize
function setupSocketForImage(el, id) {
  interact(el).draggable({
    listeners: {
      end(event) {
        const target = event.target;
        const x = parseFloat(target.getAttribute('data-x')) || 0;
        const y = parseFloat(target.getAttribute('data-y')) || 0;
        if (id && slike[id]) {
          slike[id].left = x;
          slike[id].top = y;
          socket.emit('azuriraj_slike', slike);
        }
      }
    }
  });

  interact(el).resizable({
    listeners: {
      end(event) {
        const target = event.target;
        const x = parseFloat(target.getAttribute('data-x')) || 0;
        const y = parseFloat(target.getAttribute('data-y')) || 0;
        if (id && slike[id]) {
          slike[id].left = x;
          slike[id].top = y;
          slike[id].width = parseFloat(target.style.width);
          slike[id].height = parseFloat(target.style.height);
          socket.emit('azuriraj_slike', slike);
        }
      }
    }
  });
}
