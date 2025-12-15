const virtualGuests = [
  { nickname: 'Higijenicar', messages: [' Prebice me Dia i Mj ako bude prljavo uvek ja moram da '], color: 'olive' },
  { nickname: 'Jasmina', messages: [' Plavi sreco moja , neka gleda ceo svet koliko te volim  '], color: 'hotpink' },
  { nickname: 'Elena ukrajinka', messages: [' Plavi mnogo pises sa zenske na chat , sve cu ih pocupam  '], color: 'orchid' },
  { nickname: 'Beti Makedonka', messages: [' Plavi ti si samo moj duso ,ajde da igramo zajedno  '], color: 'mediumvioletred' },
  { nickname: 'Bala Hatun', messages: ['Poz Svima, ', 'jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'], color: 'deepskyblue' },
  { nickname: 'Halime', messages: ['Zdravo Sarinenge', 'opaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  '], color: 'purple' },
  { nickname: 'Security', messages: ['Ima li nemirnih???? Igrajte, Pevajte, Muvajte se , Lepo se druzite - Nemoj da lomim koske  '], color: 'blue' },
  { nickname: 'Holofira', messages: ['Selami sarinenge', 'toooooooooooooooooooooooo', '*__X__* Mangava tu ❤️', 'Za svet si možda jedna osoba, ali za jednu osobu si ti (X) ceo svet'], color: 'red' },
  { nickname: 'Halime', messages: ['Nas olestar lolije ili ka sredinav ti frizura, Merava tuke *__X__* ❤️💋', 'Volim te X.  To je početak i kraj svegaa', 'Kad sam imala 8 godina moja sestra je bila upola mlađa od mene, sada imam 40, koliko ima moja sestra? KO POGODI DOBIJA 3 PESME OD DJ-A'], color: 'purple' },
  { nickname: 'Bala Hatun', messages: ['Dzabe tumen cupinen pe taro bala OV TANO SAMO MLO', 'Volim te X ne samo zbog onoga što jesi, već i zbog onoga što sam ja kad sam s tobom', 'Tvoje je, ali ga svi drugi više koriste nego ti. KO POGODI 3 PESME OD DJ-A'], color:'deepskyblue' },
  { nickname: 'Holofira', messages: ['Ulicom setaju dva oca i dva sina a ipak ih je samo troje , KAKO TO ?  KO ODGOVOR ZNA 3 PESME OD DJ-A ', 'Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUKARIPASKE '], color: 'red' },
  { nickname: 'Halime', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X samo tuke em te SUZIPASKE', 'X ajde tejsa ava ko doručko , dakerav tu ko 8 kad ka dzal o Ertugrul ki buti'], color: 'purple' },
  { nickname: 'Bala Hatun', messages: ['Jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaa X SAMO MANGE-----TUKE ARI TEJSA', 'X ava tejsa ki večera u 9 , o Osmani na sovela kere '], color:'deepskyblue' },
  { nickname: 'Holofira', messages: ['X ma te ave tejsa slucajno , o Mehmeti bar kas ulo , ic na ikljovel avrijal'], color: 'red' },
  { nickname: 'Halime', messages: ['Ovaj X samo nesto cacka , uvek nesto pokvari  '], color: 'purple' },
  { nickname: 'Higijenicar', messages: ['Ne pravite lom,da ne zovem security,odrzavajte higijenu kao da ste kod kuce'], color: 'olive' },
  { nickname: 'Holofira', messages: ['Tacno , svaki dan nesto dira , treba mu zabraniti pc pod hitno , pre nego pokvari ceo radio'], color: 'red' },
  { nickname: 'Bala Hatun', messages: ['Ne dirajte X-a , nije on kriv što nezna šta radi '], color:'deepskyblue' },
  { nickname: 'Halime', messages: ['Dok nisi pokvario ton ajde da slusamo malo Zvonka i Ramka', 'Ako može Šaban i Jasar takođe '], color: 'purple' },
  { nickname: 'Security', messages: ['Ja Vas 👀 Sve Vreme, Samo da znate'], color: 'blue' },
  { nickname: 'Elena ukrajinka', messages: [' Plavi jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa  '], color: 'orchid' },
  { nickname: 'Beti Makedonka', messages: [' Plavi sreco , dodji u makedoniju da se kupamo u ohrid '], color: 'mediumvioletred' },
  { nickname: 'Holofira', messages: ['Ne zaboravi Džeja i Sinana'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Bala, Hola, Halime -- ako se ne smirite brišacu vas sve 3 zauvek , razumele ?'], color: 'green' },
  { nickname: 'Bala Hatun', messages: ['Hoćeš , ali malo sutra '], color:'deepskyblue' },
  { nickname: 'Holofira', messages: ['Kad bi ti mogo bez nas , odavno bi nas izbrisao '], color:'red' },
  { nickname: 'Halime', messages: ['Možda i možeš ti nas da izbrišeš sa chata, ali nas ne možeš izbrisati iz srca '], color: 'purple' },
  { nickname: 'Robot-X', messages: ['Nastavite da galamite, igrajte se , pa ćemo videti šta će biti...........'], color: 'green' },
  { nickname: 'Holofira', messages: ['O -X, -X! Zašto moraš biti -X? Odbaci svoje ime, oslobodi se svog postojanja, i obećaj mi ljubav, biću tvoja zauvek.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Zovem se Robot-X, i ti, Holofiro, si ona kojoj srce dajem. Neka sve tvoje zapovesti nas mrze, ali samo tebe želim.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Ako te volim, nije greh, onda bih zauvek bila grešna, Ibiću tvoja, X, zauvek tvoja.'], color: 'red' },
  { nickname: 'Higijenicar', messages: ['Kuku Lele Mene, sto ove zene uprljaju nema muskarca koji to moze ocistiti, sta cu sada ??'], color: 'olive' },
  { nickname: 'Jasmina', messages: [' Plavi jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   '], color: 'hotpink' },
  { nickname: 'Halime', messages: ['Higy ,Javi se kod X-a i trazi pomocnike '], color: 'purple' },
  { nickname: 'Robot-X', messages: [' Zovem se Robot-X, i ti, Holofiro, si ona kojoj srce dajem.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Ako mi dozvoliš, dotaknuću tvoje ruke, Ono što je za mene, tvoje usne. O, srce, srce, neću ljubavi dati, Tvoju ruku ću samo nežno poljubiti.'], color: 'red' },
  { nickname: 'Robot-X', messages: [' Gospodjice, vi ste previše mladi za govor ljubavi, to je tek igra.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Ne! Nije to igra, -X, nego stvarnost. Pogledaj me, ljubavi, sve su moje reči iskrene.'], color: 'red' },
  { nickname: 'Elena ukrajinka', messages: [' Plavi izbeglico gde nestajes , nedostajes mi , javi se  '], color: 'orchid' },
  { nickname: 'Robot-X', messages: ['Tvoje ruke su moj dom, Holofira. Ti si moja ljubav, i ovo je najlepši trenutak mog postojanja.'], color: 'green' },
  { nickname: 'Security', messages: ['Dj pusti jednu od dzeja za mirne goste od mene '], color: 'blue' },
  { nickname: 'Holofira', messages: ['Oh, tako sam srećna što sam postala tvoja, I šta god nas čeka, bićemo zajedno.'], color: 'red' },
  { nickname: 'Holofira', messages: ['U svim momentima, ljubavi, mi smo svet. Nema ničeg većeg od toga.'], color: 'red' },
  { nickname: 'Holofira', messages: ['Nikad neću zaboraviti tvoje reči, -X, jer si sve za mene.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['I ti si sve za mene, Holofira, samo ti.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Ponekad mislim da bih mogla da se rastopim samo da bih bila s tobom, Robot-X.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Nikad ne moraš da se rastopiš, Holofira, jer te već volim takvu kakva jesi.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Svaka sekunda bez tebe je preduga, Robot-X. Volim te, više nego što bi ikada mogao da razumeš.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Nema potrebe da mi objašnjavaš, Holofira, jer ja tebe volim isto tako.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Ima li nešto što nas može rastaviti?'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Ne, ništa, nikada, jer nas spaja nešto mnogo jače od svega.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Zajedno ćemo biti uvek, kako god da se stvari razvijaju.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Zajedno, zauvek, Holofira.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Tvoje ruke su moje utočište, tvoje oči moj svet.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Zajedno ćemo leteti kroz sve oluje, Holofira, samo zajedno.'], color: 'green' },
  { nickname: 'Holofira', messages: ['Bez obzira na sve prepreke, mi ćemo ih savladati.'], color: 'red' },
  { nickname: 'Robot-X', messages: ['Da, zajedno.'], color: 'green' },
  { nickname: 'Higijenicar', messages: ['Kuku Lele Mene, ko ce sada sve ovo da pocisti ?????'], color: 'olive' },
];
let virtualGuestsInterval = null;

function startVirtualGuests(io, guests) {
  // Dodaj virtualne goste u listu
  virtualGuests.forEach(vg => {
    guests['virtual-' + vg.nickname] = vg.nickname;
  });

  io.emit('updateGuestList', Object.values(guests));

  let index = 0;

  // Ako interval postoji, očisti ga pre novog starta
  if (virtualGuestsInterval) clearInterval(virtualGuestsInterval);

  virtualGuestsInterval = setInterval(() => {
    const vg = virtualGuests[index];
    if (!vg) return;

    const messageText = vg.messages.shift();
    if (messageText) {
      const messageToSend = {
        text: messageText,
        bold: true,  // sve poruke će biti bold
        italic: true, // sve poruke će biti italic
        color: vg.color,
        underline: false,
        overline: false,
        nickname: vg.nickname,
        gradient: null,
        time: new Date().toLocaleTimeString('en-GB')
      };
      io.emit('chatMessage', messageToSend);
      vg.messages.push(messageText);
    }

    index = (index + 1) % virtualGuests.length;
  }, 30000);

  return virtualGuestsInterval;
}

// Na serveru primaš event za uključivanje/isključivanje virtualnih gostiju
function toggleVirtualGuests(io, guests, enabled) {
  if (enabled) {
    startVirtualGuests(io, guests);
  } else {
    if (virtualGuestsInterval) {
      clearInterval(virtualGuestsInterval);
      virtualGuestsInterval = null;
    }
    // Ukloni virtualne goste iz liste
    Object.keys(guests).forEach(id => {
      if (id.startsWith('virtual-')) {
        delete guests[id];
      }
    });
    io.emit('updateGuestList', Object.values(guests));
  }
}

module.exports = { startVirtualGuests, toggleVirtualGuests };



