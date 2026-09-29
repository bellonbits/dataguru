import { useMemo, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const DATA = [['Widget', 'West', 'Alice', 1200], ['Gadget', 'East', 'Bob', 800], ['Widget', 'East', 'Chen', 950], ['Gizmo', 'North', 'Alice', 600], ['Gadget', 'West', 'Dee', 1400], ['Gizmo', 'East', 'Bob', 300], ['Widget', 'North', 'Chen', 1100]];
const COLS = ['Product', 'Region', 'Rep', 'Sales'];
export default function XlTable({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [sort, setSort] = useState(null); const [filt, setFilt] = useState({}); const [total, setTotal] = useState(false); const [extra, setExtra] = useState([]);
  const all = [...DATA, ...extra];
  const rows = useMemo(() => { let r = all.filter(x => COLS.every((c, i) => !filt[c] || String(x[i]) === filt[c])); if (sort) r = [...r].sort((a, b) => (a[sort.i] > b[sort.i] ? 1 : a[sort.i] < b[sort.i] ? -1 : 0) * (sort.dir === 'asc' ? 1 : -1)); return r; }, [all.length, filt, sort]); // eslint-disable-line
  const add = () => { setExtra(e => [...e, ['Widget', 'South', 'Eli', 500 + e.length * 50]]); done(); };
  return (
    <Frame title={title} finished={finished} desc="A real Excel Table (Insert → Table) gives you filter arrows, sorting, banded rows, a total row and automatic expansion when you add data.">
      <div className="tbl-wrap"><table className="data" style={{ width: '100%' }}><thead><tr>{COLS.map((c, i) => <th key={c}><div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><button style={{ border: 0, background: 'none', font: 'inherit', fontWeight: 600 }} onClick={() => { setSort(s => ({ i, dir: s && s.i === i && s.dir === 'asc' ? 'desc' : 'asc' })); done(); }} aria-label={`Sort by ${c}`}>{c}{sort && sort.i === i ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}</button>
          <select aria-label={`Filter ${c}`} value={filt[c] || ''} onChange={e => { setFilt(f => ({ ...f, [c]: e.target.value })); done(); }}><option value="">All</option>{[...new Set(all.map(r => r[i]))].map(v => <option key={v}>{v}</option>)}</select></div></th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} style={{ background: i % 2 ? 'var(--card2)' : 'transparent' }}>{r.map((v, j) => <td key={j} className={typeof v === 'number' ? 'num' : ''}>{v}</td>)}</tr>)}
          {total && <tr style={{ fontWeight: 700 }}><td>Total</td><td /><td /><td className="num">{rows.reduce((a, r) => a + r[3], 0).toLocaleString()}</td></tr>}</tbody></table></div>
      <div className="lab-actions"><label><input type="checkbox" checked={total} onChange={e => { setTotal(e.target.checked); done(); }} /> Total row</label><button className="btn sm ghost" onClick={add}>Add a row (table auto-expands)</button><button className="btn sm ghost" onClick={() => { setFilt({}); setSort(null); setExtra([]); }}>Reset</button></div>
    </Frame>
  );
}
