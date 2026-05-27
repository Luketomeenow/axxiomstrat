import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchRoadmapSnapshot,
  subscribeRoadmapSnapshot,
  upsertRoadmapSnapshot,
  type SyncStatus,
} from '../lib/aiRoadmapSnapshot'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import {
  AI_ROADMAP_DASHBOARD_DEFAULT,
  mergeDashboardWithDefaults,
  readLegacyDashboardStorage,
  ROADMAP_DASHBOARD_STORAGE_KEY,
  slugifyRoadmapLabel,
  type RoadmapDashboardCategory,
  type RoadmapDashboardItem,
  type RoadmapItemStatus,
  type RoadmapSubItem,
} from '../data/aiRoadmapDashboard'

const SAVE_DEBOUNCE_MS = 600

function readLocalStorage(): RoadmapDashboardCategory[] | null {
  try {
    const raw = localStorage.getItem(ROADMAP_DASHBOARD_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return mergeDashboardWithDefaults(parsed as RoadmapDashboardCategory[])
  } catch {
    return null
  }
}

function writeLocalStorage(categories: RoadmapDashboardCategory[]) {
  try {
    localStorage.setItem(ROADMAP_DASHBOARD_STORAGE_KEY, JSON.stringify(categories))
  } catch {
    /* private mode */
  }
}

function initialLocalCategories(): RoadmapDashboardCategory[] {
  const v2 = readLocalStorage()
  if (v2?.length) return v2
  const legacy = readLegacyDashboardStorage()
  if (legacy?.length) return mergeDashboardWithDefaults(legacy)
  return mergeDashboardWithDefaults(null)
}

function updateItem(
  categories: RoadmapDashboardCategory[],
  categoryId: string,
  itemId: string,
  updater: (item: RoadmapDashboardItem) => RoadmapDashboardItem,
): RoadmapDashboardCategory[] {
  return categories.map((cat) =>
    cat.id !== categoryId
      ? cat
      : {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? updater(item) : item,
          ),
        },
  )
}

