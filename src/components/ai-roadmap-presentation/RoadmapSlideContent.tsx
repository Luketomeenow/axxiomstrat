import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { RoadmapSlideVisual } from './RoadmapSlideVisual'
import type { RoadmapSlide } from '../../data/aiRoadmapSlides'

function CalloutBlock({ callout }: { callout: NonNullable<RoadmapSlide['callout']> }) {
  const isWarn = callout.variant === 'warn'
  return (
    <div
      className={
        isWarn
          ? 'rounded-2xl border border-amber-400/35 bg-amber-500/[0.12] p-4 text-amber-50 ring-1 ring-inset ring-amber-300/20 sm:p-5'
          : 'rounded-2xl border border-indigo-400/30 bg-indigo-500/[0.14] p-4 text-indigo-50 ring-1 ring-inset ring-indigo-300/20 sm:p-5'
      }
      role="note"
    >
      {callout.title ? (
        <p className="text-sm font-semibold tracking-wide text-white/95">{callout.title}</p>
      ) : null}
      <p className="mt-1.5 text-sm leading-relaxed text-white/88">{callout.text}</p>
    </div>
  )
}

export function RoadmapSlideContent({
  slide,
  forPrint = false,
}: {
  slide: RoadmapSlide
  forPrint?: boolean
}) {
  return (
    <div className="deck-slide-stage flex min-h-min flex-col justify-start gap-5 py-2 sm:gap-6 sm:py-4">
      <header className="shrink-0 space-y-2 sm:space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-300/90">
          {slide.id === 'title' ? 'Live presentation' : 'Axxiom · AI roadmap'}
        </p>
        <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {slide.title}
        </h1>
        {slide.subtitle ? (
          <p className="text-lg font-medium text-indigo-200/90 sm:text-xl">{slide.subtitle}</p>
        ) : null}
      </header>

      <RoadmapSlideVisual slide={slide} />

      {slide.paragraphs?.length ? (
        <div className="max-w-3xl space-y-3 text-base leading-relaxed text-slate-300 sm:text-lg">
          {slide.paragraphs.map((p, i) => (
            <p key={`${slide.id}-p-${i}`}>{p}</p>
          ))}
        </div>
      ) : null}

      {slide.bullets?.length ? (
        <ul className="m-0 max-w-3xl list-none space-y-3 p-0 text-base leading-relaxed text-slate-200 sm:text-lg">
          {slide.bullets.map((b, i) => (
            <li key={`${slide.id}-b-${i}`} className="flex gap-3.5">
              <span
                className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-teal-400"
                aria-hidden
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {slide.callout ? <CalloutBlock callout={slide.callout} /> : null}

      {slide.cta ? (
        <div className="pt-1">
          {forPrint ? (
            <p className="text-sm font-medium text-indigo-200">
              {slide.cta.label}{' '}
              <span className="text-slate-400">({slide.cta.to})</span>
            </p>
          ) : (
            <Link
              to={slide.cta.to}
              className="inline-flex items-center gap-2 rounded-2xl border border-indigo-400/45 bg-gradient-to-r from-indigo-500/30 via-violet-500/25 to-indigo-500/30 px-6 py-3.5 text-base font-semibold text-white ring-1 ring-inset ring-white/10"
            >
              {slide.cta.label}
              <ExternalLink className="h-4 w-4 opacity-80" aria-hidden />
            </Link>
          )}
        </div>
      ) : null}

      {slide.footerNote ? (
        <p className="text-sm text-slate-400">{slide.footerNote}</p>
      ) : null}
    </div>
  )
}
