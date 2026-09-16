/**
 * Sifu Coach Pedagogical Rule Engine
 * Deterministic intent-and-template expert system with a clearly defined
 * future AI service boundary. Formats output with worked tokens, tests,
 * HTML/JS code, and essential safety cautions.
 */

export const SUGGESTED_PROMPTS = [
  'Malaysian mobile number',
  'Malaysia IC number',
  'Student email',
  'Matric number',
  'Strong password',
  'Date in DD/MM/YYYY format',
  'Ringgit amount',
  'Image filename',
]

/**
 * Knowledge Base of Intents
 */
const INTENT_CATALOG = [
  {
    id: 'mobile-phone',
    triggers: [
      'mobile', 'phone', 'telefon', 'handphone', 'hp', '01', '+601', 'telco', 'celcom', 'maxis', 'digi', 'whatsapp'
    ],
    title: 'Nombor Telefon Bimbit Malaysia (Malaysian Mobile Phone)',
    recommendedPattern: '^(?:\\+?60|0)1[0-9]-?\\d{7,8}$',
    flags: '',
    explanation: 'Corak ini membenarkan awalan antarabangsa (+601...) atau tempatan (01...), diikuti mana-mana digit telco (cth: 012, 019, 011), tanda sengkang pilihan (-), dan 7 hingga 8 digit baki.',
    tokens: [
      { symbol: '^', meaning: 'Sauh permulaan teks (tiada aksara asing di depan).' },
      { symbol: '(?:\\+?60|0)', meaning: 'Kumpulan pilihan: sama ada "+60", "60", atau "0".' },
      { symbol: '1', meaning: 'Digit tetap 1 (semua kod telefon bimbit Malaysia bermula dengan 1).' },
      { symbol: '[0-9]', meaning: 'Mana-mana digit 0-9 untuk kod telco (010 hingga 019).' },
      { symbol: '-?', meaning: 'Tanda sempang adalah PILIHAN (boleh ada atau tiada).' },
      { symbol: '\\d{7,8}', meaning: '7 digit (untuk 012-3456789) atau 8 digit (untuk 011-12345678).' },
      { symbol: '$', meaning: 'Sauh penamat teks (tiada aksara asing di belakang).' },
    ],
    validExamples: ['012-3456789', '01112345678', '+60198765432', '017-8889999'],
    invalidExamples: ['022-3456789 (Awalan 02 bukan telco Malaysia)', '012-345 (Terlalu pendek)', '012-3456789012 (Terlalu panjang)', 'abc0123456789 (Mengandungi huruf)'],
    htmlCode: `<label for="phone">Nombor Telefon</label>
<input 
  type="tel" 
  id="phone" 
  name="phone" 
  pattern="^(?:\\+?60|0)1[0-9]-?\\d{7,8}$" 
  placeholder="012-3456789" 
  required 
/>`,
    jsCode: `const phonePattern = /^(?:\\+?60|0)1[0-9]-?\\d{7,8}$/;
const inputVal = document.getElementById('phone').value.trim();

if (phonePattern.test(inputVal)) {
  console.log('Format nombor telefon sah');
} else {
  alert('Format nombor telefon tidak sah. Contoh sah: 012-3456789');
}`,
    realWorldWarning: 'PENTING: Semakan RegEx hanya mengesahkan struktur format digit. Ia TIDAK membuktikan nombor ini aktif atau dimiliki orang sebenar. Untuk pengesahan pemilikan, hantar kod OTP melalui SMS.',
    predictionChallenge: {
      candidate: '011-98765432',
      willMatch: true,
      reason: '011 mempunyai 8 digit selepas sempang (total 11 digit), yang sah mengikut \\d{7,8}.',
    },
  },

  {
    id: 'my-ic',
    triggers: ['ic', 'mykad', 'kad pengenalan', 'nric', 'identity', 'kp', 'no kad'],
    title: 'No. Kad Pengenalan Malaysia (MyKad Format)',
    recommendedPattern: '^\\d{6}-?\\d{2}-?\\d{4}$',
    flags: '',
    explanation: 'Memadankan format 12 digit MyKad standard: 6 digit tarikh lahir (TTBBHH), sengkang pilihan, 2 digit kod negeri kelahiran, sengkang pilihan, dan 4 digit nombor siri/jantina.',
    tokens: [
      { symbol: '^', meaning: 'Permulaan teks.' },
      { symbol: '\\d{6}', meaning: 'Tepat 6 digit nombor (Tarikh Lahir: Tahun-Bulan-Hari).' },
      { symbol: '-?', meaning: 'Tanda sempang pertama adalah pilihan.' },
      { symbol: '\\d{2}', meaning: 'Tepat 2 digit nombor (Kod Negeri / Tempat Lahir JPN).' },
      { symbol: '-?', meaning: 'Tanda sempang kedua adalah pilihan.' },
      { symbol: '\\d{4}', meaning: 'Tepat 4 digit nombor siri dan jantina (genap = perempuan, ganjil = lelaki).' },
      { symbol: '$', meaning: 'Penamat teks.' },
    ],
    validExamples: ['040512-10-5432', '991231015678', '020815-14-1121'],
    invalidExamples: ['04051-10-5432 (Hanya 5 digit tarikh)', '040512-1-5432 (Hanya 1 digit negeri)', '991231-10-ABCD (Mengandungi huruf)'],
    htmlCode: `<label for="mykad">No. Kad Pengenalan</label>
<input 
  type="text" 
  id="mykad" 
  name="mykad" 
  pattern="^\\d{6}-?\\d{2}-?\\d{4}$" 
  placeholder="040512-10-5432" 
  maxlength="14" 
  required 
/>`,
    jsCode: `const mykadRegex = /^\\d{6}-?\\d{2}-?\\d{4}$/;
if (mykadRegex.test(icInput.value)) {
  // Sah dari segi format sintaks
}`,
    realWorldWarning: 'PERINGATAN KESELAMATAN: RegEx ini hanya mengesahkan struktur 12 digit. Ia tidak memeriksa sama ada tarikh lahir wujud dalam kalendar atau sama ada nombor ini berdaftar di pangkalan data JPN.',
    predictionChallenge: {
      candidate: '030229-10-1234',
      willMatch: true,
      reason: 'Dari segi RegEx corak \\d{6}-?\\d{2}-?\\d{4}, ia sepadan kerana terdiri daripada 6 digit, 2 digit, dan 4 digit. Namun semakan tarikh sebenar (29 Feb bukan tahun lompat) memerlukan logik JavaScript Date.',
    },
  },

  {
    id: 'email',
    triggers: ['email', 'emel', 'e-mel', 'mail', 'gmail', 'yahoo', 'politeknik.edu.my'],
    title: 'Pengesahan Alamat Emel (Email Address)',
    recommendedPattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    explanation: 'Mengesahkan nama pengguna sebelum simbol @, nama hos domain, dan domain peringkat atas (TLD) sekurang-kurangnya 2 huruf.',
    tokens: [
      { symbol: '^[a-zA-Z0-9._%+-]+', meaning: 'Bermula dengan 1 atau lebih huruf, nombor, atau simbol khas yang dibenarkan dalam nama pengguna.' },
      { symbol: '@', meaning: 'Simbol @ wajib ada tepat sekali.' },
      { symbol: '[a-zA-Z0-9.-]+', meaning: 'Nama domain (cth: gmail, politeknik).' },
      { symbol: '\\.', meaning: 'Titik noktah literal sebelum akhiran domain.' },
      { symbol: '[a-zA-Z]{2,}$', meaning: 'Sekurang-kurangnya 2 huruf abjad untuk TLD (cth: .com, .my, .edu.my).' },
    ],
    validExamples: ['azlan@politeknik.edu.my', 'pelajar2024@gmail.com', 'team+support@servestud.my'],
    invalidExamples: ['pelajar@gmail (Tiada TLD .com)', '@politeknik.edu.my (Tiada nama pengguna)', 'azlan gmail.com (Tiada simbol @)'],
    htmlCode: `<label for="email">Alamat Emel</label>
<input 
  type="email" 
  id="email" 
  name="email" 
  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" 
  placeholder="pelajar@politeknik.edu.my" 
  required 
/>`,
    jsCode: `const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
const isValid = emailRegex.test(userEmail.trim());`,
    realWorldWarning: 'Satu-satunya cara membuktikan emel wujud adalah dengan menghantar pautan pengesahan ke peti masuk (Inbox). Jangan tolak emel sah dengan RegEx yang terlalu ketat.',
    predictionChallenge: {
      candidate: 'student@domain.c',
      willMatch: false,
      reason: 'Gagal kerana domain peringkat atas (.c) hanya mempunyai 1 huruf, sedangkan corak menetapkan {2,} (minimum 2 huruf).',
    },
  },

  {
    id: 'matric-no',
    triggers: ['matric', 'matrik', 'pendaftaran', '20dit', 'politeknik', 'no pendaftaran'],
    title: 'No. Pendaftaran Pelajar Politeknik (Matric Number)',
    recommendedPattern: '^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$',
    flags: '',
    explanation: 'Format rasmi Politeknik Malaysia: 2 digit tahun daftar, 3 huruf kod jabatan (cth: DIT), 2 digit sesi, huruf F, dan 4 digit giliran (cth: 20DIT24F1001).',
    tokens: [
      { symbol: '^', meaning: 'Permulaan teks.' },
      { symbol: '\\d{2}', meaning: '2 digit tahun pendaftaran (cth: 20).' },
      { symbol: '[A-Za-z]{3}', meaning: '3 huruf kod program pengajian (cth: DIT, DDT, DKM).' },
      { symbol: '\\d{2}', meaning: '2 digit kohort (cth: 24).' },
      { symbol: '[Ff]', meaning: 'Huruf F (atau f) menandakan sesi ambilan.' },
      { symbol: '\\d{4}$', meaning: '4 digit nombor giliran sehingga akhir teks.' },
    ],
    validExamples: ['20DIT24F1001', '22DDT23F2045', '19DKM21F1099'],
    invalidExamples: ['20DIT241001 (Ketinggalan huruf F)', '2DIT24F1001 (Hanya 1 digit tahun)', '20DIT24F100 (Kurang digit di belakang)'],
    htmlCode: `<label for="matric">No. Pendaftaran Pelajar</label>
<input 
  type="text" 
  id="matric" 
  name="matric" 
  pattern="^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$" 
  placeholder="20DIT24F1001" 
  style="text-transform: uppercase" 
  required 
/>`,
    jsCode: `const matricPattern = /^\\d{2}[A-Za-z]{3}\\d{2}[Ff]\\d{4}$/;
const isMatricValid = matricPattern.test(matricInput.value.trim());`,
    realWorldWarning: 'Format ini sah mengikut piawaian politeknik KPT. Untuk universiti lain (UiTM, UTM, UKM), format matrik berbeza.',
    predictionChallenge: {
      candidate: '24DEP24F3001',
      willMatch: true,
      reason: 'Sah! 24 (tahun), DEP (Diploma Kejuruteraan Elektrik), 24 (sesi), F, 3001 (giliran).',
    },
  },

  {
    id: 'password',
    triggers: ['password', 'kata laluan', 'strong', 'kata kunci', 'kukuh', 'rahsia'],
    title: 'Polisi Kata Laluan Kukuh (Strong Password Policy)',
    recommendedPattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$',
    flags: '',
    explanation: 'Menggunakan Positive Lookahead (?=...) untuk memastikan sekurang-kurangnya 1 huruf kecil, 1 huruf besar, 1 nombor, 1 simbol khas, dan panjang minimum 8 aksara.',
    tokens: [
      { symbol: '(?=.*[a-z])', meaning: 'Lookahead: Mesti ada sekurang-kurangnya SATU huruf kecil.' },
      { symbol: '(?=.*[A-Z])', meaning: 'Lookahead: Mesti ada sekurang-kurangnya SATU huruf besar.' },
      { symbol: '(?=.*\\d)', meaning: 'Lookahead: Mesti ada sekurang-kurangnya SATU digit nombor.' },
      { symbol: '(?=.*[@$!%*?&#^~_-])', meaning: 'Lookahead: Mesti ada sekurang-kurangnya SATU simbol khas.' },
      { symbol: '[...]{8,}$', meaning: 'Jumlah keseluruhan mesti sekurang-kurangnya 8 aksara.' },
    ],
    validExamples: ['P@ssw0rd2024', 'SifuCyber!99', 'K@jang43000#'],
    invalidExamples: ['password123 (Tiada huruf besar dan simbol)', 'PASSWORD123! (Tiada huruf kecil)', 'Pass!1 (Kurang daripada 8 aksara)'],
    htmlCode: `<label for="pwd">Kata Laluan</label>
<input 
  type="password" 
  id="pwd" 
  name="pwd" 
  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$" 
  required 
/>`,
    jsCode: `const strongPwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^~_-])[A-Za-z\\d@$!%*?&#^~_-]{8,}$/;
if (!strongPwdRegex.test(pwdInput.value)) {
  console.warn('Kata laluan tidak memenuhi kriteria keselamatan.');
}`,
    realWorldWarning: 'Jangan bergantung pada kerumitan simbol semata-mata. Pastikan pelayan anda juga menyemak senarai kata laluan bocor yang popular (cth: "12345678", "Password123!").',
    predictionChallenge: {
      candidate: 'CyberSifu2024',
      willMatch: false,
      reason: 'Gagal kerana tiada simbol khas (@$!%*?&#^~_-), walaupun mempunyai huruf besar, huruf kecil, nombor, dan melebihi 8 aksara.',
    },
  },

  {
    id: 'postcode',
    triggers: ['postcode', 'poskod', 'pos', 'postal', 'zip', '5 digit'],
    title: 'Poskod Malaysia (5 Digit Postcode)',
    recommendedPattern: '^\\d{5}$',
    flags: '',
    explanation: 'Semua poskod di Malaysia terdiri daripada tepat 5 digit nombor (01000 Perlis hingga 98850 Sarawak).',
    tokens: [
      { symbol: '^', meaning: 'Permulaan teks (tiada aksara di depan).' },
      { symbol: '\\d{5}', meaning: 'Tepat lima digit nombor 0-9.' },
      { symbol: '$', meaning: 'Penamat teks (tiada aksara di belakang).' },
    ],
    validExamples: ['50480 (Kuala Lumpur)', '43000 (Kajang)', '01000 (Kangar)'],
    invalidExamples: ['5048 (Hanya 4 digit)', '504801 (6 digit)', '5048A (Mengandungi huruf)'],
    htmlCode: `<input type="text" pattern="^\\d{5}$" inputmode="numeric" maxlength="5" placeholder="50480" required />`,
    jsCode: `const poskodRegex = /^\\d{5}$/;
const isPoskod = poskodRegex.test(poskodVal);`,
    realWorldWarning: 'RegEx hanya mengesahkan ia adalah 5 nombor. Untuk mengesahkan kawasan sebenar, rujuk senarai poskod rasmi Pos Malaysia.',
    predictionChallenge: {
      candidate: ' 43000 ',
      willMatch: false,
      reason: 'Gagal kerana terdapat ruang kosong di depan dan belakang. Gunakan .trim() sebelum membuat semakan.',
    },
  },

  {
    id: 'ringgit',
    triggers: ['ringgit', 'rm', 'duit', 'mata wang', 'harga', 'bayaran', 'currency', 'sen'],
    title: 'Jumlah Ringgit Malaysia (RM)',
    recommendedPattern: '^(?:[Rr][Mm]\\s?)?\\d+(?:\\.\\d{2})?$',
    flags: '',
    explanation: 'Memadankan format mata wang Ringgit Malaysia dengan awalan RM (pilihan) dan nilai sen tepat 2 tempat perpuluhan.',
    tokens: [
      { symbol: '^(?:[Rr][Mm]\\s?)?', meaning: 'Awalan "RM" atau "rm" dengan ruang kosong pilihan.' },
      { symbol: '\\d+', meaning: 'Satu atau lebih nombor bulat.' },
      { symbol: '(?:\\.\\d{2})?$', meaning: 'Titik perpuluhan dan tepat 2 digit sen (pilihan) di akhir teks.' },
    ],
    validExamples: ['RM 150.00', 'RM25.50', '500', 'RM 0.99'],
    invalidExamples: ['RM 150.5 (Hanya 1 digit sen)', 'RM 150.555 (Lebih 2 tempat perpuluhan)', '$50.00 (Mata wang salah)'],
    htmlCode: `<input type="text" pattern="^(?:[Rr][Mm]\\s?)?\\d+(?:\\.\\d{2})?$" placeholder="RM 50.00" required />`,
    jsCode: `const rmPattern = /^(?:[Rr][Mm]\\s?)?\\d+(?:\\.\\d{2})?$/;
if (rmPattern.test(amountInput.value)) { ... }`,
    realWorldWarning: 'Dalam pengaturcaraan kewangan, jangan simpan nilai duit sebagai float (cth: 0.1 + 0.2 = 0.30000000000000004). Simpan dalam unit SEN integer di pangkalan data.',
    predictionChallenge: {
      candidate: 'RM 12.5',
      willMatch: false,
      reason: 'Gagal kerana nilai sen mesti 2 tempat perpuluhan (cth: RM 12.50, bukan RM 12.5).',
    },
  },

  {
    id: 'date',
    triggers: ['date', 'tarikh', 'dd/mm/yyyy', 'hari', 'bulan', 'tahun', 'birthday', 'lahir'],
    title: 'Tarikh Format DD/MM/YYYY',
    recommendedPattern: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$',
    flags: '',
    explanation: 'Memadankan tarikh standard Malaysia: hari 01-31, garis condong (/), bulan 01-12, garis condong (/), dan 4 digit tahun.',
    tokens: [
      { symbol: '^(0[1-9]|[12][0-9]|3[01])', meaning: 'Hari: 01-09, 10-29, atau 30-31.' },
      { symbol: '\\/', meaning: 'Garis condong literal /' },
      { symbol: '(0[1-9]|1[0-2])', meaning: 'Bulan: 01-09 atau 10-12.' },
      { symbol: '\\/', meaning: 'Garis condong literal /' },
      { symbol: '\\d{4}$', meaning: '4 digit tahun di akhir rentetan.' },
    ],
    validExamples: ['31/08/1957', '16/09/1963', '01/01/2025'],
    invalidExamples: ['32/01/2024 (Hari 32 tidak wujud)', '15/13/2024 (Bulan 13 tidak wujud)', '5/8/2024 (Perlu sifar di depan: 05/08)'],
    htmlCode: `<input type="text" pattern="^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$" placeholder="31/08/1957" required />`,
    jsCode: `const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$/;
if (dateRegex.test(dateStr)) { ... }`,
    realWorldWarning: 'RegEx tidak dapat mengesan sama ada sesuatu tahun itu tahun lompat (leap year, cth: 29 Feb). Gabungkan dengan objek JavaScript Date() untuk semakan kalendar penuh.',
    predictionChallenge: {
      candidate: '31/04/2024',
      willMatch: true,
      reason: 'Dari segi sintaks corak, 31 dan 04 lulus (31 <= 31 dan 04 <= 12). Namun bulan April hanya ada 30 hari dalam realiti, jadi gunakan semakan JavaScript tambahan!',
    },
  },

  {
    id: 'image-file',
    triggers: ['image', 'gambar', 'fail', 'photo', 'picture', 'file', 'png', 'jpg', 'jpeg', 'extension'],
    title: 'Nama Fail Gambar (Image Filename)',
    recommendedPattern: '^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$',
    flags: 'i',
    explanation: 'Memadankan nama fail yang bersih tanpa simbol bahaya, diikuti titik dan format gambar web popular (.jpg, .png, .gif, .webp, .svg).',
    tokens: [
      { symbol: '^[a-zA-Z0-9_-]+', meaning: 'Nama fail: huruf, angka, garis bawah, atau tanda sengkang sahaja.' },
      { symbol: '\\.', meaning: 'Titik noktah literal sebelum format fail.' },
      { symbol: '(jpe?g|png|gif|webp|svg)$', meaning: 'Pilihan format gambar yang sah di hujung nama fail.' },
    ],
    validExamples: ['profile-photo.png', 'banner2024.jpg', 'logo.svg', 'thumb.webp'],
    invalidExamples: ['document.pdf (Bukan format gambar)', 'image.png.exe (Cubaan fail bahaya)', '.png (Tiada nama fail di depan)'],
    htmlCode: `<input type="text" pattern="^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$" placeholder="gambar.png" required />`,
    jsCode: `const imgRegex = /^[a-zA-Z0-9_-]+\\.(jpe?g|png|gif|webp|svg)$/i;
const isImage = imgRegex.test(fileName);`,
    realWorldWarning: 'BAHAYA KESELAMATAN: Penyerang boleh menukar nama fail berniat jahat menjadi "malware.png". Di pelayan (server), sentiasa periksa jenis MIME dan bait fail sebenar (magic numbers)!',
    predictionChallenge: {
      candidate: 'my photo.jpg',
      willMatch: false,
      reason: 'Gagal kerana terdapat ruang kosong (" ") antara "my" dan "photo", sedangkan corak [a-zA-Z0-9_-]+ melarang ruang kosong untuk keselamatan URL.',
    },
  },
]

