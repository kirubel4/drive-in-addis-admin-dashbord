import { useMemo, useState } from 'react'
import { Search, Users as UsersIcon, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Table, Thead, Th, Tr, Td, SkeletonRow, EmptyState } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Input, Select } from '../../components/ui/Input'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useDeleteUser, useUpdateUserRole, useUpdateUserStatus, useUsers } from './hooks'
import type { AdminUser, Role } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const updateRole = useUpdateUserRole()
  const updateStatus = useUpdateUserStatus()
  const deleteUser = useDeleteUser()
  const [query, setQuery] = useState('')
  const [toDelete, setToDelete] = useState<AdminUser | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return users ?? []
    const q = query.toLowerCase()
    return (users ?? []).filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-xs">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or email" className="pl-8" />
      </div>

      <Card>
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Verified</Th>
              <Th>Active</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {isLoading && Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState icon={UsersIcon} title="No users found" description="Try a different search term." />
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <Tr key={user.id}>
                <Td className="font-medium">{user.name}</Td>
                <Td className="text-ink-500">{user.email}</Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value as Role })}
                    className="h-8 w-28 text-[13px]"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                  </Select>
                </Td>
                <Td>
                  <Badge tone={user.isVerified ? 'success' : 'neutral'}>{user.isVerified ? 'Verified' : 'Unverified'}</Badge>
                </Td>
                <Td>
                  <button onClick={() => updateStatus.mutate({ id: user.id, isActive: !user.isActive })}>
                    <Badge tone={user.isActive ? 'success' : 'danger'} dot>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </Td>
                <Td className="text-ink-500">{formatDate(user.createdAt)}</Td>
                <Td>
                  <div className="flex justify-end">
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-danger-soft hover:text-danger"
                      onClick={() => setToDelete(user)}
                      aria-label={`Delete ${user.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete user"
        description={`Delete "${toDelete?.name}" (${toDelete?.email})? This can't be undone.`}
        onCancel={() => setToDelete(null)}
        loading={deleteUser.isPending}
        onConfirm={async () => {
          if (!toDelete) return
          await deleteUser.mutateAsync(toDelete.id)
          setToDelete(null)
        }}
      />
    </div>
  )
}
