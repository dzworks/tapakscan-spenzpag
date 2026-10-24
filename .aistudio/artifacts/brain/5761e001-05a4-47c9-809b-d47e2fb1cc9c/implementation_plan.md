# Rencana Implementasi: Banner "Install TAPAK Scan" & Mekanisme Pembaruan Hening

## 1. Jawaban Pertanyaan Teknis

### A. Apakah dialog instalasi Chrome bisa di-bypass?
- **Secara teknis: TIDAK BISA di-bypass total**. Kebijakan keamanan sandbox Android & browser Chromium (Google Chrome, Edge, Brave, Samsung Internet) secara tegas **melarang instalasi aplikasi secara diam-diam (silent install)** tanpa persetujuan pengguna, demi mencegah situs web berbahaya menyusupkan malware atau shortcut tanpa sepengetahuan pemilik perangkat.
- **Solusi Terbaik (One-Tap Direct Flow)**:
  - Tombol **"Instal"** pada banner kami sambungkan langsung ke `deferredPrompt.prompt()`.
  - Ini akan langsung memunculkan lembar konfirmasi sistem resmi berukuran mini (*"Instal aplikasi TAPAK Scan? [Batal] [Instal]"*). Pengguna hanya perlu 1 sentuhan konfirmasi, tanpa perlu repot membuka menu titik tiga browser secara manual.

### B. Bagaimana teknis upgrade/perubahan tampilan setelah aplikasi diinstall?
- Sesuai preferensi Anda: **Pembaruan Hening Otomatis (*Silent Background Update*)**:
  1. Setiap kali guru membuka aplikasi dalam kondisi online, browser secara otomatis memeriksa file `sw.js` di server.
  2. Jika ada berkas baru (perubahan kode/tampilan), Service Worker baru akan diunduh dan dipersiapkan di latar belakang (*background prefetching*) tanpa memunculkan notifikasi atau mengganggu aktivitas presensi yang sedang berlangsung.
  3. Ketika aplikasi ditutup dan dibuka kembali di sesi berikutnya, Service Worker baru langsung mengambil alih kendali cache secara hening, menyajikan aset tampilan yang sudah diperbarui secara instan.

---

## 2. Rincian Fitur Banner "Install TAPAK Scan"

### Tampilan & Posisi (Floating Top Card)
- **Letak**: Mengambang di bagian atas layar (`fixed top-3 left-3 right-3 max-w-md mx-auto z-50`).
- **Gaya Visual**:
  - Latar belakang gelap elegan dengan *glassmorphism backdrop-blur* dan border halus.
  - Sudut membulat modern (*rounded-2xl*) dengan bayangan melayang (*shadow-2xl*).
  - Sisi kiri: Ikon logo TAPAK Scan dengan sudut melengkung.
  - Bagian tengah: Teks judul **"Install TAPAK Scan"** dan deskripsi singkat *"Akses cepat & presensi luring"*.
  - Sisi kanan: Tombol aksi teks/pill cyan cerah bertuliskan **"Instal"**.
  - Bagian atas kartu: Indikator garis halus geser (*drag pill indicator*) sebagai petunjuk visual bahwa kartu dapat digeser ke atas.

### Gesture Geser ke Atas (*Swipe-Up Dismiss*)
- Menggunakan `framer-motion` dengan properti `drag="y"` dan batasan gerak ke atas (`dragConstraints={{ top: -100, bottom: 0 }}`).
- Deteksi pelepasan (`onDragEnd`): jika digeser ke atas melebihi ambang batas (jarak geser > 25px atau kecepatan lemparan > 250px/s), kartu meluncur ke atas dan menghilang secara mulus (*exit transition*).

### Siklus Hidup PWA & Retensi
- **Penyimpanan 7 Hari**: Jika guru menggeser ke atas untuk menutup, tanggal kedaluwarsa disimpan di `localStorage` (`tapak_install_dismissed_until = Date.now() + 7 hari`). Banner tidak akan muncul kembali selama masa 7 hari tersebut.
- **Deteksi Standalone**: Jika aplikasi sudah dijalankan dari layar utama (mode PWA terpasang), banner secara otomatis tidak ditampilkan.
- **Panduan iOS**: Jika dibuka di Safari iOS (yang tidak memiliki event `beforeinstallprompt`), tombol "Instal" akan menampilkan tooltip/panduan ringkas *"Ketuk ikon Bagikan, lalu pilih Tambah ke Layar Utama"*.

---

## 3. Rencana Pengujian & Verifikasi
1. **Verifikasi Geser Ke Atas**: Memastikan kartu banner dapat ditarik ke atas dengan responsif dan meluncur keluar dengan mulus.
2. **Verifikasi Tombol Instal**: Memastikan tombol memicu dialog konfirmasi PWA native peramban.
3. **Verifikasi Retensi 7 Hari**: Memastikan banner tidak muncul kembali setelah di-swipe tutup hingga 7 hari ke depan.
4. **Verifikasi Build**: Menjalankan `compile_applet` untuk memastikan seluruh tipe dan sintaksis TypeScript bersih tanpa galat.
