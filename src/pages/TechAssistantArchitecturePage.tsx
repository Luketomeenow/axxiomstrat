import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Bot, Printer } from 'lucide-react'
import { buildTechAssistantIframeSrcDoc } from '../lib/techAssistantIframeDocument'

const DOC_PATH = '/axxiom_tech_assistant_architecture.html'

const TABS = [
  { index: 0, id: 'architecture', label: 'Architecture' },
  { index: 1, id: 'doc-processing', label: 'Doc processing' },
  { index: 2, id: 'knowledge-graph', label: 'Knowledge graph' },
  { index: 3, id: 'retrieval', label: 'Retrieval engine' },
  { index: 4, id: 'tech-agent', label: 'Tech agent' },
  { index: 5, id: 'learning-gen', label: 'Learning + Gen' },
  { index: 6, id: 'phases', label: 'Phases' },
] as const

function tabIndexFromParams(params: URLSearchParams): number {
  const tab = params.get('tab')
  if (!tab) return 0
  const found = TABS.find((t) => t.id === tab)
  return found?.index ?? 0
}

export function TechAssistantArchitecturePage() {
  const [searchParams] = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(() => tabIndexFromParams(searchParams))

  useEffect(() => {
    let cancelled = false
    setLoadError(null)
    setSrcDoc(null)
    fetch(DOC_PATH)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load document (${r.status})`)
        return r.text()
      })
      .then((raw) => {
        if (cancelled) return
        setSrcDoc(buildTechAssistantIframeSrcDoc(raw))
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const sendTab = useCallback((index: number) => {
    setActiveTab(index)
    iframeRef.current?.contentWindow?.postMessage({ type: 'TECH_ASSISTANT_TAB', index }, '*')
  }, [])

  useEffect(() => {
    setActiveTab(tabIndexFromParams(searchParams))
  }, [searchParams])

  useEffect(() => {
    if (!srcDoc) return
    const index = tabIndexFromParams(searchParams)
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'TECH_ASSISTANT_TAB', index },
      '*',
    )
  }, [srcDoc, searchParams])

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0c0a14] font-sans text-white">
      <header className="relative flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-violet-500/20 bg-gradient-to-r from-[#120f1f] via-[#16122a] to-[#1a1535] px-4 py-3 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_0%_0%,rgba(139,92,246,0.16),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-3">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-violet-400/35 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-9 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/35 bg-gradient-to-br from-violet-600/25 to-indigo-900/40 text-violet-200 shadow-[0_0_28px_rgba(139,92,246,0.2)]">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                Operations · AI platform
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
                Tech assistant architecture
              </h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="relative inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-violet-400/30 hover:text-white"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Print</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-[#100d18]/95 lg:w-60 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-b border-white/5 px-4 py-3 lg:px-4 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-300/75">
              Architecture sections
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              700GB multi-modal RAG, knowledge graph, LangGraph agent, and rollout phases.
            </p>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="Tech assistant architecture sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => sendTab(t.index)}
                className={[
                  'whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all lg:w-full',
                  activeTab === t.index
                    ? 'bg-gradient-to-r from-violet-500/20 to-indigo-600/10 text-violet-50 ring-1 ring-violet-400/35'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-2 sm:p-3 lg:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_90%_10%,rgba(99,102,241,0.12),transparent_50%)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_28px_56px_-16px_rgba(0,0,0,0.55)] lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-slate-200/80 bg-slate-50 px-3 py-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.55)]" aria-hidden />
              <span className="text-[11px] font-medium text-slate-600">
                Knowledge graph + multi-modal RAG · not fine-tuning as foundation
              </span>
            </div>
            {loadError ? (
              <div className="flex flex-1 items-center justify-center bg-white p-6 text-sm text-red-700">
                {loadError}
              </div>
            ) : !srcDoc ? (
              <div className="flex flex-1 items-center justify-center bg-white text-slate-500">
                <span className="animate-pulse text-sm font-medium">Loading architecture…</span>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Axxiom AI Tech Assistant — complete architecture"
                srcDoc={srcDoc}
                className="min-h-0 w-full flex-1 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
