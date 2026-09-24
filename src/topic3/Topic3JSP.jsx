import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileCode,
  Info,
  Layers3,
  PlayCircle,
  Terminal,
  Zap,
} from 'lucide-react'

const STAGES = [
  { id: 'idea', label: 'The idea' },
  { id: 'language', label: 'JSP language' },
  { id: 'import', label: 'Load Northwind' },
  { id: 'view', label: 'Build a JOIN view' },
  { id: 'checkpoint', label: 'Checkpoint' },
]

const VIEW_SQL = `USE northwind;

CREATE OR REPLACE VIEW customer_order_overview AS
SELECT
    c.id AS customer_id,
    c.company AS customer_company,
    o.id AS order_id,
    o.order_date AS order_date
FROM customers AS c
LEFT JOIN orders AS o
    ON o.customer_id = c.id;

SELECT customer_id, customer_company, order_id, order_date
FROM customer_order_overview
ORDER BY customer_id, order_id;`

const IMPORT_CHECKS = [
  'I connected to my local MySQL server in Workbench.',
  'I ran northwind.sql first and confirmed the northwind schema appears.',
  'I ran northwind-data.sql second and checked the Action Output for errors.',
  'I refreshed Schemas and confirmed customers and orders contain rows.',
]

const VIEW_TUTORIAL_CHECKS = [
  'I downloaded all three SQL files: northwind.sql, northwind-data.sql, and customer-order-view.sql.',
  'I connected to my local MySQL instance in Workbench.',
  'I executed northwind.sql (Schema) and saw green checkmarks in Action Output.',
  'I executed northwind-data.sql (Data) and verified row counts in customers and orders.',
  'I executed customer-order-view.sql to create the customer_order_overview VIEW.',
  'I refreshed Schemas, found the new view under Views, and queried it.',
  'I ran WHERE order_id IS NULL and identified customers who have never placed an order.',
]

const VIEW_TUTORIAL_STEPS = {
  step1: {
    tabLabel: '1. Schema Script',
    title: 'Step 1: Execute northwind.sql (Build Database Schema)',
    file: 'northwind.sql',
    badge: 'Run 1st',
    download: '/sql/northwind.sql',
    summary: 'Creates the northwind schema and initializes all table structures.',
    instructions: [
      'Launch MySQL Workbench and click your local connection card (e.g. Local instance MySQL80 on localhost:3306).',
      'Go to File → Open SQL Script... (or press Ctrl+Shift+O / Cmd+Shift+O) and select northwind.sql.',
      'Important: With nothing highlighted in the editor, click the Lightning Bolt (⚡) button in the SQL toolbar to execute the entire script.',
      'Check the Action Output panel at the bottom: verify that green checkmarks appear for CREATE SCHEMA northwind and all table creation commands.',
    ],
    tip: 'The script begins with DROP SCHEMA IF EXISTS northwind;. If an older broken schema exists, it resets it cleanly.',
  },
  step2: {
    tabLabel: '2. Data Script',
    title: 'Step 2: Execute northwind-data.sql (Populate Records)',
    file: 'northwind-data.sql',
    badge: 'Run 2nd',
    download: '/sql/northwind-data.sql',
    summary: 'Inserts sample customers, orders, products, and associated transaction data.',
    instructions: [
      'Open another SQL tab via File → Open SQL Script... and select northwind-data.sql.',
      'Click the Lightning Bolt (⚡) button to run all INSERT statements. The script begins with USE northwind;, directing data into the newly created database.',
      'Wait 2–5 seconds for all batch insertions to finish with green ticks in the Action Output tray.',
      'In the left Navigator panel, click the Schemas tab and click the Refresh button (🔄) at the top-right of the panel.',
      'Expand northwind → Tables to confirm tables exist, then run the verification query below.',
    ],
    verifySql: `USE northwind;

-- Verify table row counts
SELECT COUNT(*) AS total_customers FROM customers;
SELECT COUNT(*) AS total_orders FROM orders;

-- Preview sample records
SELECT id, company FROM customers LIMIT 5;
SELECT id, customer_id, order_date FROM orders LIMIT 5;`,
  },
  step3: {
    tabLabel: '3. Build VIEW',
    title: 'Step 3: Execute customer-order-view.sql (Build the JOIN View)',
    file: 'customer-order-view.sql',
    badge: 'Run 3rd',
    download: '/sql/customer-order-view.sql',
    summary: 'Packages the customer–order LEFT JOIN into a permanent, reusable virtual table.',
    instructions: [
      'Go to File → Open SQL Script... and open customer-order-view.sql (or create a new tab with Ctrl+T / Cmd+T and paste the SQL code).',
      'Column Collision Rule: Notice c.id AS customer_id and o.id AS order_id. Because both tables share the column name id, giving distinct aliases is required to prevent MySQL Error 1060 (Duplicate column name).',
      'Execute the script with the Lightning Bolt (⚡).',
      'In the left Schemas panel, expand northwind → Views. Right-click Views and select Refresh if needed. You will see customer_order_overview appear!',
    ],
    viewSql: VIEW_SQL,
  },
  step4: {
    tabLabel: '4. Query & Verify',
    title: 'Step 4: Query the View & Inspect Unmatched Customers',
    summary: 'Query the new view like a table and verify matched vs unmatched customer records.',
    instructions: [
      'Query the entire view: SELECT * FROM customer_order_overview;. Observe that customers with multiple orders repeat once per order.',
      'Test unmatched customers with WHERE order_id IS NULL: This identifies customers who have NEVER placed an order.',
      'Why order_id IS NULL? order_id is a primary key in orders. It is only NULL when the LEFT JOIN fails to find a matching order for that customer.',
      'Compare with INNER JOIN: In an INNER JOIN, customers without orders are completely dropped from the response.',
    ],
    querySql: `USE northwind;

-- 1. Query the view (first 10 joined rows)
SELECT customer_id, customer_company, order_id, order_date
FROM customer_order_overview
LIMIT 10;

-- 2. Find unmatched customers (customers with zero orders)
SELECT customer_id, customer_company
FROM customer_order_overview
WHERE order_id IS NULL
ORDER BY customer_id;

-- 3. Compare with INNER JOIN (unmatched customers disappear!)
SELECT c.id AS customer_id, c.company, o.id AS order_id
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.id;`,
  },
}

