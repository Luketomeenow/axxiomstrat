import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, LayoutGrid, Printer, Sparkles } from 'lucide-react'
import { buildFourCampaignIframeSrcDoc } from '../lib/fourCampaignIframeDocument'

const DOC_PATH = '/axxiom_4campaign_system.html'

type CampKey = 'c1' | 'c2' | 'c3' | 'c4'

const CAMPAIGNS: {
  n: number
  key: CampKey
  title: string
  short: string
  color: string
}[] = [
  { n: 1, key: 'c1', title: 'Maintenance contracts', short: 'Maintenance', color: '#1c4a8a' },
  { n: 2, key: 'c2', title: 'Modernization', short: 'Modernization', color: '#7a3000' },
  { n: 3, key: 'c3', title: 'Repair requests', short: 'Repair', color: '#8b1c1c' },
  { n: 4, key: 'c4', title: 'Code compliance', short: 'Compliance', color: '#1a6640' },
]

const INNER_DEFAULT = [
  'Strategy',
  'Funnel',
  'Ad copy',
  'Email sequence',
  'Landing page',
  'Targeting & budget',
] as const

const INNER_REPAIR = [
  'Strategy',
  'Funnel',
  'Ad copy',
  'Post-repair sequence',
  'Landing page',
  'Targeting & budget',
] as const

function innerLabels(campN: number): readonly string[] {
  return campN === 3 ? INNER_REPAIR : INNER_DEFAULT
}

export function Axxiom4CampaignPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [activeCampN, setActiveCampN] = useState(1)
  const [activeInner, setActiveInner] = useState(1)

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
        setSrcDoc(buildFourCampaignIframeSrcDoc(raw))
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setLoadError(e instanceof Error ? e.message : 'Failed to load')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const postToDoc = useCallback((msg: object) => {
    iframeRef.current?.contentWindow?.postMessage(msg, '*')
  }, [])

  const sendCamp = useCallback(
    (n: number) => {
      const camp = CAMPAIGNS.find((c) => c.n === n)
      if (!camp) return
      setActiveCampN(n)
      setActiveInner(1)
      postToDoc({ type: '4CAMP_CAMP', n })
      window.requestAnimationFrame(() => {
        postToDoc({ type: '4CAMP_INNER', camp: camp.key, num: 1 })
      })
    },
    [postToDoc],
  )

  const sendInner = useCallback(
    (num: number) => {
      const camp = CAMPAIGNS.find((c) => c.n === activeCampN)
      if (!camp) return
      setActiveInner(num)
      postToDoc({ type: '4CAMP_INNER', camp: camp.key, num })
    },
    [activeCampN, postToDoc],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement
      if (t.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (e.key >= '1' && e.key <= '4') {
        sendCamp(Number.parseInt(e.key, 10))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sendCamp])

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  const inners = innerLabels(activeCampN)

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0d0d0b] font-sans text-white">
      <div className="flex h-1 shrink-0 w-full" aria-hidden>
        {CAMPAIGNS.map((c) => (
          <div key={c.key} className="min-w-0 flex-1" style={{ backgroundColor: c.color }} />
        ))}
      </div>
      <header className="relative flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-gradient-to-r from-[#12120f] via-[#181816] to-[#141412] px-4 py-3 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_120%_at_0%_0%,rgba(255,255,255,0.06),transparent_50%)]"
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-1 items-center gap-3">
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-9 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-[#f7f5f0] shadow-[0_0_24px_rgba(255,255,255,0.06)]">
              <LayoutGrid className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Elevator marketing system
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
                4-service campaign playbook
              </h1>
            </div>
          </div>
        </div>
        <div className="relative flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-colors hover:border-white/20 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-[#10100d]/95 lg:w-64 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="border-b border-white/5 px-4 py-3 lg:px-4 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
              Navigate
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              Switch campaigns and deliverables — the viewer scrolls and highlights match the
              source document.
            </p>
          </div>

          <p className="px-4 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-white/40 lg:px-4">
            Campaign
          </p>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-2 pt-0.5 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-3 lg:pt-0"
            aria-label="Campaigns"
          >
            {CAMPAIGNS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => sendCamp(c.n)}
                className={[
                  'whitespace-nowrap rounded-xl border border-transparent px-3 py-2.5 text-left text-xs font-medium transition-all lg:w-full',
                  activeCampN === c.n
                    ? 'bg-white/[0.08] text-white ring-1 ring-white/15'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white',
                ].join(' ')}
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: activeCampN === c.n ? c.color : 'transparent',
                  paddingLeft: '0.65rem',
                }}
              >
                <span className="font-mono text-[10px] text-white/35">0{c.n}</span>
                <span className="mt-0.5 block font-medium">{c.title}</span>
              </button>
            ))}
          </nav>

          <p className="border-t border-white/5 px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/40 lg:px-4">
            Deliverables
          </p>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-0.5 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="Deliverables for selected campaign"
          >
            {inners.map((label, i) => {
              const num = i + 1
              return (
                <button
                  key={`${activeCampN}-${num}`}
                  type="button"
                  onClick={() => sendInner(num)}
                  className={[
                    'whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-medium transition-all lg:w-full',
                    activeInner === num
                      ? 'bg-white/[0.07] text-white ring-1 ring-white/12'
                      : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200',
                  ].join(' ')}
                >
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="hidden px-4 pb-4 lg:block">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-slate-500">
              <Sparkles className="mb-2 h-4 w-4 text-white/40" aria-hidden />
              Keys <kbd className="rounded bg-black/40 px-1 py-0.5 font-mono text-slate-400">1</kbd>–
              <kbd className="rounded bg-black/40 px-1 py-0.5 font-mono text-slate-400">4</kbd> jump
              campaigns. Use <kbd className="rounded bg-black/40 px-1 py-0.5 font-mono text-slate-400">Print</kbd>{' '}
              for PDF.
            </div>
          </div>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 p-2 sm:p-3 lg:p-5">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(28,74,138,0.12),transparent_55%)]"
            aria-hidden
          />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#faf9f6] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_28px_56px_-16px_rgba(0,0,0,0.55)] lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-black/[0.06] bg-white/85 px-3 py-2 backdrop-blur-sm">
              <span
                className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ color: CAMPAIGNS.find((c) => c.n === activeCampN)?.color ?? '#1c4a8a' }}
                aria-hidden
              />
              <span className="text-[11px] font-medium text-slate-600">
                {CAMPAIGNS.find((c) => c.n === activeCampN)?.short ?? 'Campaign'} ·{' '}
                {inners[activeInner - 1] ?? 'Section'}
              </span>
            </div>
            {loadError ? (
              <div className="flex flex-1 items-center justify-center bg-white p-6 text-sm text-red-700">
                {loadError}
              </div>
            ) : !srcDoc ? (
              <div className="flex flex-1 items-center justify-center bg-[#faf9f6] text-slate-500">
                <span className="animate-pulse text-sm font-medium">Loading campaign system…</span>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                title="Axxiom Elevator — 4-service marketing campaign"
                srcDoc={srcDoc}
                className="min-h-0 w-full flex-1 border-0 bg-[#faf9f6]"
                sandbox="allow-scripts allow-same-origin"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
