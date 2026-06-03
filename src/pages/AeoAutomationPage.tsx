import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, RotateCcw, Sparkles } from 'lucide-react'
import { AeoOverviewStrip } from '../components/aeo-automation/AeoOverviewStrip'
import { AeoPillarCard } from '../components/aeo-automation/AeoPillarCard'
import { AEO_PILLAR_DEFINITIONS } from '../data/aeoAutomation'
import { useAeoAutomation } from '../hooks/useAeoAutomation'

export function AeoAutomationPage() {
  const { pillars, hydrated, setPillarStatus, setPillarNotes, resetPillars } = useAeoAutomation()

  const handleReset = () => {
    if (window.confirm('Reset all pillar status and notes to defaults?')) {
      resetPillars()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1522] font-sans text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(26,58,92,0.45),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_100%_0%,rgba(240,180,74,0.08),transparent_50%)]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-[#1a3a5c]/50 bg-[#0c1a2a]/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Hub
            </Link>
            <div className="min-w-0 border-l border-white/10 pl-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200/85">
                AI Intelligence
              </p>
              <h1 className="truncate font-display text-lg font-semibold text-white sm:text-xl">
                AEO Automation
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/aeogeoplaybook"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/35 bg-amber-500/15 px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-500/25"
            >
              <BookOpenCheck className="h-4 w-4" aria-hidden />
              Execution playbook
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-400 hover:text-amber-200"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
        {!hydrated ? (
          <p className="text-center text-sm text-slate-400">Loading…</p>
        ) : (
          <>
            <AeoOverviewStrip pillars={pillars} />

            <section className="mt-10">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-300" aria-hidden />
                <h2 className="font-display text-xl font-semibold text-white">Automation pillars</h2>
              </div>
              <p className="mb-6 max-w-3xl text-sm text-slate-400">
                Grounded in the{' '}
                <Link to="/aeogeoplaybook" className="text-amber-200 underline-offset-2 hover:underline">
                  AEO execution playbook
                </Link>
                . When Phase 2 ships, each pillar will run Python jobs (crawl, content, schema, reports)
                from this hub.
              </p>
              <ul className="grid gap-4 lg:grid-cols-2">
                {AEO_PILLAR_DEFINITIONS.map((def) => {
                  const state = pillars.find((p) => p.id === def.id)
                  if (!state) return null
                  return (
                    <li key={def.id}>
                      <AeoPillarCard
                        state={state}
                        onStatusChange={(status) => setPillarStatus(def.id, status)}
                        onNotesChange={(notes) => setPillarNotes(def.id, notes)}
                      />
                    </li>
                  )
                })}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
