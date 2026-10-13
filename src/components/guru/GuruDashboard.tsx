import React from 'react';
import { StorageService } from '../../services/storage';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  PlusCircle,
  Send,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Sparkles,
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  onGradeSubmission: (submissionId: string) => void;
  onPrintLkm: (lkmId: string) => void;
}

export const GuruDashboard: React.FC<Props> = ({
  onNavigate,
  onGradeSubmission,
  onPrintLkm,
}) => {
  const settings = StorageService.getSettings();
  const classes = StorageService.getClasses();
  const lkms = StorageService.getLkms();
  const assignments = StorageService.getAssignments();
  const submissions = StorageService.getSubmissions();
  const assessments = StorageService.getAssessments();
  const users = StorageService.getUsers();

  const totalStudents = users.filter((u) => u.role === 'murid').length;
  const activeLkms = lkms.filter((l) => l.status === 'published').length;
  const submittedSubmissions = submissions.filter((s) => s.status === 'sudah_dikumpulkan');
  const gradedSubmissions = submissions.filter((s) => s.status === 'sudah_dinilai');
  const revisionSubmissions = submissions.filter((s) => s.status === 'perlu_revisi');
  const inProgressSubmissions = submissions.filter((s) => s.status === 'sedang_dikerjakan');

  // Average score
  const totalScores = assessments.map((a) => a.totalScore);
  const avgScore =
    totalScores.length > 0
      ? (totalScores.reduce((acc, s) => acc + s, 0) / totalScores.length).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-blue-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Kurikulum Merdeka & Deep Learning PJOK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            SELAMAT DATANG DI LKM DIGITAL PJOK
          </h2>
          <p className="text-sm sm:text-base font-semibold text-blue-200 mb-1">
            {settings.namaSekolah}
          </p>
          <p className="text-xs sm:text-sm text-slate-300 italic mb-4">
            "{settings.slogan}"
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-blue-100/90 pt-3 border-t border-blue-800/60">
            <div>
              <span className="text-slate-400">Guru PJOK: </span>
              <strong className="text-white">{settings.guruPjokUtama}</strong>
            </div>
            <div>
              <span className="text-slate-400">NIP: </span>
              <span className="text-slate-200">{settings.nipGuruPjokUtama}</span>
            </div>
            <div>
              <span className="text-slate-400">Tahun Ajaran: </span>
              <span className="text-emerald-300 font-semibold">
                {settings.tahunAjaranAktif} ({settings.semesterAktif})
              </span>
            </div>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-blue-600/10 blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-0 -translate-y-12 w-60 h-60 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Murid */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Murid
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {totalStudents}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Tersebar di {classes.length} Rombel
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* LKM Aktif */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              LKM Diterbitkan
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {activeLkms}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {assignments.length} Sesi Penugasan
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Menunggu Penilaian */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Penilaian
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {submittedSubmissions.length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {gradedSubmissions.length} Sudah Dinilai
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Rata-rata Nilai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Nilai
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {avgScore}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Skala 0 - 100
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Aksi Cepat Guru:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('buat_lkm')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Buat LKM Baru</span>
          </button>
          <button
            onClick={() => onNavigate('penugasan')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Tugaskan ke Kelas</span>
          </button>
          <button
            onClick={() => onNavigate('rekap_nilai')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Rekap Nilai Excel</span>
          </button>
          <button
            onClick={() => onPrintLkm(lkms[0]?.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Template A4</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Pending Grading & Class Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Submissions needing action */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-amber-500 rounded-full" />
              <h3 className="font-bold text-base text-slate-900">
                Pekerjaan Murid yang Perlu Ditinjau & Dinilai
              </h3>
            </div>
            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          {submittedSubmissions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600">
                Semua pekerjaan yang dikumpulkan sudah dinilai!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Belum ada pengumpulan baru yang menunggu penilaian.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {submittedSubmissions.map((sub) => {
                const lkm = lkms.find((l) => l.id === sub.lkmId);
                const cls = classes.find((c) => c.id === sub.classId);
                return (
                  <div
                    key={sub.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 px-2 rounded-xl transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {sub.studentName}
                        </span>
                        <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {cls?.name || 'XI-1'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                        {lkm?.judul || 'LKM Kebugaran Jasmani'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Dikumpulkan: {new Date(sub.submittedAt || sub.lastSavedAt).toLocaleString('id-ID')}
                      </p>
                    </div>

                    <button
                      onClick={() => onGradeSubmission(sub.id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Beri Nilai & Umpan Balik</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recently Graded Section */}
          {gradedSubmissions.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pekerjaan yang Telah Selesai Dinilai
              </h4>
              <div className="space-y-2">
                {gradedSubmissions.slice(0, 3).map((sub) => {
                  const evalData = assessments.find((a) => a.submissionId === sub.id);
                  return (
                    <div
                      key={sub.id}
                      className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          {sub.studentName}
                          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Skor: {evalData?.totalScore || 90} ({evalData?.kategoriCapaian || 'Baik'})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          "{evalData?.umpanBalikUmum || 'Hasil gerak sangat baik.'}"
                        </p>
                      </div>
                      <button
                        onClick={() => onGradeSubmission(sub.id)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline ml-2"
                      >
                        Edit Nilai
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Class Progress & Status Breakdown */}
        <div className="space-y-6">
          {/* Status Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-100">
              Status Pengerjaan LKM Murid
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sudah Dinilai
                  </span>
                  <span className="text-slate-900 font-bold">{gradedSubmissions.length} Murid</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${(gradedSubmissions.length / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Menunggu Penilaian
                  </span>
                  <span className="text-slate-900 font-bold">{submittedSubmissions.length} Murid</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${(submittedSubmissions.length / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Sedang Dikerjakan
                  </span>
                  <span className="text-slate-900 font-bold">{inProgressSubmissions.length} Murid</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all"
                    style={{ width: `${(inProgressSubmissions.length / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Perlu Revisi
                  </span>
                  <span className="text-slate-900 font-bold">{revisionSubmissions.length} Murid</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${(revisionSubmissions.length / (totalStudents || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rombongan Belajar PJOK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Kelas Binaan PJOK</h3>
              <button
                onClick={() => onNavigate('data_murid_kelas')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-2">
              {classes.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2">Fase {c.fase}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {c.totalStudents} Murid
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
