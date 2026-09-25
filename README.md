# Čo robí Tomáš?

Slovenská meme PWA: 13 rovnako pravdepodobných výsledkov, animované koleso, tri pôvodné fotky, hudba na pozadí (predvolene zapnutá) a syntetické zvuky, konfety, história posledných 10 výsledkov a zdieľanie. Rešpektuje systémové obmedzenie pohybu a má vlastný prepínač animácií. Bez backendu, analytiky a runtime závislostí. História sa ukladá iba v prehliadači.

## Spustenie

Node.js 20 alebo novší:

```sh
npm run dev
```

Otvor http://localhost:3000. Na Windows pri blokovaní PowerShell skriptov použi `npm.cmd run dev`.

```sh
npm test
npm run build
```

## GitHub → Vercel

Nahraj celý projekt do GitHub repozitára (vrátane fotiek a priečinka `icons`). Vo Verceli importuj repozitár. Framework preset: **Other**, build: `npm run build`, output: `dist`. Konfiguráciu obsahuje `vercel.json`; nie sú potrebné premenné prostredia ani databáza. Priečinok `dist` sa generuje pri builde a nepatrí do Gitu.

## Hudba

Skladba `music/tomas-song.mp3` sa prehráva v slučke. Zvuk je predvolene zapnutý a prepínač v hornej lište ovláda hudbu aj zvuky kolesa. Prehliadače môžu zablokovať automatické prehrávanie so zvukom; vtedy sa v lište zobrazí „Pustiť hudbu“ a skladba sa spustí pri prvom ťuknutí. Nastavenie zvuku sa ukladá v prehliadači. MP3 sa ukladá aj do offline cache.

## PWA

Inštalácia cez Nastavenia → Pridať do mobilu, prípadne cez menu prehliadača. iPhone: Safari → Zdieľať → Pridať na plochu. Vyžaduje HTTPS (na localhost funguje aj HTTP). Po prvom úspešnom načítaní sa aplikácia uloží do offline cache. Pri ďalšej verzii zmeň `CACHE` v `sw.js`, aby sa obnovili súbory. Google Fonts sú voliteľné; bez internetu fungujú lokálne záložné fonty.

## Úpravy

- Možnosti, hlášky, fotky a farby: `data.js`.
- Vzhľad: `style.css`.
- Správanie: `app.js`.
- App ikony: `icons/`, favicon: `icon.svg`.

Ide o náhodný vtip, nie skutočné zisťovanie polohy alebo aktivity.

## Farebné témy a rozhranie

Nastavenia → Farebná téma: Citrón, Nočná šichta alebo Žuvačka. Voľba sa uloží v prehliadači a mení celú aplikáciu aj koleso. Históriu a všetky možnosti otvoríš pod kolesom. Bežiaci pás, nálepky, vedľajšie portréty a padajúce tváre boli odstránené, aby zostalo v centre koleso a výsledok.
