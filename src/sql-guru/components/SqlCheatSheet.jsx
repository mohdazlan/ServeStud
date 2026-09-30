import { BookOpen, Zap, AlertTriangle, Code2 } from 'lucide-react'

export function SqlCheatSheet() {
  const queryOrder = [
    { step: '1. FROM / JOIN', desc: 'Menentukan jadual sumber dan operasi cantuman baris.' },
    { step: '2. WHERE', desc: 'Menapis baris individu sebelum sebarang pengelompokan.' },
    { step: '3. GROUP BY', desc: 'Mengelompokkan baris berdasarkan nilai lajur sepadan.' },
    { step: '4. HAVING', desc: 'Menapis kumpulan selepas fungsi agregat dikira.' },
    { step: '5. SELECT', desc: 'Memilih dan mengira lajur medan serta alias (AS).' },
    { step: '6. ORDER BY', desc: 'Menyusun hasil akhir secara menaik (ASC) atau menurun (DESC).' },
    { step: '7. LIMIT', desc: 'Mengehadkan bilangan baris paparan teratas.' },
  ]

  const syntaxTemplates = [
    {
      title: 'DDL: Cipta Jadual (CREATE TABLE)',
      code: `CREATE TABLE Branch (
    branchNo VARCHAR(4) PRIMARY KEY,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(30) NOT NULL,
    postcode VARCHAR(10) NOT NULL
);`,
    },
    {
      title: 'DML: Pertanyaan & Penapisan (SELECT WHERE ORDER BY)',
      code: `SELECT fName, lName, position, salary
FROM Staff
WHERE salary > 10000
ORDER BY salary DESC;`,
    },
    {
      title: 'Relasi: Cantuman Jadual (INNER JOIN)',
      code: `SELECT Staff.fName, Staff.lName, Branch.city
FROM Staff
INNER JOIN Branch ON Staff.branchNo = Branch.branchNo;`,
    },
    {
      title: 'Agregat: Pengelompokan (COUNT & AVG)',
      code: `SELECT city, COUNT(propertyNo) AS total_prop, AVG(rent) AS avg_rent
FROM PropertyForRent
GROUP BY city
HAVING COUNT(propertyNo) > 1;`,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-[#0d1726] border border-[#1e314f] p-5 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <BookOpen size={16} />
          <span>Rujukan Pantas Sintaks & Tatacara SQL</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Kompilasi piawaian sintaks ANSI SQL, turutan pemprosesan pertanyaan pangkalan data, dan pencegahan ralat lazim pelajar.
        </p>
      </div>

      {/* SQL Execution Order Visualizer */}
      <div className="rounded-xl bg-[#09111c] border border-[#1e314f] p-4 space-y-3">
        <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Zap size={14} />
          <span>Turutan Pemprosesan Logik SQL (Logical Query Processing Order)</span>
        </h3>
        <p className="text-xs text-slate-400">
          Enjin pangkalan data tidak memproses klausa mengikut susunan teks yang anda taip. Ia diproses mengikut turutan logik berikut:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
          {queryOrder.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[#0d1829] border border-[#182942] text-xs space-y-1 hover:border-emerald-500/40 transition-colors"
            >
              <span className="font-mono font-bold text-emerald-400 block">{q.step}</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">{q.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {syntaxTemplates.map((t, idx) => (
          <div key={idx} className="rounded-xl bg-[#0a1220] border border-[#1e314f] overflow-hidden space-y-2">
            <div className="px-3.5 py-2 bg-[#0e1a2d] border-b border-[#1e314f] flex items-center gap-2">
              <Code2 size={14} className="text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-200">{t.title}</h4>
            </div>
            <pre className="p-3 font-mono text-xs text-emerald-300 overflow-x-auto sql-guru-scrollbar leading-relaxed">
              {t.code}
            </pre>
          </div>
        ))}
      </div>

      {/* Common Mistakes & AI Tips */}
      <div className="rounded-xl bg-[#141d11] border border-emerald-500/30 p-4 space-y-2.5">
        <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
          <AlertTriangle size={14} className="text-amber-400" />
          <span>5 Perangkap Lazim SQL & Cara Mengatasinya</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-[#0a1220]/80 border border-[#1e314f] space-y-1">
            <strong className="text-amber-300 block">1. Lupa Klausa ON dalam JOIN:</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Jika anda tidak meletakkan `ON JadualA.id = JadualB.id`, SQL akan melakukan Cartesian Product (Cross Join) yang menggandakan baris tanpa kawalan.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0a1220]/80 border border-[#1e314f] space-y-1">
            <strong className="text-amber-300 block">2. Kolum Bukan Agregat dalam GROUP BY:</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Semua kolum biasa yang disenaraikan dalam SELECT selain fungsi agregat (seperti COUNT, SUM) MESTI dimasukkan ke dalam klausa GROUP BY.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0a1220]/80 border border-[#1e314f] space-y-1">
            <strong className="text-amber-300 block">3. Perbezaan WHERE vs HAVING:</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              `WHERE` menapis sebelum pengelompokan baris mentah. `HAVING` menapis selepas fungsi agregat selesai dikira.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0a1220]/80 border border-[#1e314f] space-y-1">
            <strong className="text-amber-300 block">4. Membandingkan Nilai NULL:</strong>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Jangan gunakan `= NULL` atau `!= NULL`. Sentiasa gunakan operator `IS NULL` atau `IS NOT NULL`.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
