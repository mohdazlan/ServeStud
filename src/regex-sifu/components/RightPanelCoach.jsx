import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  Send,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'
import { querySifuCoach, SUGGESTED_PROMPTS } from '../engine/sifuCoachEngine.js'
import { soundEffects } from '../engine/soundEffects.js'

export function RightPanelCoach({ onApplyPattern, className = '' }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'sifu',
      text: 'Salam sejahtera! Saya Sifu Coach anda. Beritahu saya dalam bahasa biasa apa yang borang web anda perlu sahkan (contoh: "Nombor telefon bimbit", "Emel pelajar", atau "MyKad"), atau klik salah satu cadangan di bawah.',
      suggestedPrompts: SUGGESTED_PROMPTS,
    },
  ])
  const [inputText, setInputText] = useState('')
  const [predictionAnswer, setPredictionAnswer] = useState(null)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText
    if (!query.trim()) return

    const userMsg = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')

    // Query Coach Engine
    setTimeout(() => {
      const response = querySifuCoach(query)
      const sifuMsg = {
        id: String(Date.now() + 1),
        sender: 'sifu',
        response,
      }
      setMessages((prev) => [...prev, sifuMsg])
      setPredictionAnswer(null)

      if (soundEffects.isEnabled()) {
        soundEffects.playBlip(680, 0.06)
      }
    }, 250)
  }

  const handlePredictionChoice = (candidate, userGuess, willMatch, reason) => {
    const isCorrect = userGuess === willMatch
    setPredictionAnswer({
      candidate,
      isCorrect,
      reason,
    })

    if (soundEffects.isEnabled()) {
      if (isCorrect) soundEffects.playMatchSuccess()
      else soundEffects.playMatchFail()
    }
  }

  return (
    <aside
      className={`flex flex-col border-l border-[#1a253d] bg-[#070b15] select-none ${className}`}
      aria-label="Sifu Coach AI Assistant"
    >
      {/* Sifu Coach Header */}
      <div className="p-3.5 border-b border-[#182640] bg-[#090f1f] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-white tracking-tight">
                Sifu Coach
              </h3>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono">
                OFFLINE · AMAN
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Bimbingan Peraturan & Pengesahan Langkah demi Langkah
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-cyan-600 text-white font-sans text-xs leading-relaxed">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-[95%] w-full rounded-xl bg-[#0e1628] border border-[#1b2b48] p-3 text-slate-200">
                {msg.text && <p className="leading-relaxed mb-2">{msg.text}</p>}

                {/* Suggested Prompts Pills */}
                {msg.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-[#182742]">
                    <span className="text-[10px] text-slate-400 w-full mb-0.5">
                      Cadangan soalan biasa:
                    </span>
                    {msg.suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="px-2.5 py-1 rounded-md bg-[#132039] hover:bg-cyan-950/60 hover:border-cyan-500/40 border border-[#1e3052] text-cyan-300 text-[11px] transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Matched Intent Response */}
                {msg.response?.type === 'matched_intent' && (
                  <div className="space-y-3 mt-1">
                    <div className="flex items-center justify-between border-b border-[#1a2b49] pb-2">
                      <span className="font-bold text-cyan-300 text-xs">
                        {msg.response.intent.title}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed font-sans">
                      {msg.response.intent.explanation}
                    </p>

                    {/* Generated Pattern Box with Apply Button */}
                    <div className="p-2.5 rounded-lg bg-[#070d1a] border border-cyan-500/40 flex items-center justify-between gap-2">
                      <code className="text-cyan-300 font-mono text-xs font-bold truncate">
                        {msg.response.intent.recommendedPattern}
                      </code>
                      {onApplyPattern && (
                        <button
                          type="button"
                          onClick={() =>
                            onApplyPattern(msg.response.intent.recommendedPattern)
                          }
                          className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-medium border border-cyan-500/40 whitespace-nowrap transition-colors flex items-center gap-1"
                        >
                          <span>Guna Corak</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>

                    {/* Token-by-Token Explanations */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Pecahan Maksud Simbol:
                      </span>
                      <div className="space-y-1">
                        {msg.response.intent.tokens.map((t, i) => (
                          <div
                            key={i}
                            className="p-1.5 rounded bg-[#09101f] border border-[#16233a] flex items-start gap-2 text-[11px]"
                          >
                            <code className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono shrink-0">
                              {t.symbol}
                            </code>
                            <span className="text-slate-300">{t.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Valid & Invalid Examples */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[11px]">
                        <span className="font-semibold text-emerald-400 block mb-1">
                          Contoh Sah (Valid):
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-300 font-mono">
                          {msg.response.intent.validExamples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-[11px]">
                        <span className="font-semibold text-rose-400 block mb-1">
                          Contoh Gagal (Invalid):
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-rose-300 font-mono">
                          {msg.response.intent.invalidExamples.map((ex, i) => (
                            <li key={i}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Interactive Prediction Checkpoint */}
                    {msg.response.intent.predictionChallenge && (
                      <div className="p-3 rounded-lg bg-[#121c32] border border-amber-500/30 mt-2">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
                          <Lightbulb size={14} />
                          <span>Ujian Ramalan Sifu (Prediction Game):</span>
                        </div>
                        <p className="text-slate-200 mb-2">
                          Adakah nilai ini akan <strong>SEPADAN</strong> dengan corak di atas?
                        </p>
                        <div className="px-2.5 py-1.5 rounded bg-[#090f1d] border border-slate-700 text-center font-mono text-cyan-300 font-bold mb-2">
                          "{msg.response.intent.predictionChallenge.candidate}"
                        </div>

                        {!predictionAnswer ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handlePredictionChoice(
                                  msg.response.intent.predictionChallenge.candidate,
                                  true,
                                  msg.response.intent.predictionChallenge.willMatch,
                                  msg.response.intent.predictionChallenge.reason
                                )
                              }
                              className="flex-1 py-1.5 rounded bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
                            >
                              Ya, Sepadan (Match)
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handlePredictionChoice(
                                  msg.response.intent.predictionChallenge.candidate,
                                  false,
                                  msg.response.intent.predictionChallenge.willMatch,
                                  msg.response.intent.predictionChallenge.reason
                                )
                              }
                              className="flex-1 py-1.5 rounded bg-rose-600/80 hover:bg-rose-600 text-white font-medium text-xs transition-colors"
                            >
                              Tidak Sepadan (Fail)
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`p-2 rounded border text-xs leading-relaxed ${
                              predictionAnswer.isCorrect
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              {predictionAnswer.isCorrect
                                ? '🎉 Tahniah, ramalan anda tepat!'
                                : '💡 Sedikit lagi! Mari kita fahami puncanya:'}
                            </span>
                            <p>{predictionAnswer.reason}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Safety Caution */}
                    <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed">
                      <span className="font-semibold text-amber-400 block mb-0.5">
                        Amaran Sifu:
                      </span>
                      {msg.response.intent.realWorldWarning}
                    </div>
                  </div>
                )}

                {/* Raw RegEx Analysis Response */}
                {msg.response?.type === 'raw_analysis' && (
                  <div className="space-y-2 mt-1">
                    <span className="font-bold text-amber-300 block text-xs">
                      Pemeriksaan Corak RegEx Anda:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {msg.response.issues.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                    {msg.response.recommendations.length > 0 && (
                      <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 mt-2">
                        <span className="font-semibold text-cyan-300 block mb-1">
                          Cadangan Penambahbaikan:
                        </span>
                        {msg.response.recommendations.map((rec, i) => (
                          <p key={i} className="text-cyan-200">
                            • {rec}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Unknown Query Fallback */}
                {msg.response?.type === 'unknown' && (
                  <div className="space-y-2 mt-1">
                    <p className="leading-relaxed">{msg.response.message}</p>
                    {msg.response.suggestedPrompts && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.response.suggestedPrompts.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handleSendMessage(p)}
                            className="px-2 py-0.5 rounded bg-[#16233d] hover:bg-cyan-900/50 text-cyan-300 text-[11px] transition-colors"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSendMessage()
        }}
        className="p-3 border-t border-[#182640] bg-[#090f1f]"
      >
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tanya Sifu (cth: Nombor telefon bimbit)..."
            className="flex-1 px-3 py-2 rounded-lg bg-[#0e1628] border border-[#213352] text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:bg-[#121c33] transition-colors"
          />
          <button
            type="submit"
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 transition-colors shrink-0"
            title="Hantar soalan ke Sifu Coach"
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </form>
    </aside>
  )
}
