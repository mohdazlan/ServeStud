import { useState } from 'react'
import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { AnnotatedCode } from '../components/AnnotatedCode.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react'

// ——— Annotated Code for Server-Side Servlet Validation ———
const SERVER_VALIDATION_LINES = [
  { indent: 0, segments: [{ t: '// Inside RegisterServlet.java (doPost)', tone: 'cm' }] },
  {
    indent: 0,
    segments: [
      { t: 'protected void ', tone: 'kw' },
      { t: 'doPost', tone: 'ty' },
      { t: '(HttpServletRequest request, HttpServletResponse response)' },
    ],
  },
  { indent: 4, segments: [{ t: 'throws ServletException, IOException {' }] },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 1. Extract raw parameters from request', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' matricNo = request.getParameter(' },
      { t: '"matricNo"', tone: 'str', note: 'extract' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' ageStr = request.getParameter(' },
      { t: '"age"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'List<String>', tone: 'ty' },
      { t: ' errors = new ArrayList<>();' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 2. Server validation: Required & Regex check', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'if', tone: 'kw' },
      { t: ' (matricNo == null || matricNo.trim().isEmpty()) {', note: 'nullcheck' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'errors.add(' },
      { t: '"Matric number is required."', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: '} else if (!matricNo.matches(' },
      { t: '"^[0-9]{2}[A-Z]{3}[0-9]{4}$"', tone: 'str', note: 'regex' },
      { t: ')) {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'errors.add(' },
      { t: '"Matric format must match 20DIT21F1001."', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 2, segments: [{ t: '}' }] },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 3. Safe numeric parsing with try-catch', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'try', tone: 'kw', note: 'trycatch' },
      { t: ' {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'int', tone: 'ty' },
      { t: ' age = Integer.parseInt(ageStr.trim());' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'if (age < 18 || age > 60) {' },
    ],
  },
  {
    indent: 6,
    segments: [
      { t: 'errors.add(' },
      { t: '"Age must be between 18 and 60."', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 4,
    segments: [{ t: '}' }],
  },
  {
    indent: 2,
    segments: [
      { t: '} catch (', note: 'numberformat' },
      { t: 'NumberFormatException', tone: 'ty' },
      { t: ' e) {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'errors.add(' },
      { t: '"Age must be a valid numeric integer."', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 2, segments: [{ t: '}' }] },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 4. Decision: If errors exist, forward back with error notes', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'if', tone: 'kw' },
      { t: ' (!errors.isEmpty()) {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'request.setAttribute(' },
      { t: '"errorList"', tone: 'str', note: 'forwarderror' },
      { t: ', errors);' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'request.getRequestDispatcher(' },
      { t: '"/register.jsp"', tone: 'str' },
      { t: ').forward(request, response);' },
    ],
  },
  {
    indent: 4,
    segments: [{ t: 'return;', tone: 'kw' }],
  },
  { indent: 2, segments: [{ t: '}' }] },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 2,
    segments: [
      { t: '// 5. Valid data! Proceed with database insertion or next business step', tone: 'cm' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'response.sendRedirect(' },
      { t: '"welcome.jsp"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 0, segments: [{ t: '}' }] },
]

const SERVER_VALIDATION_NOTES = {
  extract: {
    label: 'request.getParameter()',
    body: 'Retrieves form inputs sent over HTTP. Remember: all HTTP form values arrive in Java as raw String objects or null.',
    metaphor: 'The librarian reading the raw handwritten text on the patron’s registration form.',
  },
  nullcheck: {
    label: 'Null & Whitespace Guard',
    body: 'Always verify parameter is not null AND not empty after trim(). An uncompleted form field sends an empty string (""), not null.',
    metaphor: 'Checking if the patron left the matric number box completely blank or filled it with just spaces.',
  },
  regex: {
    label: 'matches(regexPattern)',
    body: 'Evaluates the string against a regular expression pattern. Ensures Politeknik format (e.g. 2 digits + 3 letters + 4 digits).',
    metaphor: 'Checking if the student ID matches the official Politeknik registration code rules.',
  },
  trycatch: {
    label: 'try-catch block',
    body: 'Safely wraps data conversion. If the user submits "twenty" instead of 20, Integer.parseInt will throw an exception instead of crashing the server.',
    metaphor: 'The librarian verifying that the age box actually contains numbers before calculating eligibility.',
  },
  numberformat: {
    label: 'NumberFormatException',
    body: 'Thrown by Integer.parseInt() or Double.parseDouble() when the string cannot be converted into a number. Catching this prevents HTTP 500 server crash.',
    metaphor: 'Politely catching bad handwritten text instead of collapsing the entire service desk.',
  },
  forwarderror: {
    label: 'Forwarding Errors',
    body: 'Attaching the error list to request scope and forwarding back to the JSP form so the user can fix the mistakes while keeping their previously typed data.',
    metaphor: 'Handing the form back to the patron with a list of red sticky notes pointing out what needs fixing.',
  },
}

// ——— Interactive Dual-Layer Validation Simulator ———
function ValidationSimulator() {
  const [matric, setMatric] = useState('20DIT21F1001')
  const [age, setAge] = useState('20')
  const [email, setEmail] = useState('student@polimukah.edu.my')
  const [clientValidationEnabled, setClientValidationEnabled] = useState(true)
  const [simulationResult, setSimulationResult] = useState(null)

  const handleSimulateSubmit = (e) => {
    e.preventDefault()

    const clientErrors = []
    if (clientValidationEnabled) {
      if (!matric.trim()) clientErrors.push('Client: Matric number is required (HTML5 required).')
      if (!/^[0-9]{2}[A-Za-z]{3}[0-9]{4}$/.test(matric)) {
        clientErrors.push('Client: Matric format invalid (HTML5 pattern attribute).')
      }
      if (!email.includes('@') || !email.includes('.')) {
        clientErrors.push('Client: Invalid email structure (HTML5 type="email").')
      }
      const ageNum = Number(age)
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 60) {
        clientErrors.push('Client: Age must be between 18 and 60 (HTML5 min/max).')
      }
    }

    if (clientErrors.length > 0) {
      setSimulationResult({
        layer: 'client_blocked',
        clientErrors,
        serverProcessed: false,
        message: 'Request was blocked on the Client Browser! No network packet was sent to the Servlet.',
      })
      return
    }

    // Passed client validation (or client validation disabled/bypassed) -> reaches Server
    const serverErrors = []
    if (!matric || matric.trim().length === 0) {
      serverErrors.push('Server Servlet: Matric number was null or empty.')
    } else if (!/^[0-9]{2}[A-Za-z]{3}[0-9]{4}$/.test(matric)) {
      serverErrors.push('Server Servlet: Regex match failed for matric pattern ^[0-9]{2}[A-Z]{3}[0-9]{4}$.')
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      serverErrors.push('Server Servlet: Email format failed server validation.')
    }

    try {
      const parsedAge = parseInt(age.trim(), 10)
      if (isNaN(parsedAge)) {
        serverErrors.push('Server Servlet: NumberFormatException caught. Age is not an integer.')
      } else if (parsedAge < 18 || parsedAge > 60) {
        serverErrors.push(`Server Servlet: Age ${parsedAge} is outside the allowed range (18–60).`)
      }
    } catch {
      serverErrors.push('Server Servlet: NumberFormatException during parse.')
    }

    if (serverErrors.length > 0) {
      setSimulationResult({
        layer: 'server_rejected',
        serverErrors,
        serverProcessed: true,
        message: 'Request reached the Servlet, but Server-Side Validation detected invalid data and forwarded back with errors.',
      })
    } else {
      setSimulationResult({
        layer: 'success',
        serverProcessed: true,
        message: 'Success! Both Client and Server validation passed. Servlet processed the request cleanly!',
      })
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <h4 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Sparkles size={20} className="text-lamp" /> Interactive Dual-Layer Validation Lab
          </h4>
          <p className="mt-1 text-sm text-ink-muted">
            Test how Client-side vs Server-side validation interact when submitting form data.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-paper px-3 py-1.5 text-xs font-semibold border border-hairline hover:bg-paper-aged">
          <input
            type="checkbox"
            checked={clientValidationEnabled}
            onChange={(e) => setClientValidationEnabled(e.target.checked)}
            className="accent-lamp"
          />
          <span>Enable Client-Side Validation</span>
        </label>
      </div>

      <form onSubmit={handleSimulateSubmit} className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Matric No (e.g. 20DIT21F1001)
          </label>
          <input
            type="text"
            value={matric}
            onChange={(e) => setMatric(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-paper px-3 py-2 text-sm font-mono text-ink"
            placeholder="20DIT21F1001"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Age (18 – 60)
          </label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-paper px-3 py-2 text-sm font-mono text-ink"
            placeholder="20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Student Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-hairline bg-paper px-3 py-2 text-sm font-mono text-ink"
            placeholder="name@polimukah.edu.my"
          />
        </div>

        <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setMatric('20DIT21F1001')
                setAge('21')
                setEmail('ali@polimukah.edu.my')
                setSimulationResult(null)
              }}
              className="rounded-lg border border-hairline bg-paper px-2.5 py-1 text-xs hover:bg-paper-aged"
            >
              Load Valid Sample
            </button>
            <button
              type="button"
              onClick={() => {
                setMatric('INVALID_MATRIC')
                setAge('abc')
                setEmail('not-an-email')
                setSimulationResult(null)
              }}
              className="rounded-lg border border-hairline bg-paper px-2.5 py-1 text-xs text-incorrect hover:bg-paper-aged"
            >
              Load Malformed Sample
            </button>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-white hover:bg-amber-deep"
          >
            Submit Request to Servlet <ArrowRight size={15} />
          </button>
        </div>
      </form>

      {simulationResult && (
        <div className="mt-6 rounded-xl border p-4 bg-paper transition-all">
          {simulationResult.layer === 'client_blocked' && (
            <div>
              <div className="flex items-center gap-2 text-amber font-semibold text-sm">
                <AlertTriangle size={18} />
                <span>Client-Side Validation Triggered (Browser Level)</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">{simulationResult.message}</p>
              <ul className="mt-3 list-disc pl-5 text-xs text-incorrect space-y-1">
                {simulationResult.clientErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <div className="mt-3 rounded bg-paper-aged p-2 text-[11px] text-ink-muted">
                <strong>Why it matters:</strong> Instant feedback saves user time and server bandwidth. However, a malicious user can turn off JavaScript or use Postman to bypass this!
              </div>
            </div>
          )}

          {simulationResult.layer === 'server_rejected' && (
            <div>
              <div className="flex items-center gap-2 text-incorrect font-semibold text-sm">
                <ShieldAlert size={18} />
                <span>Server-Side Validation Caught Errors (Servlet Level)</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">{simulationResult.message}</p>
              <ul className="mt-3 list-disc pl-5 text-xs text-incorrect space-y-1">
                {simulationResult.serverErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              <div className="mt-3 rounded bg-paper-aged p-2 text-[11px] text-ink-muted">
                <strong>Crucial Security Rule:</strong> Even if client validation was disabled or bypassed, the Servlet safely rejected the bad data, prevented database corruption, and prevented server crashes!
              </div>
            </div>
          )}

          {simulationResult.layer === 'success' && (
            <div>
              <div className="flex items-center gap-2 text-lamp font-semibold text-sm">
                <ShieldCheck size={18} />
                <span>All Validation Passes (Client & Server Clean)</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">{simulationResult.message}</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-lamp bg-lamp/10 p-2.5 rounded-lg">
                <CheckCircle2 size={16} /> HTTP 200 / 302 Redirect &rarr; Data inserted successfully into Northwind LMS database!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ——— Quiz Questions for Topic 2.3 ———
const QUIZ_VALIDATION = [
  {
    id: 'v1',
    q: 'Why is client-side validation (e.g. JavaScript or HTML5 pattern) not sufficient on its own for security?',
    options: [
      'It cannot validate letters or numbers',
      'It can be easily bypassed by disabling JavaScript or using tools like Postman/cURL',
      'It slows down the server database',
      'Java servlets cannot read HTML5 form attributes',
    ],
    answer: 1,
    explain:
      'Client-side validation is for User Experience (UX) and speed. An attacker can easily craft an HTTP POST request directly to the servlet bypassing the browser completely. Therefore, server-side validation is MANDATORY.',
  },
  {
    id: 'v2',
    q: 'When a user leaves a text input empty and submits the form, what does request.getParameter("name") return?',
    options: [
      'null',
      'An empty String ("")',
      'The word "undefined"',
      'Throws a NullPointerException',
    ],
    answer: 1,
    explain:
      'If the input field is present in the form but submitted blank, getParameter() returns an empty String (""). It only returns null if the parameter name was not submitted at all in the request.',
  },
  {
    id: 'v3',
    q: 'Which Java construct should be used when parsing numerical inputs like Integer.parseInt(ageStr) to prevent HTTP 500 errors?',
    options: [
      'A while loop',
      'A try-catch block catching NumberFormatException',
      'A switch-case statement',
      'The @Override annotation',
    ],
    answer: 1,
    explain:
      'If a user submits non-numeric text for an integer field, Integer.parseInt() throws a NumberFormatException. Catching it in a try-catch block allows your servlet to report a clean error message back to the user instead of crashing.',
  },
  {
    id: 'v4',
    q: 'What is the recommended servlet action when server-side validation fails?',
    options: [
      'Call System.exit(0) to terminate the JVM',
      'Save the invalid record to the database anyway',
      'Attach error messages via request.setAttribute() and forward back to the form JSP',
      'Send an empty 404 response to the user',
    ],
    answer: 2,
    explain:
      'Standard Java EE pattern: store the error list in request.setAttribute("errors", errors) and use RequestDispatcher.forward() back to the form page so the user can fix the mistakes without losing their submitted inputs.',
  },
]

const NDQ_VALIDATION = [
  {
    q: 'Should I validate inputs on the client or the server?',
    a: 'Both! Validate on the client for fast, friendly user feedback (so users don’t wait for a round-trip), and validate on the server for ironclad security and database integrity.',
  },
  {
    q: 'How does RegEx Sifu help with validation in Java Web apps?',
    a: 'Regular expressions are used on BOTH sides! In HTML5 forms, you put patterns in the pattern="..." attribute. In Java Servlets, you use the same regex with String.matches() or Pattern and Matcher.',
  },
  {
    q: 'What is the difference between string.isEmpty() and string.trim().isEmpty()?',
    a: 'string.isEmpty() checks if length is 0. If a user enters three spaces ("   "), isEmpty() returns false. Using trim().isEmpty() strips spaces first, correctly catching blank whitespace entries.',
  },
]

export default function Section6DataValidation({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-lamp">
          Topic 2 · Developing Servlet (Cont...)
        </p>
        <span className="rounded-full bg-lamp/15 px-3 py-0.5 text-xs font-bold text-lamp">
          Topic 2.3 · Data Validation
        </span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        Data Validation in Dynamic Web Pages
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topic 2.3: (i) Validating data on the client & (ii) Validating data on the server
      </p>

      <BrainPower>
        <p>
          A patron brings a library card application to the desk. If they wrote "N/A" for their IC number or left the phone field blank, should the librarian accept it, crash, or politely hand it back with corrections? Validation is the shield that keeps your application safe, secure, and accurate.
        </p>
      </BrainPower>

      <DefinitionCard term="Client vs. Server Validation">
        <div className="space-y-2">
          <p>
            <strong>Client-Side Validation (Browser Level):</strong> Checks performed in the user's browser before the HTTP request is transmitted (using HTML5 constraints, JavaScript, and RegEx patterns). Fast and responsive.
          </p>
          <p>
            <strong>Server-Side Validation (Servlet Level):</strong> Checks performed inside the Java servlet after receiving the request. Indispensable for security, preventing SQL injection, data corruption, and unauthorized payloads.
          </p>
        </div>
      </DefinitionCard>

      {/* Part 1: Client-Side Validation */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          1. Validating Data on the Client
        </h3>
        <p className="mt-3 leading-relaxed">
          Client validation intercepts user mistakes before sending unnecessary network requests. Modern web applications achieve this via HTML5 attributes and JavaScript event handlers.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-hairline bg-paper-aged/40 p-4">
            <h4 className="font-mono text-sm font-bold text-ink">HTML5 Built-in Validation</h4>
            <ul className="mt-2 space-y-1.5 text-xs text-ink/90">
              <li><code>required</code> — field cannot be left empty.</li>
              <li><code>type="email"</code> — enforces email syntax.</li>
              <li><code>type="number" min="18" max="60"</code> — numeric bounds.</li>
              <li><code>pattern="[0-9]{'{2}'}[A-Z]{'{3}'}[0-9]{'{4}'}"</code> — RegEx rule.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-hairline bg-paper-aged/40 p-4">
            <h4 className="font-mono text-sm font-bold text-ink">JavaScript Custom Validation</h4>
            <p className="mt-2 text-xs leading-relaxed text-ink/90">
              Attach to <code>form.onsubmit</code> or input events. Call <code>event.preventDefault()</code> to halt form submission when custom business rules fail (e.g. password confirmation match).
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.hash = '/regex-sifu'
                    window.dispatchEvent(new HashChangeEvent('hashchange'))
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-[#080e1a] px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-[#121c30]"
              >
                <span className="font-mono">.*</span> Practice RegEx in Sifu Dojo &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Server-Side Validation */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          2. Validating Data on the Server (Servlet)
        </h3>
        <p className="mt-3 leading-relaxed">
          Because anyone can bypass browser checks using developer tools, curl, or automated bots, your servlet must validate every single incoming parameter before touching the database.
        </p>

        <AnnotatedCode lines={SERVER_VALIDATION_LINES} notes={SERVER_VALIDATION_NOTES} />
      </section>

      {/* Interactive Simulator */}
      <ValidationSimulator />

      {/* No Dumb Questions */}
      <NoDumbQuestions items={NDQ_VALIDATION} />

      {/* Checkpoint Quiz */}
      <CheckpointQuiz sectionId={6} questions={QUIZ_VALIDATION} threshold={3} />
    </article>
  )
}
