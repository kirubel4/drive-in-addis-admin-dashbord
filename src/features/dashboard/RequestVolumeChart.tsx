import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { RequestVolumePoint } from '../../types'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

export function RequestVolumeChart({ data, loading }: { data?: RequestVolumePoint[]; loading?: boolean }) {
  if (loading || !data) {
    return <div className="h-64 w-full animate-pulse rounded-md bg-ink-300/10" />
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="requestFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B5BD6" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#5B5BD6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#EFEFF1" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#A1A1AA' }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#A1A1AA' }} width={42} />
          <Tooltip
            formatter={(value) => [Number(value).toLocaleString(), 'Requests']}
            labelFormatter={(label) => new Date(String(label)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E4E4E7', boxShadow: '0 4px 16px -4px rgb(0 0 0 / 0.12)' }}
          />
          <Area type="monotone" dataKey="requests" stroke="#5B5BD6" strokeWidth={2} fill="url(#requestFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
