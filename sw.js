const CACHE_NAME = 'bazarcheh-v1';
const urlsToCache = ['./shop.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
    )
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  // فقط درخواست‌های GET همین سایت رو دست بزن، بقیه (POST، دامنه‌های دیگه مثل Supabase) رو دست‌نخورده رد کن
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
