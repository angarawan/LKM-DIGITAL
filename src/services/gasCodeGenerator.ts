/**
 * Generator Kode Google Apps Script & Google Spreadsheet
 * untuk LKM DIGITAL PJOK – SMA NEGERI 1 TEJAKULA
 */

export const gasCodeFiles = {
  'Code.gs': `/**
 * @file Code.gs
 * @description Entry point dan Web App Controller untuk LKM Digital PJOK - SMAN 1 Tejakula
 * Guru PJOK: I Ketut Agus Nova Anggarawan, S.Pd., Gr.
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.appName = "LKM DIGITAL PJOK – SMAN 1 TEJAKULA";
  return template.evaluate()
    .setTitle("LKM DIGITAL PJOK – SMA NEGERI 1 TEJAKULA")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Endpoint Webhook API POST untuk integrasi dengan frontend eksternal
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);
    var action = payload.action;
    var result = { success: false, message: "Aksi tidak dikenal" };
    
    switch (action) {
      case "SETUP_STRUCTURE":
        result = setupStructure();
        break;
      case "GET_ALL_DATA":
        result = getAllAppData(payload.userId);
        break;
      case "SAVE_LKM":
        result = saveLkmData(payload.lkm);
        break;
      case "SAVE_ANSWER":
        result = saveStudentAnswer(payload.submission);
        break;
      case "SAVE_ASSESSMENT":
        result = saveTeacherAssessment(payload.assessment);
        break;
      case "GET_REKAP_NILAI":
        result = getRekapNilaiKelas(payload.classId);
        break;
      default:
        result = { success: false, message: "Action: " + action + " belum diimplementasikan" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`,

  'Database.gs': `/**
 * @file Database.gs
 * @description Manajemen Google Spreadsheet Database & Inisialisasi Sheet Otomatis
 */

var SPREADSHEET_ID_PROPERTY = "PJOK_SPREADSHEET_ID";

function getDatabaseSpreadsheet() {
  var spId = PropertiesService.getScriptProperties().getProperty(SPREADSHEET_ID_PROPERTY);
  if (spId) {
    try {
      return SpreadsheetApp.openById(spId);
    } catch (e) {
      Logger.log("Gagal membuka spreadsheet tersimpan: " + e.message);
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Fungsi setupStructure() yang otomatis membuat seluruh sheet, header kolom,
 * dan konfigurasi awal jika belum tersedia.
 */
function setupStructure() {
  var ss = getDatabaseSpreadsheet();
  var sheetDefinitions = [
    {
      name: "PENGATURAN",
      headers: ["ID", "Nama_Sekolah", "Tahun_Ajaran", "Semester", "Nama_Aplikasi", "Guru_PJOK", "NIP_Guru", "Drive_Folder_ID"]
    },
    {
      name: "USERS",
      headers: ["User_ID", "Nama", "Username", "Email", "Role", "Kelas_ID", "NIP_NIS", "Status_Akun", "Tanggal_Dibuat"]
    },
    {
      name: "KELAS",
      headers: ["Kelas_ID", "Nama_Kelas", "Fase", "Wali_Guru", "Tahun_Ajaran", "Total_Murid"]
    },
    {
      name: "MURID",
      headers: ["Murid_ID", "NIS", "NISN", "Nama_Murid", "Jenis_Kelamin", "Kelas_ID", "Email", "Status"]
    },
    {
      name: "LKM",
      headers: ["LKM_ID", "Judul", "Materi", "Fase", "Kelas", "Semester", "CP", "TP", "KKTP", "Model_Pembelajaran", "Alokasi_Waktu", "Guru_Pembuat", "Status", "Tanggal_Dibuat"]
    },
    {
      name: "KOMPONEN_LKM",
      headers: ["Komponen_ID", "LKM_ID", "Urutan", "Jenis_Komponen", "Judul", "Instruksi", "Konten_JSON", "Bobot"]
    },
    {
      name: "PENUGASAN",
      headers: ["Penugasan_ID", "LKM_ID", "Kelas_ID", "Tanggal_Mulai", "Batas_Pengumpulan", "Mode", "Status"]
    },
    {
      name: "KELOMPOK",
      headers: ["Kelompok_ID", "Penugasan_ID", "Nama_Kelompok", "Ketua", "Anggota_JSON"]
    },
    {
      name: "JAWABAN",
      headers: ["Jawaban_ID", "Penugasan_ID", "LKM_ID", "Murid_ID", "Nama_Murid", "Isi_Jawaban_JSON", "Status", "Waktu_Simpan", "Waktu_Pengumpulan"]
    },
    {
      name: "PENILAIAN",
      headers: ["Penilaian_ID", "Submission_ID", "Murid_ID", "Penugasan_ID", "Total_Nilai", "Kategori", "Umpan_Balik", "Skor_Per_Komponen_JSON", "Tanggal_Penilaian"]
    },
    {
      name: "REFLEKSI",
      headers: ["Refleksi_ID", "Penugasan_ID", "Murid_ID", "Pemahaman", "Kesulitan", "Pengalaman_Joyful", "Rencana_Perbaikan", "Tanggal"]
    },
    {
      name: "LOG_AKTIVITAS",
      headers: ["Log_ID", "User_ID", "Nama_User", "Aktivitas", "Waktu", "Keterangan"]
    }
  ];

  sheetDefinitions.forEach(function(def) {
    var sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    // Set Header jika sheet baru atau kosong
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);
      sheet.getRange(1, 1, 1, def.headers.length).setBackground("#1E3A8A").setFontColor("#FFFFFF").setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  });

  // Tulis pengaturan default jika kosong
  var cfgSheet = ss.getSheetByName("PENGATURAN");
  if (cfgSheet.getLastRow() === 1) {
    cfgSheet.appendRow([
      "CFG_01",
      "SMA NEGERI 1 TEJAKULA",
      "2024/2025",
      "Ganjil",
      "LKM DIGITAL PJOK",
      "I Ketut Agus Nova Anggarawan, S.Pd., Gr.",
      "19880415 201101 1 008",
      ""
    ]);
  }

  return {
    success: true,
    message: "Struktur database spreadsheet SMAN 1 Tejakula berhasil dibuat & divalidasi!",
    totalSheets: sheetDefinitions.length
  };
}
`,

  'Auth.gs': `/**
 * @file Auth.gs
 * @description Sistem login & verifikasi hak akses Guru, Murid, dan Admin
 */

function authenticateUser(username, password) {
  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName("USERS");
  if (!sheet) return { success: false, message: "Sheet USERS belum tersedia." };
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[2] === username) {
      // Periksa status akun
      if (row[7] === "Nonaktif") {
        return { success: false, message: "Akun ini telah dinonaktifkan oleh Administrator." };
      }
      return {
        success: true,
        user: {
          id: row[0],
          name: row[1],
          username: row[2],
          email: row[3],
          role: row[4],
          classId: row[5],
          nipNis: row[6]
        }
      };
    }
  }
  return { success: false, message: "Username atau password tidak ditemukan." };
}

function checkUserPermission(userId, requiredRole) {
  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName("USERS");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      var userRole = data[i][4];
      if (userRole === "admin") return true;
      return userRole === requiredRole;
    }
  }
  return false;
}
`,

  'LKM.gs': `/**
 * @file LKM.gs
 * @description CRUD Lembar Kerja Murid (LKM) & Sistem Penugasan Kelas
 */

function saveLkmData(lkm) {
  var ss = getDatabaseSpreadsheet();
  var lkmSheet = ss.getSheetByName("LKM");
  var compSheet = ss.getSheetByName("KOMPONEN_LKM");
  
  var lkmId = lkm.id || "LKM_" + new Date().getTime();
  
  // Batch write LKM metadata
  lkmSheet.appendRow([
    lkmId,
    lkm.judul,
    lkm.materiPokok || lkm.materi,
    lkm.fase,
    lkm.kelas,
    lkm.semester,
    lkm.capaianPembelajaran,
    JSON.stringify(lkm.tujuanPembelajaran),
    JSON.stringify(lkm.kktp),
    lkm.modelPembelajaran,
    lkm.alokasiWaktu,
    lkm.guruPembuat,
    lkm.status || "published",
    new Date().toISOString()
  ]);
  
  // Tulis Komponen
  if (lkm.components && lkm.components.length > 0) {
    var rows = lkm.components.map(function(c, index) {
      return [
        c.id || ("COMP_" + new Date().getTime() + "_" + index),
        lkmId,
        index + 1,
        c.type,
        c.judul,
        c.instruksi,
        JSON.stringify(c.payload),
        c.bobotNilai || 10
      ];
    });
    compSheet.getRange(compSheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  
  return { success: true, lkmId: lkmId, message: "LKM berhasil disimpan ke Google Spreadsheet!" };
}

function getLkmWithComponents(lkmId) {
  var ss = getDatabaseSpreadsheet();
  var lkmSheet = ss.getSheetByName("LKM");
  var compSheet = ss.getSheetByName("KOMPONEN_LKM");
  
  var lkmData = null;
  var lkmRows = lkmSheet.getDataRange().getValues();
  for (var i = 1; i < lkmRows.length; i++) {
    if (lkmRows[i][0] === lkmId) {
      lkmData = {
        id: lkmRows[i][0],
        judul: lkmRows[i][1],
        materiPokok: lkmRows[i][2],
        fase: lkmRows[i][3],
        kelas: lkmRows[i][4],
        semester: lkmRows[i][5],
        capaianPembelajaran: lkmRows[i][6],
        tujuanPembelajaran: JSON.parse(lkmRows[i][7] || "[]"),
        kktp: JSON.parse(lkmRows[i][8] || "[]"),
        modelPembelajaran: lkmRows[i][9],
        alokasiWaktu: lkmRows[i][10],
        guruPembuat: lkmRows[i][11],
        components: []
      };
      break;
    }
  }
  
  if (lkmData) {
    var compRows = compSheet.getDataRange().getValues();
    for (var j = 1; j < compRows.length; j++) {
      if (compRows[j][1] === lkmId) {
        lkmData.components.push({
          id: compRows[j][0],
          urutan: compRows[j][2],
          type: compRows[j][3],
          judul: compRows[j][4],
          instruksi: compRows[j][5],
          payload: JSON.parse(compRows[j][6] || "{}"),
          bobotNilai: compRows[j][7]
        });
      }
    }
  }
  return { success: true, lkm: lkmData };
}
`,

  'Penilaian.gs': `/**
 * @file Penilaian.gs
 * @description Penyimpanan Jawaban Murid, Rubrik Penilaian, Umpan Balik, & Rekap Nilai
 */

function saveStudentAnswer(submission) {
  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName("JAWABAN");
  
  var subId = submission.id || ("SUB_" + new Date().getTime());
  sheet.appendRow([
    subId,
    submission.assignmentId,
    submission.lkmId,
    submission.studentId,
    submission.studentName,
    JSON.stringify(submission.answers),
    submission.status,
    submission.lastSavedAt,
    submission.submittedAt || new Date().toISOString()
  ]);
  
  return { success: true, message: "Jawaban pengerjaan murid berhasil disimpan di Spreadsheet!" };
}

function saveTeacherAssessment(assessment) {
  var ss = getDatabaseSpreadsheet();
  var sheet = ss.getSheetByName("PENILAIAN");
  
  var evalId = assessment.id || ("EVAL_" + new Date().getTime());
  sheet.appendRow([
    evalId,
    assessment.submissionId,
    assessment.studentId,
    assessment.assignmentId,
    assessment.totalScore,
    assessment.kategoriCapaian,
    assessment.umpanBalikUmum,
    JSON.stringify(assessment.componentScores),
    new Date().toISOString()
  ]);
  
  return { success: true, message: "Nilai dan umpan balik berhasil direkam ke Spreadsheet!" };
}

function getRekapNilaiKelas(classId) {
  var ss = getDatabaseSpreadsheet();
  var pSheet = ss.getSheetByName("PENILAIAN");
  var mSheet = ss.getSheetByName("MURID");
  
  var muridData = mSheet.getDataRange().getValues();
  var nilaiData = pSheet.getDataRange().getValues();
  
  var rekap = [];
  for (var i = 1; i < muridData.length; i++) {
    if (!classId || muridData[i][5] === classId) {
      var studentId = muridData[i][0];
      var nama = muridData[i][3];
      var nis = muridData[i][1];
      
      // Cari nilai terakhir
      var finalScore = "-";
      var predikat = "Belum Dinilai";
      for (var j = 1; j < nilaiData.length; j++) {
        if (nilaiData[j][2] === studentId) {
          finalScore = nilaiData[j][4];
          predikat = nilaiData[j][5];
          break;
        }
      }
      
      rekap.push({
        id: studentId,
        nama: nama,
        nis: nis,
        kelas: muridData[i][5],
        nilai: finalScore,
        predikat: predikat
      });
    }
  }
  return { success: true, rekap: rekap };
}
`,

  'Utils.gs': `/**
 * @file Utils.gs
 * @description Helper functions, sanitasi input, dan penanganan respon
 */

function sanitizeInput(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>?/gm, '');
}

function safeJsonParse(str, defaultVal) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultVal || {};
  }
}
`,
};
