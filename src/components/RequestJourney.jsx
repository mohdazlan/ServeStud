import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// A2 — "The Journey of a Web Request". A step-through stage: browser on
// the left, network in the middle, the library-server on the right.
// Steps are user-driven; element positions per step live in index.css
// keyed off data-step (CSS transitions; instant under reduced motion).

const INTERIOR = 'oklch(0.974 0.012 70)'
const WOOD = 'oklch(0.5 0.09 55)'

export const JOURNEY_STEPS = [
  {
    title: 'You type the URL',
    body: 'You type polimukah.edu.my/library/catalog and hit Enter. Right now, nothing has left your machine — the browser is just reading what you want.',
  },
  {
    title: 'The request is created',
    body: 'The browser wraps your intent in an HTTP request — an envelope. On the front: the method (GET) and the path (/library/catalog). Inside: headers with extra details about who’s asking.',
  },
  {
    title: 'The request travels',
    body: 'The envelope crosses the network — cables, routers, maybe an undersea fibre. For us: one arrow. What matters is that it knows exactly which server it’s heading to.',
  },
  {
    title: 'It reaches the server',
    body: 'The request arrives at the web server — the library. The container reads the path, /library/catalog, and knows exactly which desk should handle it.',
  },
  {
    title: 'The server does the work',
    body: 'The librarian checks the catalog and writes up the list of books. This is where the real work happens — and later in this topic, this is exactly where your Java code will live.',
  },
  {
    title: 'The response is created',
    body: 'The result is wrapped in an HTTP response — another envelope. On the front: a status, 200 OK. Inside: the HTML of the catalog page.',
  },
  {
    title: 'The response travels back',
    body: 'The response crosses the same network, back to the browser that asked. Same road, opposite direction.',
  },
  {
    title: 'The browser renders the page',
    body: 'The browser reads the HTML and turns it into pixels — the catalog appears. Total round trip: about 200 milliseconds. Request out, response back. That’s the web.',
  },
]

