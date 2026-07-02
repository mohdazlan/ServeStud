import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'

// A5 — the servlet lifecycle, acted out at one service desk. Nine moments
// across three phases (init / service / destroy). Every moment is a
// complete resting state: element styles are a pure function of the
// current moment, moved by CSS transitions (see .a5-el). Play auto-
// advances; Back/Forward and phase jumps are always available; reduced
// motion gets instant jumps.

const INTERIOR = 'oklch(0.974 0.012 70)'
const DIM = 'oklch(0.88 0.02 70)'
const WOOD = 'oklch(0.5 0.09 55)'

export const LIFECYCLE_MOMENTS = [
  {
    phase: 'init',
    title: 'The doors open',
    body: 'The first request for /library/search has arrived — and Tomcat has never seen BookSearchServlet before. It loads the class. The library opens its doors.',
  },
  {
    phase: 'init',
    title: 'The librarian arrives',
    body: 'The container creates one instance of BookSearchServlet. One. Remember that number — it matters for the whole story.',
  },
  {
    phase: 'init',
    title: 'init() — desk ready',
    body: 'The container calls init(), exactly once. Lamp on, catalog open. This is where you set up anything the servlet will reuse: database connections, configuration.',
  },
  {
    phase: 'service',
    title: 'service() — the first patron',
    body: 'The request is handed over: the container calls service(), which routes to doGet(). The librarian looks up the answer and hands it back. Served: 1.',
  },
  {
    phase: 'service',
    title: 'Same librarian, next patron',
    body: 'Another request, another service() call — on the same instance. No new librarian, no second init(). Served: 2.',
  },
  {
    phase: 'service',
    title: '…and so on, all day',
    body: 'Request after request, the one instance serves them all. The queue never triggers a new hire. Served: 47 and counting.',
  },
  {
    phase: 'destroy',
    title: 'Closing time',
    body: 'The server is shutting down. The last patron has left, and no more requests are coming.',
  },
  {
    phase: 'destroy',
    title: 'destroy() — packing up',
    body: 'The container calls destroy(), exactly once. Save your work, close the connections, box up the desk.',
  },
  {
    phase: 'destroy',
    title: 'The lights go out',
    body: 'The instance is gone. If a request for /library/search ever arrives again? The whole story starts over — from init().',
  },
]

const PHASE_STARTS = { init: 0, service: 3, destroy: 6 }

const CODE_BLOCKS = [
  {
    phase: 'init',
    lines: ['public void init()', '    throws ServletException {', '  // runs ONCE, at the start', '}'],
  },
  {
    phase: 'service',
    lines: ['protected void doGet(req, res)', '    throws ... {', '  // runs for EVERY request', '}'],
  },
  {
    phase: 'destroy',
    lines: ['public void destroy() {', '  // runs ONCE, at shutdown', '}'],
  },
]

// The visual state of every stage element, per moment.
function stageState(m) {
  return {
    lightsOn: m >= 0 && m <= 7,
    doorOpen: m <= 7,
    librarian: m >= 1 && m <= 7,
    deskReady: m >= 2 && m <= 6, // lamp lit + catalog out
    patronAtDesk: m === 3 ? 1 : m === 4 ? 2 : m === 5 ? 3 : 0,
    served: m === 3 ? 1 : m === 4 ? 2 : m >= 5 && m <= 7 ? 47 : null,
    packing: m === 7,
  }
}

