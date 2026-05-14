import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Palette,
  Printer,
  Sparkles,
} from 'lucide-react'

const BRAND_DOC = '/axxiom_brand_guidelines.html'

const SECTIONS = [
  { id: 'cover', label: 'Cover' },
  { id: 'essence', label: 'Brand essence' },
  { id: 'logo', label: 'Logo' },
  { id: 'colors', label: 'Color' },
  { id: 'typography', label: 'Typography' },
  { id: 'dodonts', label: 'Do & don’t' },
  { id: 'voice', label: 'Voice' },
  { id: 'applications', label: 'Applications' },
  { id: 'backcover', label: 'Closing' },
] as const

export function BrandGuidelinesPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [activeId, setActiveId] = useState<string>('cover')

  const scrollToSection = useCallback((id: string) => {
    setActiveId(id)
    const iframe = iframeRef.current
    if (!iframe) return
    const base = BRAND_DOC
    iframe.src = id === 'cover' ? base : `${base}#${id}`
  }, [])

  const handlePrint = useCallback(() => {
    const win = iframeRef.current?.contentWindow
    if (win) win.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#070F1E] font-sans text-white">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0B1628] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/90">
              Axxiom Elevator
            </p>
            <h1 className="truncate font-display text-sm font-semibold tracking-tight text-white sm:text-base">
              Brand guidelines
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-400/30 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </button>
          <a
            href="https://axxiomelevator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-200 transition-colors hover:bg-cyan-500/20"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">axxiomelevator.com</span>
          </a>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 bg-[#0B1628] lg:w-56 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3 lg:block lg:border-b-0 lg:px-4 lg:py-5">
            <Palette className="h-4 w-4 text-cyan-400 lg:hidden" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 lg:mb-3 lg:text-slate-400">
              Sections
            </p>
          </div>
          <nav
            className="flex gap-1 overflow-x-auto px-2 pb-3 pt-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6 lg:pt-0"
            aria-label="Brand guideline sections"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={[
                  'whitespace-nowrap rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors lg:w-full',
                  activeId === s.id
                    ? 'bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="hidden px-4 pb-6 lg:block">
            <p className="text-[10px] leading-relaxed text-slate-500">
              Full guidelines load in the viewer. Use the section list to jump;
              scroll inside the document for detail.
            </p>
          </div>
        </aside>

        <div className="relative min-h-0 min-w-0 flex-1 bg-[#070F1E] p-2 sm:p-3 lg:p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,180,216,0.12),transparent)]" />
          <div className="relative flex h-full min-h-[50vh] flex-col overflow-hidden rounded-xl border border-white/10 shadow-[0_0_0_1px_rgba(0,180,216,0.06),0_24px_48px_-12px_rgba(0,0,0,0.5)] lg:min-h-0">
            <div className="flex items-center gap-2 border-b border-white/5 bg-[#0F1E38]/80 px-3 py-2 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400/80" aria-hidden />
              <span className="text-[11px] font-medium text-slate-400">
                Live document · Version 1.0
              </span>
            </div>
            <iframe
              ref={iframeRef}
              title="Axxiom Elevator brand guidelines"
              src={BRAND_DOC}
              className="min-h-0 w-full flex-1 border-0 bg-[#070F1E]"
              onLoad={() => {
                try {
                  const hash =
                    iframeRef.current?.contentWindow?.location.hash.slice(1)
                  if (hash && SECTIONS.some((s) => s.id === hash)) {
                    setActiveId(hash)
                  }
                } catch {
                  /* cross-origin — ignore */
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
