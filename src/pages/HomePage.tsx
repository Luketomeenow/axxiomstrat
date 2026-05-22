import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpenCheck,
  Clapperboard,
  Database,
  Gauge,
  Layers,
  LayoutGrid,
  Map,
  Megaphone,
  Palette,
  Presentation,
} from 'lucide-react'
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
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/brandguidelines"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
          >
            <Palette className="h-4 w-4 text-cyan-300" aria-hidden />
            Brand guidelines
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/vectordbcomparison"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-800/20 bg-emerald-950 px-4 py-3 text-sm font-medium text-emerald-50 shadow-sm transition-colors hover:bg-emerald-900"
          >
            <Database className="h-4 w-4 text-emerald-300" aria-hidden />
            Vector DB comparison
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/marketingvidsprompts"
            className="inline-flex items-center gap-2 rounded-xl border border-orange-900/30 bg-[#1a0f0a] px-4 py-3 text-sm font-medium text-orange-50 shadow-sm transition-colors hover:bg-[#261409]"
          >
            <Clapperboard className="h-4 w-4 text-orange-300" aria-hidden />
            Video prompts (Higgsfield)
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/marketingcampaign"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-900/25 bg-amber-950/80 px-4 py-3 text-sm font-medium text-amber-50 shadow-sm transition-colors hover:bg-amber-950"
          >
            <Megaphone className="h-4 w-4 text-amber-300" aria-hidden />
            Marketing campaign
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/axxiom4campaign"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#141210] px-4 py-3 text-sm font-medium text-[#f7f5f0] shadow-sm ring-1 ring-white/10 transition-colors hover:bg-[#1c1c18]"
          >
            <LayoutGrid className="h-4 w-4 text-[#7eb8ff]" aria-hidden />
            4-campaign system
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/axxiomairoadmap"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-800/30 bg-indigo-950/90 px-4 py-3 text-sm font-medium text-indigo-50 shadow-sm transition-colors hover:bg-indigo-950"
          >
            <Map className="h-4 w-4 text-indigo-300" aria-hidden />
            AI roadmap 2026–27
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/airoadmap"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-800/35 bg-violet-950/85 px-4 py-3 text-sm font-medium text-violet-50 shadow-sm transition-colors hover:bg-violet-950"
          >
            <Presentation className="h-4 w-4 text-violet-300" aria-hidden />
            AI roadmap (presentation)
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/airoadmapdashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-teal-800/35 bg-teal-950/90 px-4 py-3 text-sm font-medium text-teal-50 shadow-sm transition-colors hover:bg-teal-950"
          >
            <Gauge className="h-4 w-4 text-teal-300" aria-hidden />
            AI roadmap dashboard
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
          <Link
            to="/aeogeoplaybook"
            className="inline-flex items-center gap-2 rounded-xl border border-[#1a3a5c]/50 bg-gradient-to-br from-[#0f2847] to-[#1a3a5c] px-4 py-3 text-sm font-medium text-amber-50 shadow-sm ring-1 ring-amber-500/25 transition-colors hover:from-[#132f4f] hover:to-[#1e4570]"
          >
            <BookOpenCheck className="h-4 w-4 text-amber-300" aria-hidden />
            AEO execution playbook
            <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
          </Link>
        </div>
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
