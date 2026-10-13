import React, { useState } from 'react';
import {
  LkmData,
  LkmComponent,
  ComponentType,
  DeepLearningStage,
  PjokExerciseRow,
} from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Sparkles,
  Layers,
  FileText,
  Activity,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  HelpCircle,
  CheckSquare,
  Camera,
} from 'lucide-react';

interface Props {
  initialLkm?: LkmData | null;
  onSaveSuccess: (lkm: LkmData) => void;
  onCancel: () => void;
}

export const LkmBuilder: React.FC<Props> = ({
  initialLkm,
  onSaveSuccess,
  onCancel,
}) => {
  const settings = StorageService.getSettings();

  // Active tab in builder: 'identitas' | 'perencanaan' | 'komponen'
  const [activeStep, setActiveStep] = useState<'identitas' | 'perencanaan' | 'komponen'>('identitas');

  // Form State
  const [formData, setFormData] = useState<LkmData>(
    initialLkm || {
      id: `lkm_${Date.now()}`,
      judul: 'LKM 02: Permainan Bola Besar - Analisis Keterampilan Gerak Passing & Dribbling Bola Basket',
      mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
      fase: 'F',
      kelas: 'XI',
      semester: 'Ganjil',
      tahunAjaran: settings.tahunAjaranAktif,
      guruPembuat: settings.guruPjokUtama,
      guruNip: settings.nipGuruPjokUtama,
      materiPokok: 'Permainan Invasi (Bola Basket)',
      topik: 'Keterampilan Variasi Gerak Passing dan Dribbling',
      pertemuanKe: 1,
      alokasiWaktu: '3 x 45 Menit',
      capaianPembelajaran:
        'Peserta didik mampu merancang, mempraktikkan, dan mengevaluasi variasi pola gerak dasar spesifik permainan bola basket secara mandiri dan berkelompok.',
      tujuanPembelajaran: [
        'Menganalisis konsep mekanika gerak chest pass dan bounce pass.',
        'Mempraktikkan variasi passing dan dribbling secara berpasangan di lapangan.',
        'Mengidentifikasi kesalahan gerak saat bola terlepas atau tidak tepat sasaran.',
        'Merefleksikan pentingnya kerja sama tim dan sportivitas.',
      ],
      kktp: [
        'Mampu mempraktikkan passing dengan akurasi 80% ke sasaran rekan.',
        'Mampu melakukan dribbling melewati rintangan tanpa bola keluar kontrol.',
        'Mampu mengisi tabel pencatatan pengamatan praktik secara teratur.',
      ],
      dimensiProfilLulusan: [
        'Gotong Royong (Kolaborasi tim)',
        'Mandiri (Disiplin gerak fisik)',
        'Bernalar Kritis (Analisis pola gerak)',
      ],
      modelPembelajaran: 'Problem Based Learning & Collaborative Learning',
      pendekatanPembelajaran: 'Deep Learning (Mindful, Meaningful, Joyful)',
      saranaPrasarana: 'Lapangan Basket, Bola Basket (6 buah), Cone/Kerucut, Stopwatch.',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      components: [
        {
          id: `comp_${Date.now()}_1`,
          lkmId: '',
          urutan: 1,
          type: 'text_materi',
          stage: 'memahami',
          judul: 'Petunjuk & Orientasi Gerak Berkesadaran (Mindful)',
          instruksi: 'Pahami instruksi keselamatan dan tujuan gerak.',
          isRequired: true,
          bobotNilai: 10,
          payload: {
            materiText:
              'Lakukan pemanasan statis dan dinamis dengan fokus pada sendi pergelangan tangan, bahu, dan lutut sebelum menyentuh bola.',
          },
        },
        {
          id: `comp_${Date.now()}_2`,
          lkmId: '',
          urutan: 2,
          type: 'pertanyaan_pemantik',
          stage: 'memahami',
          judul: 'Pertanyaan Pemantik: Makna Passing dalam Permainan Tim',
          instruksi: 'Uraikan pendapat Anda mengenai kerja sama passing.',
          isRequired: true,
          bobotNilai: 15,
          payload: {
            pertanyaan:
              'Kapan waktu yang paling tepat menggunakan Chest Pass dibandingkan Bounce Pass saat menghadapi penjagaan lawan yang agresif?',
          },
        },
        {
          id: `comp_${Date.now()}_3`,
          lkmId: '',
          urutan: 3,
          type: 'tabel_pengamatan_pjok',
          stage: 'mengaplikasi',
          judul: 'Tabel Pengamatan Praktik Keterampilan Gerak',
          instruksi: 'Lakukan uji coba gerak bersama pasangan Anda dan catat hasilnya.',
          isRequired: true,
          bobotNilai: 40,
          payload: {
            exerciseRows: [
              {
                id: 'row_1',
                no: 1,
                bentukLatihan: 'Chest Pass (Jarak 4 Meter)',
                unsurKebugaran: 'Akurasi dan Koordinasi Lengan',
                targetSatuan: 'Repetisi Berhasil',
                petunjuk: '10 kali percobaan passing lurus ke dada pasangan.',
              },
              {
                id: 'row_2',
                no: 2,
                bentukLatihan: 'Bounce Pass (Pantulan Lantai)',
                unsurKebugaran: 'Ketepatan Titik Pantul',
                targetSatuan: 'Repetisi Berhasil',
                petunjuk: 'Pantulkan 2/3 jarak menuju teman.',
              },
              {
                id: 'row_3',
                no: 3,
                bentukLatihan: 'Zig-zag Dribble Mengitari 5 Cone',
                unsurKebugaran: 'Kelincahan dan Kontrol Bola',
                targetSatuan: 'Detik',
                petunjuk: 'Dribble rendah dengan tangan dominan & non-dominan.',
              },
            ],
          },
        },
        {
          id: `comp_${Date.now()}_4`,
          lkmId: '',
          urutan: 4,
          type: 'refleksi_pembelajaran',
          stage: 'merefleksi',
          judul: 'Refleksi Joyful Learning & Sportivitas',
          instruksi: 'Tuliskan refleksi pembelajaran hari ini.',
          isRequired: true,
          bobotNilai: 15,
          payload: {
            reflectionPrompts: [
              'Bagaimana perasaan Anda saat berkolaborasi dengan pasangan gerak?',
              'Apa kesulitan teknis yang paling Anda rasakan saat menggiring bola?',
              'Bagaimana cara Anda memperbaiki akurasi passing pada pertemuan berikutnya?',
            ],
          },
        },
      ],
    }
  );

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Helper for components
  const addComponent = (type: ComponentType, stage: DeepLearningStage) => {
    let defaultTitle = 'Aktivitas Baru';
    let defaultPayload: any = {};

    switch (type) {
      case 'text_materi':
        defaultTitle = 'Materi Pembelajaran';
        defaultPayload = { materiText: 'Tuliskan rangkuman materi singkat di sini...' };
        break;
      case 'video_embed':
        defaultTitle = 'Video Pembelajaran PJOK';
        defaultPayload = {
          mediaUrl: 'https://www.youtube.com/watch?v=kYkyXbH_xG8',
          pertanyaan: 'Amati video teknik gerak di atas.',
        };
        break;
      case 'pertanyaan_pemantik':
        defaultTitle = 'Pertanyaan Pemantik';
        defaultPayload = { pertanyaan: 'Tuliskan pertanyaan pemantik di sini...' };
        break;
      case 'pilihan_ganda':
        defaultTitle = 'Pilihan Ganda A - E';
        defaultPayload = {
          pertanyaan: 'Soal pilihan ganda...',
          options: ['A. Opsi A', 'B. Opsi B', 'C. Opsi C', 'D. Opsi D', 'E. Opsi E'],
          correctAnswer: 'A',
        };
        break;
      case 'uraian':
        defaultTitle = 'Analisis Kasus & Uraian';
        defaultPayload = { pertanyaan: 'Jelaskan analisis permasalahan olahraga di bawah ini...' };
        break;
      case 'tabel_pengamatan_pjok':
        defaultTitle = 'Tabel Pengamatan Praktik PJOK';
        defaultPayload = {
          exerciseRows: [
            {
              id: `row_${Date.now()}_1`,
              no: 1,
              bentukLatihan: 'Bentuk Latihan 1',
              unsurKebugaran: 'Kekuatan / Kelincahan',
              targetSatuan: 'Repetisi',
              petunjuk: 'Petunjuk singkat latihan',
            },
            {
              id: `row_${Date.now()}_2`,
              no: 2,
              bentukLatihan: 'Bentuk Latihan 2',
              unsurKebugaran: 'Daya Tahan',
              targetSatuan: 'Detik',
              petunjuk: 'Petunjuk singkat latihan',
            },
          ],
        };
        break;
      case 'unggah_foto':
        defaultTitle = 'Unggah Dokumentasi Foto Praktik';
        defaultPayload = { materiText: 'Unggah bukti foto kegiatan di lapangan.' };
        break;
      case 'refleksi_pembelajaran':
        defaultTitle = 'Refleksi Pembelajaran';
        defaultPayload = {
          reflectionPrompts: [
            'Apa hal penting yang Anda pelajari hari ini?',
            'Apa kesulitan yang Anda alami?',
            'Bagaimana rencana Anda memperbaikinya?',
          ],
        };
        break;
      default:
        defaultPayload = { pertanyaan: 'Pertanyaan umum...' };
    }

    const newComp: LkmComponent = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      lkmId: formData.id,
      urutan: formData.components.length + 1,
      type,
      stage,
      judul: defaultTitle,
      instruksi: 'Ikuti instruksi pengerjaan dengan cermat.',
      isRequired: true,
      bobotNilai: 10,
      payload: defaultPayload,
    };

    setFormData({
      ...formData,
      components: [...formData.components, newComp],
    });
  };

  const removeComponent = (id: string) => {
    setFormData({
      ...formData,
      components: formData.components.filter((c) => c.id !== id),
    });
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newComps = [...formData.components];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newComps.length) return;
    const temp = newComps[index];
    newComps[index] = newComps[targetIndex];
    newComps[targetIndex] = temp;
    setFormData({
      ...formData,
      components: newComps.map((c, idx) => ({ ...c, urutan: idx + 1 })),
    });
  };

  const updateComponent = (id: string, updates: Partial<LkmComponent>) => {
    setFormData({
      ...formData,
      components: formData.components.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    });
  };

  const updatePayload = (id: string, payloadUpdates: any) => {
    setFormData({
      ...formData,
      components: formData.components.map((c) =>
        c.id === id ? { ...c, payload: { ...c.payload, ...payloadUpdates } } : c
      ),
    });
  };

  // Add row to table PJOK
  const addExerciseRow = (comp: LkmComponent) => {
    const existing = comp.payload.exerciseRows || [];
    const newRow: PjokExerciseRow = {
      id: `row_${Date.now()}`,
      no: existing.length + 1,
      bentukLatihan: 'Latihan Baru',
      unsurKebugaran: 'Kelincahan / Daya Tahan',
      targetSatuan: 'Repetisi',
      petunjuk: 'Petunjuk gerak',
    };
    updatePayload(comp.id, { exerciseRows: [...existing, newRow] });
  };

  const removeExerciseRow = (comp: LkmComponent, rowId: string) => {
    const existing = comp.payload.exerciseRows || [];
    updatePayload(comp.id, {
      exerciseRows: existing.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, no: i + 1 })),
    });
  };

  const handleSave = () => {
    if (!formData.judul.trim()) {
      showToast('Judul LKM wajib diisi!', 'error');
      return;
    }
    const finalLkm = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    StorageService.saveLkm(finalLkm);
    onSaveSuccess(finalLkm);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                LKM Editor
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {initialLkm ? 'Edit LKM' : 'Buat LKM Baru'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 truncate max-w-xl">
              {formData.judul}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Pratinjau</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan LKM</span>
          </button>
        </div>
      </div>

      {/* Builder Steps Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3 space-x-6">
        <button
          onClick={() => setActiveStep('identitas')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeStep === 'identitas'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Identitas LKM</span>
        </button>

        <button
          onClick={() => setActiveStep('perencanaan')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeStep === 'perencanaan'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Perencanaan Kurikulum Merdeka</span>
        </button>

        <button
          onClick={() => setActiveStep('komponen')}
          className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeStep === 'komponen'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Aktivitas & Komponen ({formData.components.length})</span>
        </button>
      </div>

      {/* STEP 1: IDENTITAS LKM */}
      {activeStep === 'identitas' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Judul LKM *
              </label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold"
                placeholder="Contoh: LKM 01: Kebugaran Jasmani - Circuit Training"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Materi Pokok / Pembelajaran *
              </label>
              <input
                type="text"
                value={formData.materiPokok}
                onChange={(e) => setFormData({ ...formData, materiPokok: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Topik Khusus
              </label>
              <input
                type="text"
                value={formData.topik}
                onChange={(e) => setFormData({ ...formData, topik: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Fase
                </label>
                <select
                  value={formData.fase}
                  onChange={(e) => setFormData({ ...formData, fase: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                >
                  <option value="E">Fase E (Kelas X)</option>
                  <option value="F">Fase F (Kelas XI - XII)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Kelas
                </label>
                <select
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                >
                  <option value="X">Kelas X</option>
                  <option value="XI">Kelas XI</option>
                  <option value="XII">Kelas XII</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pertemuan Ke-
                </label>
                <input
                  type="number"
                  value={formData.pertemuanKe}
                  onChange={(e) => setFormData({ ...formData, pertemuanKe: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={formData.alokasiWaktu}
                  onChange={(e) => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                  placeholder="3 x 45 Menit"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Guru Pembuat
              </label>
              <input
                type="text"
                value={formData.guruPembuat}
                onChange={(e) => setFormData({ ...formData, guruPembuat: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                NIP Guru
              </label>
              <input
                type="text"
                value={formData.guruNip || ''}
                onChange={(e) => setFormData({ ...formData, guruNip: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep('perencanaan')}
              className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Lanjut ke Perencanaan &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PERENCANAAN KURIKULUM MERDEKA */}
      {activeStep === 'perencanaan' && (
        <div className="bg-white p-6 rounded-b-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Capaian Pembelajaran (CP) PJOK
            </label>
            <textarea
              rows={3}
              value={formData.capaianPembelajaran}
              onChange={(e) => setFormData({ ...formData, capaianPembelajaran: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tujuan Pembelajaran (TP) - Pisahkan baris
            </label>
            <textarea
              rows={4}
              value={formData.tujuanPembelajaran.join('\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tujuanPembelajaran: e.target.value.split('\n').filter((t) => t.trim().length > 0),
                })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="1. Peserta didik mampu menganalisis..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) - Pisahkan baris
            </label>
            <textarea
              rows={3}
              value={formData.kktp.join('\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kktp: e.target.value.split('\n').filter((t) => t.trim().length > 0),
                })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Model Pembelajaran
              </label>
              <input
                type="text"
                value={formData.modelPembelajaran}
                onChange={(e) => setFormData({ ...formData, modelPembelajaran: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Pendekatan Pembelajaran
              </label>
              <input
                type="text"
                value={formData.pendekatanPembelajaran}
                onChange={(e) => setFormData({ ...formData, pendekatanPembelajaran: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Sarana dan Prasarana
              </label>
              <input
                type="text"
                value={formData.saranaPrasarana}
                onChange={(e) => setFormData({ ...formData, saranaPrasarana: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setActiveStep('identitas')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              &larr; Kembali
            </button>
            <button
              onClick={() => setActiveStep('komponen')}
              className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
            >
              Lanjut ke Komponen Aktivitas &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: AKTIVITAS & KOMPONEN DINAMIS */}
      {activeStep === 'komponen' && (
        <div className="space-y-6">
          {/* Quick Toolbar to Add Activities */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Tambah Komponen Aktivitas LKM</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih bentuk aktivitas sesuai tahapan Deep Learning (Memahami, Mengaplikasi, Merefleksi)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => addComponent('text_materi', 'memahami')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Teks Materi
              </button>
              <button
                onClick={() => addComponent('video_embed', 'memahami')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Video Embed
              </button>
              <button
                onClick={() => addComponent('pertanyaan_pemantik', 'memahami')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Pertanyaan Pemantik
              </button>
              <button
                onClick={() => addComponent('pilihan_ganda', 'memahami')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Pilihan Ganda (A-E)
              </button>
              <button
                onClick={() => addComponent('tabel_pengamatan_pjok', 'mengaplikasi')}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 transition"
              >
                + Tabel Praktik PJOK (Dinamis)
              </button>
              <button
                onClick={() => addComponent('unggah_foto', 'mengaplikasi')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Bukti Unggah Foto/Video
              </button>
              <button
                onClick={() => addComponent('uraian', 'mengaplikasi')}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition"
              >
                + Analisis Gerak (Uraian)
              </button>
              <button
                onClick={() => addComponent('refleksi_pembelajaran', 'merefleksi')}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-300 transition"
              >
                + Refleksi Joyful Learning
              </button>
            </div>
          </div>

          {/* List of existing components */}
          <div className="space-y-4">
            {formData.components.map((comp, index) => {
              const isFirst = index === 0;
              const isLast = index === formData.components.length - 1;

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 transition hover:border-slate-300"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={comp.judul}
                            onChange={(e) => updateComponent(comp.id, { judul: e.target.value })}
                            className="font-bold text-sm sm:text-base text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                          />
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              comp.stage === 'memahami'
                                ? 'bg-sky-100 text-sky-800'
                                : comp.stage === 'mengaplikasi'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {comp.stage}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">Tipe: {comp.type}</span>
                      </div>
                    </div>

                    {/* Actions: Reorder & Delete */}
                    <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                      <div className="flex items-center space-x-1 mr-2 bg-slate-100 rounded-lg p-0.5">
                        <button
                          disabled={isFirst}
                          onClick={() => moveComponent(index, 'up')}
                          className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Geser Ke Atas"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          disabled={isLast}
                          onClick={() => moveComponent(index, 'down')}
                          className="p-1 rounded text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Geser Ke Bawah"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mr-3 text-xs">
                        <span className="text-slate-500">Bobot:</span>
                        <input
                          type="number"
                          value={comp.bobotNilai}
                          onChange={(e) => updateComponent(comp.id, { bobotNilai: Number(e.target.value) })}
                          className="w-14 px-2 py-1 border border-slate-300 rounded-lg text-center font-bold"
                        />
                      </div>

                      <button
                        onClick={() => removeComponent(comp.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Komponen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Instruksi Field */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Petunjuk / Instruksi Untuk Murid
                    </label>
                    <input
                      type="text"
                      value={comp.instruksi}
                      onChange={(e) => updateComponent(comp.id, { instruksi: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
                      placeholder="Petunjuk pengerjaan..."
                    />
                  </div>

                  {/* Payload Editor based on Component Type */}
                  <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100 space-y-3">
                    {comp.type === 'text_materi' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Teks Materi / Prosedur:
                        </label>
                        <textarea
                          rows={3}
                          value={comp.payload.materiText || ''}
                          onChange={(e) => updatePayload(comp.id, { materiText: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    )}

                    {comp.type === 'video_embed' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Tautan Video (YouTube URL):
                        </label>
                        <input
                          type="text"
                          value={comp.payload.mediaUrl || ''}
                          onChange={(e) => updatePayload(comp.id, { mediaUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    )}

                    {comp.type === 'pertanyaan_pemantik' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Pertanyaan Pemantik:
                        </label>
                        <textarea
                          rows={2}
                          value={comp.payload.pertanyaan || ''}
                          onChange={(e) => updatePayload(comp.id, { pertanyaan: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    )}

                    {comp.type === 'pilihan_ganda' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Soal:
                          </label>
                          <textarea
                            rows={2}
                            value={comp.payload.pertanyaan || ''}
                            onChange={(e) => updatePayload(comp.id, { pertanyaan: e.target.value })}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            Pilihan Jawaban (A-E):
                          </label>
                          {(comp.payload.options || []).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct_${comp.id}`}
                                checked={comp.payload.correctAnswer === String.fromCharCode(65 + optIdx)}
                                onChange={() =>
                                  updatePayload(comp.id, { correctAnswer: String.fromCharCode(65 + optIdx) })
                                }
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const opts = [...(comp.payload.options || [])];
                                  opts[optIdx] = e.target.value;
                                  updatePayload(comp.id, { options: opts });
                                }}
                                className="flex-1 px-3 py-1 text-xs border border-slate-300 rounded-lg bg-white"
                              />
                            </div>
                          ))}
                          <p className="text-[10px] text-slate-500">
                            * Klik radio button di sebelah kiri untuk menentukan kunci jawaban yang benar.
                          </p>
                        </div>
                      </div>
                    )}

                    {comp.type === 'tabel_pengamatan_pjok' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">
                            Konfigurasi Baris Latihan / Pos Pengamatan:
                          </span>
                          <button
                            type="button"
                            onClick={() => addExerciseRow(comp)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            + Tambah Baris Latihan
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border border-slate-200 bg-white rounded-lg overflow-hidden">
                            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                              <tr>
                                <th className="p-2 w-10 text-center">No</th>
                                <th className="p-2">Bentuk Latihan</th>
                                <th className="p-2">Unsur Kebugaran</th>
                                <th className="p-2 w-28">Satuan</th>
                                <th className="p-2">Petunjuk</th>
                                <th className="p-2 w-10">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {(comp.payload.exerciseRows || []).map((row, rIdx) => (
                                <tr key={row.id}>
                                  <td className="p-2 text-center font-bold text-slate-500">{rIdx + 1}</td>
                                  <td className="p-1">
                                    <input
                                      type="text"
                                      value={row.bentukLatihan}
                                      onChange={(e) => {
                                        const rows = [...(comp.payload.exerciseRows || [])];
                                        rows[rIdx].bentukLatihan = e.target.value;
                                        updatePayload(comp.id, { exerciseRows: rows });
                                      }}
                                      className="w-full p-1.5 border border-slate-200 rounded"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="text"
                                      value={row.unsurKebugaran}
                                      onChange={(e) => {
                                        const rows = [...(comp.payload.exerciseRows || [])];
                                        rows[rIdx].unsurKebugaran = e.target.value;
                                        updatePayload(comp.id, { exerciseRows: rows });
                                      }}
                                      className="w-full p-1.5 border border-slate-200 rounded"
                                    />
                                  </td>
                                  <td className="p-1">
                                    <select
                                      value={row.targetSatuan}
                                      onChange={(e) => {
                                        const rows = [...(comp.payload.exerciseRows || [])];
                                        rows[rIdx].targetSatuan = e.target.value;
                                        updatePayload(comp.id, { exerciseRows: rows });
                                      }}
                                      className="w-full p-1.5 border border-slate-200 rounded"
                                    >
                                      <option value="Repetisi">Repetisi</option>
                                      <option value="Detik">Detik</option>
                                      <option value="Menit">Menit</option>
                                      <option value="Meter">Meter</option>
                                      <option value="Centimeter">Centimeter</option>
                                    </select>
                                  </td>
                                  <td className="p-1">
                                    <input
                                      type="text"
                                      value={row.petunjuk || ''}
                                      onChange={(e) => {
                                        const rows = [...(comp.payload.exerciseRows || [])];
                                        rows[rIdx].petunjuk = e.target.value;
                                        updatePayload(comp.id, { exerciseRows: rows });
                                      }}
                                      className="w-full p-1.5 border border-slate-200 rounded"
                                    />
                                  </td>
                                  <td className="p-1 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removeExerciseRow(comp, row.id)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {comp.type === 'uraian' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kasus / Pertanyaan Uraian Analisis:
                        </label>
                        <textarea
                          rows={3}
                          value={comp.payload.pertanyaan || ''}
                          onChange={(e) => updatePayload(comp.id, { pertanyaan: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    )}

                    {comp.type === 'refleksi_pembelajaran' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700">
                          Pertanyaan Refleksi (Pisahkan per baris):
                        </label>
                        <textarea
                          rows={4}
                          value={(comp.payload.reflectionPrompts || []).join('\n')}
                          onChange={(e) =>
                            updatePayload(comp.id, {
                              reflectionPrompts: e.target.value.split('\n').filter((x) => x.trim().length > 0),
                            })
                          }
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 flex justify-between items-center shadow-xs">
            <button
              onClick={() => setActiveStep('perencanaan')}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              &larr; Kembali ke Perencanaan
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Pratinjau LKM
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-md transition"
              >
                Simpan & Terbitkan LKM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Pratinjau Tampilan LKM Murid</h3>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                Tutup
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {settings.namaSekolah} • PJOK Fase {formData.fase}
                </span>
                <h1 className="text-xl font-black text-slate-900">{formData.judul}</h1>
                <p className="text-xs text-slate-500">
                  Materi: {formData.materiPokok} | Alokasi Waktu: {formData.alokasiWaktu} | Guru: {formData.guruPembuat}
                </p>
              </div>

              {formData.components.map((c, i) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{c.judul}</h4>
                  </div>
                  <p className="text-xs text-slate-500 italic">{c.instruksi}</p>

                  <div className="pt-2 text-xs text-slate-700">
                    {c.payload.materiText && <p className="whitespace-pre-line">{c.payload.materiText}</p>}
                    {c.payload.pertanyaan && <p className="font-semibold">{c.payload.pertanyaan}</p>}
                    {c.type === 'tabel_pengamatan_pjok' && (
                      <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs text-center border border-dashed border-slate-300">
                        [Tabel Praktik PJOK Interaktif: {c.payload.exerciseRows?.length || 0} Bentuk Latihan]
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Selesai Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
