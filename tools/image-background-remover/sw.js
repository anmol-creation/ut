const CACHE_NAME = 'bg-remover-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles/theme.css',
  './styles/layout.css',
  './styles/components.css',
  './styles/tool.css',
  './ui/elements.js',
  './ui/events.js',
  './main.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
