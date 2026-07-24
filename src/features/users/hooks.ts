import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUser,
  fetchUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../../api/admin";
import type { Role } from "../../types";
import { useToast } from "../../contexts/ToastContext";

export function useUsers() {
  return useQuery({ queryKey: ["admin", "users"], queryFn: fetchUsers });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<
        Pick<
          {
            id: string;
            name: string;
            email: string;
            role: Role;
            isVerified: boolean;
            isActive: boolean;
            createdAt: string;
          },
          "name" | "email" | "role" | "isActive"
        >
      >;
    }) => updateUser(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Could not update the user."),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Role updated");
    },
    onError: () => toast.error("Could not update the role."),
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateUserStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Could not update the status."),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Could not delete the user."),
  });
}
