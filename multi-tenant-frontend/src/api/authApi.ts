import httpClient from './httpClient';
import type { LoginRequest, LoginResponse } from '../types/auth';
import type { TenantStorefrontDto } from '../types/tenant';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await httpClient.post<LoginResponse>('/Authentication/Login', data);
        return response.data;
    },
    getCurrentUserTenant: async (): Promise<TenantStorefrontDto> => {
        const response = await httpClient.get<TenantStorefrontDto>('/Authentication/GetUserTenant');
        return response.data;
    },
};
