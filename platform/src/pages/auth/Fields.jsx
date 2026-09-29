import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { passwordStrength } from '../../lib/auth.jsx';

export function Field({ label, error, hint, children }) {
  const id = useId();
  return (
    <div className={'af' + (error ? ' has-error' : '')}>
      <label htmlFor={id}>{label}</label>
      {children(id, error ? id + '-err' : hint ? id + '-hint' : undefined)}
      {error ? <p className="af-err" id={id + '-err'} role="alert">{error}</p> : hint ? <p className="af-hint" id={id + '-hint'}>{hint}</p> : null}
    </div>
  );
}
export function TextField({ label, error, hint, ...p }) {
  return <Field label={label} error={error} hint={hint}>{(id, desc) => <input id={id} aria-describedby={desc} aria-invalid={!!error} {...p} />}</Field>;
}
export function PasswordField({ label, error, hint, meter, value, ...p }) {
  const [show, setShow] = useState(false); const st = meter ? passwordStrength(value || '') : null;
  return (
    <Field label={label} error={error} hint={hint}>{(id, desc) => (
      <>
        <div className="af-pw"><input id={id} type={show ? 'text' : 'password'} aria-describedby={desc} aria-invalid={!!error} value={value} {...p} />
          <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        {meter && value ? <div className="meter" aria-live="polite"><span className={'seg s' + st.score}>{[0, 1, 2, 3].map(i => <i key={i} className={i < st.score ? 'on' : ''} />)}</span><small>{st.label}</small></div> : null}
      </>)}</Field>
  );
}
export function Alert({ kind = 'bad', children }) { return children ? <div className={'af-alert ' + kind} role="alert">{children}</div> : null; }
