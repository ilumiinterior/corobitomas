import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive:true });
for (const file of ['index.html','style.css','app.js','data.js','sw.js','manifest.webmanifest','icon.svg','tomas.jpeg','klara.jpg','jakub.png']) await copyFile(file,`dist/${file}`);
await cp('icons','dist/icons',{recursive:true});
await cp('music','dist/music',{recursive:true});
console.log('Hotovo: dist/ — pripravené pre Vercel.');
