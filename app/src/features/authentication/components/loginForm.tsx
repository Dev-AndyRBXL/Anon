import { useForm } from 'react-hook-form';
import useLogin from '../hooks/useLogin';
import type { LoginPayload } from '../interfaces/authTypes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { login, loading, error: apiError } = useLogin();
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginPayload>({ mode: 'onBlur', reValidateMode: 'onSubmit' });

  const onSubmit = async (data: LoginPayload) => {
    setServerErrors({});
    const user = await login({
      identifier: data.identifier,
      password: data.password,
    });

    if (!user && apiError) {
      try {
        const parsed = JSON.parse(apiError);
        if (typeof parsed === 'object') {
          Object.entries(parsed).forEach(([field, msg]) => {
            setError(field as keyof LoginPayload, {
              type: 'server',
              message: msg as string,
            });
          });
        } else {
          alert(apiError);
        }
      } catch {
        alert(apiError);
      }
    }

    if (user) navigate('/', { replace: true });
  };

  return (
    <div className="login-form form">
      <div className="login-form-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="identifier">Username or Email</label>
            <input
              id="identifier"
              {...register('identifier', {
                required: 'This field is required',
                validate: (value) => {
                  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                  const isUsername = /^[a-zA-Z0-9_]$/.test(value);
                  return (
                    isEmail || isUsername || 'Enter a valid email or username'
                  );
                },
              })}
              autoComplete="username"
              autoFocus
              aria-required
            />
            {errors.identifier && (
              <p className="error">{errors.identifier.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              autoComplete="current-password"
              aria-required
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
