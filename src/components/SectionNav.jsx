import { useRef, useState } from 'react'
import { Check, Lock, RotateCcw, BookOpen, Layers } from 'lucide-react'
import { SECTIONS, SECTION_COUNT, TOPICS } from '../lib/sections.js'
import { useProgress } from '../hooks/useProgress.jsx'

function sectionStatus(state, id) {
  if (state.completedSections.includes(id)) return 'completed'
  if (id === state.currentSection) return 'current'
  return 'unlocked' // Free roaming: all sections are directly open

  /* PREVIOUS GATED LOCKING LOGIC:
  if (state.unlockedSections.includes(id)) return 'unlocked'
  return 'locked'
  */
}

const MARKER_STYLES = {
  completed: 'bg-lamp text-white',
  current: 'bg-amber text-white',
  unlocked: 'border border-hairline bg-transparent text-ink',
  locked: 'border border-hairline bg-transparent text-ink-muted/70',
}

function Marker({ id, status, compact }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-medium transition-colors duration-300 ${
        compact ? 'size-6 text-xs' : 'size-7 text-sm'
      } ${MARKER_STYLES[status]}`}
      aria-hidden="true"
    >
      {status === 'completed' ? (
        <Check size={compact ? 13 : 15} strokeWidth={2.5} />
      ) : status === 'locked' ? (
        <Lock size={compact ? 11 : 13} />
      ) : (
        id
      )}
    </span>
  )
}

function statusLabel(status, id) {
  if (status === 'completed') return 'completed'
  if (status === 'locked') return `locked — pass the Section ${id - 1} checkpoint to open it`
  if (status === 'current') return 'current section'
  return 'open'
}

function NavItem({ section, status, onGo }) {
  const locked = status === 'locked'
  return (
    <li>
      <button
        type="button"
        aria-current={status === 'current' ? 'page' : undefined}
        aria-disabled={locked || undefined}
        onClick={() => !locked && onGo(section.id)}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
          locked ? 'cursor-not-allowed opacity-70' : 'hover:bg-paper focus-visible:bg-paper'
        } ${status === 'current' ? 'bg-paper shadow-sm' : ''}`}
      >
        <Marker id={section.id} status={status} />
        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-xs leading-snug ${
              locked
                ? 'text-ink-muted'
                : status === 'current'
                  ? 'font-bold text-ink'
                  : 'font-medium text-ink'
            }`}
          >
            {section.navTitle}
          </span>
          <span className="block text-[11px] leading-snug text-ink-muted">
            {locked
              ? `Pass S${section.id - 1} checkpoint`
              : status === 'completed'
                ? 'Completed'
                : `${section.minutes} min`}
          </span>
        </span>
        <span className="sr-only">, {statusLabel(status, section.id)}</span>
      </button>
    </li>
  )
}

function ResetProgress() {
  const { state, dispatch } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const timer = useRef(null)

  const started =
    state.completedSections.length > 0 ||
    state.currentSection !== 0 ||
    Object.keys(state.quizAttempts).length > 0

  if (!started) return null

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => {
          setConfirming(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setConfirming(false), 6000)
        }}
        className="flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs text-ink-muted transition-colors duration-200 hover:bg-paper hover:text-ink"
      >
        <RotateCcw size={13} aria-hidden="true" />
        Reset progress
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-2 py-1 text-xs">
      <span className="text-ink">Start over?</span>
      <button
        type="button"
        onClick={() => {
          clearTimeout(timer.current)
          dispatch({ type: 'reset' })
          setConfirming(false)
        }}
        className="rounded bg-incorrect px-2 py-1 font-medium text-white transition-colors duration-200 hover:opacity-90"
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => {
          clearTimeout(timer.current)
          setConfirming(false)
        }}
        className="rounded px-2 py-1 text-ink-muted hover:bg-paper"
      >
        Keep
      </button>
    </div>
  )
}

// Desktop sidebar (≥1024px)
export function Sidebar({ onOpenTopic3, onOpenRegExSifu, onOpenSqlGuru }) {
  const { state, dispatch } = useProgress()
  const done = state.completedSections.length

  return (
    <aside className="sticky top-0 hidden h-svh flex-col border-r border-hairline bg-paper-aged lg:flex">
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded bg-lamp/15 px-2 py-0.5 text-[10px] font-bold text-lamp">
            DFP50283
          </span>
          <p className="text-xs font-semibold text-ink-muted">Politeknik Malaysia</p>
        </div>
        <h1 className="mt-1.5 font-display text-xl leading-tight font-semibold text-ink">
          ServeStud Portal
        </h1>
        <p className="mt-0.5 text-xs text-ink-muted">Vanilla Java Web Technologies</p>
      </header>

      <nav aria-label="Course sections" className="min-h-0 flex-1 overflow-y-auto px-3 space-y-4">
        {TOPICS.map((topic) => {
          const topicSections = SECTIONS.filter((s) => topic.sectionIds.includes(s.id))
          return (
            <div key={topic.id} className="space-y-1">
              <div className="px-2 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-lamp">
                  {topic.code}
                </p>
                <p className="text-xs font-semibold text-ink leading-tight">{topic.title}</p>
              </div>
              <ul className="flex flex-col gap-0.5 pt-1">
                {topicSections.map((s) => (
                  <NavItem
                    key={s.id}
                    section={s}
                    status={sectionStatus(state, s.id)}
                    onGo={(id) => dispatch({ type: 'goTo', section: id })}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      <footer className="border-t border-hairline px-3 py-3 space-y-2 bg-paper-aged">
        {/* Topic 3 Entry Link */}
        <button
          type="button"
          onClick={onOpenTopic3}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-lamp/60 bg-paper text-lamp hover:bg-lamp/10 text-xs font-semibold transition-all shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Layers size={15} />
            <span>Topic 3 · JSP & JDBC Lab</span>
          </div>
          <span className="text-[10px] bg-lamp text-white px-1.5 py-0.5 rounded font-mono">
            New
          </span>
        </button>

        {/* RegEx Sifu Dojo Link */}
        <button
          type="button"
          onClick={onOpenRegExSifu}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#080e1a] hover:bg-[#0f192c] text-cyan-300 border border-[#1d2d48] text-xs font-medium shadow-sm transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-400 font-bold bg-[#142036] px-1.5 py-0.5 rounded text-[11px]">
              .*
            </span>
            <span className="font-semibold">RegEx Sifu Dojo</span>
          </div>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 font-mono">
            Buka
          </span>
        </button>

        {/* SQL-Guru AI Tutor Link (Inspired by UTP Research) */}
        <button
          type="button"
          onClick={onOpenSqlGuru}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#07131e] hover:bg-[#0c1e30] text-emerald-300 border border-emerald-500/40 text-xs font-medium shadow-sm transition-all"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400 font-bold bg-[#0e243b] px-1.5 py-0.5 rounded text-[11px]">
              SQL
            </span>
            <span className="font-semibold">SQL-Guru AI Tutor</span>
          </div>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 font-mono">
            IUCEL '25
          </span>
        </button>

        <div className="flex items-center justify-between px-2 pt-1">
          <p className="text-[11px] text-ink-muted">
            {done} of {SECTION_COUNT} sections passed
          </p>
          <ResetProgress />
        </div>
      </footer>
    </aside>
  )
}

// Tablet top bar (768–1023px) / mobile bottom tabs (<768px)
export function TabBar() {
  const { state, dispatch } = useProgress()

  return (
    <nav
      aria-label="Course sections"
      className="border-hairline bg-paper-aged max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-20 max-md:border-t max-md:pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:z-20 md:border-b lg:hidden overflow-x-auto"
    >
      <ul className="mx-auto flex max-w-full justify-start md:justify-center px-2 py-1 gap-1">
        {SECTIONS.map((s) => {
          const status = sectionStatus(state, s.id)
          const locked = status === 'locked'
          return (
            <li key={s.id} className="shrink-0">
              <button
                type="button"
                aria-current={status === 'current' ? 'page' : undefined}
                aria-disabled={locked || undefined}
                aria-label={`Section ${s.id}: ${s.navTitle}, ${statusLabel(status, s.id)}`}
                onClick={() => !locked && dispatch({ type: 'goTo', section: s.id })}
                className={`flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 transition-colors duration-200 ${
                  locked ? 'cursor-not-allowed opacity-50' : 'hover:bg-paper focus-visible:bg-paper'
                }`}
              >
                <Marker id={s.id} status={status} compact />
                <span
                  className={`text-[0.625rem] leading-none whitespace-nowrap ${
                    locked
                      ? 'text-ink-muted'
                      : status === 'current'
                        ? 'font-bold text-ink'
                        : 'text-ink'
                  }`}
                >
                  {s.tabTitle}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
