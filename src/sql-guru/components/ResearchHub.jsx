import {
  ExternalLink,
  Video,
  BookOpen,
  Award,
  Sparkles,
  Users,
  GraduationCap,
  BarChart3,
} from 'lucide-react'
import { RESEARCH_STUDY_INFO } from '../data/sqlCurriculum.js'

export function ResearchHub() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero Banner: Invitation to Usability Study */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0c182a] via-[#12233f] to-[#1a335a] border border-[#234370] p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              IUCEL 2025 · UTEM
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Universiti Teknologi PETRONAS
            </span>
          </div>

          <a
            href={RESEARCH_STUDY_INFO.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Sparkles size={14} />
            <span>Sertai Soal Selidik (Google Forms)</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
            INTEGRATING GENERATIVE AI INTO SQL LEARNING: A USABILITY STUDY OF A PROMPT-BASED WEB TUTOR
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            Oleh <strong className="text-amber-300">Norshadila Ahmad Badela</strong> &{' '}
            <strong className="text-amber-300">Dr. Anton Satria Prabuwono</strong> (Universiti Teknologi PETRONAS, Malaysia).
          </p>
        </div>

        <p className="text-xs text-slate-300/90 leading-relaxed bg-[#0a1220]/70 p-3.5 rounded-xl border border-[#1b2f4d]">
          Anda dijemput untuk menyertai penilaian kebolehgunaan (usability evaluation) tutor AI berasaskan web ini yang direka khas bagi menyokong pembelajaran dan pengajaran SQL interaktif. Maklum balas anda akan membantu meningkatkan kualiti alatan AI dalam pendidikan data negara.
        </p>
      </div>

      {/* 3 Quick Action Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <a
          href={RESEARCH_STUDY_INFO.referenceAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-[#0d1726] border border-[#1e314f] hover:border-emerald-500/50 transition-all flex flex-col justify-between group space-y-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <BookOpen size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300">
              Cuba AI SQL Tutor
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Layari laman rasmi e-Book SQL AI Tutor untuk merasai pengalaman asal.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            Buka e-Book <ExternalLink size={12} />
          </span>
        </a>

        {/* Step 2 */}
        <a
          href={RESEARCH_STUDY_INFO.demoVideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-[#0d1726] border border-[#1e314f] hover:border-cyan-500/50 transition-all flex flex-col justify-between group space-y-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <Video size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300">
              Tonton Video Demo
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lihat rakaman demonstrasi fungsi semakan query dan maklum balas segera LLM di YouTube.
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
            Tonton di YouTube <ExternalLink size={12} />
          </span>
        </a>

        {/* Step 3 */}
        <a
          href={RESEARCH_STUDY_INFO.surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-xl bg-[#0d1726] border border-amber-500/40 hover:border-amber-400 transition-all flex flex-col justify-between group space-y-3"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="size-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <Award size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300">
              Lengkapkan Borang Soal Selidik
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kongsi penilaian anda mengenai kebergunaan, kemudahan, dan interaktiviti sistem.
            </p>
          </div>
          <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
            Isi Google Form <ExternalLink size={12} />
          </span>
        </a>
      </div>

      {/* Table 1 from Paper: Usability Evaluation Findings */}
      <div className="rounded-xl bg-[#0a1220] border border-[#1e314f] overflow-hidden">
        <div className="p-4 bg-[#0e1a2d] border-b border-[#1e314f] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Dapatan Kajian: Skor Penilaian Kebolehgunaan TAM (N = 128)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            88 Pelajar · 40 Pensyarah · Cronbach &gt; 0.70
          </span>
        </div>

        <div className="overflow-x-auto sql-guru-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#182840] bg-[#0c1626] text-slate-400 uppercase font-mono text-[10px]">
                <th className="px-4 py-2.5">Konstruk TAM</th>
                <th className="px-4 py-2.5 text-center">Min (Mean)</th>
                <th className="px-4 py-2.5 text-center">Sisihan Piawai (SD)</th>
                <th className="px-4 py-2.5">Impak Pedagogi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#15233b]">
              {RESEARCH_STUDY_INFO.tamConstructs.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#101c2f] transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-slate-200">
                    {row.name}
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono font-bold text-emerald-400">
                    {row.score.toFixed(2)} / 5.00
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-slate-400">
                    {row.std.toFixed(4)}
                  </td>
                  <td className="px-4 py-2.5 text-slate-300 text-[11px] leading-relaxed">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alignment with National Blueprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0a1220] border border-[#1e314f] space-y-2">
          <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
            <GraduationCap size={15} />
            <span>Penyelarasan Dasar Pendidikan Negara</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            {RESEARCH_STUDY_INFO.nationalAlignment.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-[#0a1220] border border-[#1e314f] space-y-2">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Users size={15} />
            <span>Pernyataan Kerahsiaan & Etika Penyelidikan</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Penyertaan adalah secara sukarela. Semua maklum balas yang dikumpulkan adalah sulit dan digunakan semata-mata untuk tujuan penyelidikan akademik dan pembangunan modul AI pembelajaran tinggi.
          </p>
        </div>
      </div>
    </div>
  )
}
