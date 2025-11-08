const CACHE_NAME = 'hiero-ai-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  // Note: In a real build, you'd cache the compiled JS/CSS files.
  // This is a simplified example for the given file structure.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
