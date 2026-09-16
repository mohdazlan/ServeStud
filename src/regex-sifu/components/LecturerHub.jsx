import { useState } from 'react'
import {
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Monitor,
  FileText,
} from 'lucide-react'
import { PATTERNS } from '../data/patterns.js'

export function LecturerHub({
  isProjectorMode,
  onToggleProjectorMode,
  onResetProgress,
}) {
  const [selectedPatternId, setSelectedPatternId] = useState('my-mobile-phone')
  const [copiedBrief, setCopiedBrief] = useState(false)

  const currentPattern =
    PATTERNS.find((p) => p.id === selectedPatternId) || PATTERNS[0]

  const exerciseBrief = `TUGASAN AMALI WEB (DFP50283 / HTML & JAVASCRIPT REGEX):
Topik: Pengesahan Medan ${currentPattern.title}

1. PENERANGAN MASALAH:
Pelajar dikehendaki membina borang HTML berserta atribut 'pattern' dan skrip JavaScript untuk mengesahkan:
"${currentPattern.summary}"

2. CONTOH NILAI YANG MESTI LULUS:
${currentPattern.validExamples.map((v) => `  - ${v}`).join('\n')}

3. CONTOH NILAI YANG MESTI GAGAL:
${currentPattern.invalidExamples.map((v) => `  - ${v}`).join('\n')}

4. SOALAN REFLEKSI:
a) Mengapa sauh ^ dan $ penting dalam skrip RegExp.test() JavaScript?
b) Apakah perbezaan antara pengesahan format borang dengan semakan kewujudan sebenar?`

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(exerciseBrief)
      setCopiedBrief(true)
      setTimeout(() => setCopiedBrief(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex-1 bg-[#060a13] p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="border-b border-[#182640] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-mono">
                PUSAT PENSYARAH
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Alat Pengajaran & Lembaran Aktiviti Kelas
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Bina latihan kelas, cetak lembaran kerja amali, dan gunakan Mod Projektor untuk paparan dewan kuliah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleProjectorMode}
              className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors font-medium ${
                isProjectorMode
                  ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                  : 'border-[#223555] bg-[#0c1628] hover:bg-[#13223f] text-slate-300'
              }`}
            >
              <Monitor size={14} className={isProjectorMode ? 'text-amber-400' : ''} />
              <span>{isProjectorMode ? 'Mod Projektor: AKTIF' : 'Aktifkan Projektor'}</span>
            </button>
          </div>
        </header>

        {/* 1. Quick Lesson Activity Generator */}
        <section className="p-5 rounded-xl bg-[#091122] border border-[#1b2b4a] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles size={16} />
              <span>Penjana Ringkasan Aktiviti Kelas (Activity Generator)</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Pilih pola untuk jana tugasan
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label htmlFor="pattern-select" className="text-xs font-semibold text-slate-300 shrink-0">
              Pilih Pola Amali:
            </label>
            <select
              id="pattern-select"
              value={selectedPatternId}
              onChange={(e) => setSelectedPatternId(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-[#0e172a] border border-[#213352] text-xs font-mono text-cyan-300 focus:border-cyan-400"
            >
              {PATTERNS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.category})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCopyBrief}
              className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              {copiedBrief ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Salin Tugasan</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Exercise Brief Preview */}
          <div className="relative rounded-lg bg-[#070d1a] border border-[#172540] p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            {exerciseBrief}
          </div>
        </section>

        {/* 2. Printable Worksheet Exporter */}
        <section className="p-5 rounded-xl bg-[#080e1c] border border-[#182642] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <FileText size={16} />
              <span>Lembaran Kerja Amali (Printable Worksheet)</span>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer size={14} />
              <span>Cetak / Eksport PDF</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Hasilkan lembaran kerja ringkas bertaraf kelas untuk diedarkan kepada pelajar semasa sesi tutorial atau kuiz bilik kuliah.
          </p>

          {/* Hidden Printable Container on Standard Screen, Visible on Print */}
          <div id="printable-worksheet" className="hidden print:block font-sans text-black">
            <h1 className="text-xl font-bold border-b pb-2 mb-4">
              JABATAN TEKNOLOGI MAKLUMAT DAN KOMUNIKASI — LEMBARAN AMALI REGEX
            </h1>
            <p className="text-sm mb-2"><strong>Nama Pelajar:</strong> ___________________________________</p>
            <p className="text-sm mb-2"><strong>No. Pendaftaran (Matrik):</strong> ______________________ <strong>Kelas:</strong> _________</p>
            <p className="text-sm mb-4"><strong>Topik:</strong> Pengesahan Format Borang Web Menggunakan RegEx ({currentPattern.title})</p>

            <h2 className="text-base font-bold mt-4 mb-2">BAHAGIAN A: REKA BENTUK CORAK</h2>
            <p className="text-sm mb-2">Bina corak Regular Expression untuk mengesahkan keperluan berikut:</p>
            <p className="text-sm italic p-2 border bg-gray-50 mb-4">{currentPattern.summary}</p>
            <p className="text-sm mb-6">Jawapan Corak Anda: / ________________________________________________ /</p>

            <h2 className="text-base font-bold mt-4 mb-2">BAHAGIAN B: JADUAL UJIAN NILAI</h2>
            <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left">Nilai Masukan Ujian</th>
                  <th className="border border-gray-400 p-2 text-left">Jangkaan (Sah / Tidak)</th>
                  <th className="border border-gray-400 p-2 text-left">Catatan Sebab</th>
                </tr>
              </thead>
              <tbody>
                {currentPattern.validExamples.slice(0, 2).map((ex, i) => (
                  <tr key={i}>
                    <td className="border border-gray-400 p-2 font-mono">{ex}</td>
                    <td className="border border-gray-400 p-2">Mesti Sah (Lulus)</td>
                    <td className="border border-gray-400 p-2"></td>
                  </tr>
                ))}
                {currentPattern.invalidExamples.slice(0, 2).map((ex, i) => (
                  <tr key={i}>
                    <td className="border border-gray-400 p-2 font-mono">{ex}</td>
                    <td className="border border-gray-400 p-2">Mesti Gagal</td>
                    <td className="border border-gray-400 p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-base font-bold mt-4 mb-2">BAHAGIAN C: INTEGRASI HTML & JAVASCRIPT</h2>
            <p className="text-sm mb-2">Tuliskan tag &lt;input&gt; HTML yang lengkap dengan atribut 'pattern':</p>
            <div className="h-20 border border-dashed border-gray-400 p-2 mb-4 font-mono text-xs"></div>
          </div>
        </section>

        {/* 3. Classroom Administration & Reset Progress */}
        <section className="p-5 rounded-xl bg-[#09101d] border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <RotateCcw size={16} />
            <span>Pengurusan Sesi & Reset Kemajuan Pelajar</span>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Sekiranya komputer makmal berkongsi antara kohort pelajar berbeza, gunakan butang ini untuk membersihkan semua sejarah kuiz dan intro tersimpan dalam LocalStorage.
          </p>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Adakah anda pasti mahu mereset semua kemajuan dan tetapan pelajar pada peranti ini?')) {
                onResetProgress?.()
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Reset Semua Sejarah & Kemajuan Tempatan</span>
          </button>
        </section>
      </div>
    </div>
  )
}
