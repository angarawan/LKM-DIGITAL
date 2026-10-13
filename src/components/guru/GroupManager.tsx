import React, { useState } from 'react';
import { StudyGroup, User } from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import { Users, UserPlus, Trash2, Award, CheckCircle2, Shield } from 'lucide-react';

export const GroupManager: React.FC = () => {
  const classes = StorageService.getClasses();
  const assignments = StorageService.getAssignments();
  const users = StorageService.getUsers().filter((u) => u.role === 'murid');
  const groups = StorageService.getGroups();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class_xi_1');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<string>('');

  const classStudents = users.filter((u) => u.classId === selectedClassId);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      showToast('Nama kelompok wajib diisi!', 'error');
      return;
    }
    if (selectedMembers.length === 0) {
      showToast('Pilih minimal satu anggota kelompok!', 'error');
      return;
    }

    const newGroup: StudyGroup = {
      id: `group_${Date.now()}`,
      assignmentId: assignments[0]?.id || 'asg_default',
      classId: selectedClassId,
      namaKelompok: newGroupName,
      ketuaId: selectedLeader || selectedMembers[0],
      anggotaIds: selectedMembers,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveGroup(newGroup);
    setNewGroupName('');
    setSelectedMembers([]);
    setSelectedLeader('');
    showToast('Kelompok belajar berhasil dibuat!', 'success');
  };

  const handleAutoGenerate = () => {
    if (classStudents.length === 0) {
      showToast('Tidak ada murid pada kelas ini!', 'error');
      return;
    }

    const groupSize = 4;
    const shuffled = [...classStudents].sort(() => 0.5 - Math.random());
    let groupIndex = 1;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const chunk = shuffled.slice(i, i + groupSize);
      const group: StudyGroup = {
        id: `group_${Date.now()}_${groupIndex}`,
        assignmentId: assignments[0]?.id || 'asg_default',
        classId: selectedClassId,
        namaKelompok: `Regu ${groupIndex} PJOK (${selectedClassId.replace('class_', '').toUpperCase()})`,
        ketuaId: chunk[0].id,
        anggotaIds: chunk.map((c) => c.id),
        createdAt: new Date().toISOString(),
      };
      StorageService.saveGroup(group);
      groupIndex++;
    }

    showToast('Kelompok belajar otomatis berhasil dibentuk!', 'success');
  };

  const handleDeleteGroup = (id: string) => {
    StorageService.deleteGroup(id);
    showToast('Kelompok belajar dihapus.', 'info');
  };

  const filteredGroups = groups.filter((g) => g.classId === selectedClassId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Kelompok Belajar PJOK
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Pembelajaran Kolaboratif Lapangan
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Manajemen Regu & Tim Praktik Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bentuk regu latihan circuit training, tentukan ketua kelompok, dan pantau kolaborasi gerak.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAutoGenerate}
            className="px-3.5 py-2 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl transition"
          >
            Bagi Otomatis (4 Siswa/Regu)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Manual Group Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Bentuk Kelompok Manual</span>
          </h3>

          <form onSubmit={handleCreateGroup} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Nama Regu / Kelompok *
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Contoh: Regu Elang Circuit"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                Pilih Anggota ({classStudents.length} Siswa Terdaftar)
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {classStudents.map((s) => {
                  const isChecked = selectedMembers.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer p-1 rounded hover:bg-white"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, s.id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter((id) => id !== s.id));
                          }
                        }}
                      />
                      <span>{s.name} ({s.nipNis})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {selectedMembers.length > 0 && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Pilih Ketua Regu
                </label>
                <select
                  value={selectedLeader}
                  onChange={(e) => setSelectedLeader(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="">Pilih Ketua Kelompok</option>
                  {selectedMembers.map((id) => {
                    const student = users.find((u) => u.id === id);
                    return (
                      <option key={id} value={id}>
                        {student?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Simpan Kelompok
            </button>
          </form>
        </div>

        {/* Existing Groups List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Daftar Regu Kelas ({filteredGroups.length} Kelompok)</span>
              <span className="text-xs text-slate-500 font-normal">
                Setiap regu memiliki lembar kolaborasi terpusat
              </span>
            </h3>

            {filteredGroups.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">
                  Belum ada kelompok belajar di kelas ini.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Klik "Bagi Otomatis" atau gunakan form di sebelah kiri.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {filteredGroups.map((g) => {
                  const leader = users.find((u) => u.id === g.ketuaId);
                  return (
                    <div
                      key={g.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{g.namaKelompok}</h4>
                          <button
                            onClick={() => handleDeleteGroup(g.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-blue-700 font-semibold mt-1 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Ketua: {leader?.name || 'Belum dipilih'}
                        </p>

                        <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
                            Anggota ({g.anggotaIds.length}):
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {g.anggotaIds.map((mId) => {
                              const mem = users.find((u) => u.id === mId);
                              return <li key={mId}>{mem?.name || mId}</li>;
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
