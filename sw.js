/* Tree Survey service worker: caches the app so it opens with no signal.
   Serves from cache first, then refreshes the cache from the network in the
   background, so an updated index.html is picked up on the next launch.
   No version bump is needed when index.html changes. */
const CACHE = 'tree-survey-shell';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    const fresh = await network;
    return fresh || new Response('Tree Survey is offline and this file is not cached yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }));
});
