import { useState, type FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'

export function SettingsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const [defaultLimit, setDefaultLimit] = useState('30')
  const [rateLimit] = useState('600 requests / minute')

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    setCurrentPassword('')
    setNewPassword('')
    toast.success('Password updated')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" value={user?.name ?? ''} disabled />
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" value={user?.email ?? ''} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
            <Button type="submit" size="sm" loading={saving}>
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xs">
            <Label htmlFor="default-limit">Default speed limit for unmapped roads</Label>
            <div className="flex items-center gap-2">
              <Input
                id="default-limit"
                type="number"
                value={defaultLimit}
                onChange={(e) => setDefaultLimit(e.target.value)}
              />
              <span className="text-[13px] text-ink-500">km/h</span>
            </div>
          </div>
          <div>
            <Label>API rate limit</Label>
            <p className="text-[13px] text-ink-500">{rateLimit}</p>
          </div>
          <p className="text-[12px] text-ink-400">
            These settings are placeholders until the corresponding backend endpoints are available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
