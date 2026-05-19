import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Megaphone,
  Printer,
  Sparkles,
} from 'lucide-react'

const DOC = '/axxiom_marketing_campaign.html'

export function MarketingCampaignPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handlePrint = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  return (
    <div className="flex h-screen min-h-0 flex-col bg-[#0a0a0a] font-sans text-[#f5f4f0]">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#111217] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-[#f5f4f0]/90 transition-colors hover:border-[#c9a84c]/40 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            <span className="hidden sm:inline">Strategy hub</span>
            <span className="sm:hidden">Hub</span>
          </Link>
          <div className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 text-[#c9a84c]">
              <Megaphone className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a84c]/90">
                Marketing
              </p>
              <h1 className="truncate font-display text-sm font-semibold tracking-tight sm:text-base">
                Campaign strategy
              </h1>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition-colors hover:border-[#c9a84c]/35 hover:text-white"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">Print</span>
          </button>
          <a
            href="https://axxiomelevator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9a84c]/25 bg-[#c9a84c]/10 px-3 py-2 text-xs font-medium text-[#e8e4d9] transition-colors hover:bg-[#c9a84c]/20"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">axxiomelevator.com</span>
          </a>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 p-2 sm:p-3 lg:p-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_20%_0%,rgba(201,168,76,0.1),transparent)]"
          aria-hidden
        />
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/[0.07] bg-[#111217] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <Sparkles className="h-3.5 w-3.5 text-[#c9a84c]/90" aria-hidden />
            <span className="text-[11px] font-medium text-[#6b7280]">
              Use the tabs inside the document to switch sections
            </span>
          </div>
          <iframe
            ref={iframeRef}
            title="Axxiom Elevator — marketing campaign strategy"
            src={DOC}
            className="min-h-0 w-full flex-1 border-0 bg-[#0a0a0a]"
          />
        </div>
      </div>
    </div>
  )
}
