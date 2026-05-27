import { useEffect, useId, useState } from 'react'
import { Plus, X } from 'lucide-react'
import {
  CATEGORY_ACCENT,
  countByStatus,
  effectiveItemStatus,
  progressPercent,
  STATUS_META,
  type RoadmapDashboardCategory,
  type RoadmapDashboardItem,
  type RoadmapItemStatus,
  type RoadmapSubItem,
} from '../../data/aiRoadmapDashboard'
import { AutomationSubItemCard } from './AutomationSubItemCard'
import { StatusControls } from './StatusControls'

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

export function ItemDetailPanel({
  category,
  item,
  onClose,
  onItemStatusChange,
  onSubItemStatusChange,
  onSubItemUpdate,
  onAddSubItem,
  onRemoveSubItem,
}: {
  category: RoadmapDashboardCategory
  item: RoadmapDashboardItem
  onClose: () => void
  onItemStatusChange: (status: RoadmapItemStatus) => void
  onSubItemStatusChange: (subItemId: string, status: RoadmapItemStatus) => void
  onSubItemUpdate: (subItemId: string, patch: Partial<RoadmapSubItem>) => void
  onAddSubItem: (label: string) => boolean
  onRemoveSubItem: (subItemId: string) => void
}) {
  const formId = useId()
  const [draft, setDraft] = useState('')
  const accent = CATEGORY_ACCENT[category.id] ?? CATEGORY_ACCENT.marketing
  const effective = effectiveItemStatus(item)
  const subCounts = countByStatus(item.subItems)
  const subPct = progressPercent(item.subItems)
  const hasAutomations = item.subItems.length > 0

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleAdd = () => {
    if (onAddSubItem(draft)) setDraft('')
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close details"
      />

      <aside
        className={[
          'relative flex h-full w-full max-w-xl flex-col border-l border-white/[0.08] bg-slate-950 shadow-2xl',
          'animate-[roadmap-panel-slide-in_0.25s_ease-out]',
        ].join(' ')}
      >
        <header
          className={[
            'shrink-0 border-b border-white/[0.06] bg-gradient-to-br px-5 py-5 sm:px-6',
            accent.panel,
          ].join(' ')}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${accent.icon}`}>
                {category.title}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-white">{item.label}</h2>
              <p className="mt-2 text-sm text-slate-400">
                Add automations with details, links, and screenshots so the team can see what was
                built.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusPill status={effective} />
            {hasAutomations ? (
              <span className="text-xs text-slate-500">
                {subCounts.done}/{item.subItems.length} automations done · {subPct}%
              </span>
            ) : (
              <span className="text-xs text-slate-500">No automations yet — set block status below</span>
            )}
          </div>

          {hasAutomations ? (
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-[width] duration-500"
                style={{ width: `${subPct}%` }}
              />
            </div>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {!hasAutomations ? (
            <section className="mb-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
              <h3 className="text-sm font-semibold text-white">Block status</h3>
              <p className="mt-1 text-xs text-slate-500">
                Used on the overview card until you add automations below.
              </p>
              <div className="mt-3">
                <StatusControls
                  status={item.status}
                  onChange={onItemStatusChange}
                  label={item.label}
                />
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="text-sm font-semibold text-white">
              {hasAutomations ? 'Automations' : 'Add automations'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              e.g. GHL workflow, Zap, agent, or integration under {item.label}.
            </p>

            {hasAutomations ? (
              <ul className="mt-4 space-y-4">
                {item.subItems.map((sub) => (
                  <AutomationSubItemCard
                    key={sub.id}
                    sub={sub}
                    categoryId={category.id}
                    blockId={item.id}
                    onStatusChange={(status) => onSubItemStatusChange(sub.id, status)}
                    onUpdate={(patch) => onSubItemUpdate(sub.id, patch)}
                    onRemove={() => onRemoveSubItem(sub.id)}
                  />
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-center text-sm text-slate-500">
                No automations yet. Add your first one below.
              </p>
            )}
          </section>
        </div>

        <footer className="shrink-0 border-t border-white/[0.06] bg-slate-950/90 px-5 py-4 sm:px-6">
          <label className="sr-only" htmlFor={`${formId}-sub`}>
            Add automation for {item.label}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={`${formId}-sub`}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
              }}
              placeholder="Add automation or sub-task…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <button
              type="button"
              onClick={handleAdd}
              disabled={!draft.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add automation
            </button>
          </div>
        </footer>
      </aside>
    </div>
  )
}
