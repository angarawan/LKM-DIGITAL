import {
  User,
  SchoolClass,
  LkmData,
  LkmComponent,
  Assignment,
  StudyGroup,
  Submission,
  Assessment,
  ActivityLog,
  SchoolSettings,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'lkm_pjok_users_v2',
  CLASSES: 'lkm_pjok_classes_v2',
  LKMS: 'lkm_pjok_lkms_v2',
  ASSIGNMENTS: 'lkm_pjok_assignments_v2',
  GROUPS: 'lkm_pjok_groups_v2',
  SUBMISSIONS: 'lkm_pjok_submissions_v2',
  ASSESSMENTS: 'lkm_pjok_assessments_v2',
  LOGS: 'lkm_pjok_logs_v2',
  SETTINGS: 'lkm_pjok_settings_v2',
  CURRENT_USER: 'lkm_pjok_current_user_v2',
};

// Initial Settings
const defaultSettings: SchoolSettings = {
  namaSekolah: 'SMA NEGERI 1 TEJAKULA',
  npsn: '50100412',
  alamatSekolah: 'Jl. Singaraja - Amlapura, Tejakula, Buleleng, Bali 81173',
  kabupaten: 'Kabupaten Buleleng',
  provinsi: 'Provinsi Bali',
  kepalaSekolah: 'I Made Astawa, S.Pd., M.Pd.',
  nipKepalaSekolah: '19690812 199412 1 003',
  guruPjokUtama: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
  nipGuruPjokUtama: '19880415 201101 1 008',
  tahunAjaranAktif: '2024/2025',
  semesterAktif: 'Ganjil',
  slogan: 'Belajar, Bergerak, Berkolaborasi, dan Merefleksi.',
  googleSpreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  gasWebhookUrl: '',
};

