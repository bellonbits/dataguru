import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';
import { DataTable } from '../SqlLab.jsx';

const profit = (units, price, cost, fixed) => units * (price - cost) - fixed;
export default function GoalSeek({ title, labKey }) {
  const { finished, done } = useFrame(labKey);
  const [price, setPrice] = useState(25); const [cost, setCost] = useState(10); const [fixed, setFixed] = useState(3000); const [target, setTarget] = useState(6000);
  const [res, setRes] = useState(null); const [steps, setSteps] = useState([]);
  const seek = () => {
    let lo = 0, hi = 1e6, n = 0; const log = [];
    while (n < 60) { const mid = (lo + hi) / 2, p = profit(mid, price, cost, fixed); log.push([n + 1, Math.round(mid * 100) / 100, Math.round(p * 100) / 100]); if (Math.abs(p - target) < 0.005) break; (price - cost) > 0 ? (p < target ? lo = mid : hi = mid) : (p > target ? lo = mid : hi = mid); n++; }
    const u = log[log.length - 1][1]; setSteps(log.slice(-6)); setRes(price - cost <= 0 ? 'Unit margin is not positive, so no number of units reaches the target.' : `Set Units = ${Math.ceil(u).toLocaleString()} to reach a profit of ${target.toLocaleString()} (Goal Seek found ${u.toLocaleString(undefined, { maximumFractionDigits: 2 })} in ${log.length} iterations).`); done();
  };
  const prices = [15, 20, 25, 30, 35], units = [200, 400, 600, 800, 1000];
  const num = (v, set, label) => <label className="field">{label} <input type="number" value={v} onChange={e => set(+e.target.value)} style={{ width: 100 }} /></label>;
  return (
    <Frame title={title} finished={finished} desc="Model: Profit = Units × (Price − Cost) − Fixed costs. Goal Seek works backwards: “What must Units be to hit my target profit?”">
      <div className="field" style={{ gap: 16 }}>{num(price, setPrice, 'Price')}{num(cost, setCost, 'Unit cost')}{num(fixed, setFixed, 'Fixed costs')}{num(target, setTarget, 'Target profit')}</div>
      <button className="btn sm" onClick={seek}>Goal Seek: find Units</button>
      {res && <div className="verdict ok" style={{ marginTop: 10 }}>{res}</div>}
      {steps.length > 0 && <details className="schema" open><summary>Last iterations (bisection search)</summary><DataTable cols={['Iteration', 'Units tried', 'Profit']} rows={steps} /></details>}
      <h4 style={{ margin: '16px 0 4px' }}>Two-variable Data Table (Price × Units → Profit)</h4>
      <DataTable cols={['Units \\ Price', ...prices]} rows={units.map(u => [u, ...prices.map(p => Math.round(profit(u, p, cost, fixed)))])} />
      <p className="muted" style={{ marginBottom: 0 }}>Excel’s Data Table recalculates the formula for every combination. Scenario Manager stores named input sets; Solver optimises under constraints.</p>
    </Frame>
  );
}
