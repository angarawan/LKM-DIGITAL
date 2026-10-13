import React, { useState } from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { Users, Shield, GraduationCap, UserCheck, X, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectUser: (user: User) => void;
}

export const UserSwitcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  const [customUsername, setCustomUsername] = useState('');
  const [customRole, setCustomRole] = useState<'admin' | 'guru' | 'murid'>('murid');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const allUsers = StorageService.getUsers();

  const handleQuickSwitch = (user: User) => {
    StorageService.setCurrentUser(user);
    onSelectUser(user);
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      setErrorMsg('Masukkan username atau NIS/NIP');
      return;
    }
    const found = allUsers.find(
      (u) =>
        u.username.toLowerCase() === customUsername.trim().toLowerCase() ||
        (u.nipNis && u.nipNis.toLowerCase() === customUsername.trim().toLowerCase())
    );
    if (found) {
      handleQuickSwitch(found);
    } else {
      // Create virtual temporary user if needed
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: customUsername,
        username: customUsername.toLowerCase().replace(/\s+/g, '.'),
        email: `${customUsername.toLowerCase().replace(/\s+/g, '.')}@sman1tejakula.sch.id`,
        role: customRole,
        classId: customRole === 'murid' ? 'class_xi_1' : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      StorageService.saveUser(newUser);
      handleQuickSwitch(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Ganti Akun Pengguna</h3>
              <p className="text-xs text-blue-200">
                Pilih akun demo untuk menguji simulasi alur Guru, Murid, atau Admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Quick presets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Akun Guru PJOK Utama
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {allUsers
                .filter((u) => u.role === 'guru')
                .map((u) => {
                  const isCurrent = currentUser.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleQuickSwitch(u)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                        isCurrent
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            {u.name}
                            <span className="text-[11px] font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Guru PJOK
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            NIP: {u.nipNis} • Akses penuh LKM, Penugasan, Penilaian
                          </p>
                        </div>
                      </div>
                      {isCurrent ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <span className="text-xs font-semibold text-blue-600 hover:underline">
                          Pilih Akun &rarr;
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Akun Murid (Uji Coba Berbagai Status Pengerjaan)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {allUsers
                .filter((u) => u.role === 'murid')
                .slice(0, 6)
                .map((u) => {
                  const isCurrent = currentUser.id === u.id;
                  let statusBadge = 'Belum Dikerjakan';
                  let statusColor = 'bg-slate-100 text-slate-700';

                  if (u.id === 'user_murid_01') {
                    statusBadge = 'Nilai 94 (Sangat Baik)';
                    statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  } else if (u.id === 'user_murid_02') {
                    statusBadge = 'Sudah Dikumpulkan';
                    statusColor = 'bg-blue-100 text-blue-800 border-blue-300';
                  } else if (u.id === 'user_murid_03') {
                    statusBadge = 'Perlu Revisi';
                    statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
                  } else if (u.id === 'user_murid_04') {
                    statusBadge = 'Sedang Dikerjakan';
                    statusColor = 'bg-purple-100 text-purple-800 border-purple-300';
                  }

                  return (
                    <button
                      key={u.id}
                      onClick={() => handleQuickSwitch(u)}
                      className={`flex flex-col p-3 rounded-xl border text-left transition ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-slate-900 truncate">
                          {u.name}
                        </span>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="text-xs text-slate-500 mb-2">
                        NIS: {u.nipNis} • Kelas: {u.classId?.replace('class_', '').toUpperCase()}
                      </div>
                      <div className="mt-auto">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusColor}`}
                        >
                          {statusBadge}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              3. Akun Administrator Sekolah
            </h4>
            {allUsers
              .filter((u) => u.role === 'admin')
              .map((u) => {
                const isCurrent = currentUser.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickSwitch(u)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold">
                        <Shield className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          {u.name}
                          <span className="text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Manajemen Akun Guru/Murid, Impor CSV, Konfigurasi Sekolah
                        </p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <span className="text-xs font-semibold text-indigo-600 hover:underline">
                        Pilih Akun &rarr;
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* Manual Login input */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Atau Masuk dengan Nama / NIS / NIP Lain
            </h4>
            <form onSubmit={handleManualLogin} className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: putra.aditya atau 22101"
                value={customUsername}
                onChange={(e) => {
                  setCustomUsername(e.target.value);
                  setErrorMsg('');
                }}
                className="flex-1 px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as any)}
                className="px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
              >
                <option value="murid">Murid</option>
                <option value="guru">Guru</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                Masuk
              </button>
            </form>
            {errorMsg && <p className="text-xs text-rose-600 mt-1.5">{errorMsg}</p>}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
