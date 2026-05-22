import { CheckCircle2, Circle, LoaderCircle } from 'lucide-react'
import { STATUS_ORDER, type RoadmapItemStatus } from '../../data/aiRoadmapDashboard'

export function StatusControls({
  status,
  onChange,
  label,
  compact = false,
}: {
  status: RoadmapItemStatus
  onChange: (status: RoadmapItemStatus) => void
  label: string
  compact?: boolean
}) {
  return (
    <div
      className={[
        'grid grid-cols-3 gap-1 rounded-xl bg-black/25 ring-1 ring-inset ring-white/[0.05]',
        compact ? 'p-0.5' : 'p-1',
      ].join(' ')}
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
            onClick={() => onChange(s)}
            aria-pressed={active}
            className={[
              'flex flex-col items-center gap-1 rounded-lg font-medium transition-colors',
              compact ? 'px-1 py-1.5 text-[9px]' : 'px-1 py-2 text-[10px]',
              active
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300',
            ].join(' ')}
          >
            <Icon
              className={[
                compact ? 'h-3 w-3' : 'h-3.5 w-3.5',
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
  )
}
