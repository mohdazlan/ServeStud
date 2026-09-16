import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Play,
} from 'lucide-react'
import { LESSONS } from '../data/lessons.js'
import { soundEffects } from '../engine/soundEffects.js'

export function LearningMode({ onJumpToPlayground }) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [userPrediction, setUserPrediction] = useState(null)
  const [practiceInput, setPracticeInput] = useState('')
  const [practiceFeedback, setPracticeFeedback] = useState(null)

  const lesson = LESSONS[currentLessonIndex]

  const handleSelectPrediction = (option) => {
    setUserPrediction(option)
    if (soundEffects.isEnabled()) {
      if (option.isCorrect) soundEffects.playMatchSuccess()
      else soundEffects.playMatchFail()
    }
  }

  const handleCheckPractice = () => {
    if (!practiceInput.trim()) return
    const isPassed = lesson.practice.validate(practiceInput.trim())
    setPracticeFeedback({
      isPassed,
      message: isPassed
        ? '🎉 Syabas! Corak anda melepasi semua ujian semakan.'
        : 'Cuba lagi: Pastikan corak mematuhi semua kriteria yang diminta.',
    })

    if (soundEffects.isEnabled()) {
      if (isPassed) soundEffects.playMatchSuccess()
      else soundEffects.playMatchFail()
    }
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < LESSONS.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1)
      setUserPrediction(null)
      setPracticeInput('')
      setPracticeFeedback(null)
    }
  }

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex((prev) => prev - 1)
      setUserPrediction(null)
      setPracticeInput('')
      setPracticeFeedback(null)
    }
  }

  return (
    <div className="flex-1 bg-[#060a13] p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step Progress Stepper */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#182640] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                LANGKAH {lesson.id} DARIPADA {LESSONS.length}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {lesson.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">{lesson.rule}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="p-2 rounded-lg border border-[#223659] bg-[#0c1628] hover:bg-[#13223f] disabled:opacity-40 disabled:pointer-events-none text-slate-300 text-xs flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Sebelum</span>
            </button>
            <button
              type="button"
              onClick={handleNextLesson}
              disabled={currentLessonIndex === LESSONS.length - 1}
              className="p-2 rounded-lg border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 disabled:opacity-40 disabled:pointer-events-none text-cyan-300 text-xs flex items-center gap-1 transition-colors font-medium"
            >
              <span className="hidden sm:inline">Seterusnya</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </header>

        {/* 1. Core Concept Card */}
        <section className="p-5 rounded-xl bg-[#091122] border border-[#1b2b4a] shadow-lg">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lightbulb size={16} />
            <span>Satu Idea Asas (Single Concept)</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {lesson.concept}
          </h3>
          <p className="text-sm text-slate-300 font-sans leading-relaxed">
            {lesson.rule}
          </p>

          {/* Visual Explanation Box */}
          {lesson.visual && (
            <div className="mt-4 p-4 rounded-lg bg-[#060b17] border border-[#16233a] font-mono text-xs text-slate-300">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-2 font-sans font-bold">
                Gambaran Visual:
              </span>
              {lesson.visual.type === 'analogy' && (
                <div className="space-y-2">
                  <p>Acuan Stencil: <span className="text-cyan-400 font-bold">{lesson.visual.stencil}</span></p>
                  <p className="text-emerald-400">✓ Lulus: {lesson.visual.passStr} (sepadan acuan)</p>
                  <p className="text-rose-400">✗ Gagal: {lesson.visual.failStr} (terlebih / terkurang)</p>
                </div>
              )}
              {lesson.visual.type === 'shorthands' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {lesson.visual.items.map((it) => (
                    <div key={it.symbol} className="p-2.5 rounded bg-[#0e172a] border border-[#1e2f4f]">
                      <span className="text-cyan-300 font-bold block text-sm">{it.symbol}</span>
                      <span className="text-[11px] text-slate-400 block">{it.name}</span>
                      <span className="text-[10px] text-emerald-400 block mt-1">{it.matches}</span>
                    </div>
                  ))}
                </div>
              )}
              {lesson.visual.type === 'comparison' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-cyan-950/30 border border-cyan-500/30">
                    <span className="font-bold text-cyan-300 block">{lesson.visual.col1.title}</span>
                    <span className="text-xs text-slate-300 block">{lesson.visual.col1.rule}</span>
                    <code className="text-[11px] text-amber-300 block mt-1">{lesson.visual.col1.eg}</code>
                  </div>
                  <div className="p-3 rounded bg-amber-950/30 border border-amber-500/30">
                    <span className="font-bold text-amber-300 block">{lesson.visual.col2.title}</span>
                    <span className="text-xs text-slate-300 block">{lesson.visual.col2.rule}</span>
                    <code className="text-[11px] text-cyan-300 block mt-1">{lesson.visual.col2.eg}</code>
                  </div>
                </div>
              )}
              {(!['analogy', 'shorthands', 'comparison'].includes(lesson.visual.type)) && (
                <p className="text-slate-300">{JSON.stringify(lesson.visual)}</p>
              )}
            </div>
          )}
        </section>

        {/* 2. Worked Example */}
        <section className="p-5 rounded-xl bg-[#080e1c] border border-[#182642]">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
            Contoh Corak (Worked Example):
          </span>
          <div className="p-3 rounded-lg bg-[#0e1628] border border-amber-500/30 font-mono text-sm sm:text-base text-amber-300 font-bold mb-2">
            /{lesson.workedExample.pattern}/
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {lesson.workedExample.explanation}
          </p>
        </section>

        {/* 3. Prediction Checkpoint (Immediate Feedback) */}
        <section className="p-5 rounded-xl bg-[#091122] border border-[#1e2f4f]">
          <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle size={16} />
            <span>Soalan Ramalan Pelajar (Prediction Checkpoint)</span>
          </div>
          <h4 className="text-sm sm:text-base font-semibold text-white mb-3">
            {lesson.prediction.question}
          </h4>

          <div className="space-y-2">
            {lesson.prediction.options.map((opt, idx) => {
              const isSelected = userPrediction === opt
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrediction(opt)}
                  className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all font-sans leading-relaxed ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-[#0e172a] hover:bg-[#132039] border-[#1c2c4a] text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="size-5 rounded-full border border-slate-600 flex items-center justify-center shrink-0 text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Immediate Feedback with "Show Me Why" */}
          {userPrediction && (
            <div
              className={`mt-4 p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                userPrediction.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {userPrediction.isCorrect ? (
                  <CheckCircle2 size={16} className="text-emerald-400" />
                ) : (
                  <XCircle size={16} className="text-amber-400" />
                )}
                <span>
                  {userPrediction.isCorrect
                    ? 'Tepat sekali!'
                    : 'Hampir tepat! Mari kita fahami puncanya:'}
                </span>
              </div>
              <p className="font-sans">{lesson.prediction.explanation}</p>
            </div>
          )}
        </section>

        {/* 4. Small Hands-on Practice */}
        <section className="p-5 rounded-xl bg-[#080d1a] border border-[#192742]">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={16} />
            <span>Latihan Mini Interaktif (Hands-on Practice)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mb-3 font-sans">
            {lesson.practice.instructions}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={practiceInput}
                onChange={(e) => setPracticeInput(e.target.value)}
                placeholder="Taip corak anda di sini (cth: ^kucing$)..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e172a] border border-[#213352] text-sm font-mono text-cyan-300 focus:border-cyan-400"
              />
            </div>
            <button
              type="button"
              onClick={handleCheckPractice}
              className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Play size={14} />
              <span>Semak Jawapan</span>
            </button>
          </div>

          {practiceFeedback && (
            <div
              className={`mt-3 p-3 rounded-lg border text-xs flex items-center gap-2 ${
                practiceFeedback.isPassed
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
              }`}
            >
              {practiceFeedback.isPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{practiceFeedback.message}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 mt-2">
            Petua: {lesson.practice.hint}
          </p>
        </section>

        {/* Navigation Bottom Footer */}
        <footer className="flex items-center justify-between pt-4 border-t border-[#182640]">
          <button
            type="button"
            onClick={onJumpToPlayground}
            className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono"
          >
            ← Kembali ke Dojo Playground
          </button>

          {currentLessonIndex < LESSONS.length - 1 ? (
            <button
              type="button"
              onClick={handleNextLesson}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070b15] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Langkah Seterusnya</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onJumpToPlayground}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Selesai Mod Belajar! Masuk Playground</span>
              <Sparkles size={14} />
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
