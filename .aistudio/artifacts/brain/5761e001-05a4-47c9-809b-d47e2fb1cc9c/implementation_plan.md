# Rencana Implementasi: Tampilan Versi v2.5.0 & Notifikasi Proses Update

## 1. Tampilan Nomor Versi di Footer
- **Nomor Versi Saat Ini**: **`v2.5.0`**
- **Format Lengkap**: **`v2.5.0 • Build 20261024`**
- **Posisi**: Di bagian paling bawah layar (*footer*) mendampingi teks resmi SMP Negeri 1 Pagaden.
- **Tipografi**: Font monospace halus (`font-mono text-[9.5px] text-slate-400`), bersih dan tidak mengalihkan perhatian saat proses presensi.
- **Aturan Pembaruan Versi**: Setiap kali ada penambahan fitur atau perbaikan kode di masa mendatang, nomor versi akan selalu dinaikkan secara berjenjang (SemVer: v2.5.1, v2.5.2, dst.).

---

## 2. Banner Notifikasi Proses Pembaruan Aplikasi
- **Pemicu**: Terdeteksi berkas versi baru oleh Service Worker saat registrasi atau event `updatefound`.
- **Bentuk Visual**:
  - Banner status mengambang halus di bagian atas layar (`fixed top-4 left-4 right-4 z-50` atau di atas konten dashboard).
  - Background gelap elegan dengan *backdrop-blur*, border cyan, dan bayangan lembut.
  - Dilengkapi spinner neon cyan halus yang berputar saat proses pengunduhan berlangsung.
- **Fase Status**:
  1. **Saat Mengunduh**: Menampilkan teks *"Mengunduh pembaruan versi baru..."* disertai animasi spinner cyan.
  2. **Saat Selesai**: Teks beralih ke *"Pembaruan versi berhasil diunduh (aktif sesi berikutnya)"* dengan ikon centang emerald.
  3. **Auto-Dismiss**: Notifikasi otomatis menghilang dengan animasi *fade-out* setelah 3 detik selesai.

---

## 3. Rencana Perubahan Kode
- **`src/App.tsx`**:
  - Menetapkan konstanta terpusat:
    ```typescript
    export const APP_VERSION = 'v2.5.0';
    export const BUILD_NUMBER = 'Build 20261024';
    ```
  - Menambahkan state pembaruan: `updateStatus: 'downloading' | 'completed' | null`.
  - Menghubungkan listener `updatefound` dan `statechange` pada Service Worker untuk memperbarui state `updateStatus`.
  - Merender banner notifikasi proses pembaruan menggunakan `AnimatePresence` dan `motion.div`.
  - Menambahkan elemen tampilan versi di bagian footer layar.
- **`public/sw.js`**:
  - Memastikan pengiriman event atau penanganan update sinkron dengan status klien.

---

## 4. Rencana Verifikasi
1. **Verifikasi Visual Footer**: Memastikan label `v2.5.0 • Build 20261024` tampil rapi dan proporsional di footer bawah.
2. **Verifikasi Siklus Banner Update**: Memastikan transisi dari mengunduh -> selesai -> otomatis tertutup setelah 3 detik berjalan lancar tanpa galat.
3. **Pemeriksaan Kompilasi & Lint**: Menjalankan `compile_applet` dan `lint_applet` untuk menjamin tidak ada kesalahan sintaksis atau tipe.
