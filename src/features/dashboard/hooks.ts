import { useQuery } from '@tanstack/react-query'
import { fetchActivity, fetchRequestVolume, fetchRequestsToday, fetchStats, pingHealth } from '../../api/admin'
import { fetchRoads } from '../../api/roads'

export function useStats() {
  return useQuery({ queryKey: ['admin', 'stats'], queryFn: fetchStats, staleTime: 60_000 })
}

export function useRoadsCount() {
  return useQuery({
    queryKey: ['roads', 'count'],
    queryFn: async () => (await fetchRoads()).length,
    staleTime: 60_000,
  })
}

export function useRequestsToday() {
  return useQuery({ queryKey: ['admin', 'requests-today'], queryFn: fetchRequestsToday, staleTime: 60_000 })
}

export function useRequestVolume() {
  return useQuery({ queryKey: ['admin', 'request-volume'], queryFn: fetchRequestVolume, staleTime: 60_000 })
}

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: pingHealth,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useActivity() {
  return useQuery({ queryKey: ['admin', 'activity'], queryFn: fetchActivity, staleTime: 30_000 })
}
