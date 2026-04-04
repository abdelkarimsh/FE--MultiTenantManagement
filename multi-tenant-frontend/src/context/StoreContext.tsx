import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { queryKeys } from '../api/queryKeys';
import { useAuth } from './AuthContext';
import type { StorefrontTenantView, TenantStorefrontDto } from '../types/tenant';

interface StoreContextValue {
  tenant: StorefrontTenantView | null;
  tenantResponse: TenantStorefrontDto | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const resolveLogoUrl = (tenant: TenantStorefrontDto): string | null =>
  tenant.logoURL || tenant.attachmentUrl || null;

const getStatusLabel = (status: string | null | undefined) => {
  if (!status) return 'Unknown';
  if (status === 'Active') return 'Active';
  if (status === 'Disabled') return 'Disabled';
  return status;
};

const isStoreActive = (status: string | null | undefined) => {
  if (!status) return true;
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus !== 'disabled' && normalizedStatus !== 'inactive' && normalizedStatus !== '0';
};

const mapTenantToView = (tenant: TenantStorefrontDto): StorefrontTenantView => ({
  id: tenant.id,
  displayName: tenant.name?.trim() || 'Storefront',
  logoUrl: resolveLogoUrl(tenant),
  currency: tenant.storeSetting?.currency ?? null,
  theme: tenant.storeSetting?.theme ?? null,
  supportPhone: tenant.storeSetting?.supportPhone ?? null,
  subDomain: tenant.subDomain?.trim() || null,
  status: tenant.status ?? null,
  statusLabel: getStatusLabel(tenant.status),
  isActive: isStoreActive(tenant.status),
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKeys.storeTenant.current,
    queryFn: authApi.getCurrentUserTenant,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const value: StoreContextValue = {
    tenant: data ? mapTenantToView(data) : null,
    tenantResponse: data ?? null,
    isLoading,
    isError,
    error: error instanceof Error ? error : null,
    refetch,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
};

export const useCurrentTenant = () => useStore();
