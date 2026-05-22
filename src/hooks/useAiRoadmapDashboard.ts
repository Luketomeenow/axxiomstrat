import { useCallback, useEffect, useState } from 'react'
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

function readStored(): RoadmapDashboardCategory[] | null {
  try {
    const raw = localStorage.getItem(ROADMAP_DASHBOARD_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as RoadmapDashboardCategory[]
  } catch {
    return null
  }
}

function initialCategories(): RoadmapDashboardCategory[] {
  const v2 = readStored()
  if (v2?.length) return mergeDashboardWithDefaults(v2)
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
  const [categories, setCategories] = useState<RoadmapDashboardCategory[]>(initialCategories)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(ROADMAP_DASHBOARD_STORAGE_KEY, JSON.stringify(categories))
  }, [categories, hydrated])

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

  return {
    categories,
    hydrated,
    setItemStatus,
    setSubItemStatus,
    addItem,
    addSubItem,
    removeItem,
    removeSubItem,
    resetToDefaults,
  }
}
