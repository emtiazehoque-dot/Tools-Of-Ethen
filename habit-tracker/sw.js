const CACHE_NAME = "static-cache-v1";

// All paths are strictly relative (no leading slash)
const ASSETS_TO_CACHE = [
  "/",
  "src/index.html",
  "src/css/styles.css",
  "src/js/app.js",
  "public/manifest.json",
  "public/icons/logo.svg",
  "public/icons/logo-192.png",
  "public/icons/logo-512.png",
];

// Install event: Cache everything locally
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// Activate event: Take control immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: Serve directly from cache for true offline performance
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }),
  );
});
