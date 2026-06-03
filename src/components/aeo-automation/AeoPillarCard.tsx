import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenCheck, ChevronDown, ChevronUp, Cpu, ExternalLink } from 'lucide-react'
import {
  getPillarDefinition,
  playbookTabHref,
  STATUS_META,
  type AeoPillarState,
  type AeoPillarStatus,
} from '../../data/aeoAutomation'
import { StatusControls } from '../ai-roadmap-dashboard/StatusControls'

export function AeoPillarCard({
  state,
  onStatusChange,
  onNotesChange,
}: {
  state: AeoPillarState
  onStatusChange: (status: AeoPillarStatus) => void
  onNotesChange: (notes: string) => void
}) {
  const def = getPillarDefinition(state.id)
  const [expanded, setExpanded] = useState(false)
  const [notesDraft, setNotesDraft] = useState(state.notes ?? '')

  if (!def) return null

  const meta = STATUS_META[state.status]
  const playbookLink = playbookTabHref(def.playbookTab, def.playbookTabAlt)

  return (
    <article
      className={[
        'flex flex-col rounded-2xl border border-white/[0.08] bg-[#0c1828]/80 p-4 ring-1 ring-inset sm:p-5',
        meta.ring,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/75">
            {def.tagline}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold text-white">{def.title}</h2>
        </div>
        <span
          className={[
            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
            meta.badge,
          ].join(' ')}
        >
          {meta.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-400">{def.description}</p>

      <div className="mt-4">
        <StatusControls status={state.status} onChange={onStatusChange} label={def.title} compact />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2 text-left text-xs font-medium text-slate-300 hover:bg-white/[0.04]"
        aria-expanded={expanded}
      >
        <span>Checklist & notes</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        )}
      </button>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
          <ul className="space-y-1.5 text-sm text-slate-300">
            {def.checklist.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/80" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <label className="block">
            <span className="text-xs font-semibold text-slate-400">Notes</span>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => onNotesChange(notesDraft)}
              rows={2}
              placeholder="Team notes for this pillar…"
              className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link
          to={playbookLink}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/15 px-3 py-2.5 text-sm font-medium text-amber-50 hover:bg-amber-500/25"
        >
          <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden />
          Playbook section
          <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden />
        </Link>
        <button
          type="button"
          disabled
          title="Automation: coming in Phase 2"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-2.5 text-sm text-slate-500"
        >
          <Cpu className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
          Run {def.automationLabel}
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
            Phase 2
          </span>
        </button>
      </div>
    </article>
  )
}
