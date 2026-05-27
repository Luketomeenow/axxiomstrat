import { useCallback, useId, useMemo, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Lock, Sparkles } from 'lucide-react'
import { getExpectedHubPassword, verifyHubPassword } from '../lib/hubPassword'

const SESSION_KEY = 'axxiom-hub-session'

function readGateEnabled(): boolean {
  return getExpectedHubPassword() !== undefined
}

function readAuthed(gateEnabled: boolean): boolean {
  if (!gateEnabled) return true
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'ok'
  } catch {
    return false
  }
}

function setAuthed() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'ok')
  } catch {
    /* private mode etc. */
  }
}

export function HubPasswordGate({ children }: { children: React.ReactNode }) {
  const gateEnabled = useMemo(() => readGateEnabled(), [])
  const formId = useId()
  const [authed, setAuthedState] = useState(() => readAuthed(gateEnabled))
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setError(null)
      if (!getExpectedHubPassword()) {
        setError('Hub password is not configured.')
        return
      }
      if (verifyHubPassword(password)) {
        setAuthed()
        setAuthedState(true)
        setPassword('')
        return
      }
      setError('Incorrect password. Try again.')
      setPassword('')
    },
    [password],
  )

  if (!gateEnabled) {
    return <>{children}</>
  }

  if (authed) {
    return <>{children}</>
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#050810] px-4 py-12 text-white">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(85%_55%_at_50%_-18%,rgba(99,102,241,0.28),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(50%_40%_at_0%_100%,rgba(45,212,191,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-[1] w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 shadow-[0_0_40px_rgba(99,102,241,0.25)]">
            <Sparkles className="h-7 w-7 text-indigo-300" aria-hidden />
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Axxiom strategy hub</h1>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400">
            <Lock className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
            Enter the hub password to continue.
          </p>
        </div>

        <form
          id={formId}
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/[0.08] bg-slate-950/60 p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-md sm:p-8"
        >
          <label htmlFor={`${formId}-pw`} className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <div className="relative">
            <input
              id={`${formId}-pw`}
              name="password"
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 text-base text-white outline-none ring-indigo-400/40 placeholder:text-slate-600 focus:border-indigo-400/40 focus:ring-2"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error ? (
            <p className="mt-3 text-sm font-medium text-rose-300" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-6 w-full rounded-xl border border-indigo-400/40 bg-gradient-to-r from-indigo-500/40 to-violet-600/30 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_-10px_rgba(99,102,241,0.55)] ring-1 ring-inset ring-indigo-300/25 transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[0_12px_32px_-8px_rgba(99,102,241,0.55)]"
          >
            Unlock hub
          </button>

          <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">
            This check runs in the browser (session only). For stronger protection, also use Netlify
            access controls or SSO.
          </p>
        </form>
      </div>
    </div>
  )
}
