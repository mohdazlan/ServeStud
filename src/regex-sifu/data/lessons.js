/**
 * Learning Mode Lessons Data for RegEx Sifu
 * Specially designed for weak or repeat students who struggle with abstract syntax.
 * Strictly adheres to: One idea per lesson, visual diagrams, worked examples,
 * prediction checkpoints, and immediate feedback without punishing language.
 */

export const LESSONS = [
  {
    id: 1,
    title: '1. What RegEx Actually Does',
    concept: 'RegEx is a cookie cutter (stencil), not magic code.',
    rule: 'Instead of checking character by character with 20 if-statements, RegEx defines the exact shape of valid text.',
    visual: {
      type: 'analogy',
      stencil: '#####-##-####',
      passStr: '040512-10-5432',
      failStr: '04051-A-543',
    },
    workedExample: {
      pattern: '^cat$',
      explanation: 'Matches only the word "cat". Rejects "cats", "scatter", or "black cat".',
    },
    prediction: {
      question: 'Will the pattern "^cat$" match the text "scatter"?',
      options: [
        { text: 'Yes, because it contains "cat"', isCorrect: false },
        { text: 'No, because "^" forces it to start with "c" and "$" forces it to end with "t"', isCorrect: true },
        { text: 'Yes, because RegEx searches everywhere by default', isCorrect: false },
      ],
      explanation: 'The ^ anchor pins the beginning and $ pins the end. "scatter" starts with "s", so the cookie cutter rejects it!',
    },
    practice: {
      instructions: 'Construct a pattern that matches the exact word "kucing" from start to finish.',
      initialPattern: '',
      targetValue: 'kucing',
      hint: 'Remember to anchor both sides with ^ and $ (e.g. ^kucing$).',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('kucing') && !r.test('anak kucing') && !r.test('kucingku')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 2,
    title: '2. Literal Characters',
    concept: 'Most letters and numbers match themselves literally.',
    rule: 'Typing "ABC" in RegEx looks for the exact letters A, B, and C in that exact order.',
    visual: {
      type: 'token_match',
      tokens: [
        { char: 'H', desc: 'Literal H' },
        { char: 'T', desc: 'Literal T' },
        { char: 'M', desc: 'Literal M' },
        { char: 'L', desc: 'Literal L' },
      ],
      sample: 'HTML5',
    },
    workedExample: {
      pattern: 'DFP50283',
      explanation: 'Matches the exact course code "DFP50283". Case matters: "dfp50283" will fail unless case-insensitive flag "i" is used.',
    },
    prediction: {
      question: 'Does the pattern "Batu" match "Batu Pahat"?',
      options: [
        { text: 'Yes, because the letters "B-a-t-u" appear right at the start', isCorrect: true },
        { text: 'No, because " Pahat" is extra text', isCorrect: false },
      ],
      explanation: 'Without the "$" end anchor, JavaScript RegEx searches for the literal word anywhere in the string!',
    },
    practice: {
      instructions: 'Write a literal pattern to match the university course prefix "DIT".',
      initialPattern: '',
      targetValue: 'DIT',
      hint: 'Just write the exact three letters: DIT',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('DIT24F1001') && !r.test('DKM24F1001')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 3,
    title: '3. Digits & Letters (\\d, \\w, \\s)',
    concept: 'Shorthand character classes make rules short and clean.',
    rule: '\\d means any digit (0-9). \\w means any word character (letter, digit, _). \\s means whitespace (spaces, tabs).',
    visual: {
      type: 'shorthands',
      items: [
        { symbol: '\\d', name: 'Digit', matches: '0, 1, 2, ... 9' },
        { symbol: '\\w', name: 'Word character', matches: 'a-z, A-Z, 0-9, _' },
        { symbol: '\\s', name: 'Whitespace', matches: 'space, tab, newline' },
      ],
    },
    workedExample: {
      pattern: '^\\d\\d\\d$',
      explanation: 'Matches any 3-digit number (e.g. 123, 999, 007). Rejects 12 or 1234.',
    },
    prediction: {
      question: 'What does "\\d\\d-\\d\\d" match?',
      options: [
        { text: 'Any two words separated by a dash', isCorrect: false },
        { text: 'Two digits, a hyphen, and two digits (e.g. "12-34")', isCorrect: true },
        { text: 'Four letters and a dash', isCorrect: false },
      ],
      explanation: '\\d matches digits (0-9) only. So \\d\\d-\\d\\d matches patterns like 01-99 or 24-05.',
    },
    practice: {
      instructions: 'Write a pattern using \\d that matches exactly 4 digits (like a banking PIN or a year).',
      initialPattern: '^',
      targetValue: '2024',
      hint: 'Use 4 \\d symbols between ^ and $: ^\\d\\d\\d\\d$ (or ^\\d{4}$)',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('2024') && !r.test('202') && !r.test('20245') && !r.test('202a')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 4,
    title: '4. Character Sets ([0-9], [a-z], [^...])',
    concept: 'Square brackets [ ] let you choose ONE character from a custom list.',
    rule: '[0-9] matches any digit. [aeiou] matches any vowel. [^0-9] negates the set (anything EXCEPT a digit).',
    visual: {
      type: 'set_diagram',
      bracket: '[0-9]',
      allowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      rejected: ['a', 'Z', '@', '#'],
    },
    workedExample: {
      pattern: '^01[0-9]$',
      explanation: 'Starts with 01, followed by any single digit from 0 to 9 (010, 011, ... 019).',
    },
    prediction: {
      question: 'Which string matches "^[A-C][1-3]$"?',
      options: [
        { text: 'A4', isCorrect: false },
        { text: 'B2', isCorrect: true },
        { text: 'D1', isCorrect: false },
      ],
      explanation: 'B is inside [A-C] (A, B, C) and 2 is inside [1-3] (1, 2, 3), so B2 is valid!',
    },
    practice: {
      instructions: 'Create a pattern to match a single Malaysian car plate prefix letter [A-Z] followed by a single digit [1-9].',
      initialPattern: '^',
      targetValue: 'W1',
      hint: 'Combine two brackets: ^[A-Z][1-9]$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('W1') && r.test('B7') && !r.test('W0') && !r.test('1W')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 5,
    title: '5. Anchors: Start (^) and End ($)',
    concept: 'Anchors do not match characters; they pin the boundary.',
    rule: '^ locks the match to the very beginning. $ locks the match to the very end. Together (^...$), they force the entire string to conform.',
    visual: {
      type: 'anchors_comparison',
      without: 'Pattern "cat" on "scatter" => MATCH (uncontrolled)',
      withAnchors: 'Pattern "^cat$" on "scatter" => NO MATCH (strictly pinned)',
    },
    workedExample: {
      pattern: '^\\d{5}$',
      explanation: 'Enforces Malaysian postcode: must be exactly 5 digits from start to finish, no spaces or letters before or after.',
    },
    prediction: {
      question: 'In JavaScript, what happens if you forget ^ and $ on a password field?',
      options: [
        { text: 'It will always fail', isCorrect: false },
        { text: 'It will accept passwords with invalid symbols as long as a valid part exists somewhere', isCorrect: true },
      ],
      explanation: 'Without ^ and $, /\\d{4}/ will pass "my PIN is 1234 but this text is extra" because it only tests if 4 digits exist anywhere!',
    },
    practice: {
      instructions: 'Lock the pattern "Merdeka" so it only matches the exact word and rejects "Selamat Merdeka".',
      initialPattern: 'Merdeka',
      targetValue: 'Merdeka',
      hint: 'Add ^ before M and $ after a: ^Merdeka$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('Merdeka') && !r.test('Selamat Merdeka') && !r.test('Merdeka 1957')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: '6',
    title: '6. Quantifiers: Exact and Ranges ({n}, {min,max})',
    concept: 'Quantifiers repeat the single token that comes immediately before them.',
    rule: '{5} means exactly 5 times. {2,4} means between 2 and 4 times. {8,} means 8 or more.',
    visual: {
      type: 'quantifier_box',
      pattern: '\\d{5}',
      breakdown: '\\d (digit) x 5 repetitions',
      examples: ['50480 (5 digits -> PASS)', '5048 (4 digits -> FAIL)'],
    },
    workedExample: {
      pattern: '^\\d{2}-\\d{3}$',
      explanation: 'Matches 2 digits, a dash, and 3 digits (e.g. 12-345).',
    },
    prediction: {
      question: 'Will "^[A-Z]{2,4}$" match "ABC"?',
      options: [
        { text: 'Yes, because 3 letters is between 2 and 4', isCorrect: true },
        { text: 'No, it must be either 2 or 4, not 3', isCorrect: false },
      ],
      explanation: '{2,4} is a range: 2, 3, or 4 letters are all valid!',
    },
    practice: {
      instructions: 'Write a pattern that matches a Malaysian postcode: exactly 5 digits anchored start to end.',
      initialPattern: '^',
      targetValue: '50480',
      hint: 'Use \\d{5} between ^ and $: ^\\d{5}$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('50480') && r.test('43000') && !r.test('5048') && !r.test('504801')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 7,
    title: '7. Optional Characters (?)',
    concept: 'The question mark ? makes the preceding token optional (0 or 1 time).',
    rule: '-? means a hyphen can be present, or omitted. It never means "any character" (that is dot .)!',
    visual: {
      type: 'optional_path',
      base: '012',
      optional: '[-]?',
      tail: '3456789',
      result: 'Accepts both "012-3456789" AND "0123456789"',
    },
    workedExample: {
      pattern: '^https?://',
      explanation: 'The "s?" makes "s" optional. Matches both "http://" and "https://".',
    },
    prediction: {
      question: 'What does "^RM\\s?\\d+$" accept?',
      options: [
        { text: 'Only "RM 50" (with space)', isCorrect: false },
        { text: 'Both "RM 50" (with space) and "RM50" (no space)', isCorrect: true },
      ],
      explanation: '\\s? makes the whitespace optional, so students can type RM with or without a space!',
    },
    practice: {
      instructions: 'Make the hyphen optional between 012 and 345: match both "012-345" and "012345".',
      initialPattern: '^012-?345$',
      targetValue: '012345',
      hint: 'Put ? after the hyphen: ^012-?345$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('012-345') && r.test('012345') && !r.test('012--345')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 8,
    title: '8. Repetition: + (One or more) vs * (Zero or more)',
    concept: '+ requires AT LEAST ONE. * is forgiving and allows ZERO.',
    rule: '\\d+ must have at least 1 digit. \\d* can match empty string or 100 digits.',
    visual: {
      type: 'comparison',
      col1: { title: '+ (Plus)', rule: '1, 2, 3, ... (Min 1)', eg: 'a+ on "" -> FAIL' },
      col2: { title: '* (Star)', rule: '0, 1, 2, ... (Min 0)', eg: 'a* on "" -> PASS' },
    },
    workedExample: {
      pattern: '^[a-zA-Z]+$',
      explanation: 'Requires one or more letters for a person name. Rejecting empty input.',
    },
    prediction: {
      question: 'If a student submits an empty field "", which pattern will reject it?',
      options: [
        { text: '^\\d+$ (Plus)', isCorrect: true },
        { text: '^\\d*$ (Star)', isCorrect: false },
      ],
      explanation: 'Plus (+) requires at least 1 digit! Star (*) matches 0 digits, so an empty string would accidentally be considered valid!',
    },
    practice: {
      instructions: 'Write a pattern that matches one or more letters (A-Z or a-z), rejecting empty text.',
      initialPattern: '^',
      targetValue: 'Malaysia',
      hint: 'Use [a-zA-Z]+ with anchors: ^[a-zA-Z]+$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('Malaysia') && r.test('Azlan') && !r.test('') && !r.test('123')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 9,
    title: '9. Groups & Alternatives ( (A|B) )',
    concept: 'Parentheses ( ) group tokens together, and pipe | acts as OR.',
    rule: '(01|\\+601) means: match either "01" OR "+601". Without parentheses, | splits the entire line!',
    visual: {
      type: 'branch',
      branchA: '01',
      branchB: '+601',
      combiner: '--> \\d{8}',
    },
    workedExample: {
      pattern: '^(jpg|png|webp)$',
      explanation: 'Matches only file extensions that are exactly "jpg", "png", or "webp".',
    },
    prediction: {
      question: 'What does "^(Lelaki|Perempuan)$" accept?',
      options: [
        { text: 'Only the word "Lelaki"', isCorrect: false },
        { text: 'Either "Lelaki" or "Perempuan"', isCorrect: true },
        { text: 'Both words together', isCorrect: false },
      ],
      explanation: 'The pipe symbol | works like the word "OR" in human logic.',
    },
    practice: {
      instructions: 'Create an alternation pattern that accepts either "AM" or "PM".',
      initialPattern: '^',
      targetValue: 'AM',
      hint: 'Wrap the choices in parentheses separated by pipe: ^(AM|PM)$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('AM') && r.test('PM') && !r.test('FM') && !r.test('AMPM')
        } catch {
          return false
        }
      },
    },
  },

  {
    id: 10,
    title: '10. Safe Web Form Validation (HTML vs JS)',
    concept: 'How to bring RegEx into real HTML <input> and JavaScript code safely.',
    rule: 'HTML pattern="^...$" is automatically anchored by modern browsers. JavaScript RegExp.test() must be explicitly anchored with ^ and $!',
    visual: {
      type: 'code_duo',
      html: '<input pattern="\\d{5}" required>',
      js: 'const p = /^\\d{5}$/;\nif (p.test(input.value)) { ... }',
    },
    workedExample: {
      pattern: '^(?:\\+?60|0)1[0-9]-?\\d{7,8}$',
      explanation: 'Complete Malaysian handphone validator combining anchors, groups, charsets, and quantifiers.',
    },
    prediction: {
      question: 'Does client-side RegEx replace backend validation in Java Servlets or PHP?',
      options: [
        { text: 'Yes, if the frontend validates it, the backend is 100% safe', isCorrect: false },
        { text: 'NO! An attacker can bypass browser HTML validation with Postman or Curl. Backend validation is always required!', isCorrect: true },
      ],
      explanation: 'Golden rule of web security: Client-side RegEx is for user experience (instant guidance); server-side validation in Java/Node/PHP is for security!',
    },
    practice: {
      instructions: 'Construct a full Malaysian postcode validator anchored for JavaScript: ^\\d{5}$',
      initialPattern: '',
      targetValue: '50480',
      hint: '^\\d{5}$',
      validate: (input) => {
        try {
          const r = new RegExp(input)
          return r.test('50480') && !r.test('5048') && !r.test('abc50480')
        } catch {
          return false
        }
      },
    },
  },
]
