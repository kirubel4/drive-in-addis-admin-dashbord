import type {
  AdminStats,
  AdminUser,
  ActivityItem,
  Road,
  Segment,
  ScheduledChange,
  Zone,
  RequestVolumePoint,
} from '../types'

export const MOCK_API = import.meta.env.VITE_MOCK_API !== 'false'

const delay = (ms = 380) => new Promise((r) => setTimeout(r, ms))

function id(prefix: string, n: number) {
  return `${prefix}_${String(n).padStart(3, '0')}`
}

const roadNames = [
  'Bole Road', 'Churchill Avenue', 'Ring Road (Southern)', 'Meskel Flower Road',
  'Cameroon Street', 'Africa Avenue (Bole)', 'Debre Zeit Road', 'Haile Gebreselassie Road',
]

export const mockSegments: Segment[] = roadNames.flatMap((_, ri) =>
  Array.from({ length: 2 + (ri % 3) }, (_, si) => {
    const status: Segment['status'] = si === 0 && ri % 4 === 0 ? 'temporary' : si === 1 && ri % 3 === 0 ? 'scheduled' : 'normal'
    return {
      id: id('seg', ri * 10 + si),
      roadId: id('road', ri),
      label: `Segment ${String.fromCharCode(65 + si)}`,
      startLat: 8.98 + ri * 0.01 + si * 0.002,
      startLng: 38.75 + ri * 0.012 + si * 0.002,
      endLat: 8.985 + ri * 0.01 + si * 0.003,
      endLng: 38.758 + ri * 0.012 + si * 0.003,
      speedLimit: [30, 40, 50, 60][(ri + si) % 4],
      order: si,
      status,
      updatedAt: new Date(Date.now() - (ri * 3 + si) * 3600_000).toISOString(),
    }
  })
)

export const mockRoads: Road[] = roadNames.map((name, ri) => ({
  id: id('road', ri),
  name,
  segments: mockSegments.filter((s) => s.roadId === id('road', ri)),
  updatedAt: new Date(Date.now() - ri * 7200_000).toISOString(),
}))

export const mockScheduledChanges: ScheduledChange[] = mockSegments
  .filter((s) => s.status !== 'normal')
  .map((s, i) => ({
    id: id('sched', i),
    segmentId: s.id,
    segmentLabel: s.label,
    roadName: mockRoads.find((r) => r.id === s.roadId)?.name ?? '',
    newSpeedLimit: s.speedLimit,
    previousSpeedLimit: s.speedLimit + 10,
    effectiveAt: new Date(Date.now() + (i + 1) * 3600_000 * 6).toISOString(),
    expiresAt: s.status === 'temporary' ? new Date(Date.now() + (i + 3) * 3600_000 * 24).toISOString() : null,
    status: i % 3 === 0 ? 'active' : 'upcoming',
  }))

export const mockZones: Zone[] = [
  { id: id('zone', 0), name: 'Bole Medhanialem School', type: 'SCHOOL', lat: 8.9954, lng: 38.7891, radiusMeters: 250, speedLimit: 20, createdAt: new Date(Date.now() - 86400_000 * 40).toISOString() },
  { id: id('zone', 1), name: 'Ring Road Overpass Works', type: 'CONSTRUCTION', lat: 9.0102, lng: 38.7612, radiusMeters: 400, speedLimit: 25, createdAt: new Date(Date.now() - 86400_000 * 5).toISOString() },
  { id: id('zone', 2), name: 'Black Lion Hospital', type: 'HOSPITAL', lat: 9.0334, lng: 38.7489, radiusMeters: 300, speedLimit: 20, createdAt: new Date(Date.now() - 86400_000 * 120).toISOString() },
  { id: id('zone', 3), name: 'Nifas Silk School Cluster', type: 'SCHOOL', lat: 8.9711, lng: 38.7965, radiusMeters: 200, speedLimit: 20, createdAt: new Date(Date.now() - 86400_000 * 88).toISOString() },
  { id: id('zone', 4), name: 'CMC Road Resurfacing', type: 'CONSTRUCTION', lat: 9.0198, lng: 38.8102, radiusMeters: 350, speedLimit: 30, createdAt: new Date(Date.now() - 86400_000 * 2).toISOString() },
]

export const mockUsers: AdminUser[] = [
  { id: id('usr', 0), name: 'Selam Tesfaye', email: 'selam.tesfaye@speedway.et', role: 'ADMIN', isVerified: true, isActive: true, createdAt: '2025-11-02T08:12:00Z' },
  { id: id('usr', 1), name: 'Abel Girma', email: 'abel.girma@speedway.et', role: 'ADMIN', isVerified: true, isActive: true, createdAt: '2025-12-14T10:03:00Z' },
  { id: id('usr', 2), name: 'Marta Alemu', email: 'marta.alemu@gmail.com', role: 'USER', isVerified: true, isActive: true, createdAt: '2026-01-05T14:22:00Z' },
  { id: id('usr', 3), name: 'Yonas Bekele', email: 'yonas.bekele@gmail.com', role: 'USER', isVerified: false, isActive: true, createdAt: '2026-02-19T09:47:00Z' },
  { id: id('usr', 4), name: 'Hana Solomon', email: 'hana.solomon@outlook.com', role: 'USER', isVerified: true, isActive: false, createdAt: '2026-03-01T17:30:00Z' },
  { id: id('usr', 5), name: 'Dawit Fikru', email: 'dawit.fikru@gmail.com', role: 'USER', isVerified: true, isActive: true, createdAt: '2026-04-11T11:15:00Z' },
  { id: id('usr', 6), name: 'Rahel Mulugeta', email: 'rahel.mulugeta@gmail.com', role: 'USER', isVerified: false, isActive: true, createdAt: '2026-05-22T13:05:00Z' },
]

export const mockStats: AdminStats = {
  totalUsers: mockUsers.length,
  totalAdmins: mockUsers.filter((u) => u.role === 'ADMIN').length,
  verifiedUsers: mockUsers.filter((u) => u.isVerified).length,
  activeUsers: mockUsers.filter((u) => u.isActive).length,
}

export const mockRequestVolume: RequestVolumePoint[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (6 - i))
  return {
    date: d.toISOString().slice(0, 10),
    requests: Math.round(1400 + Math.sin(i / 1.3) * 300 + i * 60 + Math.random() * 120),
  }
})

export const mockActivity: ActivityItem[] = [
  { id: id('act', 0), action: 'Changed speed limit', actor: 'Selam Tesfaye', target: 'Bole Road · Segment A → 40 km/h', timestamp: new Date(Date.now() - 1800_000).toISOString() },
  { id: id('act', 1), action: 'Created zone', actor: 'Abel Girma', target: 'CMC Road Resurfacing', timestamp: new Date(Date.now() - 5400_000).toISOString() },
  { id: id('act', 2), action: 'Deactivated user', actor: 'Selam Tesfaye', target: 'hana.solomon@outlook.com', timestamp: new Date(Date.now() - 10800_000).toISOString() },
  { id: id('act', 3), action: 'Scheduled change', actor: 'Abel Girma', target: 'Ring Road (Southern) · Segment B', timestamp: new Date(Date.now() - 18000_000).toISOString() },
  { id: id('act', 4), action: 'Added road', actor: 'Selam Tesfaye', target: 'Haile Gebreselassie Road', timestamp: new Date(Date.now() - 28800_000).toISOString() },
]

export async function mockResolve<T>(value: T): Promise<T> {
  await delay()
  return value
}
