import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { RoadmapSlide } from '../../data/aiRoadmapSlides'

/** Hover / focus tooltip for chart percentages (keyboard-accessible). Uses a portal so text is not clipped by scroll parents. */
function DeckHoverPct({
  pct,
  insight,
  hint = 'Hover or focus for detail',
  buttonClassName,
}: {
  pct: number
  insight: string
  hint?: string
  /** Extra classes for the percentage control (e.g. larger closing gauge) */
  buttonClassName?: string
}) {
  const rawId = useId()
  const tipId = `deck-pct-${rawId.replace(/:/g, '')}`
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 320 })

  const place = useCallback(() => {
    const el = btnRef.current
    if (!el || typeof window === 'undefined') return
    const r = el.getBoundingClientRect()
    const maxW = 352
    const width = Math.min(maxW, window.innerWidth - 24)
    const left = Math.min(Math.max(12, r.right - width), window.innerWidth - width - 12)
    const estH = 160
    let top = r.bottom + 10
    if (top + estH > window.innerHeight - 12) {
      top = Math.max(12, r.top - estH - 10)
    }
    setPos({ top, left, width })
  }, [])

  const show = useCallback(() => {
    place()
    setOpen(true)
  }, [place])

  const hide = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open) return
    const onScroll = () => hide()
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [open, hide])

  return (
    <>
      <span className="relative inline-flex shrink-0 flex-col items-end text-right">
        <button
          ref={btnRef}
          type="button"
          className={[
            'rounded-md border border-transparent px-2 py-0.5 text-sm font-bold tabular-nums text-white outline-none ring-offset-2 ring-offset-[#060a14] transition-colors hover:border-white/15 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-indigo-400/90',
            buttonClassName ?? '',
          ].join(' ')}
          aria-describedby={open ? tipId : undefined}
          title={insight}
          onMouseEnter={show}
          onMouseLeave={hide}
          onFocus={show}
          onBlur={hide}
        >
          {pct}%
        </button>
        <span className="sr-only">{hint}</span>
      </span>
      {open
        ? createPortal(
            <span
              id={tipId}
              role="tooltip"
              style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 9999,
              }}
              className="pointer-events-none rounded-xl border border-white/15 bg-slate-950/98 p-3 text-left text-[13px] leading-snug text-slate-200 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/10 backdrop-blur-md"
            >
              {insight}
            </span>,
            document.body,
          )
        : null}
    </>
  )
}

/** Remount wrapper resets CSS animations when the slide changes */
function VizShell({
  children,
  slideId,
  className = '',
}: {
  children: ReactNode
  slideId: string
  className?: string
}) {
  return (
    <div
      key={slideId}
      className={[
        'deck-viz-shell group relative w-full overflow-visible rounded-2xl border border-white/[0.08] bg-slate-950/40 p-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.04] backdrop-blur-md sm:rounded-3xl sm:p-6',
        className,
      ].join(' ')}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_0%,transparent_42%,rgba(99,102,241,0.06)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        aria-hidden
      />
      <div className="relative z-[1] overflow-visible">{children}</div>
    </div>
  )
}

function BarRow({
  label,
  pct,
  colorClass,
  delayMs,
  glow = true,
  insight,
}: {
  label: string
  pct: number
  colorClass: string
  delayMs: number
  glow?: boolean
  /** Shown in a tooltip when hovering or focusing the percentage */
  insight?: string
}) {
  return (
    <div className="group/bar space-y-2">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <span className="min-w-0 max-w-[min(100%,28rem)] flex-1 text-sm font-medium leading-snug text-slate-200 sm:text-[15px]">
          {label}
        </span>
        {insight ? (
          <DeckHoverPct pct={pct} insight={insight} />
        ) : (
          <span className="shrink-0 px-2 py-0.5 text-sm font-bold tabular-nums text-slate-300">
            {pct}%
          </span>
        )}
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-inset ring-white/[0.07] sm:h-3.5">
        <div
          className={[
            'deck-bar-fill h-full rounded-full bg-gradient-to-r',
            glow ? 'deck-bar-fill-glow' : '',
            colorClass,
          ].join(' ')}
          style={
            {
              '--deck-bar-pct': `${pct}%`,
              animationDelay: `${delayMs}ms`,
            } as CSSProperties
          }
        />
      </div>
    </div>
  )
}

