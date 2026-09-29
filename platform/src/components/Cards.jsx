import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, Clock } from 'lucide-react';
import { SubjectArt, Ring, Thumb, BadgeArt, BADGE_GLYPH } from './Art.jsx';
import { useProgress } from '../lib/store.jsx';
import { courseById } from '../content/courses.js';

export const GLYPH = { excel: 'fx', powerbi: 'DAX', sql: 'SQL', python: 'py', ds: 'ML' };

export function SubjectCard({ course }) {
  const { courseProgress } = useProgress();
  const p = courseProgress.find(c => c.id === course.id);
  return (
    <Link to={`/subjects/${course.id}`} className="subject-card" style={{ '--tint': course.tint, '--accent-c': course.color }}>
      <div className="art"><SubjectArt id={course.id} size={92} /></div>
      <h4>{course.title}</h4>
      <div className="meta"><span>{course.chapters.length} lessons</span><span className="go"><ArrowUpRight size={16} /></span></div>
      <div className="mini-bar" aria-label={`${p.pct}% complete`}><i style={{ width: p.pct + '%' }} /></div>
    </Link>
  );
}

export function ContinueCard({ chapter }) {
  const { pct } = useProgress(); const c = courseById(chapter.course); const p = pct(chapter);
  return (
    <Link to={`/subjects/${chapter.course}/${chapter.id}`} className="continue-card">
      <div className="top"><span className="glyph" style={{ background: c.tint, color: c.color }}>{GLYPH[c.id]}</span><Ring pct={p} color={c.color} /></div>
      <h4>{chapter.title}</h4>
      <p>{c.title} · {chapter.labs.length ? `${chapter.labs.length} lab${chapter.labs.length > 1 ? 's' : ''}` : 'Reading'} · {chapter.minutes} min</p>
    </Link>
  );
}

export function RecommendCard({ chapter, seed }) {
  const c = courseById(chapter.course);
  return (
    <Link to={`/subjects/${chapter.course}/${chapter.id}`} className="rec-card">
      <Thumb seed={seed} glyph={GLYPH[c.id]} minutes={chapter.minutes} />
      <h4>{chapter.title}</h4>
      <div className="meta"><span>{c.title}</span><span className="chip-lab"><Zap size={13} /> {chapter.labs.length} labs · {chapter.quiz.length} Qs</span></div>
    </Link>
  );
}

export function BadgeTile({ badge }) {
  return (
    <div className={'badge-tile' + (badge.earned ? '' : ' locked')} title={badge.desc}>
      <BadgeArt tone={badge.tone} glyph={BADGE_GLYPH[badge.id]} locked={!badge.earned} />
      <span>{badge.title}</span>
    </div>
  );
}

export function StudyRow({ chapter, when }) {
  const c = courseById(chapter.course);
  return (
    <tr>
      <td><div className="cls"><span className="glyph sm" style={{ background: c.tint, color: c.color }}>{GLYPH[c.id]}</span><div><b>{chapter.title}</b><small>{c.title}</small></div></div></td>
      <td className="det">{chapter.labs.length} lab{chapter.labs.length !== 1 ? 's' : ''} · {chapter.quiz.length} quiz Qs</td>
      <td><Clock size={14} aria-hidden="true" /> {when}</td>
      <td><Link className="pill-btn" to={`/subjects/${chapter.course}/${chapter.id}`}>Start</Link></td>
    </tr>
  );
}
