import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { usersApi } from '../../api/usersApi';

export const useTenantUsersQuery = (tenantId: string | null) => {
  return useQuery({
    queryKey: queryKeys.tenantUsers.list(tenantId),
    queryFn: () => usersApi.getUsers(tenantId || undefined),
    enabled: !!tenantId,
  });
};

export const useSuperAdminUsersQuery = () => {
  return useQuery({
    queryKey: queryKeys.superAdminUsers.all,
    queryFn: () => usersApi.getUsers(),
  });
};

