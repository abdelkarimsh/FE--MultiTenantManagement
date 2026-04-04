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
  status: 'Active' | 'Disabled' | string;
  logoURL?: string;
  attachmentId?: string | null;
  attachmentUrl?: string | null;
  subDomain: string;
  createdAtUtc?: string;
  storeSetting: TenantStoreSetting | null;
}

export interface TenantStorefrontDto {
  id: string;
  name: string;
  status: string;
  logoURL: string | null;
  attachmentId: string | null;
  attachmentUrl: string | null;
  subDomain: string;
  createdAtUtc: string;
  storeSetting: TenantStoreSetting | null;
}

export interface StorefrontTenantView {
  id: string;
  displayName: string;
  logoUrl: string | null;
  currency: string | null;
  theme: string | null;
  supportPhone: string | null;
  subDomain: string | null;
  status: string | null;
  statusLabel: string;
  isActive: boolean;
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

export interface TenantSettingsUpdateRequest {
  id: string;
  name: string;
  status: number;
  logoURL?: string;
  attachmentId?: string | null;
  attachmentUrl?: string | null;
  subDomain: string;
  createdAtUtc?: string;
  storeSetting: TenantStoreSetting;
}

export const tenantStatusToCode = (status: string | number | null | undefined): number => {
  if (typeof status === 'number' && Number.isFinite(status)) {
    return status;
  }

  const normalizedStatus = String(status ?? '').trim().toLowerCase();
  if (normalizedStatus === 'active') return 0;
  if (normalizedStatus === 'inactive' || normalizedStatus === 'disabled') return 1;
  if (normalizedStatus === 'suspended') return 2;

  const parsed = Number(normalizedStatus);
  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return 0;
};
