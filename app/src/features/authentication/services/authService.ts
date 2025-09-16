import axios from 'axios';
import type { LoginPayload, SignupPayload } from '../interfaces/authTypes';
import type { User } from '../../../interfaces/userInterfaces';

const API_BASE = import.meta.env.VITE_API_URL;

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_BASE}/auth/login`,
      payload,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || 'Login failed';
    throw new Error(message);
  }
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_BASE}/auth/signup`,
      payload,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || 'Signup failed';
    throw new Error(message);
  }
}
