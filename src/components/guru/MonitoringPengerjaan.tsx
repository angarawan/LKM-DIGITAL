import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { SubmissionStatus } from '../../types';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Award,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onGradeSubmission: (submissionId: string) => void;
  onViewSubmission: (submissionId: string) => void;
}

export const MonitoringPengerjaan: React.FC<Props> = ({
  onGradeSubmission,
  onViewSubmission,
}) => {
  const classes = StorageService.getClasses();
  const assignments = StorageService.getAssignments();
  const submissions = StorageService.getSubmissions();
  const assessments = StorageService.getAssessments();
  const users = StorageService.getUsers().filter((u) => u.role === 'murid');

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map each student to their submission for current assignment
  const currentAssignment = assignments[0];

  const studentRows = users.map((student) => {
    const sub = submissions.find(
      (s) => s.studentId === student.id && (!currentAssignment || s.assignmentId === currentAssignment.id)
    );
    const assessment = sub ? assessments.find((a) => a.submissionId === sub.id) : undefined;
    const cls = classes.find((c) => c.id === student.classId);

    let status: SubmissionStatus = 'belum_dikerjakan';
    if (sub) {
      status = sub.status;
    }

    return {
      student,
      cls,
      submission: sub,
      assessment,
      status,
    };
  });

  const filteredRows = studentRows.filter((row) => {
    if (selectedClassId !== 'all' && row.student.classId !== selectedClassId) return false;
    if (statusFilter !== 'all' && row.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = row.student.name.toLowerCase().includes(q);
      const matchNis = (row.student.nipNis || '').toLowerCase().includes(q);
      if (!matchName && !matchNis) return false;
    }
    return true;
  });

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'sudah_dinilai':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Sudah Dinilai
          </span>
        );
      case 'sudah_dikumpulkan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Clock className="w-3 h-3 text-blue-600" /> Perlu Dinilai
          </span>
        );
      case 'perlu_revisi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Perlu Revisi
          </span>
        );
      case 'sedang_dikerjakan':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Clock className="w-3 h-3 text-purple-600" /> Sedang Dikerjakan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Belum Dikerjakan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Live Monitoring
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Pemantauan Progres Real-Time
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Monitoring Pengerjaan LKM Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status pengerjaan, jawaban tersimpan, pengumpulan tugas, dan nilai per murid.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama murid atau NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
          >
            <option value="all">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
          >
            <option value="all">Semua Status</option>
            <option value="sudah_dikumpulkan">Perlu Dinilai</option>
            <option value="sudah_dinilai">Sudah Dinilai</option>
            <option value="perlu_revisi">Perlu Revisi</option>
            <option value="sedang_dikerjakan">Sedang Dikerjakan</option>
            <option value="belum_dikerjakan">Belum Dikerjakan</option>
          </select>
        </div>

        <div className="text-xs font-semibold text-slate-500 self-end md:self-auto">
          Menampilkan <strong className="text-slate-900">{filteredRows.length}</strong> murid
        </div>
      </div>

      {/* Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5 w-12 text-center">No</th>
                <th className="p-3.5">Nama Murid</th>
                <th className="p-3.5">NIS / NISN</th>
                <th className="p-3.5">Kelas</th>
                <th className="p-3.5">Status Pengerjaan</th>
                <th className="p-3.5">Waktu Update</th>
                <th className="p-3.5 text-center">Nilai</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, idx) => (
                <tr key={row.student.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900">{row.student.name}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{row.student.nipNis || '-'}</td>
                  <td className="p-3.5 font-semibold text-slate-700">{row.cls?.name || 'XI-1'}</td>
                  <td className="p-3.5">{getStatusBadge(row.status)}</td>
                  <td className="p-3.5 text-slate-500">
                    {row.submission?.lastSavedAt
                      ? new Date(row.submission.lastSavedAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-'}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.assessment ? (
                      <span className="font-extrabold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {row.assessment.totalScore}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.submission ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onGradeSubmission(row.submission!.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            row.status === 'sudah_dikumpulkan'
                              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {row.status === 'sudah_dikumpulkan' ? 'Nilai Sekarang' : 'Tinjau / Edit'}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Belum ada data</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
