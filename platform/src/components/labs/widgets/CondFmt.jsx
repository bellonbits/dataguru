import { useMemo, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const ROWS = [['Asia', 140787, 143549, 46210, 66404], ['Europe', 78944, 115252, 198783, 182729], ['S. America', 100961, 119646, 83233, 99524], ['N. America', 82889, 68945, -187202, 110372], ['Africa', 45010, 52300, 61220, 58800]];
const lerp = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
const scale = (t, three) => { const R = [248, 105, 107], Y = [255, 235, 132], G = [99, 190, 123]; return `rgb(${(three ? (t < .5 ? lerp(R, Y, t * 2) : lerp(Y, G, (t - .5) * 2)) : lerp([255, 255, 255], G, t)).join(',')})`; };
export default function CondFmt({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [rule, setRule] = useState('scale'); const [thr, setThr] = useState(0); const [topN, setTopN] = useState(3);
  const all = ROWS.flatMap(r => r.slice(1)); const min = Math.min(...all), max = Math.max(...all);
  const top = useMemo(() => [...all].sort((a, b) => b - a).slice(0, topN), [topN]); // eslint-disable-line
  const style = v => {
    if (rule === 'scale') return { background: scale((v - min) / (max - min), true) };
    if (rule === 'lt') return v < thr ? { background: '#ffc7ce', color: '#9c0006' } : {};
    if (rule === 'top') return top.includes(v) ? { background: '#c6efce', color: '#006100', fontWeight: 700 } : {};
    return { background: `linear-gradient(90deg, #8ab4f8 ${Math.max(0, ((v - Math.min(0, min)) / (max - Math.min(0, min))) * 100)}%, transparent 0)` };
  };
  return (
    <Frame title={title} finished={finished} desc="Home → Conditional Formatting. Switch the rule and watch the same numbers tell a different story. Note the negative value in North America Q3.">
      <div className="chips" role="radiogroup" aria-label="Rule" style={{ marginBottom: 8 }}>{[['scale', 'Color scale (heat map)'], ['lt', 'Highlight cells less than…'], ['top', 'Top N values'], ['bars', 'Data bars']].map(([k, l]) => <button key={k} role="radio" aria-checked={rule === k} className={'chip' + (rule === k ? ' on' : '')} onClick={() => { setRule(k); done(); }}>{l}</button>)}</div>
      {rule === 'lt' && <label className="field">Value <input type="number" value={thr} onChange={e => setThr(+e.target.value)} /></label>}
      {rule === 'top' && <label className="field">N <input type="number" min={1} max={10} value={topN} onChange={e => setTopN(Math.max(1, +e.target.value || 1))} /></label>}
      <div className="tbl-wrap"><table className="data"><thead><tr><th>Region</th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th></tr></thead>
        <tbody>{ROWS.map(r => <tr key={r[0]}><td>{r[0]}</td>{r.slice(1).map((v, i) => <td key={i} className="num" style={style(v)}>{v.toLocaleString()}</td>)}</tr>)}</tbody></table></div>
    </Frame>
  );
}
