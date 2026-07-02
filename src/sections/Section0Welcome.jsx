import { useState } from 'react'
import { ArrowRight, BookMarked, RotateCcw } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'
import {
  GlyphBuilding,
  GlyphLibrarian,
  GlyphPatron,
  GlyphRequest,
  GlyphResponse,
  LibraryScene,
} from '../components/LibraryScene.jsx'

const CORE_METAPHORS = [
  {
    glyph: GlyphBuilding,
    concept: 'The web container',
    metaphor: 'is the library building',
    detail: 'Tomcat runs the place — opening hours, staffing, rules.',
  },
  {
    glyph: GlyphLibrarian,
    concept: 'A servlet',
    metaphor: 'is a librarian at a desk',
    detail: 'Takes each request, does the work, hands back an answer.',
  },
  {
    glyph: GlyphPatron,
    concept: 'Your browser',
    metaphor: 'is the patron',
    detail: 'Walks in with a question. That patron is you.',
  },
  {
    glyph: GlyphRequest,
    concept: 'An HTTP request',
    metaphor: 'is the patron’s question',
    detail: 'Carries what they want, and any details they brought along.',
  },
  {
    glyph: GlyphResponse,
    concept: 'An HTTP response',
    metaphor: 'is the librarian’s answer',
    detail: 'A book, a receipt, or a polite “we don’t have that.”',
  },
]

const HOW_IT_WORKS = [
  {
    name: 'Learn',
    copy: 'We explain each idea with animations and the library metaphor. Watch things move; let the picture do the work.',
  },
  {
    name: 'Think',
    copy: 'Short brain exercises — label a diagram, match a pair, make a call. This is where it sticks.',
  },
  {
    name: 'Prove',
    copy: 'A short checkpoint quiz. Pass it and the next section unlocks. Fail it? See why, then try again. No penalty.',
  },
]

export default function Section0Welcome({ headingRef }) {
  const { dispatch } = useProgress()
  const [sceneKey, setSceneKey] = useState(0)

  return (
    <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">Section 0 · about 2 min</p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        Welcome & Orientation
      </h2>

      <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">
        This is your companion for Topic 1. It won’t replace your lectures —
        it’ll make them click. And everything you’re about to learn happens in
        one place:
      </p>

      {/* Hero — animation A1 */}
      <figure className="mt-10">
        <div key={sceneKey}>
          <LibraryScene />
        </div>
        <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            One building. Three service desks. Every patron served. Hold that
            picture — it’s the whole topic in one scene.
          </p>
          <button
            type="button"
            onClick={() => setSceneKey((k) => k + 1)}
            className="flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-ink-muted transition-colors duration-200 hover:bg-paper-aged hover:text-ink"
          >
            <RotateCcw size={14} aria-hidden="true" />
            Replay
          </button>
        </figcaption>
      </figure>

      {/* How this works — a real sequence, so the numbers carry meaning */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">How this works</h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Each of the five sections ahead has three parts, always in the same
          order:
        </p>
        <ol className="mt-8 space-y-8">
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.name} className="flex gap-5">
              <span
                aria-hidden="true"
                className="font-display text-4xl leading-none font-semibold text-amber tabular-nums"
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h4 className="text-lg font-semibold">{step.name}</h4>
                <p className="mt-1 max-w-[56ch] leading-relaxed text-ink">
                  {step.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* The applied scenario */}
      <section className="mt-16">
        <h3 className="font-display text-2xl font-semibold">
          One library, the whole way through
        </h3>
        <p className="mt-3 max-w-[62ch] leading-relaxed">
          Every example, exercise, and quiz question lives inside a{' '}
          <strong>Library Management System</strong> — a web application for
          managing books, members, and loans. It’s the same system you’ll build
          against in your labs. By the end, servlets, requests, and containers
          won’t be abstract buzzwords. They’ll be things you already understand.
        </p>

        <div className="mt-8 rounded-xl bg-paper-aged px-6 py-5">
          <h4 className="text-lg font-semibold">Meet your metaphor</h4>
          <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {CORE_METAPHORS.map((m) => {
              const Glyph = m.glyph
              return (
                <li key={m.concept} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    <Glyph />
                  </span>
                  <p className="text-[0.9375rem] leading-snug">
                    <strong>{m.concept}</strong> {m.metaphor}.
                    <span className="mt-0.5 block text-sm text-ink-muted">
                      {m.detail}
                    </span>
                  </p>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent('servestud:open-metaphor-map'))
            }
            className="mt-5 flex min-h-10 items-center gap-2 rounded-lg border border-hairline px-3.5 text-sm font-medium transition-colors duration-200 hover:bg-paper"
          >
            <BookMarked size={15} aria-hidden="true" />
            Open the full metaphor map
          </button>
          <p className="mt-3 text-sm text-ink-muted">
            It’s always one tap away — the floating button follows you through
            every section.
          </p>
        </div>
      </section>

      {/* Onward */}
      <section className="mt-16 border-t border-hairline pt-10">
        <p className="max-w-[62ch] text-lg leading-relaxed">
          That’s the orientation. No quiz here — Section 1 is already unlocked.
          Ready to find out what actually happens when you visit a website?
        </p>
        <button
          type="button"
          onClick={() => dispatch({ type: 'goTo', section: 1 })}
          className="mt-6 flex min-h-12 items-center gap-2 rounded-lg bg-amber px-5 font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
        >
          Head into Section 1 — The Web
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </section>
    </article>
  )
}
