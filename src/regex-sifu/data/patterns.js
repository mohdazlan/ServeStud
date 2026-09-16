/**
 * Curated RegEx Pattern Library for RegEx Sifu
 * Specially tailored for Malaysian polytechnic/university diploma students
 * learning HTML/CSS/JavaScript web-form validation.
 */

export const CATEGORIES = [
  { id: 'all', label: 'All Patterns', icon: 'Layers' },
  { id: 'malaysia', label: 'Malaysia Real-World', icon: 'MapPin' },
  { id: 'web-forms', label: 'Web Form Validation', icon: 'FileCheck' },
  { id: 'beginner', label: 'Beginner Basics', icon: 'Sparkles' },
  { id: 'numbers-dates', label: 'Numbers & Dates', icon: 'Calendar' },
  { id: 'security', label: 'Security & Auth', icon: 'ShieldCheck' },
  { id: 'files-urls', label: 'Files & URLs', icon: 'Globe' },
]

export const PATTERNS = [
  // ==========================================
  // MALAYSIA REAL-WORLD EXAMPLES
  // ==========================================
  {
    id: 'my-mobile-phone',
    title: 'Malaysian Mobile Phone',
    category: 'malaysia',
    difficulty: 'Beginner',
    summary: 'Validates Malaysian handphone numbers starting with 01 or +601 with optional hyphen.',
    source: '^(?:\\+?60|0)1[0-9]-?\\d{7,8}$',
    flags: '',
    htmlPattern: '^(?:\\+?60|0)1[0-9]-?\\d{7,8}$',
    formatOnlyWarning: 'Format validation only checks the digits structure. It does not verify if the telco line is currently active or registered with MCMC.',
    sentence: 'Starts with either +60 or 0, followed by 1 and any digit (010 to 019), an optional dash, and ends with 7 to 8 digits.',
    tokens: [
      { raw: '^', meaning: 'Asserts start of the string. Ensures no leading junk characters.', category: 'anchor' },
      { raw: '(?:\\+?60|0)', meaning: 'Non-capturing group matching either "+60" (optional +) or "0".', category: 'group' },
      { raw: '1', meaning: 'Literal digit 1 (all Malaysian mobile prefixes start with 1).', category: 'literal' },
      { raw: '[0-9]', meaning: 'Any single digit 0–9 representing the telco operator prefix (010-019).', category: 'charset' },
      { raw: '-?', meaning: 'Optional hyphen separator (allows user to type 012-3456789 or 0123456789).', category: 'quantifier' },
      { raw: '\\d{7,8}', meaning: 'Matches exactly 7 or 8 digits for the remaining subscriber number.', category: 'quantifier' },
      { raw: '$', meaning: 'Asserts end of string. Rejects any trailing characters.', category: 'anchor' },
    ],
    validExamples: [
      '012-3456789',
      '01112345678',
      '+60198765432',
      '013-8889999',
    ],
    invalidExamples: [
      '022-3456789', // Invalid prefix 02
      '012-345',     // Too short
      '012-3456789012', // Too long
      'abc0123456789', // Contains letters
    ],
    htmlSnippet: `<label for="mobile" class="block text-sm font-medium">Nombor Telefon Bimbit (Mobile Phone)</label>
<input 
  type="tel" 
  id="mobile" 
  name="mobile" 
  pattern="^(?:\\+?60|0)1[0-9]-?\\d{7,8}$" 
  placeholder="Contoh: 012-3456789" 
  required 
  aria-describedby="mobile-help"
/>
<small id="mobile-help" class="text-xs text-slate-400">Format: 01x-xxxxxxx atau +601xxxxxxxx</small>`,
    jsSnippet: `// JavaScript Client-side Validation
const phonePattern = /^(?:\\+?60|0)1[0-9]-?\\d{7,8}$/;
const inputElement = document.getElementById('mobile');

inputElement.addEventListener('blur', (e) => {
  const value = e.target.value.trim();
  if (phonePattern.test(value)) {
    console.log('Valid Malaysian mobile format');
  } else {
    console.warn('Sila masukkan nombor telefon yang sah (contoh: 012-3456789)');
  }
});`,
  },

  {
    id: 'my-ic-number',
    title: 'Malaysian IC (MyKad) Format',
    category: 'malaysia',
    difficulty: 'Beginner',
    summary: 'Validates the standard 12-digit Malaysian Identity Card number with or without hyphens.',
    source: '^\\d{6}-?\\d{2}-?\\d{4}$',
    flags: '',
    htmlPattern: '^\\d{6}-?\\d{2}-?\\d{4}$',
    formatOnlyWarning: 'This only checks the 6-2-4 digit structure. Real JPN verification requires valid date-of-birth (YYMMDD), state birthplace code, and checksum verification.',
    sentence: 'Starts at the beginning, matches 6 digits (DOB: YYMMDD), an optional dash, 2 digits (State code), an optional dash, 4 digits (gender & sequence), and ends.',
    tokens: [
      { raw: '^', meaning: 'Beginning of the input.', category: 'anchor' },
      { raw: '\\d{6}', meaning: 'Exactly 6 digits representing Year-Month-Day of birth (YYMMDD).', category: 'quantifier' },
      { raw: '-?', meaning: 'Optional hyphen between birth date and state code.', category: 'quantifier' },
      { raw: '\\d{2}', meaning: 'Exactly 2 digits representing birthplace / state code (e.g. 10 for Selangor, 01 for Johor).', category: 'quantifier' },
      { raw: '-?', meaning: 'Optional second hyphen.', category: 'quantifier' },
      { raw: '\\d{4}', meaning: 'Exactly 4 digits sequence number (last digit odd for male, even for female).', category: 'quantifier' },
      { raw: '$', meaning: 'End of the input.', category: 'anchor' },
    ],
    validExamples: [
      '040512-10-5432',
      '991231015678',
      '020815-14-1121',
      '030101-08-9999',
    ],
    invalidExamples: [
      '04051-10-5432',   // Only 5 digits in first section
      '040512-1-5432',   // Only 1 digit in middle section
      '040512-10-54321', // 5 digits in last section
      '991231-10-ABCD',  // Contains letters
    ],
    htmlSnippet: `<label for="nric">No. Kad Pengenalan (MyKad)</label>
<input 
  type="text" 
  id="nric" 
  name="nric" 
  pattern="^\\d{6}-?\\d{2}-?\\d{4}$" 
  placeholder="Contoh: 020512-10-1234" 
  required 
  maxlength="14"
/>
<small>Format 12 digit (dengan atau tanpa tanda sempang '-')</small>`,
    jsSnippet: `const nricPattern = /^\\d{6}-?\\d{2}-?\\d{4}$/;
const nricInput = document.getElementById('nric');

function validateMyKad(val) {
  if (!nricPattern.test(val)) {
    return { valid: false, message: 'Format MyKad tidak sah (12 digit)' };
  }
  // Remove dashes for storage
  const clean = val.replace(/-/g, '');
  return { valid: true, cleanValue: clean };
}`,
  },

  {
    id: 'my-postcode',
    title: 'Malaysian Postcode (Poskod)',
    category: 'malaysia',
    difficulty: 'Beginner',
    summary: 'Matches Malaysian 5-digit postal codes (e.g. 50480 Kuala Lumpur, 43000 Kajang).',
    source: '^\\d{5}$',
    flags: '',
    htmlPattern: '^\\d{5}$',
    formatOnlyWarning: 'Validates that the input is exactly 5 numeric digits. It does not check if the poskod is registered with Pos Malaysia.',
    sentence: 'Requires exactly 5 consecutive numeric digits from the very start to the end of the text.',
    tokens: [
      { raw: '^', meaning: 'Beginning of string.', category: 'anchor' },
      { raw: '\\d{5}', meaning: 'Matches any digit (0-9) repeated exactly 5 times.', category: 'quantifier' },
      { raw: '$', meaning: 'End of string.', category: 'anchor' },
    ],
    validExamples: [
      '50480', // Kuala Lumpur
      '43000', // Kajang, Selangor
      '80000', // Johor Bahru
      '01000', // Kangar, Perlis
    ],
    invalidExamples: [
      '5048',  // Only 4 digits
      '504801', // 6 digits
      '5048A', // Contains letter
      ' 50480 ', // Leading or trailing spaces
    ],
    htmlSnippet: `<label for="poskod">Poskod (5 Digit)</label>
<input 
  type="text" 
  id="poskod" 
  name="poskod" 
  pattern="^\\d{5}$" 
  inputmode="numeric" 
  maxlength="5" 
  placeholder="50480" 
  required 
/>`,
    jsSnippet: `const poskodPattern = /^\\d{5}$/;
const poskod = '43000';
if (poskodPattern.test(poskod)) {
  console.log('Poskod sah 5-digit');
}`,
  },

  {
    id: 'student-matric-number',
    title: 'Student Matric Number (Politeknik)',
    category: 'malaysia',
    difficulty: 'Intermediate',
    summary: 'Matches Malaysian Polytechnic student registration numbers such as 20DIT24F1001.',
    source: '^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$',
    flags: '',
    htmlPattern: '^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$',
    formatOnlyWarning: 'Validates the standard Department/Sesi polytechnic matric format (e.g. 20=Year, DIT=Diploma IT, 24=Batch, F=Session, 1001=Roll No).',
    sentence: 'Starts with 2 digits (e.g. 20), 3 department letters (e.g. DIT), 2 session digits (24), letter F, and 4 sequential digits.',
    tokens: [
      { raw: '^', meaning: 'Beginning of student matric string.', category: 'anchor' },
      { raw: '\\d{2}', meaning: '2 digits for entry year (e.g. 20).', category: 'quantifier' },
      { raw: '[A-Za-z]{3}', meaning: '3 letters for department code (e.g. DIT, DDT, DKM).', category: 'charset' },
      { raw: '\\d{2}', meaning: '2 digits for cohort batch (e.g. 24).', category: 'quantifier' },
      { raw: '[Ff]', meaning: 'Literal letter F (or f) for intake session.', category: 'charset' },
      { raw: '\\d{4}', meaning: '4 digits roll number (e.g. 1001).', category: 'quantifier' },
      { raw: '$', meaning: 'End of student matric string.', category: 'anchor' },
    ],
    validExamples: [
      '20DIT24F1001',
      '22DDT23F2045',
      '19DKM21F1099',
      '24DEP24F3001',
    ],
    invalidExamples: [
      '20DIT241001',   // Missing letter F
      '2DIT24F1001',    // Only 1 digit at start
      '20DI24F1001',    // Only 2 letters for program code
      '20DIT24F100',    // Only 3 digits at end
    ],
    htmlSnippet: `<label for="matric">No. Pendaftaran Pelajar (Matric No)</label>
<input 
  type="text" 
  id="matric" 
  name="matric" 
  pattern="^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$" 
  placeholder="20DIT24F1001" 
  style="text-transform: uppercase" 
  required 
/>`,
    jsSnippet: `const matricPattern = /^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$/;
function checkMatric(matric) {
  return matricPattern.test(matric.trim());
}`,
  },

  {
    id: 'ringgit-amount',
    title: 'Ringgit Malaysia (RM) Amount',
    category: 'malaysia',
    difficulty: 'Intermediate',
    summary: 'Validates Malaysian currency with optional "RM" prefix and exactly 2 decimal places.',
    source: '^(?:RM\\s?)?\\d+(?:\\.\\d{2})?$',
    flags: 'i',
    htmlPattern: '^(?:[Rr][Mm]\\s?)?\\d+(?:\\.\\d{2})?$',
    formatOnlyWarning: 'Matches currency syntax (e.g. RM 45.00 or 120.50). Ensure your backend stores currency as cents or BigDecimal to avoid IEEE-754 float precision errors.',
    sentence: 'Optional "RM" followed by optional space, followed by one or more digits, and an optional 2-decimal cent value.',
    tokens: [
      { raw: '^', meaning: 'Start of currency string.', category: 'anchor' },
      { raw: '(?:RM\\s?)?', meaning: 'Optional prefix "RM" with an optional space after it.', category: 'group' },
      { raw: '\\d+', meaning: 'One or more digits for the Ringgit amount.', category: 'quantifier' },
      { raw: '(?:\\.\\d{2})?', meaning: 'Optional decimal point followed by exactly two sen digits (00-99).', category: 'group' },
      { raw: '$', meaning: 'End of currency string.', category: 'anchor' },
    ],
    validExamples: [
      'RM 150.00',
      'RM25.50',
      '500',
      'RM 0.99',
    ],
    invalidExamples: [
      'RM 150.5',   // Only 1 decimal place
      'RM 150.555', // 3 decimal places
      '$50.00',     // Wrong currency symbol
      'RM -20.00',  // Negative not allowed
    ],
    htmlSnippet: `<label for="amount">Jumlah Bayaran (RM)</label>
<input 
  type="text" 
  id="amount" 
  name="amount" 
  pattern="^(?:[Rr][Mm]\\s?)?\\d+(?:\\.\\d{2})?$" 
  placeholder="RM 50.00" 
  required 
/>`,
    jsSnippet: `const rmPattern = /^(?:RM\\s?)?\\d+(?:\\.\\d{2})?$/i;
const userInput = 'RM 120.50';
if (rmPattern.test(userInput)) {
  const numeric = parseFloat(userInput.replace(/^RM\\s?/i, ''));
  console.log('Cent amount:', Math.round(numeric * 100));
}`,
  },

  {
    id: 'my-vehicle-plate',
    title: 'Malaysian Vehicle Plate Number',
    category: 'malaysia',
    difficulty: 'Intermediate',
    summary: 'Matches Malaysian vehicle registration plates (e.g. W 1234 A, VAG 888, BMT 4321).',
    source: '^[a-zA-Z]{1,3}\\s?\\d{1,4}\\s?[a-zA-Z]?$',
    flags: 'i',
    htmlPattern: '^[A-Za-z]{1,3}\\s?\\d{1,4}\\s?[A-Za-z]?$',
    formatOnlyWarning: 'Validates standard civilian plate format. Special plates (Putrajaya, Patriot, diplomatic, taxi) have distinct rules.',
    sentence: '1 to 3 state letters, optional space, 1 to 4 digits, optional space, and an optional trailing suffix letter.',
    tokens: [
      { raw: '^', meaning: 'Beginning of plate.', category: 'anchor' },
      { raw: '[a-zA-Z]{1,3}', meaning: '1 to 3 state/territory prefix letters (e.g. W, B, V, J, VAG).', category: 'charset' },
      { raw: '\\s?', meaning: 'Optional space separator.', category: 'quantifier' },
      { raw: '\\d{1,4}', meaning: '1 to 4 registration number digits.', category: 'quantifier' },
      { raw: '\\s?', meaning: 'Optional space separator.', category: 'quantifier' },
      { raw: '[a-zA-Z]?', meaning: 'Optional single suffix letter (e.g. A in W 1234 A).', category: 'charset' },
      { raw: '$', meaning: 'End of vehicle plate.', category: 'anchor' },
    ],
    validExamples: [
      'W 1234 A',
      'VAG 888',
      'BMT 4321',
      'J9999',
    ],
    invalidExamples: [
      '1234 W',     // Numbers first
      'ABCD 1234',  // 4 prefix letters
      'W 12345',    // 5 digits
      'W-1234-A',   // Hyphens not used in JPJ plates
    ],
    htmlSnippet: `<label for="plate">Nombor Pendaftaran Kenderaan</label>
<input 
  type="text" 
  id="plate" 
  name="plate" 
  pattern="^[A-Za-z]{1,3}\\s?\\d{1,4}\\s?[A-Za-z]?$" 
  placeholder="Contoh: VAG 888 atau W 1234 A" 
  style="text-transform: uppercase" 
  required 
/>`,
    jsSnippet: `const platePattern = /^[a-zA-Z]{1,3}\\s?\\d{1,4}\\s?[a-zA-Z]?$/i;
function normalizePlate(val) {
  if (!platePattern.test(val.trim())) return null;
  return val.trim().toUpperCase().replace(/\\s+/g, ' ');
}`,
  },

  {
    id: 'my-landline-phone',
    title: 'Malaysian Landline Number',
    category: 'malaysia',
    difficulty: 'Beginner',
    summary: 'Matches Malaysian fixed-line numbers (e.g. 03-89212000 KL/Selangor, 04-6533888 Penang, 082-123456 Sarawak).',
    source: '^0[3-9]\\d?-?\\d{6,8}$',
    flags: '',
    htmlPattern: '^0[3-9]\\d?-?\\d{6,8}$',
    formatOnlyWarning: 'Validates area code (03-09, 082-089) and digit count. Does not test active line connection.',
    sentence: 'Starts with 0, followed by area code digits 3 to 9 (with optional 3rd digit for Sabah/Sarawak), an optional hyphen, and 6 to 8 subscriber digits.',
    tokens: [
      { raw: '^', meaning: 'Start of line.', category: 'anchor' },
      { raw: '0[3-9]\\d?', meaning: 'Area code: 03 (KL/Selangor), 04 (Penang/Perlis/Kedah), 05 (Perak), 06 (Melaka/NS), 07 (Johor), 09 (East Coast), or 08x (Sabah/Sarawak).', category: 'charset' },
      { raw: '-?', meaning: 'Optional hyphen separator.', category: 'quantifier' },
      { raw: '\\d{6,8}', meaning: '6 to 8 digits for the local telephone number.', category: 'quantifier' },
      { raw: '$', meaning: 'End of string.', category: 'anchor' },
    ],
    validExamples: [
      '03-89212000',
      '04-6533888',
      '07-5533333',
      '082-123456',
    ],
    invalidExamples: [
      '02-1234567',  // 02 is Singapore/unassigned
      '03-12',       // Too short
      '03-12345678901', // Too long
      '89212000',    // Missing area code 03
    ],
    htmlSnippet: `<label for="landline">Nombor Telefon Pejabat / Rumah (Landline)</label>
<input 
  type="tel" 
  id="landline" 
  name="landline" 
  pattern="^0[3-9]\\d?-?\\d{6,8}$" 
  placeholder="03-89212000" 
/>`,
    jsSnippet: `const landlineRegex = /^0[3-9]\\d?-?\\d{6,8}$/;
console.log(landlineRegex.test('03-89212000')); // true`,
  },

  // ==========================================
  // WEB FORM VALIDATION EXAMPLES
  // ==========================================
  {
    id: 'email-address',
    title: 'Standard Email Address',
    category: 'web-forms',
    difficulty: 'Intermediate',
    summary: 'Practical RFC 5322 compatible email validation pattern for web registration forms.',
    source: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    htmlPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    formatOnlyWarning: 'Validates standard syntax only. The only way to guarantee an email is genuine is to send a verification token or magic link to the inbox.',
    sentence: 'Matches username (letters, digits, dots, pluses), an "@" symbol, a domain name, and a top-level domain of at least 2 letters.',
    tokens: [
      { raw: '^', meaning: 'Start of email string.', category: 'anchor' },
      { raw: '[a-zA-Z0-9._%+-]+', meaning: 'One or more characters allowed in the email local part (letters, numbers, dot, underscore, percent, plus, hyphen).', category: 'charset' },
      { raw: '@', meaning: 'Literal "@" symbol separating username from host domain.', category: 'literal' },
      { raw: '[a-zA-Z0-9.-]+', meaning: 'Domain name with letters, numbers, hyphens, and dots.', category: 'charset' },
      { raw: '\\.', meaning: 'Literal dot preceding the top-level domain.', category: 'literal' },
      { raw: '[a-zA-Z]{2,}', meaning: 'Top-level domain (TLD) consisting of at least 2 alphabetic characters (e.g. com, my, edu.my, org).', category: 'quantifier' },
      { raw: '$', meaning: 'End of email string.', category: 'anchor' },
    ],
    validExamples: [
      'azlan@politeknik.edu.my',
      'student.2024@gmail.com',
      'contact-us+support@mycompany.com.my',
      'user_123@sub.domain.org',
    ],
    invalidExamples: [
      'plainaddress',          // Missing @ and domain
      '@missingusername.com',  // Missing username
      'azlan@domain',          // Missing TLD
      'azlan@domain.c',        // TLD must be at least 2 chars
    ],
    htmlSnippet: `<label for="email">Alamat Emel (Email Address)</label>
<input 
  type="email" 
  id="email" 
  name="email" 
  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" 
  placeholder="pelajar@politeknik.edu.my" 
  required 
/>`,
    jsSnippet: `const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
function validateEmail(email) {
  return emailPattern.test(email.trim());
}`,
  },

  {
    id: 'person-name',
    title: 'Person Name (With Titles & Bin/Binti)',
    category: 'web-forms',
    difficulty: 'Beginner',
    summary: 'Accepts letters, spaces, hyphens, and single quotes for Malaysian and international names.',
    source: "^[a-zA-Z\\s'\\-@/.]+$",
    flags: '',
    htmlPattern: "^[a-zA-Z\\s'\\-@/.]+$",
    formatOnlyWarning: 'Validates characters only. Real names can contain accents, diacritics, and culturally diverse spellings.',
    sentence: 'Allows only uppercase and lowercase letters, spaces, apostrophes, hyphens, slashes, and dots (2 to 60 chars recommended).',
    tokens: [
      { raw: '^', meaning: 'Start of name string.', category: 'anchor' },
      { raw: "[a-zA-Z\\s'\\-@/.]+", meaning: 'Allowed characters: English letters, whitespace, single quote (for O\'Connor), hyphen, and abbreviation dots.', category: 'charset' },
      { raw: '$', meaning: 'End of name string.', category: 'anchor' },
    ],
    validExamples: [
      'Mohd Azlan bin Abdullah',
      'Nurul Izzah binti Ahmad',
      "Tan Sri Michelle Yeoh",
      'S. Samy Vellu',
    ],
    invalidExamples: [
      'Azlan123',      // Contains numbers
      'Ahmad <script>', // Dangerous HTML tags
      'Siti *#@$',     // Special characters
      '123456',        // All digits
    ],
    htmlSnippet: `<label for="fullname">Nama Penuh (Seperti Dalam Kad Pengenalan)</label>
<input 
  type="text" 
  id="fullname" 
  name="fullname" 
  pattern="^[a-zA-Z\\s'\\-@/.]+$" 
  minlength="3" 
  maxlength="80" 
  placeholder="Contoh: Muhammad Ali bin Abu" 
  required 
/>`,
    jsSnippet: `const namePattern = /^[a-zA-Z\\s'\\-@/.]+$/;
if (!namePattern.test(name.trim())) {
  alert('Nama tidak boleh mengandungi nombor atau simbol khas');
}`,
  },

  {
    id: 'username-slug',
    title: 'Web Username / Handle',
    category: 'web-forms',
    difficulty: 'Beginner',
    summary: 'Strict alphanumeric username starting with a letter, 4 to 20 characters.',
    source: '^[a-zA-Z][a-zA-Z0-9_]{3,19}$',
    flags: '',
    htmlPattern: '^[a-zA-Z][a-zA-Z0-9_]{3,19}$',
    formatOnlyWarning: 'Checks username syntax. You still need to query your database to confirm whether the username is already taken.',
    sentence: 'Starts with an alphabet letter, followed by 3 to 19 letters, digits, or underscores (total 4 to 20 chars).',
    tokens: [
      { raw: '^', meaning: 'Start of username.', category: 'anchor' },
      { raw: '[a-zA-Z]', meaning: 'Must begin with an alphabetic letter (no leading numbers or underscores).', category: 'charset' },
      { raw: '[a-zA-Z0-9_]{3,19}', meaning: 'Between 3 and 19 characters containing letters, numbers, or underscores.', category: 'quantifier' },
      { raw: '$', meaning: 'End of username.', category: 'anchor' },
    ],
    validExamples: [
      'azlan_dev',
      'sifu_coder24',
      'cyberStudent',
      'd1t_master',
    ],
    invalidExamples: [
      '123azlan',   // Starts with a number
      '_under',     // Starts with underscore
      'az',         // Too short (< 4 chars)
      'azlan-space-user', // Hyphens not permitted in this rule
    ],
    htmlSnippet: `<label for="username">Nama Pengguna (Username)</label>
<input 
  type="text" 
  id="username" 
  name="username" 
  pattern="^[a-zA-Z][a-zA-Z0-9_]{3,19}$" 
  placeholder="contoh: azlan_dev" 
  required 
/>
<small>4-20 aksara, mesti bermula dengan huruf, hanya huruf/angka/garis bawah.</small>`,
    jsSnippet: `const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
const username = document.getElementById('username').value;
if (usernameRegex.test(username)) {
  // Proceed to backend availability check
}`,
  },

  {
    id: 'strong-password',
    title: 'Strong Password Policy',
    category: 'security',
    difficulty: 'Advanced',
    summary: 'Requires at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol (@$!%*?&#^~_-).',
    source: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$',
    flags: '',
    htmlPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$',
    formatOnlyWarning: 'Positive lookaheads enforce complexity. Also check against common password lists (e.g. HaveIBeenPwned API) on the server.',
    sentence: 'Checks with lookaheads for at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (@$!%*?&#^~_-), and minimum 8 chars length.',
    tokens: [
      { raw: '^', meaning: 'Beginning of password string.', category: 'anchor' },
      { raw: '(?=.*[a-z])', meaning: 'Positive lookahead: asserts at least one lowercase letter exists anywhere in string.', category: 'group' },
      { raw: '(?=.*[A-Z])', meaning: 'Positive lookahead: asserts at least one uppercase letter exists.', category: 'group' },
      { raw: '(?=.*\\d)', meaning: 'Positive lookahead: asserts at least one numeric digit exists.', category: 'group' },
      { raw: '(?=.*[@$!%*?&#^~_-])', meaning: 'Positive lookahead: asserts at least one special symbol (@$!%*?&#^~_-) exists.', category: 'group' },
      { raw: '[A-Za-z\\d@$!%*?&#^~_-]{8,}', meaning: 'Matches 8 or more allowed characters.', category: 'quantifier' },
      { raw: '$', meaning: 'End of password string.', category: 'anchor' },
    ],
    validExamples: [
      'P@ssw0rd2024',
      'SifuCyber!99',
      'K@jang43000#',
      'M@yBank#2025',
    ],
    invalidExamples: [
      'password123',  // Missing uppercase and special symbol
      'PASSWORD123!', // Missing lowercase
      'Pass!',        // Too short (under 8 chars)
      'PassWord1234', // Missing special character
    ],
    htmlSnippet: `<label for="password">Kata Laluan (Strong Password)</label>
<input 
  type="password" 
  id="password" 
  name="password" 
  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$" 
  required 
/>
<small>Sekurang-kurangnya 8 aksara: 1 huruf besar, 1 huruf kecil, 1 nombor, 1 simbol khas.</small>`,
    jsSnippet: `const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$/;
function checkPasswordStrength(pw) {
  return strongPasswordRegex.test(pw);
}`,
  },

  {
    id: 'url-validation',
    title: 'Website URL (HTTP / HTTPS)',
    category: 'files-urls',
    difficulty: 'Intermediate',
    summary: 'Matches valid web URLs starting with http:// or https:// with hostname and optional path.',
    source: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$',
    flags: '',
    htmlPattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$',
    formatOnlyWarning: 'Validates URL syntax. Does not make a network HTTP HEAD/GET request to test if the server actually responds.',
    sentence: 'Requires http:// or https://, followed by an optional www., a valid domain name with TLD, and optional URL path/query parameters.',
    tokens: [
      { raw: '^', meaning: 'Beginning of URL string.', category: 'anchor' },
      { raw: 'https?:\\/\\/', meaning: 'Matches "http://" or "https://". The "?" makes the "s" optional.', category: 'literal' },
      { raw: '(?:www\\.)?', meaning: 'Optional "www." subdomain.', category: 'group' },
      { raw: '[-a-zA-Z0-9@:%._+~#=]{1,256}', meaning: 'Domain name characters up to 256 characters.', category: 'charset' },
      { raw: '\\.', meaning: 'Literal dot before top-level domain.', category: 'literal' },
      { raw: '[a-zA-Z0-9()]{1,6}\\b', meaning: 'Top-level domain (com, org, edu, my).', category: 'quantifier' },
      { raw: '(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)', meaning: 'Optional path, query strings, and hashes.', category: 'group' },
      { raw: '$', meaning: 'End of URL string.', category: 'anchor' },
    ],
    validExamples: [
      'https://www.politeknik.edu.my',
      'https://portal.politeknik.edu.my/login',
      'https://github.com/mohdazlan/servestud?tab=readme',
      'https://regexr.com',
    ],
    invalidExamples: [
      'ftp://files.example.com', // Protocol not http/https
      'www.google.com',         // Missing http:// or https://
      'https://',               // Incomplete URL
      'javascript:alert(1)',    // XSS pseudo-protocol
    ],
    htmlSnippet: `<label for="website">Laman Web Projek (Project URL)</label>
<input 
  type="url" 
  id="website" 
  name="website" 
  pattern="^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$" 
  placeholder="https://example.com" 
  required 
/>`,
    jsSnippet: `const urlPattern = /^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
if (urlPattern.test(url)) {
  console.log('Valid HTTP/HTTPS URL format');
}`,
  },

  {
    id: 'date-dd-mm-yyyy',
    title: 'Date in DD/MM/YYYY Format',
    category: 'numbers-dates',
    difficulty: 'Intermediate',
    summary: 'Matches dates formatted as DD/MM/YYYY with basic day (01-31) and month (01-12) validation.',
    source: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$',
    flags: '',
    htmlPattern: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$',
    formatOnlyWarning: 'Validates calendar number ranges. To verify leap years (e.g. 29/02 in non-leap year) or month length (31/04), use JavaScript Date parsing.',
    sentence: 'Two digits for day (01-31), slash, two digits for month (01-12), slash, and 4 digits for year.',
    tokens: [
      { raw: '^', meaning: 'Start of date string.', category: 'anchor' },
      { raw: '(0[1-9]|[12][0-9]|3[01])', meaning: 'Matches valid calendar days: 01-09, 10-29, or 30-31.', category: 'group' },
      { raw: '\\/', meaning: 'Literal forward slash separator.', category: 'literal' },
      { raw: '(0[1-9]|1[0-2])', meaning: 'Matches valid calendar months: 01-09 or 10-12.', category: 'group' },
      { raw: '\\/', meaning: 'Literal forward slash separator.', category: 'literal' },
      { raw: '\\d{4}', meaning: '4 digits for the year (e.g. 2024).', category: 'quantifier' },
      { raw: '$', meaning: 'End of date string.', category: 'anchor' },
    ],
    validExamples: [
      '31/08/1957', // Hari Merdeka
      '16/09/1963', // Hari Malaysia
      '01/01/2025',
      '28/02/2024',
    ],
    invalidExamples: [
      '32/01/2024', // Day 32 does not exist
      '15/13/2024', // Month 13 does not exist
      '5/8/2024',   // Must have leading zeroes (05/08)
      '2024-08-31', // Wrong separator / order
    ],
    htmlSnippet: `<label for="dob">Tarikh Lahir (DD/MM/YYYY)</label>
<input 
  type="text" 
  id="dob" 
  name="dob" 
  pattern="^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$" 
  placeholder="31/08/1957" 
  required 
/>`,
    jsSnippet: `const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$/;
function isValidCalendarDate(str) {
  if (!dateRegex.test(str)) return false;
  const [d, m, y] = str.split('/').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}`,
  },

  {
    id: 'time-24-hour',
    title: '24-Hour Time Format (HH:MM)',
    category: 'numbers-dates',
    difficulty: 'Beginner',
    summary: 'Matches 24-hour military/system time from 00:00 to 23:59.',
    source: '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
    flags: '',
    htmlPattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
    formatOnlyWarning: 'Validates 24-hour clock notation. Does not include seconds or timezone offsets.',
    sentence: 'Hours from 00 to 23, colon, and minutes from 00 to 59.',
    tokens: [
      { raw: '^', meaning: 'Beginning of time string.', category: 'anchor' },
      { raw: '(?:[01]\\d|2[0-3])', meaning: 'Hours: 00-19 (01\\d) or 20-23 (2[0-3]).', category: 'group' },
      { raw: ':', meaning: 'Literal colon separator.', category: 'literal' },
      { raw: '[0-5]\\d', meaning: 'Minutes: 00 to 59 (first digit 0-5, second digit 0-9).', category: 'charset' },
      { raw: '$', meaning: 'End of time string.', category: 'anchor' },
    ],
    validExamples: [
      '08:30',
      '14:00',
      '23:59',
      '00:00',
    ],
    invalidExamples: [
      '24:00', // 24 is invalid (should be 00:00)
      '12:60', // Minute 60 is invalid
      '8:30',  // Missing leading zero
      '12:30 PM', // 12-hour format with AM/PM
    ],
    htmlSnippet: `<label for="lecture_time">Masa Kuliah (24 Jam)</label>
<input 
  type="text" 
  id="lecture_time" 
  name="lecture_time" 
  pattern="^(?:[01]\\d|2[0-3]):[0-5]\\d$" 
  placeholder="14:30" 
  required 
/>`,
    jsSnippet: `const timePattern = /^(?:[01]\\d|2[0-3]):[0-5]\\d$/;
console.log(timePattern.test('14:30')); // true`,
  },

  {
    id: 'hex-color',
    title: 'CSS Hex Colour Code',
    category: 'web-forms',
    difficulty: 'Beginner',
    summary: 'Matches 3, 6, or 8 digit CSS hex colours with leading hash (#FFF, #00F0FF, #12345678).',
    source: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$',
    flags: '',
    htmlPattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$',
    formatOnlyWarning: 'Validates hexadecimal colour syntax. Does not convert colour models (e.g. RGB/HSL/OKLCH).',
    sentence: 'Starts with #, followed by 3, 6, or 8 hexadecimal digits (0-9, A-F).',
    tokens: [
      { raw: '^', meaning: 'Start of hex code.', category: 'anchor' },
      { raw: '#', meaning: 'Literal hash symbol.', category: 'literal' },
      { raw: '([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})', meaning: 'Matches 6 digits (#RRGGBB), 3 digits (#RGB), or 8 digits (#RRGGBBAA).', category: 'group' },
      { raw: '$', meaning: 'End of hex code.', category: 'anchor' },
    ],
    validExamples: [
      '#00f0ff',
      '#FFF',
      '#1E293B',
      '#000000FF',
    ],
    invalidExamples: [
      '00f0ff',   // Missing leading #
      '#GG1234',  // Letter G is not hexadecimal
      '#1234',    // 4 digits (standard CSS is 3, 6 or 8)
      '#12345',   // 5 digits
    ],
    htmlSnippet: `<label for="theme_color">Warna Tema (Hex Code)</label>
<input 
  type="text" 
  id="theme_color" 
  name="theme_color" 
  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$" 
  placeholder="#00f0ff" 
  required 
/>`,
    jsSnippet: `const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
console.log(hexColorRegex.test('#22d3ee')); // true`,
  },

  {
    id: 'image-filename',
    title: 'Image Filename Extension',
    category: 'files-urls',
    difficulty: 'Beginner',
    summary: 'Matches image filenames ending with .jpg, .jpeg, .png, .gif, .webp, or .svg.',
    source: '^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$',
    flags: 'i',
    htmlPattern: '^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$',
    formatOnlyWarning: 'Validates filename extension string. Server-side validation MUST check file MIME types and magic bytes (file signature), as extensions can be faked.',
    sentence: 'One or more filename characters followed by a dot and an image extension (jpg, jpeg, png, gif, webp, svg).',
    tokens: [
      { raw: '^', meaning: 'Start of filename.', category: 'anchor' },
      { raw: '[a-zA-Z0-9_-]+', meaning: 'Safe filename characters (letters, numbers, underscores, hyphens).', category: 'charset' },
      { raw: '\\.', meaning: 'Literal dot separator.', category: 'literal' },
      { raw: '(jpe?g|png|gif|webp|svg)', meaning: 'Allowed extension alternatives (jpe?g matches jpg or jpeg).', category: 'group' },
      { raw: '$', meaning: 'End of filename.', category: 'anchor' },
    ],
    validExamples: [
      'profile-picture.png',
      'banner_2024.jpg',
      'logo.svg',
      'hero.webp',
    ],
    invalidExamples: [
      'resume.pdf',       // PDF is not an image
      'script.js',        // Executable script
      '.png',             // Missing filename before dot
      'image.png.exe',    // Malicious double extension
    ],
    htmlSnippet: `<label for="avatar">Nama Fail Gambar (Image File)</label>
<input 
  type="text" 
  id="avatar" 
  name="avatar" 
  pattern="^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$" 
  placeholder="avatar.png" 
  required 
/>`,
    jsSnippet: `const imagePattern = /^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$/i;
function isImageFile(filename) {
  return imagePattern.test(filename);
}`,
  },

  {
    id: 'integer-only',
    title: 'Integer Number (Positive or Negative)',
    category: 'numbers-dates',
    difficulty: 'Beginner',
    summary: 'Matches whole integers with an optional plus or minus sign.',
    source: '^[+-]?\\d+$',
    flags: '',
    htmlPattern: '^[+-]?\\d+$',
    formatOnlyWarning: 'Checks digits only. If converting to an integer in JS, check for overflow (Number.isSafeInteger).',
    sentence: 'Optional plus or minus sign, followed by one or more numeric digits.',
    tokens: [
      { raw: '^', meaning: 'Start of number.', category: 'anchor' },
      { raw: '[+-]?', meaning: 'Optional sign: positive (+) or negative (-).', category: 'charset' },
      { raw: '\\d+', meaning: 'One or more numeric digits (0-9).', category: 'quantifier' },
      { raw: '$', meaning: 'End of number.', category: 'anchor' },
    ],
    validExamples: [
      '42',
      '-15',
      '+100',
      '0',
    ],
    invalidExamples: [
      '42.5',   // Decimals not allowed
      '12a',    // Contains letter
      '--',     // Invalid double sign
      '',       // Empty string
    ],
    htmlSnippet: `<input type="text" pattern="^[+-]?\\d+$" placeholder="Nombor bulat (cth: 42)" required />`,
    jsSnippet: `const intRegex = /^[+-]?\\d+$/;
console.log(intRegex.test('-42')); // true`,
  },

  {
    id: 'decimal-number',
    title: 'Decimal Number (Floating Point)',
    category: 'numbers-dates',
    difficulty: 'Beginner',
    summary: 'Matches decimal numbers with optional fractional part (e.g. 3.14 or 0.05).',
    source: '^[+-]?\\d+(?:\\.\\d+)?$',
    flags: '',
    htmlPattern: '^[+-]?\\d+(?:\\.\\d+)?$',
    formatOnlyWarning: 'Validates floating point notation. Decimal inputs should use inputmode="decimal" on mobile.',
    sentence: 'Optional sign, whole digits, and an optional decimal point with trailing digits.',
    tokens: [
      { raw: '^', meaning: 'Start of decimal.', category: 'anchor' },
      { raw: '[+-]?', meaning: 'Optional plus or minus sign.', category: 'charset' },
      { raw: '\\d+', meaning: 'One or more whole number digits.', category: 'quantifier' },
      { raw: '(?:\\.\\d+)?', meaning: 'Optional group: decimal point followed by one or more decimal digits.', category: 'group' },
      { raw: '$', meaning: 'End of decimal.', category: 'anchor' },
    ],
    validExamples: [
      '3.14159',
      '0.05',
      '-99.9',
      '100',
    ],
    invalidExamples: [
      '3.',     // Missing digits after decimal point
      '.5',     // Missing leading digit (in this strict pattern)
      '3.14.2', // Double decimal points
      'abc',    // Not a number
    ],
    htmlSnippet: `<input type="text" pattern="^[+-]?\\d+(?:\\.\\d+)?$" placeholder="3.14" required />`,
    jsSnippet: `const decRegex = /^[+-]?\\d+(?:\\.\\d+)?$/;
console.log(decRegex.test('3.14')); // true`,
  },

  // ==========================================
  // BEGINNER BASICS & SYNTAX ATOMS
  // ==========================================
  {
    id: 'numbers-only',
    title: 'Numbers Only (Digits 0-9)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Requires the string to contain strictly numeric digits and nothing else.',
    source: '^\\d+$',
    flags: '',
    htmlPattern: '^\\d+$',
    formatOnlyWarning: 'Validates digit characters. For credit cards or bank accounts, Luhn algorithm or checksum is also required.',
    sentence: 'Matches one or more digits from start to finish.',
    tokens: [
      { raw: '^', meaning: 'Start of input.', category: 'anchor' },
      { raw: '\\d+', meaning: 'One or more digits (shorthand for [0-9]).', category: 'quantifier' },
      { raw: '$', meaning: 'End of input.', category: 'anchor' },
    ],
    validExamples: ['123', '007', '999999', '0'],
    invalidExamples: ['123a', ' 123', '12.3', 'one'],
    htmlSnippet: `<input type="text" pattern="^\\d+$" inputmode="numeric" placeholder="Nombor sahaja" required />`,
    jsSnippet: `const numbersOnly = /^\\d+$/;`,
  },

  {
    id: 'letters-only',
    title: 'Letters Only (A-Z, a-z)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Accepts English alphabetic characters only (no numbers, spaces, or symbols).',
    source: '^[a-zA-Z]+$',
    flags: '',
    htmlPattern: '^[a-zA-Z]+$',
    formatOnlyWarning: 'Only matches Latin ASCII letters. Does not match accented characters (é, ü) or non-Latin scripts.',
    sentence: 'Requires one or more uppercase or lowercase English letters.',
    tokens: [
      { raw: '^', meaning: 'Start of string.', category: 'anchor' },
      { raw: '[a-zA-Z]+', meaning: 'Character set matching a through z (lowercase) and A through Z (uppercase), one or more times.', category: 'charset' },
      { raw: '$', meaning: 'End of string.', category: 'anchor' },
    ],
    validExamples: ['Malaysia', 'Sifu', 'Cyber', 'Code'],
    invalidExamples: ['Malaysia Boleh', 'Sifu123', 'Hi!', ''],
    htmlSnippet: `<input type="text" pattern="^[a-zA-Z]+$" placeholder="Huruf sahaja" required />`,
    jsSnippet: `const lettersOnly = /^[a-zA-Z]+$/;`,
  },

  {
    id: 'letters-and-spaces',
    title: 'Letters and Spaces',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Allows alphabetic letters and blank spaces (common for names and titles).',
    source: '^[a-zA-Z\\s]+$',
    flags: '',
    htmlPattern: '^[a-zA-Z\\s]+$',
    formatOnlyWarning: 'Allows spaces anywhere. Consider trimming leading and trailing spaces before testing.',
    sentence: 'Accepts only letters and whitespace characters.',
    tokens: [
      { raw: '^', meaning: 'Start of string.', category: 'anchor' },
      { raw: '[a-zA-Z\\s]+', meaning: 'Character set matching letters A-Z, a-z, or whitespace (\\s).', category: 'charset' },
      { raw: '$', meaning: 'End of string.', category: 'anchor' },
    ],
    validExamples: ['Kuala Lumpur', 'Politeknik Sultan Idris Shah', 'John Doe', 'Hello World'],
    invalidExamples: ['KL123', 'Hello, World!', 'User#1', '123'],
    htmlSnippet: `<input type="text" pattern="^[a-zA-Z\\s]+$" placeholder="Huruf dan ruang" required />`,
    jsSnippet: `const lettersAndSpaces = /^[a-zA-Z\\s]+$/;`,
  },

  {
    id: 'exact-word',
    title: 'Exact Word Match',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Matches exactly the word "MERDEKA" and rejects anything else.',
    source: '^MERDEKA$',
    flags: '',
    htmlPattern: '^MERDEKA$',
    formatOnlyWarning: 'Case-sensitive exact match. Add the "i" flag if case insensitivity is desired.',
    sentence: 'Matches exactly the 7 letters "M-E-R-D-E-K-A" with no extra characters.',
    tokens: [
      { raw: '^', meaning: 'Start of input.', category: 'anchor' },
      { raw: 'MERDEKA', meaning: 'Literal string "MERDEKA".', category: 'literal' },
      { raw: '$', meaning: 'End of input.', category: 'anchor' },
    ],
    validExamples: ['MERDEKA'],
    invalidExamples: ['merdeka', 'MERDEKA!', ' Selamat MERDEKA', 'MERDEKA 1957'],
    htmlSnippet: `<input type="text" pattern="^MERDEKA$" placeholder="Taip: MERDEKA" required />`,
    jsSnippet: `const exactWord = /^MERDEKA$/;`,
  },

  {
    id: 'contains-word',
    title: 'Contains a Specific Word',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Checks if the sentence contains the word "student" as a distinct word boundary.',
    source: '\\bstudent\\b',
    flags: 'i',
    htmlPattern: '.*\\bstudent\\b.*',
    formatOnlyWarning: 'Uses word boundary \\b. Note: In HTML input pattern, the browser implicitly wraps the pattern in ^(?:...)$, so .* is required in HTML.',
    sentence: 'Searches anywhere in the text for the whole word "student" separated by word boundaries.',
    tokens: [
      { raw: '\\b', meaning: 'Word boundary anchor (prevents matching inside words like "unstudentlike").', category: 'anchor' },
      { raw: 'student', meaning: 'Literal letters s-t-u-d-e-n-t.', category: 'literal' },
      { raw: '\\b', meaning: 'Word boundary anchor.', category: 'anchor' },
    ],
    validExamples: ['I am a student here', 'Hello student!', 'Student registration', 'Good morning, student.'],
    invalidExamples: ['I am studying', 'students', 'studenthood', 'stud'],
    htmlSnippet: `<input type="text" pattern=".*\\bstudent\\b.*" placeholder="Mesti ada perkataan student" required />`,
    jsSnippet: `const containsWord = /\\bstudent\\b/i;`,
  },

  {
    id: 'starts-with',
    title: 'Starts With Prefix (^)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Demonstrates the start-of-string anchor (^). Matches any string beginning with "POLI".',
    source: '^POLI',
    flags: '',
    htmlPattern: '^POLI.*',
    formatOnlyWarning: 'In JavaScript RegExp without $, this matches as long as the beginning matches.',
    sentence: 'Requires the string to begin with the exact characters "POLI".',
    tokens: [
      { raw: '^', meaning: 'Start-of-string anchor.', category: 'anchor' },
      { raw: 'POLI', meaning: 'Literal string "POLI".', category: 'literal' },
    ],
    validExamples: ['POLITEKNIK', 'POLIS', 'POLI2024', 'POLI'],
    invalidExamples: ['DI POLITEKNIK', 'MYPOLI', 'poli', '123POLI'],
    htmlSnippet: `<input type="text" pattern="^POLI.*" placeholder="Mula dengan POLI" required />`,
    jsSnippet: `const startsWithPoli = /^POLI/;`,
  },

  {
    id: 'ends-with',
    title: 'Ends With Suffix ($)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Demonstrates the end-of-string anchor ($). Matches any string ending with ".my".',
    source: '\\.my$',
    flags: '',
    htmlPattern: '.*\\.my$',
    formatOnlyWarning: 'In JavaScript RegExp without ^, matches any text ending with .my.',
    sentence: 'Requires the string to conclude with a literal dot followed by "my".',
    tokens: [
      { raw: '\\.', meaning: 'Escaped literal dot (unescaped dot matches ANY character).', category: 'literal' },
      { raw: 'my', meaning: 'Literal characters "m" and "y".', category: 'literal' },
      { raw: '$', meaning: 'End-of-string anchor.', category: 'anchor' },
    ],
    validExamples: ['politeknik.edu.my', 'malaysia.gov.my', 'shopee.com.my', 'test.my'],
    invalidExamples: ['mysite.com', 'politeknik.my.org', 'testmy', 'malaysia.my/home'],
    htmlSnippet: `<input type="text" pattern=".*\\.my$" placeholder="Tamat dengan .my" required />`,
    jsSnippet: `const endsWithMy = /\\.my$/;`,
  },

  {
    id: 'fixed-length',
    title: 'Fixed Length Exact Count ({n})',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Requires exactly 6 uppercase letters, demonstrating the {n} quantifier.',
    source: '^[A-Z]{6}$',
    flags: '',
    htmlPattern: '^[A-Z]{6}$',
    formatOnlyWarning: 'Enforces exact length. Excellent for promo codes, OTPs, or department abbreviations.',
    sentence: 'Must contain exactly 6 uppercase English letters from start to finish.',
    tokens: [
      { raw: '^', meaning: 'Start of string.', category: 'anchor' },
      { raw: '[A-Z]', meaning: 'Uppercase letter character set.', category: 'charset' },
      { raw: '{6}', meaning: 'Exact repetition quantifier: exactly 6 times.', category: 'quantifier' },
      { raw: '$', meaning: 'End of string.', category: 'anchor' },
    ],
    validExamples: ['MALAYS', 'KODPRO', 'SYSTEM', 'PASWOD'],
    invalidExamples: ['MALAY', 'MALAYSIA', 'malays', 'M12345'],
    htmlSnippet: `<input type="text" pattern="^[A-Z]{6}$" maxlength="6" placeholder="6 HURUF BESAR" required />`,
    jsSnippet: `const sixUpperLetters = /^[A-Z]{6}$/;`,
  },

  {
    id: 'min-length',
    title: 'Minimum Length ({n,})',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Requires at least 8 characters of any non-whitespace, demonstrating {n,}.',
    source: '^\\S{8,}$',
    flags: '',
    htmlPattern: '^\\S{8,}$',
    formatOnlyWarning: 'Ensures no spaces and minimum character count.',
    sentence: 'At least 8 non-whitespace characters from start to end.',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: '\\S{8,}', meaning: 'Any non-whitespace character (\\S) repeated 8 or more times ({8,}).', category: 'quantifier' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['12345678', 'securePassword!', 'mySecretKey123', 'abcdefghij'],
    invalidExamples: ['short', '1234567', 'pass word', ''],
    htmlSnippet: `<input type="text" pattern="^\\S{8,}$" minlength="8" placeholder="Sekurang-kurangnya 8 aksara" required />`,
    jsSnippet: `const minEightChars = /^\\S{8,}$/;`,
  },

  {
    id: 'optional-character',
    title: 'Optional Character (?)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Demonstrates the question mark quantifier (?) matching zero or one occurrence (e.g. colour vs color).',
    source: '^colou?r$',
    flags: '',
    htmlPattern: '^colou?r$',
    formatOnlyWarning: 'The ? affects only the token immediately preceding it ("u" in this case).',
    sentence: 'Matches "color" (without u) or "colour" (with u).',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: 'colo', meaning: 'Literal letters c-o-l-o.', category: 'literal' },
      { raw: 'u?', meaning: 'Optional letter "u": zero or one time.', category: 'quantifier' },
      { raw: 'r', meaning: 'Literal letter "r".', category: 'literal' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['color', 'colour'],
    invalidExamples: ['colouur', 'colr', 'colourful', 'colors'],
    htmlSnippet: `<input type="text" pattern="^colou?r$" placeholder="color atau colour" required />`,
    jsSnippet: `const optionalRegex = /^colou?r$/;`,
  },

  {
    id: 'one-or-more',
    title: 'One or More Repetition (+)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Demonstrates the plus quantifier (+) requiring at least one occurrence.',
    source: '^go+al$',
    flags: 'i',
    htmlPattern: '^[Gg][Oo]+[Aa][Ll]$',
    formatOnlyWarning: '+ requires at least 1 letter "o". Does not match "gal".',
    sentence: 'Begins with "g", contains one or more letter "o"s, and ends with "al".',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: 'g', meaning: 'Literal "g".', category: 'literal' },
      { raw: 'o+', meaning: 'Letter "o" repeated 1 or more times.', category: 'quantifier' },
      { raw: 'al', meaning: 'Literal "al".', category: 'literal' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['goal', 'gooal', 'goooooal', 'GOAL'],
    invalidExamples: ['gal', 'gol', 'goals', 'my goal'],
    htmlSnippet: `<input type="text" pattern="^[Gg][Oo]+[Aa][Ll]$" placeholder="goal, gooal, dll" required />`,
    jsSnippet: `const oneOrMore = /^go+al$/i;`,
  },

  {
    id: 'zero-or-more',
    title: 'Zero or More Repetition (*)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Demonstrates the asterisk quantifier (*) matching 0, 1, or many occurrences.',
    source: '^ab*c$',
    flags: '',
    htmlPattern: '^ab*c$',
    formatOnlyWarning: '* allows zero occurrences, so "ac" is valid.',
    sentence: 'Begins with "a", has zero or more "b"s, and ends with "c".',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: 'a', meaning: 'Literal "a".', category: 'literal' },
      { raw: 'b*', meaning: 'Letter "b" repeated 0 or more times.', category: 'quantifier' },
      { raw: 'c', meaning: 'Literal "c".', category: 'literal' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['ac', 'abc', 'abbc', 'abbbbbbc'],
    invalidExamples: ['a', 'b', 'adc', 'abbc1'],
    htmlSnippet: `<input type="text" pattern="^ab*c$" placeholder="ac, abc, abbc..." required />`,
    jsSnippet: `const zeroOrMore = /^ab*c$/;`,
  },

  {
    id: 'either-or-alternation',
    title: 'Either / Or Alternation (|)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Matches one option from a list of choices using the pipe (|) operator.',
    source: '^(Lelaki|Perempuan)$',
    flags: 'i',
    htmlPattern: '^(Lelaki|Perempuan)$',
    formatOnlyWarning: 'Pipe separates choices. Wrap in parentheses ^(A|B)$ to prevent alternation from bleeding to anchors.',
    sentence: 'Matches either the exact word "Lelaki" (Male) or "Perempuan" (Female).',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: '(Lelaki|Perempuan)', meaning: 'Alternation group matching either "Lelaki" OR "Perempuan".', category: 'group' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['Lelaki', 'Perempuan', 'LELAKI', 'perempuan'],
    invalidExamples: ['Lain-lain', 'Boy', 'Girl', 'Lelaki Perempuan'],
    htmlSnippet: `<select name="gender" required>
  <option value="">-- Pilih Jantina --</option>
  <option value="Lelaki">Lelaki</option>
  <option value="Perempuan">Perempuan</option>
</select>`,
    jsSnippet: `const genderRegex = /^(Lelaki|Perempuan)$/i;`,
  },

  {
    id: 'whitespace-matching',
    title: 'Whitespace Matching (\\s)',
    category: 'beginner',
    difficulty: 'Beginner',
    summary: 'Matches whitespace characters including spaces, tabs, and line breaks.',
    source: '^[a-zA-Z]+\\s+[a-zA-Z]+$',
    flags: '',
    htmlPattern: '^[a-zA-Z]+\\s+[a-zA-Z]+$',
    formatOnlyWarning: '\\s matches space (0x20), tab (\\t), newline (\\n), carriage return (\\r), and form feed (\\f).',
    sentence: 'A word of letters, followed by one or more spaces, followed by a second word of letters.',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: '[a-zA-Z]+', meaning: 'First word: letters only.', category: 'charset' },
      { raw: '\\s+', meaning: 'One or more whitespace characters.', category: 'quantifier' },
      { raw: '[a-zA-Z]+', meaning: 'Second word: letters only.', category: 'charset' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['Selamat Pagi', 'Hello World', 'Mohd Azlan', 'Vite React'],
    invalidExamples: ['SingleWord', 'Three Word Phrase', 'Hello123 World', ' '],
    htmlSnippet: `<input type="text" pattern="^[a-zA-Z]+\\s+[a-zA-Z]+$" placeholder="Dua perkataan (cth: Mohd Azlan)" required />`,
    jsSnippet: `const twoWords = /^[a-zA-Z]+\\s+[a-zA-Z]+$/;`,
  },

  {
    id: 'simple-capturing-group',
    title: 'Capturing Group (...)',
    category: 'beginner',
    difficulty: 'Intermediate',
    summary: 'Captures and isolates sub-components of an expression for programmatic extraction.',
    source: '^(\\d{2})-(\\d{2})-(\\d{4})$',
    flags: '',
    htmlPattern: '^(\\d{2})-(\\d{2})-(\\d{4})$',
    formatOnlyWarning: 'Capturing groups allow string.match() or regex.exec() to extract day, month, and year into array indexes [1], [2], and [3].',
    sentence: 'Captures 2 digits for day into group 1, 2 digits for month into group 2, and 4 digits for year into group 3.',
    tokens: [
      { raw: '^', meaning: 'Start anchor.', category: 'anchor' },
      { raw: '(\\d{2})', meaning: 'Capturing group 1: exactly 2 digits (Day).', category: 'group' },
      { raw: '-', meaning: 'Literal dash separator.', category: 'literal' },
      { raw: '(\\d{2})', meaning: 'Capturing group 2: exactly 2 digits (Month).', category: 'group' },
      { raw: '-', meaning: 'Literal dash separator.', category: 'literal' },
      { raw: '(\\d{4})', meaning: 'Capturing group 3: exactly 4 digits (Year).', category: 'group' },
      { raw: '$', meaning: 'End anchor.', category: 'anchor' },
    ],
    validExamples: ['31-08-1957', '16-09-1963', '01-01-2025', '25-12-2024'],
    invalidExamples: ['31/08/1957', '1-8-2024', '31-08-57', 'today'],
    htmlSnippet: `<input type="text" pattern="^(\\d{2})-(\\d{2})-(\\d{4})$" placeholder="DD-MM-YYYY" required />`,
    jsSnippet: `const dateGroupPattern = /^(\\d{2})-(\\d{2})-(\\d{4})$/;
const match = '31-08-1957'.match(dateGroupPattern);
if (match) {
  const [, day, month, year] = match;
  console.log(\`Hari: \${day}, Bulan: \${month}, Tahun: \${year}\`);
}`,
  },
]
