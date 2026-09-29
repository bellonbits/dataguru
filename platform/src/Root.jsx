import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import Forgot from './pages/auth/Forgot.jsx';
import { ProgressProvider } from './lib/store.jsx';
import { useAuth } from './lib/auth.jsx';

const PUBLIC = ['/login', '/signup', '/forgot'];
/** Auth gate: signed-in users and guests see the app; everyone else is sent to /login. */
export default function Root() {
  const auth = useAuth(); const { pathname } = useLocation();
  if (PUBLIC.includes(pathname)) {
    // signed-in users never need these pages; a guest only needs them to sign up or sign in
    if (auth.user || (auth.guest && pathname === '/login')) return <Navigate to="/" replace />;
    return <Routes><Route path="/login" element={<Login />} /><Route path="/signup" element={<Signup />} /><Route path="/forgot" element={<Forgot />} /></Routes>;
  }
  if (!auth.ready) return <Navigate to="/login" replace />;
  return <ProgressProvider key={auth.user?.id || 'guest'} userId={auth.user?.id || 'guest'} userName={auth.user?.name}><App /></ProgressProvider>;
}
