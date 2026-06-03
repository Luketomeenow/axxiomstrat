# Axxiom strategy hub

React + TypeScript + Vite + Tailwind viewer for strategy HTML, brand guidelines, and related artifacts under `public/`.

## Develop

```bash
npm install
npm run dev
```

### Hub password (optional)

If `VITE_HUB_PASSWORD` is set at build time, the app shows a **password screen** until the correct value is entered (unlock is stored in **sessionStorage** for the browser tab only).

1. Copy `.env.example` to **`.env.local`** (ignored by git).
2. Set your password, using **double quotes** if it contains `#` or other special characters, for example:
   - `VITE_HUB_PASSWORD="your-password-here"`
3. Restart `npm run dev` after changing env vars.

On **Netlify**, add the same variable under **Site configuration → Environment variables** (name: `VITE_HUB_PASSWORD`, value: your password), then trigger a new deploy.

**Note:** Vite inlines `VITE_*` at **build** time, so the password string can appear in published JavaScript — use this as a **deterrent** only, and add Netlify access control / SSO if you need real protection.

Dedicated viewers: **`/brandguidelines`**, **`/vectordbcomparison`**, **`/marketingvidsprompts`**, **`/marketingcampaign`**, **`/axxiom4campaign`** (4-service marketing campaign HTML), **`/axxiomairoadmap`** (full HTML reference), **`/airoadmap`** (slide-style presentation of the same roadmap), **`/airoadmapdashboard`** (live progress tracker for marketing, data architecture, and ops workstreams), **`/aeo`** (AEO automation hub — six pillars, manual progress; Python jobs Phase 2), **`/aeogeoplaybook`** (AEO execution playbook HTML; supports **`?tab=schema`** etc. for deep links).

Phase 2 Python automation scaffold: **[python/aeo/README.md](python/aeo/README.md)**.

### AI roadmap dashboard + Supabase (optional)

For **team-wide live sync** on `/airoadmapdashboard`, configure Supabase and run the SQL migration. Full checklist: **[docs/SUPABASE_AI_ROADMAP.md](docs/SUPABASE_AI_ROADMAP.md)**.

Quick env (`.env.local`):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Without these vars the dashboard still works using **localStorage** only.

## Deploy (Netlify)

Connect this repository; Netlify reads `netlify.toml` here:

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **Node:** 22 (pinned in config)

No base directory setting is required—the app lives at the repo root.
