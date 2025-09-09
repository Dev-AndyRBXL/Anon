/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { login, signup } from '../services/apiService';
import type { SignupPayload, LoginPayload, User } from '../types/user';
import type { ApiResponse, ApiOptions } from '../types/api';

export const useApi = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginPayload) => {
    const res = await login(credentials);

    if (!res.data || !res.token) {
      console.warn('Login failed:', res.message);
      return res;
    }

    setUser(res.data);
    setToken(res.token);
    return res;
  };

  const handleSignup = async (data: SignupPayload) => {
    return signup(data);
  };

  return { user, token, handleLogin, handleSignup, setUser, setToken };
};

/* ---------------- API Request ---------------- */

const API_BASE = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

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
  // passport-jwt expects an 'Authorization' key in the 'headers' object
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;

  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: data && method !== 'GET' ? JSON.stringify(data) : null,
    });
  } catch (err: any) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
      errors: [err.message],
    };
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    return {
      success: false,
      message: 'Invalid JSON response from server',
      errors: ['Invalid JSON'],
    };
  }

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
    token: json?.token,
  };
};
