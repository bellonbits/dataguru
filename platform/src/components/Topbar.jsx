import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Plus, Menu, Flame, Trophy, BookOpen, X, LogOut, Settings as Cog, UserPlus } from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { useProgress } from '../lib/store.jsx';
import { searchNotes } from '../lib/search.js';
import { ALL_CHAPTERS } from '../content/courses.js';

export default function Topbar({ onMenu }) {
  const { state, streak, badges } = useProgress(); const auth = useAuth();
  const nav = useNavigate();
  const [q, setQ] = useState(''); const [focus, setFocus] = useState(false);
  const [pop, setPop] = useState(null);
  const box = useRef(null); const input = useRef(null);
  const results = q.trim().length > 1 ? searchNotes(q, 6) : [];

  useEffect(() => {
    const onKey = e => { if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); input.current?.focus(); } if (e.key === 'Escape') { setPop(null); setFocus(false); } };
    const onDoc = e => { if (box.current && !box.current.contains(e.target)) { setFocus(false); setPop(null); } };
    window.addEventListener('keydown', onKey); document.addEventListener('mousedown', onDoc);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDoc); };
  }, []);

  const submit = e => { e.preventDefault(); if (q.trim()) { nav('/search?q=' + encodeURIComponent(q.trim())); setFocus(false); } };
  const earned = badges.filter(b => b.earned);
  const initials = (state.profile.name || 'L').split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const nextUp = ALL_CHAPTERS.find(c => !state.chapters[c.key]);

  return (
    <header className="topbar" ref={box}>
      <button className="menu-btn circle-btn" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
      <form className="search" onSubmit={submit} role="search">
        <Search size={20} className="ico" aria-hidden="true" />
        <input ref={input} value={q} onChange={e => setQ(e.target.value)} onFocus={() => setFocus(true)} placeholder="Search courses, lessons, formulas…" aria-label="Search all notes" autoComplete="off" />
        {q && <button type="button" className="clear" onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>}
        <kbd>/</kbd>
        {focus && results.length > 0 && (
          <div className="search-pop" role="listbox">
            {results.map(r => (
              <Link key={r.ch.key} to={`/subjects/${r.ch.course}/${r.ch.id}`} onClick={() => { setFocus(false); setQ(''); }} role="option">
                <b>{r.title}</b><small>{r.course}</small><span>{r.snippet.slice(0, 110)}…</span>
              </Link>
            ))}
            <Link to={'/search?q=' + encodeURIComponent(q)} className="all" onClick={() => setFocus(false)}>See all results</Link>
          </div>
        )}
      </form>
      <div className="top-actions">
        <div className="pop-anchor">
          <button className="circle-btn" aria-label="Notifications" onClick={() => setPop(pop === 'bell' ? null : 'bell')}><Bell size={19} />{earned.length > 0 && <i className="dot" />}</button>
          {pop === 'bell' && (
            <div className="popover" role="dialog" aria-label="Notifications">
              <h5>Notifications</h5>
              <p><Flame size={16} /> {streak ? `${streak}-day study streak. Keep it going!` : 'Study today to start a streak.'}</p>
              {earned.slice(-2).map(b => <p key={b.id}><Trophy size={16} /> Badge unlocked: <b>{b.title}</b></p>)}
              {nextUp && <p><BookOpen size={16} /> Up next: <Link to={`/subjects/${nextUp.course}/${nextUp.id}`} onClick={() => setPop(null)}>{nextUp.title}</Link></p>}
            </div>
          )}
        </div>
        <div className="pop-anchor">
          <button className="circle-btn" aria-label="Quick actions" onClick={() => setPop(pop === 'plus' ? null : 'plus')}><Plus size={20} /></button>
          {pop === 'plus' && (
            <div className="popover" role="menu">
              <h5>Quick start</h5>
              <Link to="/labs?tab=sql" onClick={() => setPop(null)}>▸ Open SQL sandbox</Link>
              <Link to="/labs?tab=python" onClick={() => setPop(null)}>▸ Open Python sandbox</Link>
              <Link to="/labs?tab=excel" onClick={() => setPop(null)}>▸ Open Excel sandbox</Link>
              <Link to="/labs?tab=dax" onClick={() => setPop(null)}>▸ Open DAX sandbox</Link>
              <Link to="/tutor" onClick={() => setPop(null)}>▸ Ask the tutor</Link>
            </div>
          )}
        </div>
        <div className="pop-anchor">
          <button className="user" aria-haspopup="menu" aria-expanded={pop === 'user'} onClick={() => setPop(pop === 'user' ? null : 'user')}>
            <span className="avatar">{initials}</span>
            <span className="who"><b>{state.profile.name}</b><small>{auth.user ? auth.user.email : 'Guest · progress not synced'}</small></span>
          </button>
          {pop === 'user' && (
            <div className="popover" role="menu" style={{ width: 250 }}>
              <h5>{auth.user ? 'Signed in' : 'Guest'}</h5>
              <Link to="/settings" role="menuitem" onClick={() => setPop(null)}><Cog size={16} /> Settings &amp; account</Link>
              {!auth.user && <Link to="/signup" role="menuitem" onClick={() => { auth.signOut(); setPop(null); }}><UserPlus size={16} /> Create an account</Link>}
              <a href="#/login" role="menuitem" onClick={e => { e.preventDefault(); setPop(null); auth.signOut(); nav('/login'); }}><LogOut size={16} /> {auth.user ? 'Sign out' : 'Leave guest mode'}</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
