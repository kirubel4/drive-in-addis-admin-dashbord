import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Dialog } from '../../components/ui/Dialog'
import { Button } from '../../components/ui/Button'
import { Input, Label } from '../../components/ui/Input'
import { useCreateRoad } from './hooks'
import type { NewSegmentInput } from '../../api/roads'
import { SegmentMapPreview } from './SegmentMapPreview'

function emptySegment(order: number): NewSegmentInput {
  return { label: `Segment ${String.fromCharCode(65 + order)}`, startLat: 8.98, startLng: 38.75, endLat: 8.985, endLng: 38.755, speedLimit: 40, order }
}

export function CreateRoadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [segments, setSegments] = useState<NewSegmentInput[]>([emptySegment(0)])
  const createRoad = useCreateRoad()

  function reset() {
    setName('')
    setSegments([emptySegment(0)])
  }

  function updateSegment(index: number, patch: Partial<NewSegmentInput>) {
    setSegments((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function addSegment() {
    setSegments((prev) => [...prev, emptySegment(prev.length)])
  }

  function removeSegment(index: number) {
    setSegments((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })))
  }

  async function handleSubmit() {
    if (!name.trim()) return
    await createRoad.mutateAsync({ name: name.trim(), segments })
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Create road"
      description="Add the road name, then define one or more segments."
      size="lg"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={createRoad.isPending} disabled={!name.trim()}>
            Create road
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div>
          <Label htmlFor="road-name">Road name</Label>
          <Input id="road-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bole Road" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="mb-0">Segments</Label>
            <Button variant="secondary" size="sm" onClick={addSegment} type="button">
              <Plus className="h-3.5 w-3.5" />
              Add segment
            </Button>
          </div>

          <div className="space-y-3">
            {segments.map((seg, i) => (
              <div key={i} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <Input
                    value={seg.label}
                    onChange={(e) => updateSegment(i, { label: e.target.value })}
                    className="h-8 max-w-[200px] font-medium"
                  />
                  {segments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSegment(i)}
                      className="text-ink-400 hover:text-danger"
                      aria-label="Remove segment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <div>
                    <Label className="text-[11px]">Start lat</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={seg.startLat}
                      onChange={(e) => updateSegment(i, { startLat: Number(e.target.value) })}
                      className="h-8 font-mono text-[13px]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">Start lng</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={seg.startLng}
                      onChange={(e) => updateSegment(i, { startLng: Number(e.target.value) })}
                      className="h-8 font-mono text-[13px]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">End lat</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={seg.endLat}
                      onChange={(e) => updateSegment(i, { endLat: Number(e.target.value) })}
                      className="h-8 font-mono text-[13px]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">End lng</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={seg.endLng}
                      onChange={(e) => updateSegment(i, { endLng: Number(e.target.value) })}
                      className="h-8 font-mono text-[13px]"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px]">Speed limit</Label>
                    <Input
                      type="number"
                      value={seg.speedLimit}
                      onChange={(e) => updateSegment(i, { speedLimit: Number(e.target.value) })}
                      className="h-8 text-[13px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Map preview</Label>
          <SegmentMapPreview segments={segments} />
        </div>
      </div>
    </Dialog>
  )
}
