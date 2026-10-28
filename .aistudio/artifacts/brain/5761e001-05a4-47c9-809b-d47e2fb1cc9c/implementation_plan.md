# Optimasi Performa Modal Perizinan dan Alur Pemindaian QR Code untuk HP Spesifikasi Rendah

Rencana optimasi komprehensif untuk meningkatkan performa, kecepatan buka-tutup, dan kelancaran interaksi pada **Modal Perizinan Pendidik** serta **Seluruh Alur Pemindai QR Code** (mulai dari kamera pemindai, dialog verifikasi/pilihan kelas, formulir presensi, hingga konfirmasi integritas) agar tetap estetis, responsif, dan bebas lag pada smartphone berdaya rendah/menengah.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan keputusan yang telah dikonfirmasi pengguna:
> 1. **Cakupan Optimasi QR Code**: Menjangkau **seluruh alur**, mulai dari antarmuka pemindai kamera aktif, dialog penanganan jadwal/ruang, formulir presensi, hingga popup konfirmasi integritas akademik.
> 2. **Animasi Garis Pemindai (Laser Scan)**: Menggunakan garis laser berbasis CSS transform ringan **tanpa filter drop-shadow/glow berat** yang biasanya membebani GPU saat rendering video stream kamera 60 FPS.
> 3. **Latar Belakang Popup Modal**: Mengganti seluruh efek `backdrop-blur` dengan **latar gelap pekat beraksen solid (`rgba(5, 8, 18, 0.95)` / `bg-slate-950/95`)** yang estetik, fokus, dan bebas lag.
> 4. **Modal Perizinan**: Latar gelap pekat tanpa blur, transisi instan, memoization kalkulasi jadwal (`useMemo`), serta pembatasan dropdown nama guru maksimal 15 hasil.

---

### 1. Overview & Core Concept

- **Tantangan Utama**:
  Perangkat smartphone kelas pemula sering mengalami lag (penurunan FPS drastis, keyboard lambat merespons, dan kamera tersendat) saat:
  1. Merender filter grafis berat `backdrop-filter: blur(...)` pada modal overlay.
  2. Menjalankan animasi loop dengan filter CSS `drop-shadow` di atas elemen `<video>` kamera WebRTC yang aktif.
  3. Memproses array puluhan guru atau seluruh jadwal sekolah secara berulang pada setiap render dan pengetikan karakter.
- **Tujuan Optimasi**:
  Menghilangkan bottleneck grafis (GPU) dan komputasi (CPU) tanpa mengurangi estetika antarmuka modern bernuansa *dark mode* yang telah dirancang.

---

### 2. User Experience & Visual Design

- **Layar Pemindai Kamera (Viewfinder)**:
  - Kotak bidik QR tetap tampak modern dengan sudut aksen rounded dan garis batas presisi.
  - Garis laser pemindai bergerak halus naik-turun menggunakan transisi gradien warna biru-cyan elegan tanpa filter `drop-shadow` ganda yang berat.
  - Saat QR berhasil terdeteksi, lencana sukses muncul instan dengan aksen hijau emerald tanpa efek `backdrop-blur`.
- **Dialog Hasil Scan & Formulir Presensi**:
  - Latar overlay gelap pekat elegan (`rgba(5, 8, 18, 0.95)`), menonjolkan kartu dialog di tengah layar dengan kontras tinggi.
  - Dialog tampil instan tanpa jeda animasi pegas (*spring physics*), membuat alur presensi terasa secepat kilat.
- **Pencarian Nama Guru (Modal Izin & Guru Pengganti / Inval)**:
  - Dropdown dibatasi maksimal 15 rekomendasi teratas yang cocok dengan ketikan pengguna.
  - Terdapat catatan informatif di bawah daftar jika hasil melebihi 15 item: *"Menampilkan 15 dari {total} guru. Ketik lebih spesifik..."*
