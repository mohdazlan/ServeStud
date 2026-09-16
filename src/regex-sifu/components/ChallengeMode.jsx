import { useState, useMemo } from 'react'
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import { CHALLENGES } from '../data/challenges.js'
import { safeTest } from '../engine/regexEngine.js'
import { soundEffects } from '../engine/soundEffects.js'

export function ChallengeMode({ onJumpToPlayground: _onJumpToPlayground }) {
  const [selectedChallengeId, setSelectedChallengeId] = useState(CHALLENGES[0].id)
  const [userPattern, setUserPattern] = useState(CHALLENGES[0].initialPattern || '')
  const [hintLevel, setHintLevel] = useState(0) // 0: no hints, 1: hint 1, 2: hint 2, 3: full solution

  const challenge = useMemo(() => {
    return CHALLENGES.find((c) => c.id === selectedChallengeId) || CHALLENGES[0]
  }, [selectedChallengeId])

  // Evaluate test cases live against user's regex pattern
  const evaluation = useMemo(() => {
    if (!userPattern.trim()) {
      return {
        allPassed: false,
        results: challenge.testCases.map((tc) => ({
          ...tc,
          passed: false,
          actualMatch: false,
          error: 'Corak kosong',
        })),
      }
    }

    let allPassed = true
    const results = challenge.testCases.map((tc) => {
      const res = safeTest(userPattern, challenge.flags || '', tc.input)
      const passed = res.isValidPattern && res.isMatch === tc.shouldMatch
      if (!passed) allPassed = false
      return {
        ...tc,
        passed,
        actualMatch: res.isMatch,
        isValidPattern: res.isValidPattern,
      }
    })

    return { allPassed, results }
  }, [userPattern, challenge])

  const handleSelectChallenge = (id) => {
    setSelectedChallengeId(id)
    const ch = CHALLENGES.find((c) => c.id === id)
    setUserPattern(ch?.initialPattern || '')
    setHintLevel(0)
  }

  const handleRevealNextHint = () => {
    if (hintLevel < challenge.hints.length) {
      setHintLevel((prev) => prev + 1)
      if (soundEffects.isEnabled()) soundEffects.playBlip(440, 0.05)
    }
  }

  return (
    <div className="flex-1 bg-[#060a13] p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left Column: Challenge Selector */}
        <aside className="space-y-3" aria-label="Challenge List">
          <div className="p-3 rounded-xl bg-[#09101f] border border-[#182640]">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Trophy size={16} className="text-amber-400" />
              <span>Senarai Cabaran ({CHALLENGES.length})</span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Selesaikan ujian bertulis untuk membina keyakinan membina sintaks sendiri.
            </p>
          </div>

          <div className="space-y-1.5">
            {CHALLENGES.map((ch) => {
              const isSelected = ch.id === selectedChallengeId
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChallenge(ch.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#121e36] border-cyan-500/50 glow-cyan-subtle'
                      : 'bg-[#0a1122] hover:bg-[#0f182e] border-[#182640] text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-cyan-300' : 'text-slate-200'
                      }`}
                    >
                      {ch.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#16233a] text-slate-400 uppercase">
                      {ch.difficulty}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Column: Active Challenge Arena */}
        <main className="space-y-5" aria-label="Challenge Workspace">
          {/* Header Card */}
          <section className="p-5 rounded-xl bg-[#091122] border border-[#1b2b4a]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded">
                CABARAN SEMASA
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {challenge.scenario}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {challenge.title}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {challenge.requirement}
            </p>
          </section>

          {/* Pattern Input Box */}
          <section className="p-5 rounded-xl bg-[#080e1c] border border-[#182642]">
            <label htmlFor="challenge-pattern" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Masukkan Corak RegEx Anda (Antara / dan /):
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xl font-mono text-slate-500 select-none">/</span>
              <input
                id="challenge-pattern"
                type="text"
                value={userPattern}
                onChange={(e) => setUserPattern(e.target.value)}
                placeholder="cth: ^\\d{5}$"
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0d1629] border border-[#233555] text-sm sm:text-base font-mono text-cyan-300 focus:border-cyan-400"
                spellCheck={false}
                autoComplete="off"
              />
              <span className="text-xl font-mono text-slate-500 select-none">/{challenge.flags || ''}</span>
            </div>

            {/* Test Suite Summary Banner */}
            <div className="mt-4 flex items-center justify-between gap-2">
              {evaluation.allPassed ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold font-mono glow-emerald-subtle animate-pulse">
                  <Sparkles size={15} className="text-emerald-400" />
                  <span>SEMUA 6 KES UJIAN LULUS! TAHNIAH!</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono">
                  Ujian Berjaya:{' '}
                  <span className="text-cyan-400 font-bold">
                    {evaluation.results.filter((r) => r.passed).length}
                  </span>{' '}
                  / {evaluation.results.length}
                </div>
              )}

              <button
                type="button"
                onClick={() => setUserPattern(challenge.initialPattern || '')}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 font-mono"
              >
                <RotateCcw size={12} />
                <span>Reset Corak</span>
              </button>
            </div>
          </section>

          {/* Test Cases Live Evaluation Table */}
          <section className="p-5 rounded-xl bg-[#091122] border border-[#1a2b49]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Keputusan Kes Ujian Automatik (Live Test Suite)
            </h4>

            <div className="space-y-2">
              {evaluation.results.map((tc, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono ${
                    tc.passed
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                      : 'bg-rose-950/20 border-rose-500/30 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {tc.passed ? (
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-rose-400 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold text-white px-1.5 py-0.5 rounded bg-[#0b1322] border border-[#1e2f4f]">
                        "{tc.input}"
                      </span>
                      <span className="text-slate-400 ml-2 font-sans text-[11px]">
                        ({tc.label})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">
                      Patut:{' '}
                      <strong className={tc.shouldMatch ? 'text-emerald-400' : 'text-rose-400'}>
                        {tc.shouldMatch ? 'SEPADAN' : 'GAGAL'}
                      </strong>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Hasil Anda:{' '}
                      <strong className={tc.actualMatch ? 'text-emerald-400' : 'text-rose-400'}>
                        {tc.actualMatch ? 'SEPADAN' : 'GAGAL'}
                      </strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Progressive Hints Section */}
          <section className="p-5 rounded-xl bg-[#080d19] border border-[#18263f]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Lightbulb size={16} />
                <span>Bantuan Petua Bertingkat (Progressive Hints)</span>
              </div>

              {hintLevel < challenge.hints.length && (
                <button
                  type="button"
                  onClick={handleRevealNextHint}
                  className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors"
                >
                  {hintLevel === 0
                    ? 'Buka Petua 1'
                    : hintLevel === 1
                    ? 'Buka Petua 2'
                    : 'Buka Jawapan Penuh'}
                </button>
              )}
            </div>

            {hintLevel === 0 ? (
              <p className="text-xs text-slate-500 font-sans italic">
                Cuba selesaikan sendiri terlebih dahulu. Sekiranya tersekat, klik "Buka Petua 1" di atas.
              </p>
            ) : (
              <div className="space-y-2">
                {challenge.hints.slice(0, hintLevel).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#101726] border border-amber-500/30 text-xs text-amber-200 font-sans leading-relaxed"
                  >
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
