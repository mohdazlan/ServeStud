import { useState } from 'react'
import { BrainPower, DefinitionCard, NoDumbQuestions } from '../components/callouts.jsx'
import { AnnotatedCode } from '../components/AnnotatedCode.jsx'
import { CheckpointQuiz } from '../components/CheckpointQuiz.jsx'
import { Shuffle, ExternalLink, Server } from 'lucide-react'

// ——— Annotated Code for Response Headers and Redirects ———
const RESPONSE_HEADER_LINES = [
  { indent: 0, segments: [{ t: '// Inside ResponseDemoServlet.java', tone: 'cm' }] },
  {
    indent: 0,
    segments: [
      { t: 'protected void ', tone: 'kw' },
      { t: 'doGet', tone: 'ty' },
      { t: '(HttpServletRequest request, HttpServletResponse response)' },
    ],
  },
  { indent: 4, segments: [{ t: 'throws ServletException, IOException {' }] },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 1. Configure standard Content-Type & Character Encoding', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'response.setContentType(' },
      { t: '"text/html; charset=UTF-8"', tone: 'str', note: 'contenttype' },
      { t: ');' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 2. Set custom headers and Cache-Control', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'response.setHeader(' },
      { t: '"Cache-Control"', tone: 'str', note: 'cache' },
      { t: ', ' },
      { t: '"no-cache, no-store, must-revalidate"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 2,
    segments: [
      { t: 'response.setHeader(' },
      { t: '"X-Powered-By"', tone: 'str', note: 'customheader' },
      { t: ', ' },
      { t: '"Politeknik-ServeStud-LMS"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  { indent: 2, segments: [{ t: '// 3. Conditional navigation: Redirect vs Forward', tone: 'cm' }] },
  {
    indent: 2,
    segments: [
      { t: 'String', tone: 'ty' },
      { t: ' userRole = request.getParameter(' },
      { t: '"role"', tone: 'str' },
      { t: ');' },
    ],
  },
  { indent: 0, segments: [{ t: '' }] },
  {
    indent: 2,
    segments: [
      { t: 'if', tone: 'kw' },
      { t: ' ("admin".equals(userRole)) {' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: '// Client-side 302 Redirect: Browser address bar updates to /admin-dashboard.jsp', tone: 'cm' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'response.sendRedirect(' },
      { t: '"admin-dashboard.jsp"', tone: 'str', note: 'redirect' },
      { t: ');' },
    ],
  },
  {
    indent: 4,
    segments: [{ t: 'return;', tone: 'kw' }],
  },
  {
    indent: 2,
    segments: [{ t: '} else {' }],
  },
  {
    indent: 4,
    segments: [
      { t: '// Server-side Forward: RequestDispatcher preserves request attributes behind the scenes', tone: 'cm' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'request.setAttribute(' },
      { t: '"guestMessage"', tone: 'str' },
      { t: ', ' },
      { t: '"Welcome, student visitor!"', tone: 'str' },
      { t: ');' },
    ],
  },
  {
    indent: 4,
    segments: [
      { t: 'RequestDispatcher', tone: 'ty' },
      { t: ' rd = request.getRequestDispatcher(' },
      { t: '"/catalog.jsp"', tone: 'str', note: 'forward' },
      { t: ');' },
    ],
  },
  {
    indent: 4,
    segments: [{ t: 'rd.forward(request, response);' }],
  },
  {
    indent: 2,
    segments: [{ t: '}' }],
  },
  { indent: 0, segments: [{ t: '}' }] },
]

const RESPONSE_HEADER_NOTES = {
  contenttype: {
    label: 'setContentType()',
    body: 'Tells the browser MIME type and character encoding. Must be set BEFORE writing response body.',
    metaphor: 'Printing "OFFICIAL CATALOG — ENGLISH UTF-8" on the front of the envelope.',
  },
  cache: {
    label: 'Cache-Control Header',
    body: 'Instructs intermediate proxies and browsers never to cache sensitive dynamic database output.',
    metaphor: 'Stamping "CONFIDENTIAL: DO NOT STORE COPY" on the envelope.',
  },
  customheader: {
    label: 'setHeader(name, value)',
    body: 'Sets an HTTP response header. Overwrites previous value if header key already exists. Use addHeader() if multiple values needed.',
    metaphor: 'Attaching an official metadata stamp to the envelope.',
  },
  redirect: {
    label: 'sendRedirect(url)',
    body: 'Issues HTTP 302 Found response. Tells the browser: "The resource is over there at new URL; go send a fresh GET request to it."',
    metaphor: 'The librarian saying: "Please leave this desk and walk over to Service Desk B in the other wing."',
  },
  forward: {
    label: 'RequestDispatcher.forward()',
    body: 'Passes request and response internally inside the server. Browser URL never changes and request attributes are preserved.',
    metaphor: 'The librarian quietly asking a colleague in the back room to prepare the answer without sending the patron away.',
  },
}

// ——— Interactive Forward vs. Redirect Inspector ———
function RedirectVsForwardVisualizer() {
  const [mode, setMode] = useState('forward')

  return (
    <div className="mt-10 rounded-xl border border-hairline bg-paper-aged/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <h4 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Shuffle size={20} className="text-lamp" /> Interactive: Redirect vs. Forward Comparison
          </h4>
          <p className="mt-1 text-sm text-ink-muted">
            Inspect the network packets, URL address changes, and request attribute lifecycle.
          </p>
        </div>
        <div className="flex rounded-lg border border-hairline bg-paper p-1">
          <button
            type="button"
            onClick={() => setMode('forward')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mode === 'forward' ? 'bg-lamp text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            RequestDispatcher.forward()
          </button>
          <button
            type="button"
            onClick={() => setMode('redirect')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mode === 'redirect' ? 'bg-amber text-white' : 'text-ink-muted hover:text-ink'
            }`}
          >
            response.sendRedirect()
          </button>
        </div>
      </div>

      {mode === 'forward' ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-lamp/30 bg-lamp/10 p-4">
            <div className="flex items-center gap-2 font-semibold text-lamp text-sm">
              <Server size={18} />
              <span>RequestDispatcher.forward() — Server-Side Internal Dispatch</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink/90">
              Only <strong>ONE</strong> round-trip request between Browser and Server. The container routes the request object directly from the Servlet to the JSP inside Tomcat.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">1. Browser Address Bar</span>
              <p className="font-mono text-ink">/library/search</p>
              <span className="text-[11px] text-lamp font-semibold mt-1 block">✓ Never changes (seamless)</span>
            </div>
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">2. HTTP Requests Sent</span>
              <p className="font-mono text-ink">1 single HTTP request</p>
              <span className="text-[11px] text-lamp font-semibold mt-1 block">✓ Fast (no 2nd round-trip)</span>
            </div>
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">3. Request Attributes</span>
              <p className="font-mono text-ink">request.getAttribute()</p>
              <span className="text-[11px] text-lamp font-semibold mt-1 block">✓ Preserved (data retained)</span>
            </div>
          </div>

          <div className="rounded-lg bg-shelf p-4 font-mono text-xs text-paper space-y-1">
            <p className="text-paper/60">// Trace execution for forward:</p>
            <p className="text-green-400">1. Browser &rarr; GET /search &rarr; SearchServlet</p>
            <p className="text-blue-300">2. SearchServlet sets request.setAttribute("books", list)</p>
            <p className="text-yellow-300">3. SearchServlet forwards internally to /results.jsp</p>
            <p className="text-green-400">4. results.jsp renders HTML &rarr; Sends HTTP 200 OK to Browser</p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-amber/30 bg-amber/10 p-4">
            <div className="flex items-center gap-2 font-semibold text-amber text-sm">
              <ExternalLink size={18} />
              <span>response.sendRedirect() — Client-Side Two-Request Redirection</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink/90">
              Involves <strong>TWO</strong> separate HTTP requests. The server sends back an <code>HTTP 302 Found</code> with a <code>Location</code> header, commanding the browser to make a brand-new GET request.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">1. Browser Address Bar</span>
              <p className="font-mono text-ink">/library/login &rarr; /home.jsp</p>
              <span className="text-[11px] text-amber font-semibold mt-1 block">⚠ Updates to new target URL</span>
            </div>
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">2. HTTP Requests Sent</span>
              <p className="font-mono text-ink">2 distinct HTTP requests</p>
              <span className="text-[11px] text-ink-muted mt-1 block">1st returns 302 &rarr; 2nd asks for new page</span>
            </div>
            <div className="rounded-lg bg-paper p-3 border border-hairline">
              <span className="font-bold text-ink-muted uppercase tracking-wider block mb-1">3. Request Attributes</span>
              <p className="font-mono text-ink">request.getAttribute()</p>
              <span className="text-[11px] text-incorrect font-semibold mt-1 block">✗ LOST (New request object created)</span>
            </div>
          </div>

          <div className="rounded-lg bg-shelf p-4 font-mono text-xs text-paper space-y-1">
            <p className="text-paper/60">// Trace execution for sendRedirect:</p>
            <p className="text-green-400">1. Browser &rarr; POST /login &rarr; LoginServlet</p>
            <p className="text-amber-400">2. LoginServlet &rarr; HTTP/1.1 302 Found (Location: /home.jsp)</p>
            <p className="text-blue-300">3. Browser automatically sends: GET /home.jsp (Fresh Request!)</p>
            <p className="text-green-400">4. home.jsp renders HTML &rarr; Sends HTTP 200 OK</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ——— HTTP Response Anatomy Visualizer ———
function HTTPResponseFormatExplainer() {
  return (
    <div className="mt-8 rounded-xl border border-hairline bg-paper-aged/40 p-6">
      <h4 className="font-display text-lg font-semibold text-ink">
        Anatomy of an HTTP Response Message
      </h4>
      <p className="mt-1 text-sm text-ink-muted">
        Every response transmitted from Tomcat to the browser follows this standardized 4-part structure:
      </p>

      <div className="mt-5 space-y-3 font-mono text-xs">
        <div className="rounded-lg border border-lamp/40 bg-lamp/10 p-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lamp uppercase tracking-wider">1. Status Line</span>
            <span className="text-[11px] bg-lamp text-white px-2 py-0.5 rounded">Protocol + Status Code + Phrase</span>
          </div>
          <p className="mt-1 text-ink font-semibold">HTTP/1.1 200 OK</p>
        </div>

        <div className="rounded-lg border border-amber/40 bg-amber/10 p-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber uppercase tracking-wider">2. Response Headers</span>
            <span className="text-[11px] bg-amber text-white px-2 py-0.5 rounded">Key-Value Metadata</span>
          </div>
          <div className="mt-1 space-y-0.5 text-ink">
            <p>Content-Type: text/html; charset=UTF-8</p>
            <p>Content-Length: 482</p>
            <p>Cache-Control: no-cache, no-store</p>
            <p>Set-Cookie: JSESSIONID=7B8F9A01; Path=/; HttpOnly</p>
          </div>
        </div>

        <div className="rounded-lg border border-hairline bg-paper p-2 text-center text-ink-muted">
          <span className="font-semibold text-[11px]">3. Empty Blank Line (CRLF \r\n &mdash; separates metadata headers from content)</span>
        </div>

        <div className="rounded-lg border border-blue-500/40 bg-blue-500/10 p-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">4. Response Body (Payload)</span>
            <span className="text-[11px] bg-blue-600 text-white px-2 py-0.5 rounded">HTML, JSON, Binary</span>
          </div>
          <pre className="mt-1 overflow-x-auto text-[11px] text-ink">
{`<!DOCTYPE html>
<html>
  <head><title>Politeknik LMS</title></head>
  <body><h1>Welcome to ServeStud</h1></body>
</html>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ——— Quiz Questions for Topic 2.4 ———
const QUIZ_RESPONSE = [
  {
    id: 'r1',
    q: 'What are the four core parts of an HTTP response message in order?',
    options: [
      'Status line, Response headers, Empty blank line, Response body',
      'HTML body, URL query parameters, Status code, Cookies',
      'Request header, SQL statement, HTML body, Response status',
      'Servlet init, doGet, doPost, destroy',
    ],
    answer: 0,
    explain:
      'Every HTTP response consists of: 1) Status Line (e.g. HTTP/1.1 200 OK), 2) Response Headers, 3) an Empty line (CRLF), and 4) the Response Body containing the data.',
  },
  {
    id: 'r2',
    q: 'Which response header tells the browser what MIME type is being transmitted?',
    options: [
      'Cache-Control',
      'Content-Type',
      'User-Agent',
      'Set-Cookie',
    ],
    answer: 1,
    explain:
      'Content-Type tells the client browser how to interpret the payload (e.g. "text/html; charset=UTF-8", "application/json", or "image/png").',
  },
  {
    id: 'r3',
    q: 'What happens to request attributes when you call response.sendRedirect("target.jsp")?',
    options: [
      'They are automatically transferred to target.jsp',
      'They are stored permanently in the database',
      'They are lost because sendRedirect instructs the browser to issue a completely new HTTP request',
      'They are converted into HTTP headers',
    ],
    answer: 2,
    explain:
      'sendRedirect() causes the client to send a brand new GET request. The previous HttpServletRequest object is discarded, and all request attributes stored with setAttribute() are lost.',
  },
  {
    id: 'r4',
    q: 'When should you use RequestDispatcher.forward() instead of response.sendRedirect()?',
    options: [
      'When you want to redirect the user to an external domain like google.com',
      'When you need to pass data objects to a JSP view within the same web application without changing the browser URL',
      'When you want to clear the user session',
      'When you are uploading a binary file',
    ],
    answer: 1,
    explain:
      'forward() is ideal for Model-View-Controller (MVC) workflows inside the same web application where the Servlet prepares data and forwards it directly to the JSP view.',
  },
]

const NDQ_RESPONSE = [
  {
    q: 'Can I redirect to an external website using RequestDispatcher.forward()?',
    a: 'No. RequestDispatcher.forward() only works internally within the same web container application context. To send users to an external website (e.g. https://google.com), you MUST use response.sendRedirect().',
  },
  {
    q: 'What is the difference between setHeader() and addHeader() in HttpServletResponse?',
    a: 'setHeader(name, value) overwrites any existing value for that header name. addHeader(name, value) appends an additional value, allowing multiple headers with the same name.',
  },
  {
    q: 'Why do we need return; immediately after response.sendRedirect()?',
    a: 'sendRedirect() does not stop the Java method execution! The remaining Java code in your doGet/doPost method will continue to run until the method returns, which can cause unexpected logic bugs.',
  },
]

export default function Section7ServerResponse({ headingRef }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-lamp">
          Topic 2 · Developing Servlet (Cont...)
        </p>
        <span className="rounded-full bg-lamp/15 px-3 py-0.5 text-xs font-bold text-lamp">
          Topic 2.4 · ServerResponse & Headers
        </span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-3 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        ServerResponse: HTTP Response Headers through Servlet
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Topic 2.4: (i) HTTP response format, (ii) Response headers, (iii) Redirect response
      </p>

      <BrainPower>
        <p>
          When the librarian answers a patron, they don't just hand over a pile of loose sheets. They stamp the date, seal the envelope with instructions, and mark whether the answer is ready or if the patron needs to proceed to another room. In Java web development, <code>HttpServletResponse</code> is how your servlet controls headers, cache, and navigation.
        </p>
      </BrainPower>

      <DefinitionCard term="HTTP Response & Headers">
        <div className="space-y-2">
          <p>
            <strong>Response Format:</strong> A structured communication packet sent from web container to browser consisting of a Status Line, Response Headers (metadata), an empty separator line, and the Response Body.
          </p>
          <p>
            <strong>Navigation Mechanics:</strong> <code>sendRedirect()</code> commands the client browser to navigate to a new URL via HTTP 302, whereas <code>forward()</code> transfers control internally within the server.
          </p>
        </div>
      </DefinitionCard>

      {/* Part 1: Anatomy of HTTP Response */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          1. HTTP Response Format
        </h3>
        <p className="mt-3 leading-relaxed">
          Before any HTML is rendered by the browser, the web container transmits HTTP headers. Understanding this packet layout is key to debugging web applications.
        </p>
        <HTTPResponseFormatExplainer />
      </section>

      {/* Part 2: Working with Response Headers */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          2. Managing Response Headers in Servlets
        </h3>
        <p className="mt-3 leading-relaxed">
          Java provides dedicated methods on <code>HttpServletResponse</code> to configure MIME types, cache control directives, cookies, and redirection.
        </p>

        <AnnotatedCode lines={RESPONSE_HEADER_LINES} notes={RESPONSE_HEADER_NOTES} />
      </section>

      {/* Part 3: Deep Dive Redirect vs Forward */}
      <section className="mt-14">
        <h3 className="font-display text-2xl font-semibold">
          3. Redirect vs. Forward: The Decisive Choice
        </h3>
        <p className="mt-3 leading-relaxed">
          One of the most commonly tested concepts in Politeknik web development exams: when to use <code>response.sendRedirect()</code> vs <code>RequestDispatcher.forward()</code>.
        </p>

        <RedirectVsForwardVisualizer />
      </section>

      {/* No Dumb Questions */}
      <NoDumbQuestions items={NDQ_RESPONSE} />

      {/* Checkpoint Quiz */}
      <CheckpointQuiz sectionId={7} questions={QUIZ_RESPONSE} threshold={3} />
    </article>
  )
}
