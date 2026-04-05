import httpClient from './httpClient';
import type { PagedResult } from '../types/tenant';
import type { CreateProductRequest, ProductDto, UpdateProductRequest } from '../types/product';

export const productsApi = {
  getProducts: async (
    tenantId: string,
    pageNumber = 1,
    pageSize = 10,
    sortBy?: string,
    isAscending = true,
    search?: string,
  ): Promise<PagedResult<ProductDto>> => {
    const response = await httpClient.get<PagedResult<ProductDto>>(`/tenants/${tenantId}/products`, {
      params: {
        pageNumber,
        pageSize,
        sortBy,
        isAscending,
        search,
      },
    });

    return response.data;
  },

  getProductById: async (tenantId: string, productId: string): Promise<ProductDto> => {
    const response = await httpClient.get<ProductDto>(`/tenants/${tenantId}/products/${productId}`);
    return response.data;
  },

  createProduct: async (tenantId: string, payload: CreateProductRequest): Promise<ProductDto> => {
    const response = await httpClient.post<ProductDto>(`/tenants/${tenantId}/products`, payload);
    return response.data;
  },

  updateProduct: async (
    tenantId: string,
    productId: string,
    payload: UpdateProductRequest,
  ): Promise<void> => {
    await httpClient.put(`/tenants/${tenantId}/products/${productId}`, payload);
  },

  deleteProduct: async (tenantId: string, productId: string): Promise<void> => {
    await httpClient.delete(`/tenants/${tenantId}/products/${productId}`);
  },
};

