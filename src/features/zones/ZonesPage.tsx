import { useState } from 'react'
import { Plus, ShieldAlert, Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Table, Thead, Th, Tr, Td, SkeletonRow, EmptyState } from '../../components/ui/Table'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { ZoneDialog } from './ZoneDialog'
import { useDeleteZone, useZones } from './hooks'
import type { Zone, ZoneType } from '../../types'

const typeTone: Record<ZoneType, 'school' | 'construction' | 'hospital'> = {
  SCHOOL: 'school',
  CONSTRUCTION: 'construction',
  HOSPITAL: 'hospital',
}

const typeLabels: Record<ZoneType, string> = {
  SCHOOL: 'School',
  CONSTRUCTION: 'Construction',
  HOSPITAL: 'Hospital',
}

export function ZonesPage() {
  const { data: zones, isLoading } = useZones()
  const deleteZone = useDeleteZone()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingZone, setEditingZone] = useState<Zone | null>(null)
  const [toDelete, setToDelete] = useState<Zone | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-500">{zones?.length ?? 0} zones defined</p>
        <Button
          size="sm"
          onClick={() => {
            setEditingZone(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Create zone
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Speed limit</Th>
              <Th>Radius</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}
            {!isLoading && zones?.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    icon={ShieldAlert}
                    title="No zones yet"
                    description="Create school, construction, or hospital zones to enforce localized speed limits."
                    action={
                      <Button size="sm" className="mt-2" onClick={() => setDialogOpen(true)}>
                        <Plus className="h-3.5 w-3.5" />
                        Create zone
                      </Button>
                    }
                  />
                </td>
              </tr>
            )}
            {zones?.map((zone) => (
              <Tr key={zone.id}>
                <Td className="font-medium">{zone.name}</Td>
                <Td>
                  <Badge tone={typeTone[zone.type]}>{typeLabels[zone.type]}</Badge>
                </Td>
                <Td className="tabular">{zone.speedLimit} km/h</Td>
                <Td className="tabular text-ink-500">{zone.radiusMeters} m</Td>
                <Td>
                  <div className="flex justify-end gap-1">
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-ink-300/10 hover:text-ink-900"
                      onClick={() => {
                        setEditingZone(zone)
                        setDialogOpen(true)
                      }}
                      aria-label={`Edit ${zone.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-danger-soft hover:text-danger"
                      onClick={() => setToDelete(zone)}
                      aria-label={`Delete ${zone.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <ZoneDialog open={dialogOpen} onClose={() => setDialogOpen(false)} zone={editingZone} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete zone"
        description={`Delete "${toDelete?.name}"? This can't be undone.`}
        onCancel={() => setToDelete(null)}
        loading={deleteZone.isPending}
        onConfirm={async () => {
          if (!toDelete) return
          await deleteZone.mutateAsync(toDelete.id)
          setToDelete(null)
        }}
      />
    </div>
  )
}
