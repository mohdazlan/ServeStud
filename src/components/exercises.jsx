import { useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useProgress } from '../hooks/useProgress.jsx'

// Select-then-place exercises: tap a label chip, then tap the slot where
// it belongs. One interaction model that works identically with mouse,
// touch, and keyboard (every chip and slot is a real button) — the
// keyboard alternative SPEC.md requires, as the primary interaction.

function shuffle(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function useSlotFill({ chips, slots, exerciseId }) {
  const { dispatch } = useProgress()
  const [bankOrder] = useState(() => shuffle(chips.map((c) => c.id)))
  const [placements, setPlacements] = useState({}) // { slotId: chipId }
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)

  const placedChipIds = new Set(Object.values(placements))
  const bank = bankOrder
    .map((id) => chips.find((c) => c.id === id))
    .filter((c) => !placedChipIds.has(c.id))
  const allPlaced = slots.every((s) => placements[s.id])
  const results = checked
    ? Object.fromEntries(slots.map((s) => [s.id, placements[s.id] === s.answer]))
    : {}
  const allCorrect = checked && slots.every((s) => results[s.id])

  function clickChip(chipId) {
    if (checked) return
    setSelected((cur) => (cur === chipId ? null : chipId))
  }

  function clickSlot(slotId) {
    if (checked) return
    if (selected) {
      setPlacements((p) => ({ ...p, [slotId]: selected }))
      setSelected(null)
    } else if (placements[slotId]) {
      // tap a filled slot with nothing selected: take the chip back
      setPlacements((p) => {
        const next = { ...p }
        delete next[slotId]
        return next
      })
    }
  }

  function check() {
    setChecked(true)
    const correct = slots.every((s) => placements[s.id] === s.answer)
    if (correct) dispatch({ type: 'completeExercise', exercise: exerciseId })
  }

  function fixWrong() {
    setPlacements((p) => {
      const next = {}
      for (const s of slots) {
        if (p[s.id] === s.answer) next[s.id] = p[s.id]
      }
      return next
    })
    setChecked(false)
  }

  const chipById = useMemo(
    () => Object.fromEntries(chips.map((c) => [c.id, c])),
    [chips],
  )

  return {
    bank,
    placements,
    selected,
    checked,
    results,
    allPlaced,
    allCorrect,
    chipById,
    clickChip,
    clickSlot,
    check,
    fixWrong,
  }
}

export function ChipBank({ fill, label }) {
  if (fill.bank.length === 0 && !fill.checked) return null
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {fill.bank.map((chip) => (
          <li key={chip.id}>
            <button
              type="button"
              onClick={() => fill.clickChip(chip.id)}
              aria-pressed={fill.selected === chip.id}
              className={`min-h-11 rounded-lg border px-3.5 py-2 text-left font-medium transition-colors duration-150 ${
                fill.selected === chip.id
                  ? 'border-amber bg-amber text-white'
                  : 'border-hairline bg-paper hover:bg-paper-aged'
              }`}
            >
              {chip.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FillSlot({ fill, slotId, srLabel, compact }) {
  const chipId = fill.placements[slotId]
  const chip = chipId ? fill.chipById[chipId] : null
  const result = fill.checked ? fill.results[slotId] : null

  return (
    <button
      type="button"
      onClick={() => fill.clickSlot(slotId)}
      aria-label={
        chip
          ? `${srLabel}: currently ${chip.label}${
              result === true ? ', correct' : result === false ? ', wrong' : ''
            }`
          : `${srLabel}: empty`
      }
      className={`flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-center font-medium transition-colors duration-150 ${
        result === true
          ? 'border-correct bg-correct/10'
          : result === false
            ? 'border-incorrect bg-incorrect/10'
            : chip
              ? 'border-hairline bg-paper-aged'
              : 'border-dashed border-ink-muted/50 text-ink-muted'
      } ${compact ? 'text-sm' : ''}`}
    >
      {result === true && (
        <Check size={15} className="shrink-0 text-correct" aria-hidden="true" />
      )}
      {result === false && (
        <X size={15} className="shrink-0 text-incorrect" aria-hidden="true" />
      )}
      <span className="leading-snug">{chip ? chip.label : 'Place a label'}</span>
    </button>
  )
}

export function ExerciseFooter({ fill, successText }) {
  const wrongCount = fill.checked
    ? Object.values(fill.results).filter((r) => !r).length
    : 0

  if (!fill.checked) {
    return (
      <button
        type="button"
        onClick={fill.check}
        disabled={!fill.allPlaced}
        className="mt-5 flex min-h-11 items-center gap-2 rounded-lg bg-amber px-4 font-medium text-white transition-colors duration-200 enabled:hover:bg-amber-deep disabled:opacity-40"
      >
        Check it
      </button>
    )
  }

  if (fill.allCorrect) {
    return (
      <p
        role="status"
        className="mt-5 flex items-center gap-2 rounded-lg bg-correct/12 px-4 py-3 font-medium"
      >
        <Check size={17} className="shrink-0 text-correct" aria-hidden="true" />
        {successText}
      </p>
    )
  }

  return (
    <div role="status" className="mt-5 rounded-lg bg-incorrect/10 px-4 py-3">
      <p className="font-medium">
        {wrongCount === 1 ? 'One spot needs' : `${wrongCount} spots need`} another
        look — they’re marked above.
      </p>
      <button
        type="button"
        onClick={fill.fixWrong}
        className="mt-2 flex min-h-10 items-center rounded-lg bg-amber px-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-amber-deep"
      >
        Put the wrong ones back and retry
      </button>
    </div>
  )
}

export const EXERCISE_HINT =
  'Tap a label to pick it up, then tap the spot where it belongs. Tap a filled spot to take its label back. Keyboard works the same way: Tab and Enter.'
