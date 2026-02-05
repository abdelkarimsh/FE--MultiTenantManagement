import httpClient from './httpClient';
import type { TenantDto, PagedResult, TenantQueryParams } from '../types/tenant';

export const tenantApi = {
  getPaged: (params: TenantQueryParams) =>
    httpClient.get<PagedResult<TenantDto>>('/Tenants/GetTenants', {
      params,
    }),

  create: (data: Partial<TenantDto>) =>
    httpClient.post('/Tenants/CreateTenant', data),

  update: (data: Partial<TenantDto>) =>
    httpClient.put('/Tenants/UpdateTenant', data),

  delete: (id: string) =>
    httpClient.delete(`/Tenants/Tenant/${id}`),
};
