import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Download, ExternalLink, RotateCcw } from 'lucide-react';
import { COURSES } from '../content/courses.js';
import { GLOSSARY } from '../content/glossary.js';
import { CHEATS, RESOURCES } from '../content/cheatsheets.js';
import { RecommendCard } from '../components/Cards.jsx';

function Flashcards() {
  const [course, setCourse] = useState('All'); const [i, setI] = useState(0); const [flip, setFlip] = useState(false); const [known, setKnown] = useState({});
  const deck = useMemo(() => GLOSSARY.filter(g => course === 'All' || g[0] === course), [course]);
  const card = deck[i % deck.length]; const knownN = deck.filter(g => known[g[1]]).length;
  const go = d => { setFlip(false); setI(x => (x + d + deck.length) % deck.length); };
  return (
    <div>
      <div className="field"><label>Deck <select value={course} onChange={e => { setCourse(e.target.value); setI(0); setFlip(false); }}>{['All', 'Excel', 'Power BI', 'SQL', 'Python', 'Data Science'].map(c => <option key={c}>{c}</option>)}</select></label>
        <span className="muted">Card {(i % deck.length) + 1} of {deck.length} · {knownN} known</span></div>
      <button className="flash-card" onClick={() => setFlip(f => !f)} aria-label={flip ? 'Definition. Click to see the term' : 'Term. Click to reveal the definition'}>
        <span>{flip ? card[2] : card[1]}<small>{flip ? card[0] : `${card[0]} · click to reveal`}</small></span></button>
      <div className="lab-actions"><button className="btn sm ghost" onClick={() => go(-1)}>← Previous</button><button className="btn sm" onClick={() => { setKnown(k => ({ ...k, [card[1]]: true })); go(1); }}>I knew it ✓</button><button className="btn sm ghost" onClick={() => go(1)}>Next →</button><button className="btn sm ghost" onClick={() => { setKnown({}); setI(0); }}><RotateCcw size={14} /> Restart</button></div>
    </div>
  );
}

export default function Library() {
  const [sp, setSp] = useSearchParams(); const tab = sp.get('tab') || 'notes'; const [filter, setFilter] = useState('all'); const [q, setQ] = useState('');
  const tabs = [['notes', 'All notes'], ['cheats', 'Cheat sheets'], ['cards', 'Flashcards'], ['resources', 'Resources']];
  const chapters = COURSES.filter(c => filter === 'all' || c.id === filter).flatMap(c => c.chapters).filter(c => !q || c.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="page-head"><div><h1>Library</h1><p>Every note from the book, quick-reference cheat sheets, flashcards and resources.</p></div></div>
      <div className="tabs" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setSp({ tab: k })}>{l}</button>)}</div>
      {tab === 'notes' && <>
        <div className="field"><input type="text" placeholder="Filter by title…" value={q} onChange={e => setQ(e.target.value)} aria-label="Filter notes by title" />
          <div className="chips">{[['all', 'All'], ...COURSES.map(c => [c.id, c.title])].map(([k, l]) => <button key={k} className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l}</button>)}</div></div>
        <div className="rec-row" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>{chapters.map((c, i) => <RecommendCard key={c.key} chapter={c} seed={i} />)}</div></>}
      {tab === 'cheats' && <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))' }}>{CHEATS.map(ch => (
        <section key={ch.id} className="panel"><h3 style={{ marginBottom: 10 }}>{ch.title}</h3>
          <table className="data" style={{ width: '100%' }}><tbody>{ch.rows.map(([a, b]) => <tr key={a}><td style={{ fontFamily: 'var(--mono)', whiteSpace: 'normal' }}>{a}</td><td style={{ whiteSpace: 'normal' }}>{b}</td></tr>)}</tbody></table></section>))}</div>}
      {tab === 'cards' && <Flashcards />}
      {tab === 'resources' && <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        <section className="panel"><h3>The book</h3><p className="muted">The original PDF this course is built from (263 pages).</p><a className="btn" href="./resources/DATA-ANALYSIS-MADE-EASY.pdf" download><Download size={16} /> Download PDF</a>
          <p className="muted">By Ezekiel Aleke.</p><ul>{RESOURCES.author.map(([l, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer noopener">{l} <ExternalLink size={12} /></a></li>)}</ul></section>
        <section className="panel"><h3>Where to find remote jobs</h3><p className="muted">The 8 sites listed at the end of the book. Links are unverified; check each before use.</p><ol>{RESOURCES.jobs.map(([l, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer noopener">{l} <ExternalLink size={12} /></a></li>)}</ol></section>
        <section className="panel"><h3>Official documentation</h3><ul>{RESOURCES.docs.map(([l, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer noopener">{l} <ExternalLink size={12} /></a></li>)}</ul></section></div>}
    </>
  );
}
