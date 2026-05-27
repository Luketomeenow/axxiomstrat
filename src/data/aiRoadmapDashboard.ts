/**
 * Live progress tracker for the May 2026 – May 2027 AI automation roadmap.
 * Defaults mirror workstreams from the roadmap narrative; state persists in localStorage.
 */

export type RoadmapItemStatus = 'not_started' | 'in_progress' | 'done'

/** Automation or sub-task inside a workstream block (e.g. under Lead & inbound). */
export type RoadmapSubItem = {
  id: string
  label: string
  status: RoadmapItemStatus
  /** Longer description, setup notes, or context for the team. */
  details?: string
  /** Optional link to GHL workflow, Zap, doc, etc. */
  linkUrl?: string
  /** Public URLs (Supabase Storage) for screenshots / reference images. */
  imageUrls?: string[]
  /** @deprecated — merged into imageUrls on load */
  imageUrl?: string
  /** @deprecated use details */
  notes?: string
}

export function getSubItemImageUrls(sub: Pick<RoadmapSubItem, 'imageUrls' | 'imageUrl'>): string[] {
  const urls: string[] = []
  if (Array.isArray(sub.imageUrls)) {
    for (const u of sub.imageUrls) {
      if (typeof u === 'string' && u.trim() && !urls.includes(u.trim())) {
        urls.push(u.trim())
      }
    }
  }
  if (typeof sub.imageUrl === 'string' && sub.imageUrl.trim() && !urls.includes(sub.imageUrl.trim())) {
    urls.unshift(sub.imageUrl.trim())
  }
  return urls
}

export type RoadmapDashboardItem = {
  id: string
  label: string
  status: RoadmapItemStatus
  notes?: string
  subItems: RoadmapSubItem[]
}

export type RoadmapDashboardCategory = {
  id: string
  title: string
  description: string
  items: RoadmapDashboardItem[]
}

export const ROADMAP_DASHBOARD_STORAGE_KEY = 'axxiom-ai-roadmap-dashboard-v2'

/** @deprecated — migrated into v2 on load */
const LEGACY_STORAGE_KEY = 'axxiom-ai-roadmap-dashboard-v1'

export const STATUS_ORDER: RoadmapItemStatus[] = ['not_started', 'in_progress', 'done']

export const STATUS_META: Record<
  RoadmapItemStatus,
  { label: string; progressWeight: number; badge: string; ring: string; dot: string }
> = {
  not_started: {
    label: 'Not started',
    progressWeight: 0,
    badge: 'bg-slate-500/15 text-slate-300 ring-slate-500/25',
    ring: 'ring-slate-500/30',
    dot: 'bg-slate-500',
  },
  in_progress: {
    label: 'In progress',
    progressWeight: 0.5,
    badge: 'bg-amber-500/15 text-amber-100 ring-amber-500/35',
    ring: 'ring-amber-400/40',
    dot: 'bg-amber-400',
  },
  done: {
    label: 'Done',
    progressWeight: 1,
    badge: 'bg-emerald-500/15 text-emerald-100 ring-emerald-500/35',
    ring: 'ring-emerald-400/40',
    dot: 'bg-emerald-400',
  },
}

export const CATEGORY_ACCENT: Record<
  string,
  { gradient: string; icon: string; border: string; panel: string }
> = {
  marketing: {
    gradient: 'from-rose-500/20 via-orange-500/10 to-transparent',
    icon: 'text-rose-300',
    border: 'border-rose-500/25',
    panel: 'from-rose-500/15 to-orange-500/5',
  },
  'data-architecture': {
    gradient: 'from-sky-500/20 via-cyan-500/10 to-transparent',
    icon: 'text-sky-300',
    border: 'border-sky-500/25',
    panel: 'from-sky-500/15 to-cyan-500/5',
  },
  operations: {
    gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    icon: 'text-violet-300',
    border: 'border-violet-500/25',
    panel: 'from-violet-500/15 to-indigo-500/5',
  },
}

function normalizeStatus(status: unknown): RoadmapItemStatus {
  return STATUS_ORDER.includes(status as RoadmapItemStatus)
    ? (status as RoadmapItemStatus)
    : 'not_started'
}

function normalizeSubItem(raw: Partial<RoadmapSubItem> & { id: string; label: string }): RoadmapSubItem {
  const details =
    typeof raw.details === 'string'
      ? raw.details
      : typeof raw.notes === 'string'
        ? raw.notes
        : undefined

  const imageUrls = getSubItemImageUrls(raw)

  return {
    id: raw.id,
    label: raw.label,
    status: normalizeStatus(raw.status),
    details: details || undefined,
    linkUrl: typeof raw.linkUrl === 'string' && raw.linkUrl.trim() ? raw.linkUrl.trim() : undefined,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
  }
}

