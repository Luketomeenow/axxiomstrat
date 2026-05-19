# Axxiom strategy hub

React + TypeScript + Vite + Tailwind viewer for strategy HTML, brand guidelines, and related artifacts under `public/`.

## Develop

```bash
npm install
npm run dev
```

Dedicated viewers: **`/brandguidelines`**, **`/vectordbcomparison`**, **`/marketingvidsprompts`**, **`/marketingcampaign`**.

## Deploy (Netlify)

Connect this repository; Netlify reads `netlify.toml` here:

- **Build command:** `npm ci && npm run build`
- **Publish directory:** `dist`
- **Node:** 22 (pinned in config)

No base directory setting is required—the app lives at the repo root.
