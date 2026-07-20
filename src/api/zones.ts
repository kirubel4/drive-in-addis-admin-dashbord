import { apiClient } from './client'
import type { Zone } from '../types'
import { MOCK_API, mockResolve, mockZones } from './mock'

export type NewZoneInput = Omit<Zone, 'id' | 'createdAt'>

export async function fetchZones(): Promise<Zone[]> {
  if (MOCK_API) return mockResolve(mockZones)
  const { data } = await apiClient.get<Zone[]>('/zones')
  return data
}

export async function createZone(input: NewZoneInput): Promise<Zone> {
  if (MOCK_API) {
    const zone: Zone = { ...input, id: `zone_${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString() }
    mockZones.unshift(zone)
    return mockResolve(zone)
  }
  const { data } = await apiClient.post<Zone>('/zones', input)
  return data
}

export async function updateZone(id: string, patch: Partial<NewZoneInput>): Promise<Zone> {
  if (MOCK_API) {
    const zone = mockZones.find((z) => z.id === id)
    if (zone) Object.assign(zone, patch)
    return mockResolve(zone as Zone)
  }
  const { data } = await apiClient.patch<Zone>(`/zones/${id}`, patch)
  return data
}

export async function deleteZone(id: string): Promise<void> {
  if (MOCK_API) {
    const idx = mockZones.findIndex((z) => z.id === id)
    if (idx >= 0) mockZones.splice(idx, 1)
    return mockResolve(undefined)
  }
  await apiClient.delete(`/zones/${id}`)
}
