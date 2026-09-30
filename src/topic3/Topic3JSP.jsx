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
  Layers,
  Layers3,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react'

const STAGES = [
  { id: '3.1', label: '3.1 JSP Concepts & Lifecycle' },
  { id: '3.2', label: '3.2 Tags & Implicit Objects' },
  { id: '3.3_db', label: '3.3 Database with JDBC' },
  { id: '3.3_lab', label: '3.3 Northwind Workbench Lab' },
  { id: '3.4', label: '3.4 MVC Project Integration' },
  { id: 'checkpoint', label: 'Topic 3 Checkpoint' },
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

const TOPIC3_QUESTIONS = [
  {
    prompt: 'When a user requests a .jsp page for the very first time, what does the Tomcat container do?',
    options: [
      'Sends the raw .jsp text file directly to the browser',
      'Translates the JSP into a Java servlet (.java) and compiles it into bytecode (.class)',
      'Executes JavaScript on the client computer',
      'Deletes the JSP file from the server',
    ],
    answer: 1,
    why: 'Tomcat’s Jasper engine translates the JSP into a servlet class extending HttpJspBase and compiles it. Subsequent requests reuse the compiled servlet bytecode directly.',
  },
  {
    prompt: 'Which JSP scripting element is used to declare instance variables or helper methods outside the _jspService() method?',
    options: [
      '<%! int visitCount = 0; %>',
      '<%= visitCount %>',
      '<% int visitCount = 0; %>',
      '<%@ page visitCount="0" %>',
    ],
    answer: 0,
    why: 'The declaration tag <%! ... %> places variables and methods at the class level outside _jspService(), making them instance members.',
  },
  {
    prompt: 'What is the key difference between a JSP comment <%-- text --%> and an HTML comment <!-- text -->?',
    options: [
      'JSP comments cause compiler errors in Java',
      'JSP comments are processed on the server and completely omitted from the HTML output; HTML comments are sent to the client browser',
      'HTML comments can only be used inside Java scriptlets',
      'They are identical in all aspects',
    ],
    answer: 1,
    why: 'JSP comments (<%-- --%>) are stripped during translation and never sent over the network. HTML comments (<!-- -->) are sent in the HTTP response and visible in "View Source".',
  },
  {
    prompt: 'Which implicit object in JSP corresponds to the HttpServletRequest interface?',
    options: ['response', 'application', 'request', 'pageContext'],
    answer: 2,
    why: 'The implicit object "request" is an instance of HttpServletRequest, providing direct access to form parameters, headers, and request attributes.',
  },
  {
    prompt: 'Why is PreparedStatement preferred over Statement when executing JDBC queries with user parameters?',
    options: [
      'PreparedStatement uses fewer lines of HTML',
      'PreparedStatement pre-compiles queries and prevents SQL Injection attacks by parameterizing values with ?',
      'Statement does not support MySQL databases',
      'PreparedStatement does not require a Connection object',
    ],
    answer: 1,
    why: 'PreparedStatement uses parameterized placeholders (?) that ensure user inputs are treated strictly as data literals, preventing SQL injection exploits and improving database performance.',
  },
  {
    prompt: 'In the Model-View-Controller (MVC) architecture for Java Web applications, what is the primary role of the Servlet?',
    options: [
      'To style the web page with CSS and HTML layout',
      'To act as the Controller: receiving user requests, performing validation, calling Model/DAO, and forwarding data to the JSP View',
      'To store user passwords in plain text',
      'To replace the MySQL database server',
    ],
    answer: 1,
    why: 'In MVC Architecture, the Servlet is the Controller. It receives HTTP requests, coordinates business logic with the Model, binds results with request.setAttribute(), and forwards to the JSP View.',
  },
]

function CodeBlock({ children, label }) {
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
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-shelf text-paper">
      <div className="flex items-center justify-between border-b border-paper/15 px-4 py-2 text-xs text-paper/80">
        <span className="font-mono">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="flex min-h-8 items-center gap-1.5 rounded-md px-2 hover:bg-paper/10 transition-colors"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check size={14} className="text-lamp" /> : <Copy size={14} />}{' '}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed font-mono">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="border-b border-hairline pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lamp">{eyebrow}</p>
        <span className="text-[11px] font-mono text-ink-muted">Politeknik Malaysia · DFP50283</span>
      </div>
      <h2 className="mt-2 text-3xl font-semibold leading-tight text-ink md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
    </div>
  )
}

