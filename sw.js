// This service worker previously cached the app shell for full offline
// loading. That caching layer caused more update problems than it solved
// (a stale cached copy can keep serving itself indefinitely, ignoring
// whatever is actually deployed), so it's being retired.
//
// This version's only job is to clean up: delete any caches it created
// earlier and unregister itself, so the page goes back to loading plainly
// over the network like a normal website. Your library (audio files,
// metadata) is untouched — that lives in IndexedDB, entirely separate
// from this file.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});
