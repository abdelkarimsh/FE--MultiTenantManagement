// src/types/users.ts
export interface UserDto {
  id: string;
  email: string;
  phoneNumber?: string | null;
  tenantId?: string | null;
  roles: string[];  
}

export interface CreateUserRequest {
  email: string;
  password: string;
  phoneNumber?: string;
  tenantId?: string | null;
  role: string;   
}

export interface UpdateUserRequest {
  phoneNumber?: string;
  tenantId?: string | null;
  role: string;
}
