import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, FastForward, Terminal, Sparkles } from 'lucide-react'
import { soundEffects } from '../engine/soundEffects.js'

export function IntroCinematic({ onComplete }) {
  const [phase, setPhase] = useState(0) // 0: init, 1: tokens, 2: diagnostic, 3: coalescence, 4: identity, 5: finish
  const [soundOn, setSoundOn] = useState(soundEffects.isEnabled())
  const [diagnosticText, setDiagnosticText] = useState('BOOT: DOJO KERNEL v2.4')
  const isReducedMotion = useRef(false)

  const fragmentedTokens = ['^', '\\d', '[A-Z]', '{2,5}', '+', '?', '$']

  const handleSkip = useCallback(() => {
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mediaQuery.matches) {
        isReducedMotion.current = true
        // If reduced motion, complete with fast logo fade under 450ms
        const timer = setTimeout(() => {
          onComplete()
        }, 400)
        return () => clearTimeout(timer)
      }
    }

    // Keyboard listener for ESC to skip
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Play initial sound blip if user previously enabled audio
    if (soundEffects.isEnabled()) {
      soundEffects.playCyberBoot()
    }

    // Frame timeline (Total: ~4.8 seconds)
    const t1 = setTimeout(() => {
      setPhase(1)
      setDiagnosticText('INITIALIZING TOKEN PARSER...')
    }, 900)

    const t2 = setTimeout(() => {
      setPhase(2)
      setDiagnosticText('LOADING PATTERN KNOWLEDGE')
    }, 1900)

    const t3 = setTimeout(() => {
      setPhase(3)
      setDiagnosticText('SYNTHESIZING MALAYSIAN MOBILE AST...')
      if (soundEffects.isEnabled()) soundEffects.playMatchSuccess()
    }, 3000)

    const t4 = setTimeout(() => {
      setPhase(4)
      setDiagnosticText('PATTERN DOJO READY')
    }, 4000)

    const t5 = setTimeout(() => {
      onComplete()
    }, 4900)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [onComplete, handleSkip])

  const toggleAudio = () => {
    const next = soundEffects.toggleSound()
    setSoundOn(next)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070d] text-slate-100 overflow-hidden select-none font-mono"
      role="region"
      aria-label="RegEx Sifu Cinematic Introduction"
    >
      {/* Subtle Scanlines & Horizontal Light Beam */}
      <div className="absolute inset-0 pointer-events-none sifu-scanlines opacity-40" />
      <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none animate-sifu-beam" />

      {/* Top Controls: Audio & Skip Button */}
      <header className="absolute top-4 inset-x-4 flex items-center justify-between z-20 text-xs">
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-colors"
          aria-label={soundOn ? 'Mute audio' : 'Unmute audio'}
        >
          {soundOn ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} className="text-slate-500" />}
          <span>{soundOn ? 'Audio: AKTIF' : 'Audio: BISU (Default)'}</span>
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-medium transition-all group"
          autoFocus
        >
          <span>Langkau Pengenalan (Skip)</span>
          <FastForward size={14} className="group-hover:translate-x-0.5 transition-transform" />
          <kbd className="ml-1 px-1 py-0.5 bg-cyan-900/80 rounded text-[10px] text-cyan-200">Esc</kbd>
        </button>
      </header>

      {/* Central Cyber Stage */}
      <div className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center">
        {/* Diagnostic Terminal Status Line */}
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs text-slate-400 mb-8">
          <Terminal size={12} className="text-cyan-400" />
          <span className="tracking-widest uppercase text-cyan-300">{diagnosticText}</span>
          <span className="inline-block w-2 h-3 bg-cyan-400 animate-pulse ml-1" />
        </div>

        {/* Phase 0 & 1: Fragmented Tokens Floating */}
        {phase <= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap my-4"
          >
            {fragmentedTokens.map((tok, idx) => (
              <motion.span
                key={tok}
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.6, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: idx * 0.1,
                }}
                className="px-3 py-2 rounded border border-slate-700/60 bg-slate-900/80 text-cyan-400 text-xl font-bold tracking-wider"
              >
                {tok}
              </motion.span>
            ))}
          </motion.div>
        )}

        {/* Phase 2: Diagnostic Rapid Green/Red Flash */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col gap-2 my-2"
          >
            <div className="p-3 rounded border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 text-sm flex items-center justify-between">
              <span className="font-semibold">TEST: 012-3456789</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold uppercase">
                [VALID FORMAT]
              </span>
            </div>
            <div className="p-3 rounded border border-rose-500/40 bg-rose-950/20 text-rose-400 text-sm flex items-center justify-between">
              <span className="font-semibold">TEST: 012-ABC</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-xs font-bold uppercase">
                [INVALID CHARACTERS]
              </span>
            </div>
            <div className="p-3 rounded border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 text-sm flex items-center justify-between">
              <span className="font-semibold">TEST: +60198765432</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold uppercase">
                [VALID MALAYSIA PREFIX]
              </span>
            </div>
          </motion.div>
        )}

        {/* Phase 3: Coalescence into Malaysian Mobile Pattern */}
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="my-4 w-full"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Struktur Pola Tersusun:
            </p>
            <div className="p-4 rounded-lg bg-slate-900/90 border border-cyan-500/50 glow-cyan-subtle text-cyan-300 text-lg sm:text-xl font-bold tracking-widest overflow-x-auto whitespace-nowrap">
              <span className="text-rose-400">^</span>
              <span className="text-violet-400">(?:</span>
              <span className="text-amber-400">\+?60</span>
              <span className="text-violet-400">|</span>
              <span className="text-amber-400">0</span>
              <span className="text-violet-400">)</span>
              <span className="text-emerald-400">1</span>
              <span className="text-cyan-400">[0-9]</span>
              <span className="text-amber-400">-?</span>
              <span className="text-amber-400">\d{'{7,8}'}</span>
              <span className="text-rose-400">$</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              (Malaysian Mobile Phone: 01x-xxxxxxx / +601xxxxxxxx)
            </p>
          </motion.div>
        )}

        {/* Phase 4: Identity Resolution */}
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="my-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles size={12} className="text-amber-400" />
              <span>DOJO PEMBELAJARAN REGEX MALAYSIA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              <span className="text-cyan-400">RegEx</span>
              <span>Sifu</span>
              <span className="text-xs font-normal text-slate-500 border border-slate-700 px-1.5 py-0.5 rounded">
                正则师傅
              </span>
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-md font-sans">
              Kuasai sintaks, fahami setiap simbol, dan bina borang web dengan yakin.
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <footer className="absolute bottom-6 inset-x-8 max-w-xl mx-auto flex flex-col items-center gap-2">
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-amber-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4.8, ease: 'linear' }}
          />
        </div>
        <span className="text-[11px] text-slate-500">
          Memulakan sesi belajar anda... Tekan <kbd className="text-slate-400 font-bold">Esc</kbd> untuk langkau
        </span>
      </footer>
    </div>
  )
}
