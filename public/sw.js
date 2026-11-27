/**
 * Service Worker for EnglishPartner PWA (Milestone 4C)
 * Complies with ECP_Phase_Plan.md §7.1 (Track 4C).
 * Strategy: Network-first for dynamic content with offline cache fallback for core shell.
 */

const CACHE_NAME = "english-partner-v2";
const STATIC_SHELL_URLS = [
  "/",
  "/dashboard",
  "/explore",
  "/vocabulary",
  "/professions",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL_URLS).catch(() => {
        // Safe skip on initial install in environments where paths might be prerendered
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip API, Next.js build chunks, and localhost dev requests from caching
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_next/") ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache valid responses for offline use
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to offline dashboard shell for document requests
          if (event.request.destination === "document") {
            return caches.match("/dashboard");
          }
          return new Response("Offline", { status: 503, statusText: "Offline" });
        });
      })
  );
});
