import { Link } from 'react-router-dom'
import { ArrowRight, Layers, Palette } from 'lucide-react'
import {
  STRATEGY_DOCUMENTS,
  categoryLabel,
  type DocCategory,
} from '../data/documents'

const catOrder: DocCategory[] = ['automation', 'strategy', 'research']

const catAccent: Record<DocCategory, string> = {
  automation: 'from-sky-500/10 to-indigo-500/5 ring-sky-500/20',
  strategy: 'from-amber-500/12 to-orange-500/5 ring-amber-500/25',
  research: 'from-emerald-500/10 to-teal-500/5 ring-emerald-500/20',
}

export function HomePage() {
  return (
    <div>
      <section className="mb-12 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-slate-100/90 p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700/90">
          Xenoz × Axxiom Elevator
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Strategy &amp; automation hub
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          One place to read every HTML artifact: clearer typography, consistent
          navigation, and one-click copy for AI prompts embedded in the originals.
        </p>
        <Link
          to="/brandguidelines"
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
        >
          <Palette className="h-4 w-4 text-cyan-300" aria-hidden />
          Open brand guidelines
          <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
        </Link>
      </section>

      {catOrder.map((cat) => (
        <section key={cat} className="mb-14">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-amber-400">
              <Layers className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              {categoryLabel[cat]}
            </h2>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {STRATEGY_DOCUMENTS.filter((d) => d.category === cat).map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/doc/${d.slug}`}
                  className={[
                    'group flex h-full flex-col rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm ring-1 ring-inset transition-all',
                    'hover:-translate-y-0.5 hover:shadow-md',
                    catAccent[cat],
                  ].join(' ')}
                >
                  <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-slate-950">
                    {d.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {d.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-800/90">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
