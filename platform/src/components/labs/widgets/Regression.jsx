import { useMemo, useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const W = 460, H = 280, P = 30;
const PRESETS = { 'Study hours → score': [[1, 52], [2, 55], [3, 61], [4, 64], [5, 72], [6, 74], [7, 83], [8, 86]], 'No relationship': [[1, 60], [2, 82], [3, 55], [4, 78], [5, 58], [6, 80], [7, 62], [8, 76]] };
export default function Regression({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [pts, setPts] = useState(PRESETS['Study hours → score']);
  const fit = useMemo(() => {
    const n = pts.length; if (n < 2) return null;
    const mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
    const sxx = pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0), sxy = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0), syy = pts.reduce((a, p) => a + (p[1] - my) ** 2, 0);
    if (!sxx) return null; const m = sxy / sxx, b = my - m * mx; const ssr = pts.reduce((a, p) => a + (p[1] - (m * p[0] + b)) ** 2, 0);
    return { m, b, r2: syy ? 1 - ssr / syy : 1, r: syy ? sxy / Math.sqrt(sxx * syy) : 0 };
  }, [pts]);
  const sx = x => P + (x / 10) * (W - 2 * P), sy = y => H - P - (y / 100) * (H - 2 * P);
  const add = e => { const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H; const px = ((x - P) / (W - 2 * P)) * 10, py = ((H - P - y) / (H - 2 * P)) * 100; if (px >= 0 && px <= 10 && py >= 0 && py <= 100) { setPts(p => [...p, [Math.round(px * 10) / 10, Math.round(py)]]); done(); } };
  return (
    <Frame title={title} finished={finished} desc="Click the chart to add data points. The least-squares line (linear regression) refits instantly. R² says how much of the variation the line explains.">
      <div className="chips" style={{ marginBottom: 8 }}>{Object.keys(PRESETS).map(k => <button key={k} className="chip" onClick={() => setPts(PRESETS[k])}>{k}</button>)}<button className="chip" onClick={() => setPts([])}>Clear</button></div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 640, background: 'var(--card2)', borderRadius: 16, cursor: 'crosshair' }} onClick={add} role="img" aria-label="Scatter plot with regression line">
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="#999" /><line x1={P} y1={P} x2={P} y2={H - P} stroke="#999" />
        {fit && <line x1={sx(0)} y1={sy(fit.b)} x2={sx(10)} y2={sy(fit.m * 10 + fit.b)} stroke="#3f7f00" strokeWidth="3" />}
        {pts.map((p, i) => <circle key={i} cx={sx(p[0])} cy={sy(p[1])} r="5" fill="#5a45e0" />)}
        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="#777">x (0 to 10)</text><text x="8" y={H / 2} fontSize="12" fill="#777" transform={`rotate(-90 8 ${H / 2})`} textAnchor="middle">y (0 to 100)</text>
      </svg>
      <div className="kpis">{fit ? <><div className="kpi"><b>{fit.m.toFixed(2)}</b><span>slope</span></div><div className="kpi"><b>{fit.b.toFixed(1)}</b><span>intercept</span></div><div className="kpi"><b>{fit.r.toFixed(2)}</b><span>correlation r</span></div><div className="kpi"><b>{fit.r2.toFixed(2)}</b><span>R²</span></div></> : <span className="muted">Add at least two points with different x values.</span>}</div>
    </Frame>
  );
}
