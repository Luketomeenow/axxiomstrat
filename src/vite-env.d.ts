/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, the strategy hub shows a password screen until unlocked (sessionStorage). */
  readonly VITE_HUB_PASSWORD?: string
  /** Supabase project URL (Settings → API). Enables live roadmap dashboard sync. */
  readonly VITE_SUPABASE_URL?: string
  /** Supabase anon/public key (Settings → API). Safe for browser with RLS enabled. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
