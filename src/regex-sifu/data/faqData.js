/**
 * Frequently Asked Questions & Pedagogical Explanations
 * Addresses the exact points of confusion for introductory web development students.
 */

export const FAQ_ITEMS = [
  {
    question: 'Why does my RegEx pass invalid inputs in JavaScript if I forget ^ and $?',
    answer: `By default, JavaScript's \`RegExp.prototype.test()\` checks if the pattern appears ANYWHERE inside the text.
    
For example, if your pattern is \`/\\d{5}/\` and the user enters \`"abc12345xyz"\`, JavaScript sees 5 digits in the middle and returns \`true\`!

To enforce that the ENTIRE input must match from start to finish, always sandwich your rule between **\`^\`** (beginning) and **\`$\`** (end):
\`\`\`javascript
// ❌ Dangerous (unanchored): accepts "abc12345xyz"
const loosePattern = /\\d{5}/;

// ✅ Safe (anchored): accepts ONLY 5 digits
const strictPattern = /^\\d{5}$/;
\`\`\``,
  },

  {
    question: 'How does HTML5 input pattern differ from JavaScript RegExp?',
    answer: `Modern web browsers automatically wrap the value of the HTML5 \`pattern\` attribute in an implicit start and end anchor (\`^(?:...)$\`).
    
For example, in HTML:
\`\`\`html
<!-- Browser automatically requires the WHOLE value to be 5 digits -->
<input type="text" pattern="\\d{5}" required>
\`\`\`
However, in JavaScript code, you MUST explicitly write \`^\` and \`$\`:
\`\`\`javascript
const regex = /^\\d{5}$/;
\`\`\`
**Pro Tip:** Writing \`^\\d{5}$\` in both HTML and JavaScript keeps your code consistent and prevents beginner confusion!`,
  },

  {
    question: 'Why does a dot (.) match everything, and how do I match a real period / full stop?',
    answer: `In RegEx syntax, an unescaped dot (\`.\`) is a **wildcard metacharacter** that matches almost ANY character (letters, numbers, symbols, spaces).
    
If you want to match an actual literal full stop (like in a filename \`.png\` or an email domain \`.my\`), you MUST escape it with a backslash:
- \`.\` = Any character (matches "a", "9", "@", "!")
- \`\\.\` = Literal period only (matches ".")

Example:
\`\`\`javascript
// ❌ WRONG: matches "photoxpng", "photo9png", "photo.png"
const wrong = /photo.png/;

// ✅ CORRECT: matches ONLY "photo.png"
const correct = /photo\\.png/;
\`\`\``,
  },

  {
    question: 'What is the simple rule to remember the difference between *, +, and ?',
    answer: `These three symbols are **Quantifiers** that repeat the token directly before them:
- **\`?\` (Optional):** 0 or 1 time. Think of it as: *"Maybe it's here, maybe it isn't."* (e.g. \`-?\` allows optional hyphen).
- **\`+\` (Plus / At least one):** 1 or more times. Think of it as: *"Must have at least one!"* (e.g. \`\\d+\` rejects empty strings).
- **\`*\` (Star / Zero or more):** 0, 1, or unlimited times. Think of it as: *"Anything goes, even empty."*

**Watch Out:** Avoid using \`.*\` in form validation because it greedily swallows invalid inputs!`,
  },

  {
    question: 'Can RegEx prove that a Malaysian IC or Handphone number actually exists?',
    answer: `**No!** RegEx is strictly a **format and syntax validator**, not a database or telecommunication checker.
    
- A RegEx can verify that an IC has 12 digits in the 6-2-4 shape (\`040512-10-5432\`).
- But RegEx CANNOT verify whether Jabatan Pendaftaran Negara (JPN) ever issued that IC to a living person.
- Similarly, \`^(?:\\+?60|0)1[0-9]-?\\d{7,8}$\` confirms phone number syntax, but only sending an SMS OTP can verify that the SIM card is turned on and owned by the student.`,
  },

  {
    question: 'Is client-side HTML/JavaScript RegEx enough to secure my web application?',
    answer: `**Never!** Client-side validation is strictly for **User Experience (UX)**—it gives instant, friendly feedback so honest users do not have to wait for a page reload.
    
However, anyone can open browser DevTools, disable JavaScript, or send an HTTP POST request directly using Postman or cURL to bypass your frontend.
    
**The Golden Rule of Web Engineering:**
Always duplicate your validation logic on your backend (Java Servlet, Node.js, Spring Boot, or PHP) before inserting any data into your SQL database.`,
  },
]