/**
 * Sifu Coach Intent Resolution Engine
 */
export function querySifuCoach(userInput) {
  if (!userInput || typeof userInput !== 'string') {
    return {
      success: false,
      type: 'empty',
      message: 'Sila masukkan peraturan yang anda inginkan dalam bahasa mudah (cth: "Nombor telefon bimbit Malaysia" atau "Emel pelajar").',
    }
  }

  const query = userInput.toLowerCase().trim()

  // Match against intent catalog triggers
  let bestIntent = null
  let maxScore = 0

  for (const intent of INTENT_CATALOG) {
    let score = 0
    for (const trigger of intent.triggers) {
      if (query.includes(trigger)) {
        score += trigger.length // Longer keyword matches get higher weight
      }
    }
    if (score > maxScore) {
      maxScore = score
      bestIntent = intent
    }
  }

  if (bestIntent && maxScore >= 2) {
    return {
      success: true,
      type: 'matched_intent',
      intent: bestIntent,
      confidence: 'high',
      source: 'Deterministic Sifu Rule Engine (Safe Offline)',
    }
  }

  // Fallback: Detect if user typed an actual regex pattern to analyze
  if (query.startsWith('/') || query.startsWith('^') || query.includes('\\d') || query.includes('[') || query.includes('+')) {
    return analyzeRawPattern(userInput)
  }

  // General helpful response for unmatched queries
  return {
    success: false,
    type: 'unknown',
    message: `Sifu belum menemui corak yang tepat untuk "${userInput}". Sila cuba pilih salah satu topik cadangan di atas, atau nyatakan nama medan (cth: Poskod, MyKad, Kata Laluan, Emel).`,
    suggestedPrompts: SUGGESTED_PROMPTS,
  }
}

