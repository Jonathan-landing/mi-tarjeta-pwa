// sw.js

const CACHE_NAME = 'tarjeta-v2.1.0';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  // Si has puesto tu CSS en un archivo externo, inclúyelo aquí; 
  // en nuestro caso, todo está en index.html (CSS embebido), por lo que no hace falta.
  // './styles.css',
  // Si tienes archivos de iconos extra, añádelos:
  './icons/apple-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Si usas imágenes independientes (no base64), pon su ruta. 
  // Ejemplo:
  // './ruta-a-foto.jpg',
  // './ruta-a-qr.png',
];

// Al instalar el service worker, cacheamos todos los recursos listados
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Al activar el SW, borramos caches antiguas (si existieran)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta peticiones y responde con cache o con la red si no está en cache
self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(req).then(networkResponse => {
        // Opcional: podrías añadir la respuesta nueva a caché si lo deseas.
        return networkResponse;
      });
    })
  );
});
