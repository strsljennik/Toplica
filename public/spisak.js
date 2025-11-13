window.onload = function () {
    const dugme = document.getElementById('spisak');
    const tabela = document.getElementById('tabela');

    dugme.addEventListener('click', () => {
        tabela.style.display = tabela.style.display === 'none' ? 'block' : 'none';
    });

    tabela.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 300px;
        height: 600px;
        background: black;
        border: 2px solid;
        border-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff) 1;
        padding: 10px;
        overflow-y: auto;
        display: none;
    `;

    for (let i = 0; i < 10; i++) {
        const red = document.createElement('div');
        red.style.cssText = `
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px solid;
            border-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff) 1;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Upiši tekst ${i + 1}`;
        input.style.cssText = `
            width: 100%;
            background: black;
            color: transparent;
            font-weight: bold;
            font-style: italic;
            background-image: linear-gradient(to right, #ffffff, #ffff66, #66ccff);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            border: none;
            outline: none;
        `;

        red.appendChild(input);
        tabela.appendChild(red);
    }

 function setupStream(buttonId, streamUrl, displayText, originalText) {
    const btn = document.getElementById(buttonId);
    const player = new Audio();
    let isPlaying = false;

    function playStream() {
        player.src = streamUrl;
        player.load();
        player.play().then(() => {
            btn.textContent = displayText;
            isPlaying = true;
        }).catch(err => console.error("Greška pri puštanju:", err));
    }

    btn.addEventListener("click", () => {
        btn.blur();
        if (isPlaying) {
            player.pause();
            btn.textContent = originalText;
            isPlaying = false;
        } else {
            playStream();
        }
    });

    // automatski retry ako pukne stream
    player.addEventListener("error", () => {
        if (isPlaying) {
            setTimeout(playStream, 3000);
        }
    });
}

setupStream("mia", "https://stm1.srvif.com:7258/stream", "Stop", "R-Mia");
setupStream("pink", "https://edge9.pink.rs/pinkstream", "Stop", "Pinkradio");
setupStream("rs", "https://stream.radios.rs:9016/;*.mp3", "Stop", "RadioSr");
setupStream("bg", "https://radio.dukahosting.com/8118/stream", "Stop", "RomaBg");
setupStream("at", "https://ip232.radyotelekom.com.tr:8318/;stream.mp3", "Stop", "H&A");


};
// KODOVI GALAKSIJE 
const kodovi = {
  ':)': '😊', ':(': '☹️', ':D': '😃', 'xD': '😆', ':))': '😁', ':O': '😮',
  ';)': '😉', ':P': '😛', ':/': '😕', ':\'(': '😢', '>:(': '😠', ':|': '😐',
  ':-)': '🙂', ':-(': '🙁', ':-D': '😄', ':x': '😎',
  '#n': 'Kod koji svakom korisniku emituje njegov broj ili nik ( u slucaju kada je korisnik ulogovan)',
  '#0': 'Za Inci Biserku Od *__X__*😎',
  '#1': 'Dragi gosti, vaše primedbe možete prijaviti upravi Galaksije na broj +511 545 856 957 565 956 354 785 968 652 624',
  '#2': '❤🧡💛💚💙💜🤎🖤💖💗💓🤍',
  '#3': '💋💋💋💋💋💋💋',
  '#4': '#n jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  '#5': 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa #n',
  '#6': 'ajmo romalen te kela em te gilava',
  '#7': 'hey sefe koj ti je vrag??????????',
  '#8': 'svega ovoga ne bi bilo da je Pera otišao pravo u policiju',
  '#9': 'Musketari Galaksije - svi za jednog, jedan za sve',
  '#a': 'Ko je vas poznavao, ni pakao mu neće teško pasti',
  'a1': 'Prevari me jednom – sram te bilo, prevari me dva puta – sram mene bilo.',
  'a2': 'Biti potpuno iskren prema sebi je dobra vežba.',
  'a3': 'Ne trčite za ženama da se ne sudarite sa onima koji od njih beže.',
  'a4': 'Prodavačica je bila toliko lepa da je bilo smešno njeno pitanje: "Šta želite?"',
  '#iva': '🎶🎶🎶🎶🎵🎶🎶🎵',
  '#dia': '💎💎💎💎💎💎💎💎💎💎💎💎💎💎',
  '#x': 'Pesma za sve goste u Galaksiji od cika X-a ',
  '#g': 'Pokazuje vreme svakom korisniku u njegovoj vremenskoj zoni',
  '#u': 'Prikazuje trenutni i ukupan broj gosta u Galaksiji',
  '#dg': '#n Dobro Dosli, Sa Vama Je Dj Dia ',
  '#xg': '#n Dobro Dosli, Sa Vama Je Dj *__X__* ',
  '#sg': '#n Dobro Dosli ',
  '#ha': 'Hulija❤️Ates'
};
let tabla;

document.addEventListener('DOMContentLoaded', () => {
  const dugme = document.getElementById('kodgosti');
  if (!dugme) return;

  dugme.addEventListener('click', () => {
    if (!tabla) {
      tabla = document.createElement('div');
      tabla.style.position = 'fixed';
      tabla.style.top = '100px';
      tabla.style.left = '100px';
      tabla.style.width = '400px';
      tabla.style.height = '800px';
      tabla.style.backgroundColor = '#000';
      tabla.style.color = '#fff';
      tabla.style.fontSize = '20px';
      tabla.style.fontWeight = 'bold';
      tabla.style.fontStyle = 'italic';
      tabla.style.border = '2px solid #0ff';
      tabla.style.padding = '10px';
      tabla.style.boxSizing = 'border-box';
      tabla.style.overflow = 'auto';
      tabla.style.zIndex = '9999';
      tabla.style.cursor = 'move';
      tabla.innerHTML = `<h2>Galaksija Kodovi</h2>` + Object.entries(kodovi).map(([k,v]) => {
        return `<p>${k}: ${typeof v === 'function' ? v() : v}</p>`;
      }).join('');
      document.body.appendChild(tabla);

      // Drag funkcionalnost
      let offsetX, offsetY, isDown = false;
      tabla.addEventListener('mousedown', e => {
        isDown = true;
        offsetX = e.clientX - tabla.offsetLeft;
        offsetY = e.clientY - tabla.offsetTop;
      });
      document.addEventListener('mouseup', () => isDown = false);
      document.addEventListener('mousemove', e => {
        if (!isDown) return;
        tabla.style.left = (e.clientX - offsetX) + 'px';
        tabla.style.top = (e.clientY - offsetY) + 'px';
      });
    } else {
      tabla.remove();
      tabla = null;
    }
  });
});

