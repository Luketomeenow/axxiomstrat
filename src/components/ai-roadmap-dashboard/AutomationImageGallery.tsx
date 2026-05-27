import { useState } from 'react'
import { X } from 'lucide-react'
import { ImageLightbox } from './ImageLightbox'

export function AutomationImageGallery({
  images,
  title,
  onRemoveAt,
}: {
  images: string[]
  title: string
  onRemoveAt: (index: number) => void
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <ul className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {images.map((url, i) => (
          <li key={`${url}-${i}`} className="group relative">
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="block w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 ring-1 ring-inset ring-white/5 transition-[transform,box-shadow] hover:ring-indigo-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            >
              <img
                src={url}
                alt={`${title} reference ${i + 1}`}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemoveAt(i)
              }}
              className="absolute right-1.5 top-1.5 rounded-md border border-white/15 bg-black/75 p-1 text-slate-300 opacity-0 transition-opacity hover:bg-red-500/30 hover:text-red-100 group-hover:opacity-100 focus:opacity-100"
              aria-label={`Remove image ${i + 1}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      {lightboxIndex !== null ? (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </>
  )
}
