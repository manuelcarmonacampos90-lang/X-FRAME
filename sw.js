// Xframe service worker — caché completa para uso sin conexión
const CACHE='xframe-45b0f8bedc';
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url); if(u.origin!==location.origin)return;
  // red primero para la página (coge actualizaciones), caché si no hay conexión; caché primero para el resto
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put('./',c));return r;}).catch(()=>caches.match('./').then(r=>r||caches.match('index.html'))));return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));return res;})));
});
