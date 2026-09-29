import { useMemo, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';
import { DataTable } from '../SqlLab.jsx';

const SRC = { cols: ['FullName', 'Age', 'Country', 'Sales'], rows: [[' ada obi ', '31', 'Nigeria', '120'], ['KOFI MENSAH', '17', 'Ghana', '80'], ['Amara Okafor', '', 'Nigeria', '95'], ['ada obi', '31', 'Nigeria', '120'], ['Sam Lee', '45', 'Kenya', '60'], ['Zanele Dube', '28', 'South Africa', '110'], [' kofi mensah', '17', 'Ghana', '80']] };
const OPS = {
  trim: { label: 'Trim + capitalise text', run: t => ({ ...t, rows: t.rows.map(r => r.map((v, i) => (t.cols[i] === 'FullName' ? String(v).trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) : v))) }) },
  dedupe: { label: 'Remove duplicates', run: t => { const s = new Set(); return { ...t, rows: t.rows.filter(r => { const k = JSON.stringify(r); return s.has(k) ? false : s.add(k); }) }; } },
  blanks: { label: 'Remove rows with blank Age', run: t => { const i = t.cols.indexOf('Age'); return { ...t, rows: t.rows.filter(r => r[i] !== '' && r[i] != null) }; } },
  types: { label: 'Change type: Age, Sales → number', run: t => ({ ...t, rows: t.rows.map(r => r.map((v, i) => (['Age', 'Sales'].includes(t.cols[i]) && v !== '' && v != null ? Number(v) : v))) }) },
  adults: { label: 'Filter rows: Age ≥ 18', run: t => { const i = t.cols.indexOf('Age'); return { ...t, rows: t.rows.filter(r => typeof r[i] === 'number' ? r[i] >= 18 : true) }; } },
  split: { label: 'Split FullName by space', run: t => { const i = t.cols.indexOf('FullName'); if (i < 0) return t; const cols = [...t.cols.slice(0, i), 'First', 'Last', ...t.cols.slice(i + 1)]; return { cols, rows: t.rows.map(r => { const [f, ...l] = String(r[i]).trim().split(/\s+/); return [...r.slice(0, i), f, l.join(' '), ...r.slice(i + 1)]; }) }; } },
  cond: { label: 'Add conditional column: Tier', run: t => { const i = t.cols.indexOf('Sales'); return { cols: [...t.cols, 'Tier'], rows: t.rows.map(r => [...r, typeof r[i] === 'number' ? (r[i] >= 100 ? 'High' : 'Low') : null]) }; } },
  group: { label: 'Group by Country: sum of Sales', run: t => { const c = t.cols.indexOf('Country'), s = t.cols.indexOf('Sales'); if (c < 0 || s < 0) return t; const m = new Map(); t.rows.forEach(r => m.set(r[c], (m.get(r[c]) || 0) + Number(r[s]))); return { cols: ['Country', 'Total Sales'], rows: [...m] }; } },
};
export default function PowerQuery({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [steps, setSteps] = useState([]);
  const out = useMemo(() => steps.reduce((t, k) => OPS[k].run(t), { cols: SRC.cols, rows: SRC.rows }), [steps]);
  const add = k => { setSteps(s => [...s, k]); done(); };
  return (
    <Frame title={title} finished={finished} desc="Each button is a Power Query transformation. Steps are recorded in “Applied Steps” and can be deleted, then the data is recalculated from the source, just like the real editor.">
      <div className="cols2"><div><b>Transformations</b><div className="chips" style={{ margin: '8px 0' }}>{Object.entries(OPS).map(([k, o]) => <button key={k} className="chip" onClick={() => add(k)}>{o.label}</button>)}</div>
        <b>Preview ({out.rows.length} rows)</b><DataTable cols={out.cols} rows={out.rows} /></div>
        <div><b>Applied Steps</b><ol className="steps" style={{ marginTop: 8 }}><li>Source</li>{steps.map((k, i) => <li key={i}>{OPS[k].label}<button aria-label={`Delete step ${OPS[k].label}`} onClick={() => setSteps(s => s.filter((_, j) => j !== i))}>✕</button></li>)}</ol>
          <button className="btn sm lime" onClick={() => window.dispatchEvent(new CustomEvent('dg-toast', { detail: `Close & Apply: ${out.rows.length} rows loaded to the model` }))}>Close &amp; Apply</button>
          <button className="btn sm ghost" style={{ marginLeft: 6 }} onClick={() => setSteps([])}>Reset</button></div></div>
    </Frame>
  );
}
