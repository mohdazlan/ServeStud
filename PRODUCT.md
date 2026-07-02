# Product

## Register

product

## Users

**Primary**: Semester 5 / Year 3 diploma students in Information Technology at Politeknik Mukah, Sarawak, ages 20–22. They know basic Java and HTML but have zero prior exposure to server-side web development, HTTP internals, or Java EE architecture. Most access content on laptops, some on phones. English is a second language — they can read technical English, but conversational writing lands better than academic prose.

**Context**: They use this as a companion to in-class lectures for Topic 1 of DFP50283 (Web Development Technology) — before or after class, self-paced, often unsupervised. The job to be done: make abstract concepts (HTTP request-response, containers, servlet lifecycle) click before their first lab.

**Secondary**: The lecturer (Azlan), who uses this as a teaching aid alongside lab exercises and formative assessments.

## Product Purpose

A single-page React learning application — supplementary material for **Topic 1: Introduction to Java Web Technologies**. It reinforces lectures through animations, interactive exercises, and gated checkpoint quizzes; it does not replace them.

**The single job**: make abstract web development concepts feel concrete and intuitive through visual metaphor, animation, and guided practice — so that by the time students write their first servlet in the lab, they already "get it."

**Success looks like**: a student finishes all 5 sections, passes the checkpoint quizzes, and walks into the lab recognizing servlets, requests, and containers as things they already understand.

Every example, exercise, and metaphor is grounded in a **Library Management System (LMS)** scenario — the same scenario threading through all lab exercises in the course. The full content specification (sections, quizzes, animations, component architecture, build sequence) lives in **[SPEC.md](SPEC.md)**.

## Brand Personality

Three words: **warm, structured, slightly playful**.

- **Conversational**: a friendly tutor, not a textbook. Uses "you" and "we."
- **Encouraging but not patronizing**: these are adults. No cartoon mascots, no "Great job, superstar!" energy. More like a slightly playful senior student helping a junior.
- **Direct**: short sentences. Real questions, not rhetorical filler.
- **Head First-inspired**: breaks the fourth wall, addresses the student's brain directly, uses provocations ("What actually happens when you hit Enter?") to create curiosity before delivering answers.

**Emotional goals**: curiosity, safety to be wrong (quizzes are retryable), earned accomplishment at each unlock.

**References**: Josh Comeau's blog (playful interactive explanations), the Head First book series (pedagogical voice and exercise formats), a well-designed museum exhibit (structured warmth), Brilliant.org's lesson format (guided interactive progression).

## Anti-references

- Corporate SaaS blue-gray palettes
- Generic e-learning/LMS aesthetics (Moodle/Canvas feel)
- Heavy drop shadows and neumorphism
- Stock photography
- Inter/Poppins as body font (too generic for this brief)
- Cards wrapping cards wrapping cards
- Purple gradient hero sections
- Bounce easing on animations
- "01 / 02 / 03" decorative numbering — sections are gated, not numbered for show
- Dense text walls with no visual relief
- Academic passive-voice prose ("It should be noted that…")

## Design Principles

1. **Metaphor before mechanism.** Every abstract concept lands through the library metaphor first (container = building, servlet = librarian, request = patron). The metaphor map is used consistently — never broken, never mixed.
2. **Earn your way forward.** Progression is gated by checkpoint quizzes. Unlocks are real achievements; failure is safe, explained, and retryable.
3. **Redundancy is the pedagogy.** Each concept arrives through multiple representations: animation → diagram → exercise → quiz. Repetition across modes, not within them.
4. **Talk to the student's brain.** Provocation before explanation. Ask a real question, create the itch, then scratch it. Second person, active voice, 2–3 sentence paragraphs.
5. **Motion teaches, never decorates.** Animations exist to explain (the request journey, the servlet lifecycle) — they carry meaning, are student-controllable (step/play/pause), and degrade gracefully.

## Accessibility & Inclusion

- **WCAG AA minimum** for color contrast.
- **All animations respect `prefers-reduced-motion`** — degrade to instant state changes, never gate content on motion.
- **Keyboard navigable**: tab through sections, Enter to submit quizzes, arrow-key alternatives for every drag-and-drop exercise.
- **Quiz feedback communicated via text, not color alone** (green/red/amber are reinforcement, never the sole signal).
- **Alt text** on all illustrative visuals; code blocks use syntax highlighting with sufficient contrast.
- **ESL readers**: short sentences, conversational register, technical terms always introduced with the metaphor alongside.

## Key Terminology

| Term | Meaning |
|---|---|
| LMS | Library Management System — the applied scenario, NOT a Learning Management System |
| Section | One of 6 content blocks (0–5) in the app, gated by quizzes |
| Checkpoint Quiz | The quiz at the end of each section that unlocks the next |
| Metaphor map | The persistent reference card mapping web concepts to library equivalents |
| Container | The Java web container (Tomcat), metaphorized as the library building |
| GRR | Gradual Release of Responsibility — the pedagogical framework |
| CIDOS | The polytechnic's online submission/learning platform |

## Technical Constraints

React (Vite) SPA · Framer Motion · Tailwind CSS · Lucide React icons · localStorage persistence (standalone site, not a Claude artifact) · static `vite build` output deployed to CIDOS or a basic web host · modern browsers only · no external API calls.
