import { useState, useEffect, useMemo } from 'react'
import {
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Code,
  FileCode2,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { safeTest, tokenizePattern, getTokenCategoryStyle } from '../engine/regexEngine.js'
import { soundEffects } from '../engine/soundEffects.js'

export function CenterPlayground({
  pattern,
  onPatternChange: _onPatternChange,
  onRequestCoachHelp,
}) {
  const [source, setSource] = useState(pattern.source)
  const [flags, setFlags] = useState(pattern.flags || '')
  const [testValue, setTestValue] = useState(pattern.validExamples[0] || '')
  const [activeTokenHover, setActiveTokenHover] = useState(null)
  const [activeTab, setActiveTab] = useState('html') // 'html' or 'js'
  const [copiedRegex, setCopiedRegex] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  // Sync when selected pattern changes from Left panel
  useEffect(() => {
    setSource(pattern.source)
    setFlags(pattern.flags || '')
    setTestValue(pattern.validExamples[0] || '')
    setActiveTokenHover(null)
  }, [pattern])

  // Run live regex test safely
  const testResult = useMemo(() => {
    return safeTest(source, flags, testValue)
  }, [source, flags, testValue])

  // Play audio cues if enabled
  useEffect(() => {
    if (testResult.isValidPattern && soundEffects.isEnabled()) {
      if (testResult.isMatch) soundEffects.playMatchSuccess()
      else soundEffects.playMatchFail()
    }
  }, [testResult.isValidPattern, testResult.isMatch])

  // Tokenize pattern into individual components for breakdown
  const tokens = useMemo(() => {
    if (pattern.source === source && pattern.tokens && pattern.tokens.length > 0) {
      return pattern.tokens.map((t, idx) => ({ ...t, index: idx }))
    }
    return tokenizePattern(source)
  }, [source, pattern])

  // Copy RegEx handler
  const handleCopyRegex = async () => {
    try {
      await navigator.clipboard.writeText(`/${source}/${flags}`)
      setCopiedRegex(true)
      setTimeout(() => setCopiedRegex(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Copy Code snippet handler
  const handleCopyCode = async (codeSnippet) => {
    try {
      await navigator.clipboard.writeText(codeSnippet)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      // Fallback
    }
  }

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger coach
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      onRequestCoachHelp?.(`Terangkan corak ini: /${source}/${flags}`)
    }
  }

  return (
    <main
      className="flex-1 flex flex-col bg-[#070a13] overflow-y-auto"
      onKeyDown={handleKeyDown}
      aria-label="RegEx Interactive Playground"
    >
      {/* Pattern Title & Context Header */}
      <section className="p-4 sm:p-5 border-b border-[#182640] bg-[#090f1e]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded">
                TERPILIH
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {pattern.title}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans">
              {pattern.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyRegex}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#23385d] bg-[#0f1a30] hover:bg-[#152342] text-xs font-medium text-slate-200 transition-colors select-none"
            aria-label="Copy RegEx Expression"
          >
            {copiedRegex ? (
              <>
                <Check size={14} className="text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-cyan-400" />
                <span>Salin RegEx</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* RegEx Editor & Live Evaluation Bar */}
      <section className="p-4 sm:p-5 border-b border-[#182640] bg-[#0a1020]/90">
        <label htmlFor="regex-source" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Corak RegEx (Pattern) & Bendera (Flags):
        </label>

        <div className="flex items-center gap-2">
          {/* Leading Slash */}
          <span className="text-xl font-mono text-slate-500 select-none">/</span>

          {/* Editable Pattern Input */}
          <div className="flex-1 relative">
            <input
              id="regex-source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Masukkan corak RegEx..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e172c] border border-[#233555] text-sm sm:text-base font-mono text-cyan-300 focus:border-cyan-400 focus:bg-[#111c36] transition-colors"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {/* Trailing Slash */}
          <span className="text-xl font-mono text-slate-500 select-none">/</span>

          {/* Flags Input */}
          <div className="w-16 sm:w-20">
            <input
              id="regex-flags"
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.toLowerCase())}
              placeholder="flags (i,m)"
              title="Bendera: 'i' untuk tidak peka huruf besar/kecil, 'g' untuk global"
              className="w-full px-2 py-2.5 rounded-lg bg-[#0e172c] border border-[#233555] text-xs font-mono text-amber-300 focus:border-amber-400 text-center"
              maxLength={5}
            />
          </div>
        </div>

        {/* Live Status Badge / ARIA Live Region */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
          {!testResult.isValidPattern ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
              <AlertTriangle size={15} className="text-rose-400 shrink-0" />
              <span>{testResult.error}</span>
            </div>
          ) : testResult.isMatch ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono glow-emerald-subtle">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
              <span className="font-bold">SEPADAN (MATCH VALID)</span>
              <span className="text-[10px] text-emerald-400/80 font-normal">
                ({testResult.executionTimeMs} ms)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono glow-rose-subtle">
              <XCircle size={15} className="text-rose-400 shrink-0" />
              <span className="font-bold">TIDAK SEPADAN (NO MATCH)</span>
              <span className="text-[10px] text-rose-400/80 font-normal">
                (Nilai ujian gagal memenuhi bentuk corak)
              </span>
            </div>
          )}

          <span className="text-[11px] text-slate-500 hidden sm:inline-block font-mono">
            Petua: Tekan <kbd className="px-1 py-0.5 bg-[#142036] rounded text-slate-300">Ctrl+Enter</kbd> untuk minta Sifu Coach terangkan
          </span>
        </div>
      </section>

      {/* Interactive Token-by-Token Breakdown with Bidirectional Hover */}
      <section className="p-4 sm:p-5 border-b border-[#182640] bg-[#070b16]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Pecahan Simbol (Token-by-Token Visualizer)
            </h3>
          </div>
          <span className="text-[10px] text-slate-500">
            Layangkan tetikus (hover) pada simbol untuk lihat maksudnya
          </span>
        </div>

        {/* Visual Token Strip */}
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#0b1222] border border-[#1b2b4a] mb-4">
          {tokens.map((tok, idx) => {
            const style = getTokenCategoryStyle(tok.category)
            const isHovered = activeTokenHover === idx
            return (
              <button
                key={`${tok.raw}-${idx}`}
                type="button"
                onMouseEnter={() => setActiveTokenHover(idx)}
                onMouseLeave={() => setActiveTokenHover(null)}
                onFocus={() => setActiveTokenHover(idx)}
                onBlur={() => setActiveTokenHover(null)}
                className={`px-2.5 py-1.5 rounded-md font-mono text-xs sm:text-sm font-bold transition-all border ${
                  style.bg
                } ${style.border} ${style.text} ${
                  isHovered
                    ? 'ring-2 ring-cyan-400 scale-105 shadow-lg shadow-cyan-500/20'
                    : 'opacity-90 hover:opacity-100'
                }`}
                title={`Kategori: ${style.label}`}
              >
                {tok.raw}
              </button>
            )
          })}
        </div>

        {/* Plain-Language Sentence Breakdown */}
        {pattern.sentence && (
          <div className="p-3 rounded-lg bg-[#0e172c] border border-[#1e2f4f] text-xs text-slate-300 font-sans leading-relaxed mb-3">
            <span className="font-semibold text-cyan-300 block mb-0.5">
              📖 Terjemahan Bahasa Manusia (Pattern as a Sentence):
            </span>
            {pattern.sentence}
          </div>
        )}

        {/* Token Explanations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {tokens.map((tok, idx) => {
            const style = getTokenCategoryStyle(tok.category)
            const isHovered = activeTokenHover === idx
            return (
              <div
                key={`exp-${idx}`}
                onMouseEnter={() => setActiveTokenHover(idx)}
                onMouseLeave={() => setActiveTokenHover(null)}
                className={`p-2.5 rounded-lg border transition-all text-xs flex items-start gap-2.5 ${
                  isHovered
                    ? 'bg-[#152342] border-cyan-400 glow-cyan-subtle scale-[1.01]'
                    : 'bg-[#09101f] border-[#16233a] hover:border-slate-600'
                }`}
              >
                <code
                  className={`px-2 py-0.5 rounded font-mono font-bold shrink-0 text-xs ${style.badge}`}
                >
                  {tok.raw}
                </code>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-0.5">
                    {style.label}
                  </span>
                  <p className="text-slate-300 leading-snug font-sans">{tok.meaning}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Interactive Value Tester & Worked Examples */}
      <section className="p-4 sm:p-5 border-b border-[#182640] bg-[#090e1c]">
        <label htmlFor="test-input" className="block text-xs font-semibold text-slate-200 mb-1.5">
          Kotak Pengujian Nilai (Test Value):
        </label>
        <div className="relative">
          <input
            id="test-input"
            type="text"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder="Taip teks di sini untuk menguji corak..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0e172b] border border-[#213252] text-sm sm:text-base font-mono text-white focus:border-cyan-400 focus:bg-[#111c34]"
          />
        </div>

        {/* Clickable Valid & Invalid Chips (Pill Selector) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Valid Examples */}
          <div className="p-3 rounded-lg bg-[#0a151b] border border-emerald-500/25">
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-2">
              <CheckCircle2 size={13} />
              Contoh Nilai Yang MESTI Lulus (Valid):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pattern.validExamples.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTestValue(val)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
                    testValue === val
                      ? 'bg-emerald-500/30 border-emerald-400 text-white font-bold'
                      : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                  }`}
                  title="Klik untuk memasukkan contoh ini ke dalam kotak pengujian"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Invalid Examples */}
          <div className="p-3 rounded-lg bg-[#180d14] border border-rose-500/25">
            <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mb-2">
              <XCircle size={13} />
              Contoh Nilai Yang MESTI Gagal (Invalid):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {pattern.invalidExamples.map((val) => {
                const cleanVal = val.split(' ')[0]
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setTestValue(cleanVal)}
                    className={`px-2 py-1 rounded text-xs font-mono transition-colors border ${
                      testValue === cleanVal
                        ? 'bg-rose-500/30 border-rose-400 text-white font-bold'
                        : 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/50'
                    }`}
                    title="Klik untuk memasukkan contoh gagal ini ke dalam kotak pengujian"
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Copy-Ready HTML & JavaScript Implementation Code */}
      <section className="p-4 sm:p-5 border-b border-[#182640] bg-[#070b14]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code size={16} className="text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Kod Sedia Guna Untuk Tugasan (Copy-Ready Implementation)
            </h3>
          </div>

          {/* Code Tab Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0e1628] border border-[#1b2b48]">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'html'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode2 size={13} />
              <span>Borang HTML</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('js')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'js'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code size={13} />
              <span>JavaScript</span>
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative rounded-xl bg-[#090e1b] border border-[#182642] overflow-hidden">
          <div className="px-4 py-2 bg-[#0d1424] border-b border-[#182642] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{activeTab === 'html' ? 'index.html (<input pattern="...">)' : 'validator.js (RegExp.test)'}</span>
            <button
              type="button"
              onClick={() =>
                handleCopyCode(
                  activeTab === 'html' ? pattern.htmlSnippet : pattern.jsSnippet
                )
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#131f38] hover:bg-[#1b2b4e] text-slate-300 text-xs transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy size={12} className="text-cyan-400" />
                  <span>Salin Kod</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{activeTab === 'html' ? pattern.htmlSnippet : pattern.jsSnippet}</code>
          </pre>
        </div>

        {/* Crucial Pedagogical Callout: HTML vs JS anchoring */}
        <div className="mt-3 p-3 rounded-lg bg-[#0e172c] border border-[#1e2f4f] text-xs text-slate-300 font-sans flex items-start gap-2.5">
          <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-cyan-300">
              Perbezaan Penting HTML pattern vs JavaScript RegExp:
            </span>{' '}
            Atribut HTML5 <code className="text-cyan-300">pattern="..."</code> secara automatik mengunci
            keseluruhan nilai dari mula hingga akhir seolah-olah dipagar dengan <code className="text-cyan-300">^(?:...)$</code>.
            Tetapi dalam JavaScript <code className="text-amber-300">pattern.test()</code>, anda <strong>WAJIB</strong> menulis{' '}
            <code className="text-rose-400">^</code> di awal dan <code className="text-rose-400">$</code> di akhir corak supaya aksara asing di luar julat tidak disahkan secara tidak sengaja.
          </div>
        </div>
      </section>

      {/* Real-World Verification Warning Banner */}
      {pattern.formatOnlyWarning && (
        <section className="p-4 sm:p-5 bg-[#140f1a] border-t border-amber-500/30 text-xs text-amber-200 font-sans flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-400 block mb-0.5">
              PERINGATAN PEMBELAJARAN (FORMAT VALIDATION ONLY):
            </span>
            <p className="leading-relaxed">{pattern.formatOnlyWarning}</p>
            <p className="text-[11px] text-amber-300/80 mt-1">
              *Pengesahan di pihak klien (browser) adalah untuk kemudahan pengguna. Pelayan (Java Servlet/Node.js) sentiasa wajib mengesahkan semula setiap input sebelum disimpan ke pangkalan data.
            </p>
          </div>
        </section>
      )}
    </main>
  )
}
