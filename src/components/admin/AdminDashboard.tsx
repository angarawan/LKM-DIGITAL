import React, { useState } from 'react';
import { User, SchoolClass, SchoolSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  Users,
  UploadCloud,
  GraduationCap,
  Settings,
  Clock,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const users = StorageService.getUsers();
  const classes = StorageService.getClasses();
  const logs = StorageService.getLogs();
  const settings = StorageService.getSettings();

  const [activeTab, setActiveTab] = useState<'users' | 'import' | 'classes' | 'settings' | 'logs'>('users');
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'guru' | 'murid' | 'admin'>('all');

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'guru' | 'murid'>('murid');
  const [newUserNis, setNewUserNis] = useState('');
  const [newUserClass, setNewUserClass] = useState('class_xi_1');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(settings);

  // CSV Import State
  const [csvContent, setCsvContent] = useState('');
  const [importResult, setImportResult] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchUser.trim()) {
      const q = searchUser.toLowerCase();
      return u.name.toLowerCase().includes(q) || (u.nipNis || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: newUserName,
      username: newUserName.toLowerCase().replace(/\s+/g, '.'),
      email: `${newUserName.toLowerCase().replace(/\s+/g, '.')}@sman1tejakula.sch.id`,
      role: newUserRole,
      nipNis: newUserNis,
      classId: newUserRole === 'murid' ? newUserClass : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveUser(newUser);
    setNewUserName('');
    setNewUserNis('');
    showToast(`Pengguna ${newUserName} berhasil didaftarkan!`, 'success');
  };

  const handleDeleteUser = (id: string, name: string) => {
    StorageService.deleteUser(id);
    showToast(`Akun pengguna ${name} berhasil dihapus.`, 'info');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(settingsForm);
    showToast('Pengaturan identitas sekolah berhasil diperbarui!', 'success');
  };

  // CSV importer
  const handleProcessCsv = () => {
    if (!csvContent.trim()) {
      showToast('Masukkan isi file CSV terlebih dahulu!', 'error');
      return;
    }

    try {
      const lines = csvContent.split('\n').filter((l) => l.trim().length > 0);
      const parsedUsers: User[] = [];

      lines.forEach((line, index) => {
        // Skip header if line 1 has "NIS" or "Nama"
        if (index === 0 && (line.toLowerCase().includes('nama') || line.toLowerCase().includes('nis'))) {
          return;
        }

        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 2) {
          const [nis, nama, kelas, jenisKelamin] = cols;
          parsedUsers.push({
            id: `user_murid_csv_${Date.now()}_${index}`,
            name: nama,
            username: nama.toLowerCase().replace(/\s+/g, '.'),
            email: `${nama.toLowerCase().replace(/\s+/g, '.')}@siswa.sman1tejakula.sch.id`,
            role: 'murid',
            nipNis: nis,
            gender: jenisKelamin === 'P' ? 'P' : 'L',
            classId: kelas ? `class_${kelas.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : 'class_xi_1',
            isActive: true,
            createdAt: new Date().toISOString(),
          });
        }
      });

      const count = StorageService.importUsers(parsedUsers);
      setImportResult(`Berhasil mengimpor ${count} akun murid baru ke sistem!`);
      showToast(`Berhasil mengimpor ${count} akun murid!`, 'success');
      setCsvContent('');
    } catch (e: any) {
      showToast(`Format CSV tidak valid: ${e.message}`, 'error');
    }
  };

  const sampleCsvData = `NIS,Nama Murid,Kelas,Jenis Kelamin
22105,I Gede Arya Wibawa,XI-1,L
22106,Ni Made Sintya Dewi,XI-1,P
22107,I Nyoman Sudarsana,XI-1,L
22108,Ni Ketut Ariani,XI-1,P
22203,I Putu Yoga Pratama,XI-2,L
22204,Ni Kadek Rina Lestari,XI-2,P
23012,Gede Agus Santika,X-1,L
23013,Luh Putu Dian Utari,X-1,P`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
              Panel Administrator
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              SMAN 1 Tejakula
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Manajemen Pengguna, Data Murid & Konfigurasi Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola akses guru, impor data massal ratusan murid (CSV), dan atur tahun ajaran.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Pengguna ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'import' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Impor CSV
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Identitas Sekolah
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Log Aktivitas
          </button>
        </div>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add User Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Akun Baru</span>
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Peran (Role)
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                >
                  <option value="murid">Murid / Siswa</option>
                  <option value="guru">Guru PJOK</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  NIS / NIP
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk"
                  value={newUserNis}
                  onChange={(e) => setNewUserNis(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              {newUserRole === 'murid' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Kelas
                  </label>
                  <select
                    value={newUserClass}
                    onChange={(e) => setNewUserClass(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Simpan Akun
              </button>
            </form>
          </div>

          {/* User Table List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Cari nama atau NIS/NIP..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full sm:w-64 px-3 py-1.5 text-xs border border-slate-300 rounded-xl"
              />

              <div className="flex gap-1.5">
                {(['all', 'guru', 'murid', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg uppercase ${
                      roleFilter === r
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama Pengguna</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">NIS/NIP</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-slate-900 text-white'
                                : u.role === 'guru'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{u.nipNis || '-'}</td>
                        <td className="p-3">{u.classId?.replace('class_', '').toUpperCase() || '-'}</td>
                        <td className="p-3 text-center">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IMPORT CSV */}
      {activeTab === 'import' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-3xl">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" />
              <span>Impor Data Murid Massal Melalui CSV / Excel</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Impor puluhan hingga 300+ akun murid secara instan tanpa perlu mendaftar satu per satu.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Contoh Format CSV:</span>
              <button
                onClick={() => setCsvContent(sampleCsvData)}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Gunakan Data Contoh
              </button>
            </div>
            <pre className="text-[11px] font-mono bg-white p-3 rounded-lg border border-slate-200 text-slate-600 overflow-x-auto">
              {sampleCsvData}
            </pre>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Tempelkan Isi CSV di Bawah:
            </label>
            <textarea
              rows={8}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="NIS,Nama Murid,Kelas,Jenis Kelamin..."
              className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {importResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
              {importResult}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleProcessCsv}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Proses Impor Murid
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Identitas Sekolah & Aplikasi PJOK</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={settingsForm.namaSekolah}
                onChange={(e) => setSettingsForm({ ...settingsForm, namaSekolah: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Slogan Aplikasi</label>
              <input
                type="text"
                value={settingsForm.slogan}
                onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                className="w-full p-2 border rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Guru PJOK Utama</label>
                <input
                  type="text"
                  value={settingsForm.guruPjokUtama}
                  onChange={(e) => setSettingsForm({ ...settingsForm, guruPjokUtama: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">NIP Guru PJOK</label>
                <input
                  type="text"
                  value={settingsForm.nipGuruPjokUtama}
                  onChange={(e) => setSettingsForm({ ...settingsForm, nipGuruPjokUtama: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={settingsForm.tahunAjaranAktif}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tahunAjaranAktif: e.target.value })}
                  className="w-full p-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Semester</label>
                <select
                  value={settingsForm.semesterAktif}
                  onChange={(e) => setSettingsForm({ ...settingsForm, semesterAktif: e.target.value as any })}
                  className="w-full p-2 border rounded-xl bg-white"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Simpan Identitas Sekolah
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <h3 className="font-bold text-base text-slate-900 pb-2 border-b flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Audit Log Aktivitas Pengguna</span>
          </h3>

          <div className="max-h-[500px] overflow-y-auto space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.userName}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                  {new Date(log.timestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