function PatronFigure({ dx, visible, color }) {
  // base drawn position = at-desk position (x=210); dx moves back in the queue
  return (
    <g
      className="a5-el"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateX(${dx}px)`,
        transformBox: 'view-box',
      }}
    >
      <circle cx={210} cy={228} r={10} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
      <rect x={197} y={241} width={26} height={40} rx={9} fill={color} />
    </g>
  )
}

function Stage({ moment }) {
  const s = stageState(moment)
  return (
    <svg viewBox="0 0 560 320" aria-hidden="true" className="h-auto w-full">
      {/* shell */}
      <rect
        className="a5-fill"
        x={40}
        y={56}
        width={480}
        height={230}
        fill={s.lightsOn ? INTERIOR : DIM}
        stroke="var(--color-shelf)"
        strokeWidth="3"
      />
      <rect x={40} y={40} width={480} height={16} fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2.5" />
      <rect x={196} y={64} width={168} height={22} rx={5} fill="var(--color-shelf)" />
      <text x={280} y={79} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.2" fill="var(--color-paper)">
        TOMCAT PUBLIC LIBRARY
      </text>

      {/* doorway + roller door (clipped so it disappears into the wall) */}
      <defs>
        <clipPath id="a5-door-clip">
          <rect x={50} y={194} width={44} height={94} />
        </clipPath>
      </defs>
      <rect x={52} y={196} width={40} height={90} fill={s.lightsOn ? 'var(--color-paper-aged)' : DIM} stroke="var(--color-shelf)" strokeWidth="2" className="a5-fill" />
      <g clipPath="url(#a5-door-clip)">
        <rect
          className="a5-el"
          x={52}
          y={196}
          width={40}
          height={90}
          fill={WOOD}
          stroke="var(--color-shelf)"
          strokeWidth="2"
          style={{
            transform: s.doorOpen ? 'translateY(-82px)' : 'translateY(0)',
            transformBox: 'view-box',
          }}
        />
      </g>
      {/* door sign */}
      <g>
        <rect x={46} y={170} width={52} height={16} rx={4} fill="var(--color-shelf)" />
        <text
          className="a5-el"
          x={72}
          y={181.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="1"
          fill="oklch(0.8 0.1 150)"
          style={{ opacity: s.doorOpen ? 1 : 0 }}
        >
          OPEN
        </text>
        <text
          className="a5-el"
          x={72}
          y={181.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="8.5"
          letterSpacing="1"
          fill="oklch(0.85 0.03 70)"
          style={{ opacity: s.doorOpen ? 0 : 1 }}
        >
          CLOSED
        </text>
      </g>

      {/* served counter */}
      <g className="a5-el" style={{ opacity: s.served !== null ? 1 : 0 }}>
        <rect x={396} y={100} width={112} height={20} rx={5} fill="var(--color-shelf)" />
        <text x={452} y={113.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--color-paper)">
          SERVED TODAY: {s.served ?? 0}
        </text>
      </g>

      {/* desk */}
      <g>
        <rect x={240} y={222} width={130} height={8} rx={3} fill="var(--color-shelf)" />
        <rect x={246} y={230} width={118} height={44} rx={6} fill={WOOD} />
        <text x={305} y={256} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5" fill="var(--color-paper)">
          /library/search
        </text>
      </g>

      {/* banker's lamp + glow */}
      <g>
        <ellipse
          className="a5-el"
          cx={344}
          cy={216}
          rx={26}
          ry={12}
          fill="var(--color-partial)"
          style={{ opacity: s.deskReady ? 0.35 : 0 }}
        />
        <rect x={342} y={206} width={3} height={16} fill="var(--color-shelf)" />
        <path d="M 333 206 h 21 a 4 4 0 0 0 -4 -7 h -13 a 4 4 0 0 0 -4 7 Z" fill="var(--color-lamp)" />
      </g>

      {/* catalog book (ready) / packing box (destroy) */}
      <g className="a5-el" style={{ opacity: s.deskReady ? 1 : 0 }}>
        <rect x={258} y={212} width={30} height={10} rx={2} fill="var(--color-amber-deep)" />
        <rect x={261} y={206} width={24} height={6} rx={1.5} fill="var(--color-lamp)" />
      </g>
      <g className="a5-el" style={{ opacity: s.packing ? 1 : 0 }}>
        <rect x={254} y={200} width={38} height={22} rx={2} fill={WOOD} stroke="var(--color-shelf)" strokeWidth="2" />
        <line x1={254} y1={207} x2={292} y2={207} stroke="var(--color-shelf)" strokeWidth="1.5" />
      </g>

      {/* librarian */}
      <g className="a5-el" style={{ opacity: s.librarian ? 1 : 0 }}>
        <circle cx={305} cy={172} r={11} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
        <rect x={289} y={186} width={32} height={36} rx={10} fill="var(--color-lamp)" />
      </g>

      {/* patrons: the one at the desk plus the queue behind */}
      <PatronFigure
        dx={0}
        visible={s.patronAtDesk === 1}
        color="var(--color-ink-muted)"
      />
      <PatronFigure
        dx={s.patronAtDesk === 1 ? -70 : 0}
        visible={s.patronAtDesk >= 1 && s.patronAtDesk <= 2}
        color={WOOD}
      />
      <PatronFigure
        dx={s.patronAtDesk === 1 ? -140 : s.patronAtDesk === 2 ? -70 : 0}
        visible={s.patronAtDesk >= 1}
        color="var(--color-shelf)"
      />

      {/* request / response at the desk */}
      <g className="a5-el" style={{ opacity: s.patronAtDesk ? 1 : 0 }}>
        <path d="M 224 236 C 230 226, 238 222, 246 226" fill="none" stroke="var(--color-amber)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
        <rect x={222} y={208} width={20} height={14} rx={2} fill="var(--color-amber)" />
        <path d="M 222 209 l 10 7 l 10 -7" fill="none" stroke={INTERIOR} strokeWidth="1.5" />
        <path d="M 246 266 C 238 272, 229 273, 223 268" fill="none" stroke="var(--color-lamp)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
        <rect x={222} y={278} width={20} height={14} rx={2} fill="var(--color-lamp)" />
        <path d="M 222 279 l 10 7 l 10 -7" fill="none" stroke={INTERIOR} strokeWidth="1.5" />
      </g>

      {/* ground */}
      <line x1={28} y1={286} x2={532} y2={286} stroke="var(--color-shelf)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function LifecycleStage() {
  const [moment, setMoment] = useState(0)
  const [playing, setPlaying] = useState(false)
  const current = LIFECYCLE_MOMENTS[moment]
  const atEnd = moment === LIFECYCLE_MOMENTS.length - 1

  useEffect(() => {
    if (!playing) return undefined
    const id = setInterval(() => {
      setMoment((m) => {
        if (m >= LIFECYCLE_MOMENTS.length - 1) {
          setPlaying(false)
          return m
        }
        return m + 1
      })
    }, 1700)
    return () => clearInterval(id)
  }, [playing])

  function togglePlay() {
    if (atEnd && !playing) {
      setMoment(0)
      setPlaying(true)
    } else {
      setPlaying((p) => !p)
    }
  }

  return (
    <figure className="mt-8">
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Stage moment={moment} />

        {/* code panel — the method that's alive right now */}
        <div className="space-y-2.5" aria-hidden="true">
          {CODE_BLOCKS.map((block) => {
            const active = block.phase === current.phase
            return (
              <pre
                key={block.phase}
                className={`overflow-x-auto rounded-lg px-4 py-3 font-mono text-xs leading-relaxed transition-opacity duration-300 ${
                  active
                    ? 'bg-shelf-deep text-paper ring-2 ring-amber'
                    : 'bg-shelf-deep/60 text-paper/60'
                }`}
              >
                {block.lines.join('\n')}
              </pre>
            )
          })}
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-paper-aged px-5 py-4">
        <p className="text-sm font-medium text-ink-muted">
          Moment {moment + 1} of {LIFECYCLE_MOMENTS.length} ·{' '}
          <span className="font-mono">
            {current.phase === 'init'
              ? 'init()'
              : current.phase === 'service'
                ? 'service() → doGet()'
                : 'destroy()'}
          </span>
        </p>
        <div aria-live="polite">
          <p className="mt-0.5 text-lg font-semibold">{current.title}</p>
          <p className="mt-1 max-w-[62ch] leading-relaxed">{current.body}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="flex min-h-11 items-center gap-1.5 rounded-lg bg-amber px-4 font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
          >
            {playing ? (
              <>
                <Pause size={15} aria-hidden="true" /> Pause
              </>
            ) : atEnd ? (
              <>
                <RotateCcw size={15} aria-hidden="true" /> Play again
              </>
            ) : (
              <>
                <Play size={15} aria-hidden="true" /> Play
              </>
            )}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setMoment((m) => Math.max(0, m - 1))
              }}
              disabled={moment === 0}
              aria-label="Previous moment"
              className="grid size-11 place-items-center rounded-lg border border-hairline transition-colors duration-200 enabled:hover:bg-paper disabled:opacity-40"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false)
                setMoment((m) => Math.min(LIFECYCLE_MOMENTS.length - 1, m + 1))
              }}
              disabled={atEnd}
              aria-label="Next moment"
              className="grid size-11 place-items-center rounded-lg border border-hairline transition-colors duration-200 enabled:hover:bg-paper disabled:opacity-40"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Jump to a phase">
            {Object.entries(PHASE_STARTS).map(([phase, start]) => (
              <button
                key={phase}
                type="button"
                onClick={() => {
                  setPlaying(false)
                  setMoment(start)
                }}
                aria-current={current.phase === phase ? 'true' : undefined}
                className={`min-h-9 rounded-lg px-2.5 font-mono text-sm transition-colors duration-200 ${
                  current.phase === phase
                    ? 'bg-shelf text-paper'
                    : 'text-ink-muted hover:bg-paper hover:text-ink'
                }`}
              >
                {phase}()
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
