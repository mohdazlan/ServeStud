import { useEffect, useRef, useState, lazy, Suspense } from 'react'
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
import Section6DataValidation from './sections/Section6DataValidation.jsx'
import Section7ServerResponse from './sections/Section7ServerResponse.jsx'
import Topic3JSP from './topic3/Topic3JSP.jsx'
import { Database } from 'lucide-react'

const RegExSifuApp = lazy(() =>
  import('./regex-sifu/RegExSifuApp.jsx').then((m) => ({ default: m.RegExSifuApp }))
)

const SQLGuruApp = lazy(() =>
  import('./sql-guru/SQLGuruApp.jsx').then((m) => ({ default: m.SQLGuruApp }))
)

// Built sections register here; the rest render an honest placeholder.
const SECTION_COMPONENTS = {
  0: Section0Welcome,
  1: Section1Web,
  2: Section2StaticVsDynamic,
  3: Section3JavaEE,
  4: Section4Servlet,
  5: Section5ServletAPI,
  6: Section6DataValidation,
  7: Section7ServerResponse,
}

function MobileHeader({ onOpenRegExSifu, onOpenTopic3, onOpenSqlGuru }) {
  return (
    <header className="border-b border-hairline bg-paper-aged px-4 py-3 lg:hidden flex items-center justify-between gap-2">
      <div>
        <p className="text-xs text-ink-muted">DFP50283 · Java Web Tech</p>
        <h1 className="font-display text-base leading-tight font-semibold text-ink">
          ServeStud Learning Portal
        </h1>
      </div>
      <div className="flex flex-wrap justify-end gap-1.5">
        <button
          type="button"
          onClick={onOpenTopic3}
          className="rounded-lg border border-lamp bg-paper px-2 py-1 text-xs font-semibold text-lamp hover:bg-paper-aged"
        >
          Topic 3
        </button>
        <button
          type="button"
          onClick={onOpenRegExSifu}
          className="px-2 py-1 rounded-lg bg-[#080e1a] text-cyan-300 border border-[#1d2d48] text-xs font-semibold flex items-center gap-1 shadow-sm hover:bg-[#121c30]"
        >
          <span className="font-mono text-cyan-400 font-bold">.*</span>
          <span>RegEx</span>
        </button>
        <button
          type="button"
          onClick={onOpenSqlGuru}
          className="px-2 py-1 rounded-lg bg-[#07131e] text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 shadow-sm hover:bg-[#0c1e30]"
        >
          <Database size={12} className="text-emerald-400" />
          <span>SQL-Guru</span>
        </button>
      </div>
    </header>
  )
}

function SectionView() {
  const { state } = useProgress()
  const section = SECTIONS[state.currentSection] || SECTIONS[0]
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
    const topicLabel = section.topicId === 2 ? 'Topic 2' : 'Topic 1'
    document.title = `${section.navTitle} · ${topicLabel} · ServeStud DFP50283`
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

function Shell({ onOpenRegExSifu, onOpenTopic3, onOpenSqlGuru }) {
  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[19rem_minmax(0,1fr)]">
      <a
        href="#content"
        className="sr-only z-30 rounded-lg bg-amber px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ProgressBar />
      <Sidebar onOpenTopic3={onOpenTopic3} onOpenRegExSifu={onOpenRegExSifu} onOpenSqlGuru={onOpenSqlGuru} />
      <div className="flex min-w-0 flex-col">
        <MobileHeader onOpenRegExSifu={onOpenRegExSifu} onOpenTopic3={onOpenTopic3} onOpenSqlGuru={onOpenSqlGuru} />
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
  // Determine if URL or local storage points to RegEx Sifu, Topic 3, or SQL-Guru
  const checkActiveSubApp = () => {
    if (typeof window === 'undefined') return 'servestud'
    const hash = window.location.hash.toLowerCase()
    const search = window.location.search.toLowerCase()
    const path = window.location.pathname.toLowerCase()
    const stored = localStorage.getItem('servestud_active_subapp')

    if (hash.includes('sql') || search.includes('sql-guru') || path.includes('sql-guru') || stored === 'sql-guru') {
      return 'sql-guru'
    }

    if (hash.includes('topic-3') || search.includes('topic-3')) return 'topic-3'
    return (
      hash.includes('regex') ||
      search.includes('regex-sifu') ||
      path.includes('regex-sifu') ||
      stored === 'regex-sifu'
    )
      ? 'regex-sifu'
      : 'servestud'
  }

  const [activeSubApp, setActiveSubApp] = useState(checkActiveSubApp)

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSubApp(checkActiveSubApp())
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

  const switchToSqlGuru = () => {
    setActiveSubApp('sql-guru')
    try {
      localStorage.setItem('servestud_active_subapp', 'sql-guru')
      window.location.hash = '/sql-guru'
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

  const switchToTopic3 = () => {
    setActiveSubApp('topic-3')
    try {
      localStorage.setItem('servestud_active_subapp', 'topic-3')
      window.location.hash = '/topic-3'
    } catch {
      // Fallback
    }
  }

  if (activeSubApp === 'topic-3') {
    return <Topic3JSP onBack={switchToServeStud} />
  }

  if (activeSubApp === 'sql-guru') {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#070e17] flex items-center justify-center text-emerald-400 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MEMUATKAN SQL-GURU AI TUTOR...</span>
            </div>
          </div>
        }
      >
        <SQLGuruApp
          onSwitchToServeStud={switchToServeStud}
          onSwitchToRegExSifu={switchToRegExSifu}
          onSwitchToTopic3={switchToTopic3}
        />
      </Suspense>
    )
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
        <RegExSifuApp
          onSwitchToServeStud={switchToServeStud}
          onSwitchToSqlGuru={switchToSqlGuru}
        />
      </Suspense>
    )
  }

  return (
    <ProgressProvider>
      <Shell
        onOpenRegExSifu={switchToRegExSifu}
        onOpenTopic3={switchToTopic3}
        onOpenSqlGuru={switchToSqlGuru}
      />
    </ProgressProvider>
  )
}

export default App
