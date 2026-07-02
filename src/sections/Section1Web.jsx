import {
  GlyphBuilding,
  GlyphHTTP,
  GlyphPatron,
  GlyphRequest,
  GlyphResponse,
} from '../components/LibraryScene.jsx'
import { BrainPower, NoDumbQuestions } from '../components/callouts.jsx'
import { RequestJourney } from '../components/RequestJourney.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import {
  ChipBank,
  EXERCISE_HINT,
  ExerciseFooter,
  FillSlot,
  useSlotFill,
} from '../components/exercises.jsx'

const COMPONENTS = [
  {
    glyph: GlyphPatron,
    term: 'Client',
    def: 'The browser. It starts every conversation: builds requests, sends them, and renders whatever comes back.',
    lms: 'The patron who walks up to the desk.',
  },
  {
    glyph: GlyphBuilding,
    term: 'Server',
    def: 'The software that listens for requests and answers them. It hosts the application and does the work.',
    lms: 'The library — open, staffed, and ready.',
  },
  {
    glyph: GlyphHTTP,
    term: 'HTTP',
    def: 'The protocol — the language both sides agree to speak, so any browser can talk to any server.',
    lms: 'The agreed rules for how patrons and librarians interact.',
  },
  {
    glyph: GlyphRequest,
    term: 'HTTP Request',
    def: 'The message from client to server: a method (GET, POST…), a path, and headers with the details.',
    lms: 'The patron’s question, in an envelope.',
  },
  {
    glyph: GlyphResponse,
    term: 'HTTP Response',
    def: 'The message back: a status code (200 OK, 404 Not Found…) and usually content, like HTML.',
    lms: 'The librarian’s answer, in another envelope.',
  },
]

const NDQ = [
  {
    q: 'What’s the difference between a web server and a website?',
    a: 'The website is the content — pages, images, data. The web server is the software that stores it and hands it out on request. The library building versus the books inside it.',
  },
  {
    q: 'Does the request literally “travel”? Where does it go?',
    a: 'Yes — as signals through cables, routers, and sometimes undersea fibre. The domain name gets looked up and turned into the server’s address, and the request is routed there hop by hop. We draw it as one arrow because for this course, that’s the level that matters.',
  },
  {
    q: 'Why does the server send HTML back? Why not just the data?',
    a: 'Because the browser’s job is to draw pages, and HTML is the format it knows how to draw. The server could send raw data — real systems sometimes do — but then something still has to turn it into a page. For classic web apps, the server does that work and ships ready-to-render HTML.',
  },
]

// Think exercise 1 — label the journey diagram
const DIAGRAM_CHIPS = [
  { id: 'client', label: 'Client' },
  { id: 'server', label: 'Server' },
  { id: 'request', label: 'HTTP Request' },
  { id: 'response', label: 'HTTP Response' },
  { id: 'network', label: 'Network' },
]

const DIAGRAM_SLOTS = [
  { id: 'left-box', answer: 'client' },
  { id: 'top-arrow', answer: 'request' },
  { id: 'middle', answer: 'network' },
  { id: 'bottom-arrow', answer: 'response' },
  { id: 'right-box', answer: 'server' },
]

function ArrowRightGlyph() {
  return (
    <svg viewBox="0 0 96 14" aria-hidden="true" className="h-3.5 w-full max-w-24">
      <line x1={2} y1={7} x2={82} y2={7} stroke="var(--color-amber)" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
      <polygon points="82,1.5 94,7 82,12.5" fill="var(--color-amber)" />
    </svg>
  )
}

function ArrowLeftGlyph() {
  return (
    <svg viewBox="0 0 96 14" aria-hidden="true" className="h-3.5 w-full max-w-24">
      <line x1={94} y1={7} x2={14} y2={7} stroke="var(--color-lamp)" strokeWidth="2.5" strokeDasharray="6 5" strokeLinecap="round" />
      <polygon points="14,1.5 2,7 14,12.5" fill="var(--color-lamp)" />
    </svg>
  )
}

