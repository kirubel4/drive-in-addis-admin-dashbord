import { useState, type FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input, Label } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { User, Mail, Lock, Gauge, ShieldCheck, Bell, Moon, Sun, Globe, Save, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

export function SettingsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')

  const [defaultLimit, setDefaultLimit] = useState('30')
  const [rateLimit] = useState('600 requests / minute')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    toast.success('Password updated successfully')
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: ShieldCheck },
    { id: 'preferences' as const, label: 'Preferences', icon: Bell },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <Card className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <p className="text-sm text-ink-500">Your personal account details.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name" className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-ink-400" />
                        Full Name
                      </Label>
                      <Input id="profile-name" value={user?.name ?? ''} disabled className="bg-ink-50" />
                      <p className="text-xs text-ink-400">Name cannot be changed from this panel.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email" className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-ink-400" />
                        Email Address
                      </Label>
                      <Input id="profile-email" value={user?.email ?? ''} disabled className="bg-ink-50" />
                      <p className="text-xs text-ink-400">Contact admin to change your email.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-role" className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-ink-400" />
                        Role
                      </Label>
                      <Input id="profile-role" value={user?.role ?? 'User'} disabled className="bg-ink-50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-id" className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-ink-400" />
                        User ID
                      </Label>
                      <Input id="profile-id" value={user?.userId ?? ''} disabled className="bg-ink-50 font-mono text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <CardTitle>Change Password</CardTitle>
                      <p className="text-sm text-ink-500">Update your password to keep your account secure.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        minLength={8}
                        required
                      />
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              newPassword.length >= i * 2 ? 'bg-success' : 'bg-ink-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-ink-400">Use at least 8 characters with numbers and symbols.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your new password"
                        required
                      />
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-danger flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Passwords do not match
                        </p>
                      )}
                      {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
                        <p className="text-xs text-success flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Passwords match
                        </p>
                      )}
                    </div>
                    <Button type="submit" loading={saving} className="gap-2">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-danger/10 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-danger" />
                    </div>
                    <div>
                      <CardTitle>Danger Zone</CardTitle>
                      <p className="text-sm text-ink-500">Irreversible account actions.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-danger/20 bg-danger/5">
                    <div>
                      <p className="font-medium text-ink-900">Delete Account</p>
                      <p className="text-sm text-ink-500">Permanently remove your account and all associated data.</p>
                    </div>
                    <Button variant="danger" size="sm">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <>
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Application Settings</CardTitle>
                      <p className="text-sm text-ink-500">Configure app behavior and limits.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-limit" className="flex items-center gap-2">
                        <Gauge className="h-3.5 w-3.5 text-ink-400" />
                        Default Speed Limit
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="default-limit"
                          type="number"
                          value={defaultLimit}
                          onChange={(e) => setDefaultLimit(e.target.value)}
                          className="max-w-[120px]"
                        />
                        <span className="text-sm text-ink-500 font-medium">km/h</span>
                      </div>
                      <p className="text-xs text-ink-400">Applied to unmapped roads.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 text-ink-400" />
                        API Rate Limit
                      </Label>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-50 border border-ink-200">
                        <span className="text-sm font-medium text-ink-700">{rateLimit}</span>
                      </div>
                      <p className="text-xs text-ink-400">Current plan limit. Contact admin to upgrade.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <p className="text-sm text-ink-500">Control how you receive updates.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-ink-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-ink-400" />
                      <div>
                        <p className="font-medium text-ink-900">Push Notifications</p>
                        <p className="text-sm text-ink-500">Receive alerts about system events.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        notifications ? 'bg-primary' : 'bg-ink-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          notifications ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-ink-800/10 flex items-center justify-center">
                      {darkMode ? <Moon className="h-5 w-5 text-ink-700" /> : <Sun className="h-5 w-5 text-ink-700" />}
                    </div>
                    <div>
                      <CardTitle>Appearance</CardTitle>
                      <p className="text-sm text-ink-500">Customize your interface theme.</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-ink-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-4 w-4 text-ink-400" /> : <Sun className="h-4 w-4 text-ink-400" />}
                      <div>
                        <p className="font-medium text-ink-900">Dark Mode</p>
                        <p className="text-sm text-ink-500">Switch between light and dark themes.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        darkMode ? 'bg-primary' : 'bg-ink-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          darkMode ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}