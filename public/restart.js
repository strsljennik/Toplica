(function () {
  const activeKeys = new Set();

  // Kreiraj overlay koji je po defaultu sakriven
  const overlay = document.createElement('div');
  overlay.id = 'admin-overlay';
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  overlay.style.zIndex = '9999';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  // Tabla u centru overlaya
  const panel = document.createElement('div');
  panel.style.border = '2px solid #fff';
  panel.style.padding = '30px 40px';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 0 15px #fff';
  panel.style.backgroundColor = 'transparent';
  panel.style.color = '#fff';
  panel.style.fontFamily = 'monospace';
  panel.style.textAlign = 'center';

  panel.innerHTML = `
    <p style="font-size: 20px; margin-bottom: 20px; text-shadow: 0 0 10px white;">
      ⚠️ Restartovati Radio?
    </p>
    <button id="confirm-restart" style="margin-right: 20px;">✅ RESTARTUJ</button>
    <button id="cancel-restart">❌ OTKAZI</button>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  // Stilovi za dugmad sa belim neon efektom
  const buttons = overlay.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.border = '2px solid #fff';
    btn.style.background = 'transparent';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.textShadow = '0 0 10px white';
    btn.style.boxShadow = '0 0 8px #fff';
    btn.style.borderRadius = '5px';
    btn.style.transition = 'box-shadow 0.3s ease';
    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 0 15px #fff';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 0 8px #fff';
    });
  });

  // Prati pritisnute tastere
  document.addEventListener('keydown', (e) => {
    activeKeys.add(e.key.toUpperCase());
    if (activeKeys.has('R') && activeKeys.has('G') && activeKeys.has('1')) {
      overlay.style.display = 'flex';
    }
  });

  document.addEventListener('keyup', (e) => {
    activeKeys.delete(e.key.toUpperCase());
  });

  // Otkaži dugme sakriva overlay
  document.getElementById('cancel-restart').addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Restart dugme šalje POST zahtev i zatvara overlay (BEZ confirm prompta!)
  document.getElementById('confirm-restart').addEventListener('click', () => {
    fetch('/restart', { method: 'POST' })
      .then(res => res.text())
      .then(msg => alert(msg || 'Server se restartuje...'))
      .catch(() => alert('Greška pri restartu servera'));
    overlay.style.display = 'none';
  });
})();
