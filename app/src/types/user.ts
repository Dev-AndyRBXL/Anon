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
  role: 'user' | 'admin';
  createdAt?: string;
}
