// src/api/usersApi.ts
import httpClient from './httpClient';
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '../types/users';

export const usersApi = {
  // GET /Users/GetUsers?tenantId=...
  getUsers: async (tenantId?: string): Promise<UserDto[]> => {
    const res = await httpClient.get<UserDto[]>('/Users/GetUsers', {
      params: tenantId ? { tenantId } : undefined,
    });
    return res.data;
  },

  getUserById: async (userId: string): Promise<UserDto> => {
    const res = await httpClient.get<UserDto>(`/Users/Users/${userId}`);
    return res.data;
  },

  createUser: async (payload: CreateUserRequest): Promise<UserDto> => {
    const res = await httpClient.post<UserDto>('/Users/CreateUser', payload);
    return res.data;
  },

  updateUser: async (userId: string, payload: UpdateUserRequest): Promise<void> => {
    await httpClient.put(`/Users/UpdateUser/${userId}`, payload);
  },
  deleteUser: async (userId: string): Promise<void> => {
    await httpClient.delete(`/Users/DeleteUser/${userId}`);
  },
};
