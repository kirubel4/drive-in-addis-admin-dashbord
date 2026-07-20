import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute() {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/access-denied" replace />
  }

  return <Outlet />
}
