import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import { Layers, ServerCog, Database, Globe2, FileText } from 'lucide-react'

const TIERS = [
  {
    title: 'Client Tier',
    icon: Globe2,
    description:
      'The browser side. This is where the patron lives. It sends requests and renders the response.',
    examples: ['Browser', 'HTML', 'CSS', 'JavaScript'],
    color: 'bg-amber/10 border-amber/20',
  },
  {
    title: 'Web Tier',
    icon: Layers,
    description:
      'The service desks. Servlets and JSP run here. This is the part of Java EE we use the most in Topic 1.',
    examples: ['Servlet', 'JSP', 'Web Container (Tomcat)'],
    color: 'bg-paper-aged border-hairline',
  },
  {
    title: 'Business Tier',
    icon: ServerCog,
    description:
      'The back office where business rules and processing live. It is important in large enterprise applications.',
    examples: ['EJB', 'Business logic', 'Rules engine'],
    color: 'bg-ink/5 border-ink/20',
  },
  {
    title: 'Data Tier',
    icon: Database,
    description:
      'The catalog room. This tier stores application data and answers queries for the web tier.',
    examples: ['Database', 'JDBC', 'Persistent storage'],
    color: 'bg-amber/5 border-amber/20',
  },
]

const SPOTLIGHTS = [
  {
    title: 'HTML',
    label: 'Client Tier',
    description:
      'The page structure the browser renders. Static or dynamic content is ultimately sent as HTML to the client.',
  },
  {
    title: 'Servlet',
    label: 'Web Tier',
    description:
      'A Java class that handles requests and builds responses. In our metaphor, the librarian at the service desk.',
  },
  {
    title: 'JSP',
    label: 'Web Tier',
    description:
      'JavaServer Pages let you write HTML templates with embedded Java. Useful for dynamic pages that mix content and presentation.',
  },
  {
    title: 'JDBC',
    label: 'Data Tier',
    description:
      'Java Database Connectivity. It is how Java code talks to the database and fetches information like book records.',
  },
]

const QUIZ = [
  {
    id: 'q1',
    q: 'Which tier contains Servlets and JSP?',
    options: ['Client Tier', 'Web Tier', 'Business Tier', 'Data Tier'],
    answer: 1,
    explain:
      'Servlets and JSP belong to the Web Tier, because that is where HTTP requests are handled and responses are generated.',
  },
  {
    id: 'q2',
    q: 'In the library metaphor, what is the Web Container (Tomcat)?',
    options: ['The patron', 'The book', 'The library building', 'The database'],
    answer: 2,
    explain:
      'The Web Container is the library building that manages the librarians (servlets), connections, and request handling.',
  },
  {
    id: 'q3',
    q: 'What does JDBC connect?',
    options: ['Browser to server', 'Servlet to database', 'HTML to CSS', 'Server to network'],
    answer: 1,
    explain:
      'JDBC is the bridge between Java code running on the server and the database storing application data.',
  },
  {
    id: 'q4',
    q: 'Which of these is NOT part of the Java EE tiered architecture?',
    options: ['Client Tier', 'Web Tier', 'Data Tier', 'Plugin Tier'],
    answer: 3,
    explain:
      'Plugin Tier is not a standard part of Java EE. The main tiers are Client, Web, Business, and Data.',
  },
]

const NDQ = [
  {
    q: 'If JSP also generates HTML, why do we still need Servlets?',
    a: 'Servlets are the core Java classes that handle requests and route traffic. JSP is mostly a template technology for HTML generation, while servlets provide the control and logic.',
  },
  {
    q: 'Is Tomcat the same as Java EE?',
    a: 'Tomcat is a web container that implements the Web Tier. Java EE is the broader application architecture that includes multiple tiers, not just the web container.',
  },
  {
    q: 'Do I need to learn all four tiers in this course?',
    a: 'No — this course focuses on the Web Tier, especially servlets. The other tiers are introduced so you understand the larger ecosystem.',
  },
]

