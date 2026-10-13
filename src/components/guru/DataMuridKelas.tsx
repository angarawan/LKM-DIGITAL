import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { GraduationCap, Users, Search, Plus, Trash2 } from 'lucide-react';
import { SchoolClass, User } from '../../types';

export const DataMuridKelas: React.FC = () => {
  const classes = StorageService.getClasses();
  const users = StorageService.getUsers().filter((u) => u.role === 'murid');

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'class_xi_1');
  const [searchQuery, setSearchQuery] = useState('');

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const classStudents = users.filter((u) => u.classId === selectedClassId);

  const filteredStudents = classStudents.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.nipNis || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Rombongan Belajar
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              SMAN 1 Tejakula
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Data Murid & Kelas Binaan PJOK
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar rombel Fase E (Kelas X) dan Fase F (Kelas XI, XII).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Classes List */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 px-1">
            Daftar Kelas:
          </h3>
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            const count = users.filter((u) => u.classId === cls.id).length;

            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm">{cls.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    Fase {cls.fase} • TA {cls.academicYear}
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {count} Murid
                </span>
              </button>
            );
          })}
        </div>

        {/* Student Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                {currentClass?.name} ({currentClass?.academicYear})
              </h3>
              <p className="text-[11px] text-slate-500">
                Guru Pengampu: {currentClass?.teacherName}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari murid di kelas ini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">NIS</th>
                    <th className="p-3">Nama Lengkap Murid</th>
                    <th className="p-3 text-center">L/P</th>
                    <th className="p-3">Email Sekolah</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s, i) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                      <td className="p-3 font-mono font-bold text-slate-700">{s.nipNis || '-'}</td>
                      <td className="p-3 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3 text-center font-bold text-slate-600">
                        {s.gender || 'L'}
                      </td>
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{s.email}</td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Aktif
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
