/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiError extends Error {
  status?: number;
  details?: any;
}

interface ApiOptions {
  endpoint: string;
  method?: HttpMethod;
  data?: Record<string, unknown> | null;
  token?: string | null;
}

/**
 * API request helper
 * Automatically includes API key and optional JWT token
 */
export const apiRequest = async <T>({
  endpoint,
  method = 'GET',
  data = null,
  token = null,
}: ApiOptions): Promise<T> => {
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
      body: data && method !== 'GET' ? JSON.stringify(data) : undefined,
    });
  } catch (err: any) {
    const error: ApiError = new Error(`Network error: ${err.message}`);
    throw error;
  }

  let json: any = null;
  const text = await res.text(); // read raw text first
  try {
    if (text) json = JSON.parse(text); // parse only if text is not empty
  } catch {
    const error: ApiError = new Error('Invalid JSON response from server');
    error.status = res.status;
    throw error;
  }

  if (!res.ok) {
    const error: ApiError = new Error(
      json?.message || `API request failed with status ${res.status}`
    );
    error.status = res.status;
    error.details = json?.errors || null; 
    throw error;
  }

  return json as T;
};
