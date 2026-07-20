import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-left text-sm', className)} {...props} />
    </div>
  )
}

export function Thead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-border', className)} {...props} />
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn('px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-500', className)}
      {...props}
    />
  )
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b border-border-subtle last:border-0 hover:bg-ink-300/5', className)} {...props} />
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-5 py-3 text-ink-900', className)} {...props} />
}

export function SkeletonRow({ cols }: { cols: number }) {
  return (
    <Tr className="hover:bg-transparent">
      {Array.from({ length: cols }).map((_, i) => (
        <Td key={i}>
          <div className="h-3.5 w-full max-w-[140px] animate-pulse rounded bg-ink-300/20" />
        </Td>
      ))}
    </Tr>
  )
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
      {Icon && (
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-ink-300/10">
          <Icon className="h-5 w-5 text-ink-400" />
        </div>
      )}
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {description && <p className="max-w-xs text-[13px] text-ink-500">{description}</p>}
      {action}
    </div>
  )
}
