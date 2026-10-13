import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import {
  Download,
  Printer,
  Search,
  Award,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

export const RekapNilai: React.FC = () => {
  const settings = StorageService.getSettings();
  const classes = StorageService.getClasses();
  const assignments = StorageService.getAssignments();
  const lkms = StorageService.getLkms();
  const submissions = StorageService.getSubmissions();
  const assessments = StorageService.getAssessments();
  const students = StorageService.getUsers().filter((u) => u.role === 'murid');

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class_xi_1');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId);

  // Filter students in current class
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Compile grades
  const gradeRows = classStudents.map((student, idx) => {
    const sub = submissions.find(
      (s) => s.studentId === student.id && s.assignmentId === selectedAssignmentId
    );
    const evalData = sub ? assessments.find((a) => a.submissionId === sub.id) : undefined;

    return {
      no: idx + 1,
      student,
      score: evalData ? evalData.totalScore : null,
      kategori: evalData ? evalData.kategoriCapaian : 'Belum Dinilai',
      umpanBalik: evalData ? evalData.umpanBalikUmum : '-',
      submittedAt: sub?.submittedAt || sub?.lastSavedAt,
    };
  });

  const filteredRows = gradeRows.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.student.name.toLowerCase().includes(q) ||
      (r.student.nipNis || '').toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const scoredRows = gradeRows.filter((r) => r.score !== null);
  const scoresOnly = scoredRows.map((r) => r.score as number);
  const avg =
    scoresOnly.length > 0
      ? (scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length).toFixed(1)
      : '0';
  const highest = scoresOnly.length > 0 ? Math.max(...scoresOnly) : 0;
  const lowest = scoresOnly.length > 0 ? Math.min(...scoresOnly) : 0;

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'No',
      'NIS',
      'Nama Siswa',
      'Kelas',
      'LKM',
      'Nilai Akhir',
      'Predikat Capaian',
      'Umpan Balik Guru',
      'Waktu Pengumpulan',
    ];

    const rows = gradeRows.map((r) => [
      r.no,
      `"${r.student.nipNis || ''}"`,
      `"${r.student.name}"`,
      `"${currentClass?.name || ''}"`,
      `"${currentAssignment?.lkmJudul || ''}"`,
      r.score !== null ? r.score : '"-"',
      `"${r.kategori}"`,
      `"${(r.umpanBalik || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('id-ID') : '-'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Nilai_PJOK_${currentClass?.name.replace(/\s+/g, '_')}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Buku Nilai PJOK
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Kurikulum Merdeka SMAN 1 Tejakula
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Rekapitulasi Nilai & Ketercapaian Tujuan Pembelajaran
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh format Excel/CSV atau cetak lembar rekap penilaian per kelas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Excel (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-4">
        <h2 className="font-extrabold text-lg uppercase">{settings.namaSekolah}</h2>
        <h3 className="font-bold text-sm">REKAPITULASI PENILAIAN LKM DIGITAL PJOK</h3>
        <p className="text-xs text-slate-600">
          Kelas: {currentClass?.name} | Materi: {currentAssignment?.lkmJudul} | Guru: {settings.guruPjokUtama}
        </p>
      </div>

      {/* Class & Assignment Selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Pilih Kelas:
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl bg-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Fase {c.fase})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Pilih LKM / Tugas:
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold border border-slate-300 rounded-xl bg-white max-w-xs truncate"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.lkmJudul}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            Cari Siswa:
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik nama / NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Statistics Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Siswa Terdaftar
          </span>
          <p className="text-xl font-black text-slate-900 mt-0.5">{classStudents.length}</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Sudah Dinilai
          </span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{scoredRows.length} Siswa</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Rata-rata Kelas
          </span>
          <p className="text-xl font-black text-blue-600 mt-0.5">{avg}</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Nilai Tertinggi / Terendah
          </span>
          <p className="text-xl font-black text-purple-600 mt-0.5">
            {highest} / {lowest || '-'}
          </p>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">NIS</th>
                <th className="p-3 text-center">Nilai Akhir (0-100)</th>
                <th className="p-3">Kategori Capaian</th>
                <th className="p-3">Catatan / Umpan Balik Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r, i) => (
                <tr key={r.student.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{r.student.name}</td>
                  <td className="p-3 font-mono text-slate-600">{r.student.nipNis || '-'}</td>
                  <td className="p-3 text-center">
                    {r.score !== null ? (
                      <span className="font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {r.score}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Belum Dinilai</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                        r.kategori === 'Sangat Baik'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.kategori === 'Baik'
                          ? 'bg-blue-100 text-blue-800'
                          : r.kategori === 'Cukup'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.kategori}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{r.umpanBalik}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
