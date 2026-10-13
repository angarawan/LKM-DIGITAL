import React, { useState } from 'react';
import { gasCodeFiles } from '../../services/gasCodeGenerator';
import { StorageService } from '../../services/storage';
import { showToast } from '../../services/toast';
import {
  FileSpreadsheet,
  Copy,
  Check,
  Download,
  Send,
  HelpCircle,
  X,
  ExternalLink,
  Code,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GasIntegrationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const settings = StorageService.getSettings();
  const [selectedFile, setSelectedFile] = useState<keyof typeof gasCodeFiles>('Code.gs');
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(settings.gasWebhookUrl || '');
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const currentCode = gasCodeFiles[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWebhook = () => {
    StorageService.updateSettings({ gasWebhookUrl: webhookUrl });
    showToast('URL Webhook Google Apps Script berhasil disimpan!', 'success');
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      showToast('Masukkan URL Web App Google Apps Script terlebih dahulu!', 'error');
      return;
    }
    setIsTesting(true);
    setTestStatus('Mengirim sinyal uji coba...');

    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors', // standard GAS redirect mode
        body: JSON.stringify({ action: 'SETUP_STRUCTURE' }),
      });
      setTestStatus(
        'Permintaan berhasil dikirim ke Google Apps Script! (Periksa Spreadsheet Anda)'
      );
    } catch (err: any) {
      setTestStatus(`Gagal terhubung: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Integrasi Google Apps Script & Google Spreadsheet
              </h3>
              <p className="text-xs text-emerald-200">
                LKM DIGITAL PJOK – SMA NEGERI 1 TEJAKULA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {/* Instructions Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
            <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Petunjuk Penerapan Google Apps Script Sekolah (Langkah Demi Langkah):</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-emerald-900/90 leading-relaxed">
              <li>
                Buka Google Spreadsheet baru di akun Google Workspace guru (misal:{' '}
                <code>@guru.sma.belajar.id</code>).
              </li>
              <li>
                Buka menu <strong>Ekstensi &rarr; Apps Script</strong>.
              </li>
              <li>
                Buat file skrip sesuai daftar tab di bawah (<code>Code.gs</code>,{' '}
                <code>Database.gs</code>, <code>Auth.gs</code>, <code>LKM.gs</code>,{' '}
                <code>Penilaian.gs</code>, <code>Utils.gs</code>) lalu salin isinya.
              </li>
              <li>
                Jalankan fungsi <code>setupStructure()</code> di <code>Database.gs</code> untuk
                membuat 12 sheet database otomatis.
              </li>
              <li>
                Klik tombol <strong>Deploy &rarr; New Deployment</strong> pilih Web App, atur{' '}
                <em>Execute as: Me</em> dan <em>Who has access: Anyone / Domain Sekolah</em>.
              </li>
              <li>Salin Web App URL dan tempelkan ke kolom konektor di bawah untuk sinkronisasi langsung!</li>
            </ol>
          </div>

          {/* Webhook URL Connector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Konektor Web App URL Google Apps Script:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleSaveWebhook}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition whitespace-nowrap"
              >
                Simpan URL
              </button>
              <button
                type="button"
                disabled={isTesting}
                onClick={handleTestWebhook}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Menguji...' : 'Uji Webhook'}</span>
              </button>
            </div>
            {testStatus && (
              <p className="text-xs font-semibold text-emerald-700 mt-1">{testStatus}</p>
            )}
          </div>

          {/* Code Viewer with Tab Switcher */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
            {/* Tabs */}
            <div className="bg-slate-950 px-4 py-2.5 flex flex-wrap items-center justify-between border-b border-slate-800 gap-2">
              <div className="flex flex-wrap gap-1">
                {(Object.keys(gasCodeFiles) as Array<keyof typeof gasCodeFiles>).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                      selectedFile === fileName
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {fileName}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[380px] overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-300 leading-relaxed selection:bg-blue-700">
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 text-white hover:bg-slate-900 rounded-xl"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
