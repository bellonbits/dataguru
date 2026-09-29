import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Frame, { useFrame } from './Frame.jsx';
import { DAX_TABLES } from '../../../lib/dax-data.js';
Chart.register(...registerables);
const COL = ['#c9ea3c', '#6d9bff', '#ffab5e', '#b18cff'];

export default function Dashboard({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const data = useMemo(() => DAX_TABLES().Sales.rows, []);
  const [year, setYear] = useState('All'); const [cat, setCat] = useState(null); const [region, setRegion] = useState(null);
  const rows = data.filter(r => (year === 'All' || String(r.Year) === year) && (!cat || r.Category === cat) && (!region || r.Region === region));
  const sum = (a, k) => a.reduce((x, r) => x + r[k], 0);
  const byCat = ['Bikes', 'Gear', 'Accessories'].map(c => sum(data.filter(r => (year === 'All' || String(r.Year) === year) && (!region || r.Region === region) && r.Category === c), 'SalesAmount'));
  const byRegion = ['West', 'East', 'North', 'South'].map(c => sum(data.filter(r => (year === 'All' || String(r.Year) === year) && (!cat || r.Category === cat) && r.Region === c), 'SalesAmount'));
  const months = Array.from({ length: 12 }, (_, i) => sum(rows.filter(r => +r.Month.slice(5, 7) === i + 1), 'SalesAmount'));
  const c1 = useRef(null), c2 = useRef(null), c3 = useRef(null); const ch = useRef({});
  useEffect(() => {
    Object.values(ch.current).forEach(c => c.destroy());
    const opt = (onClick) => ({ responsive: true, maintainAspectRatio: false, animation: { duration: 250 }, plugins: { legend: { display: false } }, onClick, onHover: (e, el) => { e.native.target.style.cursor = el.length && onClick ? 'pointer' : 'default'; } });
    const cats = ['Bikes', 'Gear', 'Accessories'], regs = ['West', 'East', 'North', 'South'];
    ch.current.a = new Chart(c1.current, { type: 'bar', data: { labels: cats, datasets: [{ data: byCat, backgroundColor: cats.map(c => (cat && cat !== c ? '#c9ccc4' : COL[1])) }] }, options: opt((e, el) => { if (el.length) { const c = cats[el[0].index]; setCat(x => (x === c ? null : c)); done(); } }) });
    ch.current.b = new Chart(c2.current, { type: 'doughnut', data: { labels: regs, datasets: [{ data: byRegion, backgroundColor: regs.map((r, i) => (region && region !== r ? '#c9ccc4' : COL[i])) }] }, options: { ...opt((e, el) => { if (el.length) { const r = regs[el[0].index]; setRegion(x => (x === r ? null : r)); done(); } }), plugins: { legend: { display: true, position: 'bottom' } } } });
    ch.current.c = new Chart(c3.current, { type: 'line', data: { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], datasets: [{ data: months, borderColor: '#3f7f00', backgroundColor: '#c9ea3c55', fill: true, tension: .3 }] }, options: opt() });
    return () => Object.values(ch.current).forEach(c => c.destroy());
  }, [year, cat, region]); // eslint-disable-line
  const money = n => '$' + Math.round(n).toLocaleString();
  return (
    <Frame title={title} finished={finished} desc="Cross-filtering: click a bar or a doughnut slice and every other visual reacts, exactly like a Power BI report. Click again to clear. The slicer filters everything.">
      <div className="field"><b>Year slicer</b><div className="chips">{['All', '2021', '2022'].map(y => <button key={y} className={'chip' + (year === y ? ' on' : '')} onClick={() => { setYear(y); done(); }}>{y}</button>)}</div>
        {(cat || region) && <button className="btn sm ghost" onClick={() => { setCat(null); setRegion(null); }}>Clear filters ({[cat, region].filter(Boolean).join(' · ')})</button>}</div>
      <div className="kpis"><div className="kpi"><b>{money(sum(rows, 'SalesAmount'))}</b><span>Total Sales</span></div><div className="kpi"><b>{rows.length}</b><span>Orders</span></div><div className="kpi"><b>{rows.length ? money(sum(rows, 'SalesAmount') / rows.length) : '–'}</b><span>Avg order</span></div><div className="kpi"><b>{sum(rows, 'Quantity')}</b><span>Units</span></div></div>
      <div className="cols2"><div><b>Sales by Category</b><div style={{ height: 210 }}><canvas ref={c1} role="img" aria-label="Sales by category bar chart" /></div></div><div><b>Sales by Region</b><div style={{ height: 210 }}><canvas ref={c2} role="img" aria-label="Sales by region doughnut" /></div></div></div>
      <b>Monthly trend</b><div style={{ height: 180 }}><canvas ref={c3} role="img" aria-label="Monthly sales line chart" /></div>
    </Frame>
  );
}
