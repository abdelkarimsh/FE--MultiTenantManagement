import type { TenantQueryParams } from '../types/tenant';

export const queryKeys = {
  tenants: {
    all: ['tenants'] as const,
    list: (params: TenantQueryParams) => ['tenants', params] as const,
  },
  superAdminUsers: {
    all: ['sa-users'] as const,
  },
  tenantUsers: {
    all: ['admin-users'] as const,
    list: (tenantId: string | null) => ['admin-users', tenantId] as const,
  },
  tenantProducts: {
    all: ['admin-products'] as const,
    list: (tenantId: string | null, pageNumber: number, pageSize: number) =>
      ['admin-products', tenantId, pageNumber, pageSize] as const,
  },
  storeProducts: {
    all: ['store-products'] as const,
    list: (tenantId: string | null, pageNumber: number, pageSize: number, search: string) =>
      ['store-products', tenantId, pageNumber, pageSize, search] as const,
  },
} as const;
