import { useRef, useState } from 'react'
import { Check, Lock, RotateCcw } from 'lucide-react'
import { SECTIONS, SECTION_COUNT } from '../lib/sections.js'
import { useProgress } from '../hooks/useProgress.jsx'

function sectionStatus(state, id) {
  if (state.completedSections.includes(id)) return 'completed'
  if (id === state.currentSection) return 'current'
  if (state.unlockedSections.includes(id)) return 'unlocked'
  return 'locked'
}

const MARKER_STYLES = {
  completed: 'bg-lamp text-white',
  current: 'bg-amber text-white',
  unlocked: 'border border-hairline bg-transparent text-ink',
  locked: 'border border-hairline bg-transparent text-ink-muted/70',
}

// The leading marker doubles as the state indicator: number when open,
// check when done, lock when gated. Sections ARE a real sequence, so the
// number carries information (order = progression), it isn't decoration.
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
  if (status === 'locked')
    return `locked — pass the Section ${id - 1} checkpoint to open it`
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
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 ${
          locked
            ? 'cursor-not-allowed'
            : 'hover:bg-paper focus-visible:bg-paper'
        } ${status === 'current' ? 'bg-paper' : ''}`}
      >
        <Marker id={section.id} status={status} />
        <span className="min-w-0">
          <span
            className={`block truncate text-[0.9375rem] leading-snug ${
              locked
                ? 'text-ink-muted'
                : status === 'current'
                  ? 'font-semibold text-ink'
                  : 'text-ink'
            }`}
          >
            {section.navTitle}
          </span>
          <span className="block text-xs leading-snug text-ink-muted">
            {locked
              ? `Pass Section ${section.id - 1}’s checkpoint to unlock`
              : status === 'completed'
                ? 'Completed'
                : `About ${section.minutes} min`}
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
        className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-paper hover:text-ink"
      >
        <RotateCcw size={14} aria-hidden="true" />
        Reset progress
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-1 text-sm">
      <span className="text-ink">Clear all unlocks?</span>
      <button
        type="button"
        onClick={() => {
          clearTimeout(timer.current)
          dispatch({ type: 'reset' })
          setConfirming(false)
        }}
        className="min-h-9 rounded-md bg-incorrect px-2.5 font-medium text-white transition-colors duration-200 hover:opacity-90"
      >
        Yes, start over
      </button>
      <button
        type="button"
        onClick={() => {
          clearTimeout(timer.current)
          setConfirming(false)
        }}
        className="min-h-9 rounded-md px-2.5 text-ink-muted hover:bg-paper hover:text-ink"
      >
        Keep it
      </button>
    </div>
  )
}

// Desktop sidebar (≥1024px)
export function Sidebar() {
  const { state, dispatch } = useProgress()
  const done = state.completedSections.length

  return (
    <aside className="sticky top-0 hidden h-svh flex-col border-r border-hairline bg-paper-aged lg:flex">
      <header className="px-6 pt-8 pb-6">
        <p className="text-sm text-ink-muted">DFP50283 · Topic 1</p>
        <h1 className="font-display text-[1.4rem] leading-tight font-semibold">
          Java Web Technologies
        </h1>
        <p className="mt-1 text-sm text-ink-muted">Your library companion</p>
      </header>

      <nav aria-label="Course sections" className="min-h-0 flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-0.5">
          {SECTIONS.map((s) => (
            <NavItem
              key={s.id}
              section={s}
              status={sectionStatus(state, s.id)}
              onGo={(id) => dispatch({ type: 'goTo', section: id })}
            />
          ))}
        </ul>
      </nav>

      <footer className="border-t border-hairline px-3 py-3">
        <p className="px-3 pb-1 text-xs text-ink-muted">
          {done} of {SECTION_COUNT} sections complete
        </p>
        <ResetProgress />
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
      className="border-hairline bg-paper-aged max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-20 max-md:border-t max-md:pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:z-20 md:border-b lg:hidden"
    >
      <ul className="mx-auto flex max-w-xl justify-between px-2 md:max-w-3xl md:justify-center md:gap-2">
        {SECTIONS.map((s) => {
          const status = sectionStatus(state, s.id)
          const locked = status === 'locked'
          return (
            <li key={s.id}>
              <button
                type="button"
                aria-current={status === 'current' ? 'page' : undefined}
                aria-disabled={locked || undefined}
                aria-label={`Section ${s.id}: ${s.navTitle}, ${statusLabel(status, s.id)}`}
                onClick={() => !locked && dispatch({ type: 'goTo', section: s.id })}
                className={`flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 transition-colors duration-200 ${
                  locked ? 'cursor-not-allowed' : 'hover:bg-paper focus-visible:bg-paper'
                }`}
              >
                <Marker id={s.id} status={status} compact />
                <span
                  className={`text-[0.6875rem] leading-none ${
                    locked
                      ? 'text-ink-muted'
                      : status === 'current'
                        ? 'font-semibold text-ink'
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
