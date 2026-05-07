import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isStaleConcurrencyError } from '../../api/apiErrors';
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
    onError: async (error) => {
      if (isStaleConcurrencyError(error)) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.storeProducts.all });
      }
    },
  });
};

export const useDeleteProductMutation = (tenantId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; version: number }) =>
      productsApi.deleteProduct(tenantId as string, payload.id, payload.version),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.storeProducts.all });
    },
    onError: async (error) => {
      if (isStaleConcurrencyError(error)) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.tenantProducts.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.storeProducts.all });
      }
    },
  });
};

