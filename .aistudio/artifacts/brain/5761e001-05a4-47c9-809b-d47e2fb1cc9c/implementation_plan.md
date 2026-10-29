# Penambahan Detail Jenis Kehadiran & Jam Ke pada Kartu Riwayat serta Penguncian Waktu Awal Scan QR

Rencana implementasi penambahan informasi **Jenis Kehadiran** (Hadir, Sakit, Izin, Tugas) dan nomor **Jam Ke** pada kartu riwayat, dengan tetap mempertahankan skema warna **Hijau (Sudah Terkirim)** dan **Oranye (Antrean Luring)**, serta pembaruan logika pencatatan waktu presensi agar mencatat **waktu awal saat QR Code berhasil dipindai oleh kamera** alih-alih waktu saat menekan tombol konfirmasi integritas.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Jaminan Keamanan & Kompatibilitas Format Waktu (Zero Breaking Change)**:
> - **Format Waktu Tidak Berubah**: Format waktu tetap **`HH:mm`** (string teks dua digit jam dan menit, contoh `"07:20"`).
> - **Struktur Payload Tetap Sama**: Seluruh properti (`waktu_presensi`, `client_time`, `waktu_absen_asli`) dikirim dengan nama field dan tipe data yang persis sama.
> - **Kolom Spreadsheet Tetap Sama**: Data tetap masuk ke kolom **Timestamp (Kolom A / Kolom 1)** di sheet `AttendanceLogs` dan `IzinHarian`.
> - **Satu-satunya Perbedaan**: HANYA *momen pengambilan string waktu* dipindahkan dari saat menekan tombol "Ya" menjadi saat kamera sukses membaca QR Code di kelas. Formula rekapitulasi KBM di Google Sheets dijamin **100% aman dan tidak terdistorsi**.

---

### 1. Overview & Core Concept

- **Permasalahan Saat Ini**:
  1. Pada kartu riwayat *Sudah Terkirim*, pengguna hanya melihat Nama Guru, Mata Pelajaran, Stempel Jam, Nama Kelas, dan Rentang Jam WIB, tanpa label penanda apakah presensi tersebut merupakan kehadiran mengajar KBM reguler atau perizinan, serta belum ada nomor jam pelajaran (*Jam Ke*).
  2. Waktu kehadiran saat ini dihitung saat fungsi `submitData()` dieksekusi (yaitu saat tombol konfirmasi "Ya, Saya Guru Bersangkutan" ditekan). Jika guru membaca detail jadwal, mengetik kegiatan KBM, atau membaca dialog konfirmasi integritas selama 3–5 menit, jam presensi bergeser maju dari waktu kedatangan asli saat memindai QR.
- **Solusi yang Diterapkan**:
  1. Menambahkan kolom dan badge `jenis_kehadiran` (`Hadir KBM`, `Sakit`, `Izin`, `Tugas`) dan `jam_ke` (contoh: *Jam Ke 1-2*) pada kartu riwayat hari ini, sebaris di atas nama pendidik.
  2. Menyimpan stempel waktu tepat saat `onScanSuccess` kamera terpicu ke dalam state `initialScanTime` dan membawanya ke payload pengiriman server (`client_time`, `waktu_presensi`, `waktu_absen_asli`) serta penyimpanan riwayat lokal.

---

### 2. User Experience & Visual Design

- **Kartu Sudah Terkirim (Tema Hijau / Emerald)**:
  - Latar kartu tetap `bg-emerald-500/10 border-emerald-500/20` dengan teks emerald.
  - Di baris teratas (sebelum nama guru), terdapat barisan badge kompak:
    - **Badge Jenis Kehadiran**: Badge hijau lembut beraksen emerald `bg-emerald-500/20 text-emerald-300 border border-emerald-500/30` dengan teks "Hadir KBM" (atau "Sakit", "Izin", "Tugas").
    - **Badge Jam Ke**: Badge elegan `bg-slate-800/90 text-emerald-200/90 border border-emerald-500/20` dengan teks "Jam Ke 1-2".
  - Di sebelah kanan: Stempel waktu dengan ikon centang sukses hijau `07:20`.
  - Nama Guru, Mata Pelajaran, Kelas, dan rentang jam pelajaran WIB tetap tertata rapi.

- **Kartu Antrean Luring (Tema Oranye / Amber)**:
  - Latar kartu tetap `bg-amber-500/10 border-amber-500/20` dengan teks amber.
  - Memiliki susunan badge yang seirama: Badge jenis kehadiran oranye `bg-amber-500/30 text-amber-300 border border-amber-500/40` dan badge Jam Ke `bg-slate-800/90 text-amber-200/90`.

