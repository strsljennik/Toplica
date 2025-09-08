let snimanjeAktivno = false;
let porukeZaSnimanje = [];
let snProzorPrikazan = false;

// Dugme koje već imaš u HTML-u
const snButton = document.getElementById('sn');

// Kreiramo prozor za kontrolu snimanja (pojavljuje se i nestaje)
const kontrolniProzor = document.createElement('div');
kontrolniProzor.id = 'po';
kontrolniProzor.style.position = 'fixed';
kontrolniProzor.style.top = '50px';
kontrolniProzor.style.right = '20px';
kontrolniProzor.style.background = '#000';
kontrolniProzor.style.border = '1px solid #ccc';
kontrolniProzor.style.padding = '10px';
kontrolniProzor.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
kontrolniProzor.style.zIndex = '1000';
kontrolniProzor.style.display = 'none';

// Dodajemo dugmiće u prozor
kontrolniProzor.innerHTML = `
  <button id="kr">START</button>
  <button id="st">STOP</button>
  <button id="aj">SACUVAJ</button>
`;

document.body.appendChild(kontrolniProzor);

// Toggle prikaza kontrolnog prozora
snButton.addEventListener('click', () => {
  snProzorPrikazan = !snProzorPrikazan;
  kontrolniProzor.style.display = snProzorPrikazan ? 'block' : 'none';
});

// Dugme START
document.getElementById('kr').addEventListener('click', () => {
  snimanjeAktivno = true;
  porukeZaSnimanje = []; // Resetuj stare poruke

  // Dodaj sve postojeće poruke odmah
  document.querySelectorAll('#messageArea .message').forEach(msg => {
    porukeZaSnimanje.push(msg.outerHTML);
  });

  console.log('✅ Snimanje počelo (uključene i postojeće poruke)');
});

// Dugme SACUVAJ
document.getElementById('aj').addEventListener('click', () => {
  if (porukeZaSnimanje.length === 0) {
    alert('Nema poruka za snimanje!');
    return;
  }

  const htmlSadrzaj = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Snimljene poruke</title>
  <style>
    body { font-family: sans-serif; background: #000; color: white; padding: 20px; }
    .message { margin-bottom: 10px; padding: 8px; background: #222; border-radius: 6px; box-shadow: 0 1px 3px rgba(255,255,255,0.1); }
  </style>
</head>
<body>
  <h2>Snimljene poruke</h2>
  ${porukeZaSnimanje.join('\n')}
</body>
</html>`;

  const blob = new Blob([htmlSadrzaj], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'chat_poruke.html';
  link.click();

  console.log('💾 Poruke snimljene (crna pozadina)');
});
// MutationObserver koji hvata svaku novu poruku sa stilovima
messageArea = document.getElementById('messageArea');
const observer = new MutationObserver(mutations => {
  if (!snimanjeAktivno) return;
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.classList && node.classList.contains('message')) {
        porukeZaSnimanje.push(node.outerHTML); // TAČNO onako kako je prikazana
      }
    });
  });
});
observer.observe(messageArea, { childList: true });


