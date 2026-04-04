import httpClient from './httpClient';
import type {
  CreateTenantRequest,
  PagedResult,
  TenantDto,
  TenantSettingsUpdateRequest,
  TenantQueryParams,
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

  getById: (tenantId: string) =>
    httpClient.get<TenantDto>(TENANT_ENDPOINTS.getById(tenantId)),

  getTenantById: async (tenantId: string): Promise<TenantDto> => {
    const response = await httpClient.get<TenantDto>(TENANT_ENDPOINTS.getById(tenantId));
    return response.data;
  },

  update: (tenantId: string, data: UpdateTenantRequest) => {
    if (tenantId !== data.id) {
      throw new Error('Tenant route id must match update payload id.');
    }

    return httpClient.put(TENANT_ENDPOINTS.update(tenantId), data);
  },

  updateTenant: async (tenantId: string, data: TenantSettingsUpdateRequest): Promise<void> => {
    if (tenantId !== data.id) {
      throw new Error('Tenant route id must match update payload id.');
    }

    await httpClient.put(TENANT_ENDPOINTS.update(tenantId), data);
  },

  delete: (tenantId: string) =>
    httpClient.delete(TENANT_ENDPOINTS.delete(tenantId)),
};
