import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';

export const useTenantAdminOrderDetailsQuery = (tenantId: string | null, orderId: string | null) => {
  return useQuery({
    queryKey: queryKeys.tenantAdminOrders.detail(tenantId, orderId),
    queryFn: () => ordersApi.getOrderById(tenantId as string, orderId as string),
    enabled: !!tenantId && !!orderId,
  });
};

export const useStoreOrderDetailsQuery = (tenantId: string | null, orderId: string | null) => {
  return useQuery({
    queryKey: queryKeys.storeOrders.detail(tenantId, orderId),
    queryFn: () => ordersApi.getOrderById(tenantId as string, orderId as string),
    enabled: !!tenantId && !!orderId,
  });
};

