import { outcomes, colors, targetRotation, randomIndex } from './data.js';
const $ = id => document.getElementById(id);
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
let history = read('tomas-history', []);
history = Array.isArray(history) ? history.filter(x => x && Number.isInteger(x.index) && outcomes[x.index] && Number.isFinite(x.time)).slice(0, 10) : [];
let count = read('tomas-count', 0); if (!Number.isSafeInteger(count) || count < 0) count = 0;
let sound = read('tomas-sound', false) === true;
let reduced = read('tomas-motion', matchMedia('(prefers-reduced-motion: reduce)').matches) === true;
let rotation = 0, spinning = false, selected = null, audio, installPrompt, toastTimeout;
const calm = () => reduced || matchMedia('(prefers-reduced-motion: reduce)').matches;
const wheelZone = document.querySelector('.wheel-zone');
const commentary = document.createElement('div');
commentary.className = 'brain-commentary'; commentary.setAttribute('aria-hidden','true');
commentary.innerHTML = '<span class="brain-label">V HLAVE PRÁVE PREBIEHA</span><strong>nič. absolútne nič.</strong>';
wheelZone.append(commentary);
const peanutGallery = document.createElement('div');
peanutGallery.className = 'peanut-gallery'; peanutGallery.setAttribute('aria-hidden','true');
peanutGallery.innerHTML = '<div class="spectator spectator-klara"><img src="./klara.jpg" alt=""><span>zdvihni mi 💅</span></div><div class="spectator spectator-jakub"><img src="./jakub.png" alt=""><span>bro sa načítava 💀</span></div>';
document.querySelector('.wheel-wrap').append(peanutGallery);
const spinDock = document.createElement('div'); spinDock.className = 'spin-dock';
$('spin').before(spinDock); spinDock.append($('spin'), document.querySelector('.under-button'));
$('install').setAttribute('aria-label','Nainštalovať aplikáciu do mobilu');
const verdict = document.createElement('span'); verdict.className = 'verdict-sticker'; verdict.setAttribute('aria-hidden','true'); verdict.textContent = 'WTF?!'; $('result').append(verdict);
const ns = 'http://www.w3.org/2000/svg';
outcomes.forEach((option, i) => {
  const angle = Math.PI * 2 / outcomes.length, start = i * angle - Math.PI / 2, end = start + angle;
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', `M300 300 L${300+297*Math.cos(start)} ${300+297*Math.sin(start)} A297 297 0 0 1 ${300+297*Math.cos(end)} ${300+297*Math.sin(end)} Z`);
  path.setAttribute('fill', colors[i]); path.setAttribute('stroke', '#25221e'); path.setAttribute('stroke-width', '2'); $('wheel').append(path);
  const text = document.createElementNS(ns, 'text');
  text.setAttribute('transform', `translate(300 300) rotate(${i * 30 + 15 - 90})`);
  text.setAttribute('x', '272'); text.setAttribute('y', '6'); text.setAttribute('text-anchor', 'end');
  text.setAttribute('fill', '#25221e'); text.setAttribute('font-family', 'Barlow Condensed, Impact, sans-serif'); text.setAttribute('font-size', '19'); text.setAttribute('font-weight', '800'); text.textContent = option.short; $('wheel').append(text);
  const li = document.createElement('li'); li.textContent = `${option.emoji} ${option.label}`; $('options-list').append(li);
});
function updateSettings() {
  $('sound').setAttribute('aria-pressed', String(sound)); $('sound').setAttribute('aria-label', sound ? 'Vypnúť zvuk' : 'Zapnúť zvuk'); $('sound').title = sound ? 'Vypnúť zvuk' : 'Zapnúť zvuk'; $('sound').querySelector('span').textContent = `Zvuk: ${sound ? 'ON' : 'OFF'}`;
  document.body.classList.toggle('reduced-motion', reduced); $('motion').setAttribute('aria-pressed', String(reduced)); $('motion').setAttribute('aria-label', reduced ? 'Zapnúť viac chaosu' : 'Obmedziť animácie'); $('motion').querySelector('span').textContent = reduced ? 'Viac chaosu' : 'Menej chaosu';
}
function initAudio() { try { audio ??= new (window.AudioContext || window.webkitAudioContext)(); audio.resume().catch(() => {}); } catch {} }
function beep(frequency = 420, duration = .035, delay = 0) {
  if (!sound || !audio || audio.state !== 'running') return;
  const oscillator = audio.createOscillator(), gain = audio.createGain(), start = audio.currentTime + delay;
  oscillator.type = 'square'; oscillator.frequency.value = frequency; gain.gain.setValueAtTime(.025, start); gain.gain.exponentialRampToValueAtTime(.001, start + duration); oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(start); oscillator.stop(start + duration); oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}
