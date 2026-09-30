import { useState } from 'react'
import {
  Database,
  BookOpen,
  Sparkles,
  FileCheck,
  Settings,
  Volume2,
  VolumeX,
  ExternalLink,
  Bookmark,
} from 'lucide-react'
import { soundEffects } from '../engine/soundEffects.js'
import { RESEARCH_STUDY_INFO } from '../data/sqlCurriculum.js'

export function TopNav({
  activeTab,
  onSelectTab,
  onOpenSurvey,
  onOpenSettings,
  onSwitchToServeStud,
  onSwitchToRegExSifu,
  onSwitchToTopic3,
}) {
  const [soundOn, setSoundOn] = useState(soundEffects.isEnabled())

  const handleToggleSound = () => {
    const next = soundEffects.toggleSound()
    setSoundOn(next)
  }

  const navItems = [
    { id: 'playground', label: 'Tutor Interaktif & Latihan', icon: Database, badge: 'Utama' },
    { id: 'cheatsheet', label: 'SQL Cheat Sheet & Rujukan', icon: Bookmark },
    { id: 'research', label: 'Kajian UTP (IUCEL 2025)', icon: FileCheck, badge: 'Paper' },
  ]

  return (
    <header className="border-b border-[#1e314f] bg-[#070e17]/95 backdrop-blur sticky top-0 z-30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand Identity & Sub-app Switchers */}
      <div className="flex items-center gap-2.5">
        {/* Quick Hub Navigation */}
        <div className="flex items-center gap-1.5">
          {onSwitchToServeStud && (
            <button
              type="button"
              onClick={onSwitchToServeStud}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#233857] bg-[#0d1726] hover:bg-[#16253c] text-slate-300 text-xs font-medium transition-colors"
              title="Kembali ke Portal ServeStud"
            >
              <BookOpen size={13} className="text-amber-400" />
              <span className="hidden sm:inline">ServeStud</span>
            </button>
          )}

          {onSwitchToRegExSifu && (
            <button
              type="button"
              onClick={onSwitchToRegExSifu}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#1b3b4a] bg-[#091b26] hover:bg-[#102b3c] text-cyan-300 text-xs font-medium transition-colors"
              title="Buka RegEx Sifu Dojo"
            >
              <span className="font-mono text-cyan-400 font-bold text-xs">.*</span>
              <span className="hidden md:inline">RegEx Sifu</span>
            </button>
          )}
        </div>

        {/* Brand Title */}
        <div className="flex items-center gap-2 pl-1 border-l border-[#1e314f]">
          <div className="size-8 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold sql-mono text-sm glow-emerald-subtle">
            <Database size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight leading-none flex items-center gap-1">
                <span className="text-emerald-400">SQL</span>-Guru
                <Sparkles size={13} className="text-amber-400" />
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono">
                AI Tutor
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">
              GenAI Prompt-Based Web Tutor · UTP & DFP50283
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full" aria-label="SQL-Guru Navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 glow-emerald-subtle'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#101c2e]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="hidden md:inline-block text-[9px] px-1 rounded bg-emerald-400/20 text-emerald-300 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Right Tools: Survey CTA, Sound, AI Settings */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Direct Link to Usability Evaluation Survey */}
        <a
          href={RESEARCH_STUDY_INFO.surveyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
          title="Sertai Kajian Kebolehgunaan TAM (Usability Survey)"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span className="hidden lg:inline">Borang Soal Selidik Kajian</span>
          <span className="lg:hidden">Survei TAM</span>
          <ExternalLink size={11} className="opacity-70" />
        </a>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg border border-[#1e314f] bg-[#0d1726] hover:bg-[#16253c] text-slate-400 hover:text-slate-200 text-xs transition-colors"
          title={soundOn ? 'Audio Aktif' : 'Audio Bisu'}
          aria-label="Toggle Sound"
        >
          {soundOn ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} />}
        </button>

        {/* AI & Model Settings */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg border border-[#1e314f] bg-[#0d1726] hover:bg-[#16253c] text-slate-400 hover:text-slate-200 text-xs transition-colors"
          title="Tetapan API LLM & Model AI"
          aria-label="AI Settings"
        >
          <Settings size={14} className="text-slate-300 hover:text-white" />
        </button>
      </div>
    </header>
  )
}
