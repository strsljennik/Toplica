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
  { nickname: 'Higijenicar', messages: ['Kuku Lele Mene, sto ove zene uprljaju nema muskarca koji to moze ocistiti, sta cu sada ??'], color: 'olive' },
  { nickname: 'Jasmina', messages: [' Plavi jasaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa   '], color: 'hotpink' },
  { nickname: 'Halime', messages: ['Higy ,Javi se kod X-a i trazi pomocnike '], color: 'purple' },
  { nickname: 'Security', messages: ['Dj pusti jednu od dzeja za mirne goste od mene '], color: 'blue' },
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


