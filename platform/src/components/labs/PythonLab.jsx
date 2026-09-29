import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, CheckCheck } from 'lucide-react';
import LabShell, { Editor } from './LabShell.jsx';
import { runPython, newNamespace } from '../../lib/pyrun.js';
import { useProgress } from '../../lib/store.jsx';

export default function PythonLab({ title = 'Python practice', task, starter = '', check, expect, solution, hint, labKey, inline }) {
  const { completeLab } = useProgress();
  const [code, setCode] = useState(starter); const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  const [res, setRes] = useState(null); const [verdict, setVerdict] = useState(null); const nsRef = useRef(null);
  useEffect(() => () => { try { nsRef.current?.destroy?.(); } catch (e) { /* ignore */ } }, []);

  const exec = async (src, fresh) => {
    if (fresh && nsRef.current) { try { nsRef.current.destroy(); } catch (e) { /* ignore */ } nsRef.current = null; }
    if (!nsRef.current) nsRef.current = await newNamespace(setStatus);
    return runPython(src, nsRef.current, setStatus);
  };
  const run = async () => {
    setBusy(true); setVerdict(null);
    try { const r = await exec(code, false); setRes(r); if (!task && !r.error) completeLab(labKey); }
    catch (e) { setRes({ error: e.message, stdout: '', figures: [] }); }
    setBusy(false);
  };
  const reset = () => { try { nsRef.current?.destroy?.(); } catch (e) { /* ignore */ } nsRef.current = null; setRes(null); setVerdict(null); };
  const verify = async () => {
    setBusy(true);
    try {
      const r = await exec(code, true); setRes(r);
      if (r.error) { setVerdict({ ok: false, text: 'Your code raised an error. Fix it and check again.' }); setBusy(false); return; }
      let ok = true, why = '';
      if (expect !== undefined) { ok = r.stdout.trim() === String(expect).trim(); if (!ok) why = `Expected output:\n${expect}`; }
      if (ok && check) {
        const c = await runPython(`try:\n${check.split('\n').map(l => '    ' + l).join('\n')}\n    __dg_ok = ''\nexcept AssertionError as _e:\n    __dg_ok = str(_e) or 'A check failed'\nprint('@@' + __dg_ok)`, nsRef.current, setStatus);
        const m = /@@(.*)/.exec(c.stdout); if (c.error) { ok = false; why = c.error; } else if (m && m[1]) { ok = false; why = m[1]; }
      }
      setVerdict(ok ? { ok: true, text: '✔ Correct! Your code passes the checks.' } : { ok: false, text: 'Not yet. ' + why });
      if (ok) completeLab(labKey);
    } catch (e) { setVerdict({ ok: false, text: e.message }); }
    setBusy(false);
  };

  return (
    <LabShell type="python" title={title} task={task} hint={hint} solutionText={solution} labKey={labKey} verdict={verdict}
      actions={<>
        <button className="btn sm" onClick={run} disabled={busy}><Play size={14} /> Run</button>
        {task && (check || expect !== undefined) && <button className="btn sm lime" onClick={verify} disabled={busy}><CheckCheck size={14} /> Check answer</button>}
        <button className="btn sm ghost" onClick={reset} disabled={busy}><RotateCcw size={14} /> Reset session</button>
        {status && <span className="muted"><span className="spinner" />{status}</span>}
      </>}>
      <Editor value={code} onChange={setCode} onRun={run} rows={Math.min(18, Math.max(5, code.split('\n').length + 1))} label="Python editor" />
      {res && <div className="out" aria-live="polite">
        {res.stdout && <pre>{res.stdout}</pre>}
        {res.error && <pre className="err">{res.error}</pre>}
        {!res.stdout && !res.error && !res.figures.length && <pre className="info">(no output. Use print() to see values.)</pre>}
        {res.figures.map((f, i) => <img key={i} src={'data:image/png;base64,' + f} alt={`Plot ${i + 1}`} />)}
      </div>}
      {!inline && <div className="muted" style={{ marginTop: 6 }}>Real CPython (Pyodide) running in your browser with NumPy, pandas and Matplotlib. Variables persist between runs; sample files <code>data.csv</code>, <code>data.json</code> and <code>database.db</code> are available. Ctrl/⌘+Enter runs.</div>}
    </LabShell>
  );
}
