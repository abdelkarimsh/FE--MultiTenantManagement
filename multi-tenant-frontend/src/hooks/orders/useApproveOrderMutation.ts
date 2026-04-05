import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';

export const useApproveOrderMutation = (tenantId: string | null, orderId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ordersApi.approveOrder(tenantId as string, orderId as string),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenantAdminOrders.detail(tenantId, orderId),
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tenantAdminOrders.all,
      });
    },
  });
};

