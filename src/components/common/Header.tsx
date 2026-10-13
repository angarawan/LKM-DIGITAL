import React from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Activity,
  UserCircle2,
  FileSpreadsheet,
  RotateCcw,
  Menu,
  GraduationCap,
  Shield,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onOpenUserSwitcher: () => void;
  onOpenGasModal: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenUserSwitcher,
  onOpenGasModal,
  onToggleSidebar,
}) => {
  const settings = StorageService.getSettings();

  const handleResetData = () => {
    StorageService.resetAllData();
    window.location.reload();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'guru':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3 h-3" /> Guru PJOK
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserIcon className="w-3 h-3" /> Murid
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                    LKM DIGITAL PJOK
                  </h1>
                  <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white">
                    TEJAKULA
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 hidden md:block leading-tight">
                  {settings.namaSekolah} • Guru: {settings.guruPjokUtama}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions & User Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Google Sheets / Apps Script Sync */}
            <button
              onClick={onOpenGasModal}
              title="Integrasi & Kode Google Apps Script / Spreadsheet"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Apps Script</span>
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={handleResetData}
              title="Reset data ke bawaan"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Profile & Switcher Trigger */}
            <div className="flex items-center pl-2 sm:pl-3 border-l border-slate-200">
              <button
                onClick={onOpenUserSwitcher}
                className="flex items-center space-x-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 group-hover:scale-105 transition">
                  <UserCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition leading-snug truncate max-w-[150px]">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {getRoleBadge(currentUser.role)}
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-semibold hidden sm:inline ml-1">
                  Ganti
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
