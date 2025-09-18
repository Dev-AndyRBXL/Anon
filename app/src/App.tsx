import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/signup" element={<Signup />} />
      <Route path="/users/login" element={<Login />} />
    </Routes>
  );
}

export default App;
