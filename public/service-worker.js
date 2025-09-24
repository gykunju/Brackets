self.addEventListener("install", (event) => {
    self.skipWaiting();
})

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.open('brackets-pwa-v1').then((cache) => {
            return cache.match(event.request).then((response) => {
                return (
                    response ||
                    fetch(event.request).then((networkResponse) => {
                        if (
                            event.request.method === "GET" &&
                            networkResponse && 
                            networkResponse.status === 200 &&
                            networkResponse.type === "basic"
                        ) {
                            cache.put(event.request, networkResponse.clone())
                        }
                        return networkResponse
                    })
                )
            })
        })
    )
})