import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { courseById, neighbours } from '../content/courses.js';
import { Ring } from '../components/Art.jsx';
import { useProgress } from '../lib/store.jsx';
import Markdown from '../components/Markdown.jsx';
import Quiz from '../components/Quiz.jsx';
import Lab from '../components/labs/Lab.jsx';

export default function Lesson() {
  const { course: cid, chapter: chid } = useParams(); const c = courseById(cid);
  const ch = c && c.chapters.find(x => x.id === chid);
  const { state, open, toggleChapter, setNote, pct } = useProgress();
  const [note, setNoteTxt] = useState('');
  useEffect(() => { if (ch) { open(ch.key); setNoteTxt(state.notes[ch.key] || ''); } }, [ch?.key]); // eslint-disable-line
  if (!c || !ch) return <Navigate to={c ? `/subjects/${c.id}` : '/subjects'} replace />;
  const done = !!state.chapters[ch.key]; const { prev, next } = neighbours(ch.key);
  const doneLabs = ch.labs.filter(l => state.labs[l.key]).length; const qz = state.quiz[ch.key];
  return (
    <div className="lesson-wrap"><div className="lesson">
      <div className="crumbs"><Link to="/subjects">Subjects</Link> / <Link to={`/subjects/${c.id}`}>{c.title}</Link> / <span>{ch.title}</span></div>
      <div className="page-head" style={{ margin: '6px 0 0' }}>
        <div><h1>{ch.title}</h1><p>{ch.minutes} min read · {ch.labs.length} hands-on lab{ch.labs.length !== 1 ? 's' : ''} · {ch.quiz.length}-question quiz</p></div>
        <button className={'btn' + (done ? ' lime' : '')} aria-pressed={done} onClick={() => toggleChapter(ch.key, !done)}>{done ? <><CheckCircle2 size={18} /> Completed</> : <><Circle size={18} /> Mark complete</>}</button>
      </div>
      <nav className="jump" aria-label="On this page"><a href="#notes">Notes</a>{ch.labs.length > 0 && <a href="#practice">Practice ({ch.labs.length})</a>}{ch.quiz.length > 0 && <a href="#quiz">Quiz</a>}<a href="#mynotes">My notes</a></nav>
      <section id="notes" aria-label="Notes"><div className="prose"><Markdown md={ch.md} course={c.id} chapterKey={ch.key} /></div></section>
      {ch.labs.length > 0 && <section id="practice" aria-labelledby="h-prac" style={{ display: 'grid', gap: 14 }}><h2 id="h-prac" className="section-title">Practice <small>runs in your browser, nothing to install</small></h2>
        {ch.labs.map(l => <Lab key={l.key} spec={l} labKey={l.key} course={c.id} />)}</section>}
      {ch.quiz.length > 0 && <section id="quiz" aria-labelledby="h-quiz"><h2 id="h-quiz" className="section-title" style={{ marginBottom: 10 }}>Check your understanding</h2><Quiz quizKey={ch.key} items={ch.quiz} /></section>}
      <section id="mynotes" className="notes-box"><h2 className="section-title" style={{ marginBottom: 10 }}>My notes <small>saved in this browser</small></h2>
        <textarea aria-label="My notes for this lesson" value={note} placeholder="Write what you want to remember…" onChange={e => { setNoteTxt(e.target.value); setNote(ch.key, e.target.value); }} /></section>
      <div className="pager">{prev ? <Link to={`/subjects/${prev.course}/${prev.id}`}><small><ChevronLeft size={14} /> Previous</small>{prev.title}</Link> : <span />}
        {next && <Link className="next" to={`/subjects/${next.course}/${next.id}`}><small>Next <ChevronRight size={14} /></small>{next.title}</Link>}</div>
    </div>
    <aside className="rail" aria-label="Lesson sidebar">
      <section className="panel"><h3>Your progress</h3><div className="rail-stat"><Ring pct={pct(ch)} size={64} stroke={6} color={c.color} /><div><b>{done ? 'Lesson complete' : 'In progress'}</b><small>{doneLabs}/{ch.labs.length} labs · {qz ? `quiz ${qz.score}/${qz.total}` : 'quiz not taken'}</small></div></div></section>
      <section className="panel"><h3>On this page</h3><ul className="toc"><li><a href="#notes">Notes <small className="muted">{ch.minutes} min</small></a></li>{ch.labs.length > 0 && <li><a href="#practice">Practice <small className="muted">{doneLabs}/{ch.labs.length}</small></a></li>}{ch.quiz.length > 0 && <li><a href="#quiz">Quiz <small className="muted">{ch.quiz.length} Qs</small></a></li>}<li><a href="#mynotes">My notes</a></li></ul></section>
      <section className="panel"><h3>In {c.title}</h3><ul className="toc">{c.chapters.map(x => <li key={x.key}><Link to={`/subjects/${c.id}/${x.id}`} style={x.id === ch.id ? { background: 'var(--lime)', color: 'var(--lime-ink)', fontWeight: 600 } : undefined}><span>{x.title}</span>{state.chapters[x.key] && <CheckCircle2 size={14} />}</Link></li>)}</ul></section>
      {next && <Link className="next-card" to={`/subjects/${next.course}/${next.id}`}><small>Up next</small><b>{next.title}</b></Link>}
    </aside></div>
  );
}
