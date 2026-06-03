# AEO automation (Phase 2)

Python jobs for the portal **AEO Automation** hub (`/aeo`). Phase 1 is UI-only (manual pillar status in the browser). This folder is the planned layout for crawl, content, schema, and reporting automation.

## Planned layout

```
python/aeo/
  README.md           # this file
  requirements.txt    # httpx, playwright, openai, etc.
  main.py             # CLI: run scan | content | keywords | ...
  api/                # optional FastAPI for portal "Run" buttons
    server.py
  jobs/
    crawl.py          # site + competitor scan
    content.py        # drafts, meta, alt (LLM)
    keywords.py
    technical.py      # broken links, CWV / PageSpeed
    schema.py         # JSON-LD from playbook templates
    report.py         # rankings / citation tracking export
```

## Portal integration (later)

1. Deploy API (e.g. Railway, Azure Container Apps).
2. Set `VITE_AEO_API_URL` in the portal build env.
3. Portal `POST /jobs/run` → API runs job → results written to Supabase → portal polls or uses Realtime.

Hub password gate remains the app-level guard. Use **Supabase service role** on the server only — never in the browser.

## Environment variables (examples)

| Capability | Suggested stack | Env vars |
|------------|-----------------|----------|
| Data collection | `httpx` + Playwright or BeautifulSoup | `AEO_SITE_URLS`, `AEO_COMPETITOR_URLS` |
| AI content | Azure OpenAI or OpenAI | `AZURE_OPENAI_*` or `OPENAI_API_KEY` |
| Keyword research | DataForSEO, SerpAPI, Google Ads API | `DATAFORSEO_LOGIN`, `SERPAPI_KEY` |
| Technical fixes | Lighthouse / PageSpeed Insights | `PAGESPEED_API_KEY` |
| Schema tagging | Jinja templates + `jsonschema` | (templates in repo) |
| Performance tracking | GSC API, Bing WMT | `GOOGLE_CLIENT_*` |
| Job storage | Supabase | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |

## Local setup (when implemented)

```bash
cd python/aeo
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # add keys
python main.py --help
```

Not runnable until Phase 2 scripts are added.
