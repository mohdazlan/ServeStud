import { useMemo, useState } from 'react'
import { ArrowRight, Check, CircleAlert, RotateCcw, X } from 'lucide-react'
import { SECTIONS } from '../lib/sections.js'
import { useProgress } from '../hooks/useProgress.jsx'

// The gate at the end of every section. Pass `threshold` of
// `questions.length` to unlock the next section. Failing shows which
// answers were wrong (with explanations) and offers a retry with the
// question order shuffled. Feedback is always text + icon, never color
// alone.
//
// questions: [{ id, q, options: [string], answer: index, explain }]

function shuffle(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function CheckpointQuiz({ sectionId, questions, threshold }) {
  const { state, dispatch } = useProgress()
  const [order, setOrder] = useState(() => questions.map((_, i) => i))
  const [answers, setAnswers] = useState({}) // { questionId: optionIndex }
  const [graded, setGraded] = useState(null) // { score, passed }
  const [warning, setWarning] = useState(false)

  const nextSection = SECTIONS[sectionId + 1]
  const alreadyPassed = state.completedSections.includes(sectionId)
  const ordered = useMemo(() => order.map((i) => questions[i]), [order, questions])

  const answeredCount = Object.keys(answers).length

  function grade() {
    if (answeredCount < questions.length) {
      setWarning(true)
      return
    }
    setWarning(false)
    const score = questions.reduce(
      (n, q) => n + (answers[q.id] === q.answer ? 1 : 0),
      0,
    )
    const passed = score >= threshold
    setGraded({ score, passed })
    dispatch({
      type: 'recordQuizAttempt',
      section: sectionId,
      passed,
      answers: ordered.map((q) => ({ id: q.id, chose: answers[q.id] })),
    })
    if (passed) dispatch({ type: 'passQuiz', section: sectionId })
  }

  function retry() {
    setOrder(shuffle(questions.map((_, i) => i)))
    setAnswers({})
    setGraded(null)
  }

  const goNext = () => dispatch({ type: 'goTo', section: sectionId + 1 })

  return (
    <section className="mt-16 border-t border-hairline pt-10">
      <h3 className="font-display text-2xl font-semibold">
        Checkpoint — prove it
      </h3>
      <p className="mt-2 max-w-[62ch] leading-relaxed">
        {questions.length} questions. Get {threshold} right and{' '}
        <strong>{nextSection ? `Section ${nextSection.id}` : 'the finish'}</strong>{' '}
        unlocks. Wrong answers cost nothing — you’ll see why, then try again.
      </p>

      {alreadyPassed && !graded && (
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-paper-aged px-5 py-4">
          <p className="flex items-center gap-2 font-medium">
            <Check size={17} className="text-correct" aria-hidden="true" />
            You’ve already passed this checkpoint.
          </p>
          {nextSection && (
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-10 items-center gap-1.5 rounded-lg bg-amber px-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
            >
              Continue to Section {nextSection.id}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      <div className="mt-8 space-y-10">
        {ordered.map((q, qi) => {
          const chosen = answers[q.id]
          const isGraded = graded !== null
          const correct = isGraded && chosen === q.answer
          return (
            <fieldset key={q.id} disabled={isGraded}>
              <legend className="max-w-[62ch] font-semibold text-[1.0625rem] leading-snug">
                {qi + 1}. {q.q}
              </legend>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = chosen === oi
                  const showRight = isGraded && oi === q.answer
                  const showWrong = isGraded && selected && oi !== q.answer
                  return (
                    <label
                      key={opt}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors duration-150 ${
                        showRight
                          ? 'border-correct bg-correct/10'
                          : showWrong
                            ? 'border-incorrect bg-incorrect/10'
                            : selected
                              ? 'border-amber bg-amber/10'
                              : 'border-hairline hover:bg-paper-aged'
                      } ${isGraded ? 'cursor-default' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`quiz-${sectionId}-${q.id}`}
                        checked={selected || false}
                        onChange={() =>
                          setAnswers((a) => ({ ...a, [q.id]: oi }))
                        }
                        className="size-4 shrink-0 accent-amber"
                      />
                      <span className="leading-snug">{opt}</span>
                      {showRight && (
                        <Check
                          size={17}
                          className="ml-auto shrink-0 text-correct"
                          aria-hidden="true"
                        />
                      )}
                      {showWrong && (
                        <X
                          size={17}
                          className="ml-auto shrink-0 text-incorrect"
                          aria-hidden="true"
                        />
                      )}
                    </label>
                  )
                })}
              </div>
              {graded !== null && chosen !== q.answer && (
                <p className="mt-2 max-w-[60ch] rounded-lg bg-paper-aged px-4 py-2.5 text-[0.9375rem] leading-relaxed">
                  <strong>Not this one.</strong> {q.explain}
                </p>
              )}
              {graded !== null && correct && (
                <p className="mt-2 text-sm font-medium text-correct">Correct.</p>
              )}
            </fieldset>
          )
        })}
      </div>

      {!graded && (
        <div className="mt-8">
          <button
            type="button"
            onClick={grade}
            className="flex min-h-12 items-center gap-2 rounded-lg bg-amber px-5 font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
          >
            Check my answers
          </button>
          {warning && (
            <p
              role="alert"
              className="mt-3 flex items-center gap-2 text-[0.9375rem] font-medium text-incorrect"
            >
              <CircleAlert size={16} aria-hidden="true" />
              You’ve answered {answeredCount} of {questions.length} — finish the
              rest first.
            </p>
          )}
        </div>
      )}

      {graded && (
        <div
          role="status"
          className={`mt-10 rounded-xl px-6 py-5 ${
            graded.passed ? 'bg-correct/12' : 'bg-incorrect/10'
          }`}
        >
          {graded.passed ? (
            <>
              <p className="flex items-center gap-2 text-lg font-semibold">
                <Check size={20} className="text-correct" aria-hidden="true" />
                Passed — {graded.score} of {questions.length}.
                {nextSection && ` Section ${nextSection.id} is unlocked.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {nextSection && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex min-h-11 items-center gap-2 rounded-lg bg-amber px-4 font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
                  >
                    Continue to Section {nextSection.id} — {nextSection.navTitle}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={retry}
                  className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm text-ink-muted transition-colors duration-200 hover:bg-paper hover:text-ink"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Retake it
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-lg font-semibold">
                <X size={20} className="text-incorrect" aria-hidden="true" />
                Not yet — {graded.score} of {questions.length}. You need{' '}
                {threshold}.
              </p>
              <p className="mt-1 max-w-[58ch] leading-relaxed">
                Read the explanations above, then go again. The questions will
                come in a new order.
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-4 flex min-h-11 items-center gap-2 rounded-lg bg-amber px-4 font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
              >
                <RotateCcw size={15} aria-hidden="true" />
                Try again
              </button>
            </>
          )}
        </div>
      )}
    </section>
  )
}
