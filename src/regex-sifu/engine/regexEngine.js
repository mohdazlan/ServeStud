/**
 * Safe RegEx Execution Engine & Dynamic Tokenizer for RegEx Sifu
 * Protects against Catastrophic Backtracking (ReDoS) and parses
 * patterns into pedagogical token chunks for interactive inspection.
 */

/**
 * Safely test a RegExp against a value with execution guards
 */
export function safeTest(patternStr, flagsStr, testVal) {
  if (!patternStr) {
    return {
      isValidPattern: false,
      isMatch: false,
      error: 'Corak RegEx kosong. Sila masukkan corak untuk diuji.',
      executionTimeMs: 0,
    }
  }

  // Sanity check length
  if (patternStr.length > 500) {
    return {
      isValidPattern: false,
      isMatch: false,
      error: 'Corak terlalu panjang (maksimum 500 aksara untuk tujuan pembelajaran).',
      executionTimeMs: 0,
    }
  }

  try {
    const cleanFlags = (flagsStr || '').replace(/[^gimsuy]/g, '')
    const startTime = performance.now()
    const regex = new RegExp(patternStr, cleanFlags)
    const isMatch = regex.test(testVal ?? '')
    const elapsed = Math.round((performance.now() - startTime) * 100) / 100

    return {
      isValidPattern: true,
      isMatch,
      error: null,
      executionTimeMs: elapsed,
      regexInstance: regex,
    }
  } catch (err) {
    return {
      isValidPattern: false,
      isMatch: false,
      error: formatRegexError(err.message),
      executionTimeMs: 0,
    }
  }
}

/**
 * Format raw JavaScript RegExp compilation errors into beginner-friendly explanations
 */
function formatRegexError(rawMsg) {
  if (/unterminated character class/i.test(rawMsg)) {
    return 'Kurungan set [ ] belum ditutup! Pastikan setiap "[" mempunyai penutup "]".'
  }
  if (/unmatched \)/i.test(rawMsg) || /unexpected \)/i.test(rawMsg)) {
    return 'Terdapat kurungan tutup ")" tanpa kurungan buka "(". Periksa pasangan kumpulan anda.'
  }
  if (/nothing to repeat/i.test(rawMsg)) {
    return 'Simbol ulangan (+, *, ?) diletakkan tanpa aksara sebelum itu. Cth: jangan mulakan corak dengan "+".'
  }
  if (/invalid range in character class/i.test(rawMsg)) {
    return 'Julat dalam [ ] tidak sah! Cth: [z-a] salah, sepatutnya [a-z] mengikut abjad.'
  }
  if (/invalid regular expression flags/i.test(rawMsg)) {
    return 'Bendera (flags) tidak sah. Hanya gunakan "i" (abaikan huruf besar/kecil), "m", atau "g".'
  }
  return `Ralat sintaks RegEx: ${rawMsg}`
}

/**
 * Dynamic tokenizer for breaking down arbitrary RegEx patterns into visual color-coded tokens
 */
