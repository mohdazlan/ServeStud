import { BookOpen, HelpCircle, Zap } from 'lucide-react'

// Head First-style callouts, shared by all sections.

// The provocation block — dark shelf panel, the one high-contrast moment
// per section. Use once per section, at the top.
export function BrainPower({ children }) {
  return (
    <aside className="mt-8 rounded-xl bg-shelf px-6 py-5 text-paper">
      <p className="flex items-center gap-2 font-display text-lg font-semibold">
        <Zap size={18} className="text-partial" aria-hidden="true" />
        Brain Power
      </p>
      <div className="mt-2 max-w-[58ch] text-[1.0625rem] leading-relaxed">
        {children}
      </div>
    </aside>
  )
}

// A prominent formal definition. Lamp green = knowledge, so amber stays
// reserved for actions. `term` is the thing being defined.
export function DefinitionCard({ term, children }) {
  return (
    <aside className="mt-8 rounded-xl border border-lamp/50 bg-lamp/8 px-6 py-5">
      <p className="flex items-center gap-2 font-display text-xl font-semibold">
        <BookOpen size={19} className="text-lamp" aria-hidden="true" />
        {term}
      </p>
      <div className="mt-2 max-w-[60ch] text-[1.0625rem] leading-relaxed">
        {children}
      </div>
    </aside>
  )
}

// Q&A sidebar. `items` = [{ q, a }]
export function NoDumbQuestions({ items }) {
  return (
    <aside className="mt-12 rounded-xl border border-hairline px-6 py-5">
      <h4 className="flex items-center gap-2 font-display text-xl font-semibold">
        <HelpCircle size={19} className="text-lamp" aria-hidden="true" />
        There are no dumb questions
      </h4>
      <dl className="mt-4 space-y-5">
        {items.map((item) => (
          <div key={item.q}>
            <dt className="font-semibold">
              <span aria-hidden="true" className="mr-1.5 font-display text-amber">
                Q:
              </span>
              {item.q}
            </dt>
            <dd className="mt-1 max-w-[60ch] leading-relaxed text-ink">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}
