# Čo robí Tomáš?

Slovenská meme PWA: 12 rovnako pravdepodobných výsledkov, animované koleso, tri pôvodné fotky, syntetické zvuky (predvolene vypnuté), konfety, história posledných 10 výsledkov a zdieľanie. Rešpektuje systémové obmedzenie pohybu a má vlastný prepínač animácií. Bez backendu, analytiky a runtime závislostí. História sa ukladá iba v prehliadači.

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

## PWA

Inštalácia tlačidlom „Do mobilu“, prípadne cez menu prehliadača. iPhone: Safari → Zdieľať → Pridať na plochu. Vyžaduje HTTPS (na localhost funguje aj HTTP). Po prvom úspešnom načítaní sa aplikácia uloží do offline cache. Pri ďalšej verzii zmeň `CACHE` v `sw.js`, aby sa obnovili súbory. Google Fonts sú voliteľné; bez internetu fungujú lokálne záložné fonty.

## Úpravy

- Možnosti, hlášky, fotky a farby: `data.js`.
- Vzhľad: `style.css`.
- Výraznejší meme vzhľad a mobilné rozloženie: `chaos.css`. Na mobile je tlačidlo pevne pri spodnom okraji; pri žrebovaní sa zobrazí koleso a potom výsledok. Animácie rešpektujú systémové obmedzenie pohybu.
- Správanie: `app.js`.
- App ikony: `icons/`, favicon: `icon.svg`.

Ide o náhodný vtip, nie skutočné zisťovanie polohy alebo aktivity.
