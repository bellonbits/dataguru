import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const ORDER = ['Define the problem', 'Collect data', 'Explore and prepare data', 'Build models', 'Evaluate models', 'Communicate insights', 'Deploy and monitor'];
const shuffle = a => { const r = [...a]; let s = 7; for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
export default function Workflow({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [items, setItems] = useState(() => shuffle(ORDER)); const [res, setRes] = useState(null);
  const mv = (i, d) => setItems(a => { const r = [...a]; const j = i + d; if (j < 0 || j >= r.length) return r; [r[i], r[j]] = [r[j], r[i]]; return r; });
  const check = () => { const wrong = items.filter((x, i) => x !== ORDER[i]).length; const ok = wrong === 0; setRes(ok ? { ok, text: '✔ That is the data science workflow, and in real projects you loop back often.' } : { ok, text: `${items.filter((x, i) => x === ORDER[i]).length} of 7 steps are in the right place. Hint: you cannot model data you have not collected or cleaned.` }); if (ok) done(); };
  return (
    <Frame title={title} finished={finished} verdict={res} desc="Put the seven stages of a data science project in order using the arrows.">
      <ol className="order-list">{items.map((x, i) => <li key={x}><span className="tag">{i + 1}</span>{x}<span className="mv"><button aria-label={`Move ${x} up`} onClick={() => mv(i, -1)} disabled={i === 0}>▲</button><button aria-label={`Move ${x} down`} onClick={() => mv(i, 1)} disabled={i === items.length - 1}>▼</button></span></li>)}</ol>
      <button className="btn sm lime" onClick={check}>Check order</button> <button className="btn sm ghost" onClick={() => { setItems(shuffle([...ORDER].reverse())); setRes(null); }}>Shuffle</button>
    </Frame>
  );
}
