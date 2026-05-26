import { AlertCircle, Cloud, CloudOff, LoaderCircle, RefreshCw } from 'lucide-react'
import type { SyncStatus } from '../../lib/aiRoadmapSnapshot'

export function SyncStatusBar({
  supabaseEnabled,
  syncStatus,
  syncError,
  lastSyncedAt,
  onRetry,
}: {
  supabaseEnabled: boolean
  syncStatus: SyncStatus
  syncError: string | null
  lastSyncedAt: string | null
  onRetry: () => void
}) {
  if (!supabaseEnabled) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-500">
        <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Local only — add <code className="text-slate-400">VITE_SUPABASE_URL</code> and{' '}
        <code className="text-slate-400">VITE_SUPABASE_ANON_KEY</code> to sync live.
      </div>
    )
  }

  const syncedLabel = lastSyncedAt
    ? `Last synced ${new Date(lastSyncedAt).toLocaleString()}`
    : 'Connected to Supabase'

  let tone = 'border-indigo-500/25 bg-indigo-500/10 text-indigo-100'
  let message = syncedLabel
  let Icon = Cloud

  if (syncStatus === 'loading') {
    tone = 'border-slate-500/25 bg-slate-500/10 text-slate-300'
    message = 'Loading roadmap from Supabase…'
    Icon = LoaderCircle
  } else if (syncStatus === 'saving') {
    tone = 'border-amber-500/25 bg-amber-500/10 text-amber-100'
    message = 'Saving…'
    Icon = LoaderCircle
  } else if (syncStatus === 'error') {
    tone = 'border-rose-500/30 bg-rose-500/10 text-rose-100'
    message = syncError ?? 'Sync failed'
    Icon = AlertCircle
  }

  return (
    <div
      className={[
        'flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs',
        tone,
      ].join(' ')}
      role="status"
    >
      <span className="inline-flex items-center gap-2">
        <Icon
          className={[
            'h-3.5 w-3.5 shrink-0',
            (syncStatus === 'loading' || syncStatus === 'saving') && Icon === LoaderCircle
              ? 'animate-spin'
              : '',
          ].join(' ')}
          aria-hidden
        />
        {message}
      </span>
      {syncStatus === 'error' ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2 py-1 font-medium text-white transition-colors hover:bg-white/10"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Retry
        </button>
      ) : syncStatus === 'saved' ? (
        <span className="text-[10px] uppercase tracking-wider opacity-70">Live</span>
      ) : null}
    </div>
  )
}
