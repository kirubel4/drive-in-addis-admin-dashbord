import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Route as RouteIcon, Gauge, ShieldAlert, Users, Settings, PanelLeftClose, PanelLeftOpen,Flag,
} from 'lucide-react'
import { cn } from '../lib/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/roads', label: 'Roads', icon: RouteIcon },
  { to: '/speed-limits', label: 'Speed Limits', icon: Gauge },
  { to: '/zones', label: 'Zones', icon: ShieldAlert },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/reports', label: 'Reports', icon: Flag},
  { to: '/settings', label: 'Settings', icon: Settings },
  
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-ink-900/40 md:hidden" onClick={onMobileClose} aria-hidden="true" />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar transition-all duration-200 md:static',
          collapsed ? 'w-[68px]' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className={cn('flex h-14 items-center border-b border-sidebar-border px-4', collapsed && 'justify-center px-0')}>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent">
              <Gauge className="h-4 w-4 text-white" />
            </div>
            {!collapsed && <span className="text-sm font-semibold tracking-tight text-white">Speedway</span>}
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-accent/15 text-white'
                    : 'text-ink-400 hover:bg-sidebar-hover hover:text-white'
                )
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-accent' : '')} />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={onToggle}
          className="hidden md:flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-[13px] font-medium text-ink-400 hover:bg-sidebar-hover hover:text-white"
        >
          {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  )
}
