import { AlertTriangle, Home } from 'lucide-react'

export function NotFoundPage({ onGoHome }) {
  return (
    <div className="flex-1 bg-[#060a13] flex items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#091122] border border-[#1b2b4a] space-y-4">
        <div className="size-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-1">
          <span className="text-3xl font-extrabold font-mono text-rose-400">404</span>
          <h2 className="text-lg font-bold text-white">Laluan Tidak Dijumpai (No Match)</h2>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Corak URL yang anda masukkan tidak sepadan dengan mana-mana modul dalam RegEx Sifu ataupun topik ServeStud.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home size={15} />
            <span>Kembali ke Dojo Playground Utama</span>
          </button>
        </div>
      </div>
    </div>
  )
}
