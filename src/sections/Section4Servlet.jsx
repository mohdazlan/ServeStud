import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { AnnotatedCode } from '../components/AnnotatedCode.jsx'
import { LifecycleStage } from '../components/LifecycleStage.jsx'
import { BeTheContainer } from '../components/BeTheContainer.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import {
  ChipBank,
  EXERCISE_HINT,
  ExerciseFooter,
  FillSlot,
  useSlotFill,
} from '../components/exercises.jsx'

// ——— Anatomy of a servlet (interactive code walkthrough) ———

const ANATOMY_NOTES = {
  webservlet: {
    label: '@WebServlet("/library/search")',
    body: 'This annotation maps a URL path to this class. Any request to /library/search lands here — the container reads this and does the routing for you.',
    metaphor: 'The name plate on the desk. This librarian handles the search desk.',
  },
  extendshttp: {
    label: 'extends HttpServlet',
    body: 'This is what makes the class a servlet. It inherits everything needed to receive HTTP requests and send HTTP responses.',
    metaphor: 'The librarian’s training. Extend HttpServlet and you know how to serve patrons.',
  },
  doget: {
    label: 'doGet(request, response)',
    body: 'Called when a GET request arrives. The container hands you two objects: the request (what they asked) and the response (an empty envelope to fill).',
    metaphor: 'What the librarian does when a patron walks up and asks a question.',
  },
  getparam: {
    label: 'request.getParameter("title")',
    body: 'Reads a value the client sent — here, the search term from ?title=Java in the URL.',
    metaphor: 'The librarian reading exactly what the patron wrote on the request slip.',
  },
  writer: {
    label: 'response.getWriter().println(...)',
    body: 'Writes the response body. Whatever you print here becomes the HTML the browser receives and renders.',
    metaphor: 'The librarian picking up a pen and writing the answer to hand back.',
  },
}

