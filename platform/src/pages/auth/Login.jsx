import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { TextField, PasswordField, Alert } from './Fields.jsx';
import { useAuth, validEmail } from '../../lib/auth.jsx';

export default function Login() {
  const auth = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [remember, setRemember] = useState(true);
  const [errs, setErrs] = useState({}); const [msg, setMsg] = useState(loc.state?.notice || ''); const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setMsg('');
    const er = {}; if (!validEmail(email)) er.email = 'Enter a valid email address.'; if (!password) er.password = 'Enter your password.'; setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { await auth.signIn({ email, password, remember }); nav('/', { replace: true }); }
    catch (err) { setErrs({ form: err.message }); setPassword(''); }
    setBusy(false);
  };
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to pick up where you left off." footer={<>New here? <Link to="/signup">Create an account</Link></>}>
      <form onSubmit={submit} noValidate>
        <Alert kind="ok">{msg}</Alert><Alert>{errs.form}</Alert>
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} error={errs.email} autoFocus />
        <PasswordField label="Password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} error={errs.password} />
        <div className="af-row"><label className="af-check"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} /> Keep me signed in</label><Link to="/forgot">Forgot password?</Link></div>
        <button className="btn auth-btn" disabled={busy}>{busy ? <><span className="spinner" />Signing in…</> : <><LogIn size={18} /> Sign in</>}</button>
      </form>
      <div className="auth-or"><span>or</span></div>
      <button className="btn ghost auth-btn" type="button" onClick={() => { auth.guestMode(); nav('/', { replace: true }); }}>Continue as guest</button>
      <p className="muted auth-note">Guest progress is saved on this device only, and can be lost if you clear browser data.</p>
    </AuthLayout>
  );
}