function TierCard({ tier }) {
  const Icon = tier.icon
  return (
    <div className={`rounded-3xl border p-5 ${tier.color}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-ink shadow-sm">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold">{tier.title}</h4>
          <p className="text-sm text-ink-muted">{tier.description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {tier.examples.map((example) => (
          <p key={example} className="text-sm text-ink">
            • {example}
          </p>
        ))}
      </div>
    </div>
  )
}

function SpotlightCard({ item }) {
  return (
    <div className="rounded-3xl border border-hairline bg-paper-aged p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {item.label}
      </p>
      <h4 className="mt-2 font-display text-lg font-semibold">{item.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.description}</p>
    </div>
  )
}

export default function Section3JavaEE({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 3 · about 12 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        The Java EE Universe — Where Everything Lives
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topics 1.2.1, 1.2.2 — Java EE architecture and technologies
      </p>

      <BrainPower>
        <p>
          Dynamic pages need more than a servlet. They need an entire ecosystem: the
          browser, the web container, the business logic, and the database. Java EE is
          the architecture that makes all of that work together.
        </p>
      </BrainPower>

      <DefinitionCard term="Java EE architecture">
        <p>
          A layered application design for enterprise Java. In our library metaphor,
          it is the full system: the patron, the service desks, the back office, and the
          catalog room. We focus mostly on the Web Tier, but the other tiers matter too.
        </p>
      </DefinitionCard>

      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">Learn — the tier cake</h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Java EE is not just one thing. It is a set of tiers, each with its own job.
          Stack them together and you get the full web application architecture.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {TIERS.map((tier) => (
            <TierCard key={tier.title} tier={tier} />
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">Learn — key technologies</h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here are the pieces you will meet in the Java EE universe. Some you will use
          this course, and some you should just know by name.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SPOTLIGHTS.map((item) => (
            <SpotlightCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-amber/30 bg-amber/5 p-6">
        <h3 className="font-display text-2xl font-semibold">Why this matters</h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-muted">
          A servlet is powerful, but it is only one part of a larger application.
          When you build real Java web apps, you need to understand where that servlet
          lives and what else supports it.
        </p>
      </section>

      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">Think — tier mapping</h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Match each technology to the tier it belongs in. The right answer helps you
          place servlets inside the bigger Java EE picture.
        </p>
        <div className="mt-6 overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full text-sm">
            <thead className="bg-paper-aged border-b border-hairline">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Technology</th>
                <th className="px-4 py-3 text-left font-semibold">Tier</th>
                <th className="px-4 py-3 text-left font-semibold">Why it belongs there</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              <tr className="hover:bg-paper-aged/50">
                <td className="px-4 py-3">Servlet</td>
                <td className="px-4 py-3">Web Tier</td>
                <td className="px-4 py-3 text-ink-muted">Handles HTTP requests and builds responses.</td>
              </tr>
              <tr className="hover:bg-paper-aged/50">
                <td className="px-4 py-3">JDBC</td>
                <td className="px-4 py-3">Data Tier</td>
                <td className="px-4 py-3 text-ink-muted">Connects Java code to the database.</td>
              </tr>
              <tr className="hover:bg-paper-aged/50">
                <td className="px-4 py-3">HTML</td>
                <td className="px-4 py-3">Client Tier</td>
                <td className="px-4 py-3 text-ink-muted">The browser renders it for the user.</td>
              </tr>
              <tr className="hover:bg-paper-aged/50">
                <td className="px-4 py-3">EJB</td>
                <td className="px-4 py-3">Business Tier</td>
                <td className="px-4 py-3 text-ink-muted">Handles reusable business logic in enterprise apps.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <NoDumbQuestions items={NDQ} />

      <CheckpointQuiz sectionId={3} questions={QUIZ} threshold={3} />
    </article>
  )
}
