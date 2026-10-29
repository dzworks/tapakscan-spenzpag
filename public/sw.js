// TAPAK Service Worker - SMP Negeri 1 Pagaden
// Versi Cache-First penuh untuk mode luring total sejak instalasi pertama
const CACHE_NAME = 'tapak-pwa-v2.6.9';
const CORE_PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png',
  '/assets/aistudio/file_00000000dcb08207ae0f7eeb2202ae51_ea804da4.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap'
];

// Fungsi pembersihan selektif seluruh cache lama (stale cache) sebelum aktivasi versi baru
const cleanupStaleCaches = async () => {
  try {
    const cacheKeys = await caches.keys();
    await Promise.all(
      cacheKeys.map(async (key) => {
        if (key !== CACHE_NAME) {
          await caches.delete(key);
        } else {
          const currentCache = await caches.open(key);
          await currentCache.delete('/icon.svg');
        }
      })
    );
  } catch {
    // Abaikan galat agar worker tetap tangguh
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    cleanupStaleCaches().then(async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of CORE_PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch {
          // Abaikan kegagalan individual
        }
      }
      return self.skipWaiting();
    })
  );
});

const CURRENT_APP_VERSION = 'v2.6.5';
const CURRENT_BUILD_NUMBER = 'Build 20261028.2';

// Mengirimkan notifikasi ke aplikasi client saat skipWaiting() dan pembersihan cache berhasil
const notifyClientsUpdateSuccess = async () => {
  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      client.postMessage({
        type: 'SW_UPDATE_SUCCESS',
        version: CURRENT_APP_VERSION,
        build: CURRENT_BUILD_NUMBER,
        message: 'Aplikasi telah berhasil diperbarui ke versi terbaru!'
      });
    }
  } catch {
    // Abaikan galat broadcast
  }
};

// Listener pesan untuk aktivasi hening seketika (silent update) dengan pembersihan cache usang tuntas
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'skipWaiting')) {
    event.waitUntil(
      cleanupStaleCaches()
        .then(() => self.skipWaiting())
        .then(() => notifyClientsUpdateSuccess())
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    cleanupStaleCaches()
      .then(() => self.clients.claim())
      .then(() => notifyClientsUpdateSuccess())
  );
});

self.addEventListener('fetch', (event) => {
  // Hanya proses metode GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Jangan tangani API eksternal Google Apps Script via service worker
  if (url.hostname.includes('script.google.com') || url.hostname.includes('script.googleusercontent.com')) {
    return;
  }

  // Lewati cache untuk file development Vite (/src/, /@vite/, /@fs/, /node_modules/, dsb)
  // agar setiap perubahan kode langsung tampil di preview seketika
  if (
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.includes('node_modules') ||
    url.search.includes('t=') ||
    url.search.includes('import')
  ) {
    return;
  }

  // 0. Penanganan Manifest Web App - Network-First agar peramban selalu mengambil ikon terbaru
  if (url.pathname.includes('manifest')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 1. Penanganan Navigasi Halaman (HTML App Shell) - Network-First saat online, Cache Fallback saat offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match('/index.html') || await caches.match('/');
          return cached || new Response('Mode Luring TAPAK SMP Negeri 1 Pagaden siap digunakan.', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // 2. Penanganan Aset Tampilan Statis (Gambar, Ikon, Font, Asset Bundles)
  if (
    url.origin === location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidasi di latar belakang
          fetch(event.request).then((netRes) => {
            if (netRes && netRes.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(event.request, netRes));
            }
          }).catch(() => {});
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);
      })
    );
  }
});
