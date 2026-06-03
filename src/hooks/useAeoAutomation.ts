import { useCallback, useEffect, useState } from 'react'
import {
  AEO_AUTOMATION_STORAGE_KEY,
  AEO_PILLAR_DEFAULT_STATE,
  mergePillarState,
  type AeoPillarState,
  type AeoPillarStatus,
} from '../data/aeoAutomation'

function readStored(): AeoPillarState[] | null {
  try {
    const raw = localStorage.getItem(AEO_AUTOMATION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return mergePillarState(parsed as AeoPillarState[])
  } catch {
    return null
  }
}

export function useAeoAutomation() {
  const [pillars, setPillars] = useState<AeoPillarState[]>(
    () => readStored() ?? structuredClone(AEO_PILLAR_DEFAULT_STATE),
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(AEO_AUTOMATION_STORAGE_KEY, JSON.stringify(pillars))
    } catch {
      /* private mode */
    }
  }, [pillars, hydrated])

  const setPillarStatus = useCallback((pillarId: string, status: AeoPillarStatus) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === pillarId ? { ...p, status } : p)),
    )
  }, [])

  const setPillarNotes = useCallback((pillarId: string, notes: string) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === pillarId ? { ...p, notes: notes.trim() || undefined } : p,
      ),
    )
  }, [])

  const resetPillars = useCallback(() => {
    setPillars(structuredClone(AEO_PILLAR_DEFAULT_STATE))
  }, [])

  return {
    pillars,
    hydrated,
    setPillarStatus,
    setPillarNotes,
    resetPillars,
  }
}
