import React from 'react';
import { UserRole } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Send,
  Users,
  Eye,
  CheckSquare,
  Award,
  GraduationCap,
  Settings,
  FileSpreadsheet,
  Clock,
  Sparkles,
  User,
  ShieldAlert,
  UploadCloud,
  FileText,
  X,
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingGradingCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  pendingGradingCount = 0,
}) => {
  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onClose();
  };

  const guruMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bank_lkm', label: 'Bank LKM', icon: BookOpen },
    { id: 'buat_lkm', label: 'Buat LKM Baru', icon: PlusCircle, highlight: true },
    { id: 'penugasan', label: 'Penugasan LKM', icon: Send },
    { id: 'kelompok', label: 'Kelompok Belajar', icon: Users },
    { id: 'monitoring', label: 'Monitoring Pengerjaan', icon: Eye },
    {
      id: 'penilaian',
      label: 'Penilaian & Umpan Balik',
      icon: CheckSquare,
      badge: pendingGradingCount > 0 ? `${pendingGradingCount}` : undefined,
    },
    { id: 'rekap_nilai', label: 'Rekap Nilai', icon: Award },
    { id: 'data_murid_kelas', label: 'Data Murid & Kelas', icon: GraduationCap },
    { id: 'gas_sync', label: 'Google Apps Script', icon: FileSpreadsheet },
    { id: 'pengaturan', label: 'Pengaturan Sekolah', icon: Settings },
  ];

  const muridMenuItems = [
    { id: 'murid_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lkm_saya', label: 'LKM Saya', icon: BookOpen, highlight: true },
    { id: 'riwayat_nilai', label: 'Riwayat & Nilai', icon: Award },
    { id: 'refleksi', label: 'Refleksi Pembelajaran', icon: Sparkles },
    { id: 'profil', label: 'Profil Saya', icon: User },
  ];

  const adminMenuItems = [
    { id: 'admin_dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'manajemen_user', label: 'Manajemen Pengguna', icon: Users },
    { id: 'impor_csv', label: 'Impor Murid (CSV)', icon: UploadCloud },
    { id: 'manajemen_kelas', label: 'Manajemen Kelas', icon: GraduationCap },
    { id: 'semua_lkm', label: 'Semua LKM Guru', icon: FileText },
    { id: 'log_aktivitas', label: 'Log Aktivitas', icon: Clock },
    { id: 'pengaturan_sekolah', label: 'Pengaturan Sekolah', icon: Settings },
  ];

  let items = guruMenuItems;
  if (role === 'murid') items = muridMenuItems;
  if (role === 'admin') items = adminMenuItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-full lg:h-[calc(100vh-4rem)] w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out no-print ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {/* Mobile header inside drawer */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <span className="font-bold text-sm tracking-wide text-white">Menu Navigasi</span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role header card */}
          <div className="p-3 bg-gradient-to-r from-blue-900/60 to-indigo-900/40 rounded-xl border border-blue-800/40">
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              {role === 'guru' ? 'Ruang Kerja Guru' : role === 'murid' ? 'Ruang Belajar Murid' : 'Panel Administrator'}
            </p>
            <p className="text-xs font-semibold text-white mt-0.5 truncate">
              {role === 'guru' ? 'Kurikulum Merdeka PJOK' : role === 'murid' ? 'LKM Digital Aktif' : 'Sistem SMAN 1 Tejakula'}
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : item.highlight
                      ? 'bg-blue-950/60 text-blue-200 hover:bg-blue-900/60 border border-blue-800/40'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[11px] text-slate-400 flex flex-col space-y-1">
            <span className="font-semibold text-slate-300">SMA Negeri 1 Tejakula</span>
            <span className="text-[10px] text-slate-500">"Belajar, Bergerak, Berkolaborasi, & Merefleksi"</span>
          </div>
        </div>
      </aside>
    </>
  );
};
