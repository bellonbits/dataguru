import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCheck, RotateCcw } from 'lucide-react';
import LabShell from './LabShell.jsx';
import { Sheet, colName, parseRef } from '../../lib/sheet.js';
import { useProgress } from '../../lib/store.jsx';
import { valuesEqual } from '../../lib/util.js';

/**
 * Spreadsheet lab. spec: {sheet: 2D array (strings starting with "=" are formulas), rows, cols,
 *   checks: [{cell:'F2', expect: value}], solution: 'F2: =SUM(A1:A5)', locked: ['A1', ...]}
 */
export default function ExcelLab({ title = 'Spreadsheet practice', task, sheet = [], rows, cols, checks, solution, hint, labKey, inline }) {
  const { completeLab } = useProgress();
  const make = () => new Sheet(sheet, rows, cols);
  const sh = useRef(null); if (!sh.current) sh.current = make();
  const [, bump] = useState(0); const [sel, setSel] = useState({ r: 0, c: 0 }); const [editing, setEditing] = useState(null);
  const [verdict, setVerdict] = useState(null);
  useEffect(() => () => sh.current?.destroy(), []);
  const S = sh.current;
  const targets = useMemo(() => new Set((checks || []).map(c => c.cell.toUpperCase())), [checks]);

  const commit = (r, c, v) => { S.set(r, c, v); setEditing(null); bump(x => x + 1); if (!task && String(v).startsWith('=') && !S.value(r, c)?.error) completeLab(labKey); };
  const reset = () => { S.destroy(); sh.current = make(); setVerdict(null); bump(x => x + 1); };
  const check = () => {
    const bad = [];
    for (const c of checks) {
      const p = parseRef(c.cell); const v = S.value(p.row, p.col);
      const raw = S.raw[p.row][p.col];
      if (v && v.error) bad.push(`${c.cell} shows ${v.error}`);
      else if (!String(raw).startsWith('=')) bad.push(`${c.cell} should be a formula (start with =), not a typed value`);
      else if (!valuesEqual(v, c.expect)) bad.push(`${c.cell} gives ${JSON.stringify(v)} but should give ${JSON.stringify(c.expect)}`);
    }
    if (!bad.length) { setVerdict({ ok: true, text: '✔ Correct! Every checked cell has the right formula result.' }); completeLab(labKey); }
    else setVerdict({ ok: false, text: 'Not yet: ' + bad.join('; ') });
  };

  const raw = S.raw[sel.r]?.[sel.c] ?? '';
  return (
    <LabShell type="excel" title={title} task={task} hint={hint} solutionText={solution} labKey={labKey} verdict={verdict}
      actions={<>
        {task && checks && <button className="btn sm lime" onClick={check}><CheckCheck size={14} /> Check answer</button>}
        <button className="btn sm ghost" onClick={reset}><RotateCcw size={14} /> Reset sheet</button>
      </>}>
      <div className="fbar"><span className="cell-ref">{colName(sel.c)}{sel.r + 1}</span><span className="fx">fx</span>
        <input aria-label="Formula bar" value={editing && editing.r === sel.r && editing.c === sel.c ? editing.v : String(raw)}
          onChange={e => setEditing({ r: sel.r, c: sel.c, v: e.target.value })}
          onKeyDown={e => { if (e.key === 'Enter') commit(sel.r, sel.c, e.target.value); }} onBlur={e => { if (editing) commit(sel.r, sel.c, e.target.value); }} /></div>
      <div className="sheet-wrap"><table className="sheet" role="grid" aria-label="Spreadsheet">
        <thead><tr><th className="rh" />{Array.from({ length: S.cols }, (_, c) => <th key={c}>{colName(c)}</th>)}</tr></thead>
        <tbody>{Array.from({ length: S.rows }, (_, r) => <tr key={r}><th className="rh">{r + 1}</th>{Array.from({ length: S.cols }, (_, c) => {
          const ref = colName(c) + (r + 1); const v = S.value(r, c); const isEdit = editing && editing.r === r && editing.c === c;
          const cls = [v && v.error ? 'err' : '', targets.has(ref) ? 'target' : '', typeof v === 'number' ? 'num' : ''].join(' ');
          return <td key={c} className={cls}>
            <input aria-label={ref} value={isEdit ? editing.v : S.display(r, c)}
              onFocus={() => { setSel({ r, c }); setEditing({ r, c, v: String(S.raw[r][c]) }); }}
              onChange={e => setEditing({ r, c, v: e.target.value })}
              onBlur={e => { if (editing && editing.r === r && editing.c === c) commit(r, c, e.target.value); }}
              onKeyDown={e => {
                if (e.key === 'Enter') { commit(r, c, e.target.value); const n = document.querySelector(`[aria-label="${colName(c)}${r + 2}"]`); n?.focus(); }
                if (e.key === 'Escape') { setEditing(null); e.target.blur(); }
              }} /></td>;
        })}</tr>)}</tbody></table></div>
      {!inline && <div className="muted" style={{ marginTop: 6 }}>Type values or formulas (start with =) into any cell. Highlighted cells are the ones checked. XLOOKUP and AVERAGEIFS are emulated; UNIQUE (dynamic arrays) is not available.</div>}
    </LabShell>
  );
}
