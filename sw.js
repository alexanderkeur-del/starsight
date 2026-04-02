const CACHE = 'starsight-v6';
const FONT_CACHE = 'starsight-fonts-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './engine.js',
  './manifest.json',
  './icon.svg',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE && k !== FONT_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET and API requests
  if (e.request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;

  // Google Fonts: cache-first (immutable resources)
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    e.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(response => {
            if (response.ok) {
              cache.put(e.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // Same-origin: network-first, fall back to cache, then cached "/"
  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(e.request).then(cached =>
            cached || caches.match('./')
          )
        )
    );
    return;
  }
});
