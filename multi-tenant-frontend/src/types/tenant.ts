export interface TenantStoreSetting {
  tenantId: string;
  currency: string;
  theme: string;
  supportPhone: string;
}

export interface TenantStoreSettingRequest {
  currency: string;
  theme: string;
  supportPhone: string;
}

export interface TenantDto {
  id: string;
  name: string;
  status: 'Active' | 'Disabled' | string; // خليها string لو فيه حالات أكثر
  logoURL: string;
  subDomain: string;
  createdAtUtc: string;
  storeSetting: TenantStoreSetting | null;
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TenantQueryParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isAscending?: boolean;
  search?: string;
  isActive?: boolean | null;
}

export interface CreateTenantRequest {
  name: string;
  subDomain: string;
  status: number;
  logoURL?: string;
  storeSetting: TenantStoreSettingRequest;
}

export interface UpdateTenantRequest extends CreateTenantRequest {
  id: string;
}
