import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const FACT = ['Date Key', 'Product Key', 'Customer Key', 'Sales Amount', 'Quantity Sold'];
const DIMS = { Date: ['Date Key', 'Year', 'Quarter', 'Month', 'Day'], Product: ['Product Key', 'Product Name', 'Category', 'Price'], Customer: ['Customer Key', 'Customer Name', 'Region', 'Segment'] };
const KEYS = { 'Date Key': 'Date', 'Product Key': 'Product', 'Customer Key': 'Customer' };
export default function StarSchema({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [pick, setPick] = useState({}); const [res, setRes] = useState(null);
  const check = () => { const bad = Object.keys(KEYS).filter(k => pick[k] !== KEYS[k]); const ok = !bad.length; setRes(ok ? { ok, text: '✔ Perfect star schema: three 1:many relationships, each from a dimension’s key to the fact table’s matching key.' } : { ok, text: `Not yet: check ${bad.join(', ')}. Each foreign key in the fact table points to the dimension whose primary key has the same name.` }); if (ok) done(); };
  return (
    <Frame title={title} finished={finished} verdict={res} desc="The Sales fact table holds measurable data and foreign keys. Connect each foreign key to the dimension table that owns it.">
      <div className="cols2">
        <div><b>Sales (fact table)</b><ul style={{ margin: '6px 0' }}>{FACT.map(f => <li key={f}>{f}{KEYS[f] && <> → <select aria-label={`Relationship for ${f}`} value={pick[f] || ''} onChange={e => setPick(p => ({ ...p, [f]: e.target.value }))}><option value="">choose dimension…</option>{Object.keys(DIMS).map(d => <option key={d}>{d}</option>)}</select></>}</li>)}</ul>
          <button className="btn sm lime" onClick={check}>Check relationships</button></div>
        <div>{Object.entries(DIMS).map(([d, cols]) => <div key={d} style={{ marginBottom: 8 }}><b>{d} (dimension)</b><div className="muted">{cols.join(' · ')}</div></div>)}</div>
      </div>
      <svg viewBox="0 0 420 170" width="100%" style={{ maxHeight: 190, marginTop: 8 }} role="img" aria-label="Star schema diagram">
        {Object.keys(DIMS).map((d, i) => { const x = [20, 160, 300][i]; const ok = pick[Object.keys(KEYS)[i]] === d; return <g key={d}><line x1={x + 50} y1="50" x2="210" y2="120" stroke={ok ? '#3f7f00' : '#b0b5a8'} strokeWidth={ok ? 3 : 1.5} strokeDasharray={ok ? '' : '5 4'} /><rect x={x} y="14" width="100" height="36" rx="10" fill="#e4f0ff" stroke="#6d9bff" /><text x={x + 50} y="37" textAnchor="middle" fontSize="13" fill="#123">{d}</text></g>; })}
        <rect x="150" y="120" width="120" height="36" rx="10" fill="#d9f55c" stroke="#8fb400" /><text x="210" y="143" textAnchor="middle" fontSize="13" fontWeight="700" fill="#172200">Sales (fact)</text>
      </svg>
    </Frame>
  );
}
