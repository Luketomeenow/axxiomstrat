import { useEffect, useState } from 'react'
import { buildStrategyIframeSrcDoc } from '../lib/strategyIframeDocument'

type Props = {
  filename: string
  title: string
}

export function StrategyHtmlFrame({ filename, title }: Props) {
  const [srcDoc, setSrcDoc] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setSrcDoc(null)
    setErr(null)
    fetch(`/strategy-html/${encodeURIComponent(filename)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load file (${r.status})`)
        return r.text()
      })
      .then((raw) => {
        if (cancelled) return
        setSrcDoc(buildStrategyIframeSrcDoc(raw))
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setErr(e instanceof Error ? e.message : 'Failed to load document')
      })
    return () => {
      cancelled = true
    }
  }, [filename])

  if (err) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {err}
      </div>
    )
  }

  if (!srcDoc) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
        <span className="animate-pulse">Loading document…</span>
      </div>
    )
  }

  return (
    <iframe
      title={title}
      className="min-h-[calc(100vh-10rem)] w-full rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
      srcDoc={srcDoc}
      sandbox="allow-scripts allow-same-origin"
    />
  )
}
