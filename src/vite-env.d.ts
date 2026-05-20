/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When set, the strategy hub shows a password screen until unlocked (sessionStorage). */
  readonly VITE_HUB_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
