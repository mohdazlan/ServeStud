import { useState, useRef, useEffect } from 'react'
import {
  Play,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  RotateCcw,
  Code2,
  Copy,
  Check,
} from 'lucide-react'
import { soundEffects } from '../engine/soundEffects.js'

export function SqlEditor({
  sql,
  onChangeSql,
  onRunSql,
  onCheckAnswer,
  onRequestHint,
  onRequestAiFeedback,
  onResetCode,
  isEvaluating,
  isGeneratingAi,
  activeHintTier,
  maxHints,
}) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef(null)

  const handleCopy = () => {
    navigator.clipboard?.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const insertSnippet = (snippet) => {
    soundEffects.playClick()
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = sql.substring(0, start) + snippet + sql.substring(end)
    onChangeSql(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + snippet.length, start + snippet.length)
    }, 10)
  }

  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'ORDER BY',
    'GROUP BY',
    'INNER JOIN',
    'CREATE TABLE',
    'PRIMARY KEY',
    'NOT NULL',
    'VARCHAR(50)',
    'AVG()',
    'COUNT()',
  ]

  // Calculate line numbers
  const lines = (sql || '').split('\n')

  return (
    <div className="flex flex-col bg-[#0b1422] border border-[#1e314f] rounded-xl overflow-hidden shadow-lg">
      {/* Editor Header / Toolbar */}
      <div className="px-3.5 py-2 bg-[#0e1a2d] border-b border-[#1e314f] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Editor SQL Interaktif</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
            ANSI SQL
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-[#1e314f] bg-[#09121e] hover:bg-[#132338] text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
            title="Salin Kod SQL"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Disalin' : 'Salin'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playClick()
              onResetCode()
            }}
            className="p-1.5 rounded-lg border border-[#1e314f] bg-[#09121e] hover:bg-[#132338] text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
            title="Kembalikan Kod Pemula"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline text-[11px]">Set Semula</span>
          </button>
        </div>
      </div>

      {/* Quick SQL Keyword Insertion Chips */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#09111c] border-b border-[#182840] overflow-x-auto sql-guru-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase font-mono mr-1 shrink-0">Katakunci:</span>
        {keywords.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => insertSnippet(`${kw} `)}
            className="px-2 py-0.5 rounded bg-[#101e32] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-[#1c304d] text-[10px] font-mono whitespace-nowrap transition-colors"
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Textarea Code Canvas with Line Numbers */}
      <div className="relative flex bg-[#070e17] font-mono text-xs min-h-[160px] max-h-[300px]">
        {/* Line Numbers Gutter */}
        <div className="select-none py-3 pl-3 pr-2 text-right text-slate-600 bg-[#09121e] border-r border-[#15233b] font-mono text-xs w-9 shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={sql}
          onChange={(e) => onChangeSql(e.target.value)}
          placeholder="Taip arahan SQL di sini..."
          spellCheck="false"
          className="w-full flex-1 p-3 bg-transparent text-emerald-300 focus:outline-none resize-y leading-relaxed font-mono text-xs selection:bg-emerald-500/30 selection:text-white"
          rows={Math.max(6, Math.min(14, lines.length + 1))}
        />
      </div>

      {/* Action Command Bar (Run, Check Answer, Contextual Hint, AI Feedback) */}
      <div className="p-3 bg-[#0d1829] border-t border-[#1e314f] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Run SQL (Laksana) */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick()
              onRunSql()
            }}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Laksana pertanyaan SQL dan lihat output jadual"
          >
            <Play size={14} className="fill-white" />
            <span>Laksana Query</span>
          </button>

          {/* 2. Check Answer (Semak Jawapan) */}
          <button
            type="button"
            disabled={isEvaluating}
            onClick={() => {
              soundEffects.playClick()
              onCheckAnswer()
            }}
            className="px-3.5 py-2 rounded-xl bg-[#14263f] hover:bg-[#1b3456] text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
            title="Sahkan ketepatan logik query anda"
          >
            <CheckCircle2 size={14} className="text-cyan-400" />
            <span>Semak Jawapan</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 3. Contextual Hint ("I want help, not the answer!") */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playHint()
              onRequestHint()
            }}
            className="px-3 py-2 rounded-xl bg-[#1d2217] hover:bg-[#28311d] text-amber-300 border border-amber-500/40 text-xs font-medium flex items-center gap-1.5 transition-colors active:scale-95"
            title="Dapatkan petunjuk berperingkat tanpa jawapan penuh"
          >
            <Lightbulb size={14} className="text-amber-400" />
            <span>Petunjuk Kontekstual ({activeHintTier}/{maxHints})</span>
          </button>

          {/* 4. GenAI Feedback (Powered by LLMs / OpenRouter) */}
          <button
            type="button"
            disabled={isGeneratingAi}
            onClick={() => {
              soundEffects.playClick()
              onRequestAiFeedback()
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all disabled:opacity-50 active:scale-95 glow-indigo-subtle"
            title="Dapatkan ulasan semantik & cadangan penambahbaikan berpandukan LLM"
          >
            <Sparkles size={14} className="text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{isGeneratingAi ? 'Menganalisis...' : 'Tanya Tutor AI'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
