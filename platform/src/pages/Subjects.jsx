import { Link } from 'react-router-dom';
import { COURSES } from '../content/courses.js';
import { useProgress } from '../lib/store.jsx';
import { SubjectArt } from '../components/Art.jsx';

export default function Subjects() {
  const { courseProgress } = useProgress();
  return (
    <>
      <div className="page-head"><div><h1>Subjects</h1><p>Five learning paths built from <i>Data Analysis Made Easy</i>, each with notes, live labs and quizzes.</p></div></div>
      <div className="grid">
        {COURSES.map(c => {
          const p = courseProgress.find(x => x.id === c.id); const labs = c.chapters.reduce((a, ch) => a + ch.labs.length, 0);
          return (
            <Link key={c.id} to={`/subjects/${c.id}`} className="course-card" style={{ '--tint': c.tint, '--accent-c': c.color }}>
              <div className="art"><SubjectArt id={c.id} size={110} /></div>
              <div className="tags"><span className="tag">{c.level}</span><span className="tag">{c.pages}</span></div>
              <h3>{c.title}</h3><p>{c.tagline}</p>
              <div className="tags"><span className="tag">{c.chapters.length} lessons</span><span className="tag">{labs} labs</span><span className="tag">{c.chapters.reduce((a, ch) => a + ch.quiz.length, 0)} quiz Qs</span></div>
              <div className="bar" aria-label={`${p.pct}% complete`}><i style={{ width: p.pct + '%' }} /></div>
              <small className="muted">{p.done} of {p.total} lessons complete · {p.pct}%</small>
            </Link>
          );
        })}
      </div>
    </>
  );
}