function toast(message) { clearTimeout(toastTimeout); $('toast').textContent = message; $('toast').hidden = false; toastTimeout = setTimeout(() => $('toast').hidden = true, 3500); }
function renderHistory() {
  $('history').replaceChildren(); $('history-count').textContent = `(${history.length})`; $('clear-history').hidden = history.length === 0; $('spin-number').textContent = `#${String(count).padStart(3, '0')}`;
  if (!history.length) { const li = document.createElement('li'); li.className = 'empty-history'; li.textContent = 'Zatiaľ čistý register. Podozrivé. Roztoč prvé kolo. ↗'; $('history').append(li); }
  history.forEach(item => { const option = outcomes[item.index], li = document.createElement('li'), emoji = document.createElement('span'), title = document.createElement('strong'), time = document.createElement('time'); emoji.className = 'history-emoji'; emoji.textContent = option.emoji; title.textContent = option.label; time.dateTime = new Date(item.time).toISOString(); time.textContent = new Date(item.time).toLocaleTimeString('sk-SK', { hour:'2-digit', minute:'2-digit' }); li.append(emoji,title,time); $('history').append(li); });
}
function celebrate() {
  if (reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $('confetti').replaceChildren();
  for (let i = 0; i < 36; i++) { const bit = document.createElement('span'); bit.className = 'confetto'; bit.textContent = ['✦', '●', '💀', '✳', outcomes[selected].emoji][i%5]; bit.style.left = `${Math.random()*100}%`; bit.style.color = colors[i%colors.length]; bit.style.setProperty('--delay', `${Math.random()*.5}s`); bit.style.setProperty('--drift', `${Math.random()*240-120}px`); $('confetti').append(bit); }
  setTimeout(() => $('confetti').replaceChildren(), 3200);
  for (let i = 0; i < 7; i++) {
    const face = document.createElement('img'); face.className = 'confetto flying-face'; face.src = `./${i % 3 === 0 ? outcomes[selected].photo : 'tomas.jpeg'}`; face.alt = ''; face.style.left = `${8+Math.random()*78}%`; face.style.setProperty('--delay', `${i*.12}s`); face.style.setProperty('--drift', `${Math.random()*160-80}px`); $('confetti').append(face);
  }
}
function reveal(index) {
  selected = index; const option = outcomes[index]; count++; history.unshift({ index, time: Date.now() }); history = history.slice(0,10); save('tomas-history',history); save('tomas-count',count);
  $('result-title').textContent = option.label.toLocaleUpperCase('sk'); $('result-description').textContent = option.line; $('result-photo').src = `./${option.photo}`; $('result-photo').alt = option.photo.startsWith('klara') ? 'Klára' : option.photo.startsWith('jakub') ? 'Jakub' : 'Tomáš'; $('result-emoji').textContent = option.emoji; $('photo-caption').textContent = ['prichytený v 4K','zdroj: vesmír','absolútny cinema'][count%3]; $('result-kicker').textContent = 'VESMÍR ROZHODOL. BOHUŽIAĽ.';
  $('result').classList.add('revealed', 'reveal-pop'); $('share').hidden = false; $('status').textContent = '● PRÍPAD VYRIEŠENÝ. ASI.'; $('spin-label').textContent = 'EŠTE JEDNU PIČOVINU'; $('spin').disabled = false; $('spin').removeAttribute('aria-busy'); document.body.classList.remove('spinning'); spinning = false; renderHistory(); celebrate(); [523,659,784,1047].forEach((f,i) => beep(f,.13,i*.11));
  commentary.querySelector('strong').textContent = ['absolútny cinema.','bro má vlastný vesmír.','posledná bunka dala výpoveď.','toto nevymyslíš.'][count % 4];
  verdict.textContent = index === 0 ? 'ZÁZRAK!' : index === 8 ? 'RIP 💀' : ['BRUH.','WTF?!','NO WAY','💀 💀 💀'][count % 4];
  document.body.classList.add('has-result');
  if (matchMedia('(max-width: 700px)').matches) $('result').scrollIntoView({behavior: calm() ? 'instant' : 'smooth', block:'center'});
}
function spin() {
  if (spinning) return; spinning = true; if(sound) initAudio();
  const index = randomIndex(), from = rotation, to = targetRotation(rotation,index), duration = reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 5200, started = performance.now(); let lastTick = -1, phase = -1;
  $('spin').disabled = true; $('spin').setAttribute('aria-busy','true'); $('spin-label').textContent = 'KONTAKTUJEM VESMÍR…'; $('share').hidden = true; $('result').classList.remove('reveal-pop'); document.body.classList.add('spinning'); $('status').textContent = '● PREBIEHA ABSOLÚTNE SERIÓZNY VÝSKUM.';
  if (matchMedia('(max-width: 700px)').matches) wheelZone.scrollIntoView({behavior: calm() ? 'instant' : 'smooth', block:'center'});
  const messages = ['Skenujem poslednú mozgovú bunku…','Kontrolujem neprečítané reels…','Zákazník sa nebezpečne približuje…','Dobre. Toto bude bolieť.'];
  function frame(now) { const t = Math.min(1,(now-started)/duration); rotation = from + (to-from)*(1-Math.pow(1-t,4)); $('wheel').style.transform = `rotate(${rotation}deg)`; const tick = Math.floor(rotation/30); if(tick!==lastTick){beep(280+Math.min(t*400,400));lastTick=tick;} const nextPhase = Math.min(3,Math.floor(t*4)); if(phase!==nextPhase){phase=nextPhase;$('result-kicker').textContent=messages[phase];commentary.querySelector('strong').textContent=['mozog.exe prestal pracovať','Klára píše… píše… píše…','NEOTÁČAJ SA. ZÁKAZNÍK.','posledná bunka ide ALL IN'][phase];document.querySelector('.hub span').textContent=['HELP 💀','404 MOZOG','BRO???','UŽ TO IDE'][phase];} if(t<1)requestAnimationFrame(frame);else{rotation=to%360;$('wheel').style.transform=`rotate(${rotation}deg)`;document.querySelector('.hub span').textContent='ON TO VIE?';reveal(index);} }
  requestAnimationFrame(frame);
}
$('spin').addEventListener('click',spin);
document.addEventListener('keydown', e => { if(e.code==='Space' && !e.repeat && !['BUTTON','INPUT','TEXTAREA','SELECT','SUMMARY','A'].includes(document.activeElement.tagName) && !$('install-dialog').open){e.preventDefault();spin();} });
$('sound').addEventListener('click',()=>{sound=!sound;save('tomas-sound',sound);if(sound)initAudio();updateSettings();beep(660,.08);});
$('motion').addEventListener('click',()=>{reduced=!reduced;save('tomas-motion',reduced);updateSettings();});
$('clear-history').addEventListener('click',()=>{history=[];save('tomas-history',history);renderHistory();toast('Stopy zahladené. Tomáš je nevinný.');});
$('share').addEventListener('click',async()=>{
  if(selected===null)return; const text=`Čo robí Tomáš? ${outcomes[selected].emoji} ${outcomes[selected].label}. ${outcomes[selected].line}`, url=location.href.split('#')[0];
  try { if(navigator.share)await navigator.share({title:'Čo robí Tomáš?',text,url});else if(navigator.clipboard){await navigator.clipboard.writeText(`${text}\n${url}`);toast('Skopírované. Šír túto zbytočnú informáciu.');}else toast('Zdieľanie tu nefunguje. Skopíruj adresu stránky.'); } catch(e){if(e.name!=='AbortError')toast('Zdieľanie sa nepodarilo. Skús skopírovať adresu stránky.');}
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
$('install').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else if(matchMedia('(display-mode: standalone)').matches)toast('Tomáš už býva v tvojom mobile.');else $('install-dialog').showModal();});
$('close-install').addEventListener('click',()=>$('install-dialog').close());
window.addEventListener('appinstalled',()=>{installPrompt=null;toast('Tomáš sa úspešne nasťahoval.');});
const network=()=>{$('offline-status').textContent=navigator.onLine?'MOZOG OFFLINE. APPKA ONLINE.':'BEZ NETU. PIČOVINY FUNGUJÚ ĎALEJ.';};window.addEventListener('online',network);window.addEventListener('offline',network);network();
updateSettings();renderHistory();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
