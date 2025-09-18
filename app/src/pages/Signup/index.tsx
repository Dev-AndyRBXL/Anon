import { Link } from 'react-router-dom';
import { SignupForm } from '../../features/authentication';

export function Signup() {
  return (
    <>
      <div className="page signup-page">
        <div className="signup-page-container">
          <div className="signup-form-container">
            <h2 className="signup-page-header">Signup</h2>
            <SignupForm />
            <p>
              Already logged in? <Link to="/users/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
