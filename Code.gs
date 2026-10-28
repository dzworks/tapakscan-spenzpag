/**
 * ============================================================================
 * TAPAK - Tata Kelola Presensi Akademik & KBM
 * Backend Google Apps Script (Code.gs)
 * ============================================================================
 * Versi: v2.6.4 (Pembaruan: Penanganan Kegiatan Sekolah & Hari Libur Parsial/Penuh Sheet "HariLibur")
 * 
 * CATATAN INTEGRASI:
 * - Seluruh logika asli presensi tatap muka dan sesi KBM pada sheet "AttendanceLogs"
 *   dipertahankan 100% tanpa perubahan agar formula rekapitulasi KBM tetap aman.
 * - Pengajuan izin bagi guru yang TIDAK memiliki jadwal KBM hari ini otomatis
 *   diarahkan dan dicatat ke sheet terpisah bernama "IzinHarian".
 * - Penanganan kegiatan sekolah / KBM non-efektif (sebagian hari atau seharian)
 *   bersumber dari sheet "HariLibur" dengan kolom Tanggal, Keterangan, Jam Mulai, Jam Selesai.
 */

// Konstanta Nama Sheet
var SHEET_ATTENDANCE_LOGS = "AttendanceLogs";
var SHEET_IZIN_HARIAN = "IzinHarian";
var SHEET_HARI_LIBUR = "HariLibur";
var SHEET_MASTER_GURU = "MasterGuru";
var SHEET_MASTER_MAPEL = "MasterMapel";
var SHEET_MASTER_RUANGAN = "MasterRuangan";
var SHEET_MASTER_KELAS = "MasterKelas";
var SHEET_JADWAL = "JadwalPelajaran";

/**
 * Endpoint GET: Inisialisasi Data Master & Jadwal Harian
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "init";
    var hariIni = params.hariIni || "Senin";

    if (action === "init_week") {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var dataWeekly = getWeeklyData(ss);
      return createJsonResponse({
        status: "success",
        data: dataWeekly
      });
    }

    if (action === "init") {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var dataInit = getInitialData(ss, hariIni);
      return createJsonResponse({
        status: "success",
        data: dataInit
      });
    }

    return createJsonResponse({
      status: "error",
      message: "Action GET tidak dikenali."
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * Endpoint POST: Pengiriman Presensi KBM & Pengajuan Perizinan (Single & Batch)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci eksekusi selama maksimal 10 detik agar penulisan baris konkuren aman
    lock.waitLock(10000);

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ status: "error", message: "Data kiriman kosong." });
    }

    var contents = JSON.parse(e.postData.contents);
    var action = contents.action || "submit";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // ========================================================================
    // A. PEMROSESAN BATCH (UNTUK ANTREAN LURING DALAM KELOMPOK 3 ITEM PER REQUEST)
    // ========================================================================
    if (action === "batch_submit") {
      var items = contents.items || contents.payloads || (Array.isArray(contents.payload) ? contents.payload : []);
      if (!items || items.length === 0) {
        return createJsonResponse({ status: "error", message: "Data batch kosong." });
      }

      var results = [];
      for (var i = 0; i < items.length; i++) {
        var itemObj = items[i];
        var itemPayload = itemObj.payload || itemObj;
        var itemId = itemObj.id || itemPayload.id_kiriman || ("item_" + i);
        try {
          var itemRes = processAttendancePayload(ss, itemPayload);
          results.push({
            id: itemId,
            status: itemRes.status,
            message: itemRes.message || null,
            data: itemRes.data || null
          });
        } catch (itemErr) {
          results.push({
            id: itemId,
            status: "error",
            message: itemErr.toString()
          });
        }
      }

      return createJsonResponse({
        status: "success",
        processed: results.length,
        results: results
      });
    }

    // ========================================================================
    // B. PEMROSESAN TUNGGAL (REGULAR SUBMIT)
    // ========================================================================
    var payload = contents.payload;
    if (!payload) {
      return createJsonResponse({ status: "error", message: "Payload tidak ditemukan." });
    }

    var singleResult = processAttendancePayload(ss, payload);
    return createJsonResponse(singleResult);

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper Inti: Memproses 1 Payload Presensi / Perizinan ke Sheet Terkait
 */
