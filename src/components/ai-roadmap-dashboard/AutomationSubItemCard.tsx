import { useEffect, useId, useRef, useState } from 'react'
import { ExternalLink, Eye, EyeOff, ImagePlus, LoaderCircle } from 'lucide-react'
import {
  removeAutomationImageByUrl,
  uploadAutomationImage,
} from '../../lib/aiRoadmapStorage'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import {
  getSubItemImageUrls,
  STATUS_META,
  type RoadmapSubItem,
  type RoadmapItemStatus,
} from '../../data/aiRoadmapDashboard'
import { AutomationImageGallery } from './AutomationImageGallery'
import { PasswordGatedDeleteButton } from './PasswordGatedDeleteButton'
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
  const [showDetails, setShowDetails] = useState(false)
  const [detailsDraft, setDetailsDraft] = useState(sub.details ?? '')
  const [linkDraft, setLinkDraft] = useState(sub.linkUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const supabaseImages = isSupabaseConfigured()

  const imageUrls = getSubItemImageUrls(sub)
  const hasMeta = Boolean(sub.details?.trim() || sub.linkUrl || imageUrls.length > 0)

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

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    const files = [...fileList]
    setUploadError(null)
    setUploading(true)

    const existing = getSubItemImageUrls(sub)
    const added: string[] = []
    let lastError: string | null = null

    for (let i = 0; i < files.length; i += 1) {
      setUploadProgress(files.length > 1 ? `Uploading ${i + 1} of ${files.length}…` : 'Uploading…')
      const { publicUrl, error } = await uploadAutomationImage(files[i], {
        categoryId,
        blockId,
        subItemId: sub.id,
      })
      if (error) {
        lastError = error
        continue
      }
      if (publicUrl) added.push(publicUrl)
    }

    setUploading(false)
    setUploadProgress(null)

    if (added.length > 0) {
      onUpdate({ imageUrls: [...existing, ...added] })
      setShowDetails(true)
    }
    if (lastError) {
      setUploadError(
        added.length > 0
          ? `${lastError} (${added.length} image${added.length === 1 ? '' : 's'} uploaded.)`
          : lastError,
      )
    }
  }

  const handleRemoveImageAt = (index: number) => {
    const url = imageUrls[index]
    if (url) void removeAutomationImageByUrl(url)
    const next = imageUrls.filter((_, i) => i !== index)
    onUpdate({ imageUrls: next.length > 0 ? next : undefined })
    setUploadError(null)
  }

  return (
    <li
      className={[
        'rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 ring-1 ring-inset sm:p-4',
        STATUS_META[sub.status].ring,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{sub.label}</p>
          <div className="mt-1.5">
            <StatusPill status={sub.status} />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className={[
              'rounded-lg p-1.5 transition-colors',
              showDetails
                ? 'bg-indigo-500/20 text-indigo-200'
                : 'text-slate-500 hover:bg-white/10 hover:text-indigo-200',
            ].join(' ')}
            aria-label={showDetails ? 'Hide details' : 'View details'}
            aria-expanded={showDetails}
          >
            {showDetails ? (
              <EyeOff className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Eye className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
          <PasswordGatedDeleteButton
            label={sub.label}
            message={`Remove automation “${sub.label}” for everyone? Enter the hub password to confirm.`}
            onDelete={onRemove}
          />
        </div>
      </div>

      <div className="mt-2.5">
        <StatusControls
          status={sub.status}
          onChange={onStatusChange}
          label={sub.label}
          compact
        />
      </div>

      {!showDetails && hasMeta ? (
        <p className="mt-2 text-[11px] text-indigo-300/70">
          Has saved details
          {imageUrls.length > 0 ? ` · ${imageUrls.length} image${imageUrls.length === 1 ? '' : 's'}` : ''}
          {' — tap '}
          <Eye className="inline h-3 w-3 align-text-bottom opacity-80" aria-hidden /> to view.
        </p>
      ) : null}

      {showDetails ? (
        <div className="mt-3 space-y-3 border-t border-white/[0.06] pt-3">
          <div>
            <label htmlFor={detailsId} className="text-xs font-semibold text-slate-300">
              Details
            </label>
            <textarea
              id={detailsId}
              value={detailsDraft}
              onChange={(e) => setDetailsDraft(e.target.value)}
              onBlur={flushDetails}
              rows={2}
              placeholder="What was built, tools used, notes…"
              className="mt-1.5 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>

          <div>
            <label htmlFor={linkId} className="text-xs font-semibold text-slate-300">
              Link
            </label>
            <div className="mt-1.5 flex gap-2">
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
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 px-3 text-slate-300 hover:text-white"
                  aria-label="Open link"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300">Reference images</p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Click a thumbnail to zoom in-app. Add multiple screenshots.
            </p>

            <AutomationImageGallery
              images={imageUrls}
              title={sub.label}
              onRemoveAt={handleRemoveImageAt}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={(e) => {
                void handleFiles(e.target.files)
                e.target.value = ''
              }}
            />

            <button
              type="button"
              disabled={uploading || !supabaseImages}
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-black/20 px-3 py-2 text-sm text-slate-300 hover:border-indigo-400/35 hover:bg-indigo-500/10 hover:text-white disabled:opacity-50"
            >
              {uploading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ImagePlus className="h-4 w-4" aria-hidden />
              )}
              {uploadProgress ?? (imageUrls.length > 0 ? 'Add more images' : 'Upload images')}
            </button>
            {!supabaseImages ? (
              <p className="mt-1 text-[11px] text-amber-200/80">Supabase required for image uploads.</p>
            ) : null}
            {uploadError ? (
              <p className="mt-1 text-[11px] font-medium text-rose-300" role="alert">
                {uploadError}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </li>
  )
}
