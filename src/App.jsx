import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from './lib/sections.js'
import { ProgressProvider, useProgress } from './hooks/useProgress.jsx'
import { Sidebar, TabBar } from './components/SectionNav.jsx'
import { ProgressBar } from './components/ProgressBar.jsx'
import { MetaphorMapDialog } from './components/MetaphorMapDialog.jsx'
import { SectionPlaceholder } from './components/SectionPlaceholder.jsx'
import Section0Welcome from './sections/Section0Welcome.jsx'
import Section1Web from './sections/Section1Web.jsx'
import Section2StaticVsDynamic from './sections/Section2StaticVsDynamic.jsx'
import Section3JavaEE from './sections/Section3JavaEE.jsx'
import Section4Servlet from './sections/Section4Servlet.jsx'
import Section5ServletAPI from './sections/Section5ServletAPI.jsx'
import { lazy, Suspense } from 'react'

const RegExSifuApp = lazy(() =>
  import('./regex-sifu/RegExSifuApp.jsx').then((m) => ({ default: m.RegExSifuApp }))
)

// Built sections register here; the rest render an honest placeholder.
const SECTION_COMPONENTS = {
  0: Section0Welcome,
  1: Section1Web,
  2: Section2StaticVsDynamic,
  3: Section3JavaEE,
  4: Section4Servlet,
  5: Section5ServletAPI,
}

function MobileHeader({ onOpenRegExSifu }) {
  return (
    <header className="border-b border-hairline bg-paper-aged px-4 py-3 lg:hidden flex items-center justify-between gap-2">
      <div>
        <p className="text-xs text-ink-muted">DFP50283 · Topic 1</p>
        <h1 className="font-display text-base leading-tight font-semibold">
          Java Web Technologies
        </h1>
      </div>
      <button
        type="button"
        onClick={onOpenRegExSifu}
        className="px-2.5 py-1.5 rounded-lg bg-[#080e1a] text-cyan-300 border border-[#1d2d48] text-xs font-semibold flex items-center gap-1.5 shadow-sm"
      >
        <span className="font-mono text-cyan-400 font-bold">.*</span>
        <span>RegEx Sifu</span>
      </button>
    </header>
  )
}

function SectionView() {
  const { state } = useProgress()
  const section = SECTIONS[state.currentSection]
  const headingRef = useRef(null)
  const isFirstRender = useRef(true)

  // On section change: scroll up and move focus to the heading so screen
  // readers announce the new content. Skipped on initial load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    headingRef.current?.focus({ preventScroll: true })
  }, [state.currentSection])

  useEffect(() => {
    document.title = `${section.navTitle} · Topic 1 · Java Web Technologies`
  }, [section])

  // Keyed remount + CSS entrance: content is never gated on an exit
  // animation completing (transitions stall in hidden/throttled tabs).
  const SectionComponent = SECTION_COMPONENTS[section.id]
  return (
    <div key={section.id} className="section-enter">
      {SectionComponent ? (
        <SectionComponent headingRef={headingRef} />
      ) : (
        <SectionPlaceholder section={section} headingRef={headingRef} />
      )}
    </div>
  )
}

function Shell({ onOpenRegExSifu }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <a
        href="#content"
        className="sr-only z-30 rounded-lg bg-amber px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ProgressBar />
      <Sidebar />
      <div className="flex min-w-0 flex-col">
        <MobileHeader onOpenRegExSifu={onOpenRegExSifu} />
        <TabBar />
        <main id="content" className="flex-1 max-md:pb-28">
          <SectionView />
        </main>
      </div>
      <MetaphorMapDialog />
    </div>
  )
}

function App() {
  // Determine if URL or local storage points to RegEx Sifu
  const checkIsRegExSifu = () => {
    if (typeof window === 'undefined') return false
    const hash = window.location.hash.toLowerCase()
    const search = window.location.search.toLowerCase()
    const path = window.location.pathname.toLowerCase()
    const stored = localStorage.getItem('servestud_active_subapp')

    return (
      hash.includes('regex') ||
      search.includes('regex-sifu') ||
      path.includes('regex-sifu') ||
      stored === 'regex-sifu'
    )
  }

  const [activeSubApp, setActiveSubApp] = useState(checkIsRegExSifu() ? 'regex-sifu' : 'servestud')

  useEffect(() => {
    const handleHashChange = () => {
      const isSifu = checkIsRegExSifu()
      setActiveSubApp(isSifu ? 'regex-sifu' : 'servestud')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const switchToRegExSifu = () => {
    setActiveSubApp('regex-sifu')
    try {
      localStorage.setItem('servestud_active_subapp', 'regex-sifu')
      window.location.hash = '/regex-sifu'
    } catch {
      // Fallback
    }
  }

  const switchToServeStud = () => {
    setActiveSubApp('servestud')
    try {
      localStorage.setItem('servestud_active_subapp', 'servestud')
      window.location.hash = ''
    } catch {
      // Fallback
    }
  }

  if (activeSubApp === 'regex-sifu') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#070a12] flex items-center justify-center text-cyan-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
              <span>MEMUATKAN REGEX SIFU DOJO...</span>
            </div>
          </div>
        }
      >
        <RegExSifuApp onSwitchToServeStud={switchToServeStud} />
      </Suspense>
    )
  }

  return (
    <ProgressProvider>
      <Shell onOpenRegExSifu={switchToRegExSifu} />
    </ProgressProvider>
  )
}

export default App