function processAttendancePayload(ss, payload) {
  // 1. JALUR PERIZINAN GURU TANPA JADWAL KBM (SHEET "IzinHarian")
  if (payload.target_sheet === SHEET_IZIN_HARIAN || payload.is_non_kbm === true) {
    var sheetIzin = getOrCreateSheet(ss, SHEET_IZIN_HARIAN, [
      "Timestamp",
      "Tanggal",
      "Hari",
      "Kode Guru",
      "Nama Guru",
      "NIP",
      "Jenis Izin",
      "Keterangan / Alasan",
      "Pemberi Tugas / Instruksi",
      "Kategori",
      "Jam KBM",
      "ID Kiriman"
    ]);

    // Cek duplikasi pengajuan izin non-KBM pada hari yang sama
    var idKiriman = payload.id_kiriman || "";
    if (idKiriman && checkDuplicateId(sheetIzin, idKiriman, 12)) {
      return {
        status: "error",
        message: "Pendidik sudah melakukan pengajuan perizinan untuk hari ini."
      };
    }

    var waktuAbsen = payload.waktu_presensi || payload.client_time || Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm");
    var tanggalAbsen = payload.tanggal_presensi || payload.tanggal_absen_asli || Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy");
    var hariAbsen = payload.hari_presensi || payload.hari_absen_asli || "-";

    var dataJadwal = payload.data_jadwal || {};
    var kodeGuru = dataJadwal.kode_guru || payload.kode_guru || "-";
    var namaGuru = dataJadwal.nama_guru || dataJadwal.teacherName || payload.nama_guru || "-";
    var nipGuru = dataJadwal.nip || "-";
    var jenisIzin = payload.leave_type || "Izin";
    var keterangan = payload.info_ketidakhadiran || "-";
    var pemberiInstruksi = payload.pemberi_instruksi || "-";
    var kategori = payload.kategori || "Izin Harian Non-KBM";
    var jamKbm = 0; // 0 jam mengajar agar tidak masuk penyebut KBM

    sheetIzin.appendRow([
      waktuAbsen,
      tanggalAbsen,
      hariAbsen,
      kodeGuru,
      namaGuru,
      nipGuru,
      jenisIzin,
      keterangan,
      pemberiInstruksi,
      kategori,
      jamKbm,
      idKiriman
    ]);

    return {
      status: "success",
      data: {
        waktu_absen: waktuAbsen,
        target_sheet: SHEET_IZIN_HARIAN
      }
    };
  }

  // 2. JALUR PRESENSI TATAP MUKA KBM & IZIN SESI TERJADWAL (SHEET "AttendanceLogs")
  var sheetAttendance = getOrCreateSheet(ss, SHEET_ATTENDANCE_LOGS, [
    "Timestamp",
    "Tanggal",
    "Hari",
    "Ruang Belajar",
    "Nama Kelas",
    "Mapel Ke",
    "Jam Ke",
    "Kode Guru",
    "Nama Guru",
    "Mata Pelajaran",
    "Kegiatan Pembelajaran",
    "Guru Pengganti",
    "Waktu Mulai",
    "Waktu Selesai",
    "Tipe Presensi",
    "ID Kiriman"
  ]);

  var idKirimanKBM = payload.id_kiriman || "";
  if (idKirimanKBM && checkDuplicateId(sheetAttendance, idKirimanKBM, 16)) {
    return {
      status: "error",
      message: "Pendidik sudah melakukan presensi pada sesi kelas ini."
    };
  }

  var waktuKBM = payload.waktu_presensi || payload.client_time || Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm");
  var tanggalKBM = payload.tanggal_presensi || payload.tanggal_absen_asli || Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy");
  var hariKBM = payload.hari_presensi || payload.hari_absen_asli || "-";
  var dJ = payload.data_jadwal || {};

  var ruang = payload.ruang_belajar || dJ.ruang_belajar || "Ruang Kelas";
  var kelas = dJ.nama_kelas || "-";
  var mapelKe = dJ.mapel_ke || "-";
  var jamKe = dJ.jam_ke || "-";
  var kGuru = dJ.kode_guru || "-";
  var nGuru = dJ.nama_guru || dJ.teacherName || "-";
  var mapel = dJ.mata_pelajaran || dJ.subject || "-";
  var kegiatan = payload.is_leave ? `[IZIN: ${payload.leave_type}] ${payload.info_ketidakhadiran}` : (payload.kegiatan_pembelajaran || "-");
  var pengganti = payload.pengganti || "N";
  var wMulai = dJ.jam_mulai || dJ.waktu_mulai || "-";
  var wSelesai = dJ.jam_selesai || dJ.waktu_selesai || "-";
  var tipe = payload.is_leave ? "IZIN_KBM" : "HADIR_KBM";

  sheetAttendance.appendRow([
    waktuKBM,
    tanggalKBM,
    hariKBM,
    ruang,
    kelas,
    mapelKe,
    jamKe,
    kGuru,
    nGuru,
    mapel,
    kegiatan,
    pengganti,
    wMulai,
    wSelesai,
    tipe,
    idKirimanKBM
  ]);

  return {
    status: "success",
    data: {
      waktu_absen: waktuKBM,
      target_sheet: SHEET_ATTENDANCE_LOGS
    }
  };
}

