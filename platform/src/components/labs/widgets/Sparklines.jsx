import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const ROWS = [['Asia', [140, 143, 46, 66, 90, 120, 130, 95, 110, 150, 160, 170]], ['Europe', [78, 115, 198, 182, 140, 120, 100, 130, 160, 170, 155, 190]], ['S. America', [100, 119, 83, 99, 105, 90, 80, 95, 100, 110, 118, 125]], ['N. America', [82, 68, 87, 110, 95, 70, 60, 75, 85, 96, 104, 99]]];
function Spark({ d, kind, hi, lo }) {
  const w = 140, h = 34, min = Math.min(...d), max = Math.max(...d), x = i => 4 + (i * (w - 8)) / (d.length - 1), y = v => h - 4 - ((v - min) / (max - min || 1)) * (h - 8);
  if (kind === 'column') return <svg width={w} height={h} aria-hidden="true">{d.map((v, i) => <rect key={i} x={4 + i * ((w - 8) / d.length)} width={(w - 8) / d.length - 2} y={y(v)} height={h - 4 - y(v)} fill={hi && v === max ? '#e2681c' : lo && v === min ? '#c0392b' : '#3b6cf0'} />)}</svg>;
  return <svg width={w} height={h} aria-hidden="true"><polyline fill="none" stroke="#3b6cf0" strokeWidth="2" points={d.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />{hi && <circle cx={x(d.indexOf(max))} cy={y(max)} r="3.5" fill="#e2681c" />}{lo && <circle cx={x(d.indexOf(min))} cy={y(min)} r="3.5" fill="#c0392b" />}</svg>;
}
export default function Sparklines({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [kind, setKind] = useState('line'); const [hi, setHi] = useState(false); const [lo, setLo] = useState(false);
  return (
    <Frame title={title} finished={finished} desc="Insert → Sparklines puts a tiny chart inside a cell. The markers show High and Low points.">
      <div className="field">{['line', 'column'].map(k => <button key={k} className={'chip' + (kind === k ? ' on' : '')} onClick={() => { setKind(k); done(); }}>{k}</button>)}
        <label><input type="checkbox" checked={hi} onChange={e => { setHi(e.target.checked); done(); }} /> High point</label><label><input type="checkbox" checked={lo} onChange={e => { setLo(e.target.checked); done(); }} /> Low point</label></div>
      <div className="tbl-wrap"><table className="data"><thead><tr><th>Region</th><th>Last 12 months (in $k)</th><th>Trend</th></tr></thead><tbody>{ROWS.map(([n, d]) => <tr key={n}><td>{n}</td><td>{d.join(', ')}</td><td><Spark d={d} kind={kind} hi={hi} lo={lo} /></td></tr>)}</tbody></table></div>
    </Frame>
  );
}
