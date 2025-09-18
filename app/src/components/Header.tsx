import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      <div className="header-container">
        {' '}
        <h1 className="header-logo">ZetaForge</h1>
        <nav className="header-nav">
          <ul className="header-list">
            <li className="header-item">
              {user ? (
                <Link to={`/users/${user.id}`}>Profile</Link>
              ) : (
                <Link to="/users/signup" className="btn">
                  Sign Up
                </Link>
              )}
            </li>

            <li className="header-item">
              {user ? (
                <a onClick={logout}>Logout</a>
              ) : (
                <Link to="/users/login" className="btn">
                  Log In
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
