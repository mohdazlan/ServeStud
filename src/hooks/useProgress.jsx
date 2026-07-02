import { createContext, useContext, useEffect, useReducer } from 'react'
import { LAST_SECTION } from '../lib/sections.js'

// Progress state machine — shape per SPEC.md. Persisted to localStorage
// (standalone site, not a Claude artifact, so localStorage is available).

const STORAGE_KEY = 'servestud-progress-v1'

export const initialProgress = {
  unlockedSections: [0, 1], // Sections 0 and 1 are auto-unlocked
  completedSections: [],
  currentSection: 0,
  quizAttempts: {}, // { [sectionId]: { attempts, passed, answers } }
  exercisesCompleted: {}, // { [exerciseId]: true }
}

function withUnique(list, value) {
  return list.includes(value) ? list : [...list, value].sort((a, b) => a - b)
}

function reducer(state, action) {
  switch (action.type) {
    case 'goTo': {
      if (!state.unlockedSections.includes(action.section)) return state
      return { ...state, currentSection: action.section }
    }
    case 'passQuiz': {
      const next = Math.min(action.section + 1, LAST_SECTION)
      return {
        ...state,
        completedSections: withUnique(state.completedSections, action.section),
        unlockedSections: withUnique(state.unlockedSections, next),
      }
    }
    case 'recordQuizAttempt': {
      const prev = state.quizAttempts[action.section] ?? {
        attempts: 0,
        passed: false,
        answers: [],
      }
      return {
        ...state,
        quizAttempts: {
          ...state.quizAttempts,
          [action.section]: {
            attempts: prev.attempts + 1,
            passed: prev.passed || action.passed,
            answers: action.answers,
          },
        },
      }
    }
    case 'completeExercise': {
      return {
        ...state,
        exercisesCompleted: { ...state.exercisesCompleted, [action.exercise]: true },
      }
    }
    case 'reset':
      return initialProgress
    default:
      return state
  }
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialProgress
    const saved = JSON.parse(raw)
    // Merge over defaults so new fields survive old saves
    return {
      ...initialProgress,
      ...saved,
      unlockedSections: Array.isArray(saved.unlockedSections)
        ? saved.unlockedSections
        : initialProgress.unlockedSections,
    }
  } catch {
    return initialProgress
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadProgress)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private browsing / quota — the app still works, progress just won't persist
    }
  }, [state])

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
