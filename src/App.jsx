import { useEffect, useRef } from 'react'
import { SECTIONS } from './lib/sections.js'
import { ProgressProvider, useProgress } from './hooks/useProgress.jsx'
import { Sidebar, TabBar } from './components/SectionNav.jsx'
import { ProgressBar } from './components/ProgressBar.jsx'
import { MetaphorMapDialog } from './components/MetaphorMapDialog.jsx'
import { SectionPlaceholder } from './components/SectionPlaceholder.jsx'
import Section0Welcome from './sections/Section0Welcome.jsx'
import Section1Web from './sections/Section1Web.jsx'
import Section2StaticVsDynamic from './sections/Section2StaticVsDynamic.jsx'
import Section4Servlet from './sections/Section4Servlet.jsx'
import Section5ServletAPI from './sections/Section5ServletAPI.jsx'

// Built sections register here; the rest render an honest placeholder.
const SECTION_COMPONENTS = {
  0: Section0Welcome,
  1: Section1Web,
  2: Section2StaticVsDynamic,
  4: Section4Servlet,
  5: Section5ServletAPI,
}

function MobileHeader() {
  return (
    <header className="border-b border-hairline bg-paper-aged px-6 py-4 lg:hidden">
      <p className="text-xs text-ink-muted">DFP50283 · Topic 1</p>
      <h1 className="font-display text-lg leading-tight font-semibold">
        Java Web Technologies
      </h1>
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

function Shell() {
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
        <MobileHeader />
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
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  )
}

export default App
