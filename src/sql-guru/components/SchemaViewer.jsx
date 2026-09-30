import { useState } from 'react'
import { Database, Table, Key } from 'lucide-react'
import { DATABASE_SCHEMAS } from '../data/sqlCurriculum.js'

export function SchemaViewer({ dbKey = 'dreamhome', onInsertColumnName }) {
  const schema = DATABASE_SCHEMAS[dbKey] || DATABASE_SCHEMAS.dreamhome
  const [selectedTable, setSelectedTable] = useState(Object.keys(schema.tables)[0])
  const [viewMode, setViewMode] = useState('columns') // 'columns' | 'data'

  const currentTableDef = schema.tables[selectedTable]

  return (
    <div className="bg-[#0b1320] border border-[#1e314f] rounded-xl overflow-hidden flex flex-col">
      {/* Schema Header */}
      <div className="px-3.5 py-2.5 bg-[#0e192a] border-b border-[#1e314f] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-100">{schema.name}</h3>
            <p className="text-[10px] text-slate-400">{schema.description}</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg bg-[#070d17] p-0.5 border border-[#1e314f]">
          <button
            type="button"
            onClick={() => setViewMode('columns')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'columns'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Struktur Kolum
          </button>
          <button
            type="button"
            onClick={() => setViewMode('data')}
            className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
              viewMode === 'data'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pratonton Data ({currentTableDef?.data.length} baris)
          </button>
        </div>
      </div>

      {/* Table Selection Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[#09111c] border-b border-[#182840] overflow-x-auto sql-guru-scrollbar">
        {Object.keys(schema.tables).map((tName) => {
          const isSelected = tName === selectedTable
          return (
            <button
              key={tName}
              type="button"
              onClick={() => setSelectedTable(tName)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-[#15243b] text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:bg-[#0f1b2d] hover:text-slate-200'
              }`}
            >
              <Table size={12} className={isSelected ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{tName}</span>
            </button>
          )
        })}
      </div>

      {/* Main Schema / Data Content */}
      <div className="p-3 max-h-56 overflow-y-auto sql-guru-scrollbar bg-[#09111c]/60">
        {currentTableDef && viewMode === 'columns' && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-slate-500 uppercase px-2 py-1 border-b border-[#182840]">
              <div className="col-span-4">Kolum (Column)</div>
              <div className="col-span-3">Jenis Data</div>
              <div className="col-span-3">Kekangan</div>
              <div className="col-span-2 text-right">Tindakan</div>
            </div>
            {currentTableDef.columns.map((col) => (
              <div
                key={col.name}
                className="grid grid-cols-12 gap-2 items-center text-xs px-2 py-1.5 rounded-lg bg-[#0d1726]/60 hover:bg-[#122035] transition-colors border border-transparent hover:border-[#1e314f]"
              >
                <div className="col-span-4 flex items-center gap-1.5 font-mono text-slate-200">
                  {col.pk && (
                    <span title="Primary Key">
                      <Key size={11} className="text-amber-400 shrink-0" />
                    </span>
                  )}
                  <span className="truncate font-semibold">{col.name}</span>
                </div>
                <div className="col-span-3 font-mono text-[11px] text-cyan-300">
                  {col.type}
                </div>
                <div className="col-span-3 flex items-center gap-1 flex-wrap">
                  {col.pk && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                      PK
                    </span>
                  )}
                  {col.fk && (
                    <span
                      title={`FK -> ${col.fk}`}
                      className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono"
                    >
                      FK
                    </span>
                  )}
                  {col.notNull && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      NOT NULL
                    </span>
                  )}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {onInsertColumnName && (
                    <button
                      type="button"
                      onClick={() => onInsertColumnName(col.name)}
                      className="px-1.5 py-0.5 rounded bg-[#162740] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-[10px] font-mono transition-colors"
                      title="Masukkan nama kolum ke dalam kod"
                    >
                      + Kod
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTableDef && viewMode === 'data' && (
          <div className="overflow-x-auto sql-guru-scrollbar">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1e314f] bg-[#0e1a2d] text-slate-300">
                  {currentTableDef.columns.map((c) => (
                    <th key={c.name} className="px-2.5 py-1.5 whitespace-nowrap">
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#15233b]">
                {currentTableDef.data.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#122035]/60 transition-colors">
                    {currentTableDef.columns.map((c) => (
                      <td key={c.name} className="px-2.5 py-1.5 text-slate-300 whitespace-nowrap">
                        {String(row[c.name] ?? 'NULL')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