function LabelTheJourney() {
  const fill = useSlotFill({
    chips: DIAGRAM_CHIPS,
    slots: DIAGRAM_SLOTS,
    exerciseId: 's1-label-diagram',
  })

  return (
    <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        {EXERCISE_HINT}
      </p>
      <ChipBank fill={fill} label="Labels" />

      <div className="mt-6 grid items-center gap-x-4 gap-y-3 sm:grid-cols-[1fr_1.2fr_1fr]">
        {/* left figure */}
        <div className="flex flex-col items-center gap-2">
          <GlyphPatron className="size-12" />
          <FillSlot fill={fill} slotId="left-box" srLabel="The figure on the left" compact />
        </div>

        {/* middle column */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full flex-col items-center gap-1.5">
            <ArrowRightGlyph />
            <FillSlot fill={fill} slotId="top-arrow" srLabel="The arrow going to the right" compact />
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-1.5">
            <svg viewBox="0 0 96 8" aria-hidden="true" className="h-2 w-full max-w-24">
              <line x1={2} y1={4} x2={94} y2={4} stroke="var(--color-ink-muted)" strokeWidth="2" strokeDasharray="3 5" strokeLinecap="round" />
            </svg>
            <FillSlot fill={fill} slotId="middle" srLabel="What the messages travel across" compact />
          </div>
          <div className="mt-2 flex w-full flex-col items-center gap-1.5">
            <ArrowLeftGlyph />
            <FillSlot fill={fill} slotId="bottom-arrow" srLabel="The arrow coming back to the left" compact />
          </div>
        </div>

        {/* right figure */}
        <div className="flex flex-col items-center gap-2">
          <GlyphBuilding className="size-12" />
          <FillSlot fill={fill} slotId="right-box" srLabel="The figure on the right" compact />
        </div>
      </div>

      <ExerciseFooter
        fill={fill}
        successText="All five in place. You just labeled the whole request-response cycle."
      />
    </div>
  )
}

// Think exercise 2 — who does what?
const JOB_CHIPS = [
  { id: 'job-browser', label: 'Sends requests and renders responses' },
  { id: 'job-server', label: 'Receives requests and generates responses' },
  { id: 'job-request', label: 'Carries what the client wants' },
  { id: 'job-response', label: 'Carries what the server sends back' },
  { id: 'job-url', label: 'Tells the server which resource to find' },
]

const JOB_SLOTS = [
  { id: 'browser', name: 'Browser', answer: 'job-browser' },
  { id: 'web-server', name: 'Web Server', answer: 'job-server' },
  { id: 'http-request', name: 'HTTP Request', answer: 'job-request' },
  { id: 'http-response', name: 'HTTP Response', answer: 'job-response' },
  { id: 'url', name: 'URL', answer: 'job-url' },
]

function WhoDoesWhat() {
  const fill = useSlotFill({
    chips: JOB_CHIPS,
    slots: JOB_SLOTS,
    exerciseId: 's1-who-does-what',
  })

  return (
    <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        Match each part to its job. {EXERCISE_HINT}
      </p>
      <ChipBank fill={fill} label="Jobs" />
      <ul className="mt-6 space-y-3">
        {JOB_SLOTS.map((slot) => (
          <li
            key={slot.id}
            className="grid items-center gap-2 sm:grid-cols-[9.5rem_1fr]"
          >
            <span className="font-mono text-[0.9375rem] font-medium">
              {slot.name}
            </span>
            <FillSlot fill={fill} slotId={slot.id} srLabel={`The job of ${slot.name}`} compact />
          </li>
        ))}
      </ul>
      <ExerciseFooter
        fill={fill}
        successText="Five for five. Every part has one job — and now you know them all."
      />
    </div>
  )
}

const QUIZ = [
  {
    id: 'q1',
    q: 'A patron walks into the library and asks “Do you have Dune by Frank Herbert?” In web terms, who or what is the patron?',
    options: ['The web server', 'The client (browser)', 'The HTTP response', 'The servlet'],
    answer: 1,
    explain:
      'The patron starts the conversation and asks the question — that’s the client, the browser. The server is the one being asked.',
  },
  {
    id: 'q2',
    q: 'In the request-response cycle, what does the server send back to the browser?',
    options: [
      'Another request',
      'The URL',
      'An HTTP response containing the requested content',
      'The network connection',
    ],
    answer: 2,
    explain:
      'One cycle, two messages: the request goes out, the response comes back — carrying the content (or an error saying why not).',
  },
  {
    id: 'q3',
    q: 'Which of these is NOT a component of a web application?',
    options: ['Client', 'Server', 'Compiler', 'Network protocol'],
    answer: 2,
    explain:
      'A compiler builds programs before they run; it plays no part in serving a page. Client, server, and the protocol between them are the core trio.',
  },
  {
    id: 'q4',
    q: 'In our library metaphor, what does “HTTP” represent?',
    options: [
      'The agreed rules for how patrons and librarians communicate',
      'The book itself',
      'The library building',
      'The patron’s library card',
    ],
    answer: 0,
    explain:
      'HTTP is the protocol — the shared rulebook. The building is the container, and the book would be content in a response.',
  },
]

export default function Section1Web({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 1 · about 10 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        The Web — What Actually Happens When You Visit a Website?
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topic 1.1.1 — components of a web application
      </p>

      <BrainPower>
        <p>
          You type <code className="text-partial">polimukah.edu.my</code> into
          your browser and hit Enter. A page appears. But what actually happened
          in the 200 milliseconds between pressing Enter and seeing the page?
          More than you think.
        </p>
      </BrainPower>

      {/* Learn */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          Learn — follow one request
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here’s that 200 milliseconds, slowed down to your pace. A patron wants
          the book catalog — <code>/library/catalog</code>. Step through what
          happens.
        </p>
        <RequestJourney />
      </section>

      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          The cast, by name
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          You just watched five things cooperate. Here they are, formally:
        </p>
        <dl className="mt-6 space-y-5">
          {COMPONENTS.map((c) => {
            const Glyph = c.glyph
            return (
              <div key={c.term} className="flex items-start gap-4">
                <span className="mt-1 shrink-0">
                  <Glyph className="size-9" />
                </span>
                <div>
                  <dt className="font-semibold text-[1.0625rem]">{c.term}</dt>
                  <dd className="mt-0.5 max-w-[58ch] leading-relaxed">
                    {c.def}
                    <span className="mt-0.5 block text-[0.9375rem] text-ink-muted">
                      In the library: {c.lms}
                    </span>
                  </dd>
                </div>
              </div>
            )
          })}
        </dl>
      </section>

      <NoDumbQuestions items={NDQ} />

      {/* Think */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Think — your turn
        </h3>

        <h4 className="mt-8 text-lg font-semibold">
          Sharpen your pencil: label the journey
        </h4>
        <LabelTheJourney />

        <h4 className="mt-12 text-lg font-semibold">Who does what?</h4>
        <WhoDoesWhat />
      </section>

      {/* Prove */}
      <CheckpointQuiz sectionId={1} questions={QUIZ} threshold={3} />
    </article>
  )
}
