import React, { useState } from 'react';
import { Assignment, LkmData } from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  Send,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  Plus,
  Clock,
  BookOpen,
} from 'lucide-react';

interface Props {
  preselectedLkmId?: string;
  onNavigateToMonitoring: () => void;
}

export const AssignmentManager: React.FC<Props> = ({
  preselectedLkmId,
  onNavigateToMonitoring,
}) => {
  const lkms = StorageService.getLkms();
  const classes = StorageService.getClasses();
  const assignments = StorageService.getAssignments();

  const [selectedLkmId, setSelectedLkmId] = useState<string>(
    preselectedLkmId || lkms[0]?.id || ''
  );
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>(['class_xi_1']);
  const [mode, setMode] = useState<'individu' | 'kelompok'>('individu');
  const [tanggalMulai, setTanggalMulai] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [batasPengumpulan, setBatasPengumpulan] = useState(
    new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 16)
  );
  const [allowRevision, setAllowRevision] = useState(true);
  const [maxSubmissions, setMaxSubmissions] = useState(3);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleToggleClass = (cid: string) => {
    if (selectedClassIds.includes(cid)) {
      setSelectedClassIds(selectedClassIds.filter((id) => id !== cid));
    } else {
      setSelectedClassIds([...selectedClassIds, cid]);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const lkm = lkms.find((l) => l.id === selectedLkmId);
    if (!lkm) {
      showToast('Pilih LKM terlebih dahulu!', 'error');
      return;
    }
    if (selectedClassIds.length === 0) {
      showToast('Pilih minimal satu kelas tujuan!', 'error');
      return;
    }

    const newAssignment: Assignment = {
      id: `asg_${Date.now()}`,
      lkmId: lkm.id,
      lkmJudul: lkm.judul,
      classIds: selectedClassIds,
      mode,
      tanggalMulai: new Date(tanggalMulai).toISOString(),
      batasPengumpulan: new Date(batasPengumpulan).toISOString(),
      allowRevision,
      maxSubmissions,
      status: 'aktif',
      createdAt: new Date().toISOString(),
    };

    StorageService.saveAssignment(newAssignment);
    setShowCreateModal(false);
    showToast('Penugasan berhasil diterbitkan ke kelas tujuan!', 'success');
  };

  const handleDeleteAssignment = (id: string) => {
    StorageService.deleteAssignment(id);
    showToast('Sesi penugasan berhasil dihapus.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Penugasan Terjadwal
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              {assignments.length} Sesi Penugasan Aktif
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Distribusi & Penjadwalan LKM ke Rombel Murid
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atur kelas tujuan, tanggal mulai pengerjaan, tenggat pengumpulan, dan mode individu/kelompok.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Penugasan Baru</span>
        </button>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((asg) => {
          const lkm = lkms.find((l) => l.id === asg.lkmId);
          const assignedClasses = classes.filter((c) => asg.classIds.includes(c.id));

          return (
            <div
              key={asg.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {asg.status.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Mode: {asg.mode === 'individu' ? 'Pengerjaan Individu' : 'Kelompok Kolaboratif'}
                  </span>
                  {asg.allowRevision && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                      Boleh Revisi (Maks {asg.maxSubmissions}x)
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">
                  {asg.lkmJudul}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <strong>Kelas: </strong>
                    {assignedClasses.map((c) => c.name).join(', ') || 'Semua Kelas'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <strong>Batas Pengumpulan: </strong>
                    {new Date(asg.batasPengumpulan).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start md:self-center">
                <button
                  onClick={onNavigateToMonitoring}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
                >
                  Monitor Pengerjaan &rarr;
                </button>
                <button
                  onClick={() => handleDeleteAssignment(asg.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                  title="Hapus Penugasan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Buat Penugasan LKM Baru</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pilih Lembar Kerja Murid (LKM) *
                </label>
                <select
                  value={selectedLkmId}
                  onChange={(e) => setSelectedLkmId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
                >
                  {lkms.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.judul} ({l.kelas} - {l.materiPokok})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pilih Kelas Sasaran (Bisa lebih dari satu) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {classes.map((cls) => {
                    const isSelected = selectedClassIds.includes(cls.id);
                    return (
                      <button
                        type="button"
                        key={cls.id}
                        onClick={() => handleToggleClass(cls.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cls.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Mode Pengerjaan
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="individu">Individu (Per Siswa)</option>
                    <option value="kelompok">Kelompok (Kolaboratif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Izin Revisi Pekerjaan
                  </label>
                  <select
                    value={allowRevision ? 'true' : 'false'}
                    onChange={(e) => setAllowRevision(e.target.value === 'true')}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="true">Ya, Boleh Revisi</option>
                    <option value="false">Tidak (1x Pengumpulan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Tanggal & Waktu Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Batas Waktu Pengumpulan (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={batasPengumpulan}
                    onChange={(e) => setBatasPengumpulan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Terbitkan Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
