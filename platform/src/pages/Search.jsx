import { Link, useSearchParams } from 'react-router-dom';
import { searchNotes } from '../lib/search.js';

const mark = (text, q) => {
  const ts = q.toLowerCase().split(/[^a-z0-9_%]+/).filter(t => t.length > 1); if (!ts.length) return text;
  const re = new RegExp('(' + ts.map(t => t.replace(/[.*+?^${}()|[\]\\%]/g, '\\$&')).join('|') + ')', 'ig');
  return text.split(re).map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
};
export default function SearchPage() {
  const [sp] = useSearchParams(); const q = sp.get('q') || ''; const res = searchNotes(q, 30);
  return (
    <>
      <div className="page-head"><div><h1>Search</h1><p>{q ? <>{res.length} result{res.length !== 1 ? 's' : ''} for “{q}”</> : 'Type in the search box above.'}</p></div></div>
      {res.map(r => <div className="result" key={r.ch.key}><Link to={`/subjects/${r.ch.course}/${r.ch.id}`}>{mark(r.title, q)}</Link> <span className="tag">{r.course}</span><p className="muted" style={{ margin: '6px 0 0' }}>{mark(r.snippet, q)}</p></div>)}
      {q && !res.length && <div className="panel"><b>No matches.</b> Try a function name (e.g. “SUMIFS”, “LEFT JOIN”, “groupby”) or a concept (“normalization”).</div>}
    </>
  );
}
