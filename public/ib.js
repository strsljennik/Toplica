// textEmojiMap.js
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
  '#1': '❤️',
  '^^': '😄',
  ':*': '😘',
  '#iva': '🎶🎶🎶🎶🎵🎶🎶🎵',
  ':fire:': '🔥',
   '#dia': '💎💎💎💎💎💎💎💎💎💎💎💎💎💎',
   '#2': '❤🧡💛💚💙💜🤎🖤💖💗💓🤍',
  ':star:': '⭐',
  ':ok:': '👌',
  ':cool:': '😎',
  ':thumb:': '👍',
  ':pray:': '🙏',
  ':clap:': '👏',
   '#dg': '#n Dobro Dosli, Sa Vama Je Dj Dia ',
  '#ix': 'Za Inci Biserku Od *__X__*😎',
  '#ha': 'Hulija❤️Ates'
};

function replaceTextEmoji(msg) {
  for (const key in textEmojiMap) {
    msg = msg.replaceAll(key, textEmojiMap[key]);
  }
  return msg;
}


