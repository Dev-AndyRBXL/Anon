import axios from 'axios';
import type { LoginPayload, SignupPayload } from '../interfaces/authTypes';
import type { User } from '../../../interfaces/userInterfaces';

const API_BASE = import.meta.env.VITE_API_URL as string;

interface AuthResponse {
  user: User;
  accessToken: string;
}

// Helper function for error handling
export const handleAuthError = (err: any, defaultMessage: string): string => {
  if (err.response?.data) {
    if (typeof err.response.data.message === 'string') {
      return err.response.data.message;
    } else if (Array.isArray(err.response.data.errors)) {
      return err.response.data.errors.map((e: any) => e.msg).join(', ');
    } else {
      return defaultMessage;
    }
  }
  return err.message || 'Unknown server error';
};

export const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const setupInterceptors = (
  accessToken: string,
  setAccessToken: (token: string) => void,
  logout: () => void
) => {
  // Clear existing interceptors to prevent duplicates
  client.interceptors.request.clear();
  client.interceptors.response.clear();

  // Request interceptor
  client.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  });

  // Response interceptor with refresh token handling
  client.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;

      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await client.post('/auth/refresh');
          setAccessToken(data.accessToken);

          // Update the authorization header for the retry
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${data.accessToken}`;

          // Retry the original request
          return client(originalRequest);
        } catch (refreshError: any) {
          // Refresh token is expired/invalid
          console.log('Refresh token expired, logging out user');
          logout();

          // Optional: Redirect to login
          // if (typeof window !== 'undefined') {
          //   window.location.href = '/login';
          // }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(err);
    }
  );
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const res = await client.post<AuthResponse>('/auth/login', payload);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || 'Login failed';
    throw new Error(message);
  }
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  try {
    const res = await client.post<AuthResponse>('/auth/signup', payload);
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || 'Signup failed';
    throw new Error(message);
  }
}