// Initial Users
const defaultUsers: User[] = [
  {
    id: 'user_admin_01',
    name: 'Administrator SMAN 1 Tejakula',
    username: 'admin',
    email: 'admin@sman1tejakula.sch.id',
    role: 'admin',
    nipNis: '19750311 200212 1 004',
    isActive: true,
    createdAt: '2024-07-01T08:00:00Z',
  },
  {
    id: 'user_guru_01',
    name: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    username: 'agus.nova',
    email: 'agus.nova@sman1tejakula.sch.id',
    role: 'guru',
    nipNis: '19880415 201101 1 008',
    gender: 'L',
    isActive: true,
    createdAt: '2024-07-01T08:00:00Z',
  },
  {
    id: 'user_murid_01',
    name: 'I Made Putra Aditya',
    username: 'putra.aditya',
    email: 'putra.aditya@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22101',
    nisn: '0061234561',
    gender: 'L',
    classId: 'class_xi_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_02',
    name: 'Ni Luh Gede Ayu Lestari',
    username: 'ayu.lestari',
    email: 'ayu.lestari@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22102',
    nisn: '0061234562',
    gender: 'P',
    classId: 'class_xi_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_03',
    name: 'I Kadek Suardana',
    username: 'kadek.suardana',
    email: 'kadek.suardana@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22103',
    nisn: '0061234563',
    gender: 'L',
    classId: 'class_xi_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_04',
    name: 'Ni Komang Dewi Anjani',
    username: 'dewi.anjani',
    email: 'dewi.anjani@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22104',
    nisn: '0061234564',
    gender: 'P',
    classId: 'class_xi_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_05',
    name: 'I Ketut Darmawan',
    username: 'ketut.darmawan',
    email: 'ketut.darmawan@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22201',
    nisn: '0061234571',
    gender: 'L',
    classId: 'class_xi_2',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_06',
    name: 'Ni Putu Sri Wahyuni',
    username: 'sri.wahyuni',
    email: 'sri.wahyuni@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '22202',
    nisn: '0061234572',
    gender: 'P',
    classId: 'class_xi_2',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_07',
    name: 'Gede Budi Artawan',
    username: 'budi.artawan',
    email: 'budi.artawan@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '23011',
    nisn: '0071234581',
    gender: 'L',
    classId: 'class_x_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
  {
    id: 'user_murid_08',
    name: 'Kadek Dwi Mahendra',
    username: 'dwi.mahendra',
    email: 'dwi.mahendra@siswa.sman1tejakula.sch.id',
    role: 'murid',
    nipNis: '21005',
    nisn: '0051234591',
    gender: 'L',
    classId: 'class_xii_1',
    isActive: true,
    createdAt: '2024-07-15T08:00:00Z',
  },
];

// Initial Classes
const defaultClasses: SchoolClass[] = [
  {
    id: 'class_x_1',
    name: 'Kelas X-1',
    grade: 'X',
    fase: 'E',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 34,
  },
  {
    id: 'class_x_2',
    name: 'Kelas X-2',
    grade: 'X',
    fase: 'E',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 34,
  },
  {
    id: 'class_xi_1',
    name: 'Kelas XI-1',
    grade: 'XI',
    fase: 'F',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 36,
  },
  {
    id: 'class_xi_2',
    name: 'Kelas XI-2',
    grade: 'XI',
    fase: 'F',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 35,
  },
  {
    id: 'class_xii_1',
    name: 'Kelas XII-1',
    grade: 'XII',
    fase: 'F',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 36,
  },
  {
    id: 'class_xii_2',
    name: 'Kelas XII-2',
    grade: 'XII',
    fase: 'F',
    academicYear: '2024/2025',
    teacherName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalStudents: 36,
  },
];

// Default LKM 1: Kebugaran Jasmani - Circuit Training
const defaultLkm1: LkmData = {
  id: 'lkm_kebugaran_xi_01',
  judul: 'LKM 01: Kebugaran Jasmani - Circuit Training untuk Meningkatkan Daya Tahan & Kelincahan',
  mataPelajaran: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
  fase: 'F',
  kelas: 'XI',
  semester: 'Ganjil',
  tahunAjaran: '2024/2025',
  guruPembuat: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
  guruNip: '19880415 201101 1 008',
  materiPokok: 'Aktivitas Kebugaran Jasmani Terkait Kesehatan & Keterampilan',
  topik: 'Circuit Training (Latihan Sirkuit 5 Pos)',
  pertemuanKe: 3,
  alokasiWaktu: '3 x 45 Menit',
  capaianPembelajaran:
    'Pada akhir Fase F, peserta didik dapat merancang, mempraktikkan, dan mengevaluasi program latihan kebugaran jasmani yang terkait dengan kesehatan dan keterampilan gerak secara mandiri serta berkolaborasi untuk meningkatkan derajat kebugaran tubuh.',
  tujuanPembelajaran: [
    'Peserta didik mampu menganalisis konsep latihan sirkuit (circuit training) dalam meningkatkan daya tahan kardiorespirasi, kekuatan otot, dan kelincahan.',
    'Peserta didik mampu mempraktikkan 5 pos latihan sirkuit dengan teknik gerak yang aman, tepat, dan berkesadaran (mindful).',
    'Peserta didik mampu mencatat dan menganalisis data hasil pengukuran performa fisik secara objektif.',
    'Peserta didik mampu merefleksikan proses latihan dengan mengidentifikasi tantangan gerak serta menyusun rencana perbaikan kebugaran.',
  ],
  kktp: [
    'Mampu menjelaskan prinsip kerja circuit training dengan benar (Memahami).',
    'Mampu melaksanakan 5 pos latihan secara runtut dan tuntas sesuai waktu/repetisi (Mengaplikasi).',
    'Mampu mengisi tabel data pengamatan gerak secara mandiri dan akurat (Mengaplikasi).',
    'Mampu melakukan evaluasi diri dan refleksi bermakna mengenai kebiasaan hidup sehat (Merefleksi).',
  ],
  dimensiProfilLulusan: [
    'Mandiri (Regulasi diri dalam beraktivitas fisik)',
    'Gotong Royong (Kolaborasi dan keselamatan tim saat latihan)',
    'Bernalar Kritis (Analisis data latihan dan identifikasi kesalahan gerak)',
    'Beriman & Berakhlak Mulia (Menjaga anugerah kesehatan tubuh)',
  ],
  modelPembelajaran: 'Pembelajaran Kolaboratif (Collaborative Learning)',
  pendekatanPembelajaran: 'Deep Learning (Mindful, Meaningful, Joyful Learning)',
  saranaPrasarana: 'Lapangan olahraga SMAN 1 Tejakula, Stopwatch, Cone/Kerucut, Matras, Peluit, Lembar Kerja Digital.',
  status: 'published',
  createdAt: '2024-08-01T07:30:00Z',
  updatedAt: '2024-08-10T09:15:00Z',
  components: [
    {
      id: 'comp_01_orientasi',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 1,
      type: 'text_materi',
      stage: 'memahami',
      judul: 'Petunjuk Keselamatan & Orientasi Latihan Fisik (Mindful Learning)',
      instruksi: 'Bacalah petunjuk keselamatan ini dengan saksama sebelum memulai aktivitas gerak.',
      isRequired: true,
      bobotNilai: 5,
      payload: {
        materiText:
          'Selamat datang dalam pembelajaran PJOK Kebugaran Jasmani!\n\nSebelum beraktivitas di lapangan, perhatikan prinsip **Mindful Movement (Gerak Berkesadaran)**:\n1. Pastikan Anda telah melakukan pemanasan (stretching dinamis) minimal 7-10 menit.\n2. Cek kesiapan fisik: jika mengalami pusing atau cidera, segera lapor ke Guru PJOK.\n3. Siapkan air minum untuk hidrasi yang cukup.\n4. Utamakan teknik gerak yang benar sebelum mengejar kecepatan atau repetisi terbanyak.\n5. Jaga jarak aman dengan teman dan saling mengawasi keselamatan gerak.',
      },
    },
    {
      id: 'comp_02_video',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 2,
      type: 'video_embed',
      stage: 'memahami',
      judul: 'Stimulus Pengamatan: Konsep Latihan Sirkuit (Circuit Training)',
      instruksi: 'Amati video konsep latihan sirkuit berikut ini, perhatikan jeda istirahat antar pos serta bentuk gerak pada setiap stasiun.',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        mediaUrl: 'https://www.youtube.com/watch?v=kYkyXbH_xG8',
        pertanyaan: 'Perhatikan variasi latihan pada setiap pos, waktu aktif gerak (30-45 detik), dan waktu istirahat (15-30 detik).',
      },
    },
    {
      id: 'comp_03_pemantik',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 3,
      type: 'pertanyaan_pemantik',
      stage: 'memahami',
      judul: 'Pertanyaan Pemantik: Makna Kebugaran Jasmani (Meaningful Learning)',
      instruksi: 'Tuliskan tanggapan Anda berdasarkan pemahaman dan pengalaman sehari-hari.',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        pertanyaan:
          'Mengapa seorang pelajar SMA di pesisir Tejakula memerlukan daya tahan kardiorespirasi dan kekuatan otot yang optimal dalam menunjang aktivitas belajar sehari-hari?',
      },
    },
    {
      id: 'comp_04_pg',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 4,
      type: 'pilihan_ganda',
      stage: 'memahami',
      judul: 'Uji Konsep: Prinsip Latihan Kebugaran Jasmani',
      instruksi: 'Pilihlah salah satu jawaban yang paling tepat (A, B, C, D, atau E).',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        pertanyaan:
          'Komponen kebugaran jasmani yang paling dominan dilatih saat melakukan gerakan "Shuttle Run" (lari bolak-balik 5 meter) adalah...',
        options: [
          'A. Daya tahan jantung dan paru-paru (Cardiorespiratory endurance)',
          'B. Kelincahan (Agility) dan koordinasi gerak',
          'C. Kekuatan maksimal otot bisep (Muscular strength)',
          'D. Kelenturan sendi pergelangan kaki (Flexibility)',
          'E. Keseimbangan statis tubuh (Static balance)',
        ],
        correctAnswer: 'B',
      },
    },
    {
      id: 'comp_05_tabel_praktik',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 5,
      type: 'tabel_pengamatan_pjok',
      stage: 'mengaplikasi',
      judul: 'Lembar Pengamatan Praktik Circuit Training 5 Pos',
      instruksi:
        'Lakukan rangkaian latihan 5 pos di lapangan secara berurutan bersama kelompok/rekan Anda. Catat hasil pengamatan berupa jumlah repetisi atau waktu tempuh sesuai instruksi.',
      isRequired: true,
      bobotNilai: 35,
      payload: {
        exerciseRows: [
          {
            id: 'row_01',
            no: 1,
            bentukLatihan: 'Sit Up (30 detik)',
            unsurKebugaran: 'Kekuatan dan daya tahan otot perut',
            targetSatuan: 'Repetisi',
            petunjuk: 'Kaki ditekuk 90 derajat, tangan menyilang di dada.',
          },
          {
            id: 'row_02',
            no: 2,
            bentukLatihan: 'Back Up (30 detik)',
            unsurKebugaran: 'Kekuatan dan daya tahan otot punggung/pinggang',
            targetSatuan: 'Repetisi',
            petunjuk: 'Posisi telungkup, angkat dada dan paha secara terkontrol.',
          },
          {
            id: 'row_03',
            no: 3,
            bentukLatihan: 'Shuttle Run 4 x 5 meter',
            unsurKebugaran: 'Kelincahan dan kecepatan reaksi',
            targetSatuan: 'Detik',
            petunjuk: 'Sentuh garis di setiap ujung putaran.',
          },
          {
            id: 'row_04',
            no: 4,
            bentukLatihan: 'Jumping Jack (30 detik)',
            unsurKebugaran: 'Daya tahan aerobik dan koordinasi motorik',
            targetSatuan: 'Repetisi',
            petunjuk: 'Buka tutup kaki dan lengan secara ritmis.',
          },
          {
            id: 'row_05',
            no: 5,
            bentukLatihan: 'Sprint 30 Meter',
            unsurKebugaran: 'Kecepatan gerak (Speed)',
            targetSatuan: 'Detik',
            petunjuk: 'Start berdiri, lari secepat mungkin hingga garis finish.',
          },
        ],
      },
    },
    {
      id: 'comp_06_unggah_foto',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 6,
      type: 'unggah_foto',
      stage: 'mengaplikasi',
      judul: 'Dokumentasi Praktik Gerak di Lapangan',
      instruksi:
        'Unggah foto kegiatan saat Anda mempraktikkan salah satu pos latihan sirkuit atau foto tim di lapangan sekolah sebagai bukti otentik kegiatan.',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        materiText: 'Unggah file foto JPG/PNG (Maks. 5 MB) atau gunakan foto dokumentasi kelompok.',
      },
    },
    {
      id: 'comp_07_analisis',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 7,
      type: 'uraian',
      stage: 'mengaplikasi',
      judul: 'Analisis Hasil & Identifikasi Kesalahan Gerak',
      instruksi:
        'Berdasarkan hasil tabel pengamatan di atas, jawab pertanyaan analisis ini secara kritis dan terperinci.',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        pertanyaan:
          'Pos latihan manakah yang menurut Anda paling menantang? Identifikasi faktor penyebab kelelahan atau kesalahan teknik yang sempat terjadi, dan bagaimana strategi Anda untuk memperbaikinya?',
      },
    },
    {
      id: 'comp_08_refleksi',
      lkmId: 'lkm_kebugaran_xi_01',
      urutan: 8,
      type: 'refleksi_pembelajaran',
      stage: 'merefleksi',
      judul: 'Refleksi Pembelajaran Mendalam (Joyful & Mindful Reflection)',
      instruksi:
        'Isilah refleksi ini dengan jujur untuk mengevaluasi diri serta menumbuhkan kebiasaan bergerak sepanjang hayat.',
      isRequired: true,
      bobotNilai: 10,
      payload: {
        reflectionPrompts: [
          'Apa hal baru yang Anda pahami mengenai kesiapan fisik dan latihan sirkuit hari ini?',
          'Bagaimana suasana hati Anda saat melakukan tantangan gerak bersama teman (Joyful Learning)?',
          'Apa rencana nyata Anda untuk menjaga kebugaran jasmani di rumah atau saat akhir pekan?',
        ],
      },
    },
  ],
};

