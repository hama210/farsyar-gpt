const CACHE='farsiyar-shell-v2';
const ASSETS=['./','./index.html','./style.css','./app.js','./core.js','./content.js','./extra-content.js','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('farsiyar-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(event.request,{ignoreSearch:true});if(hit)return hit;try{return await fetch(event.request);}catch(err){if(event.request.mode==='navigate')return await c.match('./index.html');throw err;}}));});
self.addEventListener('message',event=>{if(event.data==='CHECK_CACHE')event.waitUntil(caches.open(CACHE).then(async c=>{const items=await Promise.all(ASSETS.map(p=>c.match(p)));event.ports[0]?.postMessage({ready:items.every(Boolean)});}));});
