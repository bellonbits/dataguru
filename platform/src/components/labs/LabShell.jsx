import { useState } from 'react';
import { CheckCircle2, Lightbulb, Eye } from 'lucide-react';
import { useProgress } from '../../lib/store.jsx';

const LABEL = { sql: 'SQL', python: 'Python', excel: 'Excel', dax: 'DAX', widget: 'Interactive' };
const COLOR = { sql: '#2f62e0', python: '#7c45d0', excel: '#1f8a4c', dax: '#c98a00', widget: '#d4560f' };

/** Common lab frame: title, task, hint/solution reveal, verdict and completion badge. */
export default function LabShell({ type, title, task, hint, solutionText, labKey, verdict, children, actions }) {
  const { state } = useProgress();
  const [showHint, setHint] = useState(false); const [showSol, setSol] = useState(false);
  const done = !!state.labs[labKey];
  return (
    <div className="lab" style={{ '--lc': COLOR[type] }}>
      <div className="lab-head"><span className="lab-badge">{LABEL[type]}</span><h4>{title}</h4>{done && <span className="lab-done"><CheckCircle2 size={16} /> Completed</span>}</div>
      {task && <div className="task"><b>Your task:</b> {task}</div>}
      {children}
      <div className="lab-actions">{actions}
        {hint && <button className="btn sm ghost" onClick={() => setHint(h => !h)}><Lightbulb size={14} /> Hint</button>}
        {solutionText && <button className="btn sm ghost" onClick={() => setSol(s => !s)}><Eye size={14} /> {showSol ? 'Hide' : 'Show'} solution</button>}
      </div>
      {showHint && <div className="hint">💡 {hint}</div>}
      {showSol && <div className="out"><pre>{solutionText}</pre></div>}
      {verdict && <div className={'verdict ' + (verdict.ok ? 'ok' : 'bad')} role="status">{verdict.text}</div>}
    </div>
  );
}
export function Editor({ value, onChange, onRun, rows = 6, label = 'Code editor' }) {
  return (
    <textarea className="editor" aria-label={label} placeholder="Write your answer here, then press Run (Ctrl/⌘+Enter)…" value={value} spellCheck={false} rows={rows}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); onRun?.(); }
        if (e.key === 'Tab') { e.preventDefault(); const t = e.target, s = t.selectionStart; onChange(value.slice(0, s) + '    ' + value.slice(t.selectionEnd)); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 4; }); }
      }} />
  );
}
