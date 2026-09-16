import { useState, useEffect } from 'react'
import { PATTERNS } from './data/patterns.js'
import { TopNav } from './components/TopNav.jsx'
import { LeftPanelExamples } from './components/LeftPanelExamples.jsx'
import { CenterPlayground } from './components/CenterPlayground.jsx'
import { RightPanelCoach } from './components/RightPanelCoach.jsx'
import { LearningMode } from './components/LearningMode.jsx'
import { ChallengeMode } from './components/ChallengeMode.jsx'
import { LecturerHub } from './components/LecturerHub.jsx'
import { FaqSection } from './components/FaqSection.jsx'
import { PrivacyModal } from './components/PrivacyModal.jsx'
import { IntroCinematic } from './components/IntroCinematic.jsx'
import { NotFoundPage } from './components/NotFoundPage.jsx'
import { Layers, Bot, Code2 } from 'lucide-react'
import './regexSifu.css'

export function RegExSifuApp({ onSwitchToServeStud }) {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('playground') // 'playground' | 'learning' | 'challenges' | 'lecturer' | 'faq' | '404'
  const [selectedPatternId, setSelectedPatternId] = useState(PATTERNS[0].id)
  const [isProjectorMode, setIsProjectorMode] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)

  // Mobile Workspace Active Sub-tab (only used on screens < 1024px)
  const [mobileSubTab, setMobileSubTab] = useState('tester') // 'examples' | 'tester' | 'coach'

  // Cinematic Intro State
  const [showIntro, setShowIntro] = useState(false)

  // Check first-time visit for Intro sequence
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('regex_sifu_intro_seen')
      if (!hasSeen) {
        setShowIntro(true)
      }
    } catch {
      // LocalStorage access fallback
    }
  }, [])

  // Page Title & Meta synchronization
  useEffect(() => {
    const originalTitle = document.title
    document.title = 'RegEx Sifu // Bengkel Pengesahan Borang Web Pelajar (DFP50283)'
    return () => {
      document.title = originalTitle
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    try {
      localStorage.setItem('regex_sifu_intro_seen', 'true')
    } catch {
      // LocalStorage fallback
    }
  }

  const handleReplayIntro = () => {
    setShowIntro(true)
  }

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('regex_sifu_intro_seen')
      localStorage.removeItem('regex_sifu_sound')
      window.location.reload()
    } catch {
      window.location.reload()
    }
  }

  // Selected pattern object
  const currentPattern =
    PATTERNS.find((p) => p.id === selectedPatternId) || PATTERNS[0]

  const handleSelectPattern = (id) => {
    setSelectedPatternId(id)
    setMobileSubTab('tester') // On mobile, automatically bring student to the tester view!
  }

  const handleApplyCoachPattern = (_newPatternStr) => {
    setSelectedPatternId(PATTERNS[0].id)
    setActiveTab('playground')
    setMobileSubTab('tester')
  }

  return (
    <div
      className={`regex-sifu-theme min-h-screen flex flex-col bg-[#070a12] text-slate-100 antialiased ${
        isProjectorMode ? 'projector-mode' : ''
      }`}
    >
      {/* Optional Skippable Cinematic Cyberpunk Introduction */}
      {showIntro && <IntroCinematic onComplete={handleIntroComplete} />}

      {/* Top Application Navigation */}
      <TopNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'instant' })
        }}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={() => setIsProjectorMode((prev) => !prev)}
        onReplayIntro={handleReplayIntro}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onSwitchToServeStud={onSwitchToServeStud}
      />

      {/* View Router */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'playground' && (
          <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[280px_1fr_340px] xl:grid-cols-[300px_1fr_360px] min-h-0">
            {/* Desktop Left Panel (Example Library) */}
            <LeftPanelExamples
              patterns={PATTERNS}
              selectedPatternId={selectedPatternId}
              onSelectPattern={handleSelectPattern}
              className={`h-[calc(100vh-53px)] ${
                mobileSubTab === 'examples' ? 'flex' : 'hidden lg:flex'
              }`}
            />

            {/* Center Panel (Live Playground) */}
            <div
              className={`flex-1 flex flex-col min-h-0 h-[calc(100vh-53px)] ${
                mobileSubTab === 'tester' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <CenterPlayground
                pattern={currentPattern}
                onRequestCoachHelp={() => setMobileSubTab('coach')}
              />
            </div>

            {/* Right Panel (Sifu Coach) */}
            <RightPanelCoach
              onApplyPattern={handleApplyCoachPattern}
              className={`h-[calc(100vh-53px)] ${
                mobileSubTab === 'coach' ? 'flex' : 'hidden lg:flex'
              }`}
            />

            {/* Mobile Bottom Sticky Mode Bar (Only visible on small devices) */}
            <nav
              className="lg:hidden sticky bottom-0 z-30 border-t border-[#1a263f] bg-[#070b15]/95 backdrop-blur px-2 py-1.5 flex items-center justify-around"
              aria-label="Mobile Navigation Switcher"
            >
              <button
                type="button"
                onClick={() => setMobileSubTab('examples')}
                className={`min-h-[44px] min-w-[44px] px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'examples'
                    ? 'text-cyan-400 bg-cyan-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers size={16} />
                <span className="text-[10px] mt-0.5">Contoh</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSubTab('tester')}
                className={`min-h-[44px] min-w-[44px] px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'tester'
                    ? 'text-cyan-400 bg-cyan-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 size={16} />
                <span className="text-[10px] mt-0.5">Penguji</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileSubTab('coach')}
                className={`min-h-[44px] min-w-[44px] px-3 py-1 flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                  mobileSubTab === 'coach'
                    ? 'text-cyan-400 bg-cyan-950/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot size={16} />
                <span className="text-[10px] mt-0.5">Sifu Coach</span>
              </button>
            </nav>
          </div>
        )}

        {activeTab === 'learning' && (
          <LearningMode onJumpToPlayground={() => setActiveTab('playground')} />
        )}

        {activeTab === 'challenges' && (
          <ChallengeMode onJumpToPlayground={() => setActiveTab('playground')} />
        )}

        {activeTab === 'lecturer' && (
          <LecturerHub
            isProjectorMode={isProjectorMode}
            onToggleProjectorMode={() => setIsProjectorMode((p) => !p)}
            onResetProgress={handleResetProgress}
          />
        )}

        {activeTab === 'faq' && <FaqSection />}

        {activeTab === '404' && (
          <NotFoundPage onGoHome={() => setActiveTab('playground')} />
        )}
      </div>

      {/* Privacy Guarantee Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  )
}
