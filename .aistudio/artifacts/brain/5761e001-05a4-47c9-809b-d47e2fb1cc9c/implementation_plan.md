# Rencana Implementasi: Penguncian Otomatis Kamera Belakang & Pergantian Kamera Bersih

## Ringkasan Perubahan
Memastikan scanner **selalu dan langsung mengunci kamera fisik belakang utama** saat QR scanner dibuka, serta memperbaiki alur pergantian kamera (*switch camera*) agar sensor kamera lama dihentikan secara sempurna (`await stop()`) sebelum sensor baru dinyalakan, menghilangkan pesan galat *"Gagal memuat video kamera"*.

---

## Masalah yang Diidentifikasi
1. **Pilihan Otomatis Mengarah ke Kamera Depan**: Parameter umum `{ facingMode: "environment" }` sering diabaikan oleh beberapa peramban mobile sehingga memilih kamera indeks `0` (kamera depan/selfie).
2. **Tabrakan Perangkat Keras (*Hardware Lock Collision*) saat Ganti Kamera**: `handleSwitchCamera` mengubah state secara sinkron sementara proses penghentian kamera lama (`scanner.stop()`) berjalan asinkron. Kamera baru langsung dipanggil sebelum kamera lama melepas akses sensor, memicu galat `NotReadableError` / video gagal dimuat.

---

## Tahapan Implementasi

### 1. Deteksi & Penguncian Otomatis ID Kamera Belakang Fisik
- Di dalam proses inisialisasi scanner (`startScanner`):
  - Ambil daftar perangkat kamera via `Html5Qrcode.getCameras()`.
  - Filter kamera belakang berdasarkan kata kunci label perangkat: `back`, `belakang`, `rear`, `environment`, atau `camera2 0, facing back`.
  - Jika ditemukan, langsung kunci dan gunakan `deviceId` fisik kamera belakang utama tersebut untuk `scanner.start(deviceId, ...)`.
  - Jika tidak ada label khusus belakang (misal pada webcam laptop), gunakan kamera yang tersedia secara cerdas sebagai fallback.
  - Simpan daftar kamera (`setCameras`) dan ID aktif (`activeCameraIdRef`) untuk navigasi tombol ganti kamera.

### 2. Alur Pergantian Kamera Bersih (*Clean Async Await Switch*)
- Mengubah fungsi `handleSwitchCamera` menjadi alur asinkron berurutan yang aman:
  1. Tandai status pergantian (`isSwitchingCamera = true`) dan set `isCameraReady = false` untuk menampilkan radar transisi.
  2. Tunggu hingga sensor kamera aktif benar-benar berhenti sempurna:
     `await html5QrCodeRef.current.stop();`
  3. Berikan jeda rilis hardware singkat (100ms) untuk memastikan OS peramban telah membebaskan jalur video.
  4. Nyalakan kamera berikutnya dengan `await html5QrCodeRef.current.start(nextCameraId, ...)`.
  5. Setelah aliran video mengalir, set `isCameraReady = true` dan `isSwitchingCamera = false`.

### 3. Penanganan Penutupan Modal yang Aman
- Pastikan saat modal ditutup atau QR code terbaca, proses `stop()` scanner ditangani dengan aman tanpa memicu *error callback*.

---

## Verifikasi dan Pengujian
- Uji buka Scan QR: verifikasi kamera yang menyala langsung adalah **kamera belakang ponsel**.
- Uji klik tombol "Pindah Kamera": verifikasi sistem beralih ke kamera berikutnya secara mulus tanpa muncul pesan galat *"Gagal memuat video kamera"*.
- Uji klik kembali ke kamera belakang: verifikasi transisi antar kamera berjalan stabil dan responsif.
- Jalankan `compile_applet` dan `lint_applet` untuk memastikan tidak ada kesalahan kompilasi.
