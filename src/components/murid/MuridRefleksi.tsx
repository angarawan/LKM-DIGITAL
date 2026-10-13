import React from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { Sparkles, Heart, Activity, CheckCircle2 } from 'lucide-react';

interface Props {
  currentUser: User;
}

export const MuridRefleksi: React.FC<Props> = ({ currentUser }) => {
  const submissions = StorageService.getSubmissions().filter((s) => s.studentId === currentUser.id);
  const lkms = StorageService.getLkms();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
            Joyful & Mindful Learning
          </span>
          <span className="text-xs text-slate-500 font-semibold">
            Pendidikan Jasmani Sepanjang Hayat
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mt-1">
          Jurnal Refleksi Pembelajaran PJOK
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Kumpulan refleksi mendalam, pemahaman kesiapan fisik, dan evaluasi diri yang telah Anda isi.
        </p>
      </div>

      <div className="space-y-4">
        {submissions.map((sub) => {
          const lkm = lkms.find((l) => l.id === sub.lkmId);
          // find reflection component
          const refComp = lkm?.components.find((c) => c.type === 'refleksi_pembelajaran');
          const refAnswer = refComp ? sub.answers[refComp.id]?.reflectionAnswers : undefined;

          if (!refAnswer) return null;

          return (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
            >
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{lkm?.judul}</h3>
                  <p className="text-xs text-slate-400">
                    Refleksi tanggal: {new Date(sub.lastSavedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Tercatat
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(refAnswer).map(([idx, text]) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-800">
                      Pertanyaan Refleksi #{Number(idx) + 1}:
                    </p>
                    <p className="text-xs text-slate-700 mt-1 font-medium pl-2 border-l-2 border-purple-500 italic">
                      "{text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
