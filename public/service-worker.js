// self.addEventListener("install", (event) => {
//     self.skipWaiting();
// })

// self.addEventListener("activate", (event) => {
//     event.waitUntil(self.clients.claim());
// });

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         caches.open('brackets-pwa-v1').then((cache) => {
//             return cache.match(event.request).then((response) => {
//                 return (
//                     response ||
//                     fetch(event.request).then((networkResponse) => {
//                         if (
//                             event.request.method === "GET" &&
//                             networkResponse && 
//                             networkResponse.status === 200 &&
//                             networkResponse.type === "basic"
//                         ) {
//                             cache.put(event.request, networkResponse.clone())
//                         }
//                         return networkResponse
//                     })
//                 )
//             })
//         })
//     )
// })


// 🟣 Change this when you deploy a new version
const CACHE_NAME = 'brackets-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page or fallback
        return caches.match('/index.html');
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Brackets Notification';
  const options = {
    body: data.body || 'You have a new update!',
    icon: '/vite.svg',
    badge: '/vite.svg',
    data: data.data || {},
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement data sync logic here
  console.log('Syncing data...');
}

