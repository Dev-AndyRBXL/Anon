import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import AboutSection from './Section';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="page homepage">
      <Header />
      <div className="homepage-container">
        <p>
          {user && <h2>Welcome back, {user.displayname || user.username}!</h2>}
        </p>
        <AboutSection features={{ Test: 'Created the site' }} />
      </div>
    </div>
  );
}