// Initial Assignment
const defaultAssignments: Assignment[] = [
  {
    id: 'asg_kebugaran_xi',
    lkmId: 'lkm_kebugaran_xi_01',
    lkmJudul: 'LKM 01: Kebugaran Jasmani - Circuit Training untuk Meningkatkan Daya Tahan & Kelincahan',
    classIds: ['class_xi_1', 'class_xi_2'],
    mode: 'individu',
    tanggalMulai: '2024-08-10T07:00:00Z',
    batasPengumpulan: '2024-08-25T23:59:00Z',
    allowRevision: true,
    maxSubmissions: 3,
    status: 'aktif',
    createdAt: '2024-08-10T07:00:00Z',
  },
];

// Initial Submissions
const defaultSubmissions: Submission[] = [
  {
    id: 'sub_putra_01',
    assignmentId: 'asg_kebugaran_xi',
    lkmId: 'lkm_kebugaran_xi_01',
    studentId: 'user_murid_01',
    studentName: 'I Made Putra Aditya',
    classId: 'class_xi_1',
    status: 'sudah_dinilai',
    startedAt: '2024-08-12T08:00:00Z',
    submittedAt: '2024-08-14T10:15:00Z',
    lastSavedAt: '2024-08-14T10:15:00Z',
    submissionCount: 1,
    answers: {
      comp_01_orientasi: {
        componentId: 'comp_01_orientasi',
        type: 'text_materi',
        answerText: 'Sudah membaca dan memahami prosedur keselamatan.',
      },
      comp_02_video: {
        componentId: 'comp_02_video',
        type: 'video_embed',
        answerText: 'Telah mengamati video demonstrasi circuit training.',
      },
      comp_03_pemantik: {
        componentId: 'comp_03_pemantik',
        type: 'pertanyaan_pemantik',
        answerText:
          'Kebugaran kardiorespirasi dan kekuatan otot sangat dibutuhkan agar kami tidak cepat lelah saat belajar di kelas dari pagi hingga sore, serta memiliki daya tahan tubuh yang baik saat berkegiatan di lingkungan pesisir Tejakula yang relatif panas.',
      },
      comp_04_pg: {
        componentId: 'comp_04_pg',
        type: 'pilihan_ganda',
        selectedOption: 'B',
      },
      comp_05_tabel_praktik: {
        componentId: 'comp_05_tabel_praktik',
        type: 'tabel_pengamatan_pjok',
        tableData: {
          row_01: { hasil: '24', catatan: 'Posisi tangan rapat di dada, gerakan ritmis.' },
          row_02: { hasil: '26', catatan: 'Dada terangkat dengan baik, pinggang tidak nyeri.' },
          row_03: { hasil: '11.4', catatan: 'Waktu tempuh 4 putaran, pergantian arah lincah.' },
          row_04: { hasil: '32', catatan: 'Kaki dan tangan selaras, nafas terkontrol.' },
          row_05: { hasil: '4.8', catatan: 'Start berdiri fokus, dorongan kaki kuat.' },
        },
      },
      comp_06_unggah_foto: {
        componentId: 'comp_06_unggah_foto',
        type: 'unggah_foto',
        mediaUploaded: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
            caption: 'Praktik Pos Shuttle Run di Lapangan SMAN 1 Tejakula',
            uploadedAt: '2024-08-14T09:40:00Z',
          },
        ],
      },
      comp_07_analisis: {
        componentId: 'comp_07_analisis',
        type: 'uraian',
        answerText:
          'Pos yang paling menantang adalah Pos 3 (Shuttle Run) karena membutuhkan pengereman mendadak dan akselerasi cepat kembali. Pada repetisi ke-3 sempat kehilangan keseimbangan akibat posisi tumpuan kaki terlalu tegak. Solusinya, saya merendahkan pusat gravitasi tubuh saat mendekati cone untuk putaran yang lebih stabil.',
      },
      comp_08_refleksi: {
        componentId: 'comp_08_refleksi',
        type: 'refleksi_pembelajaran',
        reflectionAnswers: {
          0: 'Saya memahami bahwa latihan sirkuit sangat efisien karena melatih banyak komponen kebugaran dalam waktu singkat.',
          1: 'Sangat bersemangat dan gembira karena berlatih bersama rekan, saling memberi aba-aba dan semangat saat kelelahan di pos akhir.',
          2: 'Saya berencana melakukan latihan circuit mandiri 3 kali seminggu setiap sore di rumah dengan repetisi teratur.',
        },
      },
    },
  },
  {
    id: 'sub_ayu_01',
    assignmentId: 'asg_kebugaran_xi',
    lkmId: 'lkm_kebugaran_xi_01',
    studentId: 'user_murid_02',
    studentName: 'Ni Luh Gede Ayu Lestari',
    classId: 'class_xi_1',
    status: 'sudah_dikumpulkan',
    startedAt: '2024-08-13T09:00:00Z',
    submittedAt: '2024-08-15T11:20:00Z',
    lastSavedAt: '2024-08-15T11:20:00Z',
    submissionCount: 1,
    answers: {
      comp_03_pemantik: {
        componentId: 'comp_03_pemantik',
        type: 'pertanyaan_pemantik',
        answerText:
          'Kebugaran jasmani membantu konsentrasi belajar tetap prima dan mencegah rasa kantuk di kelas siang hari.',
      },
      comp_04_pg: {
        componentId: 'comp_04_pg',
        type: 'pilihan_ganda',
        selectedOption: 'B',
      },
      comp_05_tabel_praktik: {
        componentId: 'comp_05_tabel_praktik',
        type: 'tabel_pengamatan_pjok',
        tableData: {
          row_01: { hasil: '20', catatan: 'Repetisi terkontrol.' },
          row_02: { hasil: '22', catatan: 'Gerakan baik.' },
          row_03: { hasil: '12.1', catatan: 'Kelincahan cukup baik.' },
          row_04: { hasil: '30', catatan: 'Lancar tanpa jeda.' },
          row_05: { hasil: '5.2', catatan: 'Sprint 30m.' },
        },
      },
      comp_06_unggah_foto: {
        componentId: 'comp_06_unggah_foto',
        type: 'unggah_foto',
        mediaUploaded: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
            caption: 'Foto Pos Jumping Jack bersama kelompok',
            uploadedAt: '2024-08-15T11:15:00Z',
          },
        ],
      },
      comp_07_analisis: {
        componentId: 'comp_07_analisis',
        type: 'uraian',
        answerText:
          'Latihan jumping jack dan shuttle run menguras nafas cukup cepat. Perlu pengaturan ritme pernafasan masuk lewat hidung dan keluar lewat mulut.',
      },
      comp_08_refleksi: {
        componentId: 'comp_08_refleksi',
        type: 'refleksi_pembelajaran',
        reflectionAnswers: {
          0: 'Mengetahui pentingnya istirahat teratur antar pos latihan sirkuit.',
          1: 'Merasa bugar dan fresh setelah berkeringat di lapangan.',
          2: 'Akan mengajak keluarga untuk jalan sehat atau jogging santai di pantai Tejakula.',
        },
      },
    },
  },
  {
    id: 'sub_kadek_01',
    assignmentId: 'asg_kebugaran_xi',
    lkmId: 'lkm_kebugaran_xi_01',
    studentId: 'user_murid_03',
    studentName: 'I Kadek Suardana',
    classId: 'class_xi_1',
    status: 'perlu_revisi',
    startedAt: '2024-08-12T10:00:00Z',
    submittedAt: '2024-08-14T14:00:00Z',
    lastSavedAt: '2024-08-14T14:00:00Z',
    revisionNotes:
      'Catatan Guru: Bagian Analisis Hasil masih terlalu singkat dan belum menguraikan faktor keselamatan pos Shuttle Run. Silakan lengkapi tabel pos Sprint dan perbaiki uraian analisis.',
    submissionCount: 1,
    answers: {
      comp_03_pemantik: {
        componentId: 'comp_03_pemantik',
        type: 'pertanyaan_pemantik',
        answerText: 'Supaya badan sehat dan kuat saat berolahraga.',
      },
      comp_04_pg: {
        componentId: 'comp_04_pg',
        type: 'pilihan_ganda',
        selectedOption: 'B',
      },
      comp_05_tabel_praktik: {
        componentId: 'comp_05_tabel_praktik',
        type: 'tabel_pengamatan_pjok',
        tableData: {
          row_01: { hasil: '18', catatan: '' },
          row_02: { hasil: '20', catatan: '' },
          row_03: { hasil: '13.0', catatan: '' },
          row_04: { hasil: '25', catatan: '' },
        },
      },
      comp_07_analisis: {
        componentId: 'comp_07_analisis',
        type: 'uraian',
        answerText: 'Capek di bagian lari.',
      },
      comp_08_refleksi: {
        componentId: 'comp_08_refleksi',
        type: 'refleksi_pembelajaran',
        reflectionAnswers: {
          0: 'Harus lebih banyak pemanasan.',
          1: 'Seru sekali main di lapangan.',
          2: 'Mau jogging rutin.',
        },
      },
    },
  },
  {
    id: 'sub_dewi_01',
    assignmentId: 'asg_kebugaran_xi',
    lkmId: 'lkm_kebugaran_xi_01',
    studentId: 'user_murid_04',
    studentName: 'Ni Komang Dewi Anjani',
    classId: 'class_xi_1',
    status: 'sedang_dikerjakan',
    startedAt: '2024-08-16T08:30:00Z',
    lastSavedAt: '2024-08-16T08:45:00Z',
    submissionCount: 0,
    answers: {
      comp_03_pemantik: {
        componentId: 'comp_03_pemantik',
        type: 'pertanyaan_pemantik',
        answerText: 'Kebugaran jasmani membantu saya tidak gampang lelah saat piket dan belajar.',
      },
      comp_04_pg: {
        componentId: 'comp_04_pg',
        type: 'pilihan_ganda',
        selectedOption: 'B',
      },
    },
  },
];

