// TAPAK Service Worker - SMP Negeri 1 Pagaden
// Versi Cache-First penuh untuk mode luring total sejak instalasi pertama
const CACHE_NAME = 'tapak-pwa-v2.6.1';
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
        // Hapus selektif semua cache lama yang bukan versi aktif saat ini
        if (key !== CACHE_NAME) {
          await caches.delete(key);
        }
      })
    );
  } catch {
    // Abaikan galat agar worker tetap tangguh
  }
};

self.addEventListener('install', (event) => {
  // Bersihkan cache usang lama terlebih dahulu sebelum mengunduh shell versi baru
  event.waitUntil(
    cleanupStaleCaches().then(async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of CORE_PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch {
          // Abaikan kegagalan individual agar proses instalasi tetap mulus
        }
      }
      return self.skipWaiting();
    })
  );
});

const CURRENT_APP_VERSION = 'v2.6.1';
const CURRENT_BUILD_NUMBER = 'Build 20261024.1';

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

  // Jangan tangani API eksternal Google Apps Script via service worker (dikelola oleh App.tsx local storage)
  if (url.hostname.includes('script.google.com') || url.hostname.includes('script.googleusercontent.com')) {
    return;
  }

  // 1. Penanganan Navigasi Halaman (HTML App Shell) - Cache-First Agresif
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cachedIndex) => {
        if (cachedIndex) {
          // Sajikan instan dari cache luring detik itu juga!
          // Di latar belakang (jika online), lakukan background revalidation tanpa memblokir
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
              }
            })
            .catch(() => {});
          return cachedIndex;
        }

        // Jika belum ada di cache sama sekali, ambil dari jaringan lalu simpan
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
            }
            return networkResponse;
          })
          .catch(async () => {
            const fallback = await caches.match('/');
            return fallback || new Response('Mode Luring TAPAK SMP Negeri 1 Pagaden siap digunakan.', {
              headers: { 'Content-Type': 'text/html' }
            });
          });
      })
    );
    return;
  }

  // 2. Penanganan Aset Tampilan Statis (Skrip JS, Stylesheet CSS, Gambar, Ikon, Font)
  // Strategi Cache-First: Kembalikan langsung dari cache jika sudah ada untuk menghindari reload lambat
  if (
    url.origin === location.origin ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Jika aset belum tersimpan sebelumnya, unduh dan simpan ke cache
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
          .catch(() => {
            return cachedResponse;
          });
      })
    );
  }
});
