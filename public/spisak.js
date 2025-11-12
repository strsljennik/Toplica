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
