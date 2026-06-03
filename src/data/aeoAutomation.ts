/**
 * AEO Automation hub — six pillars aligned with axxiom_aeo_playbook.html.
 * Phase 1: manual status in localStorage. Phase 2: job results from Python API.
 */

import {
  countByStatus,
  progressPercent,
  STATUS_META,
  STATUS_ORDER,
  type RoadmapItemStatus,
} from './aiRoadmapDashboard'

export type AeoPillarStatus = RoadmapItemStatus

export type AeoPlaybookTabId =
  | 'why'
  | 'targets'
  | 'content'
  | 'schema'
  | 'authority'
  | 'platforms'
  | 'execution'
  | 'measurement'

export const AEO_AUTOMATION_STORAGE_KEY = 'axxiom-aeo-automation-v1'

/** Phase 2 job metadata (reserved). */
export type AeoJobSummary = {
  jobId?: string
  lastRunAt?: string
  summary?: string
  error?: string
}

export type AeoPillarState = {
  id: string
  status: AeoPillarStatus
  notes?: string
  job?: AeoJobSummary
}

export type AeoPillarDefinition = {
  id: string
  title: string
  tagline: string
  description: string
  playbookTab: AeoPlaybookTabId
  /** Secondary tab for deep links when pillar spans two sections */
  playbookTabAlt?: AeoPlaybookTabId
  checklist: string[]
  automationLabel: string
}

export const AEO_PILLAR_DEFINITIONS: AeoPillarDefinition[] = [
  {
    id: 'data-collection',
    title: 'Data collection',
    tagline: 'Scan site & competitors',
    description:
      'Continuously inventory Axxiom and competitor pages: structure, citations, entity signals, and gaps vs. AI-visible competitors.',
    playbookTab: 'targets',
    playbookTabAlt: 'authority',
    checklist: [
      'List all 8 brand site URLs + top 3 competitors per market',
      'Baseline AI citation share for priority query clusters',
      'Track entity/NAP consistency across directories',
    ],
    automationLabel: 'Site & competitor crawl',
  },
  {
    id: 'content-generation',
    title: 'AI content generation',
    tagline: 'Drafts, meta & alt text',
    description:
      'Generate and refine answer-first copy: FAQ hubs, 40–60 word lead paragraphs, meta descriptions, and image alt text aligned to target queries.',
    playbookTab: 'content',
    checklist: [
      '40–60 word direct answer under every H2',
      'FAQ hub pages (15–25 Q&A pairs) with matching visible text',
      'Expert quotes and statistics with sources',
    ],
    automationLabel: 'LLM content drafts',
  },
  {
    id: 'keyword-research',
    title: 'Keyword research',
    tagline: 'Queries & intent map',
    description:
      'Map every question property managers and facility directors ask AI about elevator service — by intent, region, and service line.',
    playbookTab: 'targets',
    checklist: [
      'Emergency / repair intent queries',
      'Maintenance & compliance intent',
      'Modernization & installation intent',
      'Local “near me” and brand comparison queries',
    ],
    automationLabel: 'Query discovery',
  },
  {
    id: 'technical-fixes',
    title: 'Technical fixes',
    tagline: 'Crawl health & speed',
    description:
      'Repair broken links, indexation issues, Core Web Vitals, and Search Console / Bing WMT hygiene across all properties.',
    playbookTab: 'execution',
    checklist: [
      'Screaming Frog + GSC technical audit (Week 1 playbook)',
      'PageSpeed / CWV fixes on money pages',
      'Sitemaps submitted to Bing Webmaster Tools',
    ],
    automationLabel: 'Technical audit',
  },
  {
    id: 'schema-tagging',
    title: 'Schema tagging',
    tagline: 'JSON-LD for AI readability',
    description:
      'Deploy Organization, FAQPage, Service, LocalBusiness, Article/HowTo schema so AI systems extract structured answers.',
    playbookTab: 'schema',
    checklist: [
      'Organization schema on all 8 homepages',
      'FAQPage on FAQ and Q&A content (text must match visible copy)',
      'Service + LocalBusiness on service & regional pages',
      'Article / HowTo on guides and step-by-step content',
      'Validate in Google Rich Results Test',
    ],
    automationLabel: 'Schema generator',
  },
  {
    id: 'performance-tracking',
    title: 'Performance tracking',
    tagline: 'Rankings & AI visibility',
    description:
      'Automated reporting on AI citation share, AI referral traffic, query coverage, and consultation requests from AI discovery.',
    playbookTab: 'measurement',
    checklist: [
      'AI citation share by query category',
      'AI referral sessions (GA4 segment)',
      'Query coverage vs. target map',
      'Consultation / call attribution from AI traffic',
    ],
    automationLabel: 'Visibility reports',
  },
]

export const AEO_PILLAR_DEFAULT_STATE: AeoPillarState[] = AEO_PILLAR_DEFINITIONS.map((p) => ({
  id: p.id,
  status: 'not_started' as AeoPillarStatus,
}))

export { STATUS_META, STATUS_ORDER, countByStatus, progressPercent }

export function playbookTabHref(tab: AeoPlaybookTabId, alt?: AeoPlaybookTabId): string {
  const primary = `/aeogeoplaybook?tab=${tab}`
  if (!alt) return primary
  return `${primary}&alt=${alt}`
}

export function mergePillarState(stored: AeoPillarState[] | null): AeoPillarState[] {
  if (!stored?.length) return structuredClone(AEO_PILLAR_DEFAULT_STATE)

  const byId = new Map(stored.map((s) => [s.id, s]))
  return AEO_PILLAR_DEFINITIONS.map((def) => {
    const s = byId.get(def.id)
    const status = STATUS_ORDER.includes(s?.status as AeoPillarStatus)
      ? (s!.status as AeoPillarStatus)
      : 'not_started'
    return {
      id: def.id,
      status,
      notes: typeof s?.notes === 'string' ? s.notes : undefined,
      job: s?.job,
    }
  })
}

export function getPillarDefinition(id: string): AeoPillarDefinition | undefined {
  return AEO_PILLAR_DEFINITIONS.find((p) => p.id === id)
}
