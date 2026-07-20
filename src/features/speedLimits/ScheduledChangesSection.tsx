import { CalendarClock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table, Thead, Th, Tr, Td, EmptyState } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useCancelScheduledChange, useScheduledChanges } from './hooks'
import type { ScheduleStatus } from '../../types'

const statusTone: Record<ScheduleStatus, 'accent' | 'warning' | 'neutral' | 'danger'> = {
  upcoming: 'accent',
  active: 'warning',
  expired: 'neutral',
  cancelled: 'danger',
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function ScheduledChangesSection() {
  const { data: changes, isLoading } = useScheduledChanges()
  const cancelChange = useCancelScheduledChange()

  const visible = changes?.filter((c) => c.status === 'upcoming' || c.status === 'active')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled changes</CardTitle>
      </CardHeader>
      {isLoading ? (
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-md bg-ink-300/10" />
          ))}
        </CardContent>
      ) : !visible || visible.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No scheduled changes"
          description="Speed limit changes scheduled for later, or temporary limits with an expiry, will appear here."
        />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Road / Segment</Th>
              <Th>Change</Th>
              <Th>Effective</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {visible.map((change) => (
              <Tr key={change.id}>
                <Td>
                  <p className="font-medium">{change.roadName}</p>
                  <p className="text-[12px] text-ink-500">{change.segmentLabel}</p>
                </Td>
                <Td className="tabular">
                  {change.previousSpeedLimit} &rarr; {change.newSpeedLimit} km/h
                </Td>
                <Td className="text-ink-500">{formatDateTime(change.effectiveAt)}</Td>
                <Td className="text-ink-500">{change.expiresAt ? formatDateTime(change.expiresAt) : '—'}</Td>
                <Td>
                  <Badge tone={statusTone[change.status]} dot className="capitalize">
                    {change.status}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelChange.mutate(change.id)}
                      disabled={cancelChange.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  )
}
