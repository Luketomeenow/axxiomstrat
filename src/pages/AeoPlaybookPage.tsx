import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { AeoPlaybookTabId } from '../data/aeoAutomation'
import { ArrowLeft, BookOpenCheck, Printer, Sparkles } from 'lucide-react'
import { buildAeoPlaybookIframeSrcDoc } from '../lib/aeoPlaybookIframeDocument'

const DOC_PATH = '/strategy-html/axxiom_aeo_playbook.html'

const TABS = [
  { id: 'why', label: 'Why AEO now' },
  { id: 'targets', label: 'Target queries' },
  { id: 'content', label: 'Content architecture' },
  { id: 'schema', label: 'Schema markup' },
  { id: 'authority', label: 'Authority signals' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'execution', label: 'Execution roadmap' },
  { id: 'measurement', label: 'Measurement' },
] as const

const TAB_IDS = new Set<string>(TABS.map((t) => t.id))

function tabFromSearchParams(params: URLSearchParams): (typeof TABS)[number]['id'] {
  const tab = params.get('tab')
  if (tab && TAB_IDS.has(tab)) return tab as AeoPlaybookTabId
  return 'why'
}

export function AeoPlaybookPage() {
  const [searchParams] = useSearchParams()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState<(typeof TABS)[number]['id']>(() =>
    tabFromSearchParams(searchParams),
  )

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
        setSrcDoc(buildAeoPlaybookIframeSrcDoc(raw))
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const sendTab = useCallback((id: (typeof TABS)[number]['id']) => {
    setActiveId(id)
    iframeRef.current?.contentWindow?.postMessage({ type: 'AEO_TAB', id }, '*')
  }, [])

  useEffect(() => {
    const id = tabFromSearchParams(searchParams)
    setActiveId(id)
  }, [searchParams])

  useEffect(() => {
    if (!srcDoc) return
    const id = tabFromSearchParams(searchParams)
    iframeRef.current?.contentWindow?.postMessage({ type: 'AEO_TAB', id }, '*')
  }, [srcDoc, searchParams])

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0a1522] font-sans text-white">
      <header className="relative flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-[#1a3a5c]/50 bg-gradient-to-r from-[#0c1a2a] via-[#102338] to-[#1a3a5c]/90 px-4 py-3 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_100%_at_0%_0%,rgba(240,180,74,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-3">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-amber-400/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-9 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-gradient-to-br from-[#1a3a5c] to-[#0f2035] text-amber-300 shadow-[0_0_28px_rgba(240,180,74,0.18)]">
              <BookOpenCheck className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/85">
                Answer engine optimization
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
                AEO execution playbook
              </h1>
            </div>
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-amber-400/25 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-[#0c1828]/95 lg:w-60 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-b border-white/5 px-4 py-3 lg:px-4 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/70">
              Playbook sections
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
              Jump to the same tabs as inside the document. Full-width reading in the viewer.
            </p>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="AEO playbook sections"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => sendTab(t.id)}
                className={[
                  'whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all lg:w-full',
                  activeId === t.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/5 text-amber-50 ring-1 ring-amber-400/35'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="hidden px-4 pb-4 lg:block">
            <div className="rounded-xl border border-[#1a3a5c]/40 bg-[#0f2035]/80 p-3 text-[11px] leading-relaxed text-slate-500">
              <Sparkles className="mb-2 h-4 w-4 text-amber-400/80" aria-hidden />
              Tip: use <kbd className="rounded bg-black/30 px-1 py-0.5 font-mono text-slate-400">Print</kbd> for a
              clean PDF of the current section layout.
            </div>
          </div>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-2 sm:p-3 lg:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_90%_10%,rgba(26,58,92,0.35),transparent_50%)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#f5f3ee] shadow-[0_0_0_1px_rgba(26,58,92,0.12),0_28px_56px_-16px_rgba(0,0,0,0.55)] lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white/80 px-3 py-2 backdrop-blur-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" aria-hidden />
              <span className="text-[11px] font-medium text-slate-600">
                Live playbook · warm layout preserved from source HTML
              </span>
            </div>
            {loadError ? (
              <div className="flex flex-1 items-center justify-center bg-white p-6 text-sm text-red-700">
                {loadError}
              </div>
            ) : !srcDoc ? (
              <div className="flex flex-1 items-center justify-center bg-[#f5f3ee] text-slate-500">
                <span className="animate-pulse text-sm font-medium">Loading playbook…</span>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Axxiom Elevator — AEO execution playbook"
                srcDoc={srcDoc}
                className="min-h-0 w-full flex-1 border-0 bg-[#f5f3ee]"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
