import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { StrategyHtmlFrame } from '../components/StrategyHtmlFrame'
import { categoryLabel, getDocumentBySlug } from '../data/documents'

export function DocumentPage() {
  const { slug } = useParams<{ slug: string }>()
  const doc = getDocumentBySlug(slug)

  if (!doc) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">No document matches this link.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-800 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back to all documents
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          All documents
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-amber-800/80">
          {categoryLabel[doc.category]}
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {doc.title}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{doc.blurb}</p>
      </div>

      <StrategyHtmlFrame filename={doc.filename} title={doc.title} />

      <p className="mt-6 text-center text-xs text-slate-500">
        Tip: where the original had “click to explore,” the prompt is copied to
        your clipboard and confirmed below.
      </p>
    </div>
  )
}
