import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { cancelScheduledChange, fetchRoads, fetchScheduledChanges, scheduleSpeedChange } from '../../api/roads'
import type { ScheduleChangeInput } from '../../api/roads'
import { useToast } from '../../contexts/ToastContext'

export function useAllSegments() {
  const { data: roads, isLoading } = useQuery({ queryKey: ['roads'], queryFn: fetchRoads })
  const segments = useMemo(
    () =>
      (roads ?? []).flatMap((road) =>
        road.segments.map((segment) => ({ ...segment, roadName: road.name }))
      ),
    [roads]
  )
  return { segments, isLoading }
}

export function useScheduledChanges() {
  return useQuery({ queryKey: ['scheduled-changes'], queryFn: fetchScheduledChanges })
}

export function useScheduleSpeedChange() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (input: ScheduleChangeInput) => scheduleSpeedChange(input),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      qc.invalidateQueries({ queryKey: ['scheduled-changes'] })
      toast.success(
        new Date(variables.effectiveAt) <= new Date() ? 'Speed limit updated' : 'Speed limit change scheduled'
      )
    },
    onError: () => toast.error('Could not save the speed limit change.'),
  })
}

export function useCancelScheduledChange() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => cancelScheduledChange(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['scheduled-changes'] })
      toast.success('Scheduled change cancelled')
    },
    onError: () => toast.error('Could not cancel the scheduled change.'),
  })
}