export function useAiRoadmapDashboard() {
  const supabaseEnabled = isSupabaseConfigured()
  const [categories, setCategories] = useState<RoadmapDashboardCategory[]>(initialLocalCategories)
  const [hydrated, setHydrated] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(supabaseEnabled ? 'loading' : 'idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)

  const remoteUpdatedAtRef = useRef<string | null>(null)
  const skipNextSaveRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const categoriesRef = useRef(categories)
  categoriesRef.current = categories

  const persistToSupabase = useCallback(async (next: RoadmapDashboardCategory[]) => {
    setSyncStatus('saving')
    setSyncError(null)
    const { updatedAt, error } = await upsertRoadmapSnapshot(next)
    if (error) {
      setSyncStatus('error')
      setSyncError(error)
      return
    }
    if (updatedAt) {
      remoteUpdatedAtRef.current = updatedAt
      setLastSyncedAt(updatedAt)
    }
    setSyncStatus('saved')
  }, [])

  const applyRemoteCategories = useCallback(
    (next: RoadmapDashboardCategory[], updatedAt: string) => {
      if (remoteUpdatedAtRef.current && updatedAt <= remoteUpdatedAtRef.current) return
      remoteUpdatedAtRef.current = updatedAt
      setLastSyncedAt(updatedAt)
      skipNextSaveRef.current = true
      setCategories(next)
      writeLocalStorage(next)
      setSyncStatus('saved')
      setSyncError(null)
    },
    [],
  )

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!supabaseEnabled) {
        setHydrated(true)
        setSyncStatus('idle')
        return
      }

      setSyncStatus('loading')
      const { categories: remote, updatedAt, error } = await fetchRoadmapSnapshot()

      if (cancelled) return

      if (error) {
        setSyncError(error)
        setSyncStatus('error')
        setHydrated(true)
        return
      }

      if (remote?.length) {
        remoteUpdatedAtRef.current = updatedAt
        setLastSyncedAt(updatedAt)
        skipNextSaveRef.current = true
        setCategories(remote)
        writeLocalStorage(remote)
        setSyncStatus('saved')
        setHydrated(true)
        return
      }

      const local = readLocalStorage() ?? mergeDashboardWithDefaults(null)
      skipNextSaveRef.current = true
      setCategories(local)
      setHydrated(true)
      setSyncStatus('saving')
      await persistToSupabase(local)
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [supabaseEnabled, persistToSupabase])

  useEffect(() => {
    if (!supabaseEnabled || !hydrated) return
    return subscribeRoadmapSnapshot(applyRemoteCategories)
  }, [supabaseEnabled, hydrated, applyRemoteCategories])

  useEffect(() => {
    if (!hydrated) return
    writeLocalStorage(categories)

    if (!supabaseEnabled) return

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      void persistToSupabase(categoriesRef.current)
    }, SAVE_DEBOUNCE_MS)

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [categories, hydrated, supabaseEnabled, persistToSupabase])

  const setItemStatus = useCallback(
    (categoryId: string, itemId: string, status: RoadmapItemStatus) => {
      setCategories((prev) =>
        updateItem(prev, categoryId, itemId, (item) => ({ ...item, status })),
      )
    },
    [],
  )

  const setSubItemStatus = useCallback(
    (
      categoryId: string,
      itemId: string,
      subItemId: string,
      status: RoadmapItemStatus,
    ) => {
      setCategories((prev) =>
        updateItem(prev, categoryId, itemId, (item) => ({
          ...item,
          subItems: item.subItems.map((sub) =>
            sub.id === subItemId ? { ...sub, status } : sub,
          ),
        })),
      )
    },
    [],
  )

  const addItem = useCallback((categoryId: string, label: string) => {
    const trimmed = label.trim()
    if (!trimmed) return false

    const baseId = slugifyRoadmapLabel(trimmed)
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat
        let id = baseId || `item-${Date.now()}`
        let n = 2
        while (cat.items.some((i) => i.id === id)) {
          id = `${baseId}-${n}`
          n += 1
        }
        const newItem: RoadmapDashboardItem = {
          id,
          label: trimmed,
          status: 'not_started',
          subItems: [],
        }
        return { ...cat, items: [...cat.items, newItem] }
      }),
    )
    return true
  }, [])

  const addSubItem = useCallback(
    (categoryId: string, itemId: string, label: string) => {
      const trimmed = label.trim()
      if (!trimmed) return false

      const baseId = slugifyRoadmapLabel(trimmed)
      setCategories((prev) =>
        updateItem(prev, categoryId, itemId, (item) => {
          let id = baseId || `sub-${Date.now()}`
          let n = 2
          while (item.subItems.some((s) => s.id === id)) {
            id = `${baseId}-${n}`
            n += 1
          }
          const newSub: RoadmapSubItem = {
            id,
            label: trimmed,
            status: 'not_started',
          }
          return { ...item, subItems: [...item.subItems, newSub] }
        }),
      )
      return true
    },
    [],
  )

  const removeItem = useCallback((categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : { ...cat, items: cat.items.filter((i) => i.id !== itemId) },
      ),
    )
  }, [])

  const updateSubItem = useCallback(
    (
      categoryId: string,
      itemId: string,
      subItemId: string,
      patch: Partial<RoadmapSubItem>,
    ) => {
      setCategories((prev) =>
        updateItem(prev, categoryId, itemId, (item) => ({
          ...item,
          subItems: item.subItems.map((sub) =>
            sub.id === subItemId ? { ...sub, ...patch } : sub,
          ),
        })),
      )
    },
    [],
  )

  const removeSubItem = useCallback(
    (categoryId: string, itemId: string, subItemId: string) => {
      setCategories((prev) =>
        updateItem(prev, categoryId, itemId, (item) => ({
          ...item,
          subItems: item.subItems.filter((s) => s.id !== subItemId),
        })),
      )
    },
    [],
  )

  const resetToDefaults = useCallback(() => {
    setCategories(structuredClone(AI_ROADMAP_DASHBOARD_DEFAULT))
  }, [])

  const retrySync = useCallback(() => {
    void persistToSupabase(categoriesRef.current)
  }, [persistToSupabase])

  return {
    categories,
    hydrated,
    syncStatus,
    syncError,
    lastSyncedAt,
    supabaseEnabled,
    setItemStatus,
    setSubItemStatus,
    addItem,
    addSubItem,
    updateSubItem,
    removeItem,
    removeSubItem,
    resetToDefaults,
    retrySync,
  }
}
