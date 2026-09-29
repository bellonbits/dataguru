import { CheckCircle2 } from 'lucide-react';
import { useProgress } from '../../../lib/store.jsx';
/** Shared card for widgets. Call `done()` when the learner has meaningfully used it. */
export function useFrame(labKey) {
  const { state, completeLab } = useProgress();
  return { finished: !!state.labs[labKey], done: () => completeLab(labKey) };
}
export default function Frame({ title, desc, finished, children, verdict }) {
  return (
    <div className="lab widget" style={{ '--lc': '#d4560f' }}>
      <div className="lab-head"><span className="lab-badge">Interactive</span><h4>{title}</h4>{finished && <span className="lab-done"><CheckCircle2 size={16} /> Completed</span>}</div>
      {desc && <p className="muted" style={{ margin: '6px 0 10px' }}>{desc}</p>}
      {children}
      {verdict && <div className={'verdict ' + (verdict.ok ? 'ok' : 'bad')} role="status">{verdict.text}</div>}
    </div>
  );
}