export function normalizeDashboardItem(
  raw: Partial<RoadmapDashboardItem> & { id: string; label: string },
): RoadmapDashboardItem {
  const subItems = Array.isArray(raw.subItems)
    ? raw.subItems
        .filter((s): s is RoadmapSubItem => Boolean(s?.id && s?.label))
        .map((s) => normalizeSubItem(s))
    : []

  return {
    id: raw.id,
    label: raw.label,
    status: normalizeStatus(raw.status),
    notes: typeof raw.notes === 'string' ? raw.notes : undefined,
    subItems,
  }
}

function item(id: string, label: string, status: RoadmapItemStatus = 'not_started'): RoadmapDashboardItem {
  return { id, label, status, subItems: [] }
}

export const AI_ROADMAP_DASHBOARD_DEFAULT: RoadmapDashboardCategory[] = [
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Lead flow, nurture, reputation, revenue, agents, and visibility.',
    items: [
      item('lead-inbound', 'Lead & inbound'),
      item('client-nurture', 'Client nurture'),
      item('reviews', 'Reviews'),
      item('revenue', 'Revenue'),
      item('marketing-agent', 'Marketing agent'),
      item('aeo-geo', 'AEO & GEO'),
      item('data-tracking-tagging', 'Data tracking & tagging'),
      item('dashboard', 'Dashboard'),
    ],
  },
  {
    id: 'data-architecture',
    title: 'Data architecture',
    description: 'Sources, connectors, and measurement plumbing into Fabric.',
    items: [
      item('ghl', 'GHL'),
      item('automations', 'Automations'),
      item('apollo', 'Apollo'),
      item('zapier', 'Zapier'),
      item('ga4', 'GA4'),
      item('gbp', 'GBP'),
      item('callrail', 'CallRail'),
      item('aeo', 'AEO'),
      item('seo', 'SEO'),
      item('geo', 'GEO'),
      item('fieldboss', 'FieldBoss'),
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    description: 'Agents and systems on top of clean ops data.',
    items: [
      item('predictive-maintenance', 'Predictive maintenance'),
      item('dispatch-work-order-agent', 'Dispatch & work order agent'),
      item('compliance-inspection-tracker', 'Compliance & inspection tracker'),
      item('client-communication-ai', 'Client communication AI'),
      item('proposal-quoting-ai', 'Proposal & quoting AI'),
      item('elevator-copilot', 'Elevator Copilot'),
    ],
  },
]

export function slugifyRoadmapLabel(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function countByStatus(items: { status: RoadmapItemStatus }[]) {
  return items.reduce(
    (acc, i) => {
      acc[i.status] += 1
      return acc
    },
    { not_started: 0, in_progress: 0, done: 0 } as Record<RoadmapItemStatus, number>,
  )
}

export function progressPercent(items: { status: RoadmapItemStatus }[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((n, i) => n + STATUS_META[i.status].progressWeight, 0)
  return Math.round((sum / items.length) * 100)
}

/** Flatten block + nested automations for accurate progress. */
export function trackableUnitsForItem(item: RoadmapDashboardItem): { status: RoadmapItemStatus }[] {
  if (item.subItems.length > 0) return item.subItems
  return [item]
}

export function trackableUnitsForCategory(category: RoadmapDashboardCategory) {
  return category.items.flatMap(trackableUnitsForItem)
}

export function allDashboardTrackableUnits(categories: RoadmapDashboardCategory[]) {
  return categories.flatMap(trackableUnitsForCategory)
}

export function effectiveItemStatus(item: RoadmapDashboardItem): RoadmapItemStatus {
  if (item.subItems.length === 0) return item.status
  const counts = countByStatus(item.subItems)
  if (counts.done === item.subItems.length) return 'done'
  if (counts.not_started === item.subItems.length) return 'not_started'
  return 'in_progress'
}

export function mergeDashboardWithDefaults(
  stored: RoadmapDashboardCategory[] | null,
): RoadmapDashboardCategory[] {
  if (!stored?.length) return structuredClone(AI_ROADMAP_DASHBOARD_DEFAULT)

  return AI_ROADMAP_DASHBOARD_DEFAULT.map((defaultCat) => {
    const storedCat = stored.find((c) => c.id === defaultCat.id)
    if (!storedCat) return structuredClone(defaultCat)

    const storedById = new Map(storedCat.items.map((i) => [i.id, i]))
    const merged: RoadmapDashboardItem[] = [...storedCat.items.map((i) => normalizeDashboardItem(i))]

    for (const defaultItem of defaultCat.items) {
      if (!storedById.has(defaultItem.id)) {
        merged.push(structuredClone(defaultItem))
      }
    }

    return {
      ...defaultCat,
      items: merged.map((i) => normalizeDashboardItem(i)),
    }
  })
}

export function readLegacyDashboardStorage(): RoadmapDashboardCategory[] | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as RoadmapDashboardCategory[]
  } catch {
    return null
  }
}
