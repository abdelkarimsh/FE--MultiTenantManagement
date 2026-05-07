import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isStaleConcurrencyError } from '../../api/apiErrors';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';

export const useCancelOrderMutation = (tenantId: string | null, orderId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { reason: string; version: number }) =>
      ordersApi.cancelOrder(tenantId as string, orderId as string, payload.version, {
        reason: payload.reason,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeOrders.detail(tenantId, orderId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeOrders.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenantAdminOrders.all,
      });
    },
    onError: async (error) => {
      if (isStaleConcurrencyError(error)) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.storeOrders.detail(tenantId, orderId),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.storeOrders.all,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.tenantAdminOrders.all,
        });
      }
    },
  });
};

