import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Parse .env lines without variable expansion (Vite expand breaks $ in passwords). */
function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

function loadHubPasswordFromEnvFiles(mode: string): string | undefined {
  const files = [`.env.${mode}.local`, `.env.local`, `.env.${mode}`, `.env`]
  const merged: Record<string, string> = {}
  for (const file of files) {
    const path = resolve(process.cwd(), file)
    if (!existsSync(path)) continue
    Object.assign(merged, parseEnvFile(readFileSync(path, 'utf8')))
  }

  const b64 = merged.VITE_HUB_PASSWORD_B64
  if (b64?.trim()) {
    try {
      return Buffer.from(b64.trim(), 'base64').toString('utf8')
    } catch {
      /* fall through */
    }
  }

  const plain = merged.VITE_HUB_PASSWORD
  return plain?.length ? plain : undefined
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const hubPassword = loadHubPasswordFromEnvFiles(mode)

  return {
    plugins: [react(), tailwindcss()],
    define:
      hubPassword !== undefined
        ? {
            'import.meta.env.VITE_HUB_PASSWORD': JSON.stringify(hubPassword),
          }
        : {},
  }
})