// Initial Assessment
const defaultAssessments: Assessment[] = [
  {
    id: 'eval_putra_01',
    submissionId: 'sub_putra_01',
    assignmentId: 'asg_kebugaran_xi',
    studentId: 'user_murid_01',
    evaluatedBy: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    totalScore: 94,
    kategoriCapaian: 'Sangat Baik',
    umpanBalikUmum:
      'Luar biasa Aditya! Analisis gerak sangat mendalam dengan refleksi yang kritis. Praktik sirkuit dan dokumentasi foto menunjukkan teknik gerak yang aman dan terstruktur. Pertahankan kedisiplinan dan semangat olahraganya!',
    statusPenilaian: 'dinilai',
    gradedAt: '2024-08-15T14:30:00Z',
    componentScores: {
      comp_01_orientasi: { score: 100, maxScore: 100, feedbackNote: 'Memahami prosedur keselamatan dengan baik.' },
      comp_02_video: { score: 100, maxScore: 100 },
      comp_03_pemantik: { score: 95, maxScore: 100, feedbackNote: 'Kaitan dengan lingkungan Tejakula sangat relevan.' },
      comp_04_pg: { score: 100, maxScore: 100, feedbackNote: 'Jawaban benar: Kelincahan (Agility).' },
      comp_05_tabel_praktik: { score: 95, maxScore: 100, feedbackNote: 'Data terisi lengkap dan objektif.' },
      comp_06_unggah_foto: { score: 90, maxScore: 100, feedbackNote: 'Dokumentasi foto valid di lapangan sekolah.' },
      comp_07_analisis: { score: 92, maxScore: 100, feedbackNote: 'Identifikasi center of gravity sangat bagus.' },
      comp_08_refleksi: { score: 90, maxScore: 100, feedbackNote: 'Refleksi positif dan aplikatif.' },
    },
  },
];

