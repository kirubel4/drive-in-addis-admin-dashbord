import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRoad, deleteRoad, deleteSegment, fetchRoads, updateRoad, updateSegment,
} from '../../api/roads'
import type { NewSegmentInput } from '../../api/roads'
import type { Segment } from '../../types'
import { useToast } from '../../contexts/ToastContext'

export function useRoads() {
  return useQuery({ queryKey: ['roads'], queryFn: fetchRoads })
}

export function useCreateRoad() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (input: { name: string; segments: NewSegmentInput[] }) => createRoad(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      toast.success('Road created')
    },
    onError: () => toast.error('Could not create the road. Try again.'),
  })
}

export function useUpdateRoad() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateRoad(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      toast.success('Road updated')
    },
    onError: () => toast.error('Could not update the road.'),
  })
}

export function useDeleteRoad() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => deleteRoad(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      toast.success('Road deleted')
    },
    onError: () => toast.error('Could not delete the road.'),
  })
}

export function useUpdateSegment() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<Segment, 'label' | 'speedLimit'>> }) =>
      updateSegment(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      toast.success('Segment updated')
    },
    onError: () => toast.error('Could not update the segment.'),
  })
}

export function useDeleteSegment() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => deleteSegment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roads'] })
      toast.success('Segment deleted')
    },
    onError: () => toast.error('Could not delete the segment.'),
  })
}
