// Reviva service worker — cache simples para funcionar offline.
const CACHE = 'reviva-v2-10';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.svg', '/icon-512.svg', '/icon-192.png', '/icon-512.png', '/favicon.svg', '/apple-touch-icon.png', '/privacidade.html', '/termos.html', '/suporte.html', '/native.js', '/conteudo.js', '/livro.js', '/livro/capa.jpg', '/fonts/fonts.css', '/fonts/fraunces-latin-400-normal.woff2', '/fonts/fraunces-latin-500-normal.woff2', '/fonts/fraunces-latin-600-normal.woff2', '/fonts/karla-latin-400-normal.woff2', '/fonts/karla-latin-500-normal.woff2', '/fonts/karla-latin-700-normal.woff2', '/fonts/karla-latin-800-normal.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Rede primeiro (sempre a versão mais nova), cache como reserva offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
  );
});
