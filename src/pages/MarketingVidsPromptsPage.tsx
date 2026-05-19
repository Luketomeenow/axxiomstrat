import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clapperboard,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react'

const DOC = '/axxiom_higgsfield_prompts.html'

export function MarketingVidsPromptsPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0c0c0e] font-sans text-[#f0eee8]">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.07] bg-[#13131a] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-[#f0eee8]/90 transition-colors hover:border-[#ff6b1a]/40 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff6b1a]/25 bg-[#ff6b1a]/10 text-[#ffaa44]">
              <Clapperboard className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffaa44]/90">
                Higgsfield
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
                Reel &amp; video prompts
              </h1>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition-colors hover:border-[#ff6b1a]/35 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </button>
          <a
            href="https://axxiomelevator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#ff6b1a]/25 bg-[#ff6b1a]/10 px-3 py-2 text-xs font-medium text-[#ffaa44] transition-colors hover:bg-[#ff6b1a]/20"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">axxiomelevator.com</span>
          </a>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 p-2 sm:p-3 lg:p-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_0%,rgba(255,107,26,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#13131a] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-[#ffaa44]/90" aria-hidden />
            <span className="text-[11px] font-medium text-[#6b6b7a]">
              Full-page document · scroll for all prompts
            </span>
          </div>
          <iframe
            ref={iframeRef}
            title="Axxiom Elevator — Higgsfield reel prompts"
            src={DOC}
            className="min-h-0 w-full flex-1 border-0 bg-[#0c0c0e]"
          />
        </div>
      </div>
    </div>
  )
}