// Initial Activity Logs
const defaultLogs: ActivityLog[] = [
  {
    id: 'log_01',
    userId: 'user_guru_01',
    userName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    role: 'guru',
    action: 'MEMBUAT_LKM',
    details: 'Menerbitkan LKM 01: Kebugaran Jasmani - Circuit Training untuk Fase F Kelas XI',
    timestamp: '2024-08-10T07:30:00Z',
  },
  {
    id: 'log_02',
    userId: 'user_guru_01',
    userName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    role: 'guru',
    action: 'PENUGASAN',
    details: 'Menugaskan LKM 01 kepada Kelas XI-1 dan XI-2 dengan batas 25 Agustus 2024',
    timestamp: '2024-08-10T08:00:00Z',
  },
  {
    id: 'log_03',
    userId: 'user_murid_01',
    userName: 'I Made Putra Aditya',
    role: 'murid',
    action: 'SUBMIT_LKM',
    details: 'Mengumpulkan pengerjaan LKM 01 Kebugaran Jasmani',
    timestamp: '2024-08-14T10:15:00Z',
  },
  {
    id: 'log_04',
    userId: 'user_guru_01',
    userName: 'I Ketut Agus Nova Anggarawan, S.Pd., Gr.',
    role: 'guru',
    action: 'PENILAIAN',
    details: 'Memberikan nilai 94 (Sangat Baik) untuk I Made Putra Aditya',
    timestamp: '2024-08-15T14:30:00Z',
  },
];

