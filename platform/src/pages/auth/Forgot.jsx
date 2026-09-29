import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { TextField, PasswordField, Alert } from './Fields.jsx';
import { useAuth, validEmail, passwordIssues } from '../../lib/auth.jsx';
import { RecoveryScreen } from './Signup.jsx';

export default function Forgot() {
  const auth = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ email: '', code: '', password: '', confirm: '' }); const [errs, setErrs] = useState({}); const [busy, setBusy] = useState(false); const [fresh, setFresh] = useState(null); const [who, setWho] = useState(null);
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }));
  const submit = async e => {
    e.preventDefault(); const er = {};
    if (!validEmail(f.email)) er.email = 'Enter a valid email address.'; if (f.code.replace(/[\s-]/g, '').length !== 12) er.code = 'The recovery code has 12 characters, like ABCD-EFGH-JKLM.';
    const iss = passwordIssues(f.password); if (iss.length) er.password = 'Password needs ' + iss.join(', ') + '.'; if (f.confirm !== f.password) er.confirm = 'Passwords do not match.';
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { const r = await auth.reset({ email: f.email, code: f.code, password: f.password }); setFresh(r.recoveryCode); setWho(r.user); }
    catch (err) { setErrs({ form: err.message }); }
    setBusy(false);
  };
  if (fresh) return <RecoveryScreen code={fresh} email={f.email} title="Password updated: save your new code" onDone={() => { auth.finish(who); nav('/', { replace: true }); }} />;
  return (
    <AuthLayout title="Reset your password" subtitle="Enter the recovery code you saved when you created your account." footer={<><Link to="/login">Back to sign in</Link></>}>
      <form onSubmit={submit} noValidate>
        <Alert>{errs.form}</Alert>
        <TextField label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errs.email} autoFocus />
        <TextField label="Recovery code" placeholder="ABCD-EFGH-JKLM" autoComplete="off" spellCheck={false} value={f.code} onChange={set('code')} error={errs.code} style={{ fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '.08em' }} />
        <PasswordField label="New password" autoComplete="new-password" value={f.password} onChange={set('password')} error={errs.password} meter />
        <PasswordField label="Confirm new password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} />
        <button className="btn auth-btn" disabled={busy}>{busy ? <><span className="spinner" />Checking…</> : <><KeyRound size={18} /> Reset password</>}</button>
      </form>
      <p className="muted auth-note">Lost your recovery code too? Without a server we cannot verify who you are, so the account cannot be recovered. You can create a new account, or continue as a guest.</p>
    </AuthLayout>
  );
}
