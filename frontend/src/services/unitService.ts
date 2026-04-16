import { apiFetch } from '@/services/api'
import type { iUnitGroups } from '@/types'

export async function fetchUnits(): Promise<iUnitGroups> {
  return apiFetch<iUnitGroups>('/units')
}
