import React from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentUser: User;
  onOpenWorksheet: (assignmentId: string) => void;
}

export const RiwayatNilai: React.FC<Props> = ({ currentUser, onOpenWorksheet }) => {
  const submissions = StorageService.getSubmissions().filter((s) => s.studentId === currentUser.id);
  const assessments = StorageService.getAssessments().filter((a) => a.studentId === currentUser.id);
  const assignments = StorageService.getAssignments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Riwayat Pembelajaran
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Hasil Evaluasi & Umpan Balik Guru
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Nilai & Catatan Guru PJOK
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelajari umpan balik untuk meningkatkan teknik gerak dan kebugaran jasmani Anda.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-sm text-slate-700">Belum ada riwayat tugas yang dikerjakan.</p>
            <p className="text-xs text-slate-400 mt-1">Buka menu "LKM Saya" untuk mulai mengerjakan tugas.</p>
          </div>
        ) : (
          submissions.map((sub) => {
            const asg = assignments.find((a) => a.id === sub.assignmentId);
            const evalData = assessments.find((a) => a.submissionId === sub.id);

            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      {asg?.lkmJudul || 'LKM PJOK'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Terakhir disimpan: {new Date(sub.lastSavedAt).toLocaleString('id-ID')}
                    </p>
                  </div>

                  {evalData ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Skor Akhir
                        </span>
                        <div className="text-2xl font-black text-emerald-700 leading-none">
                          {evalData.totalScore}
                          <span className="text-xs text-slate-400 font-normal"> / 100</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          evalData.kategoriCapaian === 'Sangat Baik'
                            ? 'bg-emerald-100 text-emerald-800'
                            : evalData.kategoriCapaian === 'Baik'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {evalData.kategoriCapaian}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      Menunggu Penilaian Guru
                    </span>
                  )}
                </div>

                {/* Feedback Note from Teacher */}
                {evalData && (
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Umpan Balik Guru ({evalData.evaluatedBy}):</span>
                    </span>
                    <p className="text-xs text-emerald-950 font-medium leading-relaxed pl-5">
                      "{evalData.umpanBalikUmum}"
                    </p>
                  </div>
                )}

                {/* Revision banner */}
                {sub.status === 'perlu_revisi' && (
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 space-y-2">
                    <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                      <span>Guru Meminta Revisi:</span>
                    </span>
                    <p className="text-xs text-rose-700 pl-5">{sub.revisionNotes}</p>
                    <button
                      onClick={() => onOpenWorksheet(sub.assignmentId)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
                    >
                      Perbaiki Sekarang &rarr;
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onOpenWorksheet(sub.assignmentId)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Lihat Kembali Lembar Jawaban</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
