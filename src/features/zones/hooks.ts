import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createZone, deleteZone, fetchZones, updateZone } from '../../api/zones'
import type { NewZoneInput } from '../../api/zones'
import { useToast } from '../../contexts/ToastContext'

export function useZones() {
  return useQuery({ queryKey: ['zones'], queryFn: fetchZones })
}

export function useCreateZone() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (input: NewZoneInput) => createZone(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] })
      toast.success('Zone created')
    },
    onError: () => toast.error('Could not create the zone.'),
  })
}

export function useUpdateZone() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewZoneInput> }) => updateZone(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] })
      toast.success('Zone updated')
    },
    onError: () => toast.error('Could not update the zone.'),
  })
}

export function useDeleteZone() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => deleteZone(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['zones'] })
      toast.success('Zone deleted')
    },
    onError: () => toast.error('Could not delete the zone.'),
  })
}
