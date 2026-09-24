export const outcomes = [
  { label: 'Pracuje', short: 'PRACUJE', emoji: '🛠️', photo: 'tomas.jpeg', line: 'Neuveriteľné. Niekto spravte screenshot. Toto sa už nemusí zopakovať.' },
  { label: 'Scroluje reels', short: 'REELS', emoji: '📱', photo: 'tomas.jpeg', line: 'Len ešte jedno. Povedal pred 47 minútami. Palec už má vlastný tréningový plán.' },
  { label: 'Volá s Klárou', short: 'VOLÁ KLÁRE', emoji: '☎️', photo: 'klara.jpg', line: '„Dobre, už končím.“ Sezóna 8, epizóda 126. Zákazník si zatiaľ založil rodinu.' },
  { label: 'Pozerá do steny', short: 'STENA', emoji: '🧱', photo: 'tomas.jpeg', line: 'Žiadne myšlienky. Iba omietka. Windows sa nepodarilo spustiť.' },
  { label: 'Myslí na Jakuba', short: 'JAKUB ♥', emoji: '💭', photo: 'jakub.png', line: 'Jakub tu má trvalý pobyt. V hlave. Zadarmo. Aj s energiami.' },
  { label: 'Myslí na tréning', short: 'TRÉNING', emoji: '💪', photo: 'tomas.jpeg', line: 'Mentálne už dal 120 na bench. Fyzicky stále sedí. Mindset je všetko.' },
  { label: 'Objednáva si jedlo', short: 'JEDLO', emoji: '🍔', photo: 'tomas.jpeg', line: 'Dnes zdravo. Takže burger so šalátom. Šalát je ten zelený kúsok pod slaninou.' },
  { label: 'Je na pumpe', short: 'PUMPA', emoji: '⛽', photo: 'tomas.jpeg', line: 'Prišiel natankovať. Odchádza s hotdogom, kávou a novým životným smerovaním.' },
  { label: 'Opravuje svetlá. Zákazník mu stojí za prdelou.', short: 'SVETLÁ + NPC', emoji: '🚘', photo: 'tomas.jpeg', line: '„A kedy to bude?“ Tomáš práve vnútorne opustil túto dimenziu. Toto absolútne nenávidí.' },
  { label: 'Posiela reelska Kláre', short: 'REELS → K', emoji: '💌', photo: 'klara.jpg', line: 'Toto musíš vidieť 😂 Toto tiež 😂 A toto 😂 Klára vypla upozornenia.' },
  { label: 'Posiela reelska Jakubovi', short: 'REELS → J', emoji: '📩', photo: 'jakub.png', line: '„My dvaja fr.“ Jakub má 38 neprečítaných správ. Všetky sú od jedného človeka.' },
  { label: 'Rieši inú pičovinu', short: 'INÁ PIČOVINA', emoji: '🤡', photo: 'tomas.jpeg', line: 'Ani koleso nevie, čo to je. Ale určite to nemá nič spoločné s tým, čo má robiť.' }
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
