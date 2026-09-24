import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

test('Service worker installs all assets and serves the app and photos offline', async()=>{
  const handlers={}, stored=new Map(); let claimed=false;
  const cache={addAll:async assets=>{for(const asset of assets){const file=asset==='./'?'index.html':asset.slice(2);stored.set(asset,await readFile(file));}},match:async key=>stored.get(typeof key==='string'?key:key.url.replace('https://tomas.test/','./'))};
  const caches={open:async()=>cache,keys:async()=>['tomas-v1'],match:cache.match,delete:async()=>true};
  vm.runInNewContext(await readFile('sw.js','utf8'),{self:{addEventListener:(name,handler)=>handlers[name]=handler,skipWaiting:async()=>{},clients:{claim:async()=>{claimed=true;}},location:{origin:'https://tomas.test'}},caches,URL,fetch:async()=>{throw new Error('Offline');}});
  let pending;handlers.install({waitUntil:p=>pending=p});await pending;
  handlers.activate({waitUntil:p=>pending=p});await pending;assert.ok(claimed);
  for(const [pathname,mode] of [['/','navigate'],['/app.js','cors'],['/tomas.jpeg','cors'],['/jakub.png','cors'],['/klara.jpg','cors']]){
    handlers.fetch({request:{method:'GET',url:`https://tomas.test${pathname}`,mode},respondWith:p=>pending=p});assert.ok((await pending).length>0);
  }
});
test('Install icons and every local HTML asset exist', async()=>{
  const manifest=JSON.parse(await readFile('manifest.webmanifest','utf8'));
  for(const icon of manifest.icons){const data=await readFile(icon.src);assert.equal(data.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(data.readUInt32BE(20),Number(icon.sizes.split('x')[1]));}
  const html=await readFile('index.html','utf8');
  for(const match of html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g))await access(match[1]);
  const ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  const app=await readFile('app.js','utf8');for(const match of app.matchAll(/\$\('([^']+)'\)/g))assert.ok(ids.includes(match[1]),`Missing element ${match[1]}`);
});
