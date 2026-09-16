import { useState, useMemo } from 'react'
import {
  Search,
  X,
  Layers,
  MapPin,
  FileCheck,
  Sparkles,
  Calendar,
  ShieldCheck,
  Globe,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { CATEGORIES } from '../data/patterns.js'

const ICON_MAP = {
  Layers,
  MapPin,
  FileCheck,
  Sparkles,
  Calendar,
  ShieldCheck,
  Globe,
}

export function LeftPanelExamples({
  patterns,
  selectedPatternId,
  onSelectPattern,
  className = '',
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredPatterns = useMemo(() => {
    return patterns.filter((item) => {
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory
      if (!matchesCat) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      )
    })
  }, [patterns, selectedCategory, searchQuery])

  return (
    <aside
      className={`flex flex-col border-r border-[#1a253d] bg-[#070c17] select-none ${className}`}
      aria-label="Example Pattern Library"
    >
      {/* Search Input Field */}
      <div className="p-3 border-b border-[#162136]">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari contoh (cth: IC, phone, emel)..."
            className="w-full pl-8 pr-8 py-2 rounded-lg bg-[#0d1526] border border-[#20304f] text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:bg-[#101b31] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5"
              aria-label="Clear search query"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Layers
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-[#0f192c] text-slate-400 hover:text-slate-200 hover:bg-[#14223d] border border-transparent'
                }`}
              >
                <Icon size={12} className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Pattern Count Header */}
      <div className="px-3.5 py-2 bg-[#09101d] border-b border-[#141f33] flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>CONTOH SEDIA ADA ({filteredPatterns.length})</span>
        <span className="text-[10px] text-cyan-400">KLIK UNTUK MUAT</span>
      </div>

      {/* Scrollable Pattern Cards List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 focus:outline-none" tabIndex={0}>
        {filteredPatterns.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-500 text-xs">
            <Filter size={24} className="mx-auto mb-2 opacity-40" />
            <p>Tiada corak yang sepadan dengan carian "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-3 text-cyan-400 underline text-xs"
            >
              Kosongkan Penapis
            </button>
          </div>
        ) : (
          filteredPatterns.map((item) => {
            const isSelected = item.id === selectedPatternId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectPattern(item.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all relative group ${
                  isSelected
                    ? 'bg-[#101b31] border-cyan-500/50 glow-cyan-subtle'
                    : 'bg-[#0b1222]/80 hover:bg-[#10192e] border-[#182640] text-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className={`text-xs font-semibold leading-snug ${
                      isSelected ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {item.title}
                  </h2>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono shrink-0 uppercase ${
                      item.difficulty === 'Beginner'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : item.difficulty === 'Intermediate'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-normal font-sans">
                  {item.summary}
                </p>

                <div className="mt-2 pt-1.5 border-t border-[#16233a] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="truncate max-w-[190px] text-slate-400 bg-[#090e1a] px-1.5 py-0.5 rounded border border-[#141e30]">
                    {item.source}
                  </span>
                  <ChevronRight
                    size={13}
                    className={`transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                    }`}
                  />
                </div>
              </button>
            )
          })
        )}
      </div>
    </aside>
  )
}
