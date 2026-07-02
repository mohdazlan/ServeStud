import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'

// Interactive code walkthrough: syntax-highlighted code on the shelf-dark
// canvas where marked fragments are real buttons. Activating one shows its
// explanation (plus the library metaphor) in a panel below the code —
// keyboard-first, nothing is hover-only.
//
// lines: [{ indent: number, segments: [{ t: text, tone?: 'kw'|'ann'|'str'|'ty'|'cm', note?: noteId }] }]
// notes: { [noteId]: { label, body, metaphor } }

const TONES = {
  kw: 'tok-kw',
  ann: 'tok-ann',
  str: 'tok-str',
  ty: 'tok-ty',
  cm: 'tok-cm',
}

export function AnnotatedCode({ lines, notes, caption }) {
  const [active, setActive] = useState(null)
  const note = active ? notes[active] : null

  return (
    <div className="mt-6">
      <p className="flex items-center gap-2 text-sm font-medium text-ink-muted">
        <MousePointerClick size={15} aria-hidden="true" />
        {caption ??
          'The highlighted parts are clickable — each one explains itself.'}
      </p>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-shelf-deep px-5 py-4 text-[0.8125rem] leading-relaxed text-paper md:text-sm">
        <code>
          {lines.map((line, li) => (
            <span key={li} className="block whitespace-pre">
              {' '.repeat(line.indent ?? 0)}
              {line.segments.map((seg, si) => {
                const toneClass = seg.tone ? TONES[seg.tone] : ''
                if (!seg.note) {
                  return (
                    <span key={si} className={toneClass}>
                      {seg.t}
                    </span>
                  )
                }
                const isActive = active === seg.note
                return (
                  <button
                    key={si}
                    type="button"
                    onClick={() =>
                      setActive((cur) => (cur === seg.note ? null : seg.note))
                    }
                    aria-expanded={isActive}
                    className={`code-note rounded ${toneClass} ${
                      isActive ? 'code-note-active' : ''
                    }`}
                  >
                    {seg.t}
                  </button>
                )
              })}
            </span>
          ))}
        </code>
      </pre>
      <div aria-live="polite">
        {note && (
          <div className="mt-3 rounded-xl bg-paper-aged px-5 py-4">
            <p className="font-mono text-sm font-semibold">{note.label}</p>
            <p className="mt-1 max-w-[60ch] leading-relaxed">{note.body}</p>
            <p className="mt-1.5 max-w-[60ch] text-[0.9375rem] text-ink-muted">
              In the library: {note.metaphor}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
