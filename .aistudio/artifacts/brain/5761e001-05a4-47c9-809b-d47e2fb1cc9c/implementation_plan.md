# Penguncian Stempel Waktu Presensi Luring Asli, Animasi Keluar Modal Halus, & Penanganan Transisi Jaringan

Rencana implementasi peningkatan TAPAK SMP Negeri 1 Pagaden:
1. **Pencegahan Kedipan Reload di Preview AI Studio vs PWA Terpasang**: Penjelasan teknis akar masalah pada iframe pengembangan Vite HMR serta penambahan proteksi anti-reload pada kode aplikasi.
2. **Animasi Keluar Modal (*Graceful Exit Animation*)**: Pembaruan komponen `AnimatePresence` pada seluruh dialog modal dengan transisi fade-out halus dan pengecilan skala lembut (durasi 0.2 detik).
3. **Pengamanan Stempel Waktu Presensi Luring Asli (*Timestamp Immutability*)**: Mengunci tanggal (`dd/mm/yyyy`), hari (`Senin`, dsb.), dan jam asli (`09:20 WIB`) saat tombol presensi ditekan ke dalam payload dan `id_kiriman`, sehingga ketika disinkronkan ke Google Spreadsheet berhari-hari kemudian, data yang tercatat di spreadsheet tetap murni waktu asli KBM di kelas.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Keputusan Dikonfirmasi dari Pengguna**:
> - **Pengamanan Stempel Waktu**: Mengunci tanggal dan jam asli saat tombol presensi ditekan secara ketat ke dalam struktur kiriman payload (`tanggal_absen`, `waktu_absen`, `hari_absen`, `timestamp_asli`, `id_kiriman`). Data waktu ini tidak akan pernah diubah atau diganti dengan waktu sinkronisasi.
> - **Animasi Keluar Modal**: Menerapkan transisi fade-out halus dengan sedikit pengecilan skala (`scale: 0.96`, `opacity: 0`, durasi `0.2s`, `ease: "easeInOut"`) pada backdrop dan kartu modal saat ditutup, menghilangkan efek hilang mendadak.

---

### 1. Analisis & Saran Terbaik Masalah "Kedipan Reload di Preview AI Studio"

- **Akar Masalah**:
  - Pada lingkungan **Preview AI Studio**, web berjalan di dalam `<iframe>` yang terhubung langsung ke server pengembangan **Vite Dev Server** via WebSocket HMR (*Hot Module Replacement*).
  - Ketika Anda mematikan koneksi internet (Offline) lalu menyalakannya kembali (Online) di browser/DevTools, koneksi WebSocket Vite terputus dan tersambung kembali. Mekanisme bawaan skrip klien Vite dev server secara otomatis memicu `window.location.reload()` untuk memeriksa perubahan berkas.
  - Sebaliknya, pada **aplikasi PWA yang sudah diinstal di Chrome (Home Screen / Launcher)**:
    - Tidak ada server Vite atau WebSocket HMR yang berjalan.
    - Service Worker menyajikan 100% aset dari Cache Storage lokal (`tapak-pwa-v4`).
    - PWA berjalan secara mandiri (*standalone*), sehingga pergantian sinyal offline ke online **sama sekali tidak memicu reload**, melainkan murni mengeksekusi listener `online` di latar belakang.
- **Saran & Langkah Mitigasi**:
  - Di sisi kode, kita menonaktifkan pemanggilan `registration.update()` yang agresif pada event online yang dapat memicu daur ulang Service Worker di iframe.
  - Memberikan indikator transisi yang stabil agar state aplikasi tidak terinterupsi.

---

### 2. User Experience & Visual Design

