import { useState } from 'react';
import type { User } from '../../../interfaces/userInterfaces';
import type { SignupPayload } from '../interfaces/authTypes';
import { signup as apiSignup } from '../services/authService';
import { useAuth } from '../../../hooks/useAuth';

export default function useSignup() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (payload: SignupPayload): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiSignup(payload);
      const user: User = res.user;
      const accessToken: string = res.accessToken;

      setAuth(user, accessToken);
      return user;
    } catch (err: any) {
      console.log(err);

      if (err.response?.data) {
        if (typeof err.response.data.message === 'string') {
          setError(err.response.data.message);
        } else if (Array.isArray(err.response.data.errors)) {
          setError(err.response.data.errors.map((e: any) => e.msg).join(', '));
        } else {
          setError('Signup failed due to server validation errors');
        }
      } else {
        setError(err.message || 'Unknown server error');
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, signup: handleSignup };
}
