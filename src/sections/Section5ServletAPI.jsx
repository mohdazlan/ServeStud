import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { AnnotatedCode } from '../components/AnnotatedCode.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'

// ——— HttpServletRequest examples ———

const REQUEST_HANDOFF_LINES = [
  { indent: 0, segments: [{ t: '// The container builds this for you:', tone: 'cm' }] },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 0,
    segments: [
      { t: 'protected void ', tone: 'kw' },
      { t: 'doGet', tone: 'ty' },
      { t: '(' },
      { t: 'HttpServletRequest', tone: 'ty' },
      { t: ' request,' },
    ],
  },
  {
    indent: 18,
    segments: [{ t: 'HttpServletResponse', tone: 'ty' }, { t: ' response)' }],
  },
  { indent: 18, segments: [{ t: 'throws ServletException, IOException {' }] },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 2,
    segments: [
      { t: '// request is EVERYTHING the patron sent:', tone: 'cm' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' searchTerm = request.getParameter(' },
      { t: '"q"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' method = request.getMethod();' },
      { t: ' // "GET" or "POST"' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' path = request.getRequestURI();' },
      { t: '   // "/library/search"' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' browser = request.getHeader(' },
      { t: '"User-Agent"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 0, segments: [{ t: '}' }] },
]

const REQUEST_API_NOTES = {
  q: {
    label: 'getParameter("q")',
    body: 'Reads form data or query string. ?q=java&topic=servlets gives you "java" when you ask for "q".',
    metaphor:
      'Reading what the patron wrote on their request slip: title, author, ISBN, whatever they specified.',
  },
  method: {
    label: 'getMethod()',
    body: 'Returns GET, POST, PUT, DELETE, etc. Tells you the HTTP verb the client used.',
    metaphor: 'Knowing whether the patron is asking (GET) or submitting (POST).',
  },
  uri: {
    label: 'getRequestURI()',
    body: 'Returns the URL path: /library/search. The @WebServlet annotation tells the container which servlet handles this path.',
    metaphor: 'Knowing which desk the patron walked up to.',
  },
  header: {
    label: 'getHeader("User-Agent")',
    body: 'Reads HTTP headers. Headers are metadata the browser sends with every request.',
    metaphor: 'Reading metadata on the request slip: was it written with pen or pencil? By hand or printed?',
  },
}

// ——— HttpServletResponse examples ———

const RESPONSE_WRITE_LINES = [
  { indent: 0, segments: [{ t: '// response is a blank envelope:', tone: 'cm' }] },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 2,
    segments: [
      { t: 'response.setContentType(' },
      { t: '"text/html; charset=UTF-8"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'response.setStatus(' },
      { t: '200', tone: 'num' },
      { t: ');' },
      { t: ' // HTTP success' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 2,
    segments: [
      { t: 'PrintWriter', tone: 'ty' },
      { t: ' out = response.getWriter();' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'out.println(' },
      { t: '"<h1>Books found:</h1>"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'out.println(' },
      { t: '"<ul>"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'for (Book', tone: 'ty' },
      { t: ' book : books) {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'out.println(' },
      { t: '"<li>"', tone: 'str' },
      { t: ' + book.getTitle() + ' },
      { t: '"</li>"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 2, segments: [{ t: '}' }] },
  {
    indent: 2,
    segments: [
      { t: 'out.println(' },
      { t: '"</ul>"', tone: 'str' },
      { t: ');' },
    ],
  },
]

const RESPONSE_API_NOTES = {
  contenttype: {
    label: 'setContentType()',
    body: 'Tells the browser what kind of data you\'re sending: "text/html", "application/json", "image/png", etc. Must be called before you get the writer.',
    metaphor:
      'Writing "BOOK TITLES" on the front of the envelope so the patron knows what to expect inside.',
  },
  status: {
    label: 'setStatus()',
    body: 'Sets the HTTP status code: 200 (success), 404 (not found), 500 (error). Defaults to 200 if you don\'t set it.',
    metaphor: 'A stamp on the envelope: ✓ FOUND, ✗ NOT FOUND, ⚠ ERROR.',
  },
  writer: {
    label: 'getWriter()',
    body: 'Returns a PrintWriter. Everything you write to it becomes the response body — what the browser displays.',
    metaphor: 'Getting a pen and paper to write the answer inside the envelope.',
  },
}

// ——— Request/Response flow animation ———

const FLOW_STEPS = [
  {
    title: 'Patron arrives',
    description:
      'Browser sends: GET /library/search?q=java HTTP/1.1, plus headers.',
    action: 'Container receives HTTP packet',
  },
  {
    title: 'Container builds HttpServletRequest',
    description:
      'Parses the HTTP data: extracts q=java, method=GET, path=/library/search, headers, etc.',
    action: 'Request object is ready',
  },
  {
    title: 'Container builds HttpServletResponse',
    description: 'Creates a blank envelope — all set to fill with data.',
    action: 'Response object is ready',
  },
  {
    title: 'Container calls doGet(request, response)',
    description:
      'Your servlet code runs: reads request parameters, queries the database, builds HTML, writes to response.',
    action: 'Your code executes',
  },
  {
    title: 'You write HTML to response.getWriter()',
    description:
      'Everything you print becomes the response body: "<html><body>...",  status code defaults to 200.',
    action: 'Response body and headers are built',
  },
  {
    title: 'Container sends response back over HTTP',
    description:
      'HTTP 200 OK header, Content-Type, any cookies you set, and your HTML body all sent to the browser.',
    action: 'Browser receives and renders the page',
  },
]

// ——— Request scope & forwarding ———

const REQUEST_SCOPE_LINES = [
  { indent: 0, segments: [{ t: '// Servlet A: receives request', tone: 'cm' }] },
  {
    indent: 0,
    segments: [
      { t: 'protected void ', tone: 'kw' },
      { t: 'doGet', tone: 'ty' },
      { t: '(HttpServletRequest request, ...) {' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'request.setAttribute(' },
      { t: '"bookTitle"', tone: 'str' },
      { t: ', ' },
      { t: '"Effective Java"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'RequestDispatcher', tone: 'ty' },
      { t: ' disp = request.getRequestDispatcher(' },
      { t: '"/jsp/details"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 2, segments: [{ t: 'disp.forward(request, response);' }] },
  {
    indent: 2,
    segments: [{ t: '// Forwards request & response to /jsp/details' }],
  },
  { indent: 0, segments: [{ t: '}' }] },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 0, segments: [{ t: '// JSP /jsp/details receives same request:' }] },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 0,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' title = (' },
      { t: 'String', tone: 'ty' },
      { t: ') request.getAttribute(' },
      { t: '"bookTitle"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 0,
    segments: [
      { t: '// title is now "Effective Java"', tone: 'cm' },
    ],
  },
]

const REQUEST_SCOPE_NOTES = {
  setattr: {
    label: 'setAttribute(key, value)',
    body: 'Stores data in the request scope — visible to that request only. Perfect for forwarding data between servlets/JSPs without URL parameters.',
    metaphor:
      'The librarian writing a private note on the request slip: "Check shelf B for this one."',
  },
  dispatcher: {
    label: 'getRequestDispatcher(path)',
    body: 'Get a dispatcher to forward or include another resource. The request object travels with it — along with any attributes you set.',
    metaphor:
      "Handing the patron's request slip (with notes) to another desk to handle the next step.",
  },
  forward: {
    label: 'forward(request, response)',
    body: 'Pass control (and the request/response) to another servlet/JSP. The browser never knows — same URL, but different code handled it.',
    metaphor: 'The first librarian hands the slip to a specialist: "You take it from here."',
  },
}

// ——— Interactive API reference table ———

function APIReferenceSection() {
  return (
    <section className="mt-16">
      <h3 className="font-display text-2xl font-semibold">
        The API at a glance
      </h3>
      <p className="mt-3 max-w-[62ch] leading-relaxed">
        When the container calls your servlet, you get two objects. Here's what you can do with them.
      </p>

      <div className="mt-6 space-y-8">
        {/* HttpServletRequest */}
        <div>
          <h4 className="font-mono text-sm font-semibold text-amber">
            HttpServletRequest
          </h4>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            What the patron asked for — everything the browser sent.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full text-sm">
              <thead className="bg-paper-aged border-b border-hairline">
                <tr>
                  <th className="px-4 py-2 text-left font-mono font-semibold">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left">What it gives you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getParameter(name)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    A form field or query string value. Returns null if not found.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getParameterValues(name)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Multiple values with the same name (checkboxes, multi-select).
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">getMethod()</td>
                  <td className="px-4 py-2 text-sm">
                    HTTP verb: "GET", "POST", "PUT", "DELETE", etc.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getRequestURI()
                  </td>
                  <td className="px-4 py-2 text-sm">
                    The path: /library/search (without domain or query string).
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getHeader(name)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    A single HTTP header: User-Agent, Accept, Cookie, etc.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getHeaderNames()
                  </td>
                  <td className="px-4 py-2 text-sm">
                    All header names the browser sent (as an Enumeration).
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    setAttribute(key, value)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Store data in request scope (for forwarding to other servlets).
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getAttribute(key)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Retrieve data another servlet stored in this request.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getRequestDispatcher(path)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    A dispatcher to forward or include another servlet/JSP.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* HttpServletResponse */}
        <div>
          <h4 className="font-mono text-sm font-semibold text-amber">
            HttpServletResponse
          </h4>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed">
            Your blank envelope — fill it with the answer and send it back.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full text-sm">
              <thead className="bg-paper-aged border-b border-hairline">
                <tr>
                  <th className="px-4 py-2 text-left font-mono font-semibold">
                    Method
                  </th>
                  <th className="px-4 py-2 text-left">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    setContentType(type)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Tell the browser what you're sending: "text/html", "application/json",
                    "image/png", etc.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    setStatus(code)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Set HTTP status: 200 (OK), 404 (not found), 500 (error), etc.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">getWriter()</td>
                  <td className="px-4 py-2 text-sm">
                    Get a PrintWriter to write the response body as text/HTML.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    getOutputStream()
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Write binary data (images, PDFs). Use getWriter() OR getOutputStream(),
                    not both.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    addCookie(cookie)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Send a cookie to the browser (must be called before getWriter()).
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    setHeader(name, value)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Set an HTTP response header: Cache-Control, Pragma, custom headers.
                  </td>
                </tr>
                <tr className="hover:bg-paper-aged/50">
                  <td className="px-4 py-2 font-mono text-xs">
                    sendRedirect(url)
                  </td>
                  <td className="px-4 py-2 text-sm">
                    Send a 302 redirect. The browser automatically fetches the new URL.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

// ——— Quiz questions ———

const QUIZ = [
  {
    id: 'q1',
    q: 'Which of these gives you data the browser sent?',
    options: [
      'request.getParameter("name")',
      'response.getWriter()',
      'response.setContentType()',
      'response.sendRedirect()',
    ],
    answer: 0,
    explain:
      'getParameter() reads data from the request. The response methods are for building the answer, not reading the question.',
  },
  {
    id: 'q2',
    q: 'What must you do to tell the browser you\'re sending HTML?',
    options: [
      'Call setContentType("text/html")',
      'Call getWriter() first, then write HTML',
      'Set the HTTP method to GET',
      'Nothing — browsers assume HTML',
    ],
    answer: 0,
    explain:
      'setContentType() sends an HTTP header telling the browser what kind of data to expect. It must be called before you write any data.',
  },
  {
    id: 'q3',
    q: 'You call request.setAttribute("user", user). Where is this data stored?',
    options: [
      'In the browser cookie',
      'In the database',
      'In the request scope — only visible to servlets/JSPs handling this one request',
      'In the session — visible to all of this user\'s future requests',
    ],
    answer: 2,
    explain:
      'setAttribute() stores data in request scope — it travels with the request if you forward it, but disappears when the request ends.',
  },
  {
    id: 'q4',
    q: 'Your servlet calls response.getWriter() twice. What happens?',
    options: [
      'You get two separate PrintWriter objects',
      'You get the same PrintWriter object both times',
      'The second call throws an exception',
      'The first PrintWriter is closed',
    ],
    answer: 1,
    explain:
      'response.getWriter() returns the same writer each time it\'s called on the same response. There\'s only one output stream per request.',
  },
  {
    id: 'q5',
    q: 'What does request.getMethod() return if you submit an HTML form without specifying a method attribute?',
    options: ['GET', 'POST', 'PUT', 'It depends on the server'],
    answer: 0,
    explain:
      'HTML forms default to GET if no method is specified. (Security note: this is why forms that change data should use POST instead.)',
  },
  {
    id: 'q6',
    q: 'Your servlet is forwarding a request to another servlet. How do you pass data between them?',
    options: [
      'Store it in the database first',
      'Use request.setAttribute() to store it in the request scope',
      'Send it as a URL parameter',
      'Store it in a Cookie',
    ],
    answer: 1,
    explain:
      'setAttribute() stores data in request scope, and the attributes travel with the request when you forward it. That\'s the cleanest way to pass data between servlets in a forward.',
  },
]

// ——— NDQ ———

const NDQ = [
  {
    q: 'Can I call response.getWriter() and response.getOutputStream() in the same method?',
    a: 'No — you can only write text OR binary, not both. Once you call one, the other throws IllegalStateException. Choose your weapon before you start writing.',
  },
  {
    q: 'What happens if I don\'t call setContentType()?',
    a: 'The servlet defaults to "text/plain; charset=ISO-8859-1". If you\'re writing HTML, the browser might not interpret your <tags> correctly. Always set the content type if you care how the browser renders it.',
  },
  {
    q: 'Do request parameters come from the URL only?',
    a: 'No — getParameter() reads from both: query string (GET: ?name=value) and request body (POST forms). The servlet doesn\'t care where it came from, just gives you the value.',
  },
  {
    q: 'Can I modify a request object to change what the browser sent?',
    a: 'No — the request object is read-only from your servlet\'s perspective. You\'re reading a summary of what already happened. setAttribute() lets you store new data IN the request, but you can\'t change the original browser data.',
  },
  {
    q: 'If I call sendRedirect(), does the rest of my doGet() method still run?',
    a: 'Yes, the method keeps running. But sendRedirect() sets the response status and headers, so the browser ignores everything else you write. Best practice: call return immediately after sendRedirect() to avoid confusion.',
  },
]

export default function Section5ServletAPI({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 5 · about 12 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        The Servlet API — Speaking the Container's Language
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topics 1.3.4, 1.3.5 — core Servlet API and HTTP servlets
      </p>

      <BrainPower>
        <p>
          You now know what a servlet is and how it lives and dies. But when the
          container hands a request to your servlet, exactly what objects do you
          get? And what can you do with them? Time to learn the API — the
          language your servlet speaks to communicate with the container and the
          browser.
        </p>
      </BrainPower>

      <DefinitionCard term="The Handoff">
        <p>
          Every time your servlet's <code>service()</code> method is called, the
          container creates two objects and hands them both to you:
        </p>
        <p className="mt-2">
          <strong>HttpServletRequest</strong> — everything the browser sent
          (parameters, headers, method, URL path, etc.).
        </p>
        <p className="mt-1">
          <strong>HttpServletResponse</strong> — an empty envelope. You fill it
          with your answer (headers, status code, body content) and send it back.
        </p>
      </DefinitionCard>

      {/* Learn — anatomy of request and response */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          Learn — reading and writing HTTP
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here's a servlet that reads what the browser asked for, does work, and
          writes back an HTML response:
        </p>
        <AnnotatedCode lines={REQUEST_HANDOFF_LINES} notes={REQUEST_API_NOTES} />
      </section>

      {/* Response writing */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Building your answer
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          The response object starts blank. You tell the container what type of
          data you're sending, set status codes, and write the body:
        </p>
        <AnnotatedCode
          lines={RESPONSE_WRITE_LINES}
          notes={RESPONSE_API_NOTES}
        />
      </section>

      {/* Request/Response flow */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          The whole dance
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Here's what happens when you submit a form: the request arrives, the
          container builds two objects, your code runs, and the response goes back.
        </p>
        <div className="mt-6 space-y-4">
          {FLOW_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-hairline p-4 hover:border-amber/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber/10 font-mono text-sm font-semibold text-amber">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-ink">{step.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1 rounded bg-paper-aged px-2.5 py-1 text-xs font-mono font-semibold text-amber">
                    ▶ {step.action}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Request scope & forwarding */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Forwarding requests between servlets
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Sometimes one servlet isn't enough. You parse the request in Servlet A,
          store data using <code>setAttribute()</code>, and forward the same request
          to Servlet B (or a JSP). Servlet B reads the data using{' '}
          <code>getAttribute()</code>. The browser never knows.
        </p>
        <AnnotatedCode
          lines={REQUEST_SCOPE_LINES}
          notes={REQUEST_SCOPE_NOTES}
        />
      </section>

      {/* API Reference */}
      <APIReferenceSection />

      {/* Think — key patterns */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          Think — patterns to remember
        </h3>
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-hairline p-4 bg-paper-aged/30">
            <h4 className="font-semibold text-ink">Pattern 1: Parse, then respond</h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Every servlet follows the same shape: read request parameters,
              validate, do business logic, build response, write output.
            </p>
          </div>
          <div className="rounded-lg border border-hairline p-4 bg-paper-aged/30">
            <h4 className="font-semibold text-ink">
              Pattern 2: Set content type first
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Always call <code>setContentType()</code> before you call{' '}
              <code>getWriter()</code>. Browsers trust this header to know how to
              render what you send.
            </p>
          </div>
          <div className="rounded-lg border border-hairline p-4 bg-paper-aged/30">
            <h4 className="font-semibold text-ink">
              Pattern 3: Attributes for forwarding
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              If you're forwarding the request to another servlet/JSP, use
              request attributes to pass complex objects. URL parameters are for
              simple strings only.
            </p>
          </div>
          <div className="rounded-lg border border-hairline p-4 bg-paper-aged/30">
            <h4 className="font-semibold text-ink">
              Pattern 4: Status codes matter
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Default to 200 (success), but use 404 for "not found", 500 for
              errors, 302 for redirects. Search engines and apps read these codes.
            </p>
          </div>
        </div>
      </section>

      <NoDumbQuestions items={NDQ} />

      {/* Prove */}
      <CheckpointQuiz sectionId={5} questions={QUIZ} threshold={4} />
    </article>
  )
}
