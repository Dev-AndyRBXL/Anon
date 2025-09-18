import './styles/SignupForm.css';
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
  } = useForm<SignupPayload>({ mode: 'all', reValidateMode: 'onSubmit' });

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
    <form onSubmit={handleSubmit(onSubmit)} className="signup-form" noValidate>
      <div className="signup-form-field">
        <label htmlFor="displayname" className="signup-form-label">
          Display Name
        </label>
        <input
          id="displayname"
          className="signup-form-input"
          {...register('displayname', {
            minLength: { value: 3, message: 'Minimum 3 characters' },
            maxLength: { value: 32, message: 'Maximum 32 characters' },
          })}
          autoFocus
        />
        {errors.displayname && (
          <p className="signup-form-error">{errors.displayname.message}</p>
        )}
      </div>

      <div className="signup-form-field">
        <label htmlFor="username" className="signup-form-label">
          Username
        </label>
        <input
          id="username"
          className="signup-form-input"
          {...register('username', {
            required: 'Username is required',
            minLength: { value: 3, message: 'Minimum 3 characters' },
            maxLength: { value: 32, message: 'Maximum 32 characters' },
            pattern: {
              value: /^[a-z0-9_.]+$/,
              message: 'Username cannot contain spaces',
            },
          })}
          aria-required
        />
        {errors.username && (
          <p className="signup-form-error">{errors.username.message}</p>
        )}
      </div>

      <div className="signup-form-field">
        <label htmlFor="email" className="signup-form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="signup-form-input"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address',
            },
          })}
          aria-required
        />
        {errors.email && (
          <p className="signup-form-error">{errors.email.message}</p>
        )}
      </div>

      <div className="signup-form-field">
        <label htmlFor="password" className="signup-form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="signup-form-input"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
            maxLength: { value: 64, message: 'Maximum 64 characters' },
          })}
          aria-required
        />
        {errors.password && (
          <p className="signup-form-error">{errors.password.message}</p>
        )}
      </div>

      <button type="submit" className="signup-form-submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Signup'}
      </button>
    </form>
  );
}
