import { useEffect, useRef } from 'react'
import { ArrowRight, BookMarked, X } from 'lucide-react'
import { METAPHORS } from '../lib/metaphors.js'

// The persistent metaphor reference — reachable from any section via the
// floating button. Native <dialog> gives us the top layer, focus trapping,
// Escape, and focus return for free.
export function MetaphorMapDialog() {
  const dialogRef = useRef(null)

  // Sections can open the map too (e.g. Section 0's "open the full
  // metaphor map" button) without threading refs through the tree.
  useEffect(() => {
    const open = () => dialogRef.current?.showModal()
    window.addEventListener('servestud:open-metaphor-map', open)
    return () => window.removeEventListener('servestud:open-metaphor-map', open)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="fixed right-4 bottom-20 z-10 flex min-h-12 items-center gap-2 rounded-full bg-amber px-4 font-medium text-white shadow-lg shadow-shelf-deep/20 transition-colors duration-200 hover:bg-amber-deep md:right-6 md:bottom-6"
      >
        <BookMarked size={18} aria-hidden="true" />
        <span className="max-sm:sr-only">Metaphor map</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="metaphor-map-title"
        onClick={(e) => {
          // Light dismiss: a click on the backdrop lands on the dialog itself
          if (e.target === dialogRef.current) dialogRef.current.close()
        }}
        className="m-auto w-[min(42rem,calc(100vw-2rem))] rounded-xl bg-paper text-ink shadow-xl shadow-shelf-deep/30"
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-5">
          <div>
            <h2 id="metaphor-map-title" className="font-display text-2xl font-semibold">
              The web is a library
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Every concept in this topic maps to something you already understand.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close metaphor map"
            className="grid size-11 shrink-0 place-items-center rounded-lg text-ink-muted transition-colors duration-200 hover:bg-paper-aged hover:text-ink"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-[min(60vh,32rem)] overflow-y-auto px-6 py-2">
          {METAPHORS.map((m) => (
            <li
              key={m.concept}
              className="border-b border-hairline py-3.5 last:border-b-0"
            >
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
                <code className="rounded bg-paper-aged px-1.5 py-0.5 text-[0.8125rem]">
                  {m.concept}
                </code>
                <ArrowRight size={14} className="shrink-0 text-amber" aria-hidden="true" />
                <span>{m.metaphor}</span>
              </p>
              <p className="mt-1 text-sm text-ink-muted">{m.why}</p>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  )
}