- **Pencatatan Waktu Scan QR**:
  - Saat kamera membaca QR di kelas pada jam `07:15`, sistem langsung mengunci waktu `07:15`.
  - Guru dapat dengan tenang mengisi kegiatan pembelajaran dan membaca dialog integritas akademik tanpa khawatir jam kedatangannya bertambah terlambat.

---

### 3. Key Product Decisions & Trade-Offs

- **Penempatan Sebaris di Atas Nama Guru**:
  - *Keputusan*: Meletakkan badge status dan jam ke di baris paling atas kartu, sejajar secara vertikal dengan stempel waktu scan di pojok kanan.
  - *Alasan*: Memberikan hierarki visual yang jelas — pembaca langsung mengetahui status dan jam sesi sebelum membaca nama guru dan mapel.
- **Konsistensi Tipe Data HistoryItem**:
  - *Keputusan*: Memperluas interface `HistoryItem` dengan properti opsional `jam_ke?: string` dan `jenis_kehadiran?: string`.
  - *Alasan*: Menjamin *type safety* di TypeScript dan kompatibilitas mundur (*backward compatibility*) dengan riwayat presensi yang sudah tersimpan di `localStorage` sebelumnya.
- **Stempel Waktu Awal Scan (Immutable Scan Time)**:
  - *Keputusan*: Menangkap `scanTimestamp = HH:mm` pada fungsi `onScanSuccess` dan menyimpannya di objek `ScanResultState`.
  - *Alasan*: Mencerminkan integritas waktu kehadiran yang sejati (waktu guru benar-benar berdiri di depan QR kelas) tanpa mengubah format payload string `HH:mm`.

---

### 4. Technical Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ALUR PENCATATAN WAKTU SCAN                      │
├────────────────────────────────┬───────────────────────────────────────┤
│ 1. Kamera Mendeteksi QR        │ - onScanSuccess(token)                │
│                                │ - Kunci scanTime = HH:mm (contoh 07:15│
│                                │ - Simpan scanTime ke ScanResultState  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 2. Form & Konfirmasi           │ - Guru mengisi form kegiatan          │
│                                │ - Guru menekan konfirmasi integritas  │
├────────────────────────────────┼───────────────────────────────────────┤
│ 3. Submit Data & Riwayat       │ - Format tetap string "HH:mm"         │
│                                │ - Kirim scanTime ke API Google Sheets │
│                                │ - Simpan scanTime ke HistoryItem      │
│                                │ - Masuk kolom A (Timestamp) di Sheet  │
└────────────────────────────────┴───────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                     STRUKTUR KARTU RIWAYAT HARI INI                    │
├────────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [HADIR KBM]  [Jam Ke 1-2]                      (✓) 07:15           │ │
│ │ Nama Guru: Dzulfikri Almutawadli, S.Pd.                            │ │
│ │ Mapel: Pendidikan Pancasila dan Kewarganegaraan                    │ │
│ │ ────────────────────────────────────────────────────────────────── │ │
│ │ Kelas: VII-A                                     07:00 - 09:00 WIB │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Komponen dan Berkas yang Dimodifikasi:
1. `src/App.tsx`:
   - **Interface `HistoryItem`**: Tambahkan `jam_ke?: string` dan `jenis_kehadiran?: string`.
   - **Interface `ScanResultState`**: Tambahkan `scan_time?: string`.
   - **Fungsi `onScanSuccess` & `processScheduleMatch`**: Ambil dan simpan `scan_time` saat QR terdeteksi (format tetap `"HH:mm"`).
   - **Fungsi `submitData`**: Gunakan `scan_time` yang telah dikunci sebagai nilai untuk `client_time`, `waktu_presensi`, dan `waktu_absen_asli`.
   - **Fungsi `submitLeaveRequest`**: Simpan `jenis_kehadiran` (Sakit, Izin, Tugas) dan `jam_ke` ke dalam riwayat.
   - **Rendering `sentHistory.map`**: Tampilkan badge `jenis_kehadiran` (Hadir/Sakit/Izin/Tugas) dan `jam_ke` dengan aksen tema hijau emerald di atas nama guru.
   - **Rendering `offlineQueue.map`**: Tampilkan badge `jenis_kehadiran` dan `jam_ke` dengan aksen tema oranye amber.
