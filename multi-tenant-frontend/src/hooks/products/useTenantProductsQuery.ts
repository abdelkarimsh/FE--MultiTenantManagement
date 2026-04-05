import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/productsApi';
import { queryKeys } from '../../api/queryKeys';

export const useTenantProductsQuery = (
  tenantId: string | null,
  pageNumber: number,
  pageSize: number,
) => {
  return useQuery({
    queryKey: queryKeys.tenantProducts.list(tenantId, pageNumber, pageSize),
    queryFn: () => productsApi.getProducts(tenantId as string, pageNumber, pageSize),
    enabled: !!tenantId,
    placeholderData: (prev) => prev,
  });
};

