/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse, ApiOptions } from '../types/api';

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

  let jsonData: ApiResponse<T>;
  try {
    jsonData = (await res.json()) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      message: 'Invalid JSON response from server',
      errors: ['Invalid JSON'],
    };
  }

  if (!res.ok) {
    return { ...jsonData, success: false };
  }

  return jsonData;
};
