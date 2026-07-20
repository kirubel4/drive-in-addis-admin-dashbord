import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/roads': 'Roads',
  '/speed-limits': 'Speed Limits',
  '/zones': 'Zones',
  '/users': 'Users',
  '/settings': 'Settings',
}

function resolveTitle(pathname: string) {
  if (titles[pathname]) return titles[pathname]
  const base = '/' + pathname.split('/')[1]
  return titles[base] ?? 'Speedway'
}

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMobileMenu={() => setMobileOpen(true)} title={resolveTitle(location.pathname)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
