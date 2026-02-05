// src/api/productsApi.ts
import httpClient from './httpClient';

export interface ProductDto {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
  createdAtUtc: string;
}

// نفس شكل الـ result اللي وريتنا إياه
export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// مطابق لـ CreateProductDto في الـ backend (بدون tenantId وبدون id)
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

// مطابق لـ UpdateProductDto (برضه بدون tenantId/id)
export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

export const productsApi = {
  // GET: /api/tenants/{tenantId}/products?pageNumber=&pageSize=&sortBy=&isAscending=&search=
  // baseURL = 'https://localhost:7114/api' => نكتب بس '/tenants/...'
  getProducts: async (
    tenantId: string,
    pageNumber = 1,
    pageSize = 10,
    sortBy?: string,
    isAscending = true,
    search?: string
  ): Promise<PagedResult<ProductDto>> => {
    const res = await httpClient.get<PagedResult<ProductDto>>(
      `/tenants/${tenantId}/products`,
      {
        params: {
          pageNumber,
          pageSize,
          sortBy,
          isAscending,
          search,
        },
      }
    );
    return res.data;
  },

  // GET: /api/tenants/{tenantId}/products/{id}
  getProductById: async (tenantId: string, id: string): Promise<ProductDto> => {
    const res = await httpClient.get<ProductDto>(
      `/tenants/${tenantId}/products/${id}`
    );
    return res.data;
  },

  // POST: /api/tenants/{tenantId}/products  + CreateProductDto
  createProduct: async (
    tenantId: string,
    payload: CreateProductRequest
  ): Promise<ProductDto> => {
    const res = await httpClient.post<ProductDto>(
      `/tenants/${tenantId}/products`,
      payload // ⚠️ بدون tenantId/id
    );
    return res.data;
  },

  // PUT: /api/tenants/{tenantId}/products/{id}  + UpdateProductDto
  updateProduct: async (
    tenantId: string,
    id: string,
    payload: UpdateProductRequest
  ): Promise<void> => {
    await httpClient.put(`/tenants/${tenantId}/products/${id}`, payload);
  },

  // DELETE: /api/tenants/{tenantId}/products/{id}
  deleteProduct: async (tenantId: string, id: string): Promise<void> => {
    await httpClient.delete(`/tenants/${tenantId}/products/${id}`);
  },
};
