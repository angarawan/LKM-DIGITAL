import React from 'react';
import { User, Assignment } from '../../types';
import { StorageService } from '../../services/storage';
import {
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Activity,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: User;
  onOpenWorksheet: (assignmentId: string) => void;
  onViewGrade: (submissionId: string) => void;
}

export const MuridDashboard: React.FC<Props> = ({
  currentUser,
  onOpenWorksheet,
  onViewGrade,
}) => {
  const settings = StorageService.getSettings();
  const assignments = StorageService.getAssignments();
  const submissions = StorageService.getSubmissions();
  const assessments = StorageService.getAssessments();
  const classes = StorageService.getClasses();

  const studentClass = classes.find((c) => c.id === currentUser.classId);

  // Student specific submissions
  const mySubmissions = submissions.filter((s) => s.studentId === currentUser.id);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ruang Belajar Digital Murid</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1">
            Halo, {currentUser.name}!
          </h2>
          <p className="text-xs sm:text-sm text-blue-200">
            {studentClass?.name || 'Kelas XI-1'} • NIS: {currentUser.nipNis || '-'} • {settings.namaSekolah}
          </p>
          <p className="text-xs text-slate-300 italic mt-2">
            "Belajar, Bergerak, Berkolaborasi, dan Merefleksi."
          </p>
        </div>

        {/* Decorative badge */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
          <Activity className="w-12 h-12 text-blue-400" />
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              LKM Ditugaskan
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{assignments.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Sesi aktif semester ini</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pekerjaan Terkumpul
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {mySubmissions.filter((s) => s.status === 'sudah_dikumpulkan' || s.status === 'sudah_dinilai').length}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Diserahkan ke Guru PJOK</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nilai Capaian
            </p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              {assessments.find((a) => a.studentId === currentUser.id)?.totalScore || 'Siap'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {assessments.find((a) => a.studentId === currentUser.id)?.kategoriCapaian || 'LKM Aktif'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Assigned LKMs List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Lembar Kerja Murid (LKM) yang Ditugaskan</span>
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {assignments.length} Tugas Tersedia
          </span>
        </div>

        <div className="space-y-3">
          {assignments.map((asg) => {
            const sub = mySubmissions.find((s) => s.assignmentId === asg.id);
            const evalData = sub ? assessments.find((a) => a.submissionId === sub.id) : undefined;

            let statusLabel = 'Belum Dikerjakan';
            let statusColor = 'bg-slate-100 text-slate-700';

            if (sub?.status === 'sudah_dinilai') {
              statusLabel = `Sudah Dinilai: ${evalData?.totalScore || 90} (${evalData?.kategoriCapaian || 'Baik'})`;
              statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
            } else if (sub?.status === 'sudah_dikumpulkan') {
              statusLabel = 'Sudah Dikumpulkan (Menunggu Penilaian)';
              statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
            } else if (sub?.status === 'perlu_revisi') {
              statusLabel = 'Perlu Revisi (Cek Catatan Guru)';
              statusColor = 'bg-rose-100 text-rose-800 border-rose-300';
            } else if (sub?.status === 'sedang_dikerjakan') {
              statusLabel = 'Sedang Dikerjakan (Draft Tersimpan)';
              statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
            }

            return (
              <div
                key={asg.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Mode: {asg.mode === 'individu' ? 'Individu' : 'Kelompok'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                    {asg.lkmJudul}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Tenggat: {new Date(asg.batasPengumpulan).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {sub?.revisionNotes && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 mt-2">
                      <strong>Catatan Revisi Guru: </strong>
                      {sub.revisionNotes}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 self-start md:self-center">
                  <button
                    onClick={() => onOpenWorksheet(asg.id)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>{sub ? 'Buka Lembar Kerja' : 'Mulai Kerjakan'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {evalData && sub && (
                    <button
                      onClick={() => onViewGrade(sub.id)}
                      className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition"
                    >
                      Lihat Nilai
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
