import { useState } from 'react'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'

// A6 — "Be the Container": a sequential role-play. Each scene poses one
// container decision; wrong picks explain why and let you re-choose,
// right picks explain why and advance. steps: [{ time, scenario,
// options: [{ label, correct, why }] }]

export function BeTheContainer({ steps, exerciseId, finale }) {
  const { dispatch } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [picked, setPicked] = useState(null) // option index for current step
  const [done, setDone] = useState(false)

  const step = steps[stepIndex]
  const pickedOption = picked !== null ? step.options[picked] : null

  function choose(i) {
    if (pickedOption?.correct) return
    setPicked(i)
  }

  function advance() {
    if (stepIndex === steps.length - 1) {
      setDone(true)
      dispatch({ type: 'completeExercise', exercise: exerciseId })
    } else {
      setStepIndex((s) => s + 1)
      setPicked(null)
    }
  }

  function restart() {
    setStepIndex(0)
    setPicked(null)
    setDone(false)
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg bg-correct/12 px-4 py-3"
        >
          <Check size={18} className="mt-0.5 shrink-0 text-correct" aria-hidden="true" />
          <span className="max-w-[58ch] leading-relaxed">{finale}</span>
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-4 flex min-h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm text-ink-muted transition-colors duration-200 hover:bg-paper hover:text-ink"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Run the day again
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-xl border border-hairline px-5 py-5 md:px-6">
      <p className="text-sm font-medium text-ink-muted">
        Scene {stepIndex + 1} of {steps.length} ·{' '}
        <span className="font-mono">{step.time}</span>
      </p>
      <p className="mt-2 max-w-[60ch] text-[1.0625rem] leading-relaxed font-medium">
        {step.scenario}
      </p>

      <div className="mt-4 space-y-2">
        {step.options.map((opt, i) => {
          const isPicked = picked === i
          const showState = isPicked
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => choose(i)}
              aria-pressed={isPicked}
              className={`flex min-h-11 w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150 ${
                showState && opt.correct
                  ? 'border-correct bg-correct/10'
                  : showState
                    ? 'border-incorrect bg-incorrect/10'
                    : 'border-hairline hover:bg-paper-aged'
              }`}
            >
              {showState &&
                (opt.correct ? (
                  <Check size={17} className="shrink-0 text-correct" aria-hidden="true" />
                ) : (
                  <X size={17} className="shrink-0 text-incorrect" aria-hidden="true" />
                ))}
              <span className="leading-snug">{opt.label}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {pickedOption && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 ${
              pickedOption.correct ? 'bg-correct/12' : 'bg-incorrect/10'
            }`}
          >
            <p className="max-w-[58ch] leading-relaxed">
              <strong>
                {pickedOption.correct ? 'Right call.' : 'Not that one.'}
              </strong>{' '}
              {pickedOption.why}
            </p>
            {pickedOption.correct && (
              <button
                type="button"
                onClick={advance}
                className="mt-3 flex min-h-10 items-center gap-1.5 rounded-lg bg-amber px-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
              >
                {stepIndex === steps.length - 1 ? 'End the day' : 'Next scene'}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
