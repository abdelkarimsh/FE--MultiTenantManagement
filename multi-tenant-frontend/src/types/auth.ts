import { ROUTES } from '../router/routes';

export interface LoginRequest {
    email: string;
    password: string;
}

export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  user: 'user',
} as const;

export const APP_ROLES = {
  systemAdmin: 'SystemAdmin',
  tenantAdmin: 'TenantAdmin',
  tenantUser: 'User',
  legacyTenantUser: 'TenantUser',
} as const;

export type CanonicalRole =
  | typeof APP_ROLES.systemAdmin
  | typeof APP_ROLES.tenantAdmin
  | typeof APP_ROLES.tenantUser;

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  email: string;
  userRole: string | null;
  tenantId: string | null;
  fullName: string | null;
}

export interface User {
  email: string;
  fullName: string | null;
  tenantId: string | null;
  role: string | null;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export const normalizeRole = (role: string | null | undefined): CanonicalRole | null => {
  if (role === APP_ROLES.systemAdmin) return APP_ROLES.systemAdmin;
  if (role === APP_ROLES.tenantAdmin) return APP_ROLES.tenantAdmin;
  if (role === APP_ROLES.tenantUser || role === APP_ROLES.legacyTenantUser) {
    return APP_ROLES.tenantUser;
  }

  return null;
};

export const getDefaultRouteForRole = (role: string | null | undefined): string => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === APP_ROLES.systemAdmin) return ROUTES.superAdmin.tenants;
  if (normalizedRole === APP_ROLES.tenantAdmin) return ROUTES.tenantAdmin.dashboard;
  if (normalizedRole === APP_ROLES.tenantUser) return ROUTES.store.products;

  return ROUTES.login;
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
};
