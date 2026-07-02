// The library scene — animation A1 and the anchor illustration for the
// whole course. Cross-section of the Tomcat Public Library: three service
// desks (servlets) with librarians, patrons arriving with requests, and
// envelopes flowing both ways. Later animations (A2–A9) reuse this
// vocabulary. Flat shapes, token colors only, choreography in index.css
// (clock-based CSS so the finished scene is always reachable).

const INTERIOR = 'oklch(0.974 0.012 70)' // lit interior, one shade lighter than paper
const WOOD = 'oklch(0.5 0.09 55)' // desk wood, between amber and shelf

function Librarian({ x, i }) {
  return (
    <g
      className="a1-librarian"
      style={{ '--i': i, transformOrigin: `${x}px 298px` }}
    >
      <circle cx={x} cy={248} r={11} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
      <rect x={x - 16} y={262} width={32} height={36} rx={10} fill="var(--color-lamp)" />
    </g>
  )
}

function BookRow({ x, width }) {
  const books = []
  const palette = ['var(--color-amber)', 'var(--color-lamp)', 'var(--color-shelf)', 'var(--color-amber-deep)']
  let cx = x
  let i = 0
  while (cx < x + width - 8) {
    const w = 7 + ((i * 5) % 6)
    const h = 20 + ((i * 7) % 9)
    books.push(
      <rect
        key={i}
        x={cx}
        y={228 - h}
        width={w}
        height={h}
        rx={1.5}
        fill={palette[i % palette.length]}
        opacity="0.8"
      />,
    )
    cx += w + 3
    i += 1
  }
  return (
    <g>
      {books}
      <rect x={x - 6} y={228} width={width + 12} height={5} rx={2} fill="var(--color-shelf)" />
    </g>
  )
}

function Desk({ x, i, path }) {
  return (
    <g className="a1-desk" style={{ '--i': i }}>
      <rect x={x - 58} y={306} width={116} height={8} rx={3} fill="var(--color-shelf)" />
      <rect x={x - 52} y={314} width={104} height={40} rx={6} fill={WOOD} />
      <text
        x={x}
        y={337.5}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="9.5"
        fill="var(--color-paper)"
      >
        {path}
      </text>
      {/* banker's lamp */}
      <rect x={x + 30} y={292} width={3} height={14} fill="var(--color-shelf)" />
      <path
        d={`M ${x + 21} 292 h 21 a 4 4 0 0 0 -4 -7 h -13 a 4 4 0 0 0 -4 7 Z`}
        fill="var(--color-lamp)"
      />
    </g>
  )
}

function Patron({ x, i, withEnvelope }) {
  return (
    <g className="a1-patron" style={{ '--i': i }}>
      <circle cx={x} cy={318} r={10} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
      <rect x={x - 13} y={331} width={26} height={42} rx={9} fill="var(--color-ink-muted)" />
      {withEnvelope && (
        <g>
          <rect x={x + 10} y={338} width={22} height={15} rx={2} fill="var(--color-amber)" />
          <path
            d={`M ${x + 10} 339 l 11 8 l 11 -8`}
            fill="none"
            stroke={INTERIOR}
            strokeWidth="1.5"
          />
        </g>
      )}
    </g>
  )
}

function Envelope({ x, y, color }) {
  return (
    <g>
      <rect x={x} y={y} width={26} height={18} rx={2.5} fill={color} />
      <path d={`M ${x} ${y + 1.5} l 13 9 l 13 -9`} fill="none" stroke={INTERIOR} strokeWidth="1.8" />
    </g>
  )
}

