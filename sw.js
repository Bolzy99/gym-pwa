const cacheName = 'gym-pwa-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache static files
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

// Fetch event - use cache for static, bypass for external/webhooks
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If it's a request to an external API or webhook, don't cache
  if (url.origin.includes('ngrok-free.app') || url.pathname.includes('/webhook-test/')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response("Network error"))
    );
    return;
  }

  // Otherwise, serve from cache or fetch if not cached
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});