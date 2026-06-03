import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Map,
  Printer,
  Sparkles,
} from 'lucide-react'
import { RoadmapSlideContent } from '../components/ai-roadmap-presentation/RoadmapSlideContent'
import { AI_ROADMAP_SLIDES } from '../data/aiRoadmapSlides'

const TOTAL = AI_ROADMAP_SLIDES.length

export function AiRoadmapPresentationPage() {
  const [index, setIndex] = useState(0)

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(TOTAL - 1, next)))
  }, [])

  const prev = useCallback(() => go(index - 1), [go, index])
  const next = useCallback(() => go(index + 1), [go, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'ArrowRight':
          e.preventDefault()
          next()
          break
        case 'Home':
          e.preventDefault()
          go(0)
          break
        case 'End':
          e.preventDefault()
          go(TOTAL - 1)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, next, prev])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const slide = AI_ROADMAP_SLIDES[index]
  const progressPct = ((index + 1) / TOTAL) * 100

  return (
    <div className="ai-roadmap-deck-root relative flex h-screen min-h-0 flex-col overflow-hidden bg-[#050810] font-sans text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(85%_55%_at_50%_-18%,rgba(99,102,241,0.28),transparent_55%)] print:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_100%_0%,rgba(167,139,250,0.14),transparent_50%)] print:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_0%_100%,rgba(45,212,191,0.08),transparent_55%)] print:hidden"
        aria-hidden
      />

      {/* ——— Screen: single-slide presenter ——— */}
      <div className="ai-roadmap-deck-screen relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="relative z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-slate-950/55 px-4 py-3 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.65)] backdrop-blur-md sm:px-6">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(99,102,241,0.08),transparent_40%)]"
            aria-hidden
          />
          <div className="relative flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/[0.04] transition-[background-color,border-color,transform] hover:border-indigo-400/35 hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Back to Strategy hub</span>
              <span className="sm:hidden">Hub</span>
            </Link>
            <div className="hidden h-8 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" aria-hidden />
            <div className="flex min-w-0 items-center gap-2">
              <Sparkles className="h-5 w-5 shrink-0 text-indigo-300" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">AI roadmap</p>
                <p className="truncate text-xs text-slate-400">Presentation · May 2026 – May 2027</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center gap-2">
            <Link
              to="/axxiomairoadmap"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/35 bg-indigo-500/15 px-3 py-2 text-sm font-semibold text-indigo-100 ring-1 ring-inset ring-indigo-300/20"
            >
              <Map className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden md:inline">Open full roadmap (reference)</span>
              <span className="md:hidden">Full doc</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-inset ring-white/[0.04] hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              <Printer className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Print / PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden" aria-live="polite" aria-atomic="true">
          <div className="shrink-0 px-4 pt-1 sm:px-10">
            <div className="mx-auto mb-3 h-1 w-full max-w-5xl overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-teal-400 shadow-[0_0_14px_rgba(45,212,191,0.35)] transition-[width] duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
                aria-valuenow={index + 1}
                aria-valuemin={1}
                aria-valuemax={TOTAL}
                role="progressbar"
                aria-label={`Slide ${index + 1} of ${TOTAL}`}
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain px-4 pb-32 pt-1 sm:px-10 sm:pb-40 sm:pt-2">
            <div className="mx-auto w-full max-w-5xl">
              <RoadmapSlideContent slide={slide} />
            </div>
          </div>
        </div>

        <footer className="relative z-30 shrink-0 border-t border-white/[0.06] bg-slate-950/70 px-4 py-4 shadow-[0_-12px_40px_-16px_rgba(0,0,0,0.55)] backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {AI_ROADMAP_SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}: ${s.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  onClick={() => go(i)}
                  className={
                    i === index
                      ? 'h-3 min-h-[12px] w-10 min-w-[40px] rounded-full bg-gradient-to-r from-indigo-400 to-teal-400 shadow-[0_0_20px_rgba(99,102,241,0.45)] ring-2 ring-indigo-400/30'
                      : 'h-2.5 min-h-[10px] w-2.5 min-w-[10px] rounded-full bg-white/20 hover:bg-white/45'
                  }
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
              <span className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-sm tabular-nums text-slate-400 ring-1 ring-inset ring-white/[0.04]">
                {index + 1} / {TOTAL}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={index === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={index === TOTAL - 1}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-gradient-to-r from-indigo-500/35 to-violet-600/25 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-35"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-5xl text-center text-[11px] text-slate-500">
            Keyboard: ← → · Home / End · Print exports all {TOTAL} slides
          </p>
        </footer>
      </div>

      {/* ——— Print / PDF: every slide, dark theme, one page each ——— */}
      <div className="ai-roadmap-deck-print hidden" aria-hidden>
        {AI_ROADMAP_SLIDES.map((s, i) => (
          <article key={s.id} className="deck-print-page">
            <div className="deck-print-page-inner">
              <p className="deck-print-badge">
                Slide {i + 1} of {TOTAL} · Axxiom AI roadmap 2026–27
              </p>
              <RoadmapSlideContent slide={s} forPrint />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
