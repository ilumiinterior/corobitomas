const CACHE = 'tomas-v5';
const ASSETS = ['./','./index.html','./style.css','./app.js','./data.js','./music/tomas-song.mp3','./tomas.jpeg','./jakub.png','./klara.jpg','./manifest.webmanifest','./icon.svg','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('tomas-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/music/tomas-song.mp3') && event.request.headers?.get('range')) {
    event.respondWith((async()=>{
      const file = await caches.match(event.request.url) || await fetch(event.request.url);
      const bytes = await file.arrayBuffer();
      const range = /^bytes=(\d+)-(\d*)$/.exec(event.request.headers.get('range'));
      if (!range) return file;
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), bytes.byteLength - 1) : bytes.byteLength - 1;
      if (start >= bytes.byteLength || start > end) return new Response(null, {status:416,headers:{'Content-Range': `bytes */${bytes.byteLength}`}});
      return new Response(bytes.slice(start, end + 1), {status:206,headers:{
        'Content-Type':'audio/mpeg', 'Accept-Ranges':'bytes',
        'Content-Range':`bytes ${start}-${end}/${bytes.byteLength}`,
        'Content-Length':String(end - start + 1)
      }});
    })());
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)));}return response;}).catch(()=>caches.match('./index.html')));return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