/**
 * Helper: Ambil Sheet atau Buat Baru Beserta Header Terformat
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
      sheet.setFrozenRows(1);
    }
  } else if (sheet.getLastRow() === 0 && headers && headers.length > 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Helper: Cek Duplikasi Berdasarkan Kolom Tertentu (1-Indexed)
 */
function checkDuplicateId(sheet, targetId, colIndex) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  
  var values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] && values[i][0].toString() === targetId.toString()) {
      return true;
    }
  }
  return false;
}

/**
 * Helper: Response JSON dengan CORS Header Lengkap
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Ambil Data Hari Libur & Kegiatan Non-Efektif Sekolah dari Sheet "HariLibur"
 * Format Kolom:
 * Tanggal | Hari (opsional) | Keterangan | Jam Mulai | Jam Selesai
 * Aturan Waktu:
 * - Jam Mulai & Jam Selesai kosong / "-" -> Libur / Non-efektif seharian penuh
 * - Jam Mulai & Jam Selesai diisi (misal 07:00 s.d 10:30) -> Non-efektif pada jam tersebut saja
 */
function getHariLiburData(ss) {
  var list = [];
  var sLibur = ss.getSheetByName(SHEET_HARI_LIBUR);
  if (!sLibur || sLibur.getLastRow() <= 1) {
    return list;
  }

  var data = sLibur.getDataRange().getValues();
  if (data.length <= 1) return list;

  var header = data[0].map(function(h) { 
    return (h || "").toString().trim().toLowerCase(); 
  });
  
  var idxTanggal = header.indexOf("tanggal");
  var idxKeterangan = header.indexOf("keterangan");
  var idxJamMulai = header.indexOf("jam mulai");
  if (idxJamMulai === -1) idxJamMulai = header.indexOf("jammulai");
  var idxJamSelesai = header.indexOf("jam selesai");
  if (idxJamSelesai === -1) idxJamSelesai = header.indexOf("jamselesai");
  var idxHari = header.indexOf("hari");

  if (idxTanggal === -1) idxTanggal = 0;
  if (idxKeterangan === -1) idxKeterangan = 1;

  var tz = Session.getScriptTimeZone() || "Asia/Jakarta";

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rawTanggal = row[idxTanggal];
    if (!rawTanggal) continue;

    var formattedTanggal = "";
    if (rawTanggal instanceof Date) {
      formattedTanggal = Utilities.formatDate(rawTanggal, tz, "yyyy-MM-dd");
    } else {
      formattedTanggal = rawTanggal.toString().trim();
    }

    var ket = (idxKeterangan !== -1 && row[idxKeterangan]) ? row[idxKeterangan].toString().trim() : "Kegiatan Sekolah";

    // Format jam mulai
    var jamMulai = "";
    if (idxJamMulai !== -1 && row[idxJamMulai]) {
      var rawMulai = row[idxJamMulai];
      if (rawMulai instanceof Date) {
        jamMulai = Utilities.formatDate(rawMulai, tz, "HH:mm");
      } else {
        jamMulai = rawMulai.toString().trim();
      }
    }

    // Format jam selesai
    var jamSelesai = "";
    if (idxJamSelesai !== -1 && row[idxJamSelesai]) {
      var rawSelesai = row[idxJamSelesai];
      if (rawSelesai instanceof Date) {
        jamSelesai = Utilities.formatDate(rawSelesai, tz, "HH:mm");
      } else {
        jamSelesai = rawSelesai.toString().trim();
      }
    }

    var hari = (idxHari !== -1 && row[idxHari]) ? row[idxHari].toString().trim() : "";

    list.push({
      tanggal: formattedTanggal,
      hari: hari,
      keterangan: ket,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai
    });
  }

  return list;
}

