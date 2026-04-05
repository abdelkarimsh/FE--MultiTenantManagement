import { useMutation } from '@tanstack/react-query';
import { ordersApi } from '../../api/ordersApi';
import type { CreateOrderRequest } from '../../types/order';

export const useCreateOrderMutation = (tenantId: string | null) => {
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) =>
      ordersApi.createOrder(tenantId as string, payload),
  });
};

