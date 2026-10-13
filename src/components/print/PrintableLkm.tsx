import React from 'react';
import { LkmData } from '../../types';
import { StorageService } from '../../services/storage';
import { Printer, ArrowLeft } from 'lucide-react';

interface Props {
  lkmId: string;
  onBack: () => void;
}

export const PrintableLkm: React.FC<Props> = ({ lkmId, onBack }) => {
  const settings = StorageService.getSettings();
  const lkms = StorageService.getLkms();
  const lkm = lkms.find((l) => l.id === lkmId) || lkms[0];

  if (!lkm) return null;

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Dokumen (Ukuran A4)</span>
        </button>
      </div>

      {/* A4 Printable Paper */}
      <div className="bg-white p-8 sm:p-12 max-w-4xl mx-auto border border-slate-200 shadow-lg rounded-xl print:shadow-none print:border-none print:p-0 space-y-6 text-slate-900">
        {/* Official School Header (KOP SURAT) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-700">
            PEMERINTAH PROVINSI BALI • DINAS PENDIDIKAN KEPEMUDAAN DAN OLAHRAGA
          </p>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900">
            {settings.namaSekolah}
          </h1>
          <p className="text-xs text-slate-600">
            {settings.alamatSekolah} • NPSN: {settings.npsn}
          </p>
          <p className="text-xs font-bold tracking-wide uppercase text-blue-900">
            LEMBAR KERJA MURID (LKM) DIGITAL PJOK BERBASIS DEEP LEARNING
          </p>
        </div>

        {/* LKM Identity Table */}
        <table className="w-full text-xs border border-slate-300">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold w-36 bg-slate-50">Mata Pelajaran</td>
              <td className="p-2">: {lkm.mataPelajaran}</td>
              <td className="p-2 font-bold w-36 bg-slate-50">Fase / Kelas</td>
              <td className="p-2">: Fase {lkm.fase} / Kelas {lkm.kelas}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold bg-slate-50">Materi Pokok</td>
              <td className="p-2">: {lkm.materiPokok}</td>
              <td className="p-2 font-bold bg-slate-50">Semester / TP</td>
              <td className="p-2">: {lkm.semester} / {lkm.tahunAjaran}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="p-2 font-bold bg-slate-50">Topik Pembelajaran</td>
              <td className="p-2">: {lkm.topik}</td>
              <td className="p-2 font-bold bg-slate-50">Alokasi Waktu</td>
              <td className="p-2">: {lkm.alokasiWaktu} (Pertemuan {lkm.pertemuanKe})</td>
            </tr>
            <tr>
              <td className="p-2 font-bold bg-slate-50">Guru PJOK</td>
              <td className="p-2">: {lkm.guruPembuat}</td>
              <td className="p-2 font-bold bg-slate-50">Nama Murid / Regu</td>
              <td className="p-2">: ................................................</td>
            </tr>
          </tbody>
        </table>

        {/* Capaian & Tujuan */}
        <div className="space-y-2 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 uppercase">A. Capaian Pembelajaran (CP)</h4>
            <p className="text-slate-700 leading-relaxed pl-4">{lkm.capaianPembelajaran}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 uppercase">B. Tujuan Pembelajaran (TP)</h4>
            <ul className="list-disc list-inside pl-4 space-y-0.5 text-slate-700">
              {lkm.tujuanPembelajaran.map((tp, i) => (
                <li key={i}>{tp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Components & Activities */}
        <div className="space-y-5 text-xs">
          <h4 className="font-bold text-slate-900 uppercase text-sm border-b pb-1">
            C. Aktivitas Pembelajaran Murid
          </h4>

          {lkm.components.map((comp, idx) => (
            <div key={comp.id} className="space-y-2 page-break-inside-avoid">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <span>{idx + 1}.</span>
                <span>{comp.judul}</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Tahap: {comp.stage} • Bobot: {comp.bobotNilai} Poin)
                </span>
              </div>
              <p className="text-slate-600 italic pl-4">{comp.instruksi}</p>

              {comp.payload.materiText && (
                <div className="pl-4 text-slate-700 whitespace-pre-line bg-slate-50 p-2.5 rounded border border-slate-200">
                  {comp.payload.materiText}
                </div>
              )}

              {comp.payload.pertanyaan && (
                <div className="pl-4 text-slate-800 font-medium">
                  {comp.payload.pertanyaan}
                </div>
              )}

              {/* Table PJOK print view */}
              {comp.type === 'tabel_pengamatan_pjok' && (
                <div className="pl-4">
                  <table className="w-full text-xs border border-slate-300">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="p-1.5 border text-center w-8">No</th>
                        <th className="p-1.5 border">Bentuk Latihan</th>
                        <th className="p-1.5 border">Unsur Kebugaran</th>
                        <th className="p-1.5 border text-center w-28">Hasil Praktik</th>
                        <th className="p-1.5 border">Catatan Pelaksanaan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(comp.payload.exerciseRows || []).map((row) => (
                        <tr key={row.id}>
                          <td className="p-1.5 border text-center">{row.no}</td>
                          <td className="p-1.5 border font-semibold">{row.bentukLatihan}</td>
                          <td className="p-1.5 border">{row.unsurKebugaran}</td>
                          <td className="p-1.5 border text-center">........ {row.targetSatuan}</td>
                          <td className="p-1.5 border"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Essay answer line */}
              {comp.type === 'uraian' && (
                <div className="pl-4 border border-dashed border-slate-300 h-20 rounded p-2 text-slate-400">
                  [Ruang Jawaban Uraian Murid]
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Signature Box */}
        <div className="pt-8 grid grid-cols-2 text-xs page-break-inside-avoid">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala SMAN 1 Tejakula</p>
            <div className="h-16" />
            <p className="font-bold underline">{settings.kepalaSekolah}</p>
            <p>NIP. {settings.nipKepalaSekolah}</p>
          </div>
          <div className="text-right">
            <p>Tejakula, ......................... 2024</p>
            <p className="font-bold">Guru Pengampu PJOK</p>
            <div className="h-16" />
            <p className="font-bold underline">{settings.guruPjokUtama}</p>
            <p>NIP. {settings.nipGuruPjokUtama}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
