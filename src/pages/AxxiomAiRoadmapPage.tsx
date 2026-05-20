import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Map, Printer, Sparkles } from 'lucide-react'
import { buildStrategyIframeSrcDoc } from '../lib/strategyIframeDocument'

const DOC_PATH = '/axxiom_ai_roadmap_2026_2027.html'

const TABS = [
  { index: 0, label: 'Overview' },
  { index: 1, label: 'Data schema' },
  { index: 2, label: 'May — week by week' },
  { index: 3, label: 'Month 2–3' },
  { index: 4, label: 'Month 4–6' },
  { index: 5, label: 'Month 7–12' },
  { index: 6, label: 'Tech stack map' },
] as const

function injectRoadmapTabBridge(srcDoc: string): string {
  const bridge = `<script>(function(){window.addEventListener("message",function(e){if(!e.data||e.data.type!=="ROADMAP_TAB"||typeof e.data.index!=="number")return;try{if(typeof go==="function")go(e.data.index)}catch(x){}});})();<\/script></body>`
  return srcDoc.replace('</body>', bridge)
}

export function AxxiomAiRoadmapPage() {
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
        setSrcDoc(injectRoadmapTabBridge(doc))
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
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ROADMAP_TAB', index },
      '*',
    )
  }, [])

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0b1020] font-sans text-white">
      <header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-indigo-500/20 bg-gradient-to-r from-[#0f1428] via-[#12182f] to-indigo-950/60 px-4 py-3 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_15%_0%,rgba(99,102,241,0.15),transparent_50%)]"
          aria-hidden
        />
        <div className="relative flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-indigo-400/35 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-200">
              <Map className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-300/90">
                May 2026 — May 2027
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
                AI automation roadmap
              </h1>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="relative inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-violet-400/30 hover:text-white"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          <span className="hidden sm:inline">Print</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-[#0f1428]/95 lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-b border-white/5 px-4 py-3 lg:px-4 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Roadmap phases
            </p>
            <p className="mt-1 text-xs leading-snug text-slate-400">
              Mirrors the tabs inside the document. Week blocks still expand in the viewer.
            </p>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="Roadmap sections"
          >
            {TABS.map((t) => (
              <button
                key={t.index}
                type="button"
                onClick={() => sendTab(t.index)}
                className={[
                  'whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors lg:w-full',
                  activeTab === t.index
                    ? 'bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-400/40'
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
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_85%_15%,rgba(139,92,246,0.1),transparent)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0c1224]/90 shadow-[0_0_0_1px_rgba(99,102,241,0.08),0_24px_48px_-12px_rgba(0,0,0,0.55)] backdrop-blur-sm lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-300/90" aria-hidden />
              <span className="text-[11px] font-medium text-slate-500">
                Tool stack, schema, and milestones · styled for readability
              </span>
            </div>
            {loadError ? (
              <div className="flex flex-1 items-center justify-center p-6 text-sm text-red-300">
                {loadError}
              </div>
            ) : !srcDoc ? (
              <div className="flex flex-1 items-center justify-center text-slate-500">
                <span className="animate-pulse text-sm">Loading roadmap…</span>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Axxiom Elevator AI automation roadmap 2026–2027"
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