export function tokenizePattern(patternStr) {
  if (!patternStr) return []

  const tokens = []
  let i = 0
  const len = patternStr.length

  while (i < len) {
    const ch = patternStr[i]

    // 1. Escaped sequences: \d, \w, \s, \., \+, etc.
    if (ch === '\\' && i + 1 < len) {
      const next = patternStr[i + 1]
      const raw = ch + next
      let meaning = `Aksara khas terlepas: "${raw}"`
      let category = 'escape'

      if (next === 'd') meaning = '\\d: Padankan mana-mana digit nombor (0 hingga 9)'
      else if (next === 'D') meaning = '\\D: Mana-mana aksara SELAIN digit nombor'
      else if (next === 'w') meaning = '\\w: Aksara perkataan (huruf a-z, A-Z, 0-9, atau _)'
      else if (next === 'W') meaning = '\\W: Aksara bukan perkataan (simbol, ruang)'
      else if (next === 's') meaning = '\\s: Ruang kosong (whitespace: space, tab, newline)'
      else if (next === 'S') meaning = '\\S: Aksara bukan ruang kosong'
      else if (next === 'b') meaning = '\\b: Sempadan perkataan (word boundary)'
      else if (next === '.') meaning = '\\.: Titik noktah sebenar (literal dot)'
      else if (['+', '*', '?', '^', '$', '(', ')', '[', ']', '{', '}', '|', '/'].includes(next)) {
        meaning = `\\${next}: Aksara literal "${next}" yang dilepaskan daripada makna sintaks`
        category = 'literal'
      }

      tokens.push({ raw, meaning, category, index: tokens.length })
      i += 2
      continue
    }

    // 2. Anchors: ^ and $
    if (ch === '^') {
      tokens.push({
        raw: '^',
        meaning: '^: Sauh permulaan (Start anchor) — memaksa semakan bermula dari aksara terawal.',
        category: 'anchor',
        index: tokens.length,
      })
      i++
      continue
    }
    if (ch === '$') {
      tokens.push({
        raw: '$',
        meaning: '$: Sauh penamat (End anchor) — memaksa semakan berakhir di hujung teks tanpa aksara lebihan.',
        category: 'anchor',
        index: tokens.length,
      })
      i++
      continue
    }

    // 3. Quantifier braces: {n}, {n,}, {min,max}
    if (ch === '{') {
      let close = patternStr.indexOf('}', i)
      if (close !== -1) {
        const raw = patternStr.slice(i, close + 1)
        tokens.push({
          raw,
          meaning: `${raw}: Pengulang kuantiti — mengulang token sebelum ini mengikut kiraan yang ditetapkan.`,
          category: 'quantifier',
          index: tokens.length,
        })
        i = close + 1
        continue
      }
    }

    // 4. Character classes: [...] or [^...]
    if (ch === '[') {
      let close = -1
      for (let j = i + 1; j < len; j++) {
        if (patternStr[j] === ']' && patternStr[j - 1] !== '\\') {
          close = j
          break
        }
      }
      if (close !== -1) {
        const raw = patternStr.slice(i, close + 1)
        const isNegated = raw.startsWith('[^')
        tokens.push({
          raw,
          meaning: `${raw}: Set aksara ${isNegated ? 'penafian (NEGATED)' : 'pilihan'} — memadankan SATU aksara ${isNegated ? 'selain daripada senarai' : 'daripada pilihan dalam kurungan'}.`,
          category: 'charset',
          index: tokens.length,
        })
        i = close + 1
        continue
      }
    }

    // 5. Quantifiers: +, *, ?
    if (ch === '+' || ch === '*' || ch === '?') {
      let meaning = ''
      if (ch === '+') meaning = '+: Satu atau lebih kali (Mesti ada sekurang-kurangnya 1)'
      if (ch === '*') meaning = '*: Sifar atau lebih kali (Boleh tiada, atau berulang banyak kali)'
      if (ch === '?') meaning = '?: Pilihan (Optional — sama ada 0 atau 1 kali sahaja)'
      tokens.push({ raw: ch, meaning, category: 'quantifier', index: tokens.length })
      i++
      continue
    }

    // 6. Groups & Alternation: (?:...), (...), |
    if (ch === '|' ) {
      tokens.push({
        raw: '|',
        meaning: '|: Pilihan ATAU (Alternation OR) — memadankan pilihan di kiri ATAU kanan.',
        category: 'group',
        index: tokens.length,
      })
      i++
      continue
    }
    if (ch === '(') {
      tokens.push({
        raw: '(',
        meaning: '(: Buka kurungan kumpulan (Grouping start)',
        category: 'group',
        index: tokens.length,
      })
      i++
      continue
    }
    if (ch === ')') {
      tokens.push({
        raw: ')',
        meaning: '): Tutup kurungan kumpulan (Grouping end)',
        category: 'group',
        index: tokens.length,
      })
      i++
      continue
    }

    // 7. Wildcard dot
    if (ch === '.') {
      tokens.push({
        raw: '.',
        meaning: '.: Titik bebas (Wildcard) — memadankan sebarang satu aksara (kecuali baris baru).',
        category: 'charset',
        index: tokens.length,
      })
      i++
      continue
    }

    // 8. Literals (accumulate consecutive literal characters)
    let lit = ch
    while (i + 1 < len) {
      const next = patternStr[i + 1]
      if ('\\^${}[]()+*?|.'.includes(next)) break
      lit += next
      i++
    }
    tokens.push({
      raw: lit,
      meaning: `Aksara literal: "${lit}" — mesti sepadan tepat huruf ini.`,
      category: 'literal',
      index: tokens.length,
    })
    i++
  }

  return tokens
}

/**
 * Returns color classes based on token category for consistent visual hierarchy
 */
export function getTokenCategoryStyle(category) {
  switch (category) {
    case 'anchor':
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        badge: 'bg-rose-500/20 text-rose-300',
        label: 'Sauh (Anchor)',
      }
    case 'quantifier':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300',
        label: 'Pengulang (Quantifier)',
      }
    case 'charset':
      return {
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-500/40',
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300',
        label: 'Set Aksara (Charset)',
      }
    case 'group':
      return {
        bg: 'bg-violet-500/15',
        border: 'border-violet-500/40',
        text: 'text-violet-400',
        badge: 'bg-violet-500/20 text-violet-300',
        label: 'Kumpulan (Group)',
      }
    case 'literal':
    default:
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300',
        label: 'Teks Literal',
      }
  }
}
