const textEmojiMap = {
  ':)': '😊',
  ':(': '☹️',
  ':D': '😃',
  'xD': '😆',
  ':))': '😁',
  ':O': '😮',
  ';)': '😉',
  ':P': '😛',
  ':/': '😕',
  ':\'(': '😢',
  '>:(': '😠',
  ':|': '😐',
  ':-)': '🙂',
  ':-(': '🙁',
  ':-D': '😄',
  ':x': '😎',

  '#0': 'Sto vise upoznajem ljude sve vise volim zivotinje',
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
  '#g': () => new Date().toLocaleTimeString(),
  '#u': () => `Online: ${document.getElementById('current-users')?.textContent.replace(/\D/g,'')||0}, Ukupno: ${document.getElementById('total-users')?.textContent.replace(/\D/g,'')||0}`,
  '#dg': '#n Dobro Dosli, Sa Vama Je Dj Dia ',
  '#ha': 'Hulija❤️Ates'
};

// Funkcija replaceTextEmoji koja sada radi i posle <img> tagova
function replaceTextEmoji(html) {
  const keys = Object.keys(textEmojiMap).sort((a,b) => b.length - a.length);

  // Delimo string na HTML tagove i tekst
  const parts = html.split(/(<[^>]+>)/g);

  for (let i = 0; i < parts.length; i++) {
    // Ako je HTML tag, preskoči
    if (parts[i].startsWith('<') && parts[i].endsWith('>')) continue;

    let textPart = parts[i];

    for (const key of keys) {
      const replacement = typeof textEmojiMap[key] === 'function' ? textEmojiMap[key]() : textEmojiMap[key];

      // Zamena bez granica reči, tako da radi i posle slika
      textPart = textPart.split(key).join(replacement);
    }

    parts[i] = textPart;
  }

  return parts.join('');
}
