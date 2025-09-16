export interface UpdateProfilePayload {
  username?: string;
  displayname?: string;
  password?: string;
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