function TitleSparkline() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300/90">
          Trajectory
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-slate-400">
          From fragmented signals to governed data — then agents on top.
        </p>
      </div>
      <svg
        viewBox="0 0 200 80"
        className="deck-stroke-draw h-24 w-full max-w-[280px] shrink-0 sm:h-28"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="titleFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(129, 140, 248)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(129, 140, 248)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 62 L28 58 L52 52 L76 44 L100 38 L124 28 L148 20 L172 12 L200 6"
          fill="none"
          stroke="rgb(165, 180, 252)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="deck-path-draw"
        />
        <path
          d="M0 62 L28 58 L52 52 L76 44 L100 38 L124 28 L148 20 L172 12 L200 6 L200 80 L0 80 Z"
          fill="url(#titleFill)"
          className="deck-fill-fade"
        />
        <circle cx="200" cy="6" r="4" fill="rgb(196, 181, 253)" className="deck-dot-pulse" />
      </svg>
    </div>
  )
}

function PrincipleLayers() {
  const layers = [
    {
      label: 'Ingestion & lakehouse',
      pct: 100,
      cls: 'from-sky-500 to-indigo-500',
      d: 0,
      insight:
        'First workstream: daily loads and staging discipline. Every later dashboard, model, and agent assumes this layer is reliable and auditable.',
    },
    {
      label: 'Governance & keys',
      pct: 85,
      cls: 'from-indigo-500 to-violet-500',
      d: 90,
      insight:
        'Key Vault, roles, and retention policies so BI embeds and agent traces never leak secrets or raw PII beyond what compliance allows.',
    },
    {
      label: 'Dashboards & attribution',
      pct: 70,
      cls: 'from-violet-500 to-fuchsia-500',
      d: 180,
      insight:
        'Depends on clean joins (especially campaign_id). Until spend, leads, and calls line up, leadership will not trust ROAS narratives.',
    },
    {
      label: 'Agents & ML (on clean data)',
      pct: 55,
      cls: 'from-fuchsia-500 to-amber-400',
      d: 270,
      insight:
        'LangChain / LangGraph scale only after the bars below stay “green.” Agents amplify whatever signal quality you feed them.',
    },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div className="space-y-4">
        {layers.map((L) => (
          <BarRow
            key={L.label}
            label={L.label}
            pct={L.pct}
            colorClass={L.cls}
            delayMs={L.d}
            glow={false}
            insight={L.insight}
          />
        ))}
      </div>
      <div className="relative flex min-h-[140px] items-center justify-center rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.07] p-4 ring-1 ring-inset ring-white/[0.04]">
        <div className="deck-orbit text-center text-sm text-slate-300">
          <p className="font-semibold text-white">Sequence</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            Bottom layers must reach green before the top layer scales — otherwise agents amplify
            noise.
          </p>
        </div>
      </div>
    </div>
  )
}