const QUESTIONS = [
  {
    prompt: 'A browser requests catalog.jsp. What runs the Java in that file?',
    options: ['The browser', 'Tomcat on the server', 'MySQL Workbench'],
    answer: 1,
    why: 'Tomcat translates the JSP into servlet code and executes it on the server. The browser receives HTML.',
  },
  {
    prompt: 'Which JSP form inserts the value of an expression into the response?',
    options: ['<%= expression %>', '<%@ page ... %>', '<%-- comment --%>'],
    answer: 0,
    why: 'An expression tag evaluates the expression and writes its result to the response.',
  },
  {
    prompt: 'Which file should run first in Workbench?',
    options: ['northwind-data.sql', 'Either file', 'northwind.sql'],
    answer: 2,
    why: 'The schema file creates the tables. The data file uses those tables for its INSERT statements.',
  },
  {
    prompt: 'In a LEFT JOIN from customers to orders, how do you identify a customer without an order?',
    options: ['order_date IS NULL', 'order_id IS NULL', 'company IS NULL'],
    answer: 1,
    why: 'orders.id is a non-null primary key, so a null order ID marks the unmatched row. An existing order can have a null date.',
  },
]

function Code({ children, label }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }
  return <div className="mt-5 overflow-hidden rounded-xl border border-hairline bg-shelf text-paper">
    <div className="flex items-center justify-between border-b border-paper/15 px-4 py-2 text-xs text-paper/80">
      <span>{label}</span>
      <button type="button" onClick={copy} className="flex min-h-9 items-center gap-1.5 rounded-md px-2 hover:bg-paper/10" aria-label={`Copy ${label}`}>
        {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
    <pre className="overflow-x-auto p-4 text-[0.82rem] leading-relaxed"><code>{children}</code></pre>
  </div>
}

function SectionHeading({ eyebrow, children }) {
  return <div className="border-b border-hairline pb-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lamp">{eyebrow}</p>
    <h2 className="mt-2 text-3xl font-semibold leading-tight">{children}</h2>
  </div>
}

