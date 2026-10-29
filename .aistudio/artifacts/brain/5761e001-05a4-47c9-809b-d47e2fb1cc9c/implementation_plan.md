# Optimasi Performa Jam Real-Time: Gradien Cyan Modern Bebas Beban GPU

Rencana implementasi untuk mengoptimalkan performa jam digital dengan menerapkan tipografi **Gradien Cyan Modern Tajam Tanpa Blur (0% Beban GPU)** guna menjamin kelancaran 60 FPS, hemat baterai, dan responsivitas maksimal pada semua tipe ponsel pintar.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan teknis yang telah dikonfirmasi oleh pengguna:

- **Gaya Tampilan Jam**: Menggunakan **Pure CSS Gradient Text** (`bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400`).
- **Penghapusan Total Beban Komputasi GPU**: Menghapus `drop-shadow` dan `textShadow` blur bertingkat (24px–45px). Menggantinya dengan rasterisasi vektor murni yang diproses instan oleh browser tanpa kalkulasi filter setiap detik.
- **Efisiensi Baterai & Suhu Ponsel**: Penggantian detik jam (`HH:mm:ss`) tidak lagi memicu *repaint Gaussian convolution*, menjaga ponsel tetap dingin dan hemat baterai terutama saat digunakan di ruang kelas atau di luar ruangan.

---

## 1. Perbandingan Teknis & Arsitektur Render

### Sebelum Optimasi (Blur Filter)
- Setiap detik saat angka jam berganti, browser memproses filter:
  - 1x filter `drop-shadow(24px)`
  - 2x lapisan `text-shadow` (20px dan 40px)
- Pada ponsel kelas pemula (*entry-level/budget Android*), hal ini dapat memicu lonjakan penggunaan GPU (*GPU spike*) secara berulang setiap 1000 milidetik.

### Sesudah Optimasi (Pure Hardware-Accelerated Gradient)
- **Komposisi**: Gradien CSS linier murni dipetakan ke teks (`background-clip: text; -webkit-background-clip: text; color: transparent`).
- **Beban GPU**: **0% (Zero Blur Math)**. Performa identik dengan teks biasa, namun secara visual tampak sangat modern, futuristik, kontras tinggi, dan tajam (*crisp*).
- **Badge Jam Ke**: Menghilangkan `box-shadow` blur pada badge sesi aktif dan istirahat, mengandalkan kontras warna permukaan semi-transparan (`bg-cyan-500/15 border border-cyan-400/40`) yang sangat ringan.

---

## 2. Rincian Perubahan Kode (`src/App.tsx`)

1. **Komponen Teks Jam Digital**:
   ```tsx
   <span className="text-5xl sm:text-[3.6rem] font-mono font-black tracking-wider tabular-nums leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 select-none">
     {time || '00:00:00'}
   </span>
   ```
2. **Badge Sesi Jam Ke & Istirahat**:
   - Menghapus efek `shadow-[0_0_16px_...]` dan bayangan dot `shadow-[0_0_8px_...]`.
   - Menggunakan styling bersih, kontras, dan teroptimasi.

---

## 3. Verifikasi & Pengujian
- Menjalankan `lint_applet` untuk memastikan tidak ada kesalahan sintaks.
- Menjalankan `compile_applet` untuk memverifikasi proses build Vite.
- Melakukan restart dev server untuk memastikan modul terbaru terkirim ke klien.
