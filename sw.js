const cacheName = 'gym-pwa-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch event - network-first for external URLs, cache-first for local
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache for external requests like ngrok
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
