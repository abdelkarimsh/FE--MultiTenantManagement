import httpClient from './httpClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await httpClient.post<LoginResponse>('/Authentication/Login', data);
        return response.data;
    },
};
