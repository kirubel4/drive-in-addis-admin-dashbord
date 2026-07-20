import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <Compass className="mb-4 h-8 w-8 text-ink-400" />
      <h1 className="text-lg font-semibold text-ink-900">Page not found</h1>
      <p className="mt-1.5 text-[13px] text-ink-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="mt-5 text-[13px] font-medium text-accent hover:text-accent-hover">
        Back to dashboard
      </Link>
    </div>
  )
}
