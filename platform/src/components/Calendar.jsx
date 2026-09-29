import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '../lib/store.jsx';
import { todayKey } from '../lib/util.js';

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function Calendar() {
  const { state } = useProgress();
  const [cur, setCur] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const cells = useMemo(() => {
    const start = new Date(cur); start.setDate(1 - start.getDay());
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [cur]);
  const today = todayKey();
  const shift = n => setCur(new Date(cur.getFullYear(), cur.getMonth() + n, 1));
  return (
    <section className="panel cal" aria-label="Study calendar">
      <div className="panel-head"><h3>Calendar</h3><Link to="/achievements" className="round-btn dark" aria-label="Open progress"><ArrowUpRight size={18} /></Link></div>
      <div className="cal-nav">
        <button className="circle-btn sm" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={16} /></button>
        <span className="month">{cur.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</span>
        <button className="circle-btn sm" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      <div className="cal-grid" role="grid">
        {DOW.map(d => <div key={d} className="dow" role="columnheader">{d}</div>)}
        {cells.map(d => {
          const k = todayKey(d); const n = state.activity[k] || 0; const out = d.getMonth() !== cur.getMonth();
          return <div key={k} role="gridcell" title={n ? `${n} study points` : ''} className={'day' + (out ? ' out' : '') + (k === today ? ' today' : '') + (n ? ' studied' : '')} aria-current={k === today ? 'date' : undefined}>{String(d.getDate()).padStart(2, '0')}{n > 0 && k !== today && <i />}</div>;
        })}
      </div>
    </section>
  );
}
