# Topic 1 Companion Website — Build Spec

## For: Claude Code with Fable 5 + Impeccable

---

## Project Summary

A single-page React application serving as supplementary learning material for **Topic 1: Introduction to Java Web Technologies** of course DFP50283 (Web Development Technology), Politeknik Mukah, Sarawak.

The site follows the **Head First** pedagogical style: conversational tone, visual metaphors, redundancy through multiple representations (animation → diagram → quiz → code), and "earn your way forward" progression. Students complete a short quiz at the end of each section to unlock the next.

**Audience**: Semester 5 / Year 3 diploma students in Information Technology. Assume they know basic Java and HTML but have zero exposure to server-side web development, HTTP internals, or the concept of a web container.

**Applied scenario**: All examples, exercises, and metaphors are grounded in a **Library Management System (LMS)** — a web application for managing books, members, and loans. This is the same scenario threading through all lab exercises in the course.

---

## Core Metaphor Map

These metaphors are used **consistently** across all sections. Never break or mix them.

| Real Concept | LMS Metaphor | Why It Works |
|---|---|---|
| Web Container (Tomcat) | The library building itself | It manages everything inside — opening hours, staffing, rules |
| Servlet | A librarian at a service desk | Receives patron requests, processes them, hands back results |
| HTTP Request | A patron walking up to the desk with a question or form | Carries intent (what they want) and data (search terms, membership forms) |
| HTTP Response | The librarian handing back a book, a receipt, or an answer | Carries the result — could be data, a confirmation, or "we don't have that" |
| `init()` | Librarian clocking in, setting up their desk | Happens once when assigned to the desk |
| `service()` | Librarian serving each patron in turn | Happens for every request |
| `destroy()` | Librarian packing up at closing time | Happens once when the container shuts down |
| Static page | A printed poster on the library wall | Same content for everyone, never changes |
| Dynamic page | The librarian looking up a book and telling you the result | Different content depending on who asks and what they ask |
| GET request | Asking the librarian "Do you have this book?" | Retrieving information, no side effects |
| POST request | Handing the librarian a filled-in membership form | Submitting data, creates/changes something |
| Web browser | The patron themselves | Initiates the visit, receives the response |
| URL / Path | The specific service desk and department | `/library/search` = the search desk, `/library/register` = the membership desk |

---

## Technical Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | React (Vite build) | SPA, fast dev cycle, deployable as static files |
| Animation | Framer Motion | React-native, declarative, supports orchestrated sequences and layout animations |
| Styling | Tailwind CSS (with Impeccable overrides) | Rapid utility styling; Impeccable's `/polish` and `/audit` will refine the output |
| State management | React `useState` / `useReducer` | App state is simple: which sections are unlocked, quiz answers |
| Icons | Lucide React | Clean, consistent icon set |
| Deployment target | Static HTML/CSS/JS folder (Vite build) | Upload to CIDOS or any basic web host |

