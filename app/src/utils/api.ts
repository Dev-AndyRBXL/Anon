const API_BASE = import.meta.env.VITE_API_URL as string;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiError extends Error {
  status?: number;
}

interface ApiOptions {
  endpoint: string;
  method?: HttpMethod;
  data?: Record<string, unknown> | null;
  token?: string | null;
}

/**
 * API request helper
 * @param endpoint The API endpoint (e.g. '/users')
 * @param method The HTTP method (default: GET)
 * @param data The request body data (optional)
 * @param token Authorization token (optional)
 * @returns Parsed JSON response
 */
export const apiRequest = async <T>({
  endpoint,
  method = 'GET',
  data = null,
  token = null,
}: ApiOptions): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: data && method !== 'GET' ? JSON.stringify(data) : null,
  });

  let json: T;
  try {
    json = await res.json();
  } catch {
    const error: ApiError = new Error('Invalid JSON response from server');
    error.status = res.status;
    throw error;
  }

  if (!res.ok) {
    const error: ApiError = new Error(
      (json as JSON & { message: string }).message || 'API request failed'
    );
    error.status = res.status;
    throw error;
  }

  return json;
};
