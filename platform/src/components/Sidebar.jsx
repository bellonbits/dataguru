import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Layers, Library, TerminalSquare, ClipboardList, Bot, Settings, ArrowUpRight, Trophy } from 'lucide-react';
import { Robot } from './Art.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/subjects', label: 'Subjects', icon: Layers },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/labs', label: 'Live Labs', icon: TerminalSquare },
  { to: '/assignments', label: 'Assignments', icon: ClipboardList },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/tutor', label: 'AI Tutor', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ open, onNavigate }) {
  const nav = useNavigate();
  return (
    <aside className={'sidebar' + (open ? ' open' : '')} aria-label="Main">
      <NavLink to="/" className="brand" onClick={onNavigate}>
        <span className="brand-mark"><i /><i /><i /></span>
        <span className="brand-name">Data Guru</span>
      </NavLink>
      <nav className="nav">
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
            <n.icon size={22} strokeWidth={1.7} /><span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="tutor-card">
        <button className="round-btn" aria-label="Open AI Tutor" onClick={() => { nav('/tutor'); onNavigate?.(); }}><ArrowUpRight size={18} /></button>
        <div className="robot"><Robot size={112} /></div>
        <h4>Ask AI Tutor</h4>
        <p>Get instant help and learn better</p>
      </div>
    </aside>
  );
}
