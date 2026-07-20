import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Gauge, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Input, Label } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const { login, status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('selam.tesfaye@speedway.et')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const user = await login(email, password)
      const from = (location.state as { from?: Location })?.from?.pathname
      navigate(user.role === 'ADMIN' ? from || '/' : '/access-denied', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar">
            <Gauge className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-lg font-semibold text-ink-900">Speedway Admin</h1>
          <p className="mt-1 text-[13px] text-ink-500">Sign in to manage roads, zones, and speed limits.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-6 shadow-card">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-md bg-danger-soft px-3 py-2.5 text-[13px] text-danger">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
          <p className="mt-4 text-center text-[12px] text-ink-400">
            Demo mode &mdash; any password works. Use an email containing "user" to preview the access-denied screen.
          </p>
        </form>
      </div>
    </div>
  )
}
