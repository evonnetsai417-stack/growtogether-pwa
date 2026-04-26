const CACHE = 'growtogether-v1';

// 本地資源
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './animals.jsx',
  './animals2.jsx',
  './ui.jsx',
  './screens.jsx',
  './minigames.jsx',
  './players.jsx',
  './app.jsx',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(LOCAL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 本地資源：cache first
  if (e.request.url.includes(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
    return;
  }
  // CDN 資源（React、Babel、Fonts）：cache first，第一次 online 後離線可用
  e.respondWith(
    caches.match(e.request).then(r => {
      if (r) return r;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
