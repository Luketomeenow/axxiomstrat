import {
  mergeDashboardWithDefaults,
  normalizeDashboardItem,
  type RoadmapDashboardCategory,
} from '../data/aiRoadmapDashboard'
import {
  AI_ROADMAP_WORKSPACE_ID,
  getSupabase,
  isSupabaseConfigured,
  type AiRoadmapSnapshotRow,
} from './supabaseClient'

export type SyncStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error'

export function parseSnapshotPayload(payload: unknown): RoadmapDashboardCategory[] | null {
  if (!Array.isArray(payload)) return null
  try {
    const categories = payload.map((cat) => {
      const c = cat as RoadmapDashboardCategory
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        items: Array.isArray(c.items)
          ? c.items.map((item) => normalizeDashboardItem(item))
          : [],
      }
    })
    return mergeDashboardWithDefaults(categories)
  } catch {
    return null
  }
}

export async function fetchRoadmapSnapshot(): Promise<{
  categories: RoadmapDashboardCategory[] | null
  updatedAt: string | null
  error: string | null
}> {
  if (!isSupabaseConfigured()) {
    return { categories: null, updatedAt: null, error: 'Supabase is not configured' }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return { categories: null, updatedAt: null, error: 'Supabase client unavailable' }
  }

  const { data, error } = await supabase
    .from('ai_roadmap_snapshot')
    .select('payload, updated_at')
    .eq('workspace_id', AI_ROADMAP_WORKSPACE_ID)
    .maybeSingle()

  if (error) {
    return { categories: null, updatedAt: null, error: error.message }
  }

  if (!data) {
    return { categories: null, updatedAt: null, error: null }
  }

  const row = data as Pick<AiRoadmapSnapshotRow, 'payload' | 'updated_at'>
  const categories = parseSnapshotPayload(row.payload)
  return {
    categories,
    updatedAt: row.updated_at,
    error: categories ? null : 'Invalid snapshot payload in database',
  }
}

export async function upsertRoadmapSnapshot(
  categories: RoadmapDashboardCategory[],
  updatedBy?: string,
): Promise<{ updatedAt: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { updatedAt: null, error: 'Supabase is not configured' }
  }

  const supabase = getSupabase()
  if (!supabase) {
    return { updatedAt: null, error: 'Supabase client unavailable' }
  }

  const { data, error } = await supabase
    .from('ai_roadmap_snapshot')
    .upsert(
      {
        workspace_id: AI_ROADMAP_WORKSPACE_ID,
        payload: categories,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy ?? null,
      },
      { onConflict: 'workspace_id' },
    )
    .select('updated_at')
    .single()

  if (error) {
    return { updatedAt: null, error: error.message }
  }

  const row = data as Pick<AiRoadmapSnapshotRow, 'updated_at'>
  return { updatedAt: row.updated_at, error: null }
}

export function subscribeRoadmapSnapshot(
  onRemoteUpdate: (categories: RoadmapDashboardCategory[], updatedAt: string) => void,
): () => void {
  const supabase = getSupabase()
  if (!supabase) return () => {}

  const channel = supabase
    .channel('ai-roadmap-snapshot')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ai_roadmap_snapshot',
        filter: `workspace_id=eq.${AI_ROADMAP_WORKSPACE_ID}`,
      },
      (payload) => {
        const row = (payload.new ?? payload.old) as AiRoadmapSnapshotRow | undefined
        if (!row?.payload || !row.updated_at) return
        const categories = parseSnapshotPayload(row.payload)
        if (categories) onRemoteUpdate(categories, row.updated_at)
      },
    )
    .subscribe()

  return () => {
    void supabase.removeChannel(channel)
  }
}
