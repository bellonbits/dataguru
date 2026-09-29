import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Timer, SkipForward } from 'lucide-react';
import Lab from '../components/labs/Lab.jsx';
import { ALL_TASKS } from '../content/courses.js';
import { useProgress } from '../lib/store.jsx';

const SANDBOX = {
  sql: { type: 'sql', title: 'SQL sandbox', db: 'company', starter: '-- Try the book’s tables: Employees, Departments, MoreEmployees\nSELECT e.FirstName, e.LastName, d.DepartmentName\nFROM Employees e\nLEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID;' },
  python: { type: 'python', title: 'Python sandbox', starter: 'import pandas as pd\n\ndf = pd.read_csv("data.csv")\nprint(df)\nprint(df.describe())' },
  excel: { type: 'excel', title: 'Excel sandbox', sheet: [['Product', 'Region', 'Sales'], ['Widget', 'West', 120], ['Gadget', 'East', 80], ['Widget', 'East', 95], ['Gizmo', 'West', 60], ['', '', ''], ['Total', '', '=SUM(C2:C5)'], ['West only', '', '=SUMIFS(C2:C5,B2:B5,"West")']], cols: 6, rows: 14 },
  dax: { type: 'dax', title: 'DAX sandbox', starter: 'Total Sales = SUM(Sales[SalesAmount])\n\nShare of all = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Sales[Region])))\n\nBest price = MAXX(Products, Products[Price])', groupBy: 'Sales.Region' },
};

function Challenge() {
  const [course, setCourse] = useState('sql'); const [n, setN] = useState(0); const [sec, setSec] = useState(0); const { state } = useProgress();
  const pool = ALL_TASKS.filter(t => t.chapter.course === course);
  const cur = pool.length ? pool[n % pool.length] : null;
  useEffect(() => { setSec(0); const t = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(t); }, [n, course]);
  const done = cur && state.labs[cur.key];
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="field"><label>Subject <select value={course} onChange={e => { setCourse(e.target.value); setN(0); }}>{['excel', 'powerbi', 'sql', 'python'].map(c => <option key={c} value={c}>{c === 'powerbi' ? 'Power BI (DAX)' : c.toUpperCase().replace('PYTHON', 'Python').replace('EXCEL', 'Excel')}</option>)}</select></label>
        <span className="tag" style={{ background: 'var(--lime)', color: 'var(--lime-ink)' }}><Timer size={13} style={{ verticalAlign: -2 }} /> {String(Math.floor(sec / 60)).padStart(2, '0')}:{String(sec % 60).padStart(2, '0')}</span>
        <span className="muted">Challenge {(n % Math.max(1, pool.length)) + 1} of {pool.length}{done ? ' · ✔ already solved' : ''}</span>
        <button className="btn sm ghost" onClick={() => setN(x => x + 1)}><SkipForward size={14} /> Next challenge</button></div>
      {cur ? <Lab key={cur.key} spec={cur} labKey={cur.key} course={course} /> : <div className="panel">No challenges for this subject yet.</div>}
    </div>
  );
}

export default function LiveLabs() {
  const [sp, setSp] = useSearchParams(); const tab = sp.get('tab') || 'sql';
  const tabs = [['sql', 'SQL'], ['python', 'Python'], ['excel', 'Excel'], ['dax', 'DAX'], ['challenge', '⏱ Challenges']];
  return (
    <>
      <div className="page-head"><div><h1>Live Labs</h1><p>Interactive sessions that run entirely in your browser. Use a sandbox to experiment freely, or take a timed challenge.</p></div></div>
      <div className="tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setSp({ tab: k })}>{l}</button>)}</div>
      {tab === 'challenge' ? <Challenge /> : <Lab key={tab} spec={SANDBOX[tab]} labKey={`sandbox/${tab}`} course={tab} />}
    </>
  );
}
