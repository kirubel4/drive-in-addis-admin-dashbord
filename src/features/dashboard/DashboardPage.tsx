import { Route as RouteIcon, Activity as ActivityIcon, Users, UserCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { StatCard } from './StatCard'
import { RequestVolumeChart } from './RequestVolumeChart'
import { ActivityFeed } from './ActivityFeed'
import { useActivity, useHealth, useRequestVolume, useRequestsToday, useRoadsCount, useStats } from './hooks'

export function DashboardPage() {
  const stats = useStats()
  const roadsCount = useRoadsCount()
  const requestsToday = useRequestsToday()
  const volume = useRequestVolume()
  const health = useHealth()
  const activity = useActivity()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Roads" value={roadsCount.data ?? 0} icon={RouteIcon} loading={roadsCount.isLoading} accent />
        <StatCard
          label="Daily Requests"
          value={(requestsToday.data ?? 0).toLocaleString()}
          icon={ActivityIcon}
          loading={requestsToday.isLoading}
        />
        <div className="rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium text-ink-500">API Status</p>
          </div>
          {health.isLoading ? (
            <div className="mt-2 h-7 w-16 animate-pulse rounded bg-ink-300/20" />
          ) : (
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${health.data ? 'bg-success animate-pulseDot' : 'bg-danger'}`}
              />
              <span className="text-lg font-semibold text-ink-900">{health.data ? 'Operational' : 'Down'}</span>
            </div>
          )}
        </div>
        <StatCard label="Total Users" value={stats.data?.totalUsers ?? 0} icon={Users} loading={stats.isLoading} />
        <StatCard
          label="Active Users"
          value={stats.data?.activeUsers ?? 0}
          icon={UserCheck}
          loading={stats.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request volume, last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestVolumeChart data={volume.data} loading={volume.isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <ActivityFeed items={activity.data} loading={activity.isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
