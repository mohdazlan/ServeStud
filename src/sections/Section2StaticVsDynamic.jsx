import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import {
  ChipBank,
  EXERCISE_HINT,
  ExerciseFooter,
  FillSlot,
  useSlotFill,
} from '../components/exercises.jsx'
import { Database, FileText, Zap } from 'lucide-react'

// ——— Side-by-side static vs dynamic comparison ———

function StaticVsDynamicComparison() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {/* Static */}
      <div className="rounded-xl border-2 border-ink/20 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={24} className="text-ink-muted" />
          <h4 className="font-display text-xl font-semibold">Static</h4>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-amber">The Scene</p>
            <p className="mt-1 text-sm leading-relaxed">
              Patron asks "Do you have books about Java?" → Librarian hands them a
              pre-printed flyer (same one, every time). Made last month. Always shows
              5 books.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber">The Reality</p>
            <p className="mt-1 text-sm leading-relaxed">
              Pre-built HTML files sit on the server's disk. Same file, same content,
              every time. Yesterday's new Java book? Not on the flyer.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber">The Tradeoff</p>
            <p className="mt-1 text-sm text-ink-muted">
              <strong>✓ Fast</strong> — just send the file. <strong>✗ Inflexible</strong>
              — can't show current data.
            </p>
          </div>

          <div className="rounded bg-paper-aged p-3">
            <p className="font-mono text-xs">
              GET /library/about.html →{'\n'}
              [File lookup] →{'\n'}
              [Send file] ✓
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic */}
      <div className="rounded-xl border-2 border-amber/40 bg-amber/5 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap size={24} className="text-amber" />
          <h4 className="font-display text-xl font-semibold">Dynamic</h4>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-amber">The Scene</p>
            <p className="mt-1 text-sm leading-relaxed">
              Same patron asks the same question → Librarian actually listens, checks the
              catalog database right now, writes a fresh answer showing 6 books
              (including yesterday's new arrival).
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber">The Reality</p>
            <p className="mt-1 text-sm leading-relaxed">
              A <strong>program</strong> runs on the server, processes the request,
              queries the database, and <strong>generates</strong> a fresh HTML page
              right now. Different for every request (and every user).
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-amber">The Tradeoff</p>
            <p className="mt-1 text-sm text-ink-muted">
              <strong>✓ Flexible</strong> — shows current data. <strong>✗ Slower</strong>
              — requires computation and database queries.
            </p>
          </div>

          <div className="rounded bg-paper-aged p-3">
            <p className="font-mono text-xs">
              GET /library/search?q=java →{'\n'}
              [Run servlet code] →{'\n'}
              [Query database] →{'\n'}
              [Generate HTML] →{'\n'}
              [Send fresh page] ✓
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ——— Real-world examples ———

function RealWorldExamples() {
  const examples = [
    {
      page: 'Library "About Us" page',
      type: 'Static',
      why: 'Same info for everyone, changes only once a year.',
    },
    {
      page: 'Search results for "Java"',
      type: 'Dynamic',
      why: 'Results depend on what you search. Every request is different.',
    },
    {
      page: "Patron's borrowing history",
      type: 'Dynamic',
      why: 'Personal data. Must be fetched from database. Different for each user.',
    },
    {
      page: 'Library opening hours',
      type: 'Static',
      why: 'Same for everyone. Rarely changes. No personalization needed.',
    },
    {
      page: '"3 books are overdue" notice',
      type: 'Dynamic',
      why: 'Specific to this patron. Calculated from their borrowing database.',
    },
    {
      page: 'Site navigation menu',
      type: 'Static',
      why: 'Same links for everyone, every time. Never changes.',
    },
  ]

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full text-sm">
        <thead className="bg-paper-aged border-b border-hairline">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Page</th>
            <th className="px-4 py-2 text-left font-semibold">Type</th>
            <th className="px-4 py-2 text-left font-semibold">Why?</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {examples.map((ex, i) => (
            <tr key={i} className="hover:bg-paper-aged/50">
              <td className="px-4 py-2 text-sm">{ex.page}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                    ex.type === 'Static'
                      ? 'bg-ink/10 text-ink'
                      : 'bg-amber/10 text-amber'
                  }`}
                >
                  {ex.type}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-ink-muted">{ex.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ——— "Be the Server" exercise ———

const STATIC_DYNAMIC_CHIPS = [
  { id: 'static', label: 'Static' },
  { id: 'dynamic', label: 'Dynamic' },
]

const DECISION_SCENARIOS = [
  {
    id: 'scenario-1',
    request: 'GET /library/about.html',
    explanation:
      "This is the library's \"About Us\" page — same content for everyone. Pre-built HTML, just send it.",
    answer: 'static',
  },
  {
    id: 'scenario-2',
    request: 'GET /library/search?q=database',
    explanation:
      'A search request. The results depend on the query. Must query the database and generate results on the fly.',
    answer: 'dynamic',
  },
  {
    id: 'scenario-3',
    request: 'GET /library/member/12345/loans',
    explanation:
      "Showing a specific patron's borrowing history. Personal data from the database. Different for each patron.",
    answer: 'dynamic',
  },
  {
    id: 'scenario-4',
    request: 'GET /library/contact.html',
    explanation: "The library's contact page — same phone number and address for everyone.",
    answer: 'static',
  },
  {
    id: 'scenario-5',
    request: 'GET /library/recommend/member/67890',
    explanation:
      "Book recommendations based on this patron's reading history. Must query preferences and generate a personalized list.",
    answer: 'dynamic',
  },
]

function BeTheServerExercise() {
  return (
    <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
      <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
        Five requests arrive. For each one, decide: would you serve a static page or generate
        a dynamic one? {EXERCISE_HINT}
      </p>

      <div className="mt-6 space-y-6">
        {DECISION_SCENARIOS.map((scenario, i) => (
          <div
            key={scenario.id}
            className="rounded-lg border border-hairline/50 p-4 hover:border-amber/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-mono text-sm font-semibold text-ink">
                  Request {i + 1}
                </p>
                <p className="mt-1 font-mono text-xs text-ink-muted">{scenario.request}</p>
              </div>
            </div>

            <div className="mt-4 rounded bg-paper-aged px-3 py-2">
              <p className="text-xs text-ink-muted leading-relaxed">{scenario.explanation}</p>
            </div>

            <div className="mt-3 flex gap-2">
              {STATIC_DYNAMIC_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  className="rounded px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-amber/10"
                  onClick={() => {
                    if (chip.id === scenario.answer) {
                      alert(`✓ Correct! ${scenario.explanation}`);
                    } else {
                      alert(
                        `Not quite. This one is ${scenario.answer.toUpperCase()}. ${scenario.explanation}`
                      );
                    }
                  }}
                >
                  {chip.label === 'Static' ? '📄 Static' : '⚡ Dynamic'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ——— Fireside chat ———

function FiresideChat() {
  return (
    <div className="mt-6 space-y-4 rounded-xl border border-hairline bg-paper-aged/30 p-6">
      <p className="text-sm font-semibold text-ink-muted">
        A conversation between two approaches:
      </p>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/10 font-semibold text-sm">
            📄
          </div>
          <div className="flex-1 rounded-lg bg-white px-4 py-3">
            <p className="font-semibold text-ink text-sm">Static:</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              I'm fast and reliable. The server just grabs me off the shelf — no
              thinking required. Send me, done.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/10 font-semibold text-sm">
            ⚡
          </div>
          <div className="flex-1 rounded-lg bg-white px-4 py-3">
            <p className="font-semibold text-ink text-sm">Dynamic:</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Sure, but you can't tell anyone their actual borrowing status. You just
              show the same pamphlet to everyone, no matter what they ask.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/10 font-semibold text-sm">
            📄
          </div>
          <div className="flex-1 rounded-lg bg-white px-4 py-3">
            <p className="font-semibold text-ink text-sm">Static:</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              At least I never crash. I'm just a file. You need a whole program to run
              you, and if it breaks...
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/10 font-semibold text-sm">
            ⚡
          </div>
          <div className="flex-1 rounded-lg bg-white px-4 py-3">
            <p className="font-semibold text-ink text-sm">Dynamic:</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              True, complexity is my downside. But without me, the library would just be
              a brochure — no search, no accounts, no personalization. I'm why we exist.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/10 font-semibold text-sm">
            📄
          </div>
          <div className="flex-1 rounded-lg bg-white px-4 py-3">
            <p className="font-semibold text-ink text-sm">Static:</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              Fair point. Maybe we both have a place. About pages? Me. Search results?
              All you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ——— Quiz ———

const QUIZ = [
  {
    id: 'q1',
    q: 'The library\'s "About Us" page shows the same content to every visitor. This is a _____ web page.',
    options: ['Static', 'Dynamic', 'Hybrid', 'Cached'],
    answer: 0,
    explain:
      'Static — no computation needed. Same content for everyone, just serve the pre-built file.',
  },
  {
    id: 'q2',
    q: 'A patron searches the catalog for "database". The server queries the database, builds a page showing 8 results, and sends it back. This is a _____ web page.',
    options: ['Static', 'Dynamic', 'Temporary', 'Compiled'],
    answer: 1,
    explain:
      'Dynamic — the server generated this page on-the-fly based on the search query and current database contents.',
  },
  {
    id: 'q3',
    q: 'What is the MAIN limitation of static web pages?',
    options: [
      'They are slow to load',
      'They cannot use HTML',
      'They show the same content regardless of who visits or what they need',
      'They don\'t work in modern browsers',
    ],
    answer: 2,
    explain:
      'Static pages are pre-built and unchanged, so every user sees identical content. No personalization, no dynamic data.',
  },
  {
    id: 'q4',
    q: 'Why do dynamic web pages need server-side programs (like servlets)?',
    options: [
      'To make pages load faster',
      'To store HTML files',
      'To generate customized content by processing logic and/or querying databases',
      'To connect to the internet',
    ],
    answer: 2,
    explain:
      'Dynamic pages are generated on-the-fly. A program (servlet) must run on the server to process the request, fetch data, apply logic, and build the response.',
  },
  {
    id: 'q5',
    q: 'Which of these is BEST served as a static page?',
    options: [
      'A patron\'s personal reading history',
      'The library\'s contact information',
      'A search results page',
      'A list of currently overdue items',
    ],
    answer: 1,
    explain:
      'Contact info is static — same address, phone, hours for everyone, rarely changes. Everything else requires personalization or dynamic data.',
  },
]

// ——— NDQ ———

const NDQ = [
  {
    q: 'Can a single website have both static and dynamic pages?',
    a: 'Absolutely! Most real websites do. Static files for brochure-type content (About, Contact, Help), dynamic servlets for interactive features (Search, Accounts, Shopping Cart).',
  },
  {
    q: 'If dynamic pages need a program to run, doesn\'t that make them insecure?',
    a: 'Good question — complexity does introduce risk. That\'s why you validate input, sanitize data, and write careful code. But modern frameworks and practices manage this. Static pages have zero logic, so zero security bugs... but also zero functionality.',
  },
  {
    q: 'Static files are just sitting on the disk — what format are they?',
    a: 'Usually HTML (text). The server just reads them and sends them as-is. No processing. That\'s why they\'re fast.',
  },
  {
    q: 'If I update a static HTML file, do visitors see the change immediately?',
    a: 'Usually yes — the next time they request it, they get the new file. Though browsers cache files, so they might see the old version until the cache expires. Browsers are smart about this, but it can be tricky.',
  },
  {
    q: 'Why not just make everything dynamic? Isn\'t it more flexible?',
    a: 'Complexity and performance. Static files are dead simple: find file, send file. Dynamic pages need a database, validation logic, error handling. More potential bugs. For simple content, static is better.',
  },
]

export default function Section2StaticVsDynamic({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 2 · about 10 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        Static vs Dynamic — Why Servlets Exist
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topics 1.1.2, 1.1.3 — static and dynamic web pages
      </p>

      <BrainPower>
        <p>
          Imagine a library where every question gets the same printed pamphlet as an
          answer, no matter what you ask. That's a static website. Now imagine a
          librarian who actually listens, checks the shelves, and gives you a
          personalized answer. That's dynamic. The "librarian" is a <strong>servlet</strong>.
        </p>
      </BrainPower>

      {/* Learn — Static vs Dynamic comparison */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          Learn — static vs dynamic
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here's the core distinction: one type of page is pre-built and unchanging. The
          other is generated fresh for every request. One is a pamphlet. One is a
          librarian.
        </p>
        <StaticVsDynamicComparison />
      </section>

      {/* Real-world examples */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Real-world examples
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Every page you visit online is one or the other. Here are some from our library:
        </p>
        <RealWorldExamples />
      </section>

      {/* Key insight */}
      <section className="mt-16 rounded-xl bg-amber/5 border border-amber/30 p-6">
        <h3 className="font-semibold text-ink flex items-center gap-2">
          <Zap size={20} className="text-amber" />
          The key insight
        </h3>
        <p className="mt-3 leading-relaxed text-sm">
          If you need a dynamic page — custom content, database queries, personalization — you
          need a <strong>program running on the server</strong> to generate it. In Java, that
          program is called a <strong>Servlet</strong>. That's the entire reason servlets exist.
        </p>
      </section>

      {/* Think — exercises */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Think — be the server
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Five requests arrive at your server. For each one, decide: static or dynamic?
          Click the answer to see if you're right.
        </p>
        <BeTheServerExercise />
      </section>

      {/* Fireside chat */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          The friendly debate
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Both have a place. Here's what they each have to say:
        </p>
        <FiresideChat />
      </section>

      <NoDumbQuestions items={NDQ} />

      {/* Prove */}
      <CheckpointQuiz sectionId={2} questions={QUIZ} threshold={3} />
    </article>
  )
}