// ——— Interactive MVC Simulator Component ———
function MVCSimulator() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: '1. Patron sends Request (Browser)',
      component: 'Client Browser',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300',
      action: 'Patron submits: GET /customers?search=North',
      detail:
        'The patron enters search keywords. Browser packages the URL parameters and dispatches an HTTP GET request to the web container.',
      code: `// Browser URL Bar
http://localhost:8080/ServeStud/customers?search=North`,
    },
    {
      title: '2. Controller Servlet coordinates (Servlet)',
      component: 'CustomerServlet (Controller)',
      color: 'border-amber/40 bg-amber/10 text-amber-deep',
      action: 'Extracts parameter & calls CustomerDAO.search("North")',
      detail:
        'The Servlet handles the request, validates input, calls the DAO Model to execute the SQL query, and puts results into request.setAttribute("customers", list).',
      code: `// Inside CustomerServlet.java (doGet)
String query = request.getParameter("search");
List<Customer> list = CustomerDAO.findCustomers(query);

request.setAttribute("customerList", list);
RequestDispatcher rd = request.getRequestDispatcher("/customer-list.jsp");
rd.forward(request, response);`,
    },
    {
      title: '3. Model & JDBC queries Database (DAO / DB)',
      component: 'CustomerDAO + MySQL Database (Model)',
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300',
      action: 'Executes PreparedStatement & populates Java Objects',
      detail:
        'The DAO uses PreparedStatement to safely query the Northwind database, loops through ResultSet, and constructs Customer bean objects.',
      code: `// Inside CustomerDAO.java
String sql = "SELECT id, company FROM customers WHERE company LIKE ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "%" + query + "%");
ResultSet rs = ps.executeQuery();

while(rs.next()) {
    list.add(new Customer(rs.getInt("id"), rs.getString("company")));
}`,
    },
    {
      title: '4. View renders dynamic HTML (JSP)',
      component: 'customer-list.jsp (View)',
      color: 'border-lamp/40 bg-lamp/10 text-lamp',
      action: 'Renders HTML table using JSTL / EL or scriptlet loops',
      detail:
        'The JSP receives the forwarded request, iterates over customerList, and renders clean responsive HTML to the response stream.',
      code: `<%-- Inside customer-list.jsp --%>
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<table>
  <tr><th>ID</th><th>Company Name</th></tr>
  <c:forEach var="cust" items="\${customerList}">
    <tr><td>\${cust.id}</td><td>\${cust.company}</td></tr>
  </c:forEach>
</table>`,
    },
  ]

  return (
    <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <h4 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <Layers size={20} className="text-lamp" /> Interactive MVC Request-to-Render Trace
          </h4>
          <p className="mt-1 text-sm text-ink-muted">
            Step through how a real Java Web project coordinates Model, View, and Controller.
          </p>
        </div>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveStep(i)}
              className={`size-8 rounded-full text-xs font-bold transition-colors ${
                activeStep === i
                  ? 'bg-lamp text-white'
                  : 'border border-hairline bg-paper text-ink hover:bg-paper-aged'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-0.5 text-xs font-bold border ${steps[activeStep].color}`}>
            {steps[activeStep].component}
          </span>
          <span className="text-xs text-ink-muted">Step {activeStep + 1} of {steps.length}</span>
        </div>

        <h5 className="mt-2 text-lg font-semibold text-ink">{steps[activeStep].title}</h5>
        <p className="mt-1 text-sm leading-relaxed text-ink/90">{steps[activeStep].detail}</p>

        <CodeBlock label={steps[activeStep].component}>{steps[activeStep].code}</CodeBlock>

        <div className="mt-5 flex justify-between">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            className="rounded-lg border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          >
            &larr; Previous Step
          </button>
          <button
            type="button"
            disabled={activeStep === steps.length - 1}
            onClick={() => setActiveStep(activeStep + 1)}
            className="rounded-lg bg-amber px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-deep disabled:opacity-40"
          >
            Next Step &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Topic3JSP({ onBack }) {
  const [stage, setStage] = useState('3.1')
  const [flowStep, setFlowStep] = useState(0)
  const [tagTab, setTagTab] = useState('scripting')
  const [jdbcTab, setJdbcTab] = useState('connection')
  const [viewStep, setViewStep] = useState('step1')
  const [viewChecks, setViewChecks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('servestud-topic3-view-checks') || '[]')
    } catch {
      return []
    }
  })
  const [answers, setAnswers] = useState({})
  const [graded, setGraded] = useState(false)
  const [joinChoice, setJoinChoice] = useState('')
  const [conditionChoice, setConditionChoice] = useState('')
  const [joinChecked, setJoinChecked] = useState(false)

  useEffect(() => {
    document.title = 'Topic 3 · JavaServer Pages (JSP) & JDBC · ServeStud'
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('servestud-topic3-view-checks', JSON.stringify(viewChecks))
    } catch {
      // Ignore
    }
  }, [viewChecks])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [stage])

  const currentIdx = STAGES.findIndex((item) => item.id === stage)
  const nextStage = STAGES[currentIdx + 1]

  const flow = [
    [
      '1. Patron Requests JSP',
      'The browser sends: GET /catalog.jsp. Web container (Tomcat) intercepts the request.',
    ],
    [
      '2. Translation (Jasper Engine)',
      'On the first request, Tomcat translates catalog.jsp into a Java source file (catalog_jsp.java). It converts HTML template text into out.write() and embeds scriptlets into _jspService().',
    ],
    [
      '3. Compilation to Bytecode',
      'Tomcat compiles catalog_jsp.java into catalog_jsp.class. Subsequent requests skip translation and compilation!',
    ],
    [
      '4. Execution & HTML Response',
      'The servlet executes _jspService(), queries database via JDBC if required, and streams plain HTML back to the browser. The browser NEVER sees Java source code.',
    ],
  ]

  return (
    <div className="min-h-svh bg-paper text-ink">
      <a
        href="#topic3-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to lesson
      </a>

      {/* Course Header */}
      <header className="border-b border-hairline bg-paper-aged">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-bold text-lamp">
                TOPIC 3
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lamp">
                DFP50283 · Java Web Technologies
              </p>
            </div>
            <h1 className="font-display text-xl font-semibold text-ink">
              Introduction to JavaServer Pages (JSP) & JDBC
            </h1>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-hairline bg-paper px-3 text-sm font-semibold hover:bg-paper-aged transition-colors"
          >
            <ArrowLeft size={16} /> Course Overview (Topics 1 & 2)
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Navigation Sidebar */}
        <nav aria-label="Topic 3 syllabus sections" className="lg:sticky lg:top-8 lg:self-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Topic 3 Syllabus Outline
          </p>
          <ol className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
            {STAGES.map((item, index) => {
              const isActive = stage === item.id
              return (
                <li key={item.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setStage(item.id)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg px-3 text-left text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-lamp font-semibold text-white shadow-sm'
                        : 'border border-hairline bg-paper hover:bg-paper-aged text-ink'
                    }`}
                  >
                    <span className={`font-mono text-xs ${isActive ? 'text-white/80' : 'text-lamp'}`}>
                      {index + 1}.
                    </span>
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Lecturer Credit Badge */}
          <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/60 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">
              Politeknik Course Author
            </p>
            <p className="mt-1 text-xs font-semibold text-lamp italic">
              Kandungan Utama Diedit Oleh: MOHD AZLAN BIN AB AZIZ
            </p>
          </div>
        </nav>

        {/* Content Area */}
        <main id="topic3-main" className="min-w-0 max-w-3xl pb-16">
          {/* ========================================================================= */}
          {/* STAGE 3.1: JSP Concepts & Lifecycle                                       */}
          {/* ========================================================================= */}
          {stage === '3.1' && (
            <article>
              <SectionHeading
                eyebrow="Topic 3.1 · Theory & Architecture · 10 min"
                title="JSP Concept in Dynamic Web Pages"
                subtitle="3.1: (i) JSP concept in dynamic web pages, (ii) JSP's to Servlets translation, (iii) JSP Lifecycle"
              />

              <div className="mt-6 rounded-xl bg-shelf px-6 py-5 text-paper">
                <p className="flex items-center gap-2 font-display text-lg font-semibold">
                  <Zap size={18} className="text-partial" />
                  Brain Power: Why JSP when we already have Servlets?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-paper/90">
                  In pure Servlets, to output a table of 100 books, you have to write dozens of awkward Java strings like{' '}
                  <code>out.println("&lt;table class='table'&gt;");</code>. If a UI designer wants to change the CSS, they have to recompile Java code!{' '}
                  <strong>JSP flips the script:</strong> write standard HTML, and embed Java only where dynamic data is needed.
                </p>
              </div>

              {/* 3.1.i: JSP Concept */}
              <section className="mt-8">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  1. JSP Concept in Dynamic Web Pages
                </h3>
                <p className="mt-3 leading-relaxed">
                  <strong>JavaServer Pages (JSP)</strong> is a server-side presentation technology. It enables developers to create dynamic, database-driven web pages using familiar HTML, CSS, and JavaScript syntax with embedded Java tags.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-hairline bg-paper-aged/40 p-4">
                    <h4 className="font-semibold text-ink text-sm">Servlet (Code-Centric)</h4>
                    <p className="mt-1 text-xs text-ink-muted">Best suited for request routing, controller logic, and database orchestration.</p>
                    <pre className="mt-2 rounded bg-shelf p-2 text-[11px] font-mono text-paper">
{`response.setContentType("text/html");
PrintWriter out = response.getWriter();
out.println("<h1>Title</h1>");`}
                    </pre>
                  </div>

                  <div className="rounded-xl border border-lamp/40 bg-lamp/10 p-4">
                    <h4 className="font-semibold text-lamp text-sm">JSP (Markup-Centric)</h4>
                    <p className="mt-1 text-xs text-ink-muted">Best suited for rendering user interfaces, views, and formatted tables.</p>
                    <pre className="mt-2 rounded bg-shelf p-2 text-[11px] font-mono text-paper">
{`<%@ page contentType="text/html" %>
<h1>\${book.title}</h1>`}
                    </pre>
                  </div>
                </div>
              </section>

              {/* 3.1.ii: JSP to Servlet Translation */}
              <section className="mt-12">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  2. JSP's to Servlets Translation Process
                </h3>
                <p className="mt-3 leading-relaxed">
                  Behind the scenes, the browser never runs JSP. The web container's Jasper engine translates every <code>.jsp</code> file into an ordinary Java Servlet class!
                </p>

                {/* Stepper */}
                <div className="mt-6 rounded-xl border border-hairline bg-paper-aged p-5">
                  <div className="flex items-center gap-3">
                    <Layers3 className="text-lamp" size={22} />
                    <div>
                      <p className="font-semibold text-ink">Follow the JSP Translation Journey</p>
                      <p className="text-xs text-ink-muted">Step through what happens from request to generated HTML.</p>
                    </div>
                  </div>

                  <div className="mt-5 min-h-24 rounded-lg bg-paper p-4 border border-hairline" aria-live="polite">
                    <p className="text-xs font-semibold uppercase tracking-wider text-lamp">
                      Step {flowStep + 1} of {flow.length}
                    </p>
                    <h4 className="mt-1 text-base font-semibold text-ink">{flow[flowStep][0]}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">{flow[flowStep][1]}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled={flowStep === 0}
                      onClick={() => setFlowStep(flowStep - 1)}
                      className="rounded-lg border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={flowStep === flow.length - 1}
                      onClick={() => setFlowStep(flowStep + 1)}
                      className="rounded-lg bg-amber px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </section>

              {/* 3.1.iii: JSP Lifecycle */}
              <section className="mt-12">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  3. The JSP Lifecycle
                </h3>
                <p className="mt-3 leading-relaxed">
                  Because a JSP becomes a servlet, it has its own corresponding lifecycle managed by the container:
                </p>

                <div className="mt-5 space-y-3 font-mono text-xs">
                  <div className="rounded-lg border border-lamp/30 bg-paper-aged p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lamp">1. jspInit()</span>
                      <span className="text-[11px] text-ink-muted">Called ONCE upon initialization</span>
                    </div>
                    <p className="mt-1 text-ink-muted font-sans text-xs">
                      Executed when the JSP page is first loaded. Used for one-time initialization such as opening database connection pools or reading configuration parameters.
                    </p>
                  </div>

                  <div className="rounded-lg border border-amber/30 bg-paper-aged p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber">2. _jspService(request, response)</span>
                      <span className="text-[11px] text-ink-muted">Called for EVERY client request</span>
                    </div>
                    <p className="mt-1 text-ink-muted font-sans text-xs">
                      Generated automatically by the JSP engine. Handles the HTTP request, processes scriptlets and expressions, and generates the dynamic response. You never override this directly.
                    </p>
                  </div>

                  <div className="rounded-lg border border-hairline bg-paper-aged p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">3. jspDestroy()</span>
                      <span className="text-[11px] text-ink-muted">Called ONCE at shutdown</span>
                    </div>
                    <p className="mt-1 text-ink-muted font-sans text-xs">
                      Invoked when the container removes the JSP servlet from service. Used to clean up memory, close database connections, and release system resources.
                    </p>
                  </div>
                </div>
              </section>
            </article>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3.2: Tags & Implicit Objects                                        */}
          {/* ========================================================================= */}
          {stage === '3.2' && (
            <article>
              <SectionHeading
                eyebrow="Topic 3.2 · Syntax & Elements · 15 min"
                title="JSP File in Web Application"
                subtitle="3.2: (i) JSP Tags (Scripting, Comments, Actions, Directives) & (ii) JSP Implicit Objects"
              />

              {/* Tag Categories Selector */}
              <section className="mt-8">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  1. JSP Tags Categories
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Select a category to inspect its syntax, role in translation, and practical code examples:
                </p>

                <div className="mt-4 flex flex-wrap gap-2 border-b border-hairline pb-2">
                  {[
                    { id: 'scripting', label: 'a. Scripting Elements' },
                    { id: 'comments', label: 'b. Comments' },
                    { id: 'actions', label: 'c. Action Elements' },
                    { id: 'directives', label: 'd. Directives Elements' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTagTab(tab.id)}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                        tagTab === tab.id
                          ? 'bg-lamp text-white shadow-sm'
                          : 'bg-paper-aged text-ink hover:bg-paper-aged/80'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {tagTab === 'scripting' && (
                  <div className="mt-5 rounded-xl border border-hairline bg-paper-aged/30 p-5 space-y-4">
                    <h4 className="font-semibold text-base text-ink">Scripting Elements in JSP</h4>
                    <div className="space-y-4 text-xs">
                      <div className="rounded-lg bg-paper p-3.5 border border-hairline">
                        <span className="font-mono font-bold text-lamp text-sm">&lt;% String title = "LMS"; %&gt;</span>
                        <p className="mt-1 font-semibold text-ink">Scriptlet Tag</p>
                        <p className="mt-0.5 text-ink-muted">
                          Inserts raw Java statements directly into the <code>_jspService()</code> method.
                        </p>
                      </div>

                      <div className="rounded-lg bg-paper p-3.5 border border-hairline">
                        <span className="font-mono font-bold text-amber text-sm">&lt;%= 5 * 10 %&gt;</span>
                        <p className="mt-1 font-semibold text-ink">Expression Tag</p>
                        <p className="mt-0.5 text-ink-muted">
                          Evaluates an expression and automatically converts it to a String, writing directly via <code>out.print()</code>. (Notice: NO trailing semicolon!).
                        </p>
                      </div>

                      <div className="rounded-lg bg-paper p-3.5 border border-hairline">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">&lt;%! public int cube(int n) &#123; return n*n*n; &#125; %&gt;</span>
                        <p className="mt-1 font-semibold text-ink">Declaration Tag</p>
                        <p className="mt-0.5 text-ink-muted">
                          Declares class-level instance variables and helper methods outside <code>_jspService()</code>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {tagTab === 'comments' && (
                  <div className="mt-5 rounded-xl border border-hairline bg-paper-aged/30 p-5 space-y-4">
                    <h4 className="font-semibold text-base text-ink">JSP Comments vs. HTML Comments</h4>
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="rounded-lg bg-paper p-4 border border-lamp/40">
                        <span className="font-mono font-bold text-lamp">&lt;%-- Server-side Comment --%&gt;</span>
                        <p className="mt-2 font-semibold text-ink">JSP Comment</p>
                        <p className="mt-1 text-ink-muted leading-relaxed">
                          Stripped out completely by the Jasper translator on the server. Never sent in the HTTP packet; completely invisible in the browser's "View Source".
                        </p>
                      </div>

                      <div className="rounded-lg bg-paper p-4 border border-hairline">
                        <span className="font-mono font-bold text-ink-muted">&lt;!-- Client-side Comment --&gt;</span>
                        <p className="mt-2 font-semibold text-ink">HTML Comment</p>
                        <p className="mt-1 text-ink-muted leading-relaxed">
                          Treated as static template text. Sent across the network to the browser and fully visible to anyone who right-clicks and inspects source code.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {tagTab === 'actions' && (
                  <div className="mt-5 rounded-xl border border-hairline bg-paper-aged/30 p-5 space-y-3">
                    <h4 className="font-semibold text-base text-ink">Standard JSP Action Elements</h4>
                    <p className="text-xs text-ink-muted">
                      Action elements use XML syntax to control the web container's runtime behavior.
                    </p>
                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="rounded-lg bg-paper p-3 border border-hairline">
                        <span className="font-bold text-lamp">&lt;jsp:include page="header.jsp" flush="true" /&gt;</span>
                        <p className="font-sans text-ink-muted mt-1">Includes the response of another page dynamically at runtime.</p>
                      </div>
                      <div className="rounded-lg bg-paper p-3 border border-hairline">
                        <span className="font-bold text-amber">&lt;jsp:forward page="login.jsp"&gt; &lt;jsp:param name="err" value="1" /&gt; &lt;/jsp:forward&gt;</span>
                        <p className="font-sans text-ink-muted mt-1">Forwards current request/response to another target with custom parameters.</p>
                      </div>
                      <div className="rounded-lg bg-paper p-3 border border-hairline">
                        <span className="font-bold text-blue-600 dark:text-blue-400">&lt;jsp:useBean id="book" class="com.lms.Book" scope="session" /&gt;</span>
                        <p className="font-sans text-ink-muted mt-1">Locates or instantiates a JavaBean component in the specified scope.</p>
                      </div>
                    </div>
                  </div>
                )}

                {tagTab === 'directives' && (
                  <div className="mt-5 rounded-xl border border-hairline bg-paper-aged/30 p-5 space-y-3">
                    <h4 className="font-semibold text-base text-ink">JSP Directives Elements</h4>
                    <p className="text-xs text-ink-muted">
                      Directives provide global instructions to the JSP engine during translation time.
                    </p>
                    <CodeBlock label="Directives Example">{`<%@ page contentType="text/html; charset=UTF-8" import="java.util.*, java.sql.*" errorPage="error.jsp" %>
<%@ include file="navbar.jsp" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`}</CodeBlock>
                  </div>
                )}
              </section>

              {/* 3.2.ii: Implicit Objects */}
              <section className="mt-12">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  2. JSP Implicit Objects
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Tomcat automatically provides 9 pre-defined implicit objects inside <code>_jspService()</code> ready to use without declaring them:
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-hairline bg-paper p-4">
                    <span className="font-mono font-bold text-lamp text-sm">out</span>
                    <span className="block text-[11px] text-ink-muted">Type: JspWriter</span>
                    <p className="mt-1 text-ink/90">Writes characters and HTML to the response stream (e.g. <code>out.println("&lt;p&gt;Hello&lt;/p&gt;");</code>).</p>
                  </div>

                  <div className="rounded-xl border border-hairline bg-paper p-4">
                    <span className="font-mono font-bold text-amber text-sm">request</span>
                    <span className="block text-[11px] text-ink-muted">Type: HttpServletRequest</span>
                    <p className="mt-1 text-ink/90">Provides access to form parameters (<code>request.getParameter("name")</code>), headers, and request attributes.</p>
                  </div>

                  <div className="rounded-xl border border-hairline bg-paper p-4">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">session</span>
                    <span className="block text-[11px] text-ink-muted">Type: HttpSession</span>
                    <p className="mt-1 text-ink/90">Maintains state across multiple page visits for a single user (e.g. login credentials, shopping carts).</p>
                  </div>

                  <div className="rounded-xl border border-hairline bg-paper p-4">
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-sm">application</span>
                    <span className="block text-[11px] text-ink-muted">Type: ServletContext</span>
                    <p className="mt-1 text-ink/90">Global application scope shared by ALL active users across the entire web container context.</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-hairline bg-paper-aged p-3 text-xs text-ink-muted">
                  <strong>Other available implicit objects:</strong> <code>response</code> (HttpServletResponse), <code>config</code> (ServletConfig), <code>pageContext</code> (PageContext), <code>page</code> (this), and <code>exception</code> (Throwable in error pages with <code>isErrorPage="true"</code>).
                </div>
              </section>
            </article>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3.3 DB: Database with JDBC                                          */}
          {/* ========================================================================= */}
          {stage === '3.3_db' && (
            <article>
              <SectionHeading
                eyebrow="Topic 3.3 · Database & JDBC · 20 min"
                title="JDBC Database in Web Application"
                subtitle="3.3: (i) Database connection, (ii) Recordset & PreparedStatement, (iii) ResultSet data, (iv) SQL Exception handling"
              />

              <div className="mt-6 flex flex-wrap gap-2 border-b border-hairline pb-2">
                {[
                  { id: 'connection', label: '1. Database Connection' },
                  { id: 'statements', label: '2. Statement vs PreparedStatement' },
                  { id: 'resultset', label: '3. ResultSet Iteration' },
                  { id: 'exception', label: '4. SQLException & try-with-resources' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setJdbcTab(t.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                      jdbcTab === t.id
                        ? 'bg-lamp text-white shadow-sm'
                        : 'bg-paper-aged text-ink hover:bg-paper-aged/80'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Connection Tab */}
              {jdbcTab === 'connection' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Connecting Java to MySQL with JDBC</h3>
                  <p className="text-sm leading-relaxed text-ink/90">
                    Java Database Connectivity (JDBC) is the official API for connecting Java applications to relational databases. There are two essential steps:
                  </p>

                  <CodeBlock label="DatabaseConnection.java">{`import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/northwind?useSSL=false&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "password";

    public static Connection getConnection() throws ClassNotFoundException, SQLException {
        // Step 1: Load the MySQL JDBC Driver class
        Class.forName("com.mysql.cj.jdbc.Driver");

        // Step 2: Establish connection via DriverManager
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}`}</CodeBlock>

                  <div className="rounded-lg border border-lamp/30 bg-lamp/10 p-4 text-xs leading-relaxed text-ink">
                    <p>
                      <strong>Politeknik Tip:</strong> Always make sure <code>mysql-connector-j-x.x.jar</code> is placed in your project's <code>WEB-INF/lib/</code> directory so Tomcat can load the MySQL driver!
                    </p>
                  </div>
                </div>
              )}

              {/* Statements Tab */}
              {jdbcTab === 'statements' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Statement vs. PreparedStatement</h3>
                  <p className="text-sm leading-relaxed text-ink/90">
                    Never concatenate raw user strings into SQL queries! <code>PreparedStatement</code> prevents SQL Injection by pre-compiling the SQL structure.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="rounded-xl border border-incorrect/40 bg-incorrect/10 p-4">
                      <div className="flex items-center gap-2 font-bold text-incorrect">
                        <ShieldAlert size={16} /> Statement (Vulnerable to Injection)
                      </div>
                      <pre className="mt-2 rounded bg-shelf p-2.5 font-mono text-[11px] text-paper">
{`// DANGEROUS!
String sql = "SELECT * FROM users "
  + "WHERE name = '" + user + "'";
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);`}
                      </pre>
                      <p className="mt-2 text-ink-muted">
                        If <code>user</code> is <code>admin' OR '1'='1</code>, the query bypasses password verification!
                      </p>
                    </div>

                    <div className="rounded-xl border border-lamp/40 bg-lamp/10 p-4">
                      <div className="flex items-center gap-2 font-bold text-lamp">
                        <ShieldCheck size={16} /> PreparedStatement (Safe & Recommended)
                      </div>
                      <pre className="mt-2 rounded bg-shelf p-2.5 font-mono text-[11px] text-paper">
{`// SAFE!
String sql = "SELECT * FROM users "
  + "WHERE name = ? AND pass = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, user);
ps.setString(2, pass);
ResultSet rs = ps.executeQuery();`}
                      </pre>
                      <p className="mt-2 text-ink-muted">
                        Parameters passed via <code>?</code> are treated strictly as data literals, neutralizing exploits.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ResultSet Tab */}
              {jdbcTab === 'resultset' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Iterating Through ResultSet in JSP</h3>
                  <p className="text-sm leading-relaxed text-ink/90">
                    A <code>ResultSet</code> acts as a cursor pointing to rows returned by an SQL query. Use <code>rs.next()</code> inside a loop to iterate through all records.
                  </p>

                  <CodeBlock label="view_customers.jsp">{`<%@ page import="java.sql.*, com.lms.DBConnection" %>
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head><title>Northwind Customers</title></head>
<body>
  <h2>Customer Records</h2>
  <table border="1" cellpadding="6" cellspacing="0">
    <tr bgcolor="#f0f0f0">
      <th>ID</th>
      <th>Company</th>
      <th>Contact Name</th>
    </tr>
    <%
      try (Connection conn = DBConnection.getConnection();
           PreparedStatement ps = conn.prepareStatement("SELECT id, company, last_name, first_name FROM customers LIMIT 10");
           ResultSet rs = ps.executeQuery()) {

        while (rs.next()) {
          int id = rs.getInt("id");
          String company = rs.getString("company");
          String contact = rs.getString("first_name") + " " + rs.getString("last_name");
    %>
    <tr>
      <td><%= id %></td>
      <td><%= company %></td>
      <td><%= contact %></td>
    </tr>
    <%
        }
      } catch (Exception e) {
        out.println("<p style='color:red;'>Database Error: " + e.getMessage() + "</p>");
      }
    %>
  </table>
</body>
</html>`}</CodeBlock>
                </div>
              )}

              {/* Exception Tab */}
              {jdbcTab === 'exception' && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-ink">Handling SQLException & Resource Cleanup</h3>
                  <p className="text-sm leading-relaxed text-ink/90">
                    Every database interaction can fail (e.g. server offline, table missing, syntax error). Always wrap JDBC operations in <code>try-catch</code> and guarantee closing of Connection, Statement, and ResultSet to avoid connection leaks.
                  </p>

                  <CodeBlock label="SafeResourceHandling.java">{`// Using Java 7+ try-with-resources (automatically closes resources!)
try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
     PreparedStatement ps = conn.prepareStatement("SELECT * FROM orders WHERE id = ?")) {

    ps.setInt(1, 10248);

    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            System.out.println("Order Date: " + rs.getDate("order_date"));
        }
    }
} catch (SQLException e) {
    System.err.println("SQL State: " + e.getSQLState());
    System.err.println("Error Code: " + e.getErrorCode());
    System.err.println("Message: " + e.getMessage());
    e.printStackTrace();
}`}</CodeBlock>
                </div>
              )}
            </article>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3.3 LAB: Northwind Workbench Hands-on Lab                           */}
          {/* ========================================================================= */}
          {stage === '3.3_lab' && (
            <article>
              <SectionHeading
                eyebrow="Hands-on Lab · MySQL Workbench · 25 min"
                title="Load Northwind & Build a JOIN View"
                subtitle="Practical tutorial: Import schema & data, resolve column collision (Error 1060), and create customer_order_overview VIEW"
              />

              <p className="mt-6 leading-relaxed">
                Watch the{' '}
                <a
                  className="font-semibold text-lamp underline"
                  href="https://youtu.be/0vkBVJz1xY8"
                  target="_blank"
                  rel="noreferrer"
                >
                  INNER JOIN vs LEFT JOIN video <ExternalLink size={14} className="inline" />
                </a>
                , then follow this step-by-step tutorial in MySQL Workbench. You will execute the official SQL scripts to reconstruct the Northwind database, resolve column collisions, and save the joined query as a reusable virtual <strong>VIEW</strong> for your JSP application.
              </p>

              {/* Download cards */}
              <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/60 p-6">
                <div className="border-b border-hairline/70 pb-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                    <Download size={20} className="text-lamp" /> Download the Northwind SQL Files
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    Execute these three scripts strictly in sequence:{' '}
                    <strong>1. northwind.sql &rarr; 2. northwind-data.sql &rarr; 3. customer-order-view.sql</strong>.
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
                        <span className="rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-bold text-lamp">
                          1st · Schema
                        </span>
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
                        <span className="rounded-full bg-lamp/15 px-2.5 py-0.5 text-xs font-bold text-lamp">
                          2nd · Data
                        </span>
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
                        <span className="rounded-full bg-amber/20 px-2.5 py-0.5 text-xs font-bold text-amber-deep">
                          3rd · View
                        </span>
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

              {/* Tabbed Steps */}
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
                        <span>
                          <strong>Workbench Pro-tip:</strong> {VIEW_TUTORIAL_STEPS[viewStep].tip}
                        </span>
                      </div>
                    )}

                    {VIEW_TUTORIAL_STEPS[viewStep].verifySql && (
                      <div className="mt-5">
                        <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Zap size={16} className="text-lamp" /> Verification Query (run after data finishes):
                        </h5>
                        <CodeBlock label="Verify Tables & Counts in Workbench">
                          {VIEW_TUTORIAL_STEPS[viewStep].verifySql}
                        </CodeBlock>
                      </div>
                    )}

                    {VIEW_TUTORIAL_STEPS[viewStep].viewSql && (
                      <div className="mt-5">
                        <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <FileCode size={16} className="text-lamp" /> View Definition (customer-order-view.sql):
                        </h5>
                        <CodeBlock label="customer-order-view.sql">
                          {VIEW_TUTORIAL_STEPS[viewStep].viewSql}
                        </CodeBlock>
                      </div>
                    )}

                    {VIEW_TUTORIAL_STEPS[viewStep].querySql && (
                      <div className="mt-5">
                        <h5 className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Zap size={16} className="text-lamp" /> Queries to test and compare in Workbench:
                        </h5>
                        <CodeBlock label="Query View & Compare Joins">
                          {VIEW_TUTORIAL_STEPS[viewStep].querySql}
                        </CodeBlock>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Relationship & Alias Collision deep dive */}
              <div className="mt-10 rounded-xl border border-hairline p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-ink">
                  <BookOpen size={20} className="text-lamp" /> Column Collision Prevention (Error 1060)
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/90">
                  Both the <code>customers</code> table and <code>orders</code> table have a primary key named <code>id</code>. If you create a view without distinct aliases, MySQL throws:
                </p>
                <pre className="mt-2 rounded bg-shelf p-2.5 font-mono text-xs text-paper">
                  ERROR 1060 (42S21): Duplicate column name 'id'
                </pre>
                <p className="mt-2 text-xs text-ink-muted">
                  By defining <code>c.id AS customer_id</code> and <code>o.id AS order_id</code>, every column in the view receives a unique name!
                </p>
              </div>

              {/* Interactive join choice */}
              <div className="mt-8 rounded-xl bg-paper-aged p-5">
                <h3 className="font-display text-xl font-semibold text-ink">Test Your SQL Knowledge</h3>
                <p className="mt-2 text-sm text-ink-muted">
                  Choose the two parts needed to keep customers who have never placed an order:
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Join Type
                    <select
                      value={joinChoice}
                      onChange={(e) => {
                        setJoinChoice(e.target.value)
                        setJoinChecked(false)
                      }}
                      className="mt-2 block min-h-11 w-full rounded-lg border border-hairline bg-paper px-3 text-ink text-sm"
                    >
                      <option value="">Select Join</option>
                      <option value="INNER">INNER JOIN</option>
                      <option value="LEFT">LEFT JOIN</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold">
                    Matching Foreign Key
                    <select
                      value={conditionChoice}
                      onChange={(e) => {
                        setConditionChoice(e.target.value)
                        setJoinChecked(false)
                      }}
                      className="mt-2 block min-h-11 w-full rounded-lg border border-hairline bg-paper px-3 text-ink text-sm"
                    >
                      <option value="">Select ON Condition</option>
                      <option value="correct">o.customer_id = c.id</option>
                      <option value="order">o.id = c.id</option>
                      <option value="company">o.customer_id = c.company</option>
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  disabled={!joinChoice || !conditionChoice}
                  onClick={() => setJoinChecked(true)}
                  className="mt-4 min-h-10 rounded-lg bg-amber px-4 font-semibold text-white disabled:opacity-50 text-sm"
                >
                  Check Answer
                </button>
                {joinChecked && (
                  <p
                    role="status"
                    className={`mt-3 text-sm font-semibold ${
                      joinChoice === 'LEFT' && conditionChoice === 'correct'
                        ? 'text-lamp'
                        : 'text-incorrect'
                    }`}
                  >
                    {joinChoice === 'LEFT' && conditionChoice === 'correct'
                      ? '✓ Correct! LEFT JOIN retains all customers; orders.customer_id matches customers.id.'
                      : '✗ Keep customers with LEFT JOIN and link orders.customer_id to customers.id.'}
                  </p>
                )}
              </div>

              {/* Checklist */}
              <fieldset className="mt-8 rounded-xl bg-paper-aged p-6">
                <legend className="flex items-center gap-2 px-1 font-display text-xl font-semibold text-ink">
                  <CheckCircle2 size={20} className="text-lamp" /> My Workbench View Checklist
                </legend>
                <div className="mt-4 space-y-3">
                  {VIEW_TUTORIAL_CHECKS.map((item, i) => (
                    <label
                      key={item}
                      className="flex cursor-pointer items-start gap-3 rounded-lg p-1.5 hover:bg-paper/60"
                    >
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
            </article>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3.4: MVC Project Integration                                        */}
          {/* ========================================================================= */}
          {stage === '3.4' && (
            <article>
              <SectionHeading
                eyebrow="Topic 3.4 · MVC Architecture · 20 min"
                title="JSP and Servlet Integration in Project"
                subtitle="3.4: Model-View-Controller (MVC) architecture, request attribute passing, and end-to-end integration"
              />

              <p className="mt-6 leading-relaxed">
                In real-world enterprise Java development (and in your Politeknik final project), you never write SQL directly inside a JSP page, nor do you print HTML strings inside a Servlet. Instead, you integrate them using the industry-standard <strong>Model-View-Controller (MVC) Pattern</strong>.
              </p>

              {/* MVC Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3 text-xs">
                <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
                  <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">Controller (Servlet)</span>
                  <p className="mt-2 text-ink/90">
                    Receives user HTTP request &rarr; extracts parameters &rarr; calls Model/DAO &rarr; saves results in <code>request.setAttribute()</code> &rarr; forwards to JSP view.
                  </p>
                </div>

                <div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-4">
                  <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">Model (JavaBean & DAO)</span>
                  <p className="mt-2 text-ink/90">
                    Represents data entities (e.g. <code>Book.java</code>, <code>Customer.java</code>) and executes JDBC queries against MySQL database (<code>BookDAO.java</code>).
                  </p>
                </div>

                <div className="rounded-xl border border-lamp/40 bg-lamp/10 p-4">
                  <span className="font-bold text-lamp text-sm">View (JSP Page)</span>
                  <p className="mt-2 text-ink/90">
                    Pure presentation! Reads data bound in request scope (using Expression Language <code>\${'{customerList}'}</code> or JSTL) and renders the visual HTML page.
                  </p>
                </div>
              </div>

              {/* Interactive Simulator */}
              <MVCSimulator />
            </article>
          )}

          {/* ========================================================================= */}
          {/* CHECKPOINT: Topic 3 Checkpoint Quiz                                       */}
          {/* ========================================================================= */}
          {stage === 'checkpoint' && (
            <article>
              <SectionHeading
                eyebrow="Topic 3 Assessment · 10 min"
                title="Topic 3 Knowledge Checkpoint"
                subtitle="Test your complete mastery of Topic 3 (JSP Concepts, Tags, Implicit Objects, JDBC, and MVC Integration)"
              />

              <p className="mt-6 text-sm text-ink-muted leading-relaxed">
                Answer all 6 syllabus questions below. You can change your answers and re-grade at any time.
              </p>

              <div className="mt-8 space-y-8">
                {TOPIC3_QUESTIONS.map((question, qi) => (
                  <fieldset key={question.prompt} className="rounded-xl border border-hairline bg-paper p-5">
                    <legend className="font-semibold text-ink text-sm px-1">
                      {qi + 1}. {question.prompt}
                    </legend>
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, oi) => (
                        <label
                          key={option}
                          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 text-xs transition-colors ${
                            answers[qi] === oi
                              ? 'border-lamp bg-lamp/10 font-semibold text-ink'
                              : 'border-hairline hover:bg-paper-aged'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`topic3-q${qi}`}
                            checked={answers[qi] === oi}
                            onChange={() => {
                              setAnswers((old) => ({ ...old, [qi]: oi }))
                              setGraded(false)
                            }}
                            className="size-4 accent-lamp"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    {graded && (
                      <p
                        className={`mt-3 text-xs font-semibold ${
                          answers[qi] === question.answer ? 'text-lamp' : 'text-incorrect'
                        }`}
                      >
                        {answers[qi] === question.answer ? '✓ Correct.' : `✗ ${question.why}`}
                      </p>
                    )}
                  </fieldset>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setGraded(true)}
                  disabled={Object.keys(answers).length < TOPIC3_QUESTIONS.length}
                  className="min-h-11 rounded-lg bg-amber px-6 font-semibold text-white hover:bg-amber-deep disabled:opacity-50 text-sm transition-colors"
                >
                  Grade My Checkpoint
                </button>

                {graded && (
                  <p role="status" className="flex items-center gap-2 font-semibold text-sm text-ink">
                    <ClipboardCheck size={20} className="text-lamp" />
                    You scored{' '}
                    <span className="text-lamp font-bold">
                      {TOPIC3_QUESTIONS.reduce(
                        (score, q, i) => score + (answers[i] === q.answer ? 1 : 0),
                        0
                      )}
                    </span>{' '}
                    out of {TOPIC3_QUESTIONS.length} questions!
                  </p>
                )}
              </div>
            </article>
          )}

          {/* Bottom Next Stage Button */}
          {nextStage && (
            <div className="mt-12 border-t border-hairline pt-7">
              <button
                type="button"
                onClick={() => setStage(nextStage.id)}
                className="flex min-h-12 items-center gap-2 rounded-lg bg-amber px-5 font-semibold text-white hover:bg-amber-deep transition-colors text-sm"
              >
                Continue to {nextStage.label} <ArrowRight size={17} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
