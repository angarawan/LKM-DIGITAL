import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Assignment,
  LkmData,
  Submission,
  StudentAnswer,
  User,
  LkmComponent,
} from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  ArrowLeft,
  Save,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Play,
  Upload,
  AlertCircle,
  HelpCircle,
  Award,
  Flame,
  Activity,
  Smile,
} from 'lucide-react';

interface Props {
  assignmentId: string;
  currentUser: User;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const LkmWorksheet: React.FC<Props> = ({
  assignmentId,
  currentUser,
  onBack,
  onSubmitSuccess,
}) => {
  const assignment = StorageService.getAssignmentById(assignmentId);
  const lkms = StorageService.getLkms();
  const lkm = lkms.find((l) => l.id === assignment?.lkmId);

  // Existing submission or initialize new one
  const existingSub = StorageService.getSubmissionByStudentAndAssignment(
    currentUser.id,
    assignmentId
  );

  const [answers, setAnswers] = useState<{ [componentId: string]: StudentAnswer }>(
    existingSub?.answers || {}
  );

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [activeStage, setActiveStage] = useState<'memahami' | 'mengaplikasi' | 'merefleksi'>('memahami');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<any>(null);

  if (!assignment || !lkm) {
    return (
      <div className="p-8 text-center text-slate-500">
        Data LKM tidak ditemukan.{' '}
        <button onClick={onBack} className="text-blue-600 underline">
          Kembali
        </button>
      </div>
    );
  }

  // Auto-save logic with debounce
  const triggerAutoSave = (updatedAnswers: { [componentId: string]: StudentAnswer }) => {
    setSaveStatus('dirty');
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const updatedSubmission: Submission = {
        id: existingSub?.id || `sub_${currentUser.id}_${assignment.id}`,
        assignmentId: assignment.id,
        lkmId: lkm.id,
        studentId: currentUser.id,
        studentName: currentUser.name,
        classId: currentUser.classId || 'class_xi_1',
        answers: updatedAnswers,
        status: existingSub?.status === 'perlu_revisi' ? 'sedang_dikerjakan' : (existingSub?.status || 'sedang_dikerjakan'),
        startedAt: existingSub?.startedAt || new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        submissionCount: existingSub?.submissionCount || 0,
      };
      StorageService.saveSubmission(updatedSubmission);
      setSaveStatus('saved');
    }, 800);
  };

  // Helper to update specific component answer
  const updateAnswer = (componentId: string, partial: Partial<StudentAnswer>, compType: any) => {
    const prevAns = answers[componentId] || { componentId, type: compType };
    const updated = {
      ...answers,
      [componentId]: {
        ...prevAns,
        ...partial,
      },
    };
    setAnswers(updated);
    triggerAutoSave(updated);
  };

  // Update Circuit Table Row
  const updateTableRow = (componentId: string, rowId: string, hasil: string, catatan?: string) => {
    const prevAns = answers[componentId] || {
      componentId,
      type: 'tabel_pengamatan_pjok',
      tableData: {},
    };
    const currentTableData = prevAns.tableData || {};
    const updatedTableData = {
      ...currentTableData,
      [rowId]: {
        hasil,
        catatan: catatan !== undefined ? catatan : currentTableData[rowId]?.catatan || '',
      },
    };
    updateAnswer(componentId, { tableData: updatedTableData }, 'tabel_pengamatan_pjok');
  };

  // Handle Photo upload / simulation
  const handlePhotoUploadSim = (componentId: string) => {
    // Realistic sport gym photo from Unsplash
    const samplePhotos = [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop&q=80',
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    const mediaObj = {
      type: 'image' as const,
      url: picked,
      caption: `Praktik Circuit Training di Lapangan SMAN 1 Tejakula (${currentUser.name})`,
      uploadedAt: new Date().toISOString(),
    };
    updateAnswer(componentId, { mediaUploaded: [mediaObj] }, 'unggah_foto');
    showToast('Foto dokumentasi praktik berhasil diunggah!', 'success');
  };

  // Final Submit Handler
  const handleSubmitFinal = () => {
    const finalSub: Submission = {
      id: existingSub?.id || `sub_${currentUser.id}_${assignment.id}`,
      assignmentId: assignment.id,
      lkmId: lkm.id,
      studentId: currentUser.id,
      studentName: currentUser.name,
      classId: currentUser.classId || 'class_xi_1',
      answers,
      status: 'sudah_dikumpulkan',
      submittedAt: new Date().toISOString(),
      lastSavedAt: new Date().toISOString(),
      submissionCount: (existingSub?.submissionCount || 0) + 1,
    };

    StorageService.saveSubmission(finalSub);
    StorageService.addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'KUMPULKAN_LKM',
      `Murid ${currentUser.name} mengumpulkan tugas ${lkm.judul}`
    );

    // Joyful celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // safe fallback
    }

    showToast('Selamat! LKM Anda berhasil dikumpulkan ke Guru PJOK!', 'success');
    onSubmitSuccess();
  };

  // Group components by Deep Learning Stage
  const stageMemahami = lkm.components.filter((c) => c.stage === 'memahami');
  const stageMengaplikasi = lkm.components.filter((c) => c.stage === 'mengaplikasi');
  const stageMerefleksi = lkm.components.filter((c) => c.stage === 'merefleksi');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Floating App Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 uppercase tracking-wider">
              Lembar Kerja Murid Digital
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight truncate max-w-md">
              {lkm.judul}
            </h2>
          </div>
        </div>

        {/* Auto Save Status & Submit Button */}
        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium px-2.5 py-1 rounded-lg bg-slate-100">
            {saveStatus === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersimpan</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="text-blue-700">Menyimpan...</span>
              </>
            )}
            {saveStatus === 'dirty' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Mengetik...</span>
              </>
            )}
          </div>

          <button
            onClick={handleSubmitFinal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kumpulkan Tugas</span>
          </button>
        </div>
      </div>

      {/* Revision Notice if any */}
      {existingSub?.status === 'perlu_revisi' && existingSub.revisionNotes && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span>Permintaan Revisi dari Guru PJOK</span>
          </div>
          <p className="text-xs text-rose-700 pl-7 leading-relaxed font-medium">
            "{existingSub.revisionNotes}"
          </p>
        </div>
      )}

      {/* Deep Learning 3-Stage Tab Selector */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveStage('memahami')}
          className={`p-3 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
            activeStage === 'memahami'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>1. Memahami (Mindful)</span>
        </button>

        <button
          onClick={() => setActiveStage('mengaplikasi')}
          className={`p-3 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
            activeStage === 'mengaplikasi'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>2. Mengaplikasi (Praktik)</span>
        </button>

        <button
          onClick={() => setActiveStage('merefleksi')}
          className={`p-3 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
            activeStage === 'merefleksi'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>3. Merefleksi (Joyful)</span>
        </button>
      </div>

      {/* STAGE 1: MEMAHAMI (MINDFUL LEARNING) */}
      {activeStage === 'memahami' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5">
            <h3 className="font-extrabold text-base text-blue-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Tahap 1: Memahami (Mindful Learning)</span>
            </h3>
            <p className="text-xs text-blue-800/80 mt-1">
              Bangun kesadaran gerak (mindful movement), pahami tujuan pembelajaran kebugaran jasmani, dan perhatikan prinsip keselamatan saat berolahraga.
            </p>
          </div>

          {stageMemahami.map((comp, idx) => (
            <div
              key={comp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{comp.judul}</h4>
                  <p className="text-xs text-slate-500">{comp.instruksi}</p>
                </div>
              </div>

              {/* Text Materi */}
              {comp.type === 'text_materi' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {comp.payload.materiText}
                </div>
              )}

              {/* Video Embed */}
              {comp.type === 'video_embed' && (
                <div className="space-y-3">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-sm">
                    <iframe
                      src="https://www.youtube.com/embed/kYkyXbH_xG8"
                      title="Video Pembelajaran PJOK"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-slate-600 italic">{comp.payload.pertanyaan}</p>
                </div>
              )}

              {/* Pertanyaan Pemantik */}
              {comp.type === 'pertanyaan_pemantik' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800">{comp.payload.pertanyaan}</p>
                  <textarea
                    rows={3}
                    placeholder="Tuliskan pemikiran dan respon Anda..."
                    value={answers[comp.id]?.answerText || ''}
                    onChange={(e) =>
                      updateAnswer(comp.id, { answerText: e.target.value }, 'pertanyaan_pemantik')
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Pilihan Ganda A-E */}
              {comp.type === 'pilihan_ganda' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {comp.payload.pertanyaan}
                  </p>
                  <div className="space-y-2">
                    {(comp.payload.options || []).map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[comp.id]?.selectedOption === letter;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() =>
                            updateAnswer(comp.id, { selectedOption: letter }, 'pilihan_ganda')
                          }
                          className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-500 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveStage('mengaplikasi')}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
            >
              Lanjut ke Praktik Lapangan &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 2: MENGAPLIKASI (PRAKTIK & MEANINGFUL LEARNING) */}
      {activeStage === 'mengaplikasi' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-5">
            <h3 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Tahap 2: Mengaplikasi (Meaningful Practice)</span>
            </h3>
            <p className="text-xs text-emerald-800/80 mt-1">
              Laksanakan tantangan circuit training di lapangan olahraga SMAN 1 Tejakula, rekam data repetisi atau waktu tempuh ke dalam tabel pengamatan, dan sertakan bukti dokumentasi gerak.
            </p>
          </div>

          {stageMengaplikasi.map((comp, idx) => (
            <div
              key={comp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{comp.judul}</h4>
                  <p className="text-xs text-slate-500">{comp.instruksi}</p>
                </div>
              </div>

              {/* Dynamic PJOK Circuit Table */}
              {comp.type === 'tabel_pengamatan_pjok' && (
                <div className="space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-bold tracking-wider">
                        <tr>
                          <th className="p-3 w-10 text-center">Pos</th>
                          <th className="p-3">Bentuk Latihan</th>
                          <th className="p-3">Unsur Kebugaran</th>
                          <th className="p-3 w-36">Hasil Capaian</th>
                          <th className="p-3">Catatan Evaluasi Gerak</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(comp.payload.exerciseRows || []).map((row) => {
                          const userRow = answers[comp.id]?.tableData?.[row.id] || {
                            hasil: '',
                            catatan: '',
                          };

                          return (
                            <tr key={row.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-3 text-center font-bold text-slate-400">
                                {row.no}
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-slate-900 block">
                                  {row.bentukLatihan}
                                </span>
                                {row.petunjuk && (
                                  <span className="text-[10px] text-slate-400">{row.petunjuk}</span>
                                )}
                              </td>
                              <td className="p-3 font-medium text-slate-600">
                                {row.unsurKebugaran}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Input..."
                                    value={userRow.hasil}
                                    onChange={(e) =>
                                      updateTableRow(comp.id, row.id, e.target.value)
                                    }
                                    className="w-20 p-2 text-xs border border-slate-300 rounded-lg font-bold text-center focus:ring-2 focus:ring-emerald-500"
                                  />
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    {row.targetSatuan}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  placeholder="Contoh: Gerakan ritmis, tumpuan seimbang..."
                                  value={userRow.catatan || ''}
                                  onChange={(e) =>
                                    updateTableRow(comp.id, row.id, userRow.hasil, e.target.value)
                                  }
                                  className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    * Data hasil repetisi atau detik disimpan otomatis ke sistem.
                  </p>
                </div>
              )}

              {/* Photo Proof Upload */}
              {comp.type === 'unggah_foto' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50">
                    <Camera className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        Dokumentasi Praktik di Lapangan Sekolah
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ambil foto menggunakan kamera HP atau unggah foto kelompok
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePhotoUploadSim(comp.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Unggah Foto Bukti Lapangan</span>
                    </button>
                  </div>

                  {/* Uploaded Photos Preview */}
                  {answers[comp.id]?.mediaUploaded && answers[comp.id].mediaUploaded!.length > 0 && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      {answers[comp.id].mediaUploaded!.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md max-w-xs"
                        >
                          <img
                            src={m.url}
                            alt="Bukti Praktik"
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-2.5 bg-white text-xs font-medium text-slate-700">
                            {m.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subjective Essay / Analysis */}
              {comp.type === 'uraian' && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {comp.payload.pertanyaan}
                  </p>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan analisis gerak dan faktor penyebab kesalahan..."
                    value={answers[comp.id]?.answerText || ''}
                    onChange={(e) =>
                      updateAnswer(comp.id, { answerText: e.target.value }, 'uraian')
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setActiveStage('memahami')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              &larr; Kembali ke Memahami
            </button>
            <button
              onClick={() => setActiveStage('merefleksi')}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Lanjut ke Refleksi (Joyful) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: MEREFLEKSI (JOYFUL LEARNING & REFLECTION) */}
      {activeStage === 'merefleksi' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/80 rounded-2xl p-5">
            <h3 className="font-extrabold text-base text-purple-950 flex items-center gap-2">
              <Smile className="w-5 h-5 text-purple-600" />
              <span>Tahap 3: Merefleksi (Joyful Learning)</span>
            </h3>
            <p className="text-xs text-purple-800/80 mt-1">
              Refleksikan proses pembelajaran dengan gembira, kenali perasaan saat bergerak, dan rencanakan kebiasaan olahraga mandiri untuk kesehatan sepanjang hayat.
            </p>
          </div>

          {stageMerefleksi.map((comp, idx) => {
            const prompts =
              comp.payload.reflectionPrompts || [
                'Apa hal penting yang Anda pahami dari pembelajaran hari ini?',
                'Bagaimana perasaan Anda saat berkolaborasi dalam tantangan fisik?',
                'Apa rencana Anda untuk menjaga kebugaran jasmani di luar jam sekolah?',
              ];

            const refAnswers = answers[comp.id]?.reflectionAnswers || {};

            return (
              <div
                key={comp.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{comp.judul}</h4>
                    <p className="text-xs text-slate-500">{comp.instruksi}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {prompts.map((promptText, pIdx) => (
                    <div key={pIdx} className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {pIdx + 1}. {promptText}
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Refleksi jujur Anda..."
                        value={refAnswers[pIdx] || ''}
                        onChange={(e) => {
                          const updatedRef = { ...refAnswers, [pIdx]: e.target.value };
                          updateAnswer(
                            comp.id,
                            { reflectionAnswers: updatedRef },
                            'refleksi_pembelajaran'
                          );
                        }}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Bottom Confirmation & Submit */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-xs text-slate-900">
                Semua tahapan (Memahami, Mengaplikasi, Merefleksi) telah diisi?
              </p>
              <p className="text-[11px] text-slate-500">
                Jawaban Anda tersimpan otomatis dan akan dinilai oleh Guru PJOK.
              </p>
            </div>

            <button
              onClick={handleSubmitFinal}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kumpulkan LKM Sekarang</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
