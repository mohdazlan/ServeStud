import { CheckCircle2, Lightbulb, Copy, Check, Bot } from 'lucide-react'
import { useState } from 'react'

export function AiFeedbackPanel({
  feedbackData,
  onApplyImprovedCode,
  className = '',
}) {
  const [copied, setCopied] = useState(false)

  if (!feedbackData) return null

  const { feedback, provider, model } = feedbackData

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`rounded-xl border border-indigo-500/40 bg-gradient-to-br from-[#0b1424] via-[#0f1b32] to-[#142340] p-4 shadow-xl text-slate-200 space-y-3 relative overflow-hidden ${className}`}
    >
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header matching Figure 1 in Paper */}
      <div className="flex items-center justify-between border-b border-[#213554] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Bot size={14} />
          </div>
          <h3 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <span>AI Feedback</span>
            <span className="text-[10px] font-normal text-slate-400">
              (Maklum Balas Semantik GenAI)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-mono">
            {provider === 'openrouter' ? `OpenRouter · ${model}` : provider === 'gemini' ? 'Gemini 1.5 Flash' : 'Semantic AI Engine'}
          </span>
        </div>
      </div>

      {/* Greeting & Summary */}
      {feedback.summary && (
        <p className="text-xs text-slate-300 leading-relaxed">
          {feedback.summary}
        </p>
      )}

      {/* Strengths / What was done well */}
      {feedback.strengths && feedback.strengths.length > 0 && (
        <div className="space-y-1.5">
          {feedback.strengths.map((st, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-emerald-300/90 leading-relaxed">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{st}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions / Constructive Improvements */}
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="space-y-1.5">
          {feedback.suggestions.map((sug, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-amber-200/90 leading-relaxed">
              <Lightbulb size={13} className="text-amber-400 shrink-0 mt-0.5" />
              <span>{sug}</span>
            </div>
          ))}
        </div>
      )}

      {/* Improved SQL Code Snippet (as shown in Figure 1) */}
      {feedback.codeSnippet && (
        <div className="mt-3 pt-2.5 border-t border-[#213554] space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Contoh Kod Disyorkan:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCopyCode(feedback.codeSnippet)}
                className="px-2 py-0.5 rounded bg-[#162740] hover:bg-[#20375a] text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
              >
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copied ? 'Disalin' : 'Salin'}</span>
              </button>
              {onApplyImprovedCode && (
                <button
                  type="button"
                  onClick={() => onApplyImprovedCode(feedback.codeSnippet)}
                  className="px-2 py-0.5 rounded bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] font-mono transition-colors"
                >
                  Guna Kod Ini
                </button>
              )}
            </div>
          </div>
          <pre className="p-2.5 rounded-lg bg-[#070e17] border border-[#1b2f4d] text-emerald-300 font-mono text-[11px] overflow-x-auto sql-guru-scrollbar leading-relaxed">
            {feedback.codeSnippet}
          </pre>
        </div>
      )}
    </div>
  )
}
