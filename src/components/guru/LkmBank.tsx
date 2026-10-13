import React from 'react';
import { LkmData } from '../../types';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  BookOpen,
  PlusCircle,
  Copy,
  Edit3,
  Trash2,
  Printer,
  Send,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  onCreateNew: () => void;
  onEditLkm: (lkm: LkmData) => void;
  onAssignLkm: (lkmId: string) => void;
  onPrintLkm: (lkmId: string) => void;
}

export const LkmBank: React.FC<Props> = ({
  onCreateNew,
  onEditLkm,
  onAssignLkm,
  onPrintLkm,
}) => {
  const lkms = StorageService.getLkms();

  const handleDuplicate = (id: string) => {
    const duplicated = StorageService.duplicateLkm(id);
    if (duplicated) {
      showToast(`LKM berhasil digandakan sebagai "${duplicated.judul}"`, 'success');
    }
  };

  const handleDelete = (id: string, title: string) => {
    StorageService.deleteLkm(id);
    showToast(`LKM "${title}" berhasil dihapus.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Bank LKM Digital
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Total {lkms.length} Dokumen Lembar Kerja
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Katalog & Manajemen Lembar Kerja Murid (LKM)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, duplikasi, sunting komponen, dan bagikan LKM PJOK ke rombel kelas.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat LKM Baru</span>
        </button>
      </div>

      {/* LKM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lkms.map((lkm) => (
          <div
            key={lkm.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Fase {lkm.fase} • Kelas {lkm.kelas} ({lkm.semester})
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    lkm.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {lkm.status === 'published' ? 'Aktif Terbit' : 'Draft'}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">
                {lkm.judul}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong className="text-slate-700">Materi:</strong> {lkm.materiPokok}
              </p>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-700">Model:</strong> {lkm.modelPembelajaran}
              </p>

              {/* Components Badge */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  {lkm.components.length} Aktivitas Pembelajaran
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  Pertemuan Ke-{lkm.pertemuanKe} ({lkm.alokasiWaktu})
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onAssignLkm(lkm.id)}
                  title="Tugaskan ke Kelas"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Tugaskan</span>
                </button>
                <button
                  onClick={() => onPrintLkm(lkm.id)}
                  title="Cetak Format PDF A4"
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(lkm.id)}
                  title="Duplikasi LKM"
                  className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onEditLkm(lkm)}
                  className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(lkm.id, lkm.judul)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
