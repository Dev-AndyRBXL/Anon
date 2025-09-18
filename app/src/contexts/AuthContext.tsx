import {
  createContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { User } from '../interfaces/userInterfaces';
import { setupInterceptors } from '../features/authentication/services/authService';

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

  // Load persisted auth data on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  // Setup interceptors when accessToken changes
  useEffect(() => {
    if (accessToken) {
      setupInterceptors(
        accessToken,
        (newToken: string) => {
          setAccessToken(newToken);
          localStorage.setItem('accessToken', newToken);
        },
        logout
      );
    }
  }, [accessToken]);

  const setAuth = (user: User, token: string) => {
    setUser(user);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
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
