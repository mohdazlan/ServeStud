import test from 'node:test'
import assert from 'node:assert'
import { LESSONS } from '../src/regex-sifu/data/lessons.js'

test('All 10 lessons have complete pedagogical structures', () => {
  assert.strictEqual(LESSONS.length, 10, 'Must have exactly 10 progressive lessons')

  LESSONS.forEach((lesson, index) => {
    assert.ok(lesson.title, `Lesson ${index + 1} must have a title`)
    assert.ok(lesson.concept, `Lesson ${index + 1} must have a concept`)
    assert.ok(lesson.rule, `Lesson ${index + 1} must have a rule`)
    assert.ok(lesson.visual, `Lesson ${index + 1} must have visual data`)
    assert.ok(lesson.workedExample?.pattern, `Lesson ${index + 1} must have a worked example pattern`)
    assert.ok(lesson.prediction?.question, `Lesson ${index + 1} must have a prediction question`)
    assert.ok(lesson.prediction.options.length >= 2, `Lesson ${index + 1} must have at least 2 prediction options`)
    assert.ok(lesson.prediction.options.some((o) => o.isCorrect), `Lesson ${index + 1} must have a correct prediction option`)
    assert.ok(lesson.practice?.validate, `Lesson ${index + 1} must have a practice validator function`)
  })
})
