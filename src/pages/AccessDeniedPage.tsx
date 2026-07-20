import { ShieldOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function AccessDeniedPage() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft">
        <ShieldOff className="h-6 w-6 text-danger" />
      </div>
      <h1 className="text-lg font-semibold text-ink-900">Access denied</h1>
      <p className="mt-1.5 max-w-sm text-[13px] text-ink-500">
        {user?.email ?? 'This account'} doesn&apos;t have administrator access. Ask an existing admin to upgrade
        your role, or sign in with an admin account.
      </p>
      <Button variant="secondary" size="sm" className="mt-5" onClick={handleLogout}>
        Sign in with a different account
      </Button>
    </div>
  )
}
