// Otvori/zatvori prozor s id="sucur" na klik dugmeta id="mem"
document.getElementById('mem').addEventListener('click', () => {
  let sucur = document.getElementById('sucur');
  if (!sucur) {
    // Napravi prozor
    sucur = document.createElement('div');
    sucur.id = 'sucur';
    sucur.style.position = 'fixed';
    sucur.style.top = '50px';
    sucur.style.right = '50px';
    sucur.style.padding = '20px';
    sucur.style.background = 'black';
    sucur.style.border = '2px solid white';
    sucur.style.boxShadow = '0 0 10px white';
    sucur.style.zIndex = '9999';
    sucur.style.display = 'block';

    // Napravi dugme ČUVAJ
    const her = document.createElement('button');
    her.id = 'her';
    her.textContent = 'ČUVAJ';
    sucur.appendChild(her);

    // Napravi dugme UČITAJ
    const gras = document.createElement('button');
    gras.id = 'gras';
    gras.textContent = 'UČITAJ';
    gras.style.marginLeft = '10px';
    sucur.appendChild(gras);

    // Napravi file input
    const fileLoader = document.createElement('input');
    fileLoader.type = 'file';
    fileLoader.id = 'fileInput';
    fileLoader.style.display = 'none';
    sucur.appendChild(fileLoader);

    document.body.appendChild(sucur);

    // Event za čuvanje
    her.addEventListener('click', () => {
      const elements = Array.from(document.querySelectorAll('.element')).map(el => ({
        id: el.id,
        top: el.style.top || el.offsetTop + 'px',
        left: el.style.left || el.offsetLeft + 'px',
        width: el.style.width || el.offsetWidth + 'px',
        height: el.style.height || el.offsetHeight + 'px'
      }));

      // Uzmi slike iz globalnog niza images
      const savedImages = images.map(img => ({
        id: img.id,
        src: img.src,
        top: img.top,
        left: img.left,
        width: img.width,
        height: img.height
      }));

      const animatedTexts = Array.from(document.querySelectorAll('.text-display')).map(el => {
        const style = getComputedStyle(el);
        return {
          id: el.id || '',
          text: el.innerText,
          font: style.fontFamily,
          fontSize: style.fontSize,
          animation: style.animationName,
          speed: parseFloat(style.animationDuration),
          color: style.color,
          gradient: style.backgroundImage !== 'none' ? style.backgroundImage : null,
          top: style.top || el.style.top || el.offsetTop + 'px',
          left: style.left || el.style.left || el.offsetLeft + 'px'
        };
      });

      const background = document.body.style.backgroundImage || '';
      const data = { elements, images: savedImages, animatedTexts, background };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'layout.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    // Otvaranje file dijaloga
    gras.addEventListener('click', () => fileLoader.click());

    // Učitavanje JSON-a
    fileLoader.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);

          // Elements
          if (data.elements) {
            data.elements.forEach(el => {
              const domEl = document.getElementById(el.id);
              if (!domEl) return;
              domEl.style.position = 'absolute';
              domEl.style.top = el.top;
              domEl.style.left = el.left;
              domEl.style.width = el.width;
              domEl.style.height = el.height;
            });
          }

          // Animated texts
          if (data.animatedTexts) {
            data.animatedTexts.forEach(txt => {
              const el = document.createElement('div');
              el.classList.add('text-display');
              el.innerText = txt.text;
              el.style.position = 'absolute';
              el.style.top = txt.top;
              el.style.left = txt.left;
              el.style.fontFamily = txt.font;
              el.style.fontSize = txt.fontSize;
              el.style.animation = `${txt.animation} ${txt.speed}s ease infinite`;

              if (txt.gradient) {
                el.style.backgroundImage = txt.gradient;
                el.style.webkitBackgroundClip = "text";
                el.style.webkitTextFillColor = "transparent";
              } else {
                el.style.color = txt.color;
              }

              document.body.appendChild(el);
            });
          }

          // Pozadina
          if (data.background) {
            document.body.style.backgroundImage = data.background;
          }

          // SLIKE
          if (data.images) {
            data.images.forEach(imgData => {
              let img = document.getElementById(imgData.id);
              if (!img) {
                img = document.createElement('img');
                img.id = imgData.id;
                img.src = imgData.src;
                img.style.position = 'absolute';
                document.body.appendChild(img);
              }
              img.src = imgData.src;
              img.style.top = imgData.top;
              img.style.left = imgData.left;
              img.style.width = imgData.width;
              img.style.height = imgData.height;
            });
          }

          socket.emit('full-layout-load', data);
        } catch {
          alert('Pogrešan JSON.');
        }
      };
      reader.readAsText(file);
    });

  } else {
    sucur.remove();
  }
});
socket.on('full-layout-load', data => {
  setTimeout(() => {
    // Elements
    if (data.elements) {
      data.elements.forEach(el => {
        const domEl = document.getElementById(el.id);
        if (!domEl) return;
        domEl.style.position = 'absolute';
        domEl.style.top = el.top;
        domEl.style.left = el.left;
        domEl.style.width = el.width;
        domEl.style.height = el.height;
      });
    }

    // Animated texts
    if (data.animatedTexts) {
      data.animatedTexts.forEach(txt => {
        const el = document.createElement('div');
        el.classList.add('text-display');
        el.innerText = txt.text;
        el.style.position = 'absolute';
        el.style.top = txt.top;
        el.style.left = txt.left;
        el.style.fontFamily = txt.font;
        el.style.fontSize = txt.fontSize;
        el.style.animation = `${txt.animation} ${txt.speed}s ease infinite`;

        if (txt.gradient) {
          el.style.backgroundImage = txt.gradient;
          el.style.webkitBackgroundClip = "text";
          el.style.webkitTextFillColor = "transparent";
        } else {
          el.style.color = txt.color;
        }

        document.body.appendChild(el);
      });
    }

    // Pozadina
    if (data.background) {
      document.body.style.backgroundImage = data.background;
    }

    // SLIKE
    if (data.images) {
      data.images.forEach(imgData => {
        let img = document.getElementById(imgData.id);
        if (!img) {
          img = document.createElement('img');
          img.id = imgData.id;
          img.src = imgData.src;
          img.style.position = 'absolute';
          document.body.appendChild(img);
        }
        img.src = imgData.src;
        img.style.top = imgData.top;
        img.style.left = imgData.left;
        img.style.width = imgData.width;
        img.style.height = imgData.height;

        // Dodaj u globalni niz ako već ne postoji
        if (!images.some(i => i.id === imgData.id)) {
          images.push({
            id: imgData.id,
            src: imgData.src,
            top: imgData.top,
            left: imgData.left,
            width: imgData.width,
            height: imgData.height
          });
        }
      });
    }
  }, 5000);
});
document.getElementById('pi').addEventListener('click', () => {
  socket.emit('full-layout-reset');

  document.body.style.backgroundImage = '';
  document.querySelectorAll('img[id^="img-"]').forEach(img => img.remove());
  document.querySelectorAll('.text-display').forEach(el => el.remove());

  // Očisti globalni niz slika
  images = [];
});

socket.on('full-layout-reset', () => {
  setTimeout(() => {
    document.body.style.backgroundImage = '';
    document.querySelectorAll('img[id^="img-"]').forEach(img => img.remove());
    document.querySelectorAll('.text-display').forEach(el => el.remove());

    // Očisti globalni niz slika
    images = [];
  }, 5000);
});
