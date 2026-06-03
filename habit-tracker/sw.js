const CACHE_NAME = "static-cache-v1";

// All paths are strictly relative (no leading slash)
const ASSETS_TO_CACHE = [
  "index.html",
  "src/css/styles.css",
  "src/js/app.js",
  "manifest.json",
  "public/icons/logo.svg",
  "public/icons/logo-192.png",
  "public/icons/logo-512.png",
];

// Install event: Cache everything locally
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
        console.warn("Cache.addAll failed for some assets:", error);
        // Installation continues even if some assets fail to cache
      });
    }),
  );
  self.skipWaiting();
});

// Activate event: Take control immediately (don't delete old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: Stale-while-revalidate for HTML, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Stale-while-revalidate for HTML: serve cached version immediately,
  // then fetch fresh version in background to update cache
  if (
    request.destination === "document" ||
    url.pathname === "/index.html" ||
    url.pathname === "/"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match("index.html").then((cachedResponse) => {
          // Fetch fresh version in background
          const fetchPromise = fetch(request)
            .then((response) => {
              // Update cache if response is successful
              if (response && response.status === 200) {
                cache.put("index.html", response.clone());
              }
              return response;
            })
            .catch(() => {
              // Network failed; cached version already served
              return cachedResponse;
            });

          // Return cached version immediately, or fall back to fetch
          return cachedResponse || fetchPromise;
        });
      }),
    );
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (!response || response.status !== 200) {
            return response;
          }
          // Cache the successful response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
          });
          return response;
        })
        .catch(() => {
          // Return offline error if asset not cached and network unavailable
          return new Response("Offline - resource not available", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    }),
  );
});
