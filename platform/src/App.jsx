import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Subjects from './pages/Subjects.jsx';
import Course from './pages/Course.jsx';
import Lesson from './pages/Lesson.jsx';
import Library from './pages/Library.jsx';
import LiveLabs from './pages/LiveLabs.jsx';
import Assignments from './pages/Assignments.jsx';
import Achievements from './pages/Achievements.jsx';
import Tutor from './pages/Tutor.jsx';
import SettingsPage from './pages/Settings.jsx';
import SearchPage from './pages/Search.jsx';

function Toast() {
  const [msg, setMsg] = useState('');
  useEffect(() => { let t; const on = e => { setMsg(e.detail); clearTimeout(t); t = setTimeout(() => setMsg(''), 2400); }; window.addEventListener('dg-toast', on); return () => window.removeEventListener('dg-toast', on); }, []);
  return <div className={'toast' + (msg ? ' show' : '')} role="status" aria-live="polite">{msg}</div>;
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const loc = useLocation();
  useEffect(() => { setMenu(false); window.scrollTo(0, 0); document.getElementById('content')?.scrollTo?.(0, 0); }, [loc.pathname]);
  return (
    <div className="frame">
      <a className="skip" href="#content" onClick={e => { e.preventDefault(); document.getElementById('content')?.focus(); }}>Skip to content</a>
      <Sidebar open={menu} onNavigate={() => setMenu(false)} />
      {menu && <div className="scrim" onClick={() => setMenu(false)} />}
      <div className="workspace">
        <Topbar onMenu={() => setMenu(m => !m)} />
        <main id="content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:course" element={<Course />} />
            <Route path="/subjects/:course/:chapter" element={<Lesson />} />
            <Route path="/library" element={<Library />} />
            <Route path="/labs" element={<LiveLabs />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<div className="panel"><h2>Page not found</h2><p>That page does not exist. Head back to the dashboard.</p></div>} />
          </Routes>
        </main>
      </div>
      <Toast />
    </div>
  );
}
