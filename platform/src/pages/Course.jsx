import { Link, useParams, Navigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { courseById } from '../content/courses.js';
import { useProgress } from '../lib/store.jsx';
import { SubjectArt } from '../components/Art.jsx';

export default function Course() {
  const { course: id } = useParams(); const c = courseById(id); const { state, pct, courseProgress } = useProgress();
  if (!c) return <Navigate to="/subjects" replace />;
  const p = courseProgress.find(x => x.id === c.id);
  const next = c.chapters.find(ch => !state.chapters[ch.key]) || c.chapters[0];
  const labs = c.chapters.reduce((a, ch) => a + ch.labs.length, 0);
  return (
    <>
      <div className="crumbs"><Link to="/subjects">Subjects</Link> / <span>{c.title}</span></div>
      <div className="page-head" style={{ '--accent-c': c.color }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: c.tint, borderRadius: 26, padding: 12 }}><SubjectArt id={c.id} size={92} /></div>
          <div><h1>{c.title}</h1><p>{c.about}</p></div>
        </div>
        <Link className="btn" to={`/subjects/${c.id}/${next.id}`}>{p.done ? 'Continue' : 'Start'} <ChevronRight size={18} /></Link>
      </div>
      <div className="stat-row"><div className="stat"><b>{p.pct}%</b><span>complete</span></div><div className="stat"><b>{p.done}/{p.total}</b><span>lessons done</span></div><div className="stat"><b>{labs}</b><span>hands-on labs</span></div><div className="stat"><b>{c.chapters.reduce((a, x) => a + x.minutes, 0)} min</b><span>reading time</span></div></div>
      <div className="row-list" style={{ '--accent-c': c.color }}>
        {c.chapters.map((ch, i) => {
          const done = !!state.chapters[ch.key]; const pc = pct(ch);
          return (
            <Link key={ch.key} to={`/subjects/${c.id}/${ch.id}`} className={'ch-row' + (done ? ' done' : '')}>
              <span className="ch-num">{done ? <CheckCircle2 size={20} /> : i + 1}</span>
              <span className="t"><b>{ch.title}</b><small>{ch.minutes} min read · {ch.labs.length} lab{ch.labs.length !== 1 ? 's' : ''} · {ch.quiz.length} quiz Qs</small></span>
              {!done && pc > 0 && <span className="tag">{pc}%</span>}
              {!done && pc === 0 && <Circle size={18} className="muted" />}
              <ChevronRight size={18} className="muted" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
