import { useProgress } from '../lib/store.jsx';
import { COURSES } from '../content/courses.js';
import { BadgeArt, BADGE_GLYPH } from '../components/Art.jsx';
import { todayKey } from '../lib/util.js';

export default function Achievements() {
  const { state, badges, streak, courseProgress, chaptersDone, labsDone, totalLabs, overall } = useProgress();
  const weeks = 14; const days = []; const d = new Date(); d.setDate(d.getDate() - (weeks * 7 - 1) - d.getDay() + 6 - 6);
  for (let i = 0; i < weeks * 7; i++) { const dd = new Date(d); dd.setDate(d.getDate() + i); days.push(dd); }
  const quizzes = Object.values(state.quiz);
  const avgQuiz = quizzes.length ? Math.round((quizzes.reduce((a, q) => a + q.score / q.total, 0) / quizzes.length) * 100) : null;
  return (
    <>
      <div className="page-head"><div><h1>Achievements</h1><p>Badges unlock automatically as you learn. Nothing here can be faked: they are computed from your real activity.</p></div></div>
      <div className="stat-row"><div className="stat"><b>{streak}</b><span>day streak</span></div><div className="stat"><b>{overall}%</b><span>overall progress</span></div><div className="stat"><b>{chaptersDone}</b><span>lessons complete</span></div><div className="stat"><b>{labsDone}/{totalLabs}</b><span>labs completed</span></div><div className="stat"><b>{avgQuiz === null ? '–' : avgQuiz + '%'}</b><span>avg quiz score</span></div></div>
      <div className="ach-grid">{badges.map(b => <div key={b.id} className={'ach' + (b.earned ? '' : ' locked')}><BadgeArt tone={b.tone} glyph={BADGE_GLYPH[b.id]} size={92} locked={!b.earned} /><b>{b.title}</b><small>{b.desc}</small><small>{b.earned ? '✔ Unlocked' : '🔒 Locked'}</small></div>)}</div>
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>Study activity <small>last {weeks} weeks</small></h2>
      <div className="panel" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 16px)', gap: 4, width: 'max-content' }} role="img" aria-label="Study activity heat map">
          {days.map(x => { const n = state.activity[todayKey(x)] || 0; return <i key={+x} title={`${todayKey(x)}: ${n} points`} style={{ width: 16, height: 16, borderRadius: 4, background: n === 0 ? 'var(--card2)' : n < 4 ? '#d9f55c88' : n < 8 ? '#b3dc2e' : '#6fa100' }} />; })}
        </div>
      </div>
      <h2 className="section-title" style={{ margin: '28px 0 12px' }}>Subject progress</h2>
      <div className="panel">{COURSES.map(c => { const p = courseProgress.find(x => x.id === c.id); return <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 90px', gap: 14, alignItems: 'center', padding: '8px 0' }}><b>{c.title}</b><div className="bar" style={{ '--accent-c': c.color }}><i style={{ width: p.pct + '%' }} /></div><span className="muted">{p.done}/{p.total} · {p.pct}%</span></div>; })}</div>
    </>
  );
}
