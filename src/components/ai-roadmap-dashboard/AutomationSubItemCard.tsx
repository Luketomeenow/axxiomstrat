import { useEffect, useId, useRef, useState } from 'react'
import { ExternalLink, ImagePlus, LoaderCircle, Trash2, X } from 'lucide-react'
import {
  removeAutomationImageByUrl,
  uploadAutomationImage,
} from '../../lib/aiRoadmapStorage'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { STATUS_META, type RoadmapSubItem, type RoadmapItemStatus } from '../../data/aiRoadmapDashboard'
import { StatusControls } from './StatusControls'

function StatusPill({ status }: { status: RoadmapItemStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
        meta.badge,
      ].join(' ')}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  )
}

export function AutomationSubItemCard({
  sub,
  categoryId,
  blockId,
  onStatusChange,
  onUpdate,
  onRemove,
}: {
  sub: RoadmapSubItem
  categoryId: string
  blockId: string
  onStatusChange: (status: RoadmapItemStatus) => void
  onUpdate: (patch: Partial<RoadmapSubItem>) => void
  onRemove: () => void
}) {
  const detailsId = useId()
  const linkId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [detailsDraft, setDetailsDraft] = useState(sub.details ?? '')
  const [linkDraft, setLinkDraft] = useState(sub.linkUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const supabaseImages = isSupabaseConfigured()

  useEffect(() => {
    setDetailsDraft(sub.details ?? '')
    setLinkDraft(sub.linkUrl ?? '')
  }, [sub.details, sub.linkUrl, sub.id])

  const flushDetails = () => {
    const next = detailsDraft.trim()
    if (next !== (sub.details ?? '')) {
      onUpdate({ details: next || undefined })
    }
  }

  const flushLink = () => {
    const next = linkDraft.trim()
    if (next !== (sub.linkUrl ?? '')) {
      onUpdate({ linkUrl: next || undefined })
    }
  }

  const handleFile = async (file: File | null) => {
    if (!file) return
    setUploadError(null)
    setUploading(true)
    const { publicUrl, error } = await uploadAutomationImage(file, {
      categoryId,
      blockId,
      subItemId: sub.id,
    })
    setUploading(false)
    if (error) {
      setUploadError(error)
      return
    }
    if (publicUrl) {
      if (sub.imageUrl && sub.imageUrl !== publicUrl) {
        void removeAutomationImageByUrl(sub.imageUrl)
      }
      onUpdate({ imageUrl: publicUrl })
    }
  }

  const handleRemoveImage = () => {
    if (sub.imageUrl) void removeAutomationImageByUrl(sub.imageUrl)
    onUpdate({ imageUrl: undefined })
    setUploadError(null)
  }

  const hasMeta = Boolean(sub.details?.trim() || sub.linkUrl || sub.imageUrl)

  return (
    <li
      className={[
        'rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 ring-1 ring-inset',
        STATUS_META[sub.status].ring,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{sub.label}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={sub.status} />
            {hasMeta ? (
              <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-300/70">
                Has details
              </span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
          aria-label={`Remove ${sub.label}`}
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <div className="mt-3">
        <StatusControls
          status={sub.status}
          onChange={onStatusChange}
          label={sub.label}
          compact
        />
      </div>

      <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
        <div>
          <label htmlFor={detailsId} className="text-xs font-semibold text-slate-300">
            Details
          </label>
          <p className="mt-0.5 text-[11px] text-slate-500">
            What was built, tools used, or notes for the team.
          </p>
          <textarea
            id={detailsId}
            value={detailsDraft}
            onChange={(e) => setDetailsDraft(e.target.value)}
            onBlur={flushDetails}
            rows={3}
            placeholder="e.g. 3-email Apollo sequence; triggers on tag “nurture-hot”…"
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
          />
        </div>

        <div>
          <label htmlFor={linkId} className="text-xs font-semibold text-slate-300">
            Link
          </label>
          <p className="mt-0.5 text-[11px] text-slate-500">Workflow, Zap, or doc URL (optional).</p>
          <div className="mt-2 flex gap-2">
            <input
              id={linkId}
              type="url"
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onBlur={flushLink}
              placeholder="https://…"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
            />
            {sub.linkUrl ? (
              <a
                href={sub.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-3 text-slate-300 transition-colors hover:text-white"
                aria-label="Open link"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-300">Reference image</p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Screenshot or diagram others can open from this automation.
          </p>

          {sub.imageUrl ? (
            <div className="relative mt-2 overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <a href={sub.imageUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={sub.imageUrl}
                  alt={`Reference for ${sub.label}`}
                  className="max-h-56 w-full object-contain"
                />
              </a>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 rounded-lg border border-white/15 bg-black/70 p-1.5 text-slate-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
          ) : null}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              e.target.value = ''
              void handleFile(file)
            }}
          />

          <button
            type="button"
            disabled={uploading || !supabaseImages}
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-2.5 text-sm text-slate-300 transition-colors hover:border-indigo-400/35 hover:bg-indigo-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden />
            )}
            {uploading ? 'Uploading…' : sub.imageUrl ? 'Replace image' : 'Upload image'}
          </button>

          {!supabaseImages ? (
            <p className="mt-1.5 text-[11px] text-amber-200/80">
              Add Supabase env vars to enable team image uploads.
            </p>
          ) : null}
          {uploadError ? (
            <p className="mt-1.5 text-[11px] font-medium text-rose-300" role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  )
}
