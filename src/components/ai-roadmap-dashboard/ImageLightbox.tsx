import { useCallback, useEffect, useState, type WheelEvent } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEP = 0.25

export function ImageLightbox({
  images,
  initialIndex,
  title,
  onClose,
}: {
  images: string[]
  initialIndex: number
  title: string
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)

  const count = images.length
  const current = images[index]

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count)
    setZoom(1)
  }, [count])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count)
    setZoom(1)
  }, [count])

  useEffect(() => {
    setIndex(initialIndex)
    setZoom(1)
  }, [initialIndex])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))
      if (e.key === '-') setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goPrev, goNext])

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))
  }

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/92 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`View image ${index + 1} of ${count}`}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <p className="truncate text-sm font-medium text-white">
          {title}
          <span className="ml-2 text-slate-400">
            {index + 1} / {count}
          </span>
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" aria-hidden />
          </button>
          <span className="min-w-[3rem] text-center text-xs tabular-nums text-slate-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Close viewer"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4"
        onClick={onClose}
        onWheel={onWheel}
      >
        {count > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white hover:bg-black/70 sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        ) : null}

        <img
          src={current}
          alt={`${title} — image ${index + 1}`}
          className="max-h-full max-w-full cursor-zoom-out object-contain transition-transform duration-150 ease-out"
          style={{ transform: `scale(${zoom})` }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />

        {count > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 z-10 rounded-full border border-white/15 bg-black/50 p-2 text-white hover:bg-black/70 sm:right-4"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        ) : null}
      </div>

      <p className="shrink-0 pb-3 text-center text-[11px] text-slate-500">
        Scroll to zoom · arrow keys to browse · Esc to close
      </p>
    </div>
  )
}
