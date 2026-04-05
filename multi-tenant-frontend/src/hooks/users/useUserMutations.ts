import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { usersApi } from '../../api/usersApi';
import type { CreateUserRequest, UpdateUserRequest } from '../../types/users';

export const useCreateUserMutation = (scope: 'tenantAdmin' | 'superAdmin') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => usersApi.createUser(payload),
    onSuccess: async () => {
      const queryKey = scope === 'tenantAdmin' ? queryKeys.tenantUsers.all : queryKeys.superAdminUsers.all;
      await queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useUpdateUserMutation = (scope: 'tenantAdmin' | 'superAdmin') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(payload.id, payload.data),
    onSuccess: async () => {
      const queryKey = scope === 'tenantAdmin' ? queryKeys.tenantUsers.all : queryKeys.superAdminUsers.all;
      await queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteUserMutation = (scope: 'tenantAdmin' | 'superAdmin') => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.deleteUser(userId),
    onSuccess: async () => {
      const queryKey = scope === 'tenantAdmin' ? queryKeys.tenantUsers.all : queryKeys.superAdminUsers.all;
      await queryClient.invalidateQueries({ queryKey });
    },
  });
};

