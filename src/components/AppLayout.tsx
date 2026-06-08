import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  BookOpenCheck,
  Bot,
  Clapperboard,
  Database,
  ExternalLink,
  Gauge,
  LayoutGrid,
  Map,
  Megaphone,
  PanelLeft,
  Palette,
  Presentation,
  Radar,
} from 'lucide-react'
import { AppIcon } from './AppIcon'
import {
  STRATEGY_DOCUMENTS,
  categoryLabel,
  type DocCategory,
} from '../data/documents'

const byCategory = (cat: DocCategory) =>
  STRATEGY_DOCUMENTS.filter((d) => d.category === cat)

export function AppLayout() {
  const [toast, setToast] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (
        e.data?.type === 'STRATEGY_COPY_PROMPT' &&
        typeof e.data.text === 'string'
      ) {
        setToast('Copied prompt to clipboard')
        window.setTimeout(() => setToast(null), 2600)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'block rounded-lg px-3 py-2 text-sm transition-colors',
      isActive
        ? 'bg-amber-500/15 font-medium text-amber-100'
        : 'text-slate-300 hover:bg-white/5 hover:text-white',
    ].join(' ')

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-800/80 bg-axxiom-panel px-3 py-6 font-sans shadow-xl">
        <Link
          to="/"
          className="mb-8 flex items-start gap-2 border-b border-slate-700/80 px-2 pb-6"
        >
          <AppIcon className="h-10 w-10 shrink-0 rounded-lg shadow-sm ring-1 ring-amber-500/25" />
          <span className="min-w-0">
            <span className="font-display text-base font-semibold leading-tight tracking-tight text-white">
              Axxiom
            </span>
            <span className="mt-0.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
              Strategy hub
            </span>
          </span>
        </Link>

        <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pb-4">
          <NavLink to="/" end className={navClass}>
            <span className="flex items-center gap-2">
              <PanelLeft className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              All documents
            </span>
          </NavLink>

          <NavLink to="/brandguidelines" className={navClass}>
            <span className="flex items-center gap-2">
              <Palette className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              Brand guidelines
            </span>
          </NavLink>

          <NavLink to="/vectordbcomparison" className={navClass}>
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              Vector DB comparison
            </span>
          </NavLink>

          <NavLink to="/marketingvidsprompts" className={navClass}>
            <span className="flex items-center gap-2">
              <Clapperboard className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              Video prompts (Higgsfield)
            </span>
          </NavLink>

          <NavLink to="/marketingcampaign" className={navClass}>
            <span className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              Marketing campaign
            </span>
          </NavLink>

          <NavLink to="/axxiom4campaign" className={navClass}>
            <span className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              4-campaign system
            </span>
          </NavLink>

          <NavLink to="/axxiomairoadmap" className={navClass}>
            <span className="flex items-center gap-2">
              <Map className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              AI roadmap 2026–27
            </span>
          </NavLink>

          <div>
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">
              AI Intelligence
            </p>
            <ul className="space-y-0.5">
              <li>
                <NavLink to="/aeo" className={navClass}>
                  <span className="flex items-center gap-2">
                    <Radar className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    AEO Automation
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/airoadmap" className={navClass}>
                  <span className="flex items-center gap-2">
                    <Presentation className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    AI roadmap (presentation)
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/airoadmapdashboard" className={navClass}>
                  <span className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    AI roadmap dashboard
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/techassistantarchitecture" className={navClass}>
                  <span className="flex items-center gap-2">
                    <Bot className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    Tech assistant architecture
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/aeogeoplaybook" className={navClass}>
                  <span className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                    AEO playbook
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>

          {(['automation', 'strategy', 'research'] as const).map((cat) => (
            <div key={cat}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {categoryLabel[cat]}
              </p>
              <ul className="space-y-0.5">
                {byCategory(cat).map((d) => (
                  <li key={d.slug}>
                    <NavLink to={`/doc/${d.slug}`} className={navClass}>
                      {d.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <a
          href="https://axxiomelevator.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-2 rounded-lg border border-slate-600/60 px-3 py-2.5 text-xs text-slate-300 transition-colors hover:border-amber-500/40 hover:text-amber-200"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          axxiomelevator.com
        </a>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200/90 bg-white/90 px-6 py-4 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="truncate text-sm text-slate-600">
              {location.pathname === '/'
                ? 'Internal strategy & automation artifacts'
                : 'Document viewer'}
            </p>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>

      {toast ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  )
}
