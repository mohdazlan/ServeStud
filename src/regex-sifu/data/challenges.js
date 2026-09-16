/**
 * Challenge Mode Exercises for RegEx Sifu
 * Structured with requirements, sample inputs, progressive hints,
 * hidden test suites, and supportive educational feedback.
 */

export const CHALLENGES = [
  {
    id: 'ch-1',
    title: '1. Exactly Five Digits',
    difficulty: 'Beginner',
    requirement: 'Write a pattern that accepts any string containing exactly 5 digits (0-9) from start to finish.',
    scenario: 'You are validating a 5-digit security OTP code or a postal zip code.',
    initialPattern: '^',
    hints: [
      'Hint 1: What shorthand matches any digit from 0 to 9? Remember \\d.',
      'Hint 2: To repeat something an exact number of times, use curly braces {n}. So 5 times is {5}.',
      'Solution: ^\\d{5}$',
    ],
    testCases: [
      { input: '12345', shouldMatch: true, label: 'Standard 5 digits' },
      { input: '00123', shouldMatch: true, label: '5 digits with leading zeroes' },
      { input: '99999', shouldMatch: true, label: '5 nines' },
      { input: '1234', shouldMatch: false, label: 'Only 4 digits (too short)' },
      { input: '123456', shouldMatch: false, label: '6 digits (too long)' },
      { input: '1234a', shouldMatch: false, label: 'Contains a letter' },
    ],
  },

  {
    id: 'ch-2',
    title: '2. Exact Word Anchor',
    difficulty: 'Beginner',
    requirement: 'Accept the exact word "hello", but strictly REJECT "hello world" or "say hello".',
    scenario: 'You are validating a command word or a specific coupon keyword.',
    initialPattern: '',
    hints: [
      'Hint 1: If you only write "hello", RegEx searches everywhere inside "hello world" and passes.',
      'Hint 2: Use the start anchor ^ and end anchor $ to lock both ends.',
      'Solution: ^hello$',
    ],
    testCases: [
      { input: 'hello', shouldMatch: true, label: 'Exact match "hello"' },
      { input: 'hello world', shouldMatch: false, label: 'Extra word after hello' },
      { input: 'say hello', shouldMatch: false, label: 'Extra word before hello' },
      { input: 'hello!', shouldMatch: false, label: 'Exclamation mark attached' },
      { input: 'hell', shouldMatch: false, label: 'Incomplete word' },
      { input: 'Hello', shouldMatch: false, label: 'Uppercase H (exact case matters)' },
    ],
  },

  {
    id: 'ch-3',
    title: '3. Malaysian Postcode (Poskod)',
    difficulty: 'Beginner',
    requirement: 'Validate a 5-digit Malaysian poskod (e.g. 50480 or 43000). Reject spaces, letters, or invalid length.',
    scenario: 'Form field on an e-commerce checkout page for deliveries to Malaysia.',
    initialPattern: '^',
    hints: [
      'Hint 1: All Malaysian postcodes consist of exactly 5 numeric digits.',
      'Hint 2: Enforce start ^ and end $ so users cannot enter trailing spaces.',
      'Solution: ^\\d{5}$',
    ],
    testCases: [
      { input: '50480', shouldMatch: true, label: 'Kuala Lumpur poskod' },
      { input: '43000', shouldMatch: true, label: 'Kajang poskod' },
      { input: '01000', shouldMatch: true, label: 'Kangar poskod' },
      { input: '5048', shouldMatch: false, label: '4 digits (incomplete)' },
      { input: '504801', shouldMatch: false, label: '6 digits' },
      { input: ' 50480 ', shouldMatch: false, label: 'Untrimmed spaces' },
    ],
  },

  {
    id: 'ch-4',
    title: '4. Basic Email Structure',
    difficulty: 'Intermediate',
    requirement: 'Match a standard email with username, an "@" symbol, a domain name, and a dot with at least 2 letters.',
    scenario: 'A student portal registration form where students enter their email.',
    initialPattern: '^[a-zA-Z0-9._%+-]+@',
    hints: [
      'Hint 1: You need: username characters, literal @, domain characters, literal dot \\., and top-level domain letters.',
      'Hint 2: Don\'t forget to escape the dot with a backslash (\\.) so it means a real dot, not "any character".',
      'Solution: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    ],
    testCases: [
      { input: 'azlan@politeknik.edu.my', shouldMatch: true, label: 'Educational domain' },
      { input: 'student123@gmail.com', shouldMatch: true, label: 'Standard Gmail' },
      { input: 'hello.world@company.org', shouldMatch: true, label: 'Dot in username' },
      { input: 'plainaddress', shouldMatch: false, label: 'Missing @ symbol' },
      { input: '@domain.com', shouldMatch: false, label: 'Missing username' },
      { input: 'user@domain.c', shouldMatch: false, label: 'TLD too short (only 1 letter)' },
    ],
  },

  {
    id: 'ch-5',
    title: '5. Mobile Number with Optional Dash',
    difficulty: 'Intermediate',
    requirement: 'Accept a Malaysian mobile number starting with 01 and any digit (0-9), with an OPTIONAL hyphen, followed by 7 or 8 digits.',
    scenario: 'Allowing users to type either 012-3456789 or 0123456789 comfortably.',
    initialPattern: '^01[0-9]',
    hints: [
      'Hint 1: To make a character optional, place a question mark ? right after it (-?).',
      'Hint 2: For 7 or 8 digits, use the quantifier range \\d{7,8}.',
      'Solution: ^01[0-9]-?\\d{7,8}$',
    ],
    testCases: [
      { input: '012-3456789', shouldMatch: true, label: '012 with dash' },
      { input: '0123456789', shouldMatch: true, label: '012 without dash' },
      { input: '011-12345678', shouldMatch: true, label: '011 with 8 digits' },
      { input: '01112345678', shouldMatch: true, label: '011 without dash' },
      { input: '022-3456789', shouldMatch: false, label: 'Invalid prefix 02' },
      { input: '012-345', shouldMatch: false, label: 'Incomplete number' },
    ],
  },

  {
    id: 'ch-6',
    title: '6. Require at Least One Capital Letter',
    difficulty: 'Intermediate',
    requirement: 'Check a password or code to ensure it contains at least one uppercase letter (A-Z) anywhere in the string.',
    scenario: 'Enforcing password complexity during account signup.',
    initialPattern: '',
    hints: [
      'Hint 1: You can use a positive lookahead (?=.*[A-Z]) or match anything with [A-Z] inside.',
      'Hint 2: If testing whether the whole string has at least one uppercase letter with other characters, try .*?[A-Z].* or ^(?=.*[A-Z]).+$',
      'Solution: ^(?=.*[A-Z]).+$ or [A-Z]',
    ],
    testCases: [
      { input: 'Password123', shouldMatch: true, label: 'Has uppercase P' },
      { input: 'cyberSIFU', shouldMatch: true, label: 'Has multiple uppercase' },
      { input: 'politeknikA', shouldMatch: true, label: 'Uppercase at end' },
      { input: 'password123', shouldMatch: false, label: 'All lowercase letters' },
      { input: '12345678', shouldMatch: false, label: 'Only numbers' },
      { input: 'selamat_pagi', shouldMatch: false, label: 'Lowercase and underscore' },
    ],
  },

  {
    id: 'ch-7',
    title: '7. Image Ending with .jpg or .png',
    difficulty: 'Beginner',
    requirement: 'Match a filename that ends strictly with ".jpg" or ".png" (case-insensitive).',
    scenario: 'Avatar image upload field validation in a web form.',
    initialPattern: '^[a-zA-Z0-9_-]+\\.',
    hints: [
      'Hint 1: Escape the period with \\. so it matches a literal dot.',
      'Hint 2: Use an alternation group (jpg|png) anchored to the end with $.',
      'Solution: ^[a-zA-Z0-9_-]+\\.(jpg|png)$',
    ],
    testCases: [
      { input: 'profile.jpg', shouldMatch: true, label: 'Standard JPEG' },
      { input: 'avatar_2024.png', shouldMatch: true, label: 'PNG with underscore' },
      { input: 'photo.JPG', shouldMatch: true, label: 'Uppercase extension' },
      { input: 'document.pdf', shouldMatch: false, label: 'PDF document rejected' },
      { input: 'photo.jpg.exe', shouldMatch: false, label: 'Executable disguised as image' },
      { input: 'image.gif', shouldMatch: false, label: 'GIF not in allowed list' },
    ],
    flags: 'i',
  },
]
