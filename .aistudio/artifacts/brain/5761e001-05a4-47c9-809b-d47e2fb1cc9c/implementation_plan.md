# Rencana Implementasi: Pemindaian QR Code Seluruh Layar (Full-Viewport) & Peningkatan FPS

## 1. Analisis Akar Masalah (Root Cause)
- **Penyebab Area Baca Bergeser ke Bawah**:
  Pada berkas `src/App.tsx`, inisialisasi pemindai kamera menggunakan parameter pembatas `qrbox` dan `aspectRatio: 1.0`:
  ```typescript
  const config = { 
    fps: 15, 
    qrbox: (vw: number, vh: number) => {
      const size = Math.max(200, Math.min(vw, vh) * 0.75);
      return { width: size, height: size };
    }, 
    aspectRatio: 1.0 
  };
  ```
- Pembatas `qrbox` memotong kanvas decoding pada koordinat video mentah. Pada rasio layar ponsel (16:9 / 20:9), pemaksaan `aspectRatio: 1.0` bersama perbesaran CSS membuat area potongan internal bergeser beberapa sentimeter ke bawah relatif terhadap kotak grafis lengkung di antarmuka pengguna.
- Pembatasan ini juga memblokir pemindaian jika QR code berada di luar kotak tersebut.

---

## 2. Rencana Perubahan pada `src/App.tsx`

### A. Aktifkan Pemindaian Penuh Seluruh Layar (Full-Viewport Scanning)
- Menghapus batasan `qrbox` dari konfigurasi `Html5Qrcode.start()`.
- Sesuai dokumentasi resmi `html5-qrcode`, jika `qrbox` ditiadakan, mesin pemindai akan membaca QR code pada **seluruh area tangkapan lensa kamera yang tampak di layar (100% full frame)**.
- Kode QR yang berada di mana pun di dalam layar (tepat di tengah, sedikit di atas, di bawah, atau di pinggir) akan langsung terbaca tanpa ada *dead-zone* (zona mati).

### B. Tingkatkan Responsivitas Deteksi ke 20 FPS
- Mengubah frekuensi penangkapan dari `fps: 15` menjadi `fps: 20` sesuai preferensi Anda.
- Frekuensi 20 FPS memberikan keseimbangan ideal antara kecepatan tangkap instan dan efisiensi pemrosesan CPU perangkat ponsel.

### C. Pertahankan Kotak Pembidik Visual & Animasi
- Kotak lengkung bercahaya neon, garis sudut pembidik, dan sapuan laser pemindai tetap dipertahankan di tengah layar sebagai panduan visual yang ergonomis bagi guru.
- Memastikan rasio aspek video mengalir alami tanpa distorsi atau peregangan geometris.

---

## 3. Rencana Pengujian & Verifikasi
1. **Verifikasi Area Deteksi**: Memastikan QR code terbaca secara akurat baik saat berada tepat di dalam kotak lengkung, di tepi kotak, maupun di area layar lainnya.
2. **Verifikasi Kecepatan Respons**: Memastikan deteksi QR terjadi seketika dalam sepersekian detik (20 FPS).
3. **Pemeriksaan Kompilasi & Lint**: Menjalankan `compile_applet` dan `lint_applet` untuk memastikan kode bebas dari kesalahan sintaksis.
