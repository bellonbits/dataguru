import { useMemo, useState } from 'react';
import { Play, CheckCheck } from 'lucide-react';
import LabShell, { Editor } from './LabShell.jsx';
import { createEngine } from '../../lib/dax-engine.js';
import { DAX_TABLES, DAX_RELATIONS } from '../../lib/dax-data.js';
import { DataTable } from './SqlLab.jsx';
import { useProgress } from '../../lib/store.jsx';
import { valuesEqual } from '../../lib/util.js';

const GROUPS = [['(none)', ''], ['Sales[Region]', 'Sales.Region'], ['Sales[Category]', 'Sales.Category'], ['Sales[Year]', 'Sales.Year'], ['Sales[State]', 'Sales.State'], ['Products[Category]', 'Products.Category']];
const SLICERS = [['(none)', ''], ['Sales[Year]', 'Sales.Year'], ['Sales[Region]', 'Sales.Region'], ['Sales[Category]', 'Sales.Category']];

const show = v => v === null || v === undefined ? '(blank)' : typeof v === 'number' ? (Number.isFinite(v) ? (Math.abs(v) < 10 && v % 1 ? Math.round(v * 10000) / 10000 : Math.round(v * 100) / 100) : 'Infinity') : typeof v === 'boolean' ? String(v).toUpperCase() : v && v.__table ? `[table: ${v.rows.length} rows]` : String(v);

