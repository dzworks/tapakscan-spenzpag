# Rencana Implementasi: Perbaikan Ikon PWA Logo 3D "T" di Chrome

## 1. Analisis Akar Masalah (Root Cause)
- Pada berkas `manifest.webmanifest` dan `manifest.json`, ikon urutan teratas yang didefinisikan adalah `/icon.svg` dengan properti `"sizes": "any"` dan `"purpose": "any maskable"`.
- Berkas `/public/icon.svg` tersebut berisi grafik vektor lama berbentuk lingkaran centang biru.
- Sesuai spesifikasi W3C Web App Manifest dan perilaku peramban Chromium (Google Chrome), browser secara otomatis memprioritaskan format vektor SVG (`sizes: any`) dibandingkan berkas PNG.
- Akibatnya, saat pengguna melakukan instalasi via Chrome, Chrome memilih `/icon.svg` lama alih-alih logo 3D "T" (`pwa-192x192.png` dan `pwa-512x512.png`).

---

## 2. Rencana Perubahan

### A. Pembersihan & Pembaruan Web Manifest
- **File Target**: `public/manifest.webmanifest` dan `public/manifest.json`
- Menghapus entri `/icon.svg` dari daftar `icons`.
- Mengatur daftar `icons` secara presisi menggunakan berkas logo 3D "T" asli:
  - `pwa-192x192.png` (ukuran 192x192, `purpose: "any"`)
  - `pwa-192x192.png` (ukuran 192x192, `purpose: "maskable"`)
  - `pwa-512x512.png` (ukuran 512x512, `purpose: "any"`)
  - `pwa-512x512.png` (ukuran 512x512, `purpose: "maskable"`)
  - `/assets/aistudio/file_00000000dcb08207ae0f7eeb2202ae51_ea804da4.png` (ukuran 1024x1024, `purpose: "any"`)
- Menghapus berkas `/public/icon.svg` agar tidak ada sisa aset lama.

### B. Pembersihan Cache Service Worker
- **File Target**: `public/sw.js`
- Menghapus `/icon.svg` dari daftar `CORE_PRECACHE_ASSETS`.
- Memastikan mekanisme pembersihan cache menghapus cache manifest lama agar peramban langsung mengambil metadata ikon terbaru saat aplikasi dibuka.
- Mempertahankan nomor versi aplikasi saat ini (`v2.6.1`) sesuai pilihan Anda.

---

## 3. Rencana Pengujian & Verifikasi
1. **Verifikasi Manifest**: Memastikan file `manifest.webmanifest` dan `manifest.json` valid tanpa referensi ke file SVG lama.
2. **Pemeriksaan Kompilasi & Lint**: Menjalankan `compile_applet` dan `lint_applet` untuk menjamin tidak ada galat sintaksis.
3. **Verifikasi Ikon PWA**: Memverifikasi bahwa ikon splash dan instalasi Chrome menargetkan berkas logo 3D "T" (`pwa-192x192.png` & `pwa-512x512.png`).