**Impeccable commands to run during build:**
1. `/impeccable init` — set surface to "product" (it's a learning app, not a marketing page), audience to "diploma students aged 20-22", voice to "conversational, encouraging, slightly playful"
2. `/polish` after each major section is built
3. `/audit` before final build
4. `/animate` to review motion patterns for consistency
5. `/critique` for a final design review

---

## Design Direction (for PRODUCT.md / Impeccable context)

**This is NOT a corporate SaaS dashboard.** It's a learning companion. The design should feel:

- **Warm and approachable** — like a well-designed coding tutorial, not a textbook
- **Playful but not childish** — diploma students, not primary school
- **Structured but not rigid** — clear progression with breathing room

**Anti-references** (tell Impeccable what to avoid):
- Generic LMS/e-learning platform aesthetics (Moodle-like)
- Dense text walls with no visual relief
- Corporate blue-gray color schemes
- Stock photography

**Aesthetic anchor**: Think Head First book series meets a modern interactive coding tutorial (like Josh Comeau's blog or Brilliant.org's lesson format). Rich illustrations, conversational callouts, "aha moment" animations.

**Color direction**: Warm palette grounded in the library metaphor — wood tones, warm paper, with a strong accent for interactive/action elements. Avoid pure black text; use tinted dark.

**Typography direction**: A characterful but readable display face for section headers, a clean sans-serif for body. Code snippets in a proper monospace with syntax highlighting.

---

## Information Architecture

The app has **5 sections** with a gated unlock flow. Each section ends with a **Checkpoint Quiz** (3-5 questions). Passing ≥ 60% unlocks the next section. Failing shows which answers were wrong with brief explanations, then lets the student retry.

```
[Section 0: Welcome & Orientation]
    ↓ (auto-unlocked)
[Section 1: The Web — What Actually Happens When You Visit a Website?]
    ↓ quiz gate
[Section 2: Static vs Dynamic — Why Servlets Exist]
    ↓ quiz gate
[Section 3: The Java EE Universe — Where Everything Lives]
    ↓ quiz gate
[Section 4: Meet the Servlet — Anatomy & Lifecycle]
    ↓ quiz gate
[Section 5: The Servlet API — Speaking the Container's Language]
    ↓ completion celebration
```

### Navigation

- Sticky sidebar (desktop) or bottom tab bar (mobile) showing all 5 sections
- Locked sections show a lock icon and are non-clickable
- Current section is highlighted
- Completed sections show a checkmark
- Progress bar at the top showing overall completion percentage

---

## Section-by-Section Spec

---

### Section 0: Welcome & Orientation

**Duration**: ~2 minutes reading
**Purpose**: Set the tone, explain how the site works, introduce the LMS metaphor

**Content:**

1. **Hero moment**: An animated illustration of the library building (the container metaphor). Camera "enters" the building to reveal librarians (servlets) at service desks.

2. **"How this works" explainer**:
   - "This is your companion for Topic 1. It won't replace your lectures — it'll make them click."
   - "Each section has three parts: **Learn** (we explain with animations and metaphors), **Think** (Head First-style brain exercises), and **Prove** (a short quiz to unlock the next section)."
   - "Everything happens inside a Library Management System. By the end, you'll see servlets, requests, and containers not as abstract buzzwords, but as things you already understand."

3. **"Meet your metaphor" panel**: A compact visual reference card showing the core metaphor map (the table from above, but as an illustrated visual, not a raw table). This panel should be accessible from any section via a floating button.

**No quiz gate.** Section 1 is auto-unlocked.

---

### Section 1: The Web — What Actually Happens When You Visit a Website?

**Covers**: Topic 1.1.1 (Components of a web application)
**Duration**: ~10 minutes

#### Learn Phase

1. **Opening provocation** (Head First "Brain Power" style):
   > "You type `polimukah.edu.my` into your browser and hit Enter. A page appears. But what actually happened in the 200 milliseconds between pressing Enter and seeing the page? More than you think."

2. **ANIMATION: "The Journey of a Web Request"**
   - A step-by-step animated sequence showing:
     1. User types URL in browser
     2. Browser creates an HTTP request (visualize as an envelope with headers)
     3. Request travels over the network (simplified — just an arrow, don't overcomplicate)
     4. Reaches the **web server** (the library building appears)
     5. Server processes the request
     6. Server creates an HTTP response (another envelope, now containing HTML)
     7. Response travels back to the browser
     8. Browser renders the HTML into a visible page
   - **Interaction**: Student can click "Step forward" / "Step back" to control the animation. Each step has a 1-2 sentence explanation below the animation.
   - **LMS grounding**: The request is for `/library/catalog` — viewing the book catalog.

3. **"There Are No Dumb Questions" sidebar**:
   - *"What's the difference between a web server and a website?"*
   - *"Does the request literally 'travel'? Where does it go?"*
   - *"Why does the server send HTML back? Why not just the data?"*

4. **Component breakdown** — after the animation, explicitly name and define each component:
   - **Client** (the browser / the patron)
   - **Server** (the software that listens and responds / the library)
   - **HTTP** (the protocol — the language both sides speak / the agreed rules of how patrons interact with librarians)
   - **Request** and **Response** (the two messages / the question and the answer)

#### Think Phase

5. **"Sharpen Your Pencil" exercise**:
   > Label the diagram: A simplified version of the animation, but as a static diagram with blank labels. Student drags labels (Client, Server, HTTP Request, HTTP Response, Network) to the correct positions.

6. **"Who Does What?" matching exercise**:
   > Match each component to its job. Drag-and-drop pairs:
   - Browser → "Sends requests and renders responses"
   - Web Server → "Receives requests and generates responses"
   - HTTP Request → "Carries what the client wants"
   - HTTP Response → "Carries what the server sends back"
   - URL → "Tells the server which resource to find"

#### Checkpoint Quiz (Gate to Section 2)

3-4 multiple choice questions. Examples:

1. *"A patron walks into the library and asks 'Do you have Dune by Frank Herbert?' In web terms, who/what is the patron?"*
   - [ ] The web server
   - [x] The client (browser)
   - [ ] The HTTP response
   - [ ] The servlet

2. *"In the request-response cycle, what does the server send back to the browser?"*
   - [ ] Another request
   - [ ] The URL
   - [x] An HTTP response containing the requested content
   - [ ] The network connection

3. *"Which of these is NOT a component of a web application?"*
   - [ ] Client
   - [ ] Server
   - [x] Compiler
   - [ ] Network protocol

4. *"In our library metaphor, what does 'HTTP' represent?"*
   - [x] The agreed rules for how patrons and librarians communicate
   - [ ] The book itself
   - [ ] The library building
   - [ ] The patron's library card

**Pass threshold**: 3 out of 4 correct (75%)
**Fail behavior**: Show which were wrong, explain briefly, allow retry with questions randomized.

---

### Section 2: Static vs Dynamic — Why Servlets Exist

**Covers**: Topics 1.1.2, 1.1.3 (Static web pages, Dynamic web pages)
**Duration**: ~10 minutes

#### Learn Phase

1. **Opening provocation**:
   > "Imagine a library where every question gets the same printed pamphlet as an answer, no matter what you ask. That's a static website. Now imagine a library where the librarian actually listens to your question, goes and checks the shelves, and gives you a personalized answer. That's a dynamic website. The 'librarian' is a **servlet**."

2. **ANIMATION: "Static vs Dynamic — Side by Side"**
   - Split-screen animation:
     - **Left (Static)**: Patron asks "Do you have books about Java?" → Librarian hands them a pre-printed flyer that's the same for everyone. The flyer was made last month. It lists 5 books. A new Java book arrived yesterday — it's not on the flyer.
     - **Right (Dynamic)**: Same question → Librarian checks the actual catalog database, finds 6 books (including yesterday's arrival), writes a fresh list specific to this patron's question, hands it over.
   - **Key visual**: The static side shows a stack of identical pre-printed pages. The dynamic side shows the librarian actively writing/computing the response.

3. **Explicit definition callout boxes** (styled distinctly — maybe a card with an icon):
   - **Static Web Page**: "Pre-built HTML files stored on the server. Same content every time, for every user. The server just finds the file and sends it. Fast, but inflexible."
   - **Dynamic Web Page**: "Generated on-the-fly by a program running on the server. Content can change based on who's asking, what they asked, or what's in the database. Flexible, but requires server-side logic."

4. **"But wait..." transitional text**:
   > "So if dynamic pages need a program running on the server to generate them... what IS that program? In Java web development, it's called a **Servlet**. But we're getting ahead of ourselves — that's Section 4. For now, just know: the entire reason servlets exist is to make dynamic web pages possible."

5. **Real-world examples panel** (tied to LMS):
   | Page | Static or Dynamic? | Why? |
   |---|---|---|
   | Library "About Us" page | Static | Same info for everyone, rarely changes |
   | Search results for "Java" | Dynamic | Different results depending on what's searched |
   | Patron's borrowing history | Dynamic | Different for each logged-in patron |
   | Library opening hours page | Static (could be) | Changes rarely, same for everyone |
   | "3 books are overdue" notification | Dynamic | Specific to this patron, calculated from database |

#### Think Phase

6. **"Be the Server" exercise**:
   > Three requests arrive. For each one, decide: would you serve a static page or generate a dynamic one? Explain why in one sentence.
   - Request 1: `GET /library/about.html`
   - Request 2: `GET /library/search?author=Tolkien`
   - Request 3: `GET /library/member/12345/loans`
   - (Interactive: student picks Static/Dynamic for each, then a text input for the reason, then reveal answer)

7. **"Fireside Chat" — Static Page vs Dynamic Page**:
   > A staged "conversation" between two characters (styled as chat bubbles):
   > - **Static**: "I'm fast and reliable. The server just grabs me off the shelf — no thinking required."
   > - **Dynamic**: "Sure, but you can't tell anyone their actual borrowing status. You just show the same pamphlet to everyone."
   > - **Static**: "At least I never crash. I'm just a file."
   > - **Dynamic**: "I need more resources, that's true. But without me, the library would just be a brochure."

#### Checkpoint Quiz (Gate to Section 3)

1. *"The library's 'About Us' page shows the same content to every visitor. This is a _____ web page."*
   - [x] Static
   - [ ] Dynamic
   - [ ] Servlet
   - [ ] Client-side

2. *"A patron searches the catalog for 'database'. The server queries the database, builds a page showing 8 results, and sends it back. This is a _____ web page."*
   - [ ] Static
   - [x] Dynamic
   - [ ] Cached
   - [ ] Template

3. *"What is the MAIN limitation of static web pages?"*
   - [ ] They are slow to load
   - [ ] They cannot use HTML
   - [x] They show the same content regardless of who visits or what they need
   - [ ] They don't work in modern browsers

4. *"Why do dynamic web pages need server-side programs (like servlets)?"*
   - [ ] To make pages load faster
   - [ ] To store HTML files
   - [x] To generate customized content by processing logic and/or querying databases
   - [ ] To connect to the internet

**Pass threshold**: 3 out of 4 correct

---

### Section 3: The Java EE Universe — Where Everything Lives

**Covers**: Topics 1.2.1, 1.2.2 (Java EE architecture, technologies)
**Duration**: ~12 minutes

#### Learn Phase

1. **Opening provocation**:
   > "You've seen that dynamic web pages need a program on the server. But that program doesn't float in space — it needs an entire ecosystem to run. Java EE is that ecosystem. Think of it as the whole infrastructure that makes our library possible: the building, the staffing system, the catalog database, the membership registry, and the rules that tie everything together."

2. **ANIMATION: "The Java EE Layer Cake"**
   - An animated multi-tier architecture diagram that builds layer by layer:
     1. **Client Tier** (bottom, visible first): Browser, HTML, Java Applets → labeled "The patron's side"
     2. **Web Tier** (middle, slides in): Servlets, JSP → labeled "The service desks — where requests are handled"
     3. **Business Tier** (above web tier, slides in): EJB → labeled "The back office — business rules and heavy processing"
     4. **Data Tier** (top, slides in): Database (JDBC) → labeled "The catalog and records room"
   - **Interaction**: Student can hover/click each tier to see what technologies live there and a brief explanation.
   - **Key insight callout**: "In this course, we focus on the **Web Tier** — Servlets and JSP. That's where you'll spend most of your time."

3. **Technology spotlight cards** — one card per technology, expandable:
   - **HTML** (Client Tier): "The language that structures what the patron sees. You already know this one."
   - **Servlet** (Web Tier): "A Java class that handles requests and generates responses. The librarian. We'll meet them properly in Section 4."
   - **JSP — JavaServer Pages** (Web Tier): "A way to write dynamic HTML with embedded Java. Like a template the librarian fills in before handing to the patron. You'll learn this in Topic 3."
   - **JDBC** (Data Tier): "The bridge between Java code and the database. How the librarian checks the catalog system. Topic 3 as well."
   - **EJB — Enterprise JavaBeans** (Business Tier): "Handles complex business logic for large-scale applications. Overkill for our library, but important for enterprise systems. Not covered in this course, but good to know it exists."

4. **"Where does our code live?" visual**:
   - A zoomed-in view of just the Web Tier showing the relationship:
     ```
     Browser → [HTTP Request] → Web Container (Tomcat) → Servlet → [processes] → [HTTP Response] → Browser
     ```
   - Callout: "The **Web Container** (we use Apache Tomcat) is the environment that manages your servlets. It's the library building — it handles the boring stuff (receiving requests, managing connections, threading) so the servlet can focus on the interesting stuff (your application logic)."

#### Think Phase

5. **"Stack It Up" exercise**:
   > Drag the technologies to the correct tier in the architecture diagram:
   > Items to place: HTML, Servlet, JSP, EJB, JDBC, Java Applet, Database
   > Tiers: Client, Web, Business, Data

6. **"There Are No Dumb Questions" sidebar**:
   - *"If JSP also generates dynamic pages, why do we need Servlets?"*
   - *"What's Tomcat? Is it Java EE?"*
   - *"Do I need to learn all four tiers for this course?"*

#### Checkpoint Quiz (Gate to Section 4)

1. *"Which tier of the Java EE architecture contains Servlets and JSP?"*
   - [ ] Client Tier
   - [x] Web Tier
   - [ ] Business Tier
   - [ ] Data Tier

2. *"In our library metaphor, the Web Container (Tomcat) is best described as:"*
   - [ ] The patron
   - [ ] The librarian
   - [x] The library building that manages and houses the librarians
   - [ ] The book catalog

3. *"Which technology allows Java code to connect to and query a database?"*
   - [ ] JSP
   - [ ] Servlet
   - [ ] EJB
   - [x] JDBC

4. *"A student builds a web application using Servlets to process book searches. Which tiers are involved?"*
   - [ ] Client only
   - [ ] Web and Business
   - [x] Client, Web, and Data
   - [ ] All four tiers

5. *"Which of these is NOT a technology in the Web Tier?"*
   - [ ] Servlet
   - [ ] JSP
   - [x] EJB
   - [ ] Web Container

**Pass threshold**: 3 out of 5 correct (60%)

---

### Section 4: Meet the Servlet — Anatomy & Lifecycle

**Covers**: Topics 1.3.1–1.3.3 (Define Servlet, architecture, lifecycle)
**Duration**: ~15 minutes (this is the most conceptually dense section)

#### Learn Phase

1. **Opening provocation**:
   > "You've been hearing about servlets for three sections. Time to finally meet one. A servlet is just a Java class. That's it. But it's a Java class with a very specific job and a very specific life story."

2. **Definition callout** (prominent, styled):
   > **Servlet**: A Java class that extends `HttpServlet`, runs inside a web container, and handles HTTP requests by generating HTTP responses. In our library: the librarian — trained, managed by the building, and assigned to a service desk.

3. **"Anatomy of a Servlet" code walkthrough**:
   - Show a minimal servlet with LMS context:
   ```java
   @WebServlet("/library/search")
   public class BookSearchServlet extends HttpServlet {

       @Override
       protected void doGet(HttpServletRequest request,
                            HttpServletResponse response)
                            throws ServletException, IOException {
           String title = request.getParameter("title");
           // Search the catalog for the book...
           response.setContentType("text/html");
           response.getWriter().println("<h1>Results for: " + title + "</h1>");
       }
   }
   ```
   - **Interactive annotation**: Clicking/hovering on each part of the code highlights it and shows a callout explaining what it does, with the library metaphor alongside:
     - `@WebServlet("/library/search")` → "This assigns the librarian to the search desk. Any request to `/library/search` goes to this servlet."
     - `extends HttpServlet` → "This makes our class a servlet. It inherits the ability to handle HTTP requests."
     - `doGet(...)` → "This is what the librarian does when a patron asks a question (GET request)."
     - `request.getParameter("title")` → "The librarian reads what the patron is asking for."
     - `response.getWriter().println(...)` → "The librarian writes the answer and hands it back."

4. **ANIMATION: "The Servlet Lifecycle"** (the centerpiece animation)
   - A timeline animation showing the three phases of a servlet's life, mapped to the library metaphor:

   **Phase 1: `init()` — "Opening Up"**
   - Visual: The library building opens its doors. A librarian arrives, sets up their desk, loads the catalog system.
   - Text: "Called ONCE when the servlet is first needed. The container creates the servlet object and calls `init()`. Use it to set up resources (database connections, configuration). Like a librarian clocking in and setting up before the first patron arrives."
   - Code snippet: `public void init() throws ServletException { /* setup */ }`

   **Phase 2: `service()` → `doGet()` / `doPost()` — "Serving Patrons"**
   - Visual: Patrons line up. Each one approaches the desk. The librarian handles each request, one by one. The queue keeps going throughout the day.
   - Text: "Called for EVERY request. The container calls `service()`, which routes to `doGet()` or `doPost()` depending on the HTTP method. This is where your application logic lives. Like a librarian handling patron after patron all day."
   - Key insight: "The same servlet instance handles many requests. The librarian doesn't go home and come back for each patron."
   - Code snippet: `protected void doGet(HttpServletRequest req, HttpServletResponse res) { /* handle */ }`

   **Phase 3: `destroy()` — "Closing Time"**
   - Visual: Last patron leaves. Librarian saves work, closes the catalog system, packs up. The library building closes its doors.
   - Text: "Called ONCE when the container shuts down or decides to unload the servlet. Use it to release resources. Like a librarian clocking out — saving state, closing connections, cleaning up."
   - Code snippet: `public void destroy() { /* cleanup */ }`

   - **Interaction**: The animation has a playback control (play/pause, step-through). At each phase, the corresponding lifecycle method is highlighted in a code panel beside the animation. Student can replay any phase.

5. **"Be the Container" exercise** (Head First role-play):
   > "You are the Tomcat container. It's 8:00 AM. Walk through your day."
   > A step-through scenario where the student makes decisions:
   > 1. "A request arrives for `/library/search`. You've never seen `BookSearchServlet` before. What do you do first?"
   >    - [x] Create an instance and call `init()`
   >    - [ ] Call `service()` immediately
   >    - [ ] Send a 404 error
   > 2. "BookSearchServlet is now initialized. Another request arrives for `/library/search`. What do you do?"
   >    - [ ] Create a new instance and call `init()` again
   >    - [x] Call `service()` on the existing instance
   >    - [ ] Call `destroy()` and start over
   > 3. "It's closing time. The server is shutting down. What do you do with BookSearchServlet?"
   >    - [ ] Just delete it from memory
   >    - [ ] Call `init()` one more time
   >    - [x] Call `destroy()` to let it clean up, then remove it

#### Think Phase

6. **"Lifecycle Sequencer" drag-and-drop**:
   > Arrange these events in the correct order:
   > - Container calls `destroy()` on the servlet
   > - Container loads the servlet class
   > - Container calls `init()` on the new instance
   > - Container calls `service()` for each incoming request
   > - Container creates a servlet instance
   > - Server shuts down
   > - First request arrives for this servlet's URL pattern

   Correct order: First request → Load class → Create instance → `init()` → `service()` (repeated) → Server shuts down → `destroy()`

7. **"There Are No Dumb Questions" sidebar**:
   - *"Does `init()` run every time a request comes in?"* → No, only once.
   - *"What if the servlet crashes during `service()`?"* → The container handles the error. The servlet stays alive for the next request (unless it's a fatal error).
   - *"Can I have multiple instances of the same servlet?"* → Generally no. The container creates one instance and uses it for all requests (with threading).

#### Checkpoint Quiz (Gate to Section 5)

1. *"How many times is `init()` called during a servlet's lifetime?"*
   - [x] Once — when the servlet is first loaded
   - [ ] Once per request
   - [ ] Once per session
   - [ ] It depends on the server configuration

2. *"Which lifecycle method is called for EVERY incoming HTTP request?"*
   - [ ] `init()`
   - [x] `service()`
   - [ ] `destroy()`
   - [ ] `doStart()`

3. *"A servlet needs to open a database connection that will be reused across many requests. Where should this code go?"*
   - [x] In `init()`
   - [ ] In `doGet()`
   - [ ] In `destroy()`
   - [ ] In the constructor

4. *"In the library metaphor, `destroy()` is like:"*
   - [ ] The librarian answering a question
   - [ ] The library opening for the day
   - [x] The librarian packing up and saving work at closing time
   - [ ] The patron leaving the library

5. *"Which statement about servlets is TRUE?"*
   - [ ] A new servlet instance is created for every request
   - [ ] Servlets can only handle GET requests
   - [x] The same servlet instance handles many requests via `service()`
   - [ ] `destroy()` is called before every `service()` call

**Pass threshold**: 3 out of 5 correct (60%)

---

### Section 5: The Servlet API — Speaking the Container's Language

**Covers**: Topics 1.3.4, 1.3.5 (Core Servlet API, HTTP Servlet)
**Duration**: ~12 minutes

#### Learn Phase

1. **Opening provocation**:
   > "You now know what a servlet is and how it lives and dies. But when the container hands a request to your servlet, exactly what objects do you get? And what can you do with them? Time to learn the API — the language your servlet speaks to communicate with the container."

2. **"The Handoff" visual**:
   - A diagram showing the container creating two objects and passing them to the servlet:
     ```
     Container creates: [HttpServletRequest] + [HttpServletResponse]
                ↓                    ↓
     Passes to: doGet(request, response) or doPost(request, response)
     ```
   - Callout: "Every time `service()` is called, the container creates a fresh `request` object (containing everything the patron asked) and a fresh `response` object (an empty envelope for the librarian to fill)."

3. **Class hierarchy diagram** (animated build-up):
   ```
   Servlet (interface)
     └── GenericServlet (abstract class — protocol-independent)
           └── HttpServlet (abstract class — HTTP-specific)
                 └── YourServlet (your code — BookSearchServlet, etc.)
   ```
   - **Key insight callout**: "You almost always extend `HttpServlet`, not `GenericServlet`. Because web apps use HTTP. `GenericServlet` exists for the rare case where you're not using HTTP."
   - Similarly for request/response:
   ```
   ServletRequest (interface — generic)
     └── HttpServletRequest (interface — HTTP-specific, what you actually use)

   ServletResponse (interface — generic)
     └── HttpServletResponse (interface — HTTP-specific, what you actually use)
   ```

4. **Interactive "API Explorer"**:
   - Two card panels side by side:

   **HttpServletRequest — "Reading the patron's question"**
   | Method | What it does | LMS Example |
   |---|---|---|
   | `getParameter("title")` | Gets a form/query value | Reading the search term from `?title=Java` |
   | `getMethod()` | Returns GET, POST, etc. | Knowing if the patron is asking or submitting |
   | `getRequestURI()` | Returns the URL path | Knowing they came to `/library/search` |
   | `getHeader("User-Agent")` | Returns a request header | Checking what browser the patron is using |
   | `setAttribute(key, value)` | Stores data for forwarding | The librarian making a note to pass to another desk |

   **HttpServletResponse — "Writing the answer"**
   | Method | What it does | LMS Example |
   |---|---|---|
   | `setContentType("text/html")` | Sets the response format | Telling the patron "this answer is a web page" |
   | `getWriter()` | Gets a PrintWriter to write the body | The librarian grabbing a pen to write the answer |
   | `setStatus(200)` | Sets the HTTP status code | "I found what you needed" (200 OK) |
   | `sendRedirect(url)` | Redirects to another URL | "Try the desk down the hall" |
   | `setHeader(name, value)` | Sets a response header | Attaching metadata to the response |

   - **Interaction**: Clicking a method in either panel shows a code example in a panel below, using the LMS scenario.

5. **"Putting It Together" — annotated full example**:
   ```java
   @WebServlet("/library/search")
   public class BookSearchServlet extends HttpServlet {

       @Override
       protected void doGet(HttpServletRequest request,
                            HttpServletResponse response)
                            throws ServletException, IOException {

           // 1. Read what the patron is asking for
           String title = request.getParameter("title");

           // 2. Set up the response format
           response.setContentType("text/html");
           PrintWriter out = response.getWriter();

           // 3. Generate the dynamic response
           out.println("<html><body>");
           out.println("<h1>Search Results</h1>");
           if (title != null && !title.isEmpty()) {
               out.println("<p>You searched for: " + title + "</p>");
               // In real life, query the database here...
           } else {
               out.println("<p>Please enter a search term.</p>");
           }
           out.println("</body></html>");
       }
   }
   ```
   - Numbered annotations (1, 2, 3) correspond to callouts explaining each phase with the library metaphor.

#### Think Phase

6. **"Fill in the Blanks" code exercise**:
   > Complete this servlet that handles a member registration form:
   ```java
   @WebServlet("/library/register")
   public class RegisterServlet extends ________ {

       @Override
       protected void ________(HttpServletRequest request,
                                HttpServletResponse response)
                                throws ServletException, IOException {

           String name = request.____________("name");
           String email = request.____________("email");

           response.____________("text/html");
           PrintWriter out = response.____________();

           out.println("<h1>Welcome, " + name + "!</h1>");
       }
   }
   ```
   > Blanks: `HttpServlet`, `doPost`, `getParameter`, `getParameter`, `setContentType`, `getWriter`
   > (Interactive: dropdown or text input for each blank, with immediate validation)

7. **"Request or Response?" sorting exercise**:
   > Drag each method to the correct side:
   > Items: `getParameter()`, `setContentType()`, `getWriter()`, `getMethod()`, `sendRedirect()`, `getRequestURI()`, `setStatus()`
   > Categories: HttpServletRequest | HttpServletResponse

#### Checkpoint Quiz (Final — leads to completion)

1. *"Which class should your servlet extend for handling HTTP requests?"*
   - [ ] GenericServlet
   - [x] HttpServlet
   - [ ] Servlet
   - [ ] ServletRequest

2. *"`request.getParameter('title')` retrieves:"*
   - [x] The value of a query parameter or form field named "title"
   - [ ] The title of the web page
   - [ ] The HTTP method used
   - [ ] The URL of the request

3. *"Before writing HTML to the response, you should call:"*
   - [ ] `response.setStatus(200)`
   - [x] `response.setContentType("text/html")`
   - [ ] `response.sendRedirect("/")`
   - [ ] `request.getMethod()`

4. *"Which is the correct class hierarchy?"*
   - [ ] HttpServlet → GenericServlet → Servlet
   - [x] Servlet → GenericServlet → HttpServlet
   - [ ] GenericServlet → Servlet → HttpServlet
   - [ ] Servlet → HttpServlet → GenericServlet

5. *"In the library metaphor, `response.getWriter()` is like:"*
   - [ ] The patron asking a question
   - [ ] The librarian reading the patron's form
   - [x] The librarian grabbing a pen to write the answer
   - [ ] The library building closing for the night

**Pass threshold**: 3 out of 5 correct (60%)

---

### Completion Screen

After passing Section 5's quiz:

1. **Celebration animation**: The library metaphor scene in full — all desks active, patrons flowing in and out, everything working. A banner unfurls: "You understand the foundations."

2. **Summary card**: "Here's what you now know" — a compact visual recap of all 5 sections with key terms.

3. **"What's Next" teaser**: "In Topic 2, you'll start building real servlets — handling GET and POST, working with forms, and validating data. The library is open. Now it's time to put you behind the desk."

4. **Reset button**: "Want to go through it again? Start over." (Resets all unlock state.)

---

## Animation Inventory

For Impeccable's `/animate` command — these are the motion moments that need design:

| ID | Section | Animation | Type | Complexity |
|---|---|---|---|---|
| A1 | 0 | Library building reveal / entrance | Orchestrated intro | High |
| A2 | 1 | HTTP request-response journey | Step-through diagram | High |
| A3 | 2 | Static vs Dynamic split-screen | Side-by-side comparison | Medium |
| A4 | 3 | Java EE layer cake build-up | Sequential layer reveal | Medium |
| A5 | 4 | Servlet lifecycle (init/service/destroy) | Timeline animation with states | **Highest** |
| A6 | 4 | "Be the Container" decision tree | Interactive branching | Medium |
| A7 | 5 | Class hierarchy build-up | Tree animation | Low |
| A8 | 5 | API explorer hover/click reveals | Micro-interaction | Low |
| A9 | Completion | Full library scene celebration | Orchestrated outro | Medium |

**Motion design principles** (for Impeccable context):
- Ease-out for entrances, ease-in for exits
- No bounce easing (Impeccable anti-pattern)
- Stagger delays for sequential reveals (50-80ms between items)
- `prefers-reduced-motion`: all animations should degrade to instant state changes
- Duration: 300-500ms for micro-interactions, 800-1200ms for major transitions, up to 3s for orchestrated sequences

---

## Component Architecture

```
App
├── NavigationSidebar (desktop) / BottomTabBar (mobile)
│   └── SectionTab (× 6, shows lock/check/active state)
├── ProgressBar
├── MetaphorReferenceButton (floating, opens metaphor map overlay)
├── SectionRenderer
│   ├── Section0_Welcome
│   ├── Section1_WebRequest
│   │   ├── AnimatedRequestJourney (A2)
│   │   ├── DragDropLabeling
│   │   ├── MatchingExercise
│   │   └── CheckpointQuiz
│   ├── Section2_StaticDynamic
│   │   ├── SplitScreenAnimation (A3)
│   │   ├── BeTheServerExercise
│   │   ├── FiresideChat
│   │   └── CheckpointQuiz
│   ├── Section3_JavaEE
│   │   ├── LayerCakeAnimation (A4)
│   │   ├── TechSpotlightCards
│   │   ├── StackItUpDragDrop
│   │   └── CheckpointQuiz
│   ├── Section4_ServletLifecycle
│   │   ├── CodeWalkthrough (interactive annotations)
│   │   ├── LifecycleAnimation (A5)
│   │   ├── BeTheContainerExercise (A6)
│   │   ├── LifecycleSequencer (drag-and-drop ordering)
│   │   └── CheckpointQuiz
│   └── Section5_ServletAPI
│       ├── HandoffDiagram
│       ├── ClassHierarchyAnimation (A7)
│       ├── APIExplorer (A8)
│       ├── FillInBlanksCode
│       ├── RequestResponseSort
│       └── CheckpointQuiz
└── CompletionScreen (A9)
```

---

## State Management

```javascript
const initialState = {
  // Section unlock state
  unlockedSections: [0, 1], // Section 0 and 1 are auto-unlocked
  completedSections: [],
  currentSection: 0,

  // Per-section quiz state
  quizAttempts: {}, // { sectionId: { attempts: number, passed: boolean, answers: [] } }

  // Exercise completion tracking (optional — for student's own reference)
  exercisesCompleted: {}, // { exerciseId: boolean }
};
```

**Persistence**: Use `localStorage` to save progress so students don't lose their place if they close the browser. Include a "Reset Progress" option in settings.

Wait — localStorage isn't available in Claude.ai artifacts. However, since this will be built in Claude Code and deployed as a standalone Vite app (not a Claude artifact), localStorage IS available and should be used. Make this explicit in the build.

---

## Accessibility Requirements

- All animations respect `prefers-reduced-motion`
- Keyboard navigable: Tab through sections, Enter to submit quizzes, arrow keys for drag-and-drop alternatives
- Color contrast: WCAG AA minimum (Impeccable's `/audit` will catch violations)
- Alt text on all illustrative visuals
- Quiz feedback is communicated via text, not color alone
- Code blocks use syntax highlighting with sufficient contrast

---

## Responsive Breakpoints

| Breakpoint | Layout Change |
|---|---|
| ≥ 1024px (desktop) | Sidebar navigation, two-column layouts for exercises |
| 768-1023px (tablet) | Sidebar collapses to top bar, single column |
| < 768px (mobile) | Bottom tab navigation, stacked layouts, simplified animations |

---

## Content Tone Guide

| Do | Don't |
|---|---|
| "You are the Tomcat container." | "The container is responsible for..." |
| "Think about it — what happens next?" | "Consider the following scenario." |
| "Here's the deal:" | "It should be noted that:" |
| "Wait, doesn't that mean...?" | "A common misconception is..." |
| Use "you" and "we" | Use passive voice |
| Short paragraphs (2-3 sentences max) | Long academic paragraphs |
| Real questions students actually ask | Rhetorical padding |

---

## Build Sequence for Claude Code

Recommended order to build in Claude Code with Fable 5 + Impeccable:

1. **`/impeccable init`** — Set up PRODUCT.md and DESIGN.md with the context from this spec
2. **Scaffold** — Vite + React + Tailwind + Framer Motion project structure
3. **Build the shell** — App layout, navigation, progress bar, section routing, state management
4. **Section 0** — Welcome + metaphor reference card (establishes visual language)
5. **Section 1** — The HTTP request-response animation is the first major interactive piece
6. **Section 4** — Build next because the lifecycle animation (A5) is the most complex; tackle it early
7. **Sections 2, 3, 5** — Fill in remaining sections
8. **Completion screen**
9. **`/polish`** then **`/audit`** then **`/critique`** — Impeccable refinement passes
10. **`vite build`** — Generate static deployment folder

---

## File Deliverable

This spec should be saved as `SPEC.md` in the project root so Fable 5 can reference it throughout the build session. The Impeccable `PRODUCT.md` should cross-reference this spec for audience, voice, and design direction.
