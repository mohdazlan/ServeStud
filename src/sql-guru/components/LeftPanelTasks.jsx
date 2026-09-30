import { CheckCircle2, Layers, Sparkles, Clock } from 'lucide-react'

export function LeftPanelTasks({
  activities,
  selectedActivityId,
  onSelectActivity,
  completedActivityIds,
  className = '',
}) {
  return (
    <aside
      className={`flex flex-col border-r border-[#1e314f] bg-[#09111c] overflow-y-auto sql-guru-scrollbar p-3 sm:p-4 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Layers size={14} />
            <span>Modul Latihan SQL</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Berdasarkan Buku Panduan & Kajian UTP
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono">
          {completedActivityIds.length}/{activities.length} Selesai
        </span>
      </div>

      <div className="space-y-2">
        {activities.map((act, index) => {
          const isSelected = act.id === selectedActivityId
          const isCompleted = completedActivityIds.includes(act.id)

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectActivity(act.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'border-emerald-500/60 bg-[#122238] shadow-md ring-1 ring-emerald-500/30'
                  : 'border-[#1b2b45] bg-[#0d1726]/80 hover:bg-[#122035] hover:border-[#253d61]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-400" />
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={12} /> : index + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {act.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Clock size={10} />
                  <span>{act.estimatedMinutes}m</span>
                </div>
              </div>

              <h3 className="mt-1.5 text-xs font-semibold text-slate-100 leading-snug line-clamp-2">
                {act.title}
              </h3>
              <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {act.subtitle}
              </p>

              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#182840]">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {act.level}
                </span>
                {act.paperReference && (
                  <span className="text-[9px] text-amber-300/80 font-mono flex items-center gap-1">
                    <Sparkles size={10} /> Rajah 1 Kajian
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* UTP Research Banner Card */}
      <div className="pt-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#0e1d30] to-[#152a45] border border-[#233d61] text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
            <Sparkles size={13} />
            <span>Kajian Kebolehgunaan AI Tutor</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Penyelidikan bersama UTP membuktikan maklum balas segera LLM meningkatkan kefahaman SQL diploma sebanyak 4.66/5.00!
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400 font-mono">
            <span>UTP</span>·<span>IUCEL 2025</span>·<span>GenAI</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