const ANATOMY_LINES = [
  { indent: 0, segments: [{ t: '@WebServlet("/library/search")', tone: 'ann', note: 'webservlet' }] },
  {
    indent: 0,
    segments: [
      { t: 'public class ', tone: 'kw' },
      { t: 'BookSearchServlet ', tone: 'ty' },
      { t: 'extends HttpServlet', tone: 'kw', note: 'extendshttp' },
      { t: ' {' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '@Override', tone: 'ann' }] },
  {
    indent: 2,
    segments: [
      { t: 'protected void ', tone: 'kw' },
      { t: 'doGet', tone: 'ty', note: 'doget' },
      { t: '(' },
      { t: 'HttpServletRequest', tone: 'ty' },
      { t: ' request,' },
    ],
  },
  {
    indent: 22,
    segments: [{ t: 'HttpServletResponse', tone: 'ty' }, { t: ' response)' }],
  },
  {
    indent: 22,
    segments: [
      { t: 'throws ', tone: 'kw' },
      { t: 'ServletException', tone: 'ty' },
      { t: ', ' },
      { t: 'IOException', tone: 'ty' },
      { t: ' {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' title = ' },
      { t: 'request.getParameter("title")', note: 'getparam' },
      { t: ';' },
    ],
  },
  { indent: 4, segments: [{ t: '// Search the catalog for the book...', tone: 'cm' }] },
  {
    indent: 4,
    segments: [{ t: 'response.setContentType(' }, { t: '"text/html"', tone: 'str' }, { t: ');' }],
  },
  {
    indent: 4,
    segments: [
      { t: 'response.getWriter().println', note: 'writer' },
      { t: '(' },
      { t: '"<h1>Results for: "', tone: 'str' },
      { t: ' + title + ' },
      { t: '"</h1>"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 2, segments: [{ t: '}' }] },
  { indent: 0, segments: [{ t: '}' }] },
]

// ——— A6: Be the Container ———

const CONTAINER_STEPS = [
  {
    time: '8:00 AM',
    scenario:
      'A request arrives for /library/search. You’ve never seen BookSearchServlet before. What do you do first?',
    options: [
      {
        label: 'Create an instance and call init()',
        correct: true,
        why: 'New desk, new librarian: load the class, create the one instance, call init() — once. Now it’s ready to serve.',
      },
      {
        label: 'Call service() immediately',
        correct: false,
        why: 'There’s nothing to call service() on yet — no instance exists. Create it and initialize it first.',
      },
      {
        label: 'Send a 404 error',
        correct: false,
        why: 'The servlet exists — it just isn’t loaded yet. Loading it is your job, container.',
      },
    ],
  },
  {
    time: '8:00:02 AM',
    scenario:
      'Two seconds later: BookSearchServlet is initialized, and another request arrives for /library/search. What do you do?',
    options: [
      {
        label: 'Create a new instance and call init() again',
        correct: false,
        why: 'init() happens once per lifetime. The librarian doesn’t re-do orientation for every patron.',
      },
      {
        label: 'Call service() on the existing instance',
        correct: true,
        why: 'Same librarian, next patron. This is the whole point of the design: one instance, many requests.',
      },
      {
        label: 'Call destroy() and start over',
        correct: false,
        why: 'Why fire the librarian mid-shift? destroy() is for shutdown — never between requests.',
      },
    ],
  },
  {
    time: '10:00 PM',
    scenario:
      'Closing time. The server is shutting down. What do you do with BookSearchServlet?',
    options: [
      {
        label: 'Just delete it from memory',
        correct: false,
        why: 'It might be holding things — open database connections, unsaved state. Give it the chance to clean up.',
      },
      {
        label: 'Call init() one more time',
        correct: false,
        why: 'init() opens the desk. You’re closing it. Wrong direction entirely.',
      },
      {
        label: 'Call destroy() to let it clean up, then remove it',
        correct: true,
        why: 'An orderly shutdown: destroy() once, resources released, then the instance is gone.',
      },
    ],
  },
]

// ——— Lifecycle sequencer ———

const SEQUENCE_CHIPS = [
  { id: 'first-request', label: 'First request arrives for this servlet’s URL pattern' },
  { id: 'load-class', label: 'Container loads the servlet class' },
  { id: 'create-instance', label: 'Container creates a servlet instance' },
  { id: 'call-init', label: 'Container calls init() on the new instance' },
  { id: 'call-service', label: 'Container calls service() for each incoming request' },
  { id: 'shutdown', label: 'Server shuts down' },
  { id: 'call-destroy', label: 'Container calls destroy() on the servlet' },
]

const SEQUENCE_SLOTS = SEQUENCE_CHIPS.map((c, i) => ({
  id: `pos-${i + 1}`,
  answer: c.id,
}))

function LifecycleSequencer() {
  const fill = useSlotFill({
    chips: SEQUENCE_CHIPS,
    slots: SEQUENCE_SLOTS,
    exerciseId: 's4-lifecycle-sequencer',
  })

  return (
    <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        Put the servlet’s whole life in order, from the very first request to
        the very end. {EXERCISE_HINT}
      </p>
      <ChipBank fill={fill} label="Events" />
      <ol className="mt-6 space-y-2.5">
        {SEQUENCE_SLOTS.map((slot, i) => (
          <li key={slot.id} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="w-6 shrink-0 text-right font-display text-lg font-semibold text-ink-muted tabular-nums"
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <FillSlot fill={fill} slotId={slot.id} srLabel={`Event number ${i + 1}`} compact />
            </div>
          </li>
        ))}
      </ol>
      <ExerciseFooter
        fill={fill}
        successText="Perfect order. Load → create → init() → service(), over and over → shutdown → destroy(). That’s a servlet’s whole life."
      />
    </div>
  )
}

const NDQ = [
  {
    q: 'Does init() run every time a request comes in?',
    a: 'No — exactly once, when the container first creates the servlet. After that, every request goes straight to service(). If init() ran per request, the librarian would be re-doing orientation for every patron.',
  },
  {
    q: 'What if the servlet crashes during service()?',
    a: 'The container catches the error and sends the client an error response. The servlet instance stays alive and keeps serving the next request — one bad question doesn’t end the librarian’s shift.',
  },
  {
    q: 'Can I have multiple instances of the same servlet?',
    a: 'Generally no — the container creates one instance and lets many requests share it (using threads). That’s why servlet code has to be careful with shared data: everyone is talking to the same librarian.',
  },
]

const QUIZ = [
  {
    id: 'q1',
    q: 'How many times is init() called during a servlet’s lifetime?',
    options: [
      'Once — when the servlet is first loaded',
      'Once per request',
      'Once per session',
      'It depends on the server configuration',
    ],
    answer: 0,
    explain:
      'init() is the once-per-lifetime setup call. Per-request work happens in service() / doGet().',
  },
  {
    id: 'q2',
    q: 'Which lifecycle method is called for EVERY incoming HTTP request?',
    options: ['init()', 'service()', 'destroy()', 'doStart()'],
    answer: 1,
    explain:
      'service() runs per request and routes to doGet() or doPost(). (doStart() doesn’t exist — nice try, exam writers.)',
  },
  {
    id: 'q3',
    q: 'A servlet needs to open a database connection that will be reused across many requests. Where should this code go?',
    options: ['In init()', 'In doGet()', 'In destroy()', 'In the constructor'],
    answer: 0,
    explain:
      'Reused resources belong in init() — set up once, used by every request. In doGet() you’d reconnect on every request.',
  },
  {
    id: 'q4',
    q: 'In the library metaphor, destroy() is like:',
    options: [
      'The librarian answering a question',
      'The library opening for the day',
      'The librarian packing up and saving work at closing time',
      'The patron leaving the library',
    ],
    answer: 2,
    explain:
      'destroy() is closing time: save state, release resources, clock out. Answering questions is service().',
  },
  {
    id: 'q5',
    q: 'Which statement about servlets is TRUE?',
    options: [
      'A new servlet instance is created for every request',
      'Servlets can only handle GET requests',
      'The same servlet instance handles many requests via service()',
      'destroy() is called before every service() call',
    ],
    answer: 2,
    explain:
      'One instance, many requests — that’s the core design. Watch the lifecycle animation again and count the librarians: it’s always one.',
  },
]

export default function Section4Servlet({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 4 · about 15 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        Meet the Servlet — Anatomy & Lifecycle
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topics 1.3.1–1.3.3 — servlet definition, architecture, lifecycle
      </p>

      <BrainPower>
        <p>
          You’ve been hearing about servlets for three sections. Time to finally
          meet one. A servlet is just a Java class. That’s it. But it’s a Java
          class with a very specific job — and a very specific life story.
        </p>
      </BrainPower>

      <DefinitionCard term="Servlet">
        <p>
          A Java class that extends <code>HttpServlet</code>, runs inside a web
          container, and handles HTTP requests by generating HTTP responses. In
          our library: the librarian — trained, managed by the building, and
          assigned to a service desk.
        </p>
      </DefinitionCard>

      {/* Learn — anatomy */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          Learn — anatomy of a servlet
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here’s a complete, working servlet — the search desk itself. It’s
          shorter than you expected, isn’t it?
        </p>
        <AnnotatedCode lines={ANATOMY_LINES} notes={ANATOMY_NOTES} />
      </section>

      {/* Learn — lifecycle (A5) */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          One librarian’s whole career
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Every servlet lives the same three-act life: set up once, serve many,
          clean up once. Watch a full day at the search desk — press play, or
          step through at your own pace.
        </p>
        <LifecycleStage />
      </section>

      {/* Learn — A6 role play */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Be the container
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Now flip it around. <strong>You</strong> are Tomcat. It’s your
          building, your rules, your librarians. Make the calls.
        </p>
        <BeTheContainer
          steps={CONTAINER_STEPS}
          exerciseId="s4-be-the-container"
          finale="Day complete. You loaded the class once, initialized once, served every request with the same instance, and shut down cleanly. That’s the entire lifecycle — and you just ran it."
        />
      </section>

      {/* Think */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Think — the lifecycle sequencer
        </h3>
        <LifecycleSequencer />
      </section>

      <NoDumbQuestions items={NDQ} />

      {/* Prove */}
      <CheckpointQuiz sectionId={4} questions={QUIZ} threshold={3} />
    </article>
  )
}
