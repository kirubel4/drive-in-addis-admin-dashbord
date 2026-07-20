import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, Thead, Th, Tr, Td } from '../../components/ui/Table'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useDeleteSegment, useRoads, useUpdateSegment } from './hooks'
import { SegmentMapPreview } from './SegmentMapPreview'
import type { Segment } from '../../types'

const statusTone: Record<Segment['status'], 'success' | 'warning' | 'accent'> = {
  normal: 'success',
  scheduled: 'accent',
  temporary: 'warning',
}

export function RoadDetailPage() {
  const { roadId } = useParams()
  const navigate = useNavigate()
  const { data: roads, isLoading } = useRoads()
  const updateSegment = useUpdateSegment()
  const deleteSegment = useDeleteSegment()
  const [toDelete, setToDelete] = useState<Segment | null>(null)
  const [editing, setEditing] = useState<Record<string, { label: string; speedLimit: string }>>({})

  const road = roads?.find((r) => r.id === roadId)

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-lg bg-ink-300/10" />
  }

  if (!road) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-ink-500">Road not found.</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/roads')}>
          Back to roads
        </Button>
      </div>
    )
  }

  function fieldFor(seg: Segment) {
    return editing[seg.id] ?? { label: seg.label, speedLimit: String(seg.speedLimit) }
  }

  function setField(seg: Segment, patch: Partial<{ label: string; speedLimit: string }>) {
    setEditing((prev) => ({ ...prev, [seg.id]: { ...fieldFor(seg), ...patch } }))
  }

  async function commit(seg: Segment) {
    const field = fieldFor(seg)
    const speedLimit = Number(field.speedLimit)
    if (field.label === seg.label && speedLimit === seg.speedLimit) return
    await updateSegment.mutateAsync({ id: seg.id, patch: { label: field.label, speedLimit } })
    setEditing((prev) => {
      const next = { ...prev }
      delete next[seg.id]
      return next
    })
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/roads')}
        className="flex items-center gap-1.5 text-[13px] font-medium text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to roads
      </button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{road.name} &middot; Segments</CardTitle>
          </CardHeader>
          <Table>
            <Thead>
              <tr>
                <Th>Label</Th>
                <Th>Coordinates</Th>
                <Th>Speed limit</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {road.segments.map((seg) => {
                const field = fieldFor(seg)
                return (
                  <Tr key={seg.id}>
                    <Td>
                      <Input
                        value={field.label}
                        onChange={(e) => setField(seg, { label: e.target.value })}
                        onBlur={() => commit(seg)}
                        className="h-8 max-w-[140px]"
                      />
                    </Td>
                    <Td>
                      <span className="font-mono text-[12px] text-ink-500">
                        {seg.startLat.toFixed(4)}, {seg.startLng.toFixed(4)} &rarr; {seg.endLat.toFixed(4)}, {seg.endLng.toFixed(4)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={field.speedLimit}
                          onChange={(e) => setField(seg, { speedLimit: e.target.value })}
                          onBlur={() => commit(seg)}
                          className="h-8 w-20 tabular"
                        />
                        <span className="text-[12px] text-ink-500">km/h</span>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={statusTone[seg.status]} dot className="capitalize">
                        {seg.status}
                      </Badge>
                    </Td>
                    <Td>
                      <div className="flex justify-end">
                        <button
                          className="rounded-md p-1.5 text-ink-400 hover:bg-danger-soft hover:text-danger"
                          onClick={() => setToDelete(seg)}
                          aria-label={`Delete ${seg.label}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </Table>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map preview</CardTitle>
          </CardHeader>
          <CardContent>
            <SegmentMapPreview segments={road.segments} height={340} />
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete segment"
        description={`Delete "${toDelete?.label}"? This can't be undone.`}
        onCancel={() => setToDelete(null)}
        loading={deleteSegment.isPending}
        onConfirm={async () => {
          if (!toDelete) return
          await deleteSegment.mutateAsync(toDelete.id)
          setToDelete(null)
        }}
      />
    </div>
  )
}
