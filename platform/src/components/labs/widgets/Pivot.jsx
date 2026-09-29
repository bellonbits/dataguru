import { useMemo, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';
import { DAX_TABLES } from '../../../lib/dax-data.js';
import { DataTable } from '../SqlLab.jsx';

const FIELDS = ['Region', 'Category', 'Year', 'Product', 'State'];
const AGG = { Sum: a => a.reduce((x, y) => x + y, 0), Average: a => a.reduce((x, y) => x + y, 0) / (a.length || 1), Count: a => a.length, Max: a => Math.max(...a), Min: a => Math.min(...a) };
export default function Pivot({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const data = useMemo(() => DAX_TABLES().Sales.rows, []);
  const [rowF, setRow] = useState('Category'); const [colF, setCol] = useState('Year'); const [val, setVal] = useState('SalesAmount'); const [agg, setAgg] = useState('Sum'); const [fF, setFF] = useState('Region'); const [fV, setFV] = useState('All');
  const fVals = useMemo(() => [...new Set(data.map(r => r[fF]))].sort(), [data, fF]);
  const rows = data.filter(r => fV === 'All' || String(r[fF]) === fV);
  const rk = [...new Set(rows.map(r => r[rowF]))].sort(), ck = colF === 'None' ? [] : [...new Set(rows.map(r => r[colF]))].sort();
  const cell = (rv, cv) => { const a = rows.filter(r => r[rowF] === rv && (cv === null || r[colF] === cv)).map(r => r[val]); return a.length ? Math.round(AGG[agg](a) * 100) / 100 : null; };
  const total = cv => { const a = rows.filter(r => cv === null || r[colF] === cv).map(r => r[val]); return a.length ? Math.round(AGG[agg](a) * 100) / 100 : null; };
  const tbl = rk.map(rv => [rv, ...(ck.length ? ck.map(cv => cell(rv, cv)) : []), cell(rv, null)]);
  tbl.push(['Grand Total', ...ck.map(cv => total(cv)), total(null)]);
  const sel = (v, set, opts, label) => <label className="field">{label} <select value={v} onChange={e => { set(e.target.value); done(); }}>{opts.map(o => <option key={o}>{o}</option>)}</select></label>;
  return (
    <Frame title={title} finished={finished} desc="Drag-and-drop in Excel becomes four dropdowns here: Rows, Columns, Values and Filters, the same four PivotTable areas.">
      <div className="field" style={{ gap: 18 }}>{sel(rowF, setRow, FIELDS, 'Rows')}{sel(colF, setCol, ['None', ...FIELDS.filter(f => f !== rowF)], 'Columns')}{sel(val, setVal, ['SalesAmount', 'Quantity', 'Price'], 'Values')}{sel(agg, setAgg, Object.keys(AGG), 'Summarize by')}</div>
      <div className="field">{sel(fF, x => { setFF(x); setFV('All'); }, FIELDS, 'Filter')}{sel(fV, setFV, ['All', ...fVals], 'is')}</div>
      <DataTable cols={[rowF, ...ck.map(String), 'Grand Total']} rows={tbl} />
    </Frame>
  );
}
