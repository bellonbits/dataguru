import { useRef, useState } from 'react';
import { useProgress } from '../lib/store.jsx';
import { useAuth, passwordIssues } from '../lib/auth.jsx';
import { PasswordField, Alert } from './auth/Fields.jsx';
import { useNavigate } from 'react-router-dom';

function Account() {
  const auth = useAuth(); const nav = useNavigate(); const { setProfile } = useProgress();
  const [f, setF] = useState({ current: '', password: '', confirm: '' }); const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false); const [del, setDel] = useState('');
  if (!auth.user) return <div className="panel" style={{ marginBottom: 18 }}><h3 style={{ marginBottom: 6 }}>Account</h3><p className="muted" style={{ marginTop: 0 }}>You are using Data Guru as a guest. Create an account to keep separate progress per person on this device.</p><button className="btn sm" onClick={() => { auth.signOut(); nav('/signup'); }}>Create an account</button></div>;
  const change = async e => {
    e.preventDefault(); setMsg(null); const iss = passwordIssues(f.password);
    if (iss.length) return setMsg({ kind: 'bad', t: 'New password needs ' + iss.join(', ') + '.' }); if (f.password !== f.confirm) return setMsg({ kind: 'bad', t: 'New passwords do not match.' });
    setBusy(true); try { await auth.changePassword({ current: f.current, password: f.password }); setMsg({ kind: 'ok', t: 'Password changed.' }); setF({ current: '', password: '', confirm: '' }); } catch (err) { setMsg({ kind: 'bad', t: err.message }); } setBusy(false);
  };
  const remove = async () => { if (!window.confirm('Delete this account and all of its progress on this device? This cannot be undone.')) return; try { await auth.deleteAccount({ password: del }); nav('/login'); } catch (err) { setMsg({ kind: 'bad', t: err.message }); } };
  return (
    <div className="panel" style={{ marginBottom: 18 }}>
      <h3 style={{ marginBottom: 4 }}>Account</h3><p className="muted" style={{ marginTop: 0 }}>Signed in as <b>{auth.user.email}</b>. Member since {new Date(auth.user.createdAt).toLocaleDateString()}.</p>
      <form onSubmit={change} noValidate style={{ maxWidth: 420 }}>
        <Alert kind={msg?.kind}>{msg?.t}</Alert>
        <PasswordField label="Current password" autoComplete="current-password" value={f.current} onChange={e => setF({ ...f, current: e.target.value })} />
        <PasswordField label="New password" autoComplete="new-password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} meter />
        <PasswordField label="Confirm new password" autoComplete="new-password" value={f.confirm} onChange={e => setF({ ...f, confirm: e.target.value })} />
        <button className="btn sm" disabled={busy || !f.current}>Change password</button>
      </form>
      <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '18px 0' }} />
      <h4 style={{ marginBottom: 6 }}>Delete account</h4>
      <div style={{ maxWidth: 420 }}><PasswordField label="Confirm with your password" autoComplete="current-password" value={del} onChange={e => setDel(e.target.value)} /><button className="btn sm ghost" style={{ color: 'var(--bad)' }} disabled={!del} onClick={remove}>Delete my account</button></div>
    </div>
  );
}

export default function SettingsPage() {
  const { state, setProfile, reset, importState } = useProgress(); const p = state.profile;
  const auth = useAuth(); const file = useRef(null); const [msg, setMsg] = useState('');
  const exportJson = () => { const blob = new Blob([JSON.stringify({ ...state, profile: { ...p, apiKey: '' } }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data-guru-progress.json'; a.click(); URL.revokeObjectURL(a.href); };
  const onImport = async e => { const f = e.target.files[0]; if (!f) return; try { const j = JSON.parse(await f.text()); if (typeof j !== 'object' || !j.chapters) throw new Error('Not a Data Guru progress file'); importState(j); setMsg('Progress imported.'); } catch (err) { setMsg('Import failed: ' + err.message); } e.target.value = ''; };
  return (
    <>
      <div className="page-head"><div><h1>Settings</h1><p>Everything is stored in this browser only. There is no account and nothing is uploaded.</p></div></div>
      <Account />
      <div className="panel">
        <div className="form-row"><label htmlFor="nm">Your name</label><input id="nm" type="text" value={p.name} onChange={e => { setProfile({ name: e.target.value }); auth.user && auth.rename(e.target.value); }} maxLength={40} /></div>
        <div className="form-row"><label htmlFor="rl">Your role<small>Shown next to your avatar</small></label><input id="rl" type="text" value={p.role} onChange={e => setProfile({ role: e.target.value })} maxLength={50} /></div>
        <div className="form-row"><label htmlFor="th">Theme</label><select id="th" value={p.theme} onChange={e => setProfile({ theme: e.target.value })}><option value="light">Light</option><option value="dark">Dark</option></select></div>
        <div className="form-row"><label htmlFor="gl">Weekly goal<small>Study sessions per week (used by the progress gauge)</small></label><input id="gl" type="number" min={1} max={14} value={p.goal} onChange={e => setProfile({ goal: Math.max(1, Math.min(14, +e.target.value || 1)) })} /></div>
        <div className="form-row"><label htmlFor="ak">Claude API key (optional)<small>Lets the AI Tutor answer with a language model. Stored only in this browser and sent only to api.anthropic.com. Leave blank to use the free offline tutor.</small></label><input id="ak" type="password" autoComplete="off" value={p.apiKey} onChange={e => setProfile({ apiKey: e.target.value.trim() })} placeholder="sk-ant-…" /></div>
        <div className="form-row"><label>Your data</label><div className="lab-actions" style={{ margin: 0 }}>
          <button className="btn sm" onClick={exportJson}>Export progress</button>
          <button className="btn sm ghost" onClick={() => file.current.click()}>Import progress</button><input ref={file} type="file" accept="application/json" hidden onChange={onImport} />
          <button className="btn sm ghost" onClick={() => { if (window.confirm('Erase all progress, notes and badges on this device?')) { reset(); setMsg('Progress erased.'); } }}>Reset everything</button></div></div>
        {msg && <p role="status" className="muted">{msg}</p>}
      </div>
    </>
  );
}
