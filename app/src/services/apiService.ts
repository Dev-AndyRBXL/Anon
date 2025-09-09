/* auth.ts */
import { apiRequest } from './apiClient';
import {
  type User,
  type SignupPayload,
  type LoginPayload,
  type UpdateProfilePayload,
} from '../types/user';

export const signup = async (userData: SignupPayload) => {
  return apiRequest<User>({
    endpoint: '/auth/signup',
    method: 'POST',
    data: userData,
  });
};

export const login = async (credentials: LoginPayload) => {
  return apiRequest<User>({
    endpoint: '/auth/login',
    method: 'POST',
    data: credentials,
  });
};

export const updateProfile = async (
  token: string,
  updates: UpdateProfilePayload
) => {
  return apiRequest<User>({
    endpoint: '/auth/update',
    method: 'PATCH',
    data: updates,
    token,
  });
};

export const deleteProfile = async (token: string) => {
  return apiRequest<null>({
    endpoint: '/auth/delete',
    method: 'DELETE',
    token,
  });
};
