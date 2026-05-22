/**
 * Live progress tracker for the May 2026 – May 2027 AI automation roadmap.
 * Defaults mirror workstreams from the roadmap narrative; state persists in localStorage.
 */

export type RoadmapItemStatus = 'not_started' | 'in_progress' | 'done'

export type RoadmapDashboardItem = {
  id: string
  label: string
  status: RoadmapItemStatus
  notes?: string
}

export type RoadmapDashboardCategory = {
  id: string
  title: string
  description: string
  items: RoadmapDashboardItem[]
}

export const ROADMAP_DASHBOARD_STORAGE_KEY = 'axxiom-ai-roadmap-dashboard-v1'

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
  { gradient: string; icon: string; border: string }
> = {
  marketing: {
    gradient: 'from-rose-500/20 via-orange-500/10 to-transparent',
    icon: 'text-rose-300',
    border: 'border-rose-500/25',
  },
  'data-architecture': {
    gradient: 'from-sky-500/20 via-cyan-500/10 to-transparent',
    icon: 'text-sky-300',
    border: 'border-sky-500/25',
  },
  operations: {
    gradient: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    icon: 'text-violet-300',
    border: 'border-violet-500/25',
  },
}

function item(id: string, label: string, status: RoadmapItemStatus = 'not_started'): RoadmapDashboardItem {
  return { id, label, status }
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

export function countByStatus(items: RoadmapDashboardItem[]) {
  return items.reduce(
    (acc, i) => {
      acc[i.status] += 1
      return acc
    },
    { not_started: 0, in_progress: 0, done: 0 } as Record<RoadmapItemStatus, number>,
  )
}

export function progressPercent(items: RoadmapDashboardItem[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((n, i) => n + STATUS_META[i.status].progressWeight, 0)
  return Math.round((sum / items.length) * 100)
}

export function allDashboardItems(categories: RoadmapDashboardCategory[]): RoadmapDashboardItem[] {
  return categories.flatMap((c) => c.items)
}

export function mergeDashboardWithDefaults(
  stored: RoadmapDashboardCategory[] | null,
): RoadmapDashboardCategory[] {
  if (!stored?.length) return structuredClone(AI_ROADMAP_DASHBOARD_DEFAULT)

  return AI_ROADMAP_DASHBOARD_DEFAULT.map((defaultCat) => {
    const storedCat = stored.find((c) => c.id === defaultCat.id)
    if (!storedCat) return structuredClone(defaultCat)

    const storedById = new Map(storedCat.items.map((i) => [i.id, i]))
    const merged: RoadmapDashboardItem[] = [...storedCat.items]

    for (const defaultItem of defaultCat.items) {
      if (!storedById.has(defaultItem.id)) {
        merged.push(structuredClone(defaultItem))
      }
    }

    return {
      ...defaultCat,
      items: merged.map((i) => ({
        ...i,
        status: STATUS_ORDER.includes(i.status) ? i.status : 'not_started',
      })),
    }
  })
}
