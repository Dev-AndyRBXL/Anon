import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { LoginForm, SignupForm } from './features/authentication';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;
