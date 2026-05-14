import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Database, Printer, Sparkles } from 'lucide-react'
import { buildStrategyIframeSrcDoc } from '../lib/strategyIframeDocument'

const DOC_PATH = '/qdrant_pinecone_fabric_comparison.html'

const TABS = [
  { index: 0, label: 'Overview' },
  { index: 1, label: 'Performance' },
  { index: 2, label: 'Full comparison' },
  { index: 3, label: 'Pricing' },
  { index: 4, label: 'When to use each' },
  { index: 5, label: 'For your stack' },
] as const

/** Same-origin iframe can call the fragment’s `go(n)` via postMessage bridge. */
function injectVectorTabBridge(srcDoc: string): string {
  const bridge = `<script>(function(){window.addEventListener("message",function(e){if(!e.data||e.data.type!=="VECTORDB_TAB"||typeof e.data.index!=="number")return;try{if(typeof go==="function")go(e.data.index)}catch(x){}});})();<\/script></body>`
  return srcDoc.replace('</body>', bridge)
}

export function VectorDbComparisonPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState(0)

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
        const doc = buildStrategyIframeSrcDoc(raw)
        setSrcDoc(injectVectorTabBridge(doc))
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
    const win = iframeRef.current?.contentWindow
    if (win) {
      win.postMessage({ type: 'VECTORDB_TAB', index }, '*')
    }
  }, [])

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-slate-950 font-sans text-white">
      <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-emerald-500/15 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950/80 px-4 py-3 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_0%_0%,rgba(16,185,129,0.12),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-emerald-400/35 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
              <Database className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                Reference · 2026
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
                Qdrant vs Pinecone vs Fabric
              </h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="relative inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-indigo-400/30 hover:text-white"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Print</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-slate-900/90 lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-b border-white/5 px-4 py-3 lg:px-4 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Document sections
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-400">
              Jump to the same tabs as inside the viewer — synced with the embedded controls.
            </p>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="Comparison sections"
          >
            {TABS.map((t) => (
              <button
                key={t.index}
                type="button"
                onClick={() => sendTab(t.index)}
                className={[
                  'whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors lg:w-full',
                  activeTab === t.index
                    ? 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/35'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-2 sm:p-3 lg:p-4">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_80%_20%,rgba(99,102,241,0.08),transparent)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_24px_48px_-12px_rgba(0,0,0,0.55)] backdrop-blur-sm lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-white/5 bg-slate-900/80 px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400/90" aria-hidden />
              <span className="text-[11px] font-medium text-slate-400">
                Vector DB &amp; AI platform comparison
              </span>
            </div>
            {loadError ? (
              <div className="flex flex-1 items-center justify-center p-6 text-sm text-red-300">
                {loadError}
              </div>
            ) : !srcDoc ? (
              <div className="flex flex-1 items-center justify-center text-slate-500">
                <span className="animate-pulse text-sm">Loading comparison…</span>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Qdrant vs Pinecone vs Microsoft Fabric comparison"
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
