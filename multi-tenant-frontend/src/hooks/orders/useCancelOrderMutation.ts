import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';

export const useCancelOrderMutation = (tenantId: string | null, orderId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason: string) =>
      ordersApi.cancelOrder(tenantId as string, orderId as string, { reason }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeOrders.detail(tenantId, orderId),
      });
    },
  });
};

