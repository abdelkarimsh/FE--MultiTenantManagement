import type { TenantQueryParams } from '../types/tenant';

export const queryKeys = {
  storeTenant: {
    current: ['store-tenant', 'current'] as const,
  },
  tenants: {
    all: ['tenants'] as const,
    list: (params: TenantQueryParams) => ['tenants', params] as const,
    byId: (tenantId: string | null) => ['tenants', 'by-id', tenantId] as const,
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
  storeOrders: {
    all: ['store-orders'] as const,
    detail: (tenantId: string | null, orderId: string | null) =>
      ['store-orders', 'detail', tenantId, orderId] as const,
  },
  tenantAdminOrders: {
    all: ['tenant-admin-orders'] as const,
    list: (tenantId: string | null, params: Record<string, unknown>) =>
      ['tenant-admin-orders', 'list', tenantId, params] as const,
    detail: (tenantId: string | null, orderId: string | null) =>
      ['tenant-admin-orders', 'detail', tenantId, orderId] as const,
  },
} as const;
