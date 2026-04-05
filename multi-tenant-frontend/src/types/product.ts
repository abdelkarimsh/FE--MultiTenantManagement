import type { PagedResult } from './tenant';

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

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  isActive: boolean;
}

export type ProductsPagedResult = PagedResult<ProductDto>;

