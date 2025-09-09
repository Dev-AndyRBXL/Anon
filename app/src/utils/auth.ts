import { apiRequest } from './api';

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
	[key: string]: unknown;
}

export interface LoginPayload {
  username: string;
  password: string;
	[key: string]: unknown;
}

export interface UpdateProfilePayload {
  displayname?: string;
  description?: string;
	[key: string]: unknown;
}

export interface User {
  id: number;
  username: string;
  email: string;
  displayname?: string;
  description?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const signup = async (userData: SignupPayload) => {
  return apiRequest<{ message: string; userId: number }>({
    endpoint: '/auth/signup',
    method: 'POST',
    data: userData,
  });
};

export const login = async (credentials: LoginPayload) => {
  return apiRequest<AuthResponse>({
    endpoint: '/auth/login',
    method: 'POST',
    data: credentials,
  });
};

export const updateProfile = async (token: string, updates: UpdateProfilePayload) => {
  return apiRequest<User>({
    endpoint: '/auth/update',
    method: 'PATCH',
    data: updates,
    token,
  });
};

export const deleteAccount = async (token: string) => {
  return apiRequest<Record<string, unknown>>({
    endpoint: '/auth/delete',
    method: 'DELETE',
    token,
  });
};
