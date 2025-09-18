import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/authentication';

export function Login() {
  return (
    <>
      <div className="page login-page">
        <div className="login-page-container">
          <div className="login-form-container">
            <h2 className="login-page-header">Login</h2>
            <LoginForm />
            <p>
              Don't have an account? <Link to="/users/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
