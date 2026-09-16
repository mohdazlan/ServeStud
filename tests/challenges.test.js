import test from 'node:test'
import assert from 'node:assert'
import { CHALLENGES } from '../src/regex-sifu/data/challenges.js'
import { safeTest } from '../src/regex-sifu/engine/regexEngine.js'

test('All challenge solutions pass all corresponding test cases', () => {
  assert.ok(CHALLENGES.length >= 7, 'Should have at least 7 challenges')

  const expectedSolutions = {
    'ch-1': '^\\d{5}$',
    'ch-2': '^hello$',
    'ch-3': '^\\d{5}$',
    'ch-4': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    'ch-5': '^01[0-9]-?\\d{7,8}$',
    'ch-6': '^(?=.*[A-Z]).+$',
    'ch-7': '^[a-zA-Z0-9_-]+\\.(jpg|png)$',
  }

  for (const ch of CHALLENGES) {
    const solution = expectedSolutions[ch.id]
    assert.ok(solution, `Expected solution for challenge ${ch.id} must be defined in test`)

    for (const tc of ch.testCases) {
      const res = safeTest(solution, ch.flags || '', tc.input)
      assert.strictEqual(
        res.isValidPattern,
        true,
        `Challenge ${ch.id} solution "${solution}" must be a valid regex`
      )
      assert.strictEqual(
        res.isMatch,
        tc.shouldMatch,
        `Challenge ${ch.id} solution "${solution}" on input "${tc.input}" (${tc.label}) expected ${tc.shouldMatch} but got ${res.isMatch}`
      )
    }
  }
})