export function LibraryScene() {
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label="Cross-section of a building signed “Tomcat Public Library.” Behind three service desks labeled /library/search, /library/register, and /library/loans, librarians are ready to serve. Patrons arrive on the left; an envelope travels from a patron to a desk, and another envelope travels back."
      className="a1 h-auto w-full"
    >
      {/* Building shell */}
      <g className="a1-building">
        <rect x={96} y={148} width={448} height={230} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="3" />
        {/* pilasters */}
        <rect x={96} y={148} width={16} height={230} fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2" />
        <rect x={528} y={148} width={16} height={230} fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2" />
        {/* pediment */}
        <polygon points="76,148 564,148 320,66" fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="3" strokeLinejoin="round" />
        <circle cx={320} cy={112} r={13} fill={INTERIOR} stroke="var(--color-shelf)" strokeWidth="2.5" />
        {/* plaque */}
        <rect x={222} y={158} width={196} height={26} rx={6} fill="var(--color-shelf)" />
        <text
          x={320}
          y={175.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11.5"
          letterSpacing="1.5"
          fill="var(--color-paper)"
        >
          TOMCAT PUBLIC LIBRARY
        </text>
      </g>

      {/* Bookshelves */}
      <g className="a1-shelves">
        <BookRow x={195} width={100} />
        <BookRow x={310} width={100} />
        <BookRow x={425} width={90} />
      </g>

      {/* Desks + librarians */}
      <Desk x={245} i={0} path="/library/search" />
      <Desk x={360} i={1} path="/library/register" />
      <Desk x={475} i={2} path="/library/loans" />
      <Librarian x={245} i={0} />
      <Librarian x={360} i={1} />
      <Librarian x={475} i={2} />

      {/* A patron arriving */}
      <Patron x={130} i={0} />

      {/* Request / response flow in the aisle between patron and desk */}
      <g className="a1-flow">
        <path
          d="M 148 320 C 160 300, 178 292, 193 302"
          fill="none"
          stroke="var(--color-amber)"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <path d="M 193 302 l -8.5 0 l 3 -7 Z" fill="var(--color-amber)" />
        <path
          d="M 193 348 C 180 358, 163 362, 150 354"
          fill="none"
          stroke="var(--color-lamp)"
          strokeWidth="2"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        <path d="M 150 354 l 8.5 -1 l -2 7.5 Z" fill="var(--color-lamp)" />
      </g>
      <g className="a1-envelope">
        <Envelope x={156} y={272} color="var(--color-amber)" />
      </g>
      <g className="a1-envelope-return">
        <Envelope x={158} y={324} color="var(--color-lamp)" />
      </g>

      {/* Ground */}
      <line
        className="a1-building"
        x1={64}
        y1={378}
        x2={576}
        y2={378}
        stroke="var(--color-shelf)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Miniature glyphs in the same vocabulary — used by the metaphor panel.
export function GlyphBuilding({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x={5} y={13} width={22} height={14} fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2" />
      <polygon points="3,13 29,13 16,4" fill="var(--color-paper-aged)" stroke="var(--color-shelf)" strokeWidth="2" strokeLinejoin="round" />
      <rect x={13} y={19} width={6} height={8} fill="var(--color-shelf)" />
    </svg>
  )
}

export function GlyphLibrarian({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx={16} cy={9} r={5} fill="var(--color-paper)" stroke="var(--color-shelf)" strokeWidth="2" />
      <rect x={8} y={16} width={16} height={8} rx={4} fill="var(--color-lamp)" />
      <rect x={4} y={24} width={24} height={4} rx={1.5} fill={'oklch(0.5 0.09 55)'} />
    </svg>
  )
}

export function GlyphPatron({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx={16} cy={8} r={5} fill="var(--color-paper)" stroke="var(--color-shelf)" strokeWidth="2" />
      <rect x={9} y={15} width={14} height={13} rx={5} fill="var(--color-ink-muted)" />
    </svg>
  )
}

export function GlyphRequest({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x={4} y={9} width={24} height={16} rx={2.5} fill="var(--color-amber)" />
      <path d="M 4 11 l 12 8 l 12 -8" fill="none" stroke="var(--color-paper)" strokeWidth="2" />
    </svg>
  )
}

// The rulebook — HTTP, the agreed rules of the conversation.
export function GlyphHTTP({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x={7} y={4} width={18} height={24} rx={2.5} fill="var(--color-paper)" stroke="var(--color-shelf)" strokeWidth="2" />
      <line x1={11} y1={11} x2={21} y2={11} stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round" />
      <line x1={11} y1={16} x2={21} y2={16} stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round" />
      <line x1={11} y1={21} x2={17} y2={21} stroke="var(--color-ink-muted)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={22} cy={23} r={4} fill="var(--color-amber)" />
    </svg>
  )
}

export function GlyphResponse({ className = 'size-7' }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect x={4} y={9} width={24} height={16} rx={2.5} fill="var(--color-lamp)" />
      <path d="M 4 11 l 12 8 l 12 -8" fill="none" stroke="var(--color-paper)" strokeWidth="2" />
    </svg>
  )
}
