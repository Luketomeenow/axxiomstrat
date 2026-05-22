import { useCallback, useEffect, useState } from 'react'
import {
  AI_ROADMAP_DASHBOARD_DEFAULT,
  mergeDashboardWithDefaults,
  ROADMAP_DASHBOARD_STORAGE_KEY,
  slugifyRoadmapLabel,
  type RoadmapDashboardCategory,
  type RoadmapDashboardItem,
  type RoadmapItemStatus,
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

export function useAiRoadmapDashboard() {
  const [categories, setCategories] = useState<RoadmapDashboardCategory[]>(() =>
    mergeDashboardWithDefaults(readStored()),
  )
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
        prev.map((cat) =>
          cat.id !== categoryId
            ? cat
            : {
                ...cat,
                items: cat.items.map((item) =>
                  item.id === itemId ? { ...item, status } : item,
                ),
              },
        ),
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
        }
        return { ...cat, items: [...cat.items, newItem] }
      }),
    )
    return true
  }, [])

  const removeItem = useCallback((categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id !== categoryId
          ? cat
          : { ...cat, items: cat.items.filter((i) => i.id !== itemId) },
      ),
    )
  }, [])

  const resetToDefaults = useCallback(() => {
    setCategories(structuredClone(AI_ROADMAP_DASHBOARD_DEFAULT))
  }, [])

  return {
    categories,
    hydrated,
    setItemStatus,
    addItem,
    removeItem,
    resetToDefaults,
  }
}
