import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { COURSES, ALL_TASKS } from '../content/courses.js';
import { useProgress } from '../lib/store.jsx';

export default function Assignments() {
  const { state } = useProgress(); const done = ALL_TASKS.filter(t => state.labs[t.key]).length;
  const quizzes = COURSES.flatMap(c => c.chapters.filter(ch => ch.quiz.length).map(ch => ({ ch, c })));
  return (
    <>
      <div className="page-head"><div><h1>Assignments</h1><p>Graded exercises: each one checks your answer automatically. Open an assignment to work on it inside its lesson.</p></div></div>
      <div className="stat-row"><div className="stat"><b>{done}/{ALL_TASKS.length}</b><span>assignments passed</span></div><div className="stat"><b>{Object.keys(state.quiz).length}/{quizzes.length}</b><span>quizzes attempted</span></div></div>
      {COURSES.map(c => {
        const tasks = ALL_TASKS.filter(t => t.chapter.course === c.id); if (!tasks.length) return null;
        return (
          <section key={c.id} style={{ marginBottom: 22 }}><h2 className="section-title" style={{ marginBottom: 10 }}>{c.title} <small>{tasks.filter(t => state.labs[t.key]).length}/{tasks.length} passed</small></h2>
            <div className="row-list">{tasks.map(t => {
              const ok = !!state.labs[t.key];
              return <Link key={t.key} to={`/subjects/${t.chapter.course}/${t.chapter.id}#practice`} className={'ch-row' + (ok ? ' done' : '')}>
                <span className="ch-num">{ok ? <CheckCircle2 size={20} /> : <Circle size={18} />}</span>
                <span className="t"><b>{t.title}</b><small>{t.chapter.title} · {t.type.toUpperCase()}</small></span><ChevronRight size={18} className="muted" /></Link>;
            })}</div></section>
        );
      })}
    </>
  );
}
