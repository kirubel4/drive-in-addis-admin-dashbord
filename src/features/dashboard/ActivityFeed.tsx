import { Activity } from 'lucide-react'
import type { ActivityItem } from '../../types'
import { EmptyState } from '../../components/ui/Table'

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

export function ActivityFeed({ items, loading }: { items?: ActivityItem[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-ink-300/10" />
        ))}
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No activity yet"
        description="Admin actions like speed limit changes and new roads will show up here."
      />
    )
  }

  return (
    <ul className="divide-y divide-border-subtle">
      {items.slice(0, 10).map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-2.5">
          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-ink-900">
              <span className="font-medium">{item.actor}</span> {item.action.toLowerCase()}
            </p>
            <p className="truncate text-[12px] text-ink-500">{item.target}</p>
          </div>
          <span className="shrink-0 text-[12px] text-ink-400">{timeAgo(item.timestamp)}</span>
        </li>
      ))}
    </ul>
  )
}
