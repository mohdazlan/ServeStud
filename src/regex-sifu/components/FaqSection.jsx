import { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '../data/faqData.js'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index))
  }

  return (
    <div className="flex-1 bg-[#060a13] p-4 sm:p-6 lg:p-8 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-[#182640] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle size={20} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Soalan Lazim & Panduan RegEx Pelajar (FAQ)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Jawapan jelas untuk kekeliruan sintaks yang paling kerap dihadapi oleh pelajar diploma dalam pembangunan web.
          </p>
        </header>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1b2b4a] bg-[#09101f] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 text-slate-200 hover:text-white transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold leading-snug">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-cyan-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#141f36] text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
