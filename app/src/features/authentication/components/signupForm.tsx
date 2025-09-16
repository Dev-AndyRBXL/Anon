import { useForm } from 'react-hook-form';
import type { SignupPayload } from '../interfaces/authTypes';
import useSignup from '../hooks/useSignup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignupForm() {
  const { signup, loading, error: apiError } = useSignup();
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupPayload>({ mode: 'onBlur', reValidateMode: 'onSubmit' });

  const onSubmit = async (data: SignupPayload) => {
    setServerErrors({});
    const user = await signup(data);

    if (!user && apiError) {
      try {
        const parsed = JSON.parse(apiError);
        if (typeof parsed === 'object') {
          Object.entries(parsed).forEach(([field, msg]) => {
            setError(field as keyof SignupPayload, {
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
    <div className="signup-form form">
      <div className="signup-form-container">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="displayname">Display Name</label>
            <input
              id="displayname"
              {...register('displayname', {
                minLength: { value: 3, message: 'Minimum 3 characters' },
                maxLength: { value: 32, message: 'Maximum 32 characters' },
              })}
              autoFocus
            />
            {errors.displayname && (
              <p className="error">{errors.displayname.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
                maxLength: { value: 32, message: 'Maximum 32 characters' },
              })}
              aria-required
            />
            {errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              aria-required
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                maxLength: { value: 64, message: 'Maximum 64 characters' },
              })}
              aria-required
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>
      </div>
    </div>
  );
}
