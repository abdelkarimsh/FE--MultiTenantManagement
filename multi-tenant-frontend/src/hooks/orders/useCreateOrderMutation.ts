import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isStaleConcurrencyError } from '../../api/apiErrors';
import { ordersApi } from '../../api/ordersApi';
import { queryKeys } from '../../api/queryKeys';
import type { CreateOrderRequest } from '../../types/order';

export const useCreateOrderMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) =>
      ordersApi.createOrder(tenantId as string, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.storeOrders.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantAdminOrders.all });
    },
    onError: async (error) => {
      if (isStaleConcurrencyError(error)) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.storeProducts.all });
      }
    },
  });
};