/** DAX lab: write measures, see them evaluated as a Power BI visual would: per group, under a slicer. */
export default function DaxLab({ title = 'DAX practice', task, starter = '', expect, groupBy = '', hint, solution, labKey, inline }) {
  const { completeLab } = useProgress();
  const engine = useMemo(() => createEngine(DAX_TABLES(), DAX_RELATIONS), []);
  const [code, setCode] = useState(starter); const [group, setGroup] = useState(groupBy);
  const [slicer, setSlicer] = useState(''); const [slicerVal, setSlicerVal] = useState('');
  const [out, setOut] = useState(null); const [verdict, setVerdict] = useState(null); const [tab, setTab] = useState('Sales');

  const slicerValues = slicer ? engine.distinct(...slicer.split('.')).sort() : [];
  const layersFor = g => {
    const layers = { slicer: [], visual: [] };
    if (slicer && slicerVal) { const [t, c] = slicer.split('.'); const raw = engine.distinct(t, c).find(x => String(x) === slicerVal); layers.slicer.push({ table: t, col: c, values: [raw] }); }
    if (g) { const [t, c] = group.split('.'); layers.visual.push({ table: t, col: c, values: [g.v] }); }
    return layers;
  };
  const evalAll = () => {
    const res = engine.load(code);
    const names = [...res.measures]; const exprs = res.exprs;
    const groups = group ? engine.distinct(...group.split('.')).sort().map(v => ({ v })) : [null];
    const cols = [group ? group.replace('.', '[') + ']' : 'Total', ...names, ...exprs.map(() => 'Result')];
    const rows = groups.map(g => [g ? g.v : 'All rows', ...names.map(n => { try { return show(engine.evaluate(n, layersFor(g))); } catch (e) { return '⚠ ' + e.message; } }), ...exprs.map(x => { try { return show(engine.evaluate(x, layersFor(g))); } catch (e) { return '⚠ ' + e.message; } })]);
    return { res, names, cols, rows };
  };
  const run = () => {
    setVerdict(null);
    try { const r = evalAll(); setOut(r); if (!task && !r.res.errors.length && (r.names.length || r.res.exprs.length)) completeLab(labKey); }
    catch (e) { setOut({ res: { errors: [e.message], measures: [], columns: [], tables: [] }, names: [], cols: [], rows: [] }); }
  };
  const check = () => {
    try {
      const res = engine.load(code);
      if (res.errors.length) { setVerdict({ ok: false, text: 'Error: ' + res.errors[0] }); return; }
      const target = res.measures[res.measures.length - 1] || null; const x = res.exprs[res.exprs.length - 1];
      const v = target ? engine.evaluate(target, { slicer: [], visual: [] }) : x ? engine.evaluate(x, { slicer: [], visual: [] }) : undefined;
      if (v === undefined) { setVerdict({ ok: false, text: 'Define a measure first, for example  Total = SUM(Sales[SalesAmount])' }); return; }
      const ok = valuesEqual(typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v, expect);
      setVerdict(ok ? { ok: true, text: `✔ Correct! Your measure returns ${show(v)}.` } : { ok: false, text: `Not yet. Your last measure returns ${show(v)} but the expected value is ${show(expect)}.` });
      if (ok) completeLab(labKey);
    } catch (e) { setVerdict({ ok: false, text: e.message }); }
  };
  const t = engine.model.tables[tab] || engine.model.tables.Sales;

  return (
    <LabShell type="dax" title={title} task={task} hint={hint} solutionText={solution} labKey={labKey} verdict={verdict}
      actions={<>
        <button className="btn sm" onClick={run}><Play size={14} /> Evaluate</button>
        {task && expect !== undefined && <button className="btn sm lime" onClick={check}><CheckCheck size={14} /> Check answer</button>}
        <label className="field" style={{ margin: 0 }}>Rows <select value={group} onChange={e => setGroup(e.target.value)} aria-label="Group rows by">{GROUPS.map(([l, v]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label className="field" style={{ margin: 0 }}>Slicer <select value={slicer} onChange={e => { setSlicer(e.target.value); setSlicerVal(''); }} aria-label="Slicer column">{SLICERS.map(([l, v]) => <option key={v} value={v}>{l}</option>)}</select>
          {slicer && <select value={slicerVal} onChange={e => setSlicerVal(e.target.value)} aria-label="Slicer value"><option value="">All</option>{slicerValues.map(v => <option key={v}>{String(v)}</option>)}</select>}</label>
      </>}>
      <Editor value={code} onChange={setCode} onRun={run} rows={Math.min(16, Math.max(5, code.split('\n').length + 1))} label="DAX editor" />
      <details className="schema"><summary>Data model: {Object.keys(engine.model.tables).join(', ')}</summary>
        <div className="chips" role="tablist" style={{ margin: '6px 0' }}>{Object.keys(engine.model.tables).map(n => <button key={n} role="tab" aria-selected={tab === n} className={'chip' + (tab === n ? ' on' : '')} onClick={() => setTab(n)}>{n}</button>)}</div>
        <div className="muted">Relationship: Sales[Product] → Products[ProductName]. Names ignore case, spaces and underscores, so <code>sales[sales_amount]</code> = <code>Sales[SalesAmount]</code>.</div>
        <DataTable cols={t.cols} rows={t.rows.slice(0, 8).map(r => t.cols.map(c => r[c]))} max={8} /></details>
      {out && <div className="out" aria-live="polite">
        {out.res.errors.map((e, i) => <pre key={i} className="err">⚠ {e}</pre>)}
        {out.res.columns.length > 0 && <pre className="info">Calculated column(s) added: {out.res.columns.join(', ')}</pre>}
        {out.res.tables.length > 0 && <pre className="info">Calculated table(s) created: {out.res.tables.join(', ')} ({out.res.tables.map(n => engine.model.tables[n].rows.length + ' rows').join(', ')})</pre>}
        {out.cols.length > 1 && <DataTable cols={out.cols} rows={out.rows} />}
        {!out.res.errors.length && out.cols.length <= 1 && !out.res.columns.length && !out.res.tables.length && <pre className="info">Define a measure like  <b>Total Sales = SUM(Sales[SalesAmount])</b> then press Evaluate. Separate definitions with a blank line or start each on a new unindented line.</pre>}
      </div>}
      {!inline && <div className="muted" style={{ marginTop: 6 }}>A small DAX engine written for this course. It supports the functions in the book (aggregations, X-iterators, FILTER, CALCULATE, ALL / ALLEXCEPT / ALLSELECTED, KEEPFILTERS, LOOKUPVALUE, VAR/RETURN, date and text functions). Time-intelligence (DATESYTD, SAMEPERIODLASTYEAR…) needs real Power BI.</div>}
    </LabShell>
  );
}
