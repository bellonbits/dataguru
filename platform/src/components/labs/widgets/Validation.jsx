import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const RULES = {
  'Whole number 1–100': { hint: 'Enter a whole number between 1 and 100', test: v => /^-?\d+$/.test(v) && +v >= 1 && +v <= 100, err: 'Must be a whole number from 1 to 100.' },
  'Decimal 0–1': { hint: 'Enter a decimal between 0 and 1', test: v => v !== '' && !isNaN(+v) && +v >= 0 && +v <= 1, err: 'Must be a number from 0 to 1.' },
  'List: Low, Medium, High': { hint: 'Pick from the list', test: v => ['Low', 'Medium', 'High'].includes(v), err: 'Choose Low, Medium or High.', list: ['Low', 'Medium', 'High'] },
  'Date in 2024': { hint: 'Enter a date in 2024 (YYYY-MM-DD)', test: v => /^2024-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(v), err: 'Enter a date between 2024-01-01 and 2024-12-31.' },
  'Custom: A + B > 50': { hint: 'Custom formula =A1+B1>50: enter A,B like 30,25', test: v => { const p = v.split(',').map(Number); return p.length === 2 && p.every(x => !isNaN(x)) && p[0] + p[1] > 50; }, err: 'The sum of the two numbers must be greater than 50.' },
};
export default function Validation({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [rule, setRule] = useState(Object.keys(RULES)[0]); const [val, setVal] = useState(''); const [res, setRes] = useState(null);
  const R = RULES[rule];
  const submit = () => { const ok = R.test(val.trim()); setRes(ok ? { ok, text: '✔ Accepted: the value satisfies the rule.' } : { ok, text: '✖ Stop alert: ' + R.err }); done(); };
  return (
    <Frame title={title} finished={finished} verdict={res} desc="Data → Data Validation. Choose a rule type, then try to enter values, including bad ones, and see the error alert Excel would show.">
      <label className="field">Allow <select value={rule} onChange={e => { setRule(e.target.value); setVal(''); setRes(null); }}>{Object.keys(RULES).map(k => <option key={k}>{k}</option>)}</select></label>
      <p className="muted" style={{ margin: '4px 0' }}>Input message: {R.hint}</p>
      <div className="field">{R.list ? <select value={val} onChange={e => setVal(e.target.value)} aria-label="Cell value"><option value="">—</option>{R.list.map(x => <option key={x}>{x}</option>)}</select> : <input type="text" value={val} onChange={e => setVal(e.target.value)} aria-label="Cell value" placeholder="Type a value" onKeyDown={e => e.key === 'Enter' && submit()} />}
        <button className="btn sm" onClick={submit}>Enter</button></div>
    </Frame>
  );
}
