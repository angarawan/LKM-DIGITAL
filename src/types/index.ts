export type UserRole = 'admin' | 'guru' | 'murid';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  nipNis?: string; // NIP for teacher, NIS for student
  nisn?: string;
  gender?: 'L' | 'P';
  classId?: string; // e.g. 'XI-1'
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Kelas XI-1"
  grade: 'X' | 'XI' | 'XII';
  fase: 'E' | 'F';
  academicYear: string; // e.g. "2024/2025"
  teacherName: string;
  totalStudents: number;
}

export type ComponentType =
  | 'text_materi'
  | 'gambar'
  | 'video_embed'
  | 'pertanyaan_pemantik'
  | 'pilihan_ganda'
  | 'pilihan_ganda_kompleks'
  | 'benar_salah'
  | 'jawaban_singkat'
  | 'uraian'
  | 'tabel_pengamatan_pjok'
  | 'input_angka'
  | 'input_waktu'
  | 'input_jarak'
  | 'unggah_foto'
  | 'unggah_video'
  | 'checklist_aktivitas'
  | 'evaluasi_diri'
  | 'refleksi_pembelajaran';

export type DeepLearningStage = 'memahami' | 'mengaplikasi' | 'merefleksi';

export interface PjokExerciseRow {
  id: string;
  no: number;
  bentukLatihan: string;
  unsurKebugaran: string;
  targetSatuan: string; // 'Repetisi' | 'Detik' | 'Meter' | 'Menit'
  petunjuk?: string;
}

export interface LkmComponent {
  id: string;
  lkmId: string;
  urutan: number;
  type: ComponentType;
  stage: DeepLearningStage; // Memahami (Mindful), Mengaplikasi (Meaningful), Merefleksi (Joyful)
  judul: string;
  instruksi: string;
  isRequired: boolean;
  bobotNilai: number;
  // Dynamic payload based on type
  payload: {
    materiText?: string;
    mediaUrl?: string; // image or youtube video
    pertanyaan?: string;
    options?: string[]; // For PG A-E
    correctAnswer?: string; // For PG: 'A', 'B', etc.
    correctOptions?: string[]; // For PG Kompleks
    statementTrueFalse?: boolean; // For Benar/Salah
    rubrikSkor?: { [skor: number]: string }; // Rubrik 1-4
    exerciseRows?: PjokExerciseRow[]; // For table pjok
    checklistItems?: string[];
    reflectionPrompts?: string[];
  };
}

export interface LkmData {
  id: string;
  judul: string;
  mataPelajaran: string;
  fase: 'E' | 'F';
  kelas: string; // "XI"
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string;
  guruPembuat: string;
  guruNip?: string;
  materiPokok: string;
  topik: string;
  pertemuanKe: number;
  alokasiWaktu: string; // "2 x 45 Menit"
  
  // Perencanaan Kurikulum Merdeka
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  kktp: string[];
  dimensiProfilLulusan: string[]; // 8 Dimensi Profil Pelajar/Lulusan
  modelPembelajaran: string;
  pendekatanPembelajaran: string; // e.g. "Deep Learning (Mindful, Meaningful, Joyful)"
  saranaPrasarana: string;
  
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  components: LkmComponent[];
}

export interface Assignment {
  id: string;
  lkmId: string;
  lkmJudul: string;
  classIds: string[];
  targetStudentIds?: string[]; // if empty, all students in class
  mode: 'individu' | 'kelompok';
  tanggalMulai: string;
  batasPengumpulan: string;
  allowRevision: boolean;
  maxSubmissions: number;
  status: 'aktif' | 'selesai' | 'ditutup';
  createdAt: string;
}

export interface StudyGroup {
  id: string;
  assignmentId: string;
  classId: string;
  namaKelompok: string;
  ketuaId: string;
  anggotaIds: string[];
  createdAt: string;
}

export interface StudentAnswer {
  componentId: string;
  type: ComponentType;
  answerText?: string;
  selectedOption?: string;
  selectedOptions?: string[];
  boolAnswer?: boolean;
  tableData?: { [rowId: string]: { hasil: string; catatan?: string } };
  mediaUploaded?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
    uploadedAt: string;
  }[];
  checklistAnswers?: { [index: number]: boolean };
  reflectionAnswers?: { [index: number]: string };
}

export type SubmissionStatus =
  | 'belum_dikerjakan'
  | 'sedang_dikerjakan'
  | 'sudah_dikumpulkan'
  | 'perlu_revisi'
  | 'sudah_dinilai';

export interface Submission {
  id: string;
  assignmentId: string;
  lkmId: string;
  studentId: string; // For group mode, this is leader/group key
  groupId?: string;
  studentName: string;
  classId: string;
  answers: { [componentId: string]: StudentAnswer };
  status: SubmissionStatus;
  startedAt?: string;
  submittedAt?: string;
  lastSavedAt: string;
  revisionNotes?: string;
  submissionCount: number;
}

export interface Assessment {
  id: string;
  submissionId: string;
  assignmentId: string;
  studentId: string;
  evaluatedBy: string;
  componentScores: {
    [componentId: string]: {
      score: number; // 0-100 or rubric 1-4
      maxScore: number;
      feedbackNote?: string;
    };
  };
  totalScore: number; // Final score 0-100
  kategoriCapaian: 'Perlu Bimbingan' | 'Cukup' | 'Baik' | 'Sangat Baik';
  umpanBalikUmum: string;
  catatanRevisi?: string;
  statusPenilaian: 'dinilai' | 'revisi';
  gradedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface SchoolSettings {
  namaSekolah: string;
  npsn: string;
  alamatSekolah: string;
  kabupaten: string;
  provinsi: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  guruPjokUtama: string;
  nipGuruPjokUtama: string;
  tahunAjaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
  slogan: string;
  googleSpreadsheetId?: string;
  gasWebhookUrl?: string;
}
