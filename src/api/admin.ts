import { apiClient } from './client'
import type { AdminStats, AdminUser, ActivityItem, RequestVolumePoint, Role } from '../types'
import { MOCK_API, mockActivity, mockRequestVolume, mockResolve, mockStats, mockUsers } from './mock'

export async function fetchStats(): Promise<AdminStats> {
  if (MOCK_API) return mockResolve(mockStats)
  const { data } = await apiClient.get<AdminStats>('/admin/status')
  return data
}

export async function fetchRequestsToday(): Promise<number> {
  if (MOCK_API) return mockResolve(mockRequestVolume[mockRequestVolume.length - 1].requests)
  const { data } = await apiClient.get<{ count: number }>('/admin/stats/requests-today')
  return data.count
}

export async function fetchRequestVolume(): Promise<RequestVolumePoint[]> {
  if (MOCK_API) return mockResolve(mockRequestVolume)
  const { data } = await apiClient.get<RequestVolumePoint[]>('/admin/stats/request-volume')
  return data
}

export async function fetchActivity(): Promise<ActivityItem[]> {
  if (MOCK_API) return mockResolve(mockActivity)
  const { data } = await apiClient.get<ActivityItem[]>('/admin/activity')
  return data
}

export async function pingHealth(): Promise<boolean> {
  if (MOCK_API) return mockResolve(true)
  try {
    await apiClient.get('/health')
    return true
  } catch {
    return false
  }
}

export async function fetchUsers(): Promise<AdminUser[]> {
  if (MOCK_API) return mockResolve(mockUsers)
  const { data } = await apiClient.get<AdminUser[]>('/admin/users')
  return data
}

export async function updateUserRole(id: string, role: Role): Promise<AdminUser> {
  if (MOCK_API) {
    const user = mockUsers.find((u) => u.id === id)
    if (user) user.role = role
    return mockResolve(user as AdminUser)
  }
  const { data } = await apiClient.patch<AdminUser>(`/admin/users/${id}/role`, { role })
  return data
}

export async function updateUserStatus(id: string, isActive: boolean): Promise<AdminUser> {
  if (MOCK_API) {
    const user = mockUsers.find((u) => u.id === id)
    if (user) user.isActive = isActive
    return mockResolve(user as AdminUser)
  }
  const { data } = await apiClient.patch<AdminUser>(`/admin/users/${id}/status`, { isActive })
  return data
}

export async function deleteUser(id: string): Promise<void> {
  if (MOCK_API) {
    const idx = mockUsers.findIndex((u) => u.id === id)
    if (idx >= 0) mockUsers.splice(idx, 1)
    return mockResolve(undefined)
  }
  await apiClient.delete(`/admin/users/${id}`)
}
