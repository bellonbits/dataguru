import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, CheckCheck } from 'lucide-react';
import LabShell, { Editor } from './LabShell.jsx';
import { openDb, runSql, lastTable, SQL_PRESETS } from '../../lib/sqlrun.js';
import { useProgress } from '../../lib/store.jsx';
import { valuesEqual, fmtNum } from '../../lib/util.js';

export function DataTable({ cols, rows, max = 200 }) {
  return (
    <div className="tbl-wrap"><table className="data"><thead><tr>{cols.map((c, i) => <th key={i}>{String(c)}</th>)}</tr></thead>
      <tbody>{rows.slice(0, max).map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className={v == null ? 'null' : typeof v === 'number' ? 'num' : ''}>{v == null ? 'NULL' : typeof v === 'number' ? fmtNum(v) : String(v)}</td>)}</tr>)}</tbody></table>
      {rows.length > max && <div className="muted">Showing first {max} of {rows.length} rows</div>}</div>
  );
}

function sameResult(a, b, ordered) {
  if (!a || !b || a.rows.length !== b.rows.length) return false;
  const norm = rows => rows.map(r => r.map(v => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v)));
  let ra = norm(a.rows), rb = norm(b.rows);
  if (ra[0] && rb[0] && ra[0].length !== rb[0].length) return false;
  if (!ordered) { const k = r => JSON.stringify(r); ra = ra.slice().sort((x, y) => k(x).localeCompare(k(y))); rb = rb.slice().sort((x, y) => k(x).localeCompare(k(y))); }
  return ra.every((r, i) => r.every((v, j) => valuesEqual(v, rb[i][j])));
}

export default function SqlLab({ title = 'SQL practice', task, db = 'company', starter = '', solution, verify, ordered, hint, labKey, inline }) {
  const { completeLab } = useProgress();
  const [code, setCode] = useState(starter); const [preset, setPreset] = useState(db);
  const dbRef = useRef(null); const [busy, setBusy] = useState(false); const [out, setOut] = useState(null);
  const [verdict, setVerdict] = useState(null); const [schema, setSchema] = useState([]);

  const fresh = async (p = preset) => {
    if (dbRef.current) dbRef.current.close();
    dbRef.current = await openDb(p);
    const tabs = dbRef.current.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")[0]?.values.map(r => r[0]) || [];
    setSchema(tabs.map(t => ({ t, cols: dbRef.current.exec(`PRAGMA table_info(${t})`)[0].values.map(r => r[1]) })));
    return dbRef.current;
  };
  useEffect(() => {
    let alive = true; setBusy(true);
    fresh(preset).catch(e => alive && setOut([{ type: 'error', text: e.message }])).finally(() => alive && setBusy(false));
    return () => { alive = false; dbRef.current?.close(); dbRef.current = null; };
  }, [preset]); // eslint-disable-line

  const run = async () => {
    setVerdict(null); setBusy(true);
    try {
      const d = dbRef.current || (await fresh()); const r = runSql(d, code); setOut(r);
      if (!task && !r.some(x => x.type === 'error') && r.length) completeLab(labKey);
    } catch (e) { setOut([{ type: 'error', text: e.message }]); }
    setBusy(false);
  };
  const reset = async () => { setBusy(true); await fresh(); setOut(null); setVerdict(null); setBusy(false); };
  const check = async () => {
    setBusy(true);
    try {
      const a = await openDb(preset), b = await openDb(preset);
      const got = runSql(a, code), want = runSql(b, solution);
      if (got.some(r => r.type === 'error')) { setVerdict({ ok: false, text: 'Your query has an error: ' + got.find(r => r.type === 'error').text }); a.close(); b.close(); setBusy(false); return; }
      let g = lastTable(got), w = lastTable(want);
      if (verify) { g = lastTable(runSql(a, verify)); w = lastTable(runSql(b, verify)); }
      a.close(); b.close();
      if (!g) { setVerdict({ ok: false, text: 'Your query did not return a result table. Did you forget SELECT?' }); setBusy(false); return; }
      const ok = sameResult(g, w, ordered);
      setVerdict(ok ? { ok: true, text: '✔ Correct! Your result matches the expected answer.' }
        : { ok: false, text: `Not yet. Expected ${w.rows.length} row(s) × ${w.cols.length} column(s); your query returned ${g.rows.length} × ${g.cols.length}. Re-read the task and compare your output.` });
      if (ok) completeLab(labKey);
    } catch (e) { setVerdict({ ok: false, text: e.message }); }
    setBusy(false);
  };

  return (
    <LabShell type="sql" title={title} task={task} hint={hint} solutionText={solution} labKey={labKey} verdict={verdict}
      actions={<>
        <button className="btn sm" onClick={run} disabled={busy}><Play size={14} /> Run</button>
        {task && solution && <button className="btn sm lime" onClick={check} disabled={busy}><CheckCheck size={14} /> Check answer</button>}
        <button className="btn sm ghost" onClick={reset} disabled={busy}><RotateCcw size={14} /> Reset data</button>
        <label className="field" style={{ margin: 0 }}>Data <select value={preset} onChange={e => setPreset(e.target.value)} aria-label="Practice database">{SQL_PRESETS.map(p => <option key={p}>{p}</option>)}</select></label>
      </>}>
      <Editor value={code} onChange={setCode} onRun={run} rows={Math.min(14, Math.max(4, code.split('\n').length + 1))} label="SQL editor" />
      <details className="schema"><summary>Tables in this database ({schema.length})</summary>
        {schema.map(s => <div key={s.t}><b>{s.t}</b>({s.cols.join(', ')})</div>)}</details>
      {busy && !out && <div className="muted"><span className="spinner" />Loading SQL engine…</div>}
      {out && <div className="out" aria-live="polite">
        {out.map((r, i) => r.type === 'table'
          ? <div key={i}>{r.notes?.length ? <div className="info">Translated for SQLite: {r.notes.join('; ')}</div> : null}<DataTable cols={r.cols} rows={r.rows} /><div className="muted">{r.rows.length} row(s)</div></div>
          : <pre key={i} className={r.type === 'error' ? 'err' : 'info'}>{r.type === 'error' ? 'Error: ' : ''}{r.text}</pre>)}
      </div>}
      {!inline && <div className="muted" style={{ marginTop: 6 }}>Runs SQLite in your browser. The book uses SQL Server syntax; common differences (DATEADD, DATEDIFF, DATEPART, LEN) are translated automatically. Ctrl/⌘+Enter runs.</div>}
    </LabShell>
  );
}
