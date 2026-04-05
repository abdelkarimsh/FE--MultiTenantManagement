import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';
import type { GetOrdersQuery } from '../../types/order';

export const useOrdersListQuery = (tenantId: string | null, params: GetOrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.tenantAdminOrders.list(tenantId, params as Record<string, unknown>),
    queryFn: () => ordersApi.getOrders(tenantId as string, params),
    enabled: !!tenantId,
    placeholderData: (prev) => prev,
  });
};

