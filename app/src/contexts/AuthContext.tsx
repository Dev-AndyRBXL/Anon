import { createContext, useState, useMemo, type ReactNode } from 'react';
import type { User } from '../interfaces/userInterfaces';

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setAuth = (user: User, token: string) => {
    setUser(user);
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      accessToken,
      setAuth,
      logout,
    }),
    [user, accessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
