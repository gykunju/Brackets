// 🟣 Change this when you deploy a new version
const CACHE_NAME = "brackets-pwa-v2";

self.addEventListener("install", (event) => {
  // Force the new service worker to activate immediately
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            // Delete old caches when a new version is activated
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  // Skip caching for chrome-extension and other unsupported schemes
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Serve from cache
        }
        return fetch(event.request).then((networkResponse) => {
          // Only cache GET requests with successful responses
          if (
            event.request.method === "GET" &&
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch((err) => {
          // Return a fallback response on fetch error
          console.log(err)
          return cachedResponse || new Response('Offline');
        });
      });
    })
  );
});
