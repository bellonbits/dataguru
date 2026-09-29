import { useEffect, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const STEPS = ['Master foundational programming skills (Python, SQL)', 'Learn data manipulation (Pandas, NumPy)', 'Study statistics and machine learning concepts', 'Practice EDA and visualization', 'Explore advanced topics (NLP, deep learning)', 'Work on projects to gain real-world experience', 'Build a portfolio and seek internships or certifications'];
export default function Roadmap({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const K = 'dataguru.roadmap';
  const [on, setOn] = useState(() => { try { return JSON.parse(localStorage.getItem(K)) || []; } catch (e) { return []; } });
  useEffect(() => { try { localStorage.setItem(K, JSON.stringify(on)); } catch (e) { /* ignore */ } }, [on]);
  const n = on.length;
  return (
    <Frame title={title} finished={finished} desc="Tick off each stage as you finish it. Your checklist is saved in this browser.">
      <div className="bar" style={{ '--accent-c': '#d4560f', marginBottom: 10 }}><i style={{ width: (n / STEPS.length) * 100 + '%' }} /></div>
      <ol className="order-list">{STEPS.map((s, i) => <li key={s}><input type="checkbox" id={'rm' + i} checked={on.includes(i)} onChange={e => { setOn(a => (e.target.checked ? [...a, i] : a.filter(x => x !== i))); done(); }} /><label htmlFor={'rm' + i} style={{ flex: 1, textDecoration: on.includes(i) ? 'line-through' : 'none' }}><b>{i + 1}.</b> {s}</label></li>)}</ol>
      <p className="muted" style={{ margin: 0 }}>{n} of {STEPS.length} stages done.</p>
    </Frame>
  );
}
