import test from 'node:test'
import assert from 'node:assert'
import { querySifuCoach, SUGGESTED_PROMPTS } from '../src/regex-sifu/engine/sifuCoachEngine.js'

test('Sifu Coach accurately resolves core Malaysian and Web validation intents', () => {
  // 1. Malaysian mobile phone intent
  const phoneRes = querySifuCoach('I need a Malaysian mobile phone number that can start with 01 or +601.')
  assert.strictEqual(phoneRes.success, true)
  assert.strictEqual(phoneRes.type, 'matched_intent')
  assert.ok(new RegExp(phoneRes.intent.recommendedPattern).test('012-3456789'))
  assert.ok(phoneRes.intent.validExamples.length >= 3)
  assert.ok(phoneRes.intent.invalidExamples.length >= 3)
  assert.ok(phoneRes.intent.tokens.length >= 4)
  assert.ok(phoneRes.intent.realWorldWarning)

  // 2. Malaysian IC / MyKad
  const icRes = querySifuCoach('Borang pendaftaran perlukan No Kad Pengenalan MyKad')
  assert.strictEqual(icRes.success, true)
  assert.ok(icRes.intent.recommendedPattern.includes('\\d{6}'))

  // 3. Email
  const emailRes = querySifuCoach('Student email address validation')
  assert.strictEqual(emailRes.success, true)
  assert.ok(emailRes.intent.recommendedPattern.includes('@'))

  // 4. Matric number
  const matricRes = querySifuCoach('No matrik pelajar politeknik 20DIT')
  assert.strictEqual(matricRes.success, true)
  assert.ok(matricRes.intent.recommendedPattern.includes('[A-Za-z]{3}'))

  // 5. Strong Password
  const pwdRes = querySifuCoach('Polisi kata laluan kukuh ada simbol')
  assert.strictEqual(pwdRes.success, true)

  // 6. Postcode
  const postRes = querySifuCoach('poskod malaysia 5 digit')
  assert.strictEqual(postRes.success, true)
  assert.strictEqual(postRes.intent.recommendedPattern, '^\\d{5}$')

  // 7. Ringgit
  const rmRes = querySifuCoach('harga duit ringgit malaysia RM')
  assert.strictEqual(rmRes.success, true)

  // 8. Image file
  const imgRes = querySifuCoach('upload image gambar fail extension')
  assert.strictEqual(imgRes.success, true)

  // 9. Raw regex analyzer (detects missing anchors)
  const rawRes = querySifuCoach('\\d{5}')
  assert.strictEqual(rawRes.success, true)
  assert.strictEqual(rawRes.type, 'raw_analysis')
  assert.ok(rawRes.issues.some((iss) => iss.includes('sauh permulaan (^)')))

  // 10. Suggested prompts
  assert.ok(SUGGESTED_PROMPTS.length >= 5)
})
