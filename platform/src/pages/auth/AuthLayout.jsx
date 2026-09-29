import { Link } from 'react-router-dom';
import { Robot, SubjectArt } from '../../components/Art.jsx';
import { COURSES, ALL_CHAPTERS, ALL_LABS } from '../../content/courses.js';

export default function AuthLayout({ title, subtitle, children, footer }) {
  const quiz = ALL_CHAPTERS.reduce((a, c) => a + c.quiz.length, 0);
  return (
    <div className="auth">
      <aside className="auth-hero" aria-hidden="true">
        <Link to="/login" className="brand" tabIndex={-1}><span className="brand-mark"><i /><i /><i /></span><span className="brand-name">Data Guru</span></Link>
        <div className="auth-copy"><h2>Learn data analysis by <em>doing</em>.</h2><p>Excel, Power BI, SQL, Python and data science, with real code running right in your browser.</p></div>
        <div className="auth-art">{COURSES.map(c => <span key={c.id} style={{ background: c.tint }}><SubjectArt id={c.id} size={64} /></span>)}</div>
        <div className="auth-stats"><div><b>{ALL_CHAPTERS.length}</b><span>lessons</span></div><div><b>{ALL_LABS.length}</b><span>hands-on labs</span></div><div><b>{quiz}</b><span>quiz questions</span></div></div>
        <div className="auth-bot"><Robot size={120} /></div>
      </aside>
      <main className="auth-main" id="content">
        <div className="auth-card">
          <Link to="/login" className="auth-brand-sm brand" aria-label="Data Guru"><span className="brand-mark"><i /><i /><i /></span><span className="brand-name">Data Guru</span></Link>
          <h1>{title}</h1>{subtitle && <p className="muted auth-sub">{subtitle}</p>}
          {children}
          {footer && <div className="auth-foot">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