/**
 * Analyzes arbitrary RegEx input from student and detects common beginner mistakes
 */
function analyzeRawPattern(rawInput) {
  const clean = rawInput.trim().replace(/^\/|\/([gimsuy]*)$/g, '')

  const issues = []
  const recommendations = []

  // 1. Missing anchors
  if (!clean.startsWith('^')) {
    issues.push('Corak anda tidak mempunyai sauh permulaan (^). Ini bermakna JavaScript akan mencari padanan di mana-mana bahagian teks walaupun terdapat aksara salah di depan.')
    recommendations.push(`Tambah "^" di awal corak: ^${clean}`)
  }
  if (!clean.endsWith('$')) {
    issues.push('Corak anda tidak mempunyai sauh penamat ($). Teks yang ada aksara tambahan di belakang masih akan dianggap sah.')
    recommendations.push(`Tambah "$" di hujung corak: ${clean}$`)
  }

  // 2. Dangerous greedy .*
  if (clean.includes('.*')) {
    issues.push('Penggunaan ".*" (titik dan bintang) sangat bahaya dalam borang web kerana ia menyedut apa sahaja aksara tanpa had.')
    recommendations.push('Gantikan ".*" dengan kelas aksara yang spesifik seperti \\d+ atau [a-zA-Z]+.')
  }

  // 3. Unescaped dot
  if (/[^\\]\./.test(clean) && !clean.includes('[.')) {
    issues.push('Terdapat titik "." yang tidak dilepaskan dengan backslash (\\.). Ini akan memadankan SEBARANG aksara dan bukannya titik noktah sebenar.')
    recommendations.push('Gunakan "\\." jika anda ingin memadankan titik sebenar (seperti dalam emel atau nama fail).')
  }

  return {
    success: true,
    type: 'raw_analysis',
    pattern: clean,
    issues: issues.length > 0 ? issues : ['Sintaks corak anda kelihatan teratur! Pastikan anda menguji dengan contoh sah dan contoh gagal.'],
    recommendations,
    anchoredPattern: `^${clean.replace(/^\^/, '').replace(/\$$/, '')}$`,
  }
}
