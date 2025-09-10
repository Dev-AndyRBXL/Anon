export interface SignupPayload {
  displayname?: string;
  username: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
  [key: string]: unknown;
}

export interface UpdateProfilePayload {
  username?: string;
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
