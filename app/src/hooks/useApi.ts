/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { SignupPayload, LoginPayload, User } from '../types/user';
import type { ApiResponse, ApiOptions } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

export const useApi = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const apiRequest = async <T>({
    endpoint,
    method = 'GET',
    data = null,
  }: ApiOptions): Promise<ApiResponse<T>> => {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
      credentials: 'include', // send cookies for refresh token
    });

    // Try refresh if access token expired
    if (res.status === 401) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // send refresh cookie
      });

      const refreshJson = await refreshRes.json();
      if (refreshJson.accessToken) {
        setToken(refreshJson.accessToken);

        headers['Authorization'] = `Bearer ${refreshJson.accessToken}`;
        res = await fetch(`${API_BASE}${endpoint}`, {
          method,
          headers,
          body: data ? JSON.stringify(data) : null,
          credentials: 'include',
        });
      } else {
        return { success: false, message: 'Session expired', errors: [] };
      }
    }

    const json = await res.json();
    return {
      success: json.success,
      message: json.message,
      data: json.data,
      accessToken: json.accessToken,
    };
  };

  const handleLogin = async (credentials: LoginPayload) => {
    const res = await apiRequest<User>({
      endpoint: '/auth/login',
      method: 'POST',
      data: credentials,
    });
    if (res.success && res.accessToken) setToken(res.accessToken);
    if (res.success && res.data) setUser(res.data);
    return res;
  };

  const handleSignup = async (data: SignupPayload) => {
    return apiRequest({ endpoint: '/auth/signup', method: 'POST', data });
  };

  const handleLogout = async () => {
    await apiRequest({ endpoint: '/auth/logout', method: 'POST' });
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    handleLogin,
    handleSignup,
    handleLogout,
    apiRequest,
    setToken,
    setUser,
  };
};

/* ---------------- API Request ---------------- */

export const apiRequest = async <T>({
  endpoint,
  method = 'GET',
  data = null,
  token = null,
}: ApiOptions): Promise<ApiResponse<T>> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: data && method !== 'GET' ? JSON.stringify(data) : null,
      credentials: 'include',
    });
  } catch (err: any) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
      errors: [err.message],
    };
  }

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      credentials: 'include', // send refresh cookie
    });
    if (refreshRes.ok) {
      const refreshJson = await refreshRes.json();
      const newToken = refreshJson.accessToken;
      if (newToken) {
        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(`${API_BASE}${endpoint}`, {
          method,
          headers,
          body: data && method !== 'GET' ? JSON.stringify(data) : null,
        });
        const retryJson = await retryRes.json();
        return {
          success: true,
          message: 'Success (retried)',
          data: retryJson.data,
          accessToken: newToken,
        };
      }
    }
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    return {
      success: false,
      message: json?.message || `API request failed with status ${res.status}`,
      errors: json?.details || [],
    };
  }
  return {
    success: true,
    message: json?.message || 'Success',
    data: json?.data ?? json,
    accessToken: json?.token,
  };
};
