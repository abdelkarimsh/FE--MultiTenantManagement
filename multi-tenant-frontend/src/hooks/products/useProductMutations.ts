import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../../api/productsApi';
import { queryKeys } from '../../api/queryKeys';
import type { CreateProductRequest, UpdateProductRequest } from '../../types/product';

export const useCreateProductMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductRequest) =>
      productsApi.createProduct(tenantId as string, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
    },
  });
};

export const useUpdateProductMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(tenantId as string, payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
    },
  });
};

export const useDeleteProductMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productsApi.deleteProduct(tenantId as string, productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
    },
  });
};

