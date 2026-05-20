/**
 * Narrative deck for the May 2026 – May 2027 AI automation roadmap.
 * Grounded in public/axxiom_ai_roadmap_2026_2027.html (full task detail lives there).
 */

export type SlideCallout = {
  variant: 'info' | 'warn'
  title?: string
  text: string
}

export type TimelinePhase = {
  month: string
  phase: string
  accent: 'danger' | 'amber' | 'green' | 'blue' | 'purple' | 'success'
}

export type RoadmapSlide = {
  id: string
  title: string
  subtitle?: string
  paragraphs?: string[]
  bullets?: string[]
  /** Optional horizontal timeline strip */
  timeline?: TimelinePhase[]
  callout?: SlideCallout
  footerNote?: string
  /** In-app navigation CTA (e.g. full reference doc) */
  cta?: { to: string; label: string }
}

export const AI_ROADMAP_SLIDES: RoadmapSlide[] = [
  {
    id: 'title',
    title: 'Axxiom AI automation roadmap',
    subtitle: 'May 2026 → May 2027',
    paragraphs: [
      'A year-long arc that turns disconnected marketing and ops signals into a governed data asset — then layers agents, ML, and Microsoft-native AI on top once the data is trustworthy.',
    ],
  },
  {
    id: 'principle',
    title: 'Guiding principle: data before agents',
    paragraphs: [
      'You cannot build reliable AI agents on messy or incomplete data. You cannot get clean data without building ingestion pipelines and governance first.',
      'Marketing data is sequenced first: external APIs with clearer schemas and immediate business value. Ops data (FieldBoss, Dynamics) follows — richer, messier, and the foundation for dispatch and predictive maintenance.',
    ],
    callout: {
      variant: 'info',
      title: 'Why marketing leads',
      text: 'Doing marketing right establishes patterns (Fabric Delta tables, Key Vault, Power BI, UTM hygiene) that you reuse for ops. Same lakehouse discipline — half the ambiguity.',
    },
  },
  {
    id: 'timeline',
    title: 'Twelve months in seven beats',
    timeline: [
      { month: "May '26", phase: 'Phase 1 · Data foundation', accent: 'danger' },
      { month: "Jun–Jul '26", phase: 'Phase 2 · Marketing auto + agents start', accent: 'amber' },
      { month: "Aug '26", phase: '3-month milestone', accent: 'green' },
      { month: "Sep–Nov '26", phase: 'Phase 3 · Ops data layer', accent: 'blue' },
      { month: "Dec–Feb '27", phase: 'Phase 4 · Agents live', accent: 'purple' },
      { month: "May '27", phase: '1-year milestone', accent: 'success' },
    ],
    paragraphs: [
      'Each beat has an exit test: data flowing, dashboards trusted, or agents in production. Slipping a beat usually means fixing upstream data — not buying more AI.',
    ],
  },
  {
    id: 'milestones',
    title: 'Three milestone goals',
    bullets: [
      'May 2026 — Data foundation plus core marketing automations firing (roughly four weeks).',
      'August 2026 — Three months: marketing automations live, full attribution visible in Power BI.',
      'May 2027 — One year: clean marketing and ops data suitable for ML training and production agents.',
    ],
  },
  {
    id: 'outcomes',
    title: 'What “done” looks like at one year',
    bullets: [
      'Marketing data layer: GHL, Google Ads, GA4, GBP, Apollo, CallRail → Fabric Delta → Power BI live.',
      'Marketing automations: lead response, nurture, reviews, renewals, AiSDR outbound — GHL + Zapier.',
      'Ops data layer: FieldBoss + Dynamics → Delta tables → fault codes extracted → daily asset risk scores.',
      'AI readiness: 12+ months of clean history for predictive models and dispatch-grade tech profiles.',
      'Microsoft Foundry: department-level agents on top of Fabric.',
      'Claude Teams: Axxiom master context + department skills for every team.',
    ],
  },
  {
    id: 'schema-intro',
    title: 'The data schema story',
    paragraphs: [
      'May is when you define the tables that every later phase depends on. Each table has one job: either feed a dashboard today or become training features tomorrow.',
    ],
    bullets: [
      'campaign_daily_metrics — spend and performance truth from Google Ads (and peers).',
      'lead_attribution — the bridge from UTMs and GHL to campaigns (join key lives here).',
      'call_tracking — closes the “phone call from which ad?” gap via CallRail.',
      'ga4_sessions — web behaviour and landing paths.',
      'outbound_pipeline — Apollo + AiSDR sequence outcomes.',
      'gbp_reviews — reputation volume, sentiment, and (later) AI drafts.',
    ],
  },
  {
    id: 'critical-join',
    title: 'The join that makes ROAS possible',
    paragraphs: [
      'Leadership wants one chain: spend → impressions → clicks → calls → form fills → pipeline → closed ARR. That only works if the same campaign identifier survives every hop.',
    ],
    callout: {
      variant: 'warn',
      title: 'Preserve campaign_id end-to-end',
      text: 'campaign_daily_metrics.campaign_id = lead_attribution.campaign_id = call_tracking.campaign_id. If UTMs drop the ID, the ROAS story breaks — fix gaps in May, not in November.',
    },
    bullets: [
      'Example outcome: “$4,140 on Hotel FL → 31 calls, 23 forms → 4 contracts → $87k ARR → 21x ROAS.”',
    ],
  },
  {
    id: 'phase-1',
    title: 'Phase 1 — May 2026',
    subtitle: 'Data foundation',
    paragraphs: [
      'Wire the six marketing sources into Fabric with daily loads. Stand up the first GHL workflows and prove Power BI can read live Delta tables.',
      'Week-by-week work includes connector hardening, UTM audits, Key Vault secrets, and a May milestone review: all sources flowing, minimum viable dashboards, documentation for handoff.',
    ],
  },
  {
    id: 'phase-2',
    title: 'Phase 2 — June & July 2026',
    subtitle: 'Marketing automation + first agents',
    bullets: [
      'Finish the GHL suite: renewals, inspection prep, post-job summaries, full outbound loop (AiSDR → Apollo → GHL).',
      'Build the Fabric attribution query joining spend, leads, and calls — ship Marketing Dashboard v2.',
      'July: first LangChain agents — lead scoring + vertical classification, Qdrant on Railway for memory, LangSmith with PII-safe tracing, GBP review draft agent.',
    ],
  },
  {
    id: 'phase-3',
    title: 'Phase 3 — August to November 2026',
    subtitle: 'Prove marketing, then harden ops',
    bullets: [
      'August: three-month milestone — checklist presentation to leadership (sources, attribution, automations, agents live).',
      'September onward: FieldBoss and Dynamics into Fabric; bidirectional sync where scores write back.',
      'Fault-code extraction from tech notes (LangChain + Azure OpenAI) with confidence thresholds and human review.',
      'Compliance tracker agent for expiring certs; ops Power BI; heuristic predictive maintenance pipeline feeding ax_AssetRiskScore for future ML.',
    ],
  },
  {
    id: 'phase-4',
    title: 'Phase 4 — December 2026 to May 2027',
    subtitle: 'Production agents, ML, Foundry, Claude',
    bullets: [
      'LangGraph: dispatch + work order agent, predictive maintenance agent, Azure ML training on six months of clean risk + work-order history.',
      'Revenue agents: modernisation pipeline; Microsoft Foundry for department-level assistants.',
      'Claude Teams: master context + six department skill libraries.',
      'May 2027: measurable moat — competitors cannot replay twelve months of your cleaned, labelled ops + marketing history.',
    ],
  },
  {
    id: 'tech-stack',
    title: 'Tech stack map (grouped)',
    bullets: [
      'Marketing (Month 1): GHL, Zapier, Apollo, AiSDR, CallRail, Google Ads, GA4, GBP.',
      'Ops (Month 4+): FieldBoss, Dynamics 365, Power Automate, Azure Maps, Azure Communication Services.',
      'Data (Month 1): Fabric OneLake, staging lakehouse, Delta tables, Power BI, Key Vault.',
      'AI / ML (Month 3–12): LangChain, LangGraph, LangSmith, Voyage AI, MongoDB, Qdrant, Azure OpenAI, Azure ML.',
      'Deployment (Month 2–12): Railway (dev), Vercel (web), Azure Container Apps, Azure Event Grid.',
      'Future AI (Month 9–12): Microsoft Foundry, Claude Teams, Copilot Studio.',
    ],
  },
  {
    id: 'vectors-mongo',
    title: 'MongoDB, Voyage, Qdrant — how they fit',
    paragraphs: [
      'MongoDB holds structured metadata beside vectors; Qdrant is the retrieval store for agent memory; Voyage generates embeddings tuned for retrieval quality.',
      'Railway hosts agents early; migrate to Azure Container Apps when stable. Vercel fronts any lightweight web surfaces talking to Fabric APIs.',
    ],
  },
  {
    id: 'risks',
    title: 'Dependencies & risks',
    bullets: [
      'UTM and campaign_id hygiene — a single break loses ROAS.',
      'FieldBoss / Salesforce API complexity and rate limits — plan buffer in Phase 3.',
      'LangSmith and agents: log reasoning metadata, not raw PII — align retention to compliance.',
      'Change management: August leadership readout is the budget gate for Phase 3 scope.',
    ],
  },
  {
    id: 'closing',
    title: 'Next step',
    paragraphs: [
      'Walk the reference doc tab-by-tab when you are ready to execute: week blocks, task tags, and field-level schemas live there.',
    ],
    bullets: [
      'Open the full roadmap for May week-by-week tasks and the complete stack appendix.',
    ],
    footerNote: 'The tabbed viewer loads the same HTML source with full detail.',
    cta: { to: '/axxiomairoadmap', label: 'Open full roadmap (reference)' },
  },
]
