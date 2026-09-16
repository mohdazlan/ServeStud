import { X, ShieldCheck, Database, Lock, EyeOff } from 'lucide-react'

export function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="max-w-lg w-full rounded-2xl bg-[#091122] border border-[#1f3152] shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#182743] bg-[#0c162b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 id="privacy-modal-title" className="text-sm font-bold text-white">
              Dasar Privasi & Jaminan Tanpa Penjejakan (Zero-Data Leak)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Tutup dialog privasi"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-xs font-sans leading-relaxed text-slate-300 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
            <Lock size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-300 block mb-0.5">
                100% Pengiraan Di Pelayar (Client-Side Only)
              </span>
              Setiap ujian RegEx, perkataan ujian borang, dan soalan kuiz diproses secara terus di dalam pelayar peranti anda. Tiada data input pelajar yang dihantar ke pelayan luar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0e172a] border border-[#1c2c4a]">
            <Database size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block mb-0.5">
                Penyimpanan Tempatan (LocalStorage) Sahaja
              </span>
              Aplikasi ini hanya menggunakan memori tempatan peranti (browser localStorage) untuk:
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 font-mono text-[11px]">
                <li>Status menonton video intro (hasSeenIntro)</li>
                <li>Pilihan audio (bisu/aktif)</li>
                <li>Tetapan mod paparan projektor</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0e172a] border border-[#1c2c4a]">
            <EyeOff size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">
                Sifu Coach Bebas API Pihak Ketiga
              </span>
              Enjin pembantu Sifu Coach beroperasi secara deterministik (pola terprogram luar talian). Ia tidak menghantar rentetan kod anda kepada perkhidmatan AI luaran komersial tanpa kebenaran anda.
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-[#182743]">
            Sesuai digunakan dalam dewan peperiksaan komputer politeknik dan komputer makmal universiti awam tanpa risiko kebocoran privasi pelajar.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#182743] bg-[#0c162b] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
          >
            Faham & Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
