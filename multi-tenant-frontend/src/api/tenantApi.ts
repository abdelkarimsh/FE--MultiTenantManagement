import httpClient from './httpClient';
import type {
  CreateTenantRequest,
  PagedResult,
  TenantDto,
  TenantQueryParams,
  TenantSettingsUpdateRequest,
  UpdateTenantRequest,
} from '../types/tenant';

const TENANT_ENDPOINTS = {
  list: '/Tenants/GetTenants',
  create: '/Tenants/CreateTenant',
  getById: (tenantId: string) => `/Tenants/Tenant/${tenantId}`,
  update: (tenantId: string) => `/Tenants/UpdateTenant/${tenantId}`,
  delete: (tenantId: string) => `/Tenants/Tenant/${tenantId}`,
} as const;

export const tenantApi = {
  getPaged: (params: TenantQueryParams) =>
    httpClient.get<PagedResult<TenantDto>>(TENANT_ENDPOINTS.list, {
      params,
    }),

  create: (data: CreateTenantRequest) =>
    httpClient.post(TENANT_ENDPOINTS.create, data),

  getById: async (tenantId: string): Promise<TenantDto> => {
    const response = await httpClient.get<TenantDto>(TENANT_ENDPOINTS.getById(tenantId));
    return response.data;
  },

  update: async (tenantId: string, data: UpdateTenantRequest | TenantSettingsUpdateRequest): Promise<void> => {
    if (tenantId !== data.id) {
      throw new Error('Tenant route id must match update payload id.');
    }

    await httpClient.put(TENANT_ENDPOINTS.update(tenantId));
  },

  delete: (tenantId: string) =>
    httpClient.delete(TENANT_ENDPOINTS.delete(tenantId))
};
