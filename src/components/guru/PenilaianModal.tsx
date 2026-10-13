import React, { useState } from 'react';
import { Submission, LkmData, Assessment } from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  MessageSquare,
  RotateCcw,
  Save,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface Props {
  submissionId: string;
  onClose: () => void;
  onSaved: () => void;
}

export const PenilaianModal: React.FC<Props> = ({
  submissionId,
  onClose,
  onSaved,
}) => {
  const submission = StorageService.getSubmissionById(submissionId);
  const lkms = StorageService.getLkms();
  const assessments = StorageService.getAssessments();
  const existingAssessment = assessments.find((a) => a.submissionId === submissionId);

  const lkm = lkms.find((l) => l.id === submission?.lkmId);

  // Component score state
  const [componentScores, setComponentScores] = useState<{
    [compId: string]: { score: number; maxScore: number; feedbackNote: string };
  }>(() => {
    if (existingAssessment) {
      return existingAssessment.componentScores;
    }
    // Default initial scores
    const initial: any = {};
    lkm?.components.forEach((c) => {
      // Auto-grade objective questions if available
      let autoScore = c.bobotNilai;
      let feedback = '';

      if (c.type === 'pilihan_ganda') {
        const studentAns = submission?.answers[c.id]?.selectedOption;
        const isCorrect = studentAns === c.payload.correctAnswer;
        autoScore = isCorrect ? c.bobotNilai : 0;
        feedback = isCorrect ? 'Jawaban Benar' : `Jawaban Kurang Tepat (Kunci: ${c.payload.correctAnswer})`;
      }

      initial[c.id] = {
        score: autoScore,
        maxScore: c.bobotNilai,
        feedbackNote: feedback,
      };
    });
    return initial;
  });

  const [generalFeedback, setGeneralFeedback] = useState(
    existingAssessment?.umpanBalikUmum ||
      'Kerja bagus! Seluruh aktivitas praktik kebugaran sirkuit diselesaikan dengan teknik yang baik.'
  );
  const [revisionNotes, setRevisionNotes] = useState(
    existingAssessment?.catatanRevisi || ''
  );

  if (!submission || !lkm) return null;

  // Calculate total score scaled to 0-100
  let totalAchieved = 0;
  let totalMax = 0;
  lkm.components.forEach((c) => {
    const sc = componentScores[c.id]?.score ?? c.bobotNilai;
    totalAchieved += sc;
    totalMax += c.bobotNilai;
  });

  const finalScore = totalMax > 0 ? Math.round((totalAchieved / totalMax) * 100) : 100;

  let kategori: 'Perlu Bimbingan' | 'Cukup' | 'Baik' | 'Sangat Baik' = 'Baik';
  if (finalScore >= 90) kategori = 'Sangat Baik';
  else if (finalScore >= 75) kategori = 'Baik';
  else if (finalScore >= 65) kategori = 'Cukup';
  else kategori = 'Perlu Bimbingan';

  const handleSaveAssessment = (isRevision: boolean = false) => {
    const evalData: Assessment = {
      id: existingAssessment?.id || `eval_${Date.now()}`,
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      evaluatedBy: StorageService.getCurrentUser().name,
      componentScores,
      totalScore: finalScore,
      kategoriCapaian: kategori,
      umpanBalikUmum: generalFeedback,
      catatanRevisi: isRevision ? revisionNotes || 'Silakan lengkapi dan perbaiki jawaban Anda.' : undefined,
      statusPenilaian: isRevision ? 'revisi' : 'dinilai',
      gradedAt: new Date().toISOString(),
    };

    StorageService.saveAssessment(evalData);
    showToast(
      isRevision
        ? 'Pekerjaan dikembalikan ke murid dengan catatan revisi!'
        : `Nilai berhasil disimpan! Skor: ${finalScore} (${kategori})`,
      'success'
    );
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30">
                Rubrik Penilaian Guru PJOK
              </span>
              <span className="text-xs text-slate-300">
                Kelas: {submission.classId.replace('class_', '').toUpperCase()}
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white mt-0.5">
              Lembar Evaluasi: {submission.studentName}
            </h3>
            <p className="text-xs text-blue-200">{lkm.judul}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Answer Review & Scoring */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* Score Summary Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Kalkulasi Nilai Akhir
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  {finalScore}
                </span>
                <span className="text-xs font-bold text-slate-400">/ 100</span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    kategori === 'Sangat Baik'
                      ? 'bg-emerald-100 text-emerald-800'
                      : kategori === 'Baik'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {kategori}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs text-slate-500">
              <span>Status Pengerjaan Saat Ini:</span>
              <span className="font-bold text-slate-900 uppercase tracking-wide">
                {submission.status.replace('_', ' ')}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Dikumpulkan: {new Date(submission.lastSavedAt).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Component by Component Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Rincian Jawaban Murid & Rubrik Skor
            </h4>

            {lkm.components.map((comp, idx) => {
              const answer = submission.answers[comp.id];
              const scoreData = componentScores[comp.id] || {
                score: comp.bobotNilai,
                maxScore: comp.bobotNilai,
                feedbackNote: '',
              };

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{comp.judul}</h5>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                          Tahap: {comp.stage} • Tipe: {comp.type}
                        </span>
                      </div>
                    </div>

                    {/* Score input */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-xs text-slate-500 font-semibold">Skor:</span>
                      <input
                        type="number"
                        min={0}
                        max={comp.bobotNilai}
                        value={scoreData.score}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setComponentScores({
                            ...componentScores,
                            [comp.id]: { ...scoreData, score: val },
                          });
                        }}
                        className="w-16 px-2 py-1 text-xs border border-slate-300 rounded-lg text-center font-bold"
                      />
                      <span className="text-xs text-slate-400">/ {comp.bobotNilai}</span>
                    </div>
                  </div>

                  {/* Student Answer Display */}
                  <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Jawaban Murid:
                    </span>

                    {/* Table View */}
                    {comp.type === 'tabel_pengamatan_pjok' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                            <tr>
                              <th className="p-2">No</th>
                              <th className="p-2">Bentuk Latihan</th>
                              <th className="p-2">Unsur Kebugaran</th>
                              <th className="p-2">Hasil Input Murid</th>
                              <th className="p-2">Catatan Lapangan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(comp.payload.exerciseRows || []).map((row) => {
                              const studentRow = answer?.tableData?.[row.id];
                              return (
                                <tr key={row.id}>
                                  <td className="p-2 text-center font-bold text-slate-400">{row.no}</td>
                                  <td className="p-2 font-semibold text-slate-800">{row.bentukLatihan}</td>
                                  <td className="p-2 text-slate-600">{row.unsurKebugaran}</td>
                                  <td className="p-2 font-bold text-blue-700">
                                    {studentRow?.hasil ? `${studentRow.hasil} ${row.targetSatuan}` : '-'}
                                  </td>
                                  <td className="p-2 text-slate-500 italic">
                                    {studentRow?.catatan || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Photo/Media View */}
                    {comp.type === 'unggah_foto' && (
                      <div>
                        {answer?.mediaUploaded && answer.mediaUploaded.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {answer.mediaUploaded.map((m, mIdx) => (
                              <div key={mIdx} className="space-y-1">
                                <img
                                  src={m.url}
                                  alt={m.caption || 'Dokumentasi'}
                                  className="w-48 h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
                                />
                                <p className="text-[11px] text-slate-500">{m.caption}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">Belum ada foto yang diunggah.</p>
                        )}
                      </div>
                    )}

                    {/* Text / Essay / Multiple Choice */}
                    {comp.type !== 'tabel_pengamatan_pjok' && comp.type !== 'unggah_foto' && (
                      <div className="text-slate-800">
                        {comp.type === 'pilihan_ganda' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-blue-700">
                              Pilihan Siswa: {answer?.selectedOption || '-'}
                            </span>
                            <span className="text-slate-400">
                              (Kunci Jawaban: {comp.payload.correctAnswer})
                            </span>
                          </div>
                        ) : (
                          <p className="whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 font-medium">
                            {answer?.answerText ||
                              (answer?.reflectionAnswers &&
                                Object.values(answer.reflectionAnswers).join('\n\n')) ||
                              'Belum dijawab'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback on this item */}
                  <div>
                    <input
                      type="text"
                      placeholder="Catatan umpan balik khusus aktivitas ini (opsional)..."
                      value={scoreData.feedbackNote}
                      onChange={(e) => {
                        setComponentScores({
                          ...componentScores,
                          [comp.id]: { ...scoreData, feedbackNote: e.target.value },
                        });
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* General Teacher Feedback & Revision Option */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Umpan Balik Guru (Feedback Keseluruhan):</span>
              </label>
              <textarea
                rows={3}
                value={generalFeedback}
                onChange={(e) => setGeneralFeedback(e.target.value)}
                placeholder="Tuliskan apresiasi, saran penguatan gerak, atau motivasi belajar..."
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-700 mb-1.5 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Catatan Revisi (Jika Mengembalikan Pekerjaan ke Murid):</span>
              </label>
              <input
                type="text"
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Instruksi bagian yang harus diperbaiki oleh murid..."
                className="w-full px-3.5 py-2 text-xs border border-rose-200 bg-rose-50/30 rounded-xl focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Batal
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleSaveAssessment(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan untuk Revisi</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveAssessment(false)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Terbitkan Nilai</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