function Stage() {
  return (
    <svg viewBox="0 0 680 300" aria-hidden="true" className="a2-stage h-auto w-full">
      {/* Browser (client) */}
      <g>
        <rect x={25} y={70} width={190} height={150} rx={10} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
        <line x1={25} y1={96} x2={215} y2={96} stroke="var(--color-shelf)" strokeWidth="2" />
        <circle cx={44} cy={83} r={3.5} fill="var(--color-hairline)" />
        <circle cx={58} cy={83} r={3.5} fill="var(--color-hairline)" />
        <circle cx={72} cy={83} r={3.5} fill="var(--color-hairline)" />
        <rect className="a2-urlbar" x={35} y={104} width={170} height={20} rx={6} fill="var(--color-paper-aged)" strokeWidth="1.5" />
        <text x={42} y={117.5} fontFamily="var(--font-mono)" fontSize="8" fill="var(--color-ink)">
          polimukah.edu.my/library/catalog
        </text>
        <rect className="a2-caret" x={201} y={107} width={1.8} height={14} fill="var(--color-amber)" />
        {/* rendered catalog page (step 7) */}
        <g className="a2-page">
          <rect x={40} y={136} width={84} height={9} rx={2} fill="var(--color-shelf)" />
          {[158, 180, 202].map((y, i) => (
            <g key={y}>
              <rect x={40} y={y} width={11} height={14} rx={1.5} fill={i === 1 ? 'var(--color-lamp)' : 'var(--color-amber)'} />
              <rect x={58} y={y + 1} width={104} height={5.5} rx={2} fill="var(--color-ink-muted)" opacity="0.85" />
              <rect x={58} y={y + 9} width={68} height={4.5} rx={2} fill="var(--color-hairline)" />
            </g>
          ))}
        </g>
      </g>
      <text x={120} y={248} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fill="var(--color-ink-muted)">
        The client — your browser
      </text>

      {/* Network */}
      <line x1={222} y1={150} x2={468} y2={150} stroke="var(--color-ink-muted)" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" opacity="0.6" />

      {/* Server (the library) */}
      <g>
        <rect className="a2-server-wall" x={475} y={90} width={180} height={130} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
        <polygon points="465,90 665,90 565,42" fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2.5" strokeLinejoin="round" />
        <rect className="a2-plaque" x={518} y={98} width={94} height={20} rx={5} fill="var(--color-shelf)" />
        <text x={565} y={111.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2" fill="var(--color-paper)">
          WEB SERVER
        </text>
        {/* librarian at a desk */}
        <circle cx={565} cy={158} r={9} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2" />
        <rect x={551} y={169} width={28} height={26} rx={8} fill="var(--color-lamp)" />
        <rect x={518} y={195} width={94} height={7} rx={3} fill="var(--color-shelf)" />
        <rect x={523} y={202} width={84} height={16} rx={4} fill={WOOD} />
        {/* working bubble (step 4) */}
        <g className="a2-working">
          <ellipse cx={598} cy={138} rx={17} ry={11} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="1.5" />
          <circle cx={591} cy={138} r={2} fill="var(--color-shelf)" />
          <circle cx={598} cy={138} r={2} fill="var(--color-shelf)" />
          <circle cx={605} cy={138} r={2} fill="var(--color-shelf)" />
        </g>
      </g>
      <text x={565} y={248} textAnchor="middle" fontFamily="var(--font-sans)" fontSize="12.5" fill="var(--color-ink-muted)">
        The web server — the library
      </text>

      {/* HTTP request envelope + label */}
      <g className="a2-req">
        <rect x={225} y={112} width={36} height={25} rx={3} fill="var(--color-amber)" />
        <path d="M 225 114 l 18 12 l 18 -12" fill="none" stroke={INTERIOR} strokeWidth="2" />
        <rect x={190} y={144} width={110} height={17} rx={4} fill="var(--color-shelf)" />
        <text x={245} y={156} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--color-paper)">
          GET /library/catalog
        </text>
      </g>

      {/* HTTP response envelope + label */}
      <g className="a2-res">
        <rect x={440} y={165} width={36} height={25} rx={3} fill="var(--color-lamp)" />
        <path d="M 440 167 l 18 12 l 18 -12" fill="none" stroke={INTERIOR} strokeWidth="2" />
        <rect x={408} y={197} width={100} height={17} rx={4} fill="var(--color-shelf)" />
        <text x={458} y={209} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--color-paper)">
          200 OK · text/html
        </text>
      </g>
    </svg>
  )
}

export function RequestJourney() {
  const [step, setStep] = useState(0)
  const current = JOURNEY_STEPS[step]

  return (
    <figure className="a2 mt-8" data-step={step}>
      <Stage />

      <div className="mt-2 rounded-xl bg-paper-aged px-5 py-4">
        <p className="text-sm font-medium text-ink-muted">
          Step {step + 1} of {JOURNEY_STEPS.length}
        </p>
        <div aria-live="polite">
          <p className="mt-0.5 text-lg font-semibold">{current.title}</p>
          <p className="mt-1 max-w-[62ch] leading-relaxed">{current.body}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex min-h-11 items-center gap-1 rounded-lg border border-hairline px-3.5 font-medium transition-colors duration-200 enabled:hover:bg-paper disabled:opacity-40"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Back
          </button>
          <button
            type="button"
            onClick={() =>
              setStep((s) => Math.min(JOURNEY_STEPS.length - 1, s + 1))
            }
            disabled={step === JOURNEY_STEPS.length - 1}
            className="flex min-h-11 items-center gap-1 rounded-lg bg-amber px-3.5 font-medium text-white transition-colors duration-200 enabled:hover:bg-amber-deep disabled:opacity-40"
          >
            Step forward
            <ChevronRight size={16} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-1.5" role="group" aria-label="Jump to a step">
            {JOURNEY_STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Step ${i + 1}: ${s.title}`}
                aria-current={i === step ? 'step' : undefined}
                className="grid size-8 place-items-center rounded-full"
              >
                <span
                  className={`block size-2.5 rounded-full transition-colors duration-200 ${
                    i === step
                      ? 'bg-amber'
                      : i < step
                        ? 'bg-lamp/60'
                        : 'bg-hairline'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
