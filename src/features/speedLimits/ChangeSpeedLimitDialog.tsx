import { useState } from 'react'
import { Dialog } from '../../components/ui/Dialog'
import { Button } from '../../components/ui/Button'
import { Input, Label } from '../../components/ui/Input'
import { cn } from '../../lib/cn'
import { useScheduleSpeedChange } from './hooks'

interface SegmentLike {
  id: string
  label: string
  roadName: string
  speedLimit: number
}

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function ChangeSpeedLimitDialog({ segment, onClose }: { segment: SegmentLike | null; onClose: () => void }) {
  const [newLimit, setNewLimit] = useState('')
  const [mode, setMode] = useState<'immediate' | 'scheduled'>('immediate')
  const [effectiveAt, setEffectiveAt] = useState(toLocalInputValue(new Date()))
  const [expiresAt, setExpiresAt] = useState('')
  const scheduleChange = useScheduleSpeedChange()

  const open = !!segment

  function reset() {
    setNewLimit('')
    setMode('immediate')
    setEffectiveAt(toLocalInputValue(new Date()))
    setExpiresAt('')
  }

  async function handleSubmit() {
    if (!segment || !newLimit) return
    await scheduleChange.mutateAsync({
      segmentId: segment.id,
      newSpeedLimit: Number(newLimit),
      effectiveAt: mode === 'immediate' ? new Date().toISOString() : new Date(effectiveAt).toISOString(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    })
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
      title="Change speed limit"
      description={segment ? `${segment.roadName} \u00b7 ${segment.label} \u00b7 currently ${segment.speedLimit} km/h` : undefined}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={scheduleChange.isPending} disabled={!newLimit}>
            {mode === 'immediate' ? 'Apply now' : 'Schedule change'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="new-limit">New speed limit (km/h)</Label>
          <Input
            id="new-limit"
            type="number"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            placeholder="e.g. 40"
            autoFocus
          />
        </div>

        <div>
          <Label>When should this take effect?</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('immediate')}
              className={cn(
                'rounded-md border px-3 py-2 text-left text-[13px] font-medium transition-colors',
                mode === 'immediate' ? 'border-accent bg-accent-soft text-accent-text' : 'border-border text-ink-700 hover:bg-ink-300/5'
              )}
            >
              Apply immediately
            </button>
            <button
              type="button"
              onClick={() => setMode('scheduled')}
              className={cn(
                'rounded-md border px-3 py-2 text-left text-[13px] font-medium transition-colors',
                mode === 'scheduled' ? 'border-accent bg-accent-soft text-accent-text' : 'border-border text-ink-700 hover:bg-ink-300/5'
              )}
            >
              Schedule for later
            </button>
          </div>
        </div>

        {mode === 'scheduled' && (
          <div>
            <Label htmlFor="effective-at">Effective at</Label>
            <Input
              id="effective-at"
              type="datetime-local"
              value={effectiveAt}
              onChange={(e) => setEffectiveAt(e.target.value)}
            />
          </div>
        )}

        <div>
          <Label htmlFor="expires-at">Expires at (optional &mdash; for temporary limits)</Label>
          <Input
            id="expires-at"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
          <p className="mt-1 text-[12px] text-ink-500">Leave blank for a permanent change. Set this for construction-related slowdowns that should auto-revert.</p>
        </div>
      </div>
    </Dialog>
  )
}
