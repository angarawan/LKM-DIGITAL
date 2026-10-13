import React from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { UserCheck, Shield, School, Award, Activity } from 'lucide-react';

interface Props {
  currentUser: User;
}

export const MuridProfil: React.FC<Props> = ({ currentUser }) => {
  const settings = StorageService.getSettings();
  const classes = StorageService.getClasses();
  const cls = classes.find((c) => c.id === currentUser.classId);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
            <p className="text-xs text-blue-600 font-semibold">{currentUser.email}</p>
            <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider mt-1">
              Siswa Aktif
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Nomor Induk Siswa (NIS)
              </span>
              <p className="font-bold text-sm text-slate-800 mt-0.5 font-mono">
                {currentUser.nipNis || '-'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Kelas & Fase
              </span>
              <p className="font-bold text-sm text-slate-800 mt-0.5">
                {cls?.name || 'Kelas XI-1'} (Fase {cls?.fase || 'F'})
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Jenis Kelamin
              </span>
              <p className="font-bold text-sm text-slate-800 mt-0.5">
                {currentUser.gender === 'P' ? 'Perempuan' : 'Laki-laki'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Guru PJOK Pengampu
              </span>
              <p className="font-bold text-xs text-slate-800 mt-0.5">
                {settings.guruPjokUtama}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-1">
            <p className="font-bold text-xs text-blue-900">{settings.namaSekolah}</p>
            <p className="text-[11px] text-blue-800">
              Tahun Ajaran: {settings.tahunAjaranAktif} • Semester {settings.semesterAktif}
            </p>
            <p className="text-[11px] text-slate-500 italic pt-1">
              "{settings.slogan}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
