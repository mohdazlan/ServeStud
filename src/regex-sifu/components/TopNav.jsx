import { useState } from 'react'
import {
  Code2,
  BookOpen,
  Trophy,
  GraduationCap,
  HelpCircle,
  Shield,
  RotateCcw,
  Monitor,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { soundEffects } from '../engine/soundEffects.js'

export function TopNav({
  activeTab,
  onSelectTab,
  isProjectorMode,
  onToggleProjectorMode,
  onReplayIntro,
  onOpenPrivacy,
  onSwitchToServeStud,
}) {
  const [soundOn, setSoundOn] = useState(soundEffects.isEnabled())

  const handleToggleSound = () => {
    const next = soundEffects.toggleSound()
    setSoundOn(next)
  }

  const navItems = [
    { id: 'playground', label: 'Dojo Playground', icon: Code2, badge: 'Utama' },
    { id: 'learning', label: 'Mod Belajar (Lessons)', icon: BookOpen, count: '10' },
    { id: 'challenges', label: 'Cabaran (Challenges)', icon: Trophy, count: '7' },
    { id: 'lecturer', label: 'Pusat Pensyarah', icon: GraduationCap },
    { id: 'faq', label: 'Panduan & FAQ', icon: HelpCircle },
  ]

  return (
    <header className="border-b border-[#1a253d] bg-[#070b15]/95 backdrop-blur sticky top-0 z-30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 select-none">
      {/* Brand Identity & Sub-app Switcher */}
      <div className="flex items-center gap-3">
        {onSwitchToServeStud && (
          <button
            type="button"
            onClick={onSwitchToServeStud}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#233555] bg-[#0d1627] hover:bg-[#15233e] text-slate-300 text-xs font-medium transition-colors"
            title="Kembali ke Modul Topic 1: Java Web Technologies"
          >
            <BookOpen size={13} className="text-amber-400" />
            <span className="hidden sm:inline">ServeStud: Java Web</span>
            <span className="sm:hidden">Java</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold sifu-mono text-sm glow-cyan-subtle">
            .*
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                <span className="text-cyan-400">RegEx</span> Sifu
              </h1>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                50283
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5 hidden sm:block">
              Bengkel Pengesahan Borang Web Pelajar Politeknik & Kolej
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1 overflow-x-auto py-1 max-w-full" aria-label="Main Navigation">
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 glow-cyan-subtle'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111c33]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="hidden md:inline-block text-[9px] px-1 rounded bg-cyan-400/20 text-cyan-300 font-mono">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="hidden md:inline-block text-[10px] px-1 rounded bg-slate-800 text-slate-300 font-mono">
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Utilities: Projector Mode, Intro Replay, Sound, Privacy */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onToggleProjectorMode}
          className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
            isProjectorMode
              ? 'border-amber-500/60 bg-amber-500/20 text-amber-300'
              : 'border-slate-800 bg-[#0d1424] hover:bg-[#15213b] text-slate-400'
          }`}
          title="Mod Projektor (Fon Lebih Besar untuk Bilik Kuliah)"
          aria-label="Toggle Projector Mode"
        >
          <Monitor size={14} className={isProjectorMode ? 'text-amber-400' : ''} />
          <span className="hidden lg:inline">Projektor</span>
        </button>

        <button
          type="button"
          onClick={onReplayIntro}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-slate-800 bg-[#0d1424] hover:bg-[#15213b] text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
          title="Ulang tayang Pengenalan Cyberpunk"
          aria-label="Replay intro animation"
        >
          <RotateCcw size={13} />
          <span className="hidden xl:inline">Ulang Intro</span>
        </button>

        <button
          type="button"
          onClick={handleToggleSound}
          className="p-1.5 rounded-lg border border-slate-800 bg-[#0d1424] hover:bg-[#15213b] text-slate-400 hover:text-slate-200 text-xs transition-colors"
          title={soundOn ? 'Bunyi Aktif' : 'Bunyi Bisu (Muted)'}
          aria-label={soundOn ? 'Mute audio' : 'Enable sound'}
        >
          {soundOn ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} />}
        </button>

        <button
          type="button"
          onClick={onOpenPrivacy}
          className="p-1.5 rounded-lg border border-slate-800 bg-[#0d1424] hover:bg-[#15213b] text-slate-400 hover:text-slate-200 text-xs transition-colors"
          title="Privasi & Jaminan Tanpa Penjejakan"
          aria-label="View privacy guarantee"
        >
          <Shield size={14} className="text-emerald-400" />
        </button>
      </div>
    </header>
  )
}
