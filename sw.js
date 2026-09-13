/* Tree Survey service worker: caches the app so it opens with no signal.
   Serves from cache first, then refreshes the cache from the network (bypassing
   the browser's HTTP cache) and tells open pages when the app itself changed,
   so they can offer a Reload. No version bump is needed when index.html changes. */
const CACHE = 'tree-survey-shell';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function isAppPage(url) { return url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'); }
function tagOf(res) { return res ? (res.headers.get('etag') || res.headers.get('last-modified') || res.headers.get('content-length') || '') : ''; }
function notifyUpdate() {
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => list.forEach(c => c.postMessage({ type: 'update-ready' })));
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.searchParams.has('fresh')) return; /* the page's own update check goes straight to the network */
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const revalidate = fetch(new Request(url.href, { cache: 'no-cache', credentials: 'same-origin' })).then(async res => {
      if (!res || !res.ok) return res;
      const changed = cached && tagOf(cached) !== tagOf(res);
      await cache.put(req, res.clone());
      if (changed && isAppPage(url)) notifyUpdate();
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(revalidate); return cached; }
    const fresh = await revalidate;
    return fresh || new Response('Tree Survey is offline and this file is not cached yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  })());
});
