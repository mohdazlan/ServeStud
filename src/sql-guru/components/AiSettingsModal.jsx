import { useState, useEffect } from 'react'
import { X, Key, Bot, Shield, Check, ExternalLink } from 'lucide-react'

export function AiSettingsModal({ isOpen, onClose }) {
  const [provider, setProvider] = useState('local') // 'local' | 'openrouter' | 'gemini'
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [geminiKey, setGeminiKey] = useState('')
  const [model, setModel] = useState('google/gemini-2.5-flash')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const savedProvider = localStorage.getItem('sql_guru_ai_provider') || 'local'
      const savedOrKey = localStorage.getItem('sql_guru_openrouter_key') || ''
      const savedGeminiKey = localStorage.getItem('sql_guru_gemini_key') || ''
      const savedModel = localStorage.getItem('sql_guru_model') || 'google/gemini-2.5-flash'

      setProvider(savedProvider)
      setOpenRouterKey(savedOrKey)
      setGeminiKey(savedGeminiKey)
      setModel(savedModel)
    } catch {
      // LocalStorage access fallback
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    try {
      localStorage.setItem('sql_guru_ai_provider', provider)
      localStorage.setItem('sql_guru_openrouter_key', openRouterKey)
      localStorage.setItem('sql_guru_gemini_key', geminiKey)
      localStorage.setItem('sql_guru_model', model)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        onClose()
      }, 800)
    } catch {
      onClose()
    }
  }

  const handleClearKeys = () => {
    try {
      localStorage.removeItem('sql_guru_openrouter_key')
      localStorage.removeItem('sql_guru_gemini_key')
      setOpenRouterKey('')
      setGeminiKey('')
      setProvider('local')
      localStorage.setItem('sql_guru_ai_provider', 'local')
    } catch {
      // Fallback
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#0b1320] border border-[#1e314f] shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#0e1a2d] border-b border-[#1e314f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Tetapan Enjin GenAI Tutor</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#162740] text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto sql-guru-scrollbar">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 block">Pilihan Mod Tutor AI:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'local'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold'
                    : 'border-[#1e314f] bg-[#070e17] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">Tutor Lokal</div>
                <div className="text-[10px] opacity-75 mt-0.5">Percuma / Pantas</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openrouter')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'openrouter'
                    ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300 font-bold'
                    : 'border-[#1e314f] bg-[#070e17] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">OpenRouter API</div>
                <div className="text-[10px] opacity-75 mt-0.5">Disyorkan Kajian</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  provider === 'gemini'
                    ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300 font-bold'
                    : 'border-[#1e314f] bg-[#070e17] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-semibold">Gemini API</div>
                <div className="text-[10px] opacity-75 mt-0.5">Google AI</div>
              </button>
            </div>
          </div>

          {/* OpenRouter Config */}
          {provider === 'openrouter' && (
            <div className="p-3.5 rounded-xl bg-[#070e17] border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <Key size={13} />
                  <span>Kunci API OpenRouter:</span>
                </span>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  Dapatkan Kunci <ExternalLink size={10} />
                </a>
              </div>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full p-2.5 rounded-lg bg-[#0b1320] border border-[#1e314f] text-indigo-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Pilihan Model LLM:</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#0b1320] border border-[#1e314f] text-slate-200 text-xs focus:outline-none"
                >
                  <option value="google/gemini-2.5-flash">Google Gemini 2.5 Flash (Pantas & Cekap)</option>
                  <option value="deepseek/deepseek-chat">DeepSeek Chat V3</option>
                  <option value="meta-llama/llama-3.3-70b-instruct">Meta Llama 3.3 70B</option>
                  <option value="anthropic/claude-3.5-haiku">Anthropic Claude 3.5 Haiku</option>
                  <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                </select>
              </div>
            </div>
          )}

          {/* Gemini Config */}
          {provider === 'gemini' && (
            <div className="p-3.5 rounded-xl bg-[#070e17] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <Key size={13} />
                  <span>Google AI Studio Gemini Key:</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
                >
                  Dapatkan Kunci <ExternalLink size={10} />
                </a>
              </div>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-2.5 rounded-lg bg-[#0b1320] border border-[#1e314f] text-cyan-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Privacy Guarantee Note */}
          <div className="p-3 rounded-xl bg-[#09121e] border border-[#182840] flex items-start gap-2 text-slate-400 text-[11px]">
            <Shield size={15} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Jaminan Privasi: Kunci API anda disimpan secara eksklusif dalam LocalStorage pelayar peribadi anda dan tidak pernah dihantar ke mana-mana pelayan pihak ketiga selain penyedia model AI yang anda pilih.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0e1a2d] border-t border-[#1e314f] flex items-center justify-between">
          <button
            type="button"
            onClick={handleClearKeys}
            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
          >
            Padam Kunci Tersimpan
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#142236] hover:bg-[#1a2d48] text-slate-300 text-xs font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
            >
              {saved ? <Check size={14} /> : null}
              <span>{saved ? 'Disimpan!' : 'Simpan Tetapan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
