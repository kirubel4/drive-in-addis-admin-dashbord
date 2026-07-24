import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Report, CreateReportInput, ReportAnalytics } from './types'
import { apiClient } from '../../api/client'
const REPORTS_KEY = 'reports'

export function useReports() {
  return useQuery({
    queryKey: [REPORTS_KEY],
    queryFn: async () => {
      const { data } = await apiClient.get<Report[]>('/reports/all')
      return data
    },
  })
}

export function useReportAnalytics() {
  return useQuery({
    queryKey: [REPORTS_KEY, 'analytics'],
    queryFn: async () => {
      const { data } = await apiClient.get<ReportAnalytics>('/reports/analytics')
      return data
    },
  })
}

export function useCreateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateReportInput) => {
      const { data } = await apiClient.post<Report>('/reports', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] })
    },
  })
}

export function useVerifyReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<Report>(`/reports/${id}/verify`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] })
    },
  })
}

export function useDeactivateReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<Report>(`/reports/${id}/deactivate`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] })
    },
  })
}

export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/reports/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_KEY] })
    },
  })
}