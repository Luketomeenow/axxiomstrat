import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Gauge,
  LoaderCircle,
  Map,
  Plus,
  Presentation,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import {
  allDashboardItems,
  CATEGORY_ACCENT,
  countByStatus,
  progressPercent,
  STATUS_META,
  STATUS_ORDER,
  type RoadmapDashboardCategory,
  type RoadmapItemStatus,
} from '../data/aiRoadmapDashboard'
import { useAiRoadmapDashboard } from '../hooks/useAiRoadmapDashboard'

function OverallProgressRing({ percent }: { percent: number }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - percent / 100)
  return (
    <div className="relative mx-auto h-36 w-36 sm:mx-0">
      <svg viewBox="0 0 120 120" className="-rotate-90" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#roadmapDashGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <defs>
          <linearGradient id="roadmapDashGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(99,102,241)" />
            <stop offset="100%" stopColor="rgb(45,212,191)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-semibold tabular-nums text-white">
          {percent}%
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Overall
        </span>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: RoadmapItemStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        meta.badge,
      ].join(' ')}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  )
}

function RoadmapItemCard({
  label,
  status,
  onStatusChange,
  onRemove,
}: {
  label: string
  status: RoadmapItemStatus
  onStatusChange: (status: RoadmapItemStatus) => void
  onRemove: () => void
}) {
  return (
    <article
      className={[
        'group flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.8)] ring-1 ring-inset transition-colors',
        STATUS_META[status].ring,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold leading-snug text-white">{label}</h3>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-lg p-1.5 text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-300 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
          aria-label={`Remove ${label}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <StatusPill status={status} />

      <div
        className="grid grid-cols-3 gap-1 rounded-xl bg-black/25 p-1 ring-1 ring-inset ring-white/[0.05]"
        role="group"
        aria-label={`Status for ${label}`}
      >
        {STATUS_ORDER.map((s) => {
          const active = status === s
          const Icon =
            s === 'done' ? CheckCircle2 : s === 'in_progress' ? LoaderCircle : Circle
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              aria-pressed={active}
              className={[
                'flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors',
                active
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300',
              ].join(' ')}
            >
              <Icon
                className={[
                  'h-3.5 w-3.5',
                  s === 'in_progress' && active ? 'animate-spin' : '',
                ].join(' ')}
                aria-hidden
              />
              <span className="leading-none">
                {s === 'not_started' ? 'Queued' : s === 'in_progress' ? 'Active' : 'Done'}
              </span>
            </button>
          )
        })}
      </div>
    </article>
  )
}

function CategorySection({
  category,
  onStatusChange,
  onAddItem,
  onRemoveItem,
}: {
  category: RoadmapDashboardCategory
  onStatusChange: (itemId: string, status: RoadmapItemStatus) => void
  onAddItem: (label: string) => boolean
  onRemoveItem: (itemId: string) => void
}) {
  const [draft, setDraft] = useState('')
  const accent = CATEGORY_ACCENT[category.id] ?? CATEGORY_ACCENT.marketing
  const counts = countByStatus(category.items)
  const pct = progressPercent(category.items)

  const handleAdd = () => {
    if (onAddItem(draft)) setDraft('')
  }

  return (
    <section
      className={[
        'rounded-3xl border bg-gradient-to-br p-6 sm:p-8',
        accent.border,
        accent.gradient,
      ].join(' ')}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${accent.icon}`}>
            Workstream
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-white">
            {category.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400">{category.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-200 ring-1 ring-emerald-500/25">
            {counts.done} done
          </span>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 font-medium text-amber-100 ring-1 ring-amber-500/25">
            {counts.in_progress} in progress
          </span>
          <span className="rounded-full bg-slate-500/10 px-3 py-1 font-medium text-slate-300 ring-1 ring-slate-500/25">
            {counts.not_started} not started
          </span>
          <span className="ml-auto font-display text-lg font-semibold tabular-nums text-white sm:ml-0">
            {pct}%
          </span>
        </div>
      </header>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category.title} progress`}
        />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <li key={item.id}>
            <RoadmapItemCard
              label={item.label}
              status={item.status}
              onStatusChange={(status) => onStatusChange(item.id, status)}
              onRemove={() => onRemoveItem(item.id)}
            />
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor={`add-${category.id}`}>
          Add item to {category.title}
        </label>
        <input
          id={`add-${category.id}`}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd()
          }}
          placeholder="Add a work item…"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!draft.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add item
        </button>
      </div>
    </section>
  )
}

export function AiRoadmapDashboardPage() {
  const { categories, setItemStatus, addItem, removeItem, resetToDefaults } =
    useAiRoadmapDashboard()

  const allItems = useMemo(() => allDashboardItems(categories), [categories])
  const overallPct = progressPercent(allItems)
  const totals = countByStatus(allItems)

  const handleReset = () => {
    if (
      window.confirm(
        'Reset all items to the default roadmap list? Your status changes and custom items will be cleared.',
      )
    ) {
      resetToDefaults()
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.06] bg-slate-950/80 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Hub
            </Link>
            <div className="min-w-0 border-l border-white/10 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/80">
                May 2026 → May 2027
              </p>
              <h1 className="truncate font-display text-lg font-semibold text-white sm:text-xl">
                AI roadmap · live progress
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/airoadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <Presentation className="h-4 w-4 opacity-70" aria-hidden />
              Presentation
            </Link>
            <Link
              to="/axxiomairoadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:text-white"
            >
              <Map className="h-4 w-4 opacity-70" aria-hidden />
              Full roadmap
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-amber-500/30 hover:text-amber-200"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset defaults
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
        <section className="mb-10 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:flex sm:items-center sm:gap-10 sm:p-8">
          <OverallProgressRing percent={overallPct} />
          <div className="mt-6 flex-1 sm:mt-0">
            <div className="flex items-center gap-2 text-indigo-300/90">
              <Gauge className="h-5 w-5" aria-hidden />
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Roadmap overview
              </p>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              Track what is queued, in progress, and done across marketing, data
              architecture, and operations. Progress saves automatically in this
              browser — add items or adjust status as the roadmap evolves.
            </p>
            <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90">
                  Done
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-emerald-100">
                  {totals.done}
                </dd>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">
                  In progress
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-amber-50">
                  {totals.in_progress}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-500/25 bg-slate-500/5 px-4 py-3">
                <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Not started
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-slate-200">
                  {totals.not_started}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Overall % weights in-progress items at 50% — done counts as 100%.
            </p>
          </div>
        </section>

        <div className="space-y-10">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onStatusChange={(itemId, status) =>
                setItemStatus(category.id, itemId, status)
              }
              onAddItem={(label) => addItem(category.id, label)}
              onRemoveItem={(itemId) => removeItem(category.id, itemId)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
