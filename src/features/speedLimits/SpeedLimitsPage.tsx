import { useMemo, useState } from 'react'
import { Search, Gauge } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Table, Thead, Th, Tr, Td, SkeletonRow, EmptyState } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAllSegments } from './hooks'
import { ChangeSpeedLimitDialog } from './ChangeSpeedLimitDialog'
import { ScheduledChangesSection } from './ScheduledChangesSection'
import type { Segment } from '../../types'

const statusTone: Record<Segment['status'], 'success' | 'warning' | 'accent'> = {
  normal: 'success',
  scheduled: 'accent',
  temporary: 'warning',
}

type SortKey = 'road' | 'speedLimit'

export function SpeedLimitsPage() {
  const { segments, isLoading } = useAllSegments()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Segment['status']>('all')
  const [sortKey, setSortKey] = useState<SortKey>('road')
  const [activeSegment, setActiveSegment] = useState<(Segment & { roadName: string }) | null>(null)

  const filtered = useMemo(() => {
    let list = segments
    if (statusFilter !== 'all') list = list.filter((s) => s.status === statusFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((s) => s.roadName.toLowerCase().includes(q) || s.label.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) =>
      sortKey === 'road' ? a.roadName.localeCompare(b.roadName) : b.speedLimit - a.speedLimit
    )
  }, [segments, statusFilter, query, sortKey])

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-2.5 border-b border-border-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search road or segment"
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="w-40">
              <option value="all">All statuses</option>
              <option value="normal">Normal</option>
              <option value="scheduled">Scheduled</option>
              <option value="temporary">Temporary</option>
            </Select>
            <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="w-40">
              <option value="road">Sort: Road name</option>
              <option value="speedLimit">Sort: Speed limit</option>
            </Select>
          </div>
        </div>

        <Table>
          <Thead>
            <tr>
              <Th>Road</Th>
              <Th>Segment</Th>
              <Th>Current limit</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={5} />)}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState icon={Gauge} title="No segments match" description="Try adjusting your search or filter." />
                </td>
              </tr>
            )}
            {filtered.map((seg) => (
              <Tr key={seg.id}>
                <Td className="font-medium">{seg.roadName}</Td>
                <Td className="text-ink-500">{seg.label}</Td>
                <Td className="tabular">{seg.speedLimit} km/h</Td>
                <Td>
                  <Badge tone={statusTone[seg.status]} dot className="capitalize">
                    {seg.status}
                  </Badge>
                </Td>
                <Td>
                  <div className="flex justify-end">
                    <Button variant="secondary" size="sm" onClick={() => setActiveSegment(seg)}>
                      Change limit
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <ScheduledChangesSection />

      <ChangeSpeedLimitDialog segment={activeSegment} onClose={() => setActiveSegment(null)} />
    </div>
  )
}
