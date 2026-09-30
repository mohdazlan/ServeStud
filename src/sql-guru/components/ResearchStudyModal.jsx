import { X, Sparkles, ExternalLink, Video } from 'lucide-react'
import { RESEARCH_STUDY_INFO } from '../data/sqlCurriculum.js'

export function ResearchStudyModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-[#0b1320] border border-[#1e314f] shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#0e1e36] to-[#152a4a] border-b border-[#1e314f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              Jemputan Penilaian Kebolehgunaan AI SQL Tutor
            </h3>
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
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 leading-relaxed space-y-1">
            <strong className="block text-emerald-300">
              Kajian Usability Penyelidikan UTP (IUCEL 2025 / UTEM):
            </strong>
            <p className="text-[11px] text-slate-300">
              Anda dijemput untuk menyertai kajian kebolehgunaan web-based AI tutor yang direka untuk menyokong pembelajaran dan pengajaran SQL secara interaktif.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200">Tujuan Kajian:</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Mengumpul maklum balas mengenai kebergunaan (*usefulness*), kemudahan penggunaan (*ease of use*), interaktiviti (*interactivity*), dan nilai pedagogi (*educational value*) sistem AI tutor ini.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-amber-300">Langkah-langkah Penyertaan:</h4>
            <div className="space-y-2">
              <a
                href={RESEARCH_STUDY_INFO.referenceAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0e1a2d] border border-[#1e314f] hover:border-emerald-500/50 flex items-center justify-between text-slate-300 group"
              >
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Cuba AI SQL Tutor Asal</span>
                </div>
                <ExternalLink size={12} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={RESEARCH_STUDY_INFO.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0e1a2d] border border-[#1e314f] hover:border-cyan-500/50 flex items-center justify-between text-slate-300 group"
              >
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Tonton Video Demonstrasi (YouTube)</span>
                </div>
                <ExternalLink size={12} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={RESEARCH_STUDY_INFO.surveyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 hover:border-amber-300 flex items-center justify-between text-amber-200 font-semibold group"
              >
                <div className="flex items-center gap-2">
                  <span className="size-5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Lengkapkan Borang Soal Selidik (Google Forms)</span>
                </div>
                <ExternalLink size={12} className="text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-[#070e17] p-3 rounded-lg border border-[#182840]">
            📌 <em>Penyertaan adalah sukarela. Semua maklumat adalah dirahsiakan dan hanya digunakan untuk penyelidikan akademik. Terima kasih atas masa dan input berharga anda!</em>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-[#0e1a2d] border-t border-[#1e314f] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-[#142236] hover:bg-[#1a2d48] text-slate-300 text-xs font-medium transition-colors"
          >
            Tutup
          </button>

          <a
            href={RESEARCH_STUDY_INFO.surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <Sparkles size={13} />
            <span>Buka Soal Selidik Sekarang</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