/**
 * Helper: Ambil Data Master & Jadwal Harian
 */
function getInitialData(ss, hariIni) {
  var masterGuru = {};
  var masterMapel = {};
  var masterRuangan = {};
  var classes = {};
  var schedules = [];

  // 1. Master Guru
  var sGuru = ss.getSheetByName(SHEET_MASTER_GURU);
  if (sGuru && sGuru.getLastRow() > 1) {
    var dGuru = sGuru.getDataRange().getValues();
    for (var i = 1; i < dGuru.length; i++) {
      var kG = dGuru[i][0];
      if (kG) {
        masterGuru[kG] = {
          id: kG.toString(),
          nama: (dGuru[i][1] || "").toString(),
          nip: (dGuru[i][2] || "-").toString()
        };
      }
    }
  }

  // 2. Master Mapel
  var sMapel = ss.getSheetByName(SHEET_MASTER_MAPEL);
  if (sMapel && sMapel.getLastRow() > 1) {
    var dMapel = sMapel.getDataRange().getValues();
    for (var j = 1; j < dMapel.length; j++) {
      var kM = dMapel[j][0];
      if (kM) {
        masterMapel[kM] = (dMapel[j][1] || "").toString();
      }
    }
  }

  // 3. Master Ruangan
  var sRuang = ss.getSheetByName(SHEET_MASTER_RUANGAN);
  if (sRuang && sRuang.getLastRow() > 1) {
    var dRuang = sRuang.getDataRange().getValues();
    for (var r = 1; r < dRuang.length; r++) {
      var kR = dRuang[r][0];
      if (kR) {
        masterRuangan[kR] = {
          nama_ruangan: (dRuang[r][1] || "").toString(),
          pin: (dRuang[r][2] || "1234").toString()
        };
      }
    }
  }

  // 4. Master Kelas
  var sKelas = ss.getSheetByName(SHEET_MASTER_KELAS);
  if (sKelas && sKelas.getLastRow() > 1) {
    var dKelas = sKelas.getDataRange().getValues();
    for (var c = 1; c < dKelas.length; c++) {
      var kK = dKelas[c][0];
      if (kK) {
        classes[kK] = {
          id: kK.toString(),
          nama_kelas: (dKelas[c][1] || "").toString()
        };
      }
    }
  }

  // 5. Jadwal Sesuai Hari Ini (Dikelompokkan per Nama Kelas)
  var schedules = {};
  var sJadwal = ss.getSheetByName(SHEET_JADWAL);
  if (sJadwal && sJadwal.getLastRow() > 1) {
    var dJadwal = sJadwal.getDataRange().getValues();
    for (var s = 1; s < dJadwal.length; s++) {
      var row = dJadwal[s];
      var hariRow = (row[1] || "").toString().trim();
      if (hariRow.toLowerCase() === hariIni.toLowerCase()) {
        var nKelas = (row[3] || "").toString().trim();
        if (!schedules[nKelas]) schedules[nKelas] = [];
        schedules[nKelas].push({
          id: (row[0] || ("SCHED_" + s)).toString(),
          hari: hariRow,
          kode_kelas: (row[2] || "").toString(),
          nama_kelas: nKelas,
          jam_ke: (row[4] || "").toString(),
          mapel_ke: (row[5] || "").toString(),
          jam_mulai: (row[6] || "").toString(),
          jam_selesai: (row[7] || "").toString(),
          kode_guru: (row[8] || "").toString(),
          nama_guru: (row[9] || "").toString(),
          kode_mapel: (row[10] || "").toString(),
          mata_pelajaran: (row[11] || "").toString(),
          ruang_belajar: (row[12] || "").toString()
        });
      }
    }
  }

  return {
    master_guru: masterGuru,
    master_mapel: masterMapel,
    master_ruangan: masterRuangan,
    classes: classes,
    schedules: schedules,
    hari_libur: getHariLiburData(ss)
  };
}

