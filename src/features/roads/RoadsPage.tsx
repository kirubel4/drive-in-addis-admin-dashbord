import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Route as RouteIcon, Pencil, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Table, Thead, Th, Tr, Td, SkeletonRow, EmptyState } from '../../components/ui/Table'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { CreateRoadDialog } from './CreateRoadDialog'
import { useDeleteRoad, useRoads } from './hooks'
import type { Road } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function RoadsPage() {
  const { data: roads, isLoading } = useRoads()
  const deleteRoad = useDeleteRoad()
  const navigate = useNavigate()
  const [createOpen, setCreateOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Road | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-500">{roads?.length ?? 0} roads under management</p>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Create road
        </Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Segments</Th>
              <Th>Last updated</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={4} />)}
            {!isLoading && roads?.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    icon={RouteIcon}
                    title="No roads yet"
                    description="Create your first road and define its segments to start managing speed limits."
                    action={
                      <Button size="sm" className="mt-2" onClick={() => setCreateOpen(true)}>
                        <Plus className="h-3.5 w-3.5" />
                        Create road
                      </Button>
                    }
                  />
                </td>
              </tr>
            )}
            {roads?.map((road) => (
              <Tr key={road.id} className="cursor-pointer" onClick={() => navigate(`/roads/${road.id}`)}>
                <Td className="font-medium">{road.name}</Td>
                <Td className="tabular text-ink-500">{road.segments.length}</Td>
                <Td className="text-ink-500">{formatDate(road.updatedAt)}</Td>
                <Td>
                  <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-ink-300/10 hover:text-ink-900"
                      onClick={() => navigate(`/roads/${road.id}`)}
                      aria-label={`Edit ${road.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-danger-soft hover:text-danger"
                      onClick={() => setToDelete(road)}
                      aria-label={`Delete ${road.name}`}
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

      <CreateRoadDialog open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete road"
        description={`This permanently deletes "${toDelete?.name}" and all of its segments. This can't be undone.`}
        onCancel={() => setToDelete(null)}
        loading={deleteRoad.isPending}
        onConfirm={async () => {
          if (!toDelete) return
          await deleteRoad.mutateAsync(toDelete.id)
          setToDelete(null)
        }}
      />
    </div>
  )
}
