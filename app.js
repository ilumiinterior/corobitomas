import { outcomes, palettes, segmentDegrees, segmentCenter, targetRotation, randomIndex } from './data.js';
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
let theme = read('tomas-theme', 'citron');
if (!Object.hasOwn(palettes, theme)) theme = 'citron';
let colors = palettes[theme].colors;
const ns = 'http://www.w3.org/2000/svg';
outcomes.forEach((option, i) => {
  const angle = Math.PI * 2 / outcomes.length, start = i * angle - Math.PI / 2, end = start + angle;
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', `M300 300 L${300+297*Math.cos(start)} ${300+297*Math.sin(start)} A297 297 0 0 1 ${300+297*Math.cos(end)} ${300+297*Math.sin(end)} Z`);
  path.setAttribute('fill', colors[i % colors.length]); path.setAttribute('stroke', 'var(--wheel-ink)'); path.setAttribute('stroke-width', '2'); $('wheel').append(path);
  const text = document.createElementNS(ns, 'text');
  text.setAttribute('transform', `translate(300 300) rotate(${segmentCenter(i) - 90})`);
  text.setAttribute('x', '272'); text.setAttribute('y', '6'); text.setAttribute('text-anchor', 'end');
  text.setAttribute('fill', 'var(--wheel-ink)'); text.setAttribute('font-family', 'Barlow Condensed, Impact, sans-serif'); text.setAttribute('font-size', '19'); text.setAttribute('font-weight', '800'); text.textContent = option.short; $('wheel').append(text);
  const li = document.createElement('li'); li.textContent = `${option.emoji} ${option.label}`; $('options-list').append(li);
});
function updateSettings() {
  $('sound').setAttribute('aria-pressed', String(sound)); $('sound').setAttribute('aria-label', sound ? 'Vypnúť zvuk' : 'Zapnúť zvuk'); $('sound').title = sound ? 'Vypnúť zvuk' : 'Zapnúť zvuk'; $('sound').querySelector('span').textContent = `Zvuk: ${sound ? 'ON' : 'OFF'}`;
  document.body.classList.toggle('reduced-motion', reduced); $('motion').setAttribute('aria-pressed', String(reduced)); $('motion').setAttribute('aria-label', reduced ? 'Zapnúť viac chaosu' : 'Obmedziť animácie'); $('motion').querySelector('span').textContent = reduced ? 'Animácie: vypnuté' : 'Animácie: zapnuté';
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
  if (!history.length) { const li = document.createElement('li'); li.className = 'empty-history'; li.textContent = 'Zatiaľ žiadna veštba. Roztoč koleso. ↗'; $('history').append(li); }
  history.forEach(item => { const option = outcomes[item.index], li = document.createElement('li'), emoji = document.createElement('span'), title = document.createElement('strong'), time = document.createElement('time'); emoji.className = 'history-emoji'; emoji.textContent = option.emoji; title.textContent = option.label; time.dateTime = new Date(item.time).toISOString(); time.textContent = new Date(item.time).toLocaleTimeString('sk-SK', { hour:'2-digit', minute:'2-digit' }); li.append(emoji,title,time); $('history').append(li); });
}
function celebrate() {
  if (reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $('confetti').replaceChildren();
  for (let i = 0; i < 18; i++) { const bit = document.createElement('span'); bit.className = 'confetto'; bit.textContent = ['✦', '●', '💀', '✳', outcomes[selected].emoji][i%5]; bit.style.left = `${Math.random()*100}%`; bit.style.color = colors[i%colors.length]; bit.style.setProperty('--delay', `${Math.random()*.5}s`); bit.style.setProperty('--drift', `${Math.random()*240-120}px`); $('confetti').append(bit); }
  setTimeout(() => $('confetti').replaceChildren(), 3200);
}
function reveal(index) {
  selected = index; const option = outcomes[index]; count++; history.unshift({ index, time: Date.now() }); history = history.slice(0,10); save('tomas-history',history); save('tomas-count',count);
  $('result-title').textContent = option.label.toLocaleUpperCase('sk'); $('result-description').textContent = option.line; $('result-photo').src = `./${option.photo}`; $('result-photo').alt = option.photo.startsWith('klara') ? 'Klára' : option.photo.startsWith('jakub') ? 'Jakub' : 'Tomáš'; $('result-emoji').textContent = option.emoji; $('photo-caption').textContent = option.photo.startsWith('klara') ? 'Klára v zábere' : option.photo.startsWith('jakub') ? 'Jakub v zábere' : 'Tomáš v zábere'; $('result-kicker').textContent = 'KOLESO ROZHODLO. BEZ DÔKAZOV.';
  $('result').classList.add('revealed', 'reveal-pop'); $('result').classList.toggle('long-result', option.label.length > 42); $('share').hidden = false; $('status').textContent = '● VEŠTBA JE NA SVETE.'; $('spin-label').textContent = 'EŠTE JEDNU PIČOVINU'; $('spin').disabled = false; $('spin').removeAttribute('aria-busy'); document.body.classList.remove('spinning'); spinning = false; renderHistory(); celebrate(); [523,659,784,1047].forEach((f,i) => beep(f,.13,i*.11));
  document.body.classList.add('has-result');
  if (matchMedia('(max-width: 700px)').matches) $('result').scrollIntoView({behavior: calm() ? 'instant' : 'smooth', block:'center'});
}
function spin() {
  if (spinning) return; spinning = true; if(sound) initAudio();
  const index = randomIndex(), from = rotation, to = targetRotation(rotation,index), duration = reduced || matchMedia('(prefers-reduced-motion: reduce)').matches ? 200 : 5200, started = performance.now(); let lastTick = -1, phase = -1;
  $('spin').disabled = true; $('spin').setAttribute('aria-busy','true'); $('spin-label').textContent = 'KOLESO SA TOČÍ…'; $('share').hidden = true; $('result').classList.remove('reveal-pop'); document.body.classList.add('spinning'); $('status').textContent = '● LOSOVANIE PREBIEHA.';
  if (matchMedia('(max-width: 700px)').matches) wheelZone.scrollIntoView({behavior: calm() ? 'instant' : 'smooth', block:'center'});
  const messages = ['Tomášova posledná mozgová bunka čaká…','Prechádzam neprečítané reelska…','Zákazník sa nebezpečne približuje…','Koleso už skoro stojí…'];
  function frame(now) { const t = Math.min(1,(now-started)/duration); rotation = from + (to-from)*(1-Math.pow(1-t,4)); $('wheel').style.transform = `rotate(${rotation}deg)`; const tick = Math.floor(rotation/segmentDegrees); if(tick!==lastTick){beep(280+Math.min(t*400,400));lastTick=tick;} const nextPhase = Math.min(3,Math.floor(t*4)); if(phase!==nextPhase){phase=nextPhase;$('result-kicker').textContent=messages[phase];} if(t<1)requestAnimationFrame(frame);else{rotation=to%360;$('wheel').style.transform=`rotate(${rotation}deg)`;reveal(index);} }
  requestAnimationFrame(frame);
}
$('spin').addEventListener('click',spin);
document.addEventListener('keydown', e => { if(e.code==='Space' && !e.repeat && !['BUTTON','INPUT','TEXTAREA','SELECT','SUMMARY','A'].includes(document.activeElement.tagName) && !$('install-dialog').open){e.preventDefault();spin();} });
$('sound').addEventListener('click',()=>{sound=!sound;save('tomas-sound',sound);if(sound)initAudio();updateSettings();beep(660,.08);});
$('motion').addEventListener('click',()=>{reduced=!reduced;save('tomas-motion',reduced);updateSettings();});
$('clear-history').addEventListener('click',()=>{history=[];save('tomas-history',history);renderHistory();toast('História vymazaná. Začíname odznova.');});
$('share').addEventListener('click',async()=>{
  if(selected===null)return; const text=`Čo robí Tomáš? ${outcomes[selected].emoji} ${outcomes[selected].label}. ${outcomes[selected].line}`, url=location.href.split('#')[0];
  try { if(navigator.share)await navigator.share({title:'Čo robí Tomáš?',text,url});else if(navigator.clipboard){await navigator.clipboard.writeText(`${text}\n${url}`);toast('Skopírované. Šír túto zbytočnú informáciu.');}else toast('Zdieľanie tu nefunguje. Skopíruj adresu stránky.'); } catch(e){if(e.name!=='AbortError')toast('Zdieľanie sa nepodarilo. Skús skopírovať adresu stránky.');}
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;});
$('install').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;}else if(matchMedia('(display-mode: standalone)').matches)toast('Tomáš už býva v tvojom mobile.');else $('install-dialog').showModal();});
$('close-install').addEventListener('click',()=>$('install-dialog').close());
window.addEventListener('appinstalled',()=>{installPrompt=null;toast('Tomáš sa úspešne nasťahoval.');});
const network=()=>{$('offline-status').textContent=navigator.onLine?'FUNGUJE AJ BEZ INTERNETU.':'SI OFFLINE. KOLESO FUNGUJE ĎALEJ.';};window.addEventListener('online',network);window.addEventListener('offline',network);network();
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  colors = palettes[theme].colors;
  $('theme').value = theme;
  document.querySelector('meta[name="theme-color"]').content = palettes[theme].chrome;
  document.querySelectorAll('#wheel path').forEach((path, i) => path.setAttribute('fill', colors[i % colors.length]));
}
$('theme').addEventListener('change', () => { theme = $('theme').value; save('tomas-theme', theme); applyTheme(); });
applyTheme();updateSettings();renderHistory();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
