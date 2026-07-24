import { useMemo, useState } from "react";
import {
  Search,
  Users as UsersIcon,
  Trash2,
  ShieldCheck,
  ShieldX,
  Check,
  X,
  Ban,
  UserCheck,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import {
  Table,
  Thead,
  Th,
  Tr,
  Td,
  SkeletonRow,
  EmptyState,
} from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Input, Select, Label } from "../../components/ui/Input";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Dialog } from "../../components/ui/Dialog";
import {
  useDeleteUser,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from "./hooks";
import type { AdminUser, Role } from "../../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [query, setQuery] = useState("");
  const [toDelete, setToDelete] = useState<AdminUser | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailForm, setDetailForm] = useState<Partial<AdminUser>>({});

  const filtered = useMemo(() => {
    if (!query.trim()) return users ?? [];
    const q = query.toLowerCase();
    return (users ?? []).filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  const handleRowClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDetailForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  };

  const handleSaveDetail = async () => {
    if (!selectedUser) return;
    await updateUser.mutateAsync({
      id: selectedUser.id,
      patch: detailForm as Partial<
        Pick<AdminUser, "name" | "email" | "role" | "isActive">
      >,
    });
    setSelectedUser(null);
    setDetailForm({});
  };

  const handleCloseDetail = () => {
    setSelectedUser(null);
    setDetailForm({});
  };

  const handleBan = (user: AdminUser) => {
    updateStatus.mutate({ id: user.id, isActive: false });
  };

  const handleUnban = (user: AdminUser) => {
    updateStatus.mutate({ id: user.id, isActive: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            Users
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Manage user accounts, roles, and access.
          </p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or role..."
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-900">
              {users?.length ?? 0}
            </p>
            <p className="text-sm text-ink-500">Total Users</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-900">
              {users?.filter((u) => u.isActive).length ?? 0}
            </p>
            <p className="text-sm text-ink-500">Active Users</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-danger/10 flex items-center justify-center">
            <ShieldX className="h-5 w-5 text-danger" />
          </div>
          <div>
            <p className="text-2xl font-bold text-ink-900">
              {users?.filter((u) => !u.isActive).length ?? 0}
            </p>
            <p className="text-sm text-ink-500">Banned / Inactive</p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <Table>
          <Thead>
            <tr>
              <Th className="w-12">#</Th>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Verified</Th>
              <Th>Created</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} cols={7} />
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={UsersIcon}
                    title="No users found"
                    description="Try a different search term."
                  />
                </td>
              </tr>
            )}
            {filtered.map((user, index) => (
              <Tr
                key={user.id}
                className={
                  !user.isActive
                    ? "opacity-60 hover:bg-surface-50 cursor-pointer"
                    : "hover:bg-surface-50 cursor-pointer"
                }
                onClick={() => handleRowClick(user)}
              >
                <Td className="text-ink-400 text-sm">{index + 1}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{user.name}</p>
                      <p className="text-xs text-ink-500">{user.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateRole.mutate({
                        id: user.id,
                        role: e.target.value as Role,
                      });
                    }}
                    disabled={updateRole.isPending}
                    className="h-8 w-28 rounded-md border border-ink-200 bg-surface px-2 text-[13px] text-ink-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 cursor-pointer"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                  </select>
                </Td>
                <Td>
                  {user.isActive ? (
                    <Badge tone="success" dot>
                      Active
                    </Badge>
                  ) : (
                    <Badge tone="danger" dot>
                      Banned
                    </Badge>
                  )}
                </Td>
                <Td>
                  <Badge tone={user.isVerified ? "success" : "neutral"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </Td>
                <Td className="text-ink-500 text-sm">
                  {formatDate(user.createdAt)}
                </Td>
                <Td>
                  <div className="flex items-center justify-end gap-1">
                    {user.isActive ? (
                      <button
                        className="rounded-md p-1.5 text-ink-400 hover:bg-warning/10 hover:text-warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBan(user);
                        }}
                        disabled={updateStatus.isPending}
                        title="Ban user"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        className="rounded-md p-1.5 text-ink-400 hover:bg-success/10 hover:text-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnban(user);
                        }}
                        disabled={updateStatus.isPending}
                        title="Unban user"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="rounded-md p-1.5 text-ink-400 hover:bg-danger/10 hover:text-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToDelete(user);
                      }}
                      title="Delete user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete user"
        description={`Are you sure you want to delete "${toDelete?.name}" (${toDelete?.email})? This action cannot be undone.`}
        onCancel={() => setToDelete(null)}
        loading={deleteUser.isPending}
        onConfirm={async () => {
          if (!toDelete) return;
          await deleteUser.mutateAsync(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
