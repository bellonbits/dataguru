import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Plus, Flame } from 'lucide-react';
import { useProgress } from '../lib/store.jsx';
import { COURSES, ALL_CHAPTERS } from '../content/courses.js';
import { SubjectCard, ContinueCard, RecommendCard, BadgeTile, StudyRow } from '../components/Cards.jsx';
import Calendar from '../components/Calendar.jsx';
import { Gauge } from '../components/Art.jsx';

export default function Dashboard() {
  const { state, streak, badges, overall, pct, weekPoints, chaptersDone, labsDone, totalLabs } = useProgress();
  const nav = useNavigate();
  const [range, setRange] = useState('all');
  const [focus, setFocus] = useState(false);

  const inProgress = useMemo(() => ALL_CHAPTERS.filter(c => state.opened[c.key] && !state.chapters[c.key]).sort((a, b) => state.opened[b.key] - state.opened[a.key]), [state]);
  const unfinished = useMemo(() => ALL_CHAPTERS.filter(c => !state.chapters[c.key] && c.id !== 'overview'), [state]);
  const cont = [...inProgress, ...unfinished.filter(c => !inProgress.includes(c))].slice(0, 3);
  const recommended = useMemo(() => {
    const seen = new Set(cont.map(c => c.key)); const out = [];
    // one next lesson per course, favouring those with labs, then fill up
    for (const co of [...COURSES].sort((a, b) => (state.opened[b.chapters[0]?.key] ? 0 : 1) - (state.opened[a.chapters[0]?.key] ? 0 : 1))) {
      const next = co.chapters.find(c => !state.chapters[c.key] && !seen.has(c.key) && c.labs.length);
      if (next) { out.push(next); seen.add(next.key); }
    }
    for (const c of unfinished) { if (out.length >= 4) break; if (!seen.has(c.key)) { out.push(c); seen.add(c.key); } }
    return out.slice(0, 4);
  }, [state]); // eslint-disable-line
  const plan = unfinished.slice(0, 4);
  const slots = ['Today · 6:00 PM', 'Tomorrow · 6:00 PM', 'In 2 days · 6:00 PM', 'In 3 days · 6:00 PM'];
  const goalPct = Math.min(100, Math.round((weekPoints / (state.profile.goal * 5)) * 100));
  const first = state.profile.name.split(' ')[0];
  const primary = cont[0];

  return (
    <div className="dash">
      <div className="dash-main">
        <div className="greet">
          <div>
            <h1>Hi, {first}! <span className="wave" aria-hidden="true">👋</span>{' '}
              <span className="pro-pill"><Flame size={16} /> {streak > 0 ? `${streak}-day streak` : 'Start your streak'}</span></h1>
            <p className="sub">Let’s continue your learning journey today.</p>
          </div>
          <div className="greet-actions">
            <button className={'circle-btn lg' + (focus ? ' on' : '')} onClick={() => setFocus(f => !f)} aria-pressed={focus} aria-label="Focus mode: show only the next lesson"><SlidersHorizontal size={20} /></button>
            <button className="black-btn" onClick={() => primary && nav(`/subjects/${primary.course}/${primary.id}`)}><Plus size={20} /> {inProgress.length ? 'Continue Learning' : 'Start Learning'}</button>
          </div>
        </div>

        {!focus && <>
          <section aria-labelledby="h-explore"><div className="sec-head"><h2 id="h-explore">Explore Subjects</h2><Link to="/subjects">View all</Link></div>
            <div className="subject-row">{COURSES.map(c => <SubjectCard key={c.id} course={c} />)}</div></section>
        </>}

        <section aria-labelledby="h-cont"><div className="sec-head"><h2 id="h-cont">Continue Learning</h2><Link to="/subjects">View all</Link></div>
          <div className="cont-row">{(focus ? cont.slice(0, 1) : cont).map(c => <ContinueCard key={c.key} chapter={c} />)}</div></section>

        {!focus && <>
          <section aria-labelledby="h-rec"><div className="sec-head"><h2 id="h-rec">Recommended for You</h2><Link to="/library">View all</Link></div>
            <div className="rec-row">{recommended.map((c, i) => <RecommendCard key={c.key} chapter={c} seed={i + 1} />)}</div></section>

          <section className="panel plan" aria-labelledby="h-plan"><h2 id="h-plan">Your Study Plan</h2>
            <table><thead><tr><th>Lesson</th><th>Details</th><th>Time</th><th>Action</th></tr></thead>
              <tbody>{plan.map((c, i) => <StudyRow key={c.key} chapter={c} when={slots[i]} />)}</tbody></table>
          </section>
        </>}
      </div>

      <aside className="dash-side">
        <Calendar />
        <section className="panel" aria-labelledby="h-ach">
          <div className="sec-head tight"><h3 id="h-ach">Achievements</h3><Link to="/achievements">View all</Link></div>
          <div className="badge-row">{[...badges].sort((a, b) => b.earned - a.earned).slice(0, 3).map(b => <BadgeTile key={b.id} badge={b} />)}</div>
        </section>
        <section className="panel" aria-labelledby="h-prog">
          <div className="sec-head tight"><h3 id="h-prog">Learning progress</h3>
            <select value={range} onChange={e => setRange(e.target.value)} aria-label="Progress range" className="plain-select"><option value="all">All time</option><option value="week">The Week</option></select></div>
          <Gauge pct={range === 'all' ? overall : goalPct} label={range === 'all' ? 'Overall Progress' : 'Weekly goal'} />
          <div className="stat-mini">
            <span><b>{chaptersDone}</b> lessons done</span><span><b>{labsDone}/{totalLabs}</b> labs</span>
          </div>
        </section>
      </aside>
    </div>
  );
}
