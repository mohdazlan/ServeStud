import { SECTION_COUNT } from '../lib/sections.js'
import { useProgress } from '../hooks/useProgress.jsx'

// Slim course-progress bar pinned to the very top of the viewport.
// Lamp green = accomplishment (amber stays reserved for actions).
export function ProgressBar() {
  const { state } = useProgress()
  const done = state.completedSections.length
  const pct = Math.round((done / SECTION_COUNT) * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Course progress: ${done} of ${SECTION_COUNT} sections complete`}
      className="fixed inset-x-0 top-0 z-30 h-1"
    >
      <div
        className="h-full bg-lamp transition-[width] duration-500 ease-out-quart motion-reduce:transition-none"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