/**
 * Helper: Ambil Paket Jadwal Seluruh Hari Kerja Sepekan (Senin s/d Jumat/Sabtu)
 */
function getWeeklyData(ss) {
  var masterGuru = {};
  var masterMapel = {};
  var masterRuangan = {};
  var classes = {};
  var schedulesByDay = {
    "Senin": {},
    "Selasa": {},
    "Rabu": {},
    "Kamis": {},
    "Jumat": {},
    "Sabtu": {}
  };

  // 1. Master Guru
  var sGuru = ss.getSheetByName(SHEET_MASTER_GURU);
  if (sGuru && sGuru.getLastRow() > 1) {
    var dGuru = sGuru.getDataRange().getValues();
    for (var i = 1; i < dGuru.length; i++) {
      var kG = dGuru[i][0];
      if (kG) {
        masterGuru[kG] = {
          id: kG.toString(),
          nama: (dGuru[i][1] || "").toString(),
          nip: (dGuru[i][2] || "-").toString()
        };
      }
    }
  }

  // 2. Master Mapel
  var sMapel = ss.getSheetByName(SHEET_MASTER_MAPEL);
  if (sMapel && sMapel.getLastRow() > 1) {
    var dMapel = sMapel.getDataRange().getValues();
    for (var j = 1; j < dMapel.length; j++) {
      var kM = dMapel[j][0];
      if (kM) {
        masterMapel[kM] = (dMapel[j][1] || "").toString();
      }
    }
  }

  // 3. Master Ruangan
  var sRuang = ss.getSheetByName(SHEET_MASTER_RUANGAN);
  if (sRuang && sRuang.getLastRow() > 1) {
    var dRuang = sRuang.getDataRange().getValues();
    for (var r = 1; r < dRuang.length; r++) {
      var kR = dRuang[r][0];
      if (kR) {
        masterRuangan[kR] = {
          nama_ruangan: (dRuang[r][1] || "").toString(),
          pin: (dRuang[r][2] || "1234").toString()
        };
      }
    }
  }

  // 4. Master Kelas
  var sKelas = ss.getSheetByName(SHEET_MASTER_KELAS);
  if (sKelas && sKelas.getLastRow() > 1) {
    var dKelas = sKelas.getDataRange().getValues();
    for (var c = 1; c < dKelas.length; c++) {
      var kK = dKelas[c][0];
      if (kK) {
        classes[kK] = {
          id: kK.toString(),
          nama_kelas: (dKelas[c][1] || "").toString()
        };
      }
    }
  }

  // 5. Kelompokkan Seluruh Jadwal Senin s/d Sabtu
  var validDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var sJadwal = ss.getSheetByName(SHEET_JADWAL);
  if (sJadwal && sJadwal.getLastRow() > 1) {
    var dJadwal = sJadwal.getDataRange().getValues();
    for (var s = 1; s < dJadwal.length; s++) {
      var row = dJadwal[s];
      var rawHari = (row[1] || "").toString().trim();
      var matchDay = validDays.find(function(h) {
        return h.toLowerCase() === rawHari.toLowerCase();
      });

      if (matchDay) {
        var nKelas = (row[3] || "").toString().trim();
        if (!schedulesByDay[matchDay][nKelas]) {
          schedulesByDay[matchDay][nKelas] = [];
        }
        schedulesByDay[matchDay][nKelas].push({
          id: (row[0] || ("SCHED_" + s)).toString(),
          hari: matchDay,
          kode_kelas: (row[2] || "").toString(),
          nama_kelas: nKelas,
          jam_ke: (row[4] || "").toString(),
          mapel_ke: (row[5] || "").toString(),
          jam_mulai: (row[6] || "").toString(),
          jam_selesai: (row[7] || "").toString(),
          kode_guru: (row[8] || "").toString(),
          nama_guru: (row[9] || "").toString(),
          kode_mapel: (row[10] || "").toString(),
          mata_pelajaran: (row[11] || "").toString(),
          ruang_belajar: (row[12] || "").toString()
        });
      }
    }
  }

  return {
    master_guru: masterGuru,
    master_mapel: masterMapel,
    master_ruangan: masterRuangan,
    classes: classes,
    schedules_by_day: schedulesByDay,
    hari_libur: getHariLiburData(ss)
  };
}
