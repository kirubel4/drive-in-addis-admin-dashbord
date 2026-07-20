import type { ComponentType } from 'react'
import { cn } from '../../lib/cn'

interface StatCardProps {
  label: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  loading?: boolean
  accent?: boolean
  trend?: string
}

export function StatCard({ label, value, icon: Icon, loading, accent, trend }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-4 shadow-card">
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-[3px]',
          accent ? 'bg-gradient-to-r from-accent to-accent/30' : 'bg-transparent'
        )}
      />
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
        <Icon className="h-4 w-4 text-ink-400" />
      </div>
      {loading ? (
        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-ink-300/20" />
      ) : (
        <p className="tabular mt-1 text-2xl font-semibold text-ink-900">{value}</p>
      )}
      {trend && !loading && <p className="mt-1 text-[12px] text-ink-500">{trend}</p>}
    </div>
  )
}
