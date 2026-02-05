export interface LoginRequest {
    email: string;
    password: string;
}

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