// Reactive event subscribers
type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribeToStorage(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Storage Helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

// Storage Service API
export const StorageService = {
  // Current user session
  getCurrentUser(): User {
    const user = getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (user) return user;
    // Default to Guru PJOK
    const defaultGuru = defaultUsers[1];
    setStored(STORAGE_KEYS.CURRENT_USER, defaultGuru);
    return defaultGuru;
  },

  setCurrentUser(user: User): void {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
    this.addLog(user.id, user.name, user.role, 'LOGIN', `Pengguna beralih ke akun ${user.name} (${user.role.toUpperCase()})`);
  },

  // Settings
  getSettings(): SchoolSettings {
    return getStored<SchoolSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  },

  updateSettings(settings: Partial<SchoolSettings>): SchoolSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Users
  getUsers(): User[] {
    return getStored<User[]>(STORAGE_KEYS.USERS, defaultUsers);
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    setStored(STORAGE_KEYS.USERS, users);
  },

  deleteUser(id: string): void {
    const users = this.getUsers().filter((u) => u.id !== id);
    setStored(STORAGE_KEYS.USERS, users);
  },

  importUsers(newUsers: User[]): number {
    const users = this.getUsers();
    let count = 0;
    newUsers.forEach((nu) => {
      const idx = users.findIndex((u) => u.username === nu.username || (u.nipNis && u.nipNis === nu.nipNis));
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...nu };
      } else {
        users.push(nu);
        count++;
      }
    });
    setStored(STORAGE_KEYS.USERS, users);
    return count;
  },

  // Classes
  getClasses(): SchoolClass[] {
    return getStored<SchoolClass[]>(STORAGE_KEYS.CLASSES, defaultClasses);
  },

  saveClass(cls: SchoolClass): void {
    const classes = this.getClasses();
    const idx = classes.findIndex((c) => c.id === cls.id);
    if (idx >= 0) {
      classes[idx] = cls;
    } else {
      classes.push(cls);
    }
    setStored(STORAGE_KEYS.CLASSES, classes);
  },

  deleteClass(id: string): void {
    const classes = this.getClasses().filter((c) => c.id !== id);
    setStored(STORAGE_KEYS.CLASSES, classes);
  },

  // LKMs
  getLkms(): LkmData[] {
    return getStored<LkmData[]>(STORAGE_KEYS.LKMS, [defaultLkm1]);
  },

  getLkmById(id: string): LkmData | undefined {
    return this.getLkms().find((l) => l.id === id);
  },

  saveLkm(lkm: LkmData): void {
    const lkms = this.getLkms();
    const idx = lkms.findIndex((l) => l.id === lkm.id);
    if (idx >= 0) {
      lkms[idx] = { ...lkm, updatedAt: new Date().toISOString() };
    } else {
      lkms.push({ ...lkm, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    setStored(STORAGE_KEYS.LKMS, lkms);
    const currentUser = this.getCurrentUser();
    this.addLog(currentUser.id, currentUser.name, currentUser.role, 'SIMPAN_LKM', `Menyimpan LKM: ${lkm.judul}`);
  },

  duplicateLkm(id: string): LkmData | null {
    const lkm = this.getLkmById(id);
    if (!lkm) return null;
    const newLkm: LkmData = {
      ...lkm,
      id: `lkm_${Date.now()}`,
      judul: `${lkm.judul} (Salinan)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      components: lkm.components.map((c) => ({
        ...c,
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };
    this.saveLkm(newLkm);
    return newLkm;
  },

  deleteLkm(id: string): void {
    const lkms = this.getLkms().filter((l) => l.id !== id);
    setStored(STORAGE_KEYS.LKMS, lkms);
  },

  // Assignments
  getAssignments(): Assignment[] {
    return getStored<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, defaultAssignments);
  },

  getAssignmentById(id: string): Assignment | undefined {
    return this.getAssignments().find((a) => a.id === id);
  },

  saveAssignment(assignment: Assignment): void {
    const assignments = this.getAssignments();
    const idx = assignments.findIndex((a) => a.id === assignment.id);
    if (idx >= 0) {
      assignments[idx] = assignment;
    } else {
      assignments.push(assignment);
    }
    setStored(STORAGE_KEYS.ASSIGNMENTS, assignments);
    const currentUser = this.getCurrentUser();
    this.addLog(currentUser.id, currentUser.name, currentUser.role, 'PENUGASAN', `Penugasan LKM: ${assignment.lkmJudul}`);
  },

  deleteAssignment(id: string): void {
    const assignments = this.getAssignments().filter((a) => a.id !== id);
    setStored(STORAGE_KEYS.ASSIGNMENTS, assignments);
  },

  // Submissions
  getSubmissions(): Submission[] {
    return getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, defaultSubmissions);
  },

  getSubmissionById(id: string): Submission | undefined {
    return this.getSubmissions().find((s) => s.id === id);
  },

  getSubmissionByStudentAndAssignment(studentId: string, assignmentId: string): Submission | undefined {
    return this.getSubmissions().find((s) => s.studentId === studentId && s.assignmentId === assignmentId);
  },

  saveSubmission(submission: Submission): void {
    const submissions = this.getSubmissions();
    const idx = submissions.findIndex((s) => s.id === submission.id);
    if (idx >= 0) {
      submissions[idx] = { ...submission, lastSavedAt: new Date().toISOString() };
    } else {
      submissions.push({
        ...submission,
        startedAt: submission.startedAt || new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
      });
    }
    setStored(STORAGE_KEYS.SUBMISSIONS, submissions);
  },

  // Assessments
  getAssessments(): Assessment[] {
    return getStored<Assessment[]>(STORAGE_KEYS.ASSESSMENTS, defaultAssessments);
  },

  getAssessmentBySubmissionId(submissionId: string): Assessment | undefined {
    return this.getAssessments().find((a) => a.submissionId === submissionId);
  },

  saveAssessment(assessment: Assessment): void {
    const assessments = this.getAssessments();
    const idx = assessments.findIndex((a) => a.id === assessment.id);
    if (idx >= 0) {
      assessments[idx] = assessment;
    } else {
      assessments.push(assessment);
    }
    setStored(STORAGE_KEYS.ASSESSMENTS, assessments);

    // Update submission status
    const sub = this.getSubmissionById(assessment.submissionId);
    if (sub) {
      const newStatus = assessment.statusPenilaian === 'revisi' ? 'perlu_revisi' : 'sudah_dinilai';
      this.saveSubmission({
        ...sub,
        status: newStatus,
        revisionNotes: assessment.catatanRevisi || sub.revisionNotes,
      });
    }

    const currentUser = this.getCurrentUser();
    this.addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      'PENILAIAN',
      `Penilaian selesai untuk ${assessment.studentId} skor ${assessment.totalScore}`
    );
  },

  // Groups
  getGroups(): StudyGroup[] {
    return getStored<StudyGroup[]>(STORAGE_KEYS.GROUPS, []);
  },

  saveGroup(group: StudyGroup): void {
    const groups = this.getGroups();
    const idx = groups.findIndex((g) => g.id === group.id);
    if (idx >= 0) {
      groups[idx] = group;
    } else {
      groups.push(group);
    }
    setStored(STORAGE_KEYS.GROUPS, groups);
  },

  deleteGroup(id: string): void {
    const groups = this.getGroups().filter((g) => g.id !== id);
    setStored(STORAGE_KEYS.GROUPS, groups);
  },

  // Activity Logs
  getLogs(): ActivityLog[] {
    return getStored<ActivityLog[]>(STORAGE_KEYS.LOGS, defaultLogs);
  },

  addLog(userId: string, userName: string, role: any, action: string, details: string): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId,
      userName,
      role,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    setStored(STORAGE_KEYS.LOGS, logs);
  },

  // Reset to default seed
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.LKMS);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.GROUPS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    notifyListeners();
  },
};
