import { PenLine } from 'lucide-react'

// Honest interim content for sections that haven't been written yet.
// Real titles, real durations, real teasers from SPEC.md — no lorem.
export function SectionPlaceholder({ section, headingRef }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-12 md:py-16">
      <p className="text-sm text-ink-muted">
        Section {section.id} · about {section.minutes} min
      </p>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-2 font-display text-3xl leading-tight font-semibold outline-none md:text-4xl"
      >
        {section.title}
      </h2>
      <p className="mt-2 text-sm text-ink-muted">{section.covers}</p>

      <p className="mt-6 text-lg leading-relaxed">{section.teaser}</p>

      <div className="mt-10 flex items-start gap-3 rounded-xl bg-paper-aged px-5 py-4">
        <PenLine size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden="true" />
        <p className="text-[0.9375rem] leading-relaxed text-ink">
          We’re still shelving this section. When it’s ready, you’ll get the full
          flow here — <strong>Learn</strong> (animations and metaphors),{' '}
          <strong>Think</strong> (brain exercises), and <strong>Prove</strong> (the
          checkpoint quiz that unlocks the next section).
        </p>
      </div>
    </article>
  )
}
