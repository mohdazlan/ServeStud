import test from 'node:test'
import assert from 'node:assert'
import { PATTERNS } from '../src/regex-sifu/data/patterns.js'

test('All patterns compile and pass verification tests', () => {
  assert.ok(PATTERNS.length >= 20, 'Should have at least 20 patterns')

  for (const item of PATTERNS) {
    // 1. Must compile
    let regex
    try {
      regex = new RegExp(item.source, item.flags || undefined)
    } catch (err) {
      assert.fail(`Pattern "${item.title}" failed to compile: ${err.message}`)
    }

    // 2. All valid examples must match
    for (const validStr of item.validExamples) {
      const isMatch = regex.test(validStr)
      assert.ok(
        isMatch,
        `Pattern "${item.title}" (${item.source}) should MATCH valid example "${validStr}"`
      )
    }

    // 3. All invalid examples must NOT match
    for (const invalidStr of item.invalidExamples) {
      const isMatch = regex.test(invalidStr)
      assert.ok(
        !isMatch,
        `Pattern "${item.title}" (${item.source}) should REJECT invalid example "${invalidStr}"`
      )
    }

    // 4. Must have required fields
    assert.ok(item.title, `Pattern ${item.id} must have a title`)
    assert.ok(item.tokens && item.tokens.length > 0, `Pattern ${item.id} must have tokens`)
    assert.ok(item.sentence, `Pattern ${item.id} must have a plain-language sentence`)
    assert.ok(item.htmlSnippet, `Pattern ${item.id} must have an HTML snippet`)
    assert.ok(item.jsSnippet, `Pattern ${item.id} must have a JS snippet`)
  }
})
