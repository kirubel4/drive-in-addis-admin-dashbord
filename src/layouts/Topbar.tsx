import { useState } from 'react'
import { LogOut, Menu, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useNavigate } from 'react-router-dom'

function initials(name?: string, email?: string) {
  if (name) return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return email?.slice(0, 2).toUpperCase() ?? '??'
}

export function Topbar({ onMobileMenu, title }: { onMobileMenu: () => void; title: string }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    toast.success('Signed out')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-surface/85 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMobileMenu} className="text-ink-500 hover:text-ink-900 md:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-ink-900">{title}</h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 hover:bg-ink-300/10"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent-text">
            {initials(user?.name, user?.email)}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-[13px] font-medium leading-tight text-ink-900">{user?.name ?? user?.email}</p>
            <p className="text-[11px] leading-tight text-ink-500">{user?.email}</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1.5 w-48 rounded-md border border-border bg-surface py-1 shadow-popover animate-fadeIn">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-ink-300/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
