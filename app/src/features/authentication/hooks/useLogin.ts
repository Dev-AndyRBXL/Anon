import { useState } from 'react';
import type { User } from '../../../interfaces/userInterfaces';
import type { LoginPayload } from '../interfaces/authTypes';
import { login as apiLogin, handleAuthError } from '../services/authService';
import { useAuth } from '../../../hooks/useAuth';

export default function useLogin() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (payload: LoginPayload): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiLogin(payload);
      const user: User = res.user;
      const accessToken: string = res.accessToken;
      setAuth(user, accessToken);
      return user;
    } catch (err: any) {
      console.log(err);
      setError(
        handleAuthError(err, 'Login failed due to server validation errors')
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login: handleLogin };
}
