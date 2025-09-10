import { apiRequest } from './apiClient';
import {
  type User,
  type SignupPayload,
  type LoginPayload,
  type UpdateProfilePayload,
} from '../types/user';

/**
 * Signup
 * @param userData
 * @returns
 */
export const signup = async (userData: SignupPayload) => {
  return apiRequest<User>({
    endpoint: '/auth/signup',
    method: 'POST',
    data: userData,
  });
};

/**
 * Login
 * @param credentials (i.e.: { username: John, password: **** })
 * @returns
 */
export const login = async (credentials: LoginPayload) => {
  return apiRequest<User>({
    endpoint: '/auth/login',
    method: 'POST',
    data: credentials,
  });
};

export const logout = async () => {
  return apiRequest<User>({
    endpoint: '/auth/logout',
    method: 'POST',
  });
};

/**
 * Update Profile
 * @param token
 * @param updates
 * @returns
 */
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

/**
 * Delete Profile
 * @param token
 * @returns
 */
export const deleteProfile = async (token: string) => {
  return apiRequest<null>({
    endpoint: '/auth/delete',
    method: 'DELETE',
    token,
  });
};
