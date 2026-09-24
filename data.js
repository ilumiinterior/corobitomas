export const outcomes = [
  { label: 'Pracuje', short: 'PRACUJE', emoji: '🛠️', photo: 'tomas.jpeg', line: 'Normálne pracuje. Niekto to odfoťte, lebo nám to nikto neuverí.' },
  { label: 'Scroluje reels', short: 'REELS', emoji: '📱', photo: 'tomas.jpeg', line: '„Ešte jedno a idem robiť.“ Túto vetu povedal už pred 47 minútami.' },
  { label: 'Volá s Klárou', short: 'VOLÁ KLÁRE', emoji: '☎️', photo: 'klara.jpg', line: '„Už musím končiť.“ O päť minút neskôr stále volajú. A potom ešte päť.' },
  { label: 'Pozerá do steny', short: 'STENA', emoji: '🧱', photo: 'tomas.jpeg', line: 'Pozerá do steny. Stena mu zatiaľ nič nepovedala. Dobrý pokec.' },
  { label: 'Myslí na Jakuba', short: 'JAKUB ♥', emoji: '💭', photo: 'jakub.png', line: 'Jakub má v Tomášovej hlave trvalý pobyt. Nájomné? Nula eur.' },
  { label: 'Myslí na tréning', short: 'TRÉNING', emoji: '💪', photo: 'tomas.jpeg', line: 'V hlave už odcvičil celý tréning. Teraz ešte presvedčiť nohy.' },
  { label: 'Objednáva si jedlo', short: 'JEDLO', emoji: '🍔', photo: 'tomas.jpeg', line: 'Otvoril menu „len sa pozrieť“. O tri minúty už sleduje kuriéra na mape.' },
  { label: 'Je na pumpe', short: 'PUMPA', emoji: '⛽', photo: 'tomas.jpeg', line: 'Zastavil na pumpe. Potreboval benzín, odišiel aj s hotdogom a kávou.' },
  { label: 'Opravuje svetlá na aute a zákazník mu stojí za prdelou', short: 'SVETLÁ + NPC', emoji: '🚘', photo: 'tomas.jpeg', line: 'Tomáš opravuje svetlá. Zákazník mu dýcha na krk a každú chvíľu sa pýta, kedy to bude. Tomáš to nenávidí.' },
  { label: 'Posiela reelska Kláre', short: 'REELS → K', emoji: '💌', photo: 'klara.jpg', line: '„Toto musíš vidieť.“ A hneď posiela ďalšie tri. Klárin mobil si pýta dovolenku.' },
  { label: 'Posiela reelska Jakubovi', short: 'REELS → J', emoji: '📩', photo: 'jakub.png', line: 'Jakubovi pristálo ďalšie reelsko. Všetky sú vraj „presne o nás dvoch“.' },
  { label: 'Rieši inú pičovinu', short: 'INÁ PIČOVINA', emoji: '🤡', photo: 'tomas.jpeg', line: 'Čo presne rieši, nevie ani koleso. Ale vyzerá pri tom veľmi zaneprázdnene.' }
];
export const colors = ['#e9ff57', '#ff87bb', '#b7a0ef', '#f9f3df', '#ff9772', '#b7a0ef', '#e9ff57', '#ff87bb', '#f9f3df', '#ff9772', '#b7a0ef', '#ff87bb'];
export function targetRotation(current, index, turns = 6) {
  const target = (360 - (index + 0.5) * (360 / outcomes.length)) % 360;
  return current + turns * 360 + ((target - current % 360 + 360) % 360);
}
export function indexAtRotation(rotation) {
  return Math.floor(((360 - rotation % 360) % 360) / (360 / outcomes.length));
}
export function randomIndex() {
  const values = new Uint32Array(1), limit = Math.floor(2 ** 32 / outcomes.length) * outcomes.length;
  do { crypto.getRandomValues(values); } while (values[0] >= limit);
  return values[0] % outcomes.length;
}