1. **Animasi Modal Exit yang Anggun (*Graceful Fade-Out*)**:
   - Seluruh modal dialog (Modal Scan QR, Verifikasi PIN Ruang Khusus, Pemilihan Kelas, Form Presensi Manual/Normal, Form Pengajuan Izin/Cuti, dan Modal Riwayat Presensi):
     - **Saat Muncul**: `initial={{ opacity: 0, scale: 0.95, y: 12 }}` -> `animate={{ opacity: 1, scale: 1, y: 0 }}`.
     - **Saat Ditutup**: `exit={{ opacity: 0, scale: 0.96, y: 8 }}` dengan durasi `0.2s` dan kurva `ease: "easeInOut"`.
     - **Backdrop Gelap**: Menggunakan `exit={{ opacity: 0 }}` dengan durasi `0.2s` yang sinkron sehingga latar dan kartu memudar bersamaan secara mulus.

2. **Jaminan Integritas Waktu Presensi Luring**:
   - Contoh kasus: Guru mengajar hari **Senin pukul 09:20 WIB** di kelas VII A tanpa sinyal internet.
   - Guru menekan **Kirim Presensi**:
     - Sistem langsung mengunci stempel waktu lokal detik itu juga:
       - `tanggal_absen: "27/10/2026"`
       - `waktu_absen: "09:20"`
       - `hari_absen: "Senin"`
       - `id_kiriman: "27102026VIIA1G01"` (Berisi tanggal, kelas, jam, dan guru asli)
       - `is_offline_sync: true`
     - Objek ini tersimpan permanen di `localStorage.setItem('tapak_offline_queue', ...)`
   - Hari **Selasa**, guru baru tersambung internet di ruang guru:
     - Sistem menyinkronkan antrean ke Google Apps Script Spreadsheet.
     - Payload yang dikirim ke server **tetap membawa data hari Senin pukul 09:20 WIB**.
     - Di kolom spreadsheet Google, baris presensi tercatat pada hari Senin jam 09:20, bukan hari Selasa!

---

### 3. Rincian Modifikasi Berkas

1. **`src/App.tsx`**:
   - **Stempel Waktu Terkunci**:
     - Memperbarui fungsi `submitData` dan `submitLeaveRequest` agar menambahkan field eksplisit:
       - `waktu_absen_asli`
       - `tanggal_absen_asli`
       - `hari_absen_asli`
       - `waktu_presensi`
       - `tanggal_presensi`
       - `client_time`
     - Menjamin objek payload di dalam `tapak_offline_queue` tidak akan tersentuh atau tertimpa saat proses auto-sync dijalankan.
   - **Graceful Modal Exit Animation**:
     - Menstandarkan properti `exit={{ opacity: 0, scale: 0.96, y: 8 }}` dan `transition={{ duration: 0.2, ease: "easeInOut" }}` pada semua komponen modal dialog di dalam `AnimatePresence`.
   - **Service Worker Registrasi di App**:
     - Menghindari pemicuan `registration.update()` berulang saat event online untuk mencegah reload siklus worker di lingkungan browser dev.

---

### 4. Verification & Testing Plan

1. **Uji Animasi Keluar Modal**:
   - Buka modal Riwayat Presensi, lalu klik tombol tutup (X). Amati transisi fade-out halus tanpa kedip atau hilang mendadak.
   - Buka modal Formulir Perizinan, lalu klik tombol tutup (X). Pastikan animasi menutup secara elegan.
   - Buka kamera QR, tekan tombol kembali. Pastikan transisi penutupan berjalan lembut.
2. **Uji Pengamanan Waktu Presensi Luring**:
   - Catat presensi saat offline, periksa isi antrean di modal Riwayat.
   - Pastikan jam presensi tercatat sesuai waktu penekanan.
   - Hubungkan kembali koneksi internet, pantau data payload yang dikirim ke server bahwa jam dan tanggal yang dikirim tetap merupakan waktu asli saat offline.
3. **Uji Build & Lint**:
   - Jalankan `compile_applet` dan `lint_applet` untuk menjamin kepatuhan tipe TypeScript dan build Vite.
