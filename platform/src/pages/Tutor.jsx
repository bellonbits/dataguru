import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { offlineAnswer, claudeAnswer } from '../lib/tutor.js';
import { useProgress } from '../lib/store.jsx';
import { COURSES, ALL_CHAPTERS } from '../content/courses.js';
import { Robot } from '../components/Art.jsx';

const IDEAS = ['What is the difference between WHERE and HAVING?', 'How does CALCULATE change filter context?', 'When should I use XLOOKUP instead of VLOOKUP?', 'What is a list comprehension?', 'Explain star schema', 'I get #N/A from VLOOKUP'];

export default function Tutor() {
  const { state } = useProgress(); const key = state.profile.apiKey;
  const [msgs, setMsgs] = useState([{ role: 'bot', text: 'Hi! I am your study tutor. Ask about any topic from the book, or paste an error message. I answer from your course notes and link the lesson.' }]);
  const [q, setQ] = useState(''); const [busy, setBusy] = useState(false); const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs]);
  const ask = async text => {
    text = text.trim(); if (!text || busy) return; setQ(''); setBusy(true);
    setMsgs(m => [...m, { role: 'me', text }]);
    try {
      const a = key ? await claudeAnswer(text, key, msgs.filter(m => m.role !== 'bot' || m.text).map(m => ({ role: m.role === 'me' ? 'user' : 'assistant', content: m.text })).slice(1)) : offlineAnswer(text);
      setMsgs(m => [...m, { role: 'bot', ...a }]);
    } catch (e) { const a = offlineAnswer(text); setMsgs(m => [...m, { role: 'bot', text: `(${e.message} Falling back to the offline tutor.)\n\n${a.text}`, sources: a.sources }]); }
    setBusy(false);
  };
  return (
    <>
      <div className="page-head"><div style={{ display: 'flex', gap: 18, alignItems: 'center' }}><Robot size={84} /><div><h1>AI Tutor</h1><p>{key ? 'Answering with Claude using your own API key, grounded in the course notes.' : 'Offline mode: answers come straight from the notes, with no data leaving your device. Add an API key in Settings for richer explanations.'}</p></div></div></div>
      <div className="chat-layout"><div className="chat">
        <div className="suggest">{IDEAS.map(i => <button key={i} className="chip" onClick={() => ask(i)}>{i}</button>)}</div>
        <div className="msgs" aria-live="polite">
          {msgs.map((m, i) => <div key={i} className={'msg ' + (m.role === 'me' ? 'me' : '')}><div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            {m.sources?.length > 0 && <span className="src">Read more: {m.sources.map((s, j) => <span key={s.key}>{j ? ' · ' : ''}<Link to={`/subjects/${s.course}/${s.id}`}>{s.title}</Link></span>)}</span>}</div>)}
          {busy && <div className="msg"><span className="spinner" />Thinking…</div>}<div ref={end} />
        </div>
        <form onSubmit={e => { e.preventDefault(); ask(q); }}><input type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask a question or paste an error…" aria-label="Ask the tutor" /><button className="btn" disabled={busy || !q.trim()}><Send size={16} /> Ask</button></form>
      </div>
      <aside className="rail">
        <section className="panel"><h3>How the tutor works</h3><p className="muted" style={{ margin: 0 }}>It searches all {ALL_CHAPTERS.length} lessons of the book, quotes the most relevant passages, and links the lesson so you can practise. Paste an error message (like <code>#N/A</code> or <code>KeyError</code>) and it explains the usual cause.</p></section>
        <section className="panel"><h3>Study tips</h3><ul style={{ margin: 0, paddingLeft: 18 }}><li>Ask “why”, not just “how”.</li><li>Try the lab right after reading the answer.</li><li>Use Library → Flashcards to revise terms.</li></ul></section>
        <section className="panel"><h3>Jump to a subject</h3><div className="chips">{COURSES.map(c => <Link key={c.id} className="chip" to={`/subjects/${c.id}`}>{c.title}</Link>)}</div></section>
      </aside></div>
    </>
  );
}
