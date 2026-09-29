import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Copy, Check, Download, ShieldCheck } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { TextField, PasswordField, Alert } from './Fields.jsx';
import { useAuth, validEmail, passwordIssues } from '../../lib/auth.jsx';

export function RecoveryScreen({ code, email, onDone, title = 'Save your recovery code' }) {
  const [copied, setCopied] = useState(false); const [saved, setSaved] = useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); } catch (e) { /* blocked */ } };
  const download = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([`Data Guru recovery code for ${email}\n\n${code}\n\nKeep this somewhere safe. It is the only way to reset your password.\n`], { type: 'text/plain' })); a.download = 'data-guru-recovery-code.txt'; a.click(); URL.revokeObjectURL(a.href); setSaved(true); };
  return (
    <AuthLayout title={title} subtitle="There is no email server, so this one-time code is the only way to reset a forgotten password. It is shown just once.">
      <div className="recovery" role="group" aria-label="Recovery code"><ShieldCheck size={22} /><code>{code}</code></div>
      <div className="lab-actions"><button className="btn sm ghost" onClick={copy}>{copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}</button><button className="btn sm ghost" onClick={download}><Download size={14} /> Download</button></div>
      <label className="af-check" style={{ margin: '14px 0' }}><input type="checkbox" checked={saved} onChange={e => setSaved(e.target.checked)} /> I have saved this code somewhere safe</label>
      <button className="btn auth-btn" disabled={!saved} onClick={onDone}>Continue to my dashboard</button>
    </AuthLayout>
  );
}

export default function Signup() {
  const auth = useAuth(); const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', terms: false }); const [errs, setErrs] = useState({}); const [busy, setBusy] = useState(false); const [code, setCode] = useState(null); const [created, setCreated] = useState(null);
  const set = k => e => setF(s => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const submit = async e => {
    e.preventDefault(); const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.'; if (!validEmail(f.email)) er.email = 'Enter a valid email address.';
    const iss = passwordIssues(f.password); if (iss.length) er.password = 'Password needs ' + iss.join(', ') + '.';
    if (f.confirm !== f.password) er.confirm = 'Passwords do not match.'; if (!f.terms) er.terms = 'Please accept to continue.';
    setErrs(er); if (Object.keys(er).length) return;
    setBusy(true);
    try { const r = await auth.signUp({ name: f.name, email: f.email, password: f.password }); setCode(r.recoveryCode); setCreated(r.user); }
    catch (err) { setErrs({ form: err.message }); }
    setBusy(false);
  };
  if (code) return <RecoveryScreen code={code} email={f.email} onDone={() => { auth.finish(created); nav('/', { replace: true }); }} />;
  return (
    <AuthLayout title="Create your account" subtitle="Free. Your progress is saved to this device." footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
      <form onSubmit={submit} noValidate>
        <Alert>{errs.form}</Alert>
        <TextField label="Full name" autoComplete="name" value={f.name} onChange={set('name')} error={errs.name} autoFocus />
        <TextField label="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')} error={errs.email} />
        <PasswordField label="Password" autoComplete="new-password" value={f.password} onChange={set('password')} error={errs.password} meter hint="At least 8 characters with upper and lower case letters and a number." />
        <PasswordField label="Confirm password" autoComplete="new-password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} />
        <label className={'af-check' + (errs.terms ? ' bad' : '')}><input type="checkbox" checked={f.terms} onChange={set('terms')} /> I understand my account and progress are stored only in this browser.</label>
        {errs.terms && <p className="af-err" role="alert">{errs.terms}</p>}
        <button className="btn auth-btn" disabled={busy}>{busy ? <><span className="spinner" />Creating account…</> : <><UserPlus size={18} /> Create account</>}</button>
      </form>
    </AuthLayout>
  );
}
