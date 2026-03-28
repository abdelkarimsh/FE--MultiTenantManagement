import httpClient from './httpClient';
import type {
  CreateTenantRequest,
  PagedResult,
  TenantDto,
  TenantQueryParams,
  UpdateTenantRequest,
} from '../types/tenant';

export const tenantApi = {
  getPaged: (params: TenantQueryParams) =>
    httpClient.get<PagedResult<TenantDto>>('/Tenants/GetTenants', {
      params,
    }),

  create: (data: CreateTenantRequest) =>
    httpClient.post('/Tenants/CreateTenant', data),

  update: (data: UpdateTenantRequest) =>
    httpClient.put('/Tenants/UpdateTenant', data),

  delete: (id: string) =>
    httpClient.delete(`/Tenants/Tenant/${id}`),
};
