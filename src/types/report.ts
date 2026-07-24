export const ReportType = {
  CRASH: 'CRASH',
  TRAFFIC_JAM: 'TRAFFIC_JAM',
  ROAD_CLOSED: 'ROAD_CLOSED',
  CONSTRUCTION: 'CONSTRUCTION',
  HAZARD: 'HAZARD',
  OTHER: 'OTHER',
} as const

export type ReportType = (typeof ReportType)[keyof typeof ReportType]

export interface Report {
  id: string
  type: ReportType
  lat: number
  lng: number
  description: string | null
  reporterIp: string | null
  isActive: boolean
  isVerified: boolean
  createdAt: string
}

export interface CreateReportInput {
  type: ReportType
  lat: number
  lng: number
  description?: string
}

export interface ReportAnalytics {
  total: number
  active: number
  verified: number
  byType: Record<string, number>
  recentTrend: { date: string; count: number }[]
}

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  [ReportType.CRASH]: 'Crash',
  [ReportType.TRAFFIC_JAM]: 'Traffic Jam',
  [ReportType.ROAD_CLOSED]: 'Road Closed',
  [ReportType.CONSTRUCTION]: 'Construction',
  [ReportType.HAZARD]: 'Hazard',
  [ReportType.OTHER]: 'Other',
}

export const REPORT_TYPE_COLORS: Record<ReportType, string> = {
  [ReportType.CRASH]: '#dc2626',
  [ReportType.TRAFFIC_JAM]: '#ea580c',
  [ReportType.ROAD_CLOSED]: '#7c2d12',
  [ReportType.CONSTRUCTION]: '#ca8a04',
  [ReportType.HAZARD]: '#9333ea',
  [ReportType.OTHER]: '#6b7280',
}