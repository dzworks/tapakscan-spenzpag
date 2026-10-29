# Rencana Implementasi: Penyesuaian Ukuran & Lebar Tampilan Jam Ke

## Ringkasan Perubahan
Memperbesar ukuran dan membentangkan kartu kapsul status **Jam Ke** agar sejajar dan memiliki panjang yang sama dengan tampilan angka jam digital di atasnya, menghasilkan kesatuan visual yang proporsional, rapi, dan mudah dibaca.

---

## Spesifikasi Desain & Tata Letak

### 1. Penyelarasan Panjang Kartu dengan Jam Digital
- Menempatkan jam digital dan kartu status **Jam Ke** dalam satu kontainer terkoordinasi dengan lebar responsif yang terkunci (`w-full max-w-[270px] sm:max-w-[320px]`).
- Kartu kapsul Jam Ke diatur membentang penuh (`w-full`) sehingga ujung kiri dan kanannya persis sejajar dengan panjang angka jam digital.

### 2. Ukuran Font yang Diperbesar & Proporsional
- Menaikkan ukuran font dari ukuran kecil sebelumnya (`text-xs`) menjadi ukuran sedang proporsional (`text-[13px] sm:text-sm font-bold`), memastikan teks seperti `Jam Ke 1 (07:00 - 07:40)` atau `Istirahat 1 (09:40 - 10:00)` muat rapi dalam satu baris tanpa terpotong atau wrap ke baris kedua.

### 3. Pewarnaan & Status Sesi
- **KBM Berlangsung**: Latar kapsul `bg-cyan-500/15`, bingkai `border-cyan-400/40`, teks `text-cyan-100`, dilengkapi indikator titik berdenyut (`animate-pulse`).
- **Waktu Istirahat**: Latar kapsul `bg-amber-500/15`, bingkai `border-amber-400/40`, teks `text-amber-100`.
- **Di Luar Jam KBM**: Latar kapsul `bg-slate-800/80`, bingkai `border-slate-700/60`, teks `text-slate-300`.

### 4. Efisiensi & Nol Beban GPU
- Tidak menggunakan filter blur atau bayangan berat. Seluruh tata letak menggunakan Flexbox dan border murni Tailwind CSS.

---

## Verifikasi dan Pengujian
- Verifikasi panjang kartu kapsul Jam Ke sama persis dengan bentangan angka jam digital.
- Verifikasi teks tidak turun ke baris kedua pada layar smartphone sempit (360px - 390px).
- Verifikasi perubahan status (Jam Ke, Istirahat, Di Luar Jam KBM) tetap berganti otomatis secara akurat.
- Jalankan `compile_applet` dan `lint_applet` untuk memastikan build bersih.
