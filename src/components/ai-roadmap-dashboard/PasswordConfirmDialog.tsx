import { useEffect, useId, useState, type FormEvent } from 'react'
import { Lock, X } from 'lucide-react'
import { isHubPasswordConfigured, verifyHubPassword } from '../../lib/hubPassword'

export function PasswordConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onClose,
  onConfirmed,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onClose: () => void
  onConfirmed: () => void
}) {
  const formId = useId()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPassword('')
    setError(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isHubPasswordConfigured()) {
      setError('Hub password is not configured — cannot confirm delete.')
      return
    }
    if (!verifyHubPassword(password)) {
      setError('Incorrect password.')
      setPassword('')
      return
    }
    onConfirmed()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cancel"
      />
      <form
        onSubmit={onSubmit}
        className="relative z-[1] w-full max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-2xl ring-1 ring-inset ring-white/5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
              <Lock className="h-4 w-4" aria-hidden />
            </span>
            <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
        <label htmlFor={`${formId}-pw`} className="mt-4 block text-xs font-medium text-slate-300">
          Hub password
        </label>
        <input
          id={`${formId}-pw`}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:border-rose-400/40 focus:outline-none focus:ring-2 focus:ring-rose-500/25"
          placeholder="Enter password to confirm"
          required
        />
        {error ? (
          <p className="mt-2 text-sm font-medium text-rose-300" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/20 py-2.5 text-sm font-semibold text-rose-100 hover:bg-rose-500/30"
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
