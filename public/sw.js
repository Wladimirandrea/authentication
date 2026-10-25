// Service Worker de la PWA
// Sube el número de versión cuando quieras forzar la limpieza de la caché.
const CACHE_NAME = 'app-cache-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  OFFLINE_URL,
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Rutas que NUNCA se cachean (API, autenticación de canales, archivos subidos)
const BYPASS_PREFIXES = ['/api', '/broadcasting', '/sanctum', '/storage', '/up'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo GET y del mismo origen
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API y demás rutas dinámicas: siempre a la red, sin tocar
  if (BYPASS_PREFIXES.some((p) => url.pathname.startsWith(p))) return;

  // Navegación (abrir una página): red primero, y si no hay conexión, la caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match('/')) || (await cache.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Archivos compilados por Vite (/build/...) e iconos: caché primero
  if (url.pathname.startsWith('/build/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