function TimelineGantt({ slide }: { slide: RoadmapSlide }) {
  const phases = slide.timeline ?? []
  const totalWeight = phases.length || 1
  return (
    <div className="space-y-4">
      <div className="flex h-14 overflow-hidden rounded-xl border border-white/10 bg-black/35 ring-1 ring-inset ring-white/[0.04] sm:h-16 sm:rounded-2xl">
        {phases.map((p, i) => (
          <div
            key={p.month}
            className="deck-gantt-seg relative flex min-w-0 flex-col justify-end border-r border-white/5 p-2 last:border-r-0"
            style={{
              flex: `1 1 ${100 / totalWeight}%`,
              animationDelay: `${80 * i}ms`,
            }}
          >
            <div
              className={[
                'absolute inset-x-1 bottom-1 top-2 rounded-lg border opacity-90 deck-gantt-inner',
                p.accent === 'danger' && 'border-rose-400/50 bg-gradient-to-t from-rose-600/50 to-rose-500/20',
                p.accent === 'amber' && 'border-amber-400/50 bg-gradient-to-t from-amber-600/45 to-amber-500/20',
                p.accent === 'green' && 'border-emerald-400/50 bg-gradient-to-t from-emerald-600/45 to-emerald-500/20',
                p.accent === 'blue' && 'border-sky-400/50 bg-gradient-to-t from-sky-600/45 to-sky-500/20',
                p.accent === 'purple' && 'border-violet-400/50 bg-gradient-to-t from-violet-600/45 to-violet-500/20',
                p.accent === 'success' && 'border-teal-400/50 bg-gradient-to-t from-teal-600/45 to-teal-500/20',
              ]
                .filter(Boolean)
                .join(' ')}
            />
            <span className="relative z-[1] truncate text-[10px] font-bold text-white/95 sm:text-xs">
              {p.month}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-400 sm:justify-start">
        {phases.map((p) => (
          <span
            key={p.phase}
            className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 ring-1 ring-inset ring-white/[0.03]"
          >
            <span className="text-slate-500">{p.month}:</span> {p.phase}
          </span>
        ))}
      </div>
    </div>
  )
}

function MilestoneLadder() {
  const items = [
    {
      t: "May '26",
      h: 'Foundation + first automations',
      v: 25,
      insight:
        'Roughly the first four weeks: connectors, UTMs, and first GHL flows. The bar is low because you are proving plumbing, not full automation coverage yet.',
    },
    {
      t: "Aug '26",
      h: 'Attribution + GHL suite live',
      v: 50,
      insight:
        'Three-month checkpoint: marketing automations running and attribution visible in Power BI. Half the annual arc — still proving repeatability before heavy ops scope.',
    },
    {
      t: "May '27",
      h: 'ML-ready ops + marketing history',
      v: 100,
      insight:
        'Year-end north star: twelve months of reconciled marketing and ops history suitable for Azure ML, dispatch agents, and defensible reporting.',
    },
  ]
  return (
    <div className="relative pl-3 sm:pl-4">
      <div
        className="absolute left-[17px] top-4 z-0 h-[calc(100%-2rem)] w-1 rounded-full bg-gradient-to-b from-fuchsia-500/85 via-indigo-500 to-teal-400/90 shadow-[0_0_20px_rgba(99,102,241,0.35)]"
        aria-hidden
      />
      <ul className="relative z-[1] m-0 list-none space-y-8 p-0 sm:space-y-10">
        {items.map((m, i) => (
          <li
            key={m.t}
            className="deck-milestone-row relative flex gap-4 sm:gap-5"
            style={{ animationDelay: `${100 * i}ms` }}
          >
            <div className="relative flex w-9 shrink-0 justify-center sm:w-10">
              <div
                className="relative z-[2] flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-400/55 bg-[#060a14] text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_28px_rgba(99,102,241,0.45)] sm:h-10 sm:w-10"
                aria-hidden
              >
                {i + 1}
              </div>
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <p className="min-w-0 text-sm leading-snug text-slate-200 sm:text-base">
                  <span className="font-semibold text-indigo-200">{m.t}</span>{' '}
                  <span className="text-slate-400">{m.h}</span>
                </p>
                <DeckHoverPct pct={m.v} insight={m.insight} hint="Why this milestone fill" />
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/50 ring-1 ring-inset ring-white/[0.07] sm:h-3.5">
                <div
                  className="deck-bar-fill h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 deck-bar-fill-glow"
                  style={
                    {
                      '--deck-bar-pct': `${m.v}%`,
                      animationDelay: `${220 + i * 140}ms`,
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function OutcomeMeters() {
  const rows = [
    {
      label: 'Marketing → Fabric → BI',
      v: 92,
      insight:
        'Illustrative “readiness” at year-end: eight marketing sources landed in Delta with live Power BI. High score because APIs are better bounded than internal ops objects.',
    },
    {
      label: 'Automations (GHL / Zapier)',
      v: 88,
      insight:
        'Covers lead response, nurture, reviews, renewals, and outbound loops. Slightly below data layer because workflow edge cases and human approvals still matter.',
    },
    {
      label: 'Ops data (FieldBoss / D365)',
      v: 78,
      insight:
        'Starts in Phase 3: richer entities, more exceptions, and bidirectional writes. Lower than marketing until FieldBoss + Dynamics paths are stable in Fabric.',
    },
    {
      label: 'Agent-ready history',
      v: 72,
      insight:
        'Needs months of reconciled joins and labels — not just raw rows. Score reflects dependency on everything upstream staying clean for four quarters.',
    },
    {
      label: 'Foundry on Fabric',
      v: 58,
      insight:
        'Later unlock: valuable once the lakehouse is trusted. Depends on governance, cost controls, and a clear “which workflows go to Foundry” boundary.',
    },
    {
      label: 'Claude Teams skills',
      v: 55,
      insight:
        'Rollout and prompt-library work across departments. Lowest relative bar because it is organizational velocity as much as technical readiness.',
    },
  ]
  return (
    <div className="grid max-w-2xl gap-4">
      {rows.map((r, i) => (
        <BarRow
          key={r.label}
          label={r.label}
          pct={r.v}
          colorClass="from-indigo-400 via-violet-500 to-fuchsia-500"
          delayMs={70 * i}
          insight={r.insight}
        />
      ))}
    </div>
  )
}

function SchemaConstellation() {
  const nodes = [
    { id: 'cdm', x: 50, y: 16, label: 'campaign_daily_metrics' },
    { id: 'la', x: 18, y: 44, label: 'lead_attribution' },
    { id: 'ct', x: 82, y: 44, label: 'call_tracking' },
    { id: 'ga4', x: 22, y: 68, label: 'ga4_sessions' },
    { id: 'ob', x: 50, y: 74, label: 'outbound_pipeline' },
    { id: 'gbp', x: 78, y: 68, label: 'gbp_reviews' },
  ]
  const edges = [
    ['cdm', 'la'],
    ['cdm', 'ct'],
    ['la', 'ob'],
    ['la', 'ga4'],
    ['ct', 'la'],
    ['gbp', 'la'],
  ]
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]))
  return (
    <div className="mx-auto w-full max-w-lg px-1">
      <svg
        viewBox="0 0 100 90"
        className="deck-node-fade mx-auto h-52 w-full max-h-[280px] sm:h-60"
        preserveAspectRatio="xMidYMid meet"
      >
        {edges.map(([a, b], i) => (
          <line
            key={`${a}-${b}-${i}`}
            x1={pos[a].x}
            y1={pos[a].y}
            x2={pos[b].x}
            y2={pos[b].y}
            stroke="rgba(148,163,184,0.38)"
            strokeWidth="0.65"
            className="deck-edge-draw"
            style={{ animationDelay: `${40 * i}ms` }}
          />
        ))}
        {nodes.map((n, i) => (
          <g key={n.id} className="deck-node-pop" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <circle
              cx={n.x}
              cy={n.y}
              r="6.5"
              fill="rgba(15,23,42,0.95)"
              stroke="rgb(129,140,248)"
              strokeWidth="0.85"
            />
            <text
              x={n.x}
              y={n.y + 12}
              textAnchor="middle"
              fill="rgb(226,232,240)"
              style={{ fontSize: '6.25px' }}
            >
              {n.label.replace(/_/g, ' ')}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function AttributionFlow() {
  const steps = ['Spend', 'Clicks', 'Calls', 'Forms', 'Pipeline', 'ARR']
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className="deck-flow-box rounded-xl border border-white/[0.1] bg-white/[0.05] px-3 py-2.5 text-center text-[11px] font-semibold text-slate-100 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] ring-1 ring-inset ring-white/[0.05] sm:px-3.5 sm:text-xs"
              style={{ animationDelay: `${100 * i}ms` }}
            >
              {s}
            </div>
            {i < steps.length - 1 ? (
              <span className="mx-0.5 text-indigo-400/80 sm:mx-1" aria-hidden>
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-500/[0.08] px-4 py-4 text-center ring-1 ring-inset ring-amber-200/10 backdrop-blur-sm">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-200/90">
          campaign_id
        </span>
        <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-black/30">
          <div
            className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 deck-pulse-bar"
            style={{ animationDelay: '600ms' }}
          />
        </div>
        <p className="text-[11px] text-amber-100/80">One key end-to-end — or the ROAS story breaks.</p>
      </div>
    </div>
  )
}

function PhaseGauge({ step, label }: { step: 1 | 2 | 3 | 4; label: string }) {
  const pct = step * 25
  const r = 36
  const circumference = 2 * Math.PI * r
  const targetOffset = circumference * (1 - pct / 100)
  const gradId = `phaseGrad-${step}`
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            className="deck-ring-spin"
            style={
              {
                '--deck-ring-circ': `${circumference}`,
                '--deck-ring-target': `${targetOffset}`,
              } as CSSProperties
            }
          />
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(99,102,241)" />
              <stop offset="100%" stopColor="rgb(45,212,191)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold tabular-nums text-white">{pct}%</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Year arc
          </span>
        </div>
      </div>
      <p className="max-w-xs text-center text-sm text-slate-400 sm:text-left">{label}</p>
    </div>
  )
}

function StackBars() {
  const groups = [
    {
      label: 'Marketing · 8 tools',
      n: 8,
      cls: 'from-rose-500 to-orange-400',
      insight:
        'Normalized to the largest group in the stack map (8 tools). 100% here means “full breadth on day one,” not that the work is finished — connectors still need hardening.',
    },
    {
      label: 'Ops · 5 tools',
      n: 5,
      cls: 'from-amber-500 to-yellow-300',
      insight:
        'Five active ops integrations in the appendix, but they start later (Month 4+). The lower bar length is relative surface area vs marketing, not a quality score.',
    },
    {
      label: 'Data · 5 tools',
      n: 5,
      cls: 'from-sky-500 to-cyan-400',
      insight:
        'OneLake, staging lakehouse, Delta, Power BI, Key Vault — same count as ops, but begins Month 1 because marketing feeds the first trusted datasets.',
    },
    {
      label: 'AI / ML · 8 tools',
      n: 8,
      cls: 'from-violet-500 to-fuchsia-500',
      insight:
        'LangChain/Graph, LangSmith, vectors, OpenAI, Azure ML, etc. Breadth matches marketing because the roadmap assumes a full retrieval + eval stack — ramp is phased, not day-one.',
    },
    {
      label: 'Deploy · 4 tools',
      n: 4,
      cls: 'from-slate-500 to-slate-300',
      insight:
        'Railway for dev agents, Vercel for web, Container Apps + Event Grid for prod paths. Smaller footprint by design until workloads stabilize.',
    },
    {
      label: 'Future AI · 3 tools',
      n: 3,
      cls: 'from-indigo-400 to-indigo-200',
      insight:
        'Foundry, Claude Teams, Copilot Studio — fewer tools, but each depends on enterprise readiness and data contracts landing first.',
    },
  ]
  const max = Math.max(...groups.map((g) => g.n))
  return (
    <div className="mx-auto grid max-w-lg gap-4">
      {groups.map((g, i) => {
        const pct = Math.round((g.n / max) * 100)
        return (
          <BarRow
            key={g.label}
            label={g.label}
            pct={pct}
            colorClass={g.cls}
            delayMs={80 * i}
            insight={g.insight}
          />
        )
      })}
    </div>
  )
}

function VectorFlow() {
  const blocks = [
    { t: 'Voyage AI', s: 'Embeddings' },
    { t: 'Qdrant', s: 'Agent memory' },
    { t: 'MongoDB', s: 'Metadata + vectors' },
  ]
  return (
    <div className="mx-auto flex max-w-lg flex-col items-stretch gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-2">
      {blocks.map((b, i) => (
        <div key={b.t} className="flex flex-1 items-center gap-2 sm:flex-col">
          <div
            className="deck-flow-box flex-1 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-4 py-4 text-center sm:w-full"
            style={{ animationDelay: `${100 * i}ms` }}
          >
            <p className="text-sm font-semibold text-white">{b.t}</p>
            <p className="mt-1 text-xs text-indigo-200/80">{b.s}</p>
          </div>
          {i < blocks.length - 1 ? (
            <span
              className="shrink-0 text-lg text-indigo-400/60 sm:mt-0 sm:px-1 sm:pt-10 sm:text-xl"
              aria-hidden
            >
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function RiskBars() {
  const rows = [
    {
      label: 'UTM / campaign_id hygiene',
      v: 92,
      insight:
        'Highest attention: one missing or inconsistent campaign_id breaks the chain from spend → lead → call → revenue. Fixing this in May is cheaper than debugging ROAS in Q4.',
    },
    {
      label: 'FieldBoss API complexity',
      v: 76,
      insight:
        'Rate limits, partial payloads, and mapping tech notes to structured codes all expand scope. Buffer integration time before agents read from FieldBoss directly.',
    },
    {
      label: 'PII in traces (LangSmith)',
      v: 68,
      insight:
        'Agents and eval tools can log prompts that contain names or phones. Plan redaction, sampling, and retention up front so compliance does not stall shipping.',
    },
    {
      label: 'Change mgmt (Aug gate)',
      v: 58,
      insight:
        'August leadership readout effectively funds Phase 3. Narrative risk — not only technical — if dashboards do not tell a crisp story by then.',
    },
  ]
  return (
    <div className="mx-auto grid max-w-lg gap-4">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Relative attention needed (illustrative)
      </p>
      {rows.map((r, i) => (
        <BarRow
          key={r.label}
          label={r.label}
          pct={r.v}
          colorClass="from-amber-500 via-orange-500 to-rose-500"
          delayMs={70 * i}
          insight={r.insight}
        />
      ))}
    </div>
  )
}

function ClosingGauge() {
  const r = 38
  const circumference = 2 * Math.PI * r
  const pct = 88
  const targetOffset = circumference * (1 - pct / 100)
  const insight =
    'Composite “handoff readiness” for opening the full HTML roadmap: data layers staged, automations in flight, and governance conversations started — not a literal project metric.'
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-2">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgb(45,212,191)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            className="deck-ring-spin"
            style={
              {
                '--deck-ring-circ': `${circumference}`,
                '--deck-ring-target': `${targetOffset}`,
              } as CSSProperties
            }
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <DeckHoverPct
            pct={pct}
            insight={insight}
            hint="What this percentage represents"
            buttonClassName="text-2xl font-bold text-teal-300 sm:text-3xl"
          />
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            readiness
          </span>
        </div>
      </div>
      <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
        Hover or focus the percentage for a short rationale (your browser also shows the same text as a native tooltip).
      </p>
    </div>
  )
}

export function RoadmapSlideVisual({ slide }: { slide: RoadmapSlide }) {
  const { id } = slide

  if (id === 'title') {
    return (
      <VizShell slideId={id}>
        <TitleSparkline />
      </VizShell>
    )
  }
  if (id === 'principle') {
    return (
      <VizShell slideId={id}>
        <PrincipleLayers />
      </VizShell>
    )
  }
  if (id === 'timeline') {
    return (
      <VizShell slideId={id}>
        <TimelineGantt slide={slide} />
      </VizShell>
    )
  }
  if (id === 'milestones') {
    return (
      <VizShell slideId={id}>
        <MilestoneLadder />
      </VizShell>
    )
  }
  if (id === 'outcomes') {
    return (
      <VizShell slideId={id}>
        <OutcomeMeters />
      </VizShell>
    )
  }
  if (id === 'schema-intro') {
    return (
      <VizShell slideId={id} className="min-h-[220px]">
        <SchemaConstellation />
      </VizShell>
    )
  }
  if (id === 'critical-join') {
    return (
      <VizShell slideId={id}>
        <AttributionFlow />
      </VizShell>
    )
  }
  if (id === 'phase-1') {
    return (
      <VizShell slideId={id}>
        <PhaseGauge step={1} label="Month 1: pipelines, GHL, first Power BI on live Delta." />
      </VizShell>
    )
  }
  if (id === 'phase-2') {
    return (
      <VizShell slideId={id}>
        <PhaseGauge step={2} label="Months 2–3: marketing automation completion + first LangChain agents." />
      </VizShell>
    )
  }
  if (id === 'phase-3') {
    return (
      <VizShell slideId={id}>
        <PhaseGauge step={3} label="Months 4–6: verify marketing, ingest ops, fault extraction, PM heuristics." />
      </VizShell>
    )
  }
  if (id === 'phase-4') {
    return (
      <VizShell slideId={id}>
        <PhaseGauge step={4} label="Months 7–12: LangGraph, Azure ML, Foundry, Claude Teams — production agents." />
      </VizShell>
    )
  }
  if (id === 'tech-stack') {
    return (
      <VizShell slideId={id}>
        <StackBars />
      </VizShell>
    )
  }
  if (id === 'vectors-mongo') {
    return (
      <VizShell slideId={id}>
        <VectorFlow />
      </VizShell>
    )
  }
  if (id === 'risks') {
    return (
      <VizShell slideId={id}>
        <RiskBars />
      </VizShell>
    )
  }
  if (id === 'closing') {
    return (
      <VizShell slideId={id}>
        <ClosingGauge />
      </VizShell>
    )
  }

  return null
}
