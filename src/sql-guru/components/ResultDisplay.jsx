import { CheckCircle2, XCircle, Clock, Table, AlertCircle, Lightbulb } from 'lucide-react'

export function ResultDisplay({
  execResult,
  evaluationResult,
  activeHints = [],
}) {
  return (
    <div className="space-y-3">
      {/* 1. Evaluation / Check Answer Card (if triggered) */}
      {evaluationResult && (
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            evaluationResult.passed
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {evaluationResult.passed ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-bold">{evaluationResult.message}</h4>
              {evaluationResult.details && evaluationResult.details.length > 0 && (
                <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
                  {evaluationResult.details.map((detail, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Contextual Hints Section ("I want help, not the answer!") */}
      {activeHints.length > 0 && (
        <div className="space-y-2">
          {activeHints.map((hint) => (
            <div
              key={hint.level}
              className="p-3 rounded-xl bg-[#141b12] border border-amber-500/40 text-xs space-y-1 text-amber-200/90 shadow-sm"
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Lightbulb size={14} className="text-amber-400" />
                <span>{hint.title} (Tahap {hint.level})</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 pl-5">
                {hint.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 3. SQL Execution Results Grid */}
      {execResult && (
        <div className="bg-[#0b1320] border border-[#1e314f] rounded-xl overflow-hidden">
          {/* Header Bar with execution status and duration */}
          <div className="px-3.5 py-2 bg-[#0e192a] border-b border-[#1e314f] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Table size={14} className={execResult.success ? 'text-emerald-400' : 'text-rose-400'} />
              <span className="text-xs font-semibold text-slate-200">
                {execResult.success ? 'Hasil Laksana SQL' : 'Ralat Laksana'}
              </span>
              {execResult.success && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 font-mono">
                  {execResult.rows?.length || 0} Baris
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {execResult.executionTime} ms
              </span>
            </div>
          </div>

          {/* Body Content: Table or Error */}
          <div className="p-3 max-h-64 overflow-y-auto sql-guru-scrollbar bg-[#070e17]">
            {execResult.success ? (
              execResult.rows && execResult.rows.length > 0 ? (
                <div className="overflow-x-auto sql-guru-scrollbar">
                  <table className="w-full text-left text-xs font-mono border-collapse">
                    <thead>
                      <tr className="border-b border-[#1e314f] bg-[#0d1726] text-slate-300">
                        {execResult.columns.map((c, idx) => (
                          <th key={idx} className="px-3 py-1.5 whitespace-nowrap">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#15233b]">
                      {execResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-[#122035]/60 transition-colors">
                          {Array.isArray(row)
                            ? row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-3 py-1.5 text-slate-300 whitespace-nowrap">
                                  {String(cell ?? 'NULL')}
                                </td>
                              ))
                            : execResult.columns.map((col, cIdx) => (
                                <td key={cIdx} className="px-3 py-1.5 text-slate-300 whitespace-nowrap">
                                  {String(row[col] ?? 'NULL')}
                                </td>
                              ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-mono">
                  {execResult.message || 'Arahan berjaya dilaksanakan. Tiada rekod dipulangkan.'}
                </div>
              )
            ) : (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <XCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <div className="space-y-1">
                  <p className="font-bold">Ralat Sintaks / Pangkalan Data:</p>
                  <p className="font-mono text-[11px] text-rose-200">{execResult.error}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
