export type Role = 'ADMIN' | 'USER'

export interface AuthUser {
  userId: string
  email: string
  role: Role
  name?: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  role: Role
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: Role
  isVerified: boolean
  isActive: boolean
  createdAt: string
}

export interface AdminStats {
  totalUsers: number
  totalAdmins: number
  verifiedUsers: number
  activeUsers: number
}

export interface Segment {
  id: string
  roadId: string
  label: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  speedLimit: number
  order: number
  status: 'normal' | 'scheduled' | 'temporary'
  updatedAt: string
}

export interface Road {
  id: string
  name: string
  segments: Segment[]
  updatedAt: string
}

export type ScheduleStatus = 'upcoming' | 'active' | 'expired' | 'cancelled'

export interface ScheduledChange {
  id: string
  segmentId: string
  segmentLabel: string
  roadName: string
  newSpeedLimit: number
  previousSpeedLimit: number
  effectiveAt: string
  expiresAt: string | null
  status: ScheduleStatus
}

export type ZoneType = 'SCHOOL' | 'CONSTRUCTION' | 'HOSPITAL'

export interface Zone {
  id: string
  name: string
  type: ZoneType
  lat: number
  lng: number
  radiusMeters: number
  speedLimit: number
  createdAt: string
}

export interface ActivityItem {
  id: string
  action: string
  actor: string
  target: string
  timestamp: string
}

export interface RequestVolumePoint {
  date: string
  requests: number
}
