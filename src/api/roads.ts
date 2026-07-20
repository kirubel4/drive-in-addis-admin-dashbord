import { apiClient } from './client'
import type { Road, ScheduledChange, Segment } from '../types'
import { MOCK_API, mockRoads, mockResolve, mockScheduledChanges, mockSegments } from './mock'

export interface NewSegmentInput {
  label: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  speedLimit: number
  order: number
}

export async function fetchRoads(): Promise<Road[]> {
  if (MOCK_API) return mockResolve(mockRoads)
  const { data } = await apiClient.get<Road[]>('/roads')
  return data
}

export async function createRoad(input: { name: string; segments: NewSegmentInput[] }): Promise<Road> {
  if (MOCK_API) {
    const road: Road = {
      id: `road_${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      segments: input.segments.map((s, i) => ({
        ...s,
        id: `seg_${Math.random().toString(36).slice(2, 8)}`,
        roadId: 'pending',
        status: 'normal',
        updatedAt: new Date().toISOString(),
        order: i,
      })),
      updatedAt: new Date().toISOString(),
    }
    road.segments.forEach((s) => (s.roadId = road.id))
    mockRoads.unshift(road)
    return mockResolve(road)
  }
  const { data } = await apiClient.post<Road>('/roads', { name: input.name })
  for (const seg of input.segments) {
    await apiClient.post(`/roads/${data.id}/segments`, seg)
  }
  return fetchRoads().then((roads) => roads.find((r) => r.id === data.id) ?? data)
}

export async function updateRoad(id: string, name: string): Promise<Road> {
  if (MOCK_API) {
    const road = mockRoads.find((r) => r.id === id)
    if (road) road.name = name
    return mockResolve(road as Road)
  }
  const { data } = await apiClient.patch<Road>(`/roads/${id}`, { name })
  return data
}

export async function deleteRoad(id: string): Promise<void> {
  if (MOCK_API) {
    const idx = mockRoads.findIndex((r) => r.id === id)
    if (idx >= 0) mockRoads.splice(idx, 1)
    return mockResolve(undefined)
  }
  await apiClient.delete(`/roads/${id}`)
}

export async function updateSegment(id: string, patch: Partial<Pick<Segment, 'label' | 'speedLimit'>>): Promise<Segment> {
  if (MOCK_API) {
    const seg = mockSegments.find((s) => s.id === id)
    if (seg) Object.assign(seg, patch, { updatedAt: new Date().toISOString() })
    return mockResolve(seg as Segment)
  }
  const { data } = await apiClient.patch<Segment>(`/segments/${id}`, patch)
  return data
}

export async function deleteSegment(id: string): Promise<void> {
  if (MOCK_API) {
    const idx = mockSegments.findIndex((s) => s.id === id)
    if (idx >= 0) mockSegments.splice(idx, 1)
    return mockResolve(undefined)
  }
  await apiClient.delete(`/segments/${id}`)
}

export interface ScheduleChangeInput {
  segmentId: string
  newSpeedLimit: number
  effectiveAt: string
  expiresAt?: string | null
}

export async function scheduleSpeedChange(input: ScheduleChangeInput): Promise<ScheduledChange> {
  if (MOCK_API) {
    const seg = mockSegments.find((s) => s.id === input.segmentId)
    const change: ScheduledChange = {
      id: `sched_${Math.random().toString(36).slice(2, 8)}`,
      segmentId: input.segmentId,
      segmentLabel: seg?.label ?? '',
      roadName: mockRoads.find((r) => r.id === seg?.roadId)?.name ?? '',
      previousSpeedLimit: seg?.speedLimit ?? 0,
      newSpeedLimit: input.newSpeedLimit,
      effectiveAt: input.effectiveAt,
      expiresAt: input.expiresAt ?? null,
      status: new Date(input.effectiveAt) <= new Date() ? 'active' : 'upcoming',
    }
    if (seg && change.status === 'active') {
      seg.speedLimit = input.newSpeedLimit
      seg.status = input.expiresAt ? 'temporary' : 'normal'
    } else if (seg) {
      seg.status = 'scheduled'
    }
    mockScheduledChanges.unshift(change)
    return mockResolve(change)
  }
  const { data } = await apiClient.post<ScheduledChange>(`/segments/${input.segmentId}/schedule-change`, {
    newSpeedLimit: input.newSpeedLimit,
    effectiveAt: input.effectiveAt,
    expiresAt: input.expiresAt,
  })
  return data
}

export async function fetchScheduledChanges(): Promise<ScheduledChange[]> {
  if (MOCK_API) return mockResolve(mockScheduledChanges)
  const { data } = await apiClient.get<ScheduledChange[]>('/scheduled-changes')
  return data
}

export async function cancelScheduledChange(id: string): Promise<void> {
  if (MOCK_API) {
    const change = mockScheduledChanges.find((c) => c.id === id)
    if (change) change.status = 'cancelled'
    return mockResolve(undefined)
  }
  await apiClient.delete(`/scheduled-changes/${id}`)
}
