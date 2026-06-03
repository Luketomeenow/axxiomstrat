import { Gauge } from 'lucide-react'
import { countByStatus, progressPercent, type AeoPillarState } from '../../data/aeoAutomation'

export function AeoOverviewStrip({ pillars }: { pillars: AeoPillarState[] }) {
  const counts = countByStatus(pillars)
  const pct = progressPercent(pillars)

  return (
    <section className="rounded-3xl border border-[#1a3a5c]/40 bg-gradient-to-br from-[#0c1a2a] via-[#102338] to-[#0f2847]/90 p-6 sm:flex sm:items-center sm:gap-10 sm:p-8">
      <div className="relative mx-auto h-32 w-32 shrink-0 sm:mx-0">
        <svg viewBox="0 0 120 120" className="-rotate-90" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#aeoGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - pct / 100)}
            className="transition-[stroke-dashoffset] duration-700"
          />
          <defs>
            <linearGradient id="aeoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0b44a" />
              <stop offset="100%" stopColor="#1a3a5c" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold tabular-nums text-white">{pct}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/80">
            Progress
          </span>
        </div>
      </div>
      <div className="mt-6 flex-1 sm:mt-0">
        <div className="flex items-center gap-2 text-amber-200/90">
          <Gauge className="h-5 w-5" aria-hidden />
          <p className="text-xs font-semibold uppercase tracking-[0.2em]">AEO automation hub</p>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Six playbook-aligned workstreams for answer-engine visibility across the 7-brand network.
          Track manual progress now; Python automation connects in Phase 2.
        </p>
        <dl className="mt-5 grid grid-cols-3 gap-3 sm:max-w-md">
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-emerald-300/90">Done</dt>
            <dd className="font-display text-xl font-semibold text-emerald-100">{counts.done}</dd>
          </div>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-amber-200/90">In progress</dt>
            <dd className="font-display text-xl font-semibold text-amber-50">{counts.in_progress}</dd>
          </div>
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase text-slate-400">Not started</dt>
            <dd className="font-display text-xl font-semibold text-slate-200">{counts.not_started}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