- **Dialog Konfirmasi Integritas**:
  - Menggunakan overlay gelap pekat solid beraksen malam tanpa blur, dengan kartu peringatan tegas dan tombol konfirmasi yang langsung responsif saat disentuh.

---

### 3. Key Product Decisions & Trade-Offs

- **Penggantian CSS Filter Blur dengan Latar Solid Gelap**:
  - *Keputusan*: Mengeliminasi `backdrop-blur-md` dan `backdrop-blur-sm` di seluruh modal QR dan modal perizinan, digantikan dengan warna `rgba(5, 8, 18, 0.95)`.
  - *Alasan*: Menghilangkan proses compositing offscreen buffer yang sangat boros daya GPU pada chipset entry-level.
- **Penyederhanaan Laser Pemindai Kamera**:
  - *Keputusan*: Menggunakan garis gradien linier ramping (`bg-gradient-to-r from-transparent via-cyan-400 to-transparent`) dengan animasi CSS transform murni, meniadakan filter `drop-shadow-[0_0_14px_...]`.
  - *Alasan*: Decoding video kamera 30–60 FPS membutuhkan alokasi memori grafis tinggi. Menghilangkan filter bayangan pada overlay video langsung menstabilkan frame rate kamera.
- **Memoization Komputasi Berat di Sisi Client**:
  - *Keputusan*: Membungkus `getTeacherSchedules`, `groupedClasses` (untuk ruang khusus), serta pencarian nama guru pengganti dalam `useMemo`.
  - *Alasan*: Mencegah loop berulang ratusan data jadwal sekolah pada setiap ketikan karakter atau interaksi input.

---

### 4. Technical Architecture & Implementation Details

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ALUR PEMINDAI QR CODE                           │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Antarmuka Kamera Pemindai   │ - Animasi laser CSS transform murni   │
│    (Viewfinder Video Stream)   │ - Tanpa drop-shadow filter ganda      │
│                                │ - Badge sukses bebas backdrop-blur    │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Dialog Hasil Scan & Ruang   │ - Latar overlay: rgba(5, 8, 18, 0.95) │
│    (PIN, Pilih Kelas, Event)   │ - Memoize groupedClasses ruang khusus │
│                                │ - Tampilan transisi instan            │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Formulir Presensi & Inval   │ - Dropdown Guru Pengganti max 15 item │
│                                │ - Input kegiatan pembelajaran lancar  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 4. Konfirmasi Integritas       │ - Latar gelap solid tanpa blur        │
│                                │ - Kartu konfirmasi responsif instan   │
└────────────────────────────────┴───────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        MODAL PERIZINAN PENDIDIK                        │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Container & Backdrop        │ - Latar gelap pekat tanpa blur        │
│                                │ - Transisi instan (tanpa spring)      │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Pencarian & Dropdown Guru   │ - Filter dibatasi maksimal 15 hasil   │
│                                │ - Footer info hasil pencarian         │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Logika Jadwal Pendidik      │ - useMemo(currentTeacherSchedules)    │
│                                │ - Cek overlap kegiatan sekolah instan │
└────────────────────────────────┴───────────────────────────────────────┘
```

#### File yang Dimodifikasi:
- `src/App.tsx`:
  1. **Viewfinder Kamera QR**: Penyesuaian garis laser scan dan badge centang sukses.
  2. **Backdrop Modal Popup QR**: Mengubah kelas `backdrop-blur-md` menjadi solid gelap, serta transisi instan.
  3. **Dropdown Guru Pengganti**: Menambahkan limit `.slice(0, 15)` dan footer informasi.
  4. **Pilihan Kelas Ruang Khusus**: Mengoptimalkan pengelompokan kelas dengan memoization.
  5. **Backdrop Konfirmasi Integritas**: Menghapus `backdrop-blur-md`.
  6. **Modal Formulir Perizinan**: Menghapus `backdrop-blur-md`, menerapkan `useMemo` pada jadwal pendidik, membatasi dropdown guru 15 item, dan transisi instan.
