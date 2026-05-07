import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isStaleConcurrencyError } from '../../api/apiErrors';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';

export const useApproveOrderMutation = (tenantId: string | null, orderId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (version: number) => ordersApi.approveOrder(tenantId as string, orderId as string, version),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenantAdminOrders.detail(tenantId, orderId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenantAdminOrders.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.storeOrders.all,
      });
    },
    onError: async (error) => {
      if (isStaleConcurrencyError(error)) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.tenantAdminOrders.detail(tenantId, orderId),
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.tenantAdminOrders.all,
        });
        await queryClient.invalidateQueries({
          queryKey: queryKeys.storeOrders.all,
        });
      }
    },
  });
};