export default function Topic3JSP({ onBack }) {
  const [stage, setStage] = useState('idea')
  const [flowStep, setFlowStep] = useState(0)
  const [syntax, setSyntax] = useState('directive')
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('servestud-topic3-import') || '[]') } catch { return [] }
  })
  const [viewStep, setViewStep] = useState('step1')
  const [viewChecks, setViewChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('servestud-topic3-view-checks') || '[]') } catch { return [] }
  })
  const [answers, setAnswers] = useState({})
  const [graded, setGraded] = useState(false)
  const [joinChoice, setJoinChoice] = useState('')
  const [conditionChoice, setConditionChoice] = useState('')
  const [joinChecked, setJoinChecked] = useState(false)

  useEffect(() => { document.title = 'Topic 3 · Introduction to JSP · ServeStud' }, [])
  useEffect(() => {
    try { localStorage.setItem('servestud-topic3-import', JSON.stringify(checks)) } catch { /* Storage may be unavailable. */ }
  }, [checks])
  useEffect(() => {
    try { localStorage.setItem('servestud-topic3-view-checks', JSON.stringify(viewChecks)) } catch { /* Storage may be unavailable. */ }
  }, [viewChecks])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [stage])

  const current = STAGES.findIndex((item) => item.id === stage)
  const next = STAGES[current + 1]
  const flow = [
    ['Patron asks', 'The browser requests /library/catalog.jsp.'],
    ['Tomcat prepares the page', 'On its first request, Tomcat translates the JSP into a servlet and compiles it. Later requests use the compiled class until it changes.'],
    ['Server runs the code', 'The servlet handles the request and produces an HTML response. Database access, if any, happens here on the server.'],
    ['Patron sees the answer', 'The browser receives HTML. It does not receive the JSP source or server-side Java.'],
  ]
  const syntaxItems = {
    directive: { title: 'Page directive', code: '<%@ page contentType="text/html; charset=UTF-8" %>', explanation: 'Configuration for the JSP translator. It sets the type and character encoding of the response.' },
    expression: { title: 'Expression', code: '<%= 2 + 3 %>', explanation: 'Evaluates an expression and writes its result into the HTML. In this case, the page displays 5.' },
    scriptlet: { title: 'Scriptlet (legacy)', code: '<% String title = "Library catalog"; %>', explanation: 'Runs Java statements inside the generated servlet. You will read this in the video, but new pages are usually clearer when Java logic stays in a servlet and JSP renders the prepared data.' },
    el: { title: 'Expression Language', code: '${book.title}', explanation: 'Reads a named value or property supplied to the page. It keeps display markup easier to scan than Java scriptlets. Escape untrusted output when rendering HTML.' },
  }

  return <div className="min-h-svh bg-paper text-ink">
    <a href="#topic3-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:text-white">Skip to lesson</a>
    <header className="border-b border-hairline bg-paper-aged">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-lamp">ServeStud · DFP50283</p><h1 className="font-display text-xl font-semibold">Introduction to JavaServer Pages</h1></div>
        <button type="button" onClick={onBack} className="flex min-h-10 items-center gap-2 rounded-lg border border-hairline px-3 text-sm font-semibold hover:bg-paper"><ArrowLeft size={16} /> Topic 1</button>
      </div>
    </header>
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <nav aria-label="Topic 3 lesson sections" className="lg:sticky lg:top-8 lg:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Your route</p>
        <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
          {STAGES.map((item, index) => <li key={item.id} className="shrink-0"><button type="button" onClick={() => setStage(item.id)} aria-current={stage === item.id ? 'step' : undefined} className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm ${stage === item.id ? 'bg-lamp font-semibold text-white' : 'border border-hairline hover:bg-paper-aged'}`}><span className="font-mono text-xs opacity-75">{index + 1}</span>{item.label}</button></li>)}
        </ol>
      </nav>
      <main id="topic3-main" className="min-w-0 max-w-3xl pb-16">
        {stage === 'idea' && <article>
          <SectionHeading eyebrow="Learn · 8 min">A page that writes the answer</SectionHeading>
          <p className="mt-6 text-lg leading-relaxed">You already know the librarian: the servlet handles a patron’s request. JSP is the answer sheet the librarian can fill with today’s information before handing it back.</p>
          <div className="mt-7 rounded-xl bg-shelf px-6 py-5 text-paper"><p className="font-display text-lg font-semibold">Brain Power</p><p className="mt-2">If the catalog changes this morning, why would a printed HTML poster be a poor way to show available books?</p></div>
          <p className="mt-7 leading-relaxed"><strong>JavaServer Pages (JSP)</strong> lets you write an HTML page with server-side dynamic parts. Tomcat translates that page into a servlet, runs it, and sends the resulting HTML to the browser. A JSP is therefore part of the same request and response story as Topic 1.</p>
          <div className="mt-8 rounded-xl border border-hairline bg-paper-aged p-5">
            <div className="flex items-center gap-3"><Layers3 className="text-lamp" size={22} /><div><p className="font-semibold">Follow one request</p><p className="text-sm text-ink-muted">Step through what happens when a patron opens the catalog.</p></div></div>
            <div className="mt-5 min-h-28 rounded-lg bg-paper p-4" aria-live="polite"><p className="text-xs font-semibold uppercase tracking-wider text-lamp">{flowStep + 1} of {flow.length}</p><h3 className="mt-1 text-lg font-semibold">{flow[flowStep][0]}</h3><p className="mt-1 leading-relaxed">{flow[flowStep][1]}</p></div>
            <div className="mt-4 flex gap-2"><button type="button" disabled={flowStep === 0} onClick={() => setFlowStep(flowStep - 1)} className="min-h-10 rounded-lg border border-hairline px-4 disabled:opacity-45">Back</button><button type="button" disabled={flowStep === flow.length - 1} onClick={() => setFlowStep(flowStep + 1)} className="min-h-10 rounded-lg bg-amber px-4 font-semibold text-white disabled:opacity-45">Next step</button></div>
          </div>
          <p className="mt-6 text-sm text-ink-muted">Remember the boundary: the browser only sees the response. Java and SQL stay on the server.</p>
        </article>}

        {stage === 'language' && <article>
          <SectionHeading eyebrow="Learn + Think · 10 min">Read a JSP page</SectionHeading>
          <p className="mt-6 leading-relaxed">A JSP mixes ordinary HTML with special syntax that Tomcat processes. Select each form to see its job.</p>
          <div role="tablist" aria-label="JSP syntax" className="mt-6 flex flex-wrap gap-2">{Object.entries(syntaxItems).map(([key, item]) => <button key={key} id={`tab-${key}`} type="button" role="tab" aria-selected={syntax === key} aria-controls="syntax-panel" onClick={() => setSyntax(key)} className={`min-h-10 rounded-lg px-3 text-sm font-semibold ${syntax === key ? 'bg-lamp text-white' : 'border border-hairline hover:bg-paper-aged'}`}>{item.title}</button>)}</div>
          <div id="syntax-panel" role="tabpanel" aria-labelledby={`tab-${syntax}`} className="mt-4 rounded-xl border border-hairline p-5"><h3 className="text-lg font-semibold">{syntaxItems[syntax].title}</h3><Code label="JSP example">{syntaxItems[syntax].code}</Code><p className="mt-4 leading-relaxed">{syntaxItems[syntax].explanation}</p></div>
          <div className="mt-10 border-t border-hairline pt-8"><h3 className="font-display text-2xl font-semibold">Put the pieces together</h3><Code label="catalog.jsp">{`<%@ page contentType="text/html; charset=UTF-8" %>
<!doctype html>
<html lang="en">
<head><title>Library catalog</title></head>
<body>
  <h1>Library catalog</h1>
  <p>Available books: ${availableCount}</p>
</body>
</html>`}</Code><p className="mt-4 leading-relaxed">The servlet can place <code>availableCount</code> on the request before forwarding to this page. The JSP then renders the count. That division keeps request handling and presentation easier to maintain.</p></div>
          <div className="mt-8 rounded-xl bg-paper-aged p-5"><p className="font-semibold">Think</p><p className="mt-2">If <code>availableCount</code> is 12, what HTML text appears in the browser?</p><details className="mt-3"><summary className="cursor-pointer font-semibold text-lamp">Reveal answer</summary><p className="mt-2">Available books: 12. The browser sees the resulting text, not the <code>${'{availableCount}'}</code> source.</p></details></div>
        </article>}

        {stage === 'import' && <article>
          <SectionHeading eyebrow="Lab · 15 min">Load Northwind in MySQL Workbench</SectionHeading>
          <p className="mt-6 leading-relaxed">Before your JSP can show database results, prepare a local sample database. The two scripts have different jobs and must run in order.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href="/sql/northwind.sql" download className="rounded-xl border border-hairline bg-paper-aged p-5 hover:border-lamp"><Database className="text-lamp" size={22} /><span className="mt-3 block font-semibold">1. northwind.sql</span><span className="mt-1 block text-sm text-ink-muted">Creates the schema, tables, and relationships.</span><span className="mt-4 flex items-center gap-1 text-sm font-semibold text-lamp"><Download size={15} /> Download script</span></a>
            <a href="/sql/northwind-data.sql" download className="rounded-xl border border-hairline bg-paper-aged p-5 hover:border-lamp"><Database className="text-lamp" size={22} /><span className="mt-3 block font-semibold">2. northwind-data.sql</span><span className="mt-1 block text-sm text-ink-muted">Adds the sample customer and order records.</span><span className="mt-4 flex items-center gap-1 text-sm font-semibold text-lamp"><Download size={15} /> Download script</span></a>
          </div>
          <div className="mt-6 rounded-xl border border-incorrect/50 bg-incorrect/10 p-5"><p className="font-semibold">Use a disposable local database</p><p className="mt-1 leading-relaxed">The first script starts with <code>DROP SCHEMA IF EXISTS northwind</code>. Running it again deletes any existing <code>northwind</code> schema and its data. Back up work you need before running it.</p></div>
          <ol className="mt-8 space-y-5 border-l-2 border-lamp/40 pl-6">
            <li><h3 className="font-semibold">Connect</h3><p className="mt-1">Open MySQL Workbench and open your local MySQL connection. You need an account that can create a schema and tables.</p></li>
            <li><h3 className="font-semibold">Run the schema script</h3><p className="mt-1">Choose <strong>File → Open SQL Script</strong> and open <code>northwind.sql</code>. With nothing selected, click the lightning-bolt button that executes the full script. Check the <strong>Action Output</strong> for errors.</p></li>
            <li><h3 className="font-semibold">Run the data script</h3><p className="mt-1">Open <code>northwind-data.sql</code> in a new SQL tab. Execute the full script. It contains <code>USE northwind</code>, so the schema must already exist.</p></li>
            <li><h3 className="font-semibold">Verify the result</h3><p className="mt-1">Refresh the <strong>Schemas</strong> panel, expand <code>northwind → Tables</code>, and run the checks below. A successful import returns positive counts for both tables.</p></li>
          </ol>
          <Code label="Workbench verification">{`USE northwind;
SHOW TABLES;
SELECT COUNT(*) AS customer_count FROM customers;
SELECT COUNT(*) AS order_count FROM orders;
SELECT id, customer_id, order_date FROM orders LIMIT 5;`}</Code>
          <fieldset className="mt-8 rounded-xl bg-paper-aged p-5"><legend className="px-1 font-display text-xl font-semibold">My import checklist</legend><div className="space-y-3">{IMPORT_CHECKS.map((item, i) => <label key={item} className="flex items-start gap-3"><input type="checkbox" checked={checks.includes(i)} onChange={() => setChecks((old) => old.includes(i) ? old.filter((x) => x !== i) : [...old, i])} className="mt-1 size-4 accent-lamp" /><span>{item}</span></label>)}</div><p className="mt-4 text-sm font-semibold text-lamp" aria-live="polite">{checks.length} of {IMPORT_CHECKS.length} steps checked</p></fieldset>
          <details className="mt-7 rounded-xl border border-hairline p-5"><summary className="cursor-pointer font-semibold">If something fails</summary><ul className="mt-3 list-disc space-y-2 pl-5"><li><strong>Unknown database:</strong> run the schema script first.</li><li><strong>Table does not exist:</strong> confirm the first script completed and refresh Schemas.</li><li><strong>Duplicate key:</strong> data may already be loaded; do not rerun INSERTs blindly. Check counts before trying again.</li><li><strong>Access denied:</strong> use a MySQL connection with permission to create the local schema.</li></ul></details>
          <p className="mt-6 text-sm text-ink-muted">Workbench steps follow the <a className="font-semibold text-lamp underline" href="https://dev.mysql.com/doc/workbench/en/wb-sql-editor-toolbar.html" target="_blank" rel="noreferrer">official SQL editor toolbar guide</a>.</p>
        </article>}

        {stage === 'view' && <article>
          <SectionHeading eyebrow="Hands-on Lab · 25 min">Build a JOIN View in MySQL Workbench</SectionHeading>
          <p className="mt-6 leading-relaxed">
            Watch the <a className="font-semibold text-lamp underline" href="https://youtu.be/0vkBVJz1xY8" target="_blank" rel="noreferrer">INNER JOIN vs LEFT JOIN video <ExternalLink size={14} className="inline" /></a>, then follow this step-by-step tutorial in MySQL Workbench. You will apply the SQL scripts to reconstruct the Northwind database, resolve column collisions, and save the joined query as a reusable virtual <strong>VIEW</strong> for your JSP application.
          </p>

          {/* Download cards */}
          <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/60 p-6">
            <div className="border-b border-hairline/70 pb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                <Download size={20} className="text-lamp" /> Download the Northwind SQL Files
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Execute these three scripts strictly in sequence: <strong>1. northwind.sql &rarr; 2. northwind-data.sql &rarr; 3. customer-order-view.sql</strong>.
              </p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <a
                href="/sql/northwind.sql"
                download
                className="group flex flex-col justify-between rounded-lg border border-hairline bg-paper p-4 transition-all hover:border-lamp hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-bold text-lamp">1st · Schema</span>
                    <FileCode size={18} className="text-ink-muted group-hover:text-lamp" />
                  </div>
                  <h4 className="mt-3 font-mono text-sm font-semibold text-ink">northwind.sql</h4>
                  <p className="mt-1 text-xs text-ink-muted">Creates database, table structures & keys.</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lamp">
                  <Download size={14} /> Download Script
                </span>
              </a>

              <a
                href="/sql/northwind-data.sql"
                download
                className="group flex flex-col justify-between rounded-lg border border-hairline bg-paper p-4 transition-all hover:border-lamp hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-bold text-lamp">2nd · Data</span>
                    <Database size={18} className="text-ink-muted group-hover:text-lamp" />
                  </div>
                  <h4 className="mt-3 font-mono text-sm font-semibold text-ink">northwind-data.sql</h4>
                  <p className="mt-1 text-xs text-ink-muted">Populates customers, orders, and records.</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lamp">
                  <Download size={14} /> Download Script
                </span>
              </a>

              <a
                href="/sql/customer-order-view.sql"
                download
                className="group flex flex-col justify-between rounded-lg border border-hairline bg-paper p-4 transition-all hover:border-lamp hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-bold text-amber-deep">3rd · View</span>
                    <Layers3 size={18} className="text-ink-muted group-hover:text-lamp" />
                  </div>
                  <h4 className="mt-3 font-mono text-sm font-semibold text-ink">customer-order-view.sql</h4>
                  <p className="mt-1 text-xs text-ink-muted">Creates customer_order_overview virtual table.</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lamp">
                  <Download size={14} /> Download Script
                </span>
              </a>
            </div>
          </div>

          {/* Interactive Workbench Tabbed Walkthrough */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-ink">MySQL Workbench Step-by-Step Guide</h3>
              <span className="text-xs text-ink-muted">Follow tabs 1 through 4</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-b border-hairline pb-2" role="tablist">
              {Object.entries(VIEW_TUTORIAL_STEPS).map(([key, item]) => {
                const isActive = viewStep === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setViewStep(key)}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-lamp text-white shadow-sm'
                        : 'bg-paper-aged text-ink hover:bg-paper-aged/80'
                    }`}
                  >
                    <span>{item.tabLabel}</span>
                  </button>
                )
              })}
            </div>

            {VIEW_TUTORIAL_STEPS[viewStep] && (
              <div className="mt-5 rounded-xl border border-hairline bg-paper-aged/30 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                  <div>
                    <span className="inline-block rounded-full bg-lamp/15 px-3 py-0.5 text-xs font-semibold text-lamp">
                      {VIEW_TUTORIAL_STEPS[viewStep].badge || 'Workbench Guide'}
                    </span>
                    <h4 className="mt-2 text-xl font-semibold text-ink">
                      {VIEW_TUTORIAL_STEPS[viewStep].title}
                    </h4>
                  </div>
                  {VIEW_TUTORIAL_STEPS[viewStep].download && (
                    <a
                      href={VIEW_TUTORIAL_STEPS[viewStep].download}
                      download
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-lamp/40 bg-paper px-3 text-xs font-semibold text-lamp hover:bg-paper-aged"
                    >
                      <Download size={14} /> Download {VIEW_TUTORIAL_STEPS[viewStep].file}
                    </a>
                  )}
                </div>

                <p className="mt-4 leading-relaxed text-ink/90">
                  {VIEW_TUTORIAL_STEPS[viewStep].summary}
                </p>

                <div className="mt-5 space-y-3">
                  <h5 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink">
                    <Terminal size={16} className="text-lamp" /> Instructions:
                  </h5>
                  <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-ink/90">
                    {VIEW_TUTORIAL_STEPS[viewStep].instructions.map((inst, idx) => (
                      <li key={idx}>{inst}</li>
                    ))}
                  </ol>
                </div>

                {VIEW_TUTORIAL_STEPS[viewStep].tip && (
                  <div className="mt-5 flex items-start gap-3 rounded-lg border border-lamp/30 bg-lamp/10 p-4 text-xs leading-relaxed text-ink">
                    <Info size={18} className="mt-0.5 shrink-0 text-lamp" />
                    <span><strong>Workbench Pro-tip:</strong> {VIEW_TUTORIAL_STEPS[viewStep].tip}</span>
                  </div>
                )}

                {VIEW_TUTORIAL_STEPS[viewStep].verifySql && (
                  <div className="mt-5">
                    <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Zap size={16} className="text-lamp" /> Verification Query (run after data finishes):
                    </h5>
                    <Code label="Verify Tables & Counts in Workbench">{VIEW_TUTORIAL_STEPS[viewStep].verifySql}</Code>
                  </div>
                )}

                {VIEW_TUTORIAL_STEPS[viewStep].viewSql && (
                  <div className="mt-5">
                    <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <FileCode size={16} className="text-lamp" /> View Definition (customer-order-view.sql):
                    </h5>
                    <Code label="customer-order-view.sql">{VIEW_TUTORIAL_STEPS[viewStep].viewSql}</Code>
                  </div>
                )}

                {VIEW_TUTORIAL_STEPS[viewStep].querySql && (
                  <div className="mt-5">
                    <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Zap size={16} className="text-lamp" /> Queries to test and compare in Workbench:
                    </h5>
                    <Code label="Query View & Compare Joins">{VIEW_TUTORIAL_STEPS[viewStep].querySql}</Code>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Deep Dive into Relationships & Error 1060 Prevention */}
          <div className="mt-10 rounded-xl border border-hairline p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <BookOpen size={20} className="text-lamp" /> Understand the Relationship & Column Collision
            </h3>
            <p className="mt-3 leading-relaxed">
              <code>customers.id</code> uniquely identifies a customer. <code>orders.customer_id</code> points back to it. One customer may place multiple orders. An <code>INNER JOIN</code> only retains matching pairs; a <code>LEFT JOIN</code> guarantees that all customers remain in the result set, even if they have zero orders.
            </p>

            <div className="mt-5 grid gap-3 text-center text-sm sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-lg bg-paper-aged p-4">
                <span className="font-semibold text-ink">customers</span>
                <p className="mt-1 font-mono text-xs text-lamp"><code>id</code> · <code>company</code></p>
              </div>
              <span className="self-center font-mono font-semibold text-lamp">id = customer_id</span>
              <div className="rounded-lg bg-paper-aged p-4">
                <span className="font-semibold text-ink">orders</span>
                <p className="mt-1 font-mono text-xs text-lamp"><code>id</code> · <code>customer_id</code> · <code>order_date</code></p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-paper-aged/80 p-4 text-sm leading-relaxed">
              <h4 className="font-semibold text-ink">Why Aliases Prevent Error 1060:</h4>
              <p className="mt-1 text-ink-muted">
                Both the <code>customers</code> table and the <code>orders</code> table have a primary key column named <code>id</code>. If you create a view with <code>SELECT *</code> or without distinct column aliases, MySQL throws:
              </p>
              <pre className="mt-2 rounded bg-shelf p-2.5 font-mono text-xs text-paper">
                ERROR 1060 (42S21): Duplicate column name &apos;id&apos;
              </pre>
              <p className="mt-2 text-ink-muted">
                By specifying <code>c.id AS customer_id</code> and <code>o.id AS order_id</code> in your view definition, every column in the virtual table has a unique, unambiguous name.
              </p>
            </div>
          </div>

          {/* Interactive practice challenge before viewing full SQL */}
          <div className="mt-8 rounded-xl bg-paper-aged p-5">
            <h3 className="font-display text-xl font-semibold">Test Your SQL Intuition: Complete the Join</h3>
            <p className="mt-2 text-sm text-ink-muted">Choose the two missing pieces for the customer–order view query:</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">Keep customers without orders
                <select value={joinChoice} onChange={(event) => { setJoinChoice(event.target.value); setJoinChecked(false) }} className="mt-2 block min-h-11 w-full rounded-lg border border-hairline bg-paper px-3 text-ink">
                  <option value="">Choose a join</option><option value="INNER">INNER JOIN</option><option value="LEFT">LEFT JOIN</option>
                </select>
              </label>
              <label className="text-sm font-semibold">Match the key columns
                <select value={conditionChoice} onChange={(event) => { setConditionChoice(event.target.value); setJoinChecked(false) }} className="mt-2 block min-h-11 w-full rounded-lg border border-hairline bg-paper px-3 text-ink">
                  <option value="">Choose an ON condition</option><option value="correct">o.customer_id = c.id</option><option value="order">o.id = c.id</option><option value="company">o.customer_id = c.company</option>
                </select>
              </label>
            </div>
            <button type="button" disabled={!joinChoice || !conditionChoice} onClick={() => setJoinChecked(true)} className="mt-4 min-h-10 rounded-lg bg-amber px-4 font-semibold text-white disabled:opacity-50">Check the join</button>
            {joinChecked && <p role="status" className={`mt-3 text-sm font-semibold ${joinChoice === 'LEFT' && conditionChoice === 'correct' ? 'text-lamp' : 'text-incorrect'}`}>{joinChoice === 'LEFT' && conditionChoice === 'correct' ? 'Correct. LEFT JOIN keeps every customer; the foreign key matches the customer primary key.' : 'Try again: keep customers on the left, then match orders.customer_id to customers.id.'}</p>}
          </div>

          {/* Pause & Predict Prompt */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-paper-aged p-5">
            <PlayCircle className="mt-0.5 shrink-0 text-lamp" size={22} />
            <div className="text-sm leading-relaxed">
              <strong className="text-ink">Pause and predict:</strong>
              <p className="mt-1 text-ink/90">
                A customer has placed three separate orders. How many rows will represent that customer in <code>customer_order_overview</code>? What happens to a customer who has never ordered anything when you query the view with <code>WHERE order_id IS NULL</code>?
              </p>
            </div>
          </div>

          {/* Inspection and reasoning */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-ink">Inspect Unmatched Customers</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Why is <code>order_id IS NULL</code> the correct test rather than <code>order_date IS NULL</code>? Because <code>order_id</code> is the primary key of the <code>orders</code> table. In relational databases, a primary key can never be null unless the row was created by a non-matching outer join.
            </p>
            <Code label="Find Unmatched Customers (Workbench)">{`SELECT customer_id, customer_company
FROM customer_order_overview
WHERE order_id IS NULL
ORDER BY customer_id;`}</Code>
          </div>

          {/* Interactive Workbench Checklist */}
          <fieldset className="mt-8 rounded-xl bg-paper-aged p-6">
            <legend className="flex items-center gap-2 px-1 font-display text-xl font-semibold text-ink">
              <CheckCircle2 size={20} className="text-lamp" /> My Workbench View Checklist
            </legend>
            <p className="mt-1 text-sm text-ink-muted">Track your progress as you work through MySQL Workbench:</p>
            <div className="mt-4 space-y-3">
              {VIEW_TUTORIAL_CHECKS.map((item, i) => (
                <label key={item} className="flex cursor-pointer items-start gap-3 rounded-lg p-1.5 hover:bg-paper/60">
                  <input
                    type="checkbox"
                    checked={viewChecks.includes(i)}
                    onChange={() =>
                      setViewChecks((old) =>
                        old.includes(i) ? old.filter((x) => x !== i) : [...old, i]
                      )
                    }
                    className="mt-1 size-4 accent-lamp"
                  />
                  <span className="text-sm text-ink/90">{item}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-lamp" aria-live="polite">
              {viewChecks.length} of {VIEW_TUTORIAL_CHECKS.length} steps completed
            </p>
          </fieldset>

          {/* Troubleshooting Guide */}
          <details className="mt-7 rounded-xl border border-hairline p-5">
            <summary className="cursor-pointer font-semibold text-ink">
              Troubleshooting Workbench & SQL Execution Issues
            </summary>
            <ul className="mt-3 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink/90">
              <li>
                <strong>Error 1046 (3D000): No database selected:</strong> Make sure the script includes <code>USE northwind;</code> at the top, or double-click the <code>northwind</code> schema in the Schemas panel so its name becomes bold.
              </li>
              <li>
                <strong>Error 1049 (42000): Unknown database &apos;northwind&apos;:</strong> You ran <code>northwind-data.sql</code> or <code>customer-order-view.sql</code> before running <code>northwind.sql</code>. Execute <code>northwind.sql</code> first to create the database schema.
              </li>
              <li>
                <strong>Error 1146 (42S02): Table &apos;northwind.customers&apos; doesn&apos;t exist:</strong> <code>northwind.sql</code> did not complete successfully. Check the Action Output log at the bottom for any red cross icons.
              </li>
              <li>
                <strong>Error 1060 (42S21): Duplicate column name:</strong> Both <code>customers</code> and <code>orders</code> have an <code>id</code> column. Always specify distinct aliases (e.g. <code>c.id AS customer_id</code>, <code>o.id AS order_id</code>) in the SELECT list.
              </li>
              <li>
                <strong>View not showing in left sidebar:</strong> Right-click the <strong>Views</strong> header under <code>northwind</code> in the Navigator pane and click <strong>Refresh All</strong> (🔄).
              </li>
              <li>
                <strong>Accidental Partial Execution:</strong> If text is highlighted in the Workbench query editor when you click ⚡, Workbench only runs the highlighted text! Always click an empty area or deselect before running a complete script.
              </li>
            </ul>
          </details>

          <p className="mt-6 text-sm text-ink-muted">
            Video reference: compare with the <a className="font-semibold text-lamp underline" href="https://youtu.be/0vkBVJz1xY8" target="_blank" rel="noreferrer">INNER JOIN vs LEFT JOIN tutorial <ExternalLink size={14} className="inline" /></a>. Workbench steps adhere to the <a className="font-semibold text-lamp underline" href="https://dev.mysql.com/doc/workbench/en/wb-sql-editor-toolbar.html" target="_blank" rel="noreferrer">official MySQL Workbench SQL editor guide</a>.
          </p>
        </article>}

        {stage === 'checkpoint' && <article>
          <SectionHeading eyebrow="Prove · 5 min">Check your understanding</SectionHeading>
          <p className="mt-6 leading-relaxed">Answer all four questions. You can change your answers and try again.</p>
          <div className="mt-8 space-y-8">{QUESTIONS.map((question, qi) => <fieldset key={question.prompt}><legend className="font-semibold">{qi + 1}. {question.prompt}</legend><div className="mt-3 space-y-2">{question.options.map((option, oi) => <label key={option} className={`flex min-h-11 items-center gap-3 rounded-lg border px-4 py-2 ${answers[qi] === oi ? 'border-lamp bg-lamp/10' : 'border-hairline'}`}><input type="radio" name={`topic3-q${qi}`} checked={answers[qi] === oi} onChange={() => { setAnswers((old) => ({ ...old, [qi]: oi })); setGraded(false) }} className="size-4 accent-lamp" />{option}</label>)}</div>{graded && <p className={`mt-2 text-sm ${answers[qi] === question.answer ? 'text-lamp' : 'text-incorrect'}`}>{answers[qi] === question.answer ? 'Correct.' : question.why}</p>}</fieldset>)}</div>
          <button type="button" onClick={() => setGraded(true)} disabled={Object.keys(answers).length < QUESTIONS.length} className="mt-8 min-h-11 rounded-lg bg-amber px-5 font-semibold text-white disabled:opacity-50">Check my answers</button>
          {graded && <p role="status" className="mt-4 flex items-center gap-2 font-semibold"><ClipboardCheck size={19} className="text-lamp" />{QUESTIONS.reduce((score, question, i) => score + (answers[i] === question.answer ? 1 : 0), 0)} of 4 correct. Review any explanations above, then try again.</p>}
          <div className="mt-12 border-t border-hairline pt-7"><h3 className="font-display text-xl font-semibold">Take it into the lab</h3><p className="mt-2 leading-relaxed">You have seen where JSP runs, loaded the database, and built a view from related tables. Next, use a servlet or JSP to query <code>customer_order_overview</code> and present the results as HTML.</p></div>
        </article>}
        {next && <div className="mt-12 border-t border-hairline pt-7"><button type="button" onClick={() => setStage(next.id)} className="flex min-h-12 items-center gap-2 rounded-lg bg-amber px-5 font-semibold text-white hover:bg-amber-deep">Continue to {next.label}<ArrowRight size={17} /></button></div>}
      </main>
    </div>
  </div>
}
