import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Frame, { useFrame } from './Frame.jsx';
Chart.register(...registerables);

const SETS = {
  'Quarterly sales (2 years)': { labels: ['Q1', 'Q2', 'Q3', 'Q4'], series: [['2009', [62, 41, 30, 86]], ['2010', [78, 92, 74, 98]]] },
  'Monthly website traffic': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], series: [['Visits (k)', [12, 15, 14, 19, 24, 22, 28, 31, 27, 33, 38, 44]]] },
  'Sales by product': { labels: ['Dessert', 'Salad', 'Coffee', 'Sandwich'], series: [['Share', [24, 9, 35, 32]]] },
  'Ad spend vs sales': { labels: null, scatter: [[10, 18], [15, 24], [20, 33], [25, 36], [30, 49], [35, 52], [40, 61], [45, 66], [50, 70], [55, 88]] },
};
const ADVICE = { column: 'Compare values across categories.', bar: 'Like a column chart but better for long labels or many categories.', line: 'Show a trend over time.', area: 'A trend over time with the area filled in to emphasise volume.', pie: 'Percentage breakdown of a whole. Use only a few slices.', scatter: 'The relationship between two variables.' };
const COLORS = ['#7cbd1e', '#3b6cf0', '#e2681c', '#8a52f0', '#d49a00'];

export default function ChartLab({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const canvas = useRef(null); const chart = useRef(null);
  const [ds, setDs] = useState(Object.keys(SETS)[0]); const [type, setType] = useState('column');
  const S = SETS[ds]; const scatterOnly = !!S.scatter;
  const eff = scatterOnly ? 'scatter' : type === 'scatter' ? 'column' : type;
  const cfg = useMemo(() => {
    const t = eff === 'column' ? 'bar' : eff === 'bar' ? 'bar' : eff === 'area' ? 'line' : eff;
    const data = scatterOnly ? { datasets: [{ label: 'Spend vs sales', data: S.scatter.map(([x, y]) => ({ x, y })), backgroundColor: COLORS[0] }] }
      : { labels: S.labels, datasets: S.series.map(([n, d], i) => ({ label: n, data: d, backgroundColor: t === 'pie' ? COLORS : COLORS[i % 5] + (eff === 'area' ? '55' : ''), borderColor: COLORS[i % 5], fill: eff === 'area', tension: .3 })) };
    return { type: t, data, options: { indexAxis: eff === 'bar' ? 'y' : 'x', responsive: true, maintainAspectRatio: false, animation: { duration: 300 }, plugins: { legend: { position: 'bottom' } } } };
  }, [ds, eff]); // eslint-disable-line
  useEffect(() => { chart.current?.destroy(); chart.current = new Chart(canvas.current, cfg); return () => chart.current?.destroy(); }, [cfg]);
  return (
    <Frame title={title} finished={finished} desc="Pick a dataset and a chart type. Notice which ones read well, and which do not.">
      <div className="field"><label>Data <select value={ds} onChange={e => { setDs(e.target.value); done(); }}>{Object.keys(SETS).map(k => <option key={k}>{k}</option>)}</select></label>
        <div className="chips" role="radiogroup" aria-label="Chart type">{Object.keys(ADVICE).map(k => <button key={k} role="radio" aria-checked={eff === k} disabled={scatterOnly && k !== 'scatter'} className={'chip' + (eff === k ? ' on' : '')} onClick={() => { setType(k); done(); }}>{k}</button>)}</div></div>
      <div style={{ height: 300, position: 'relative' }}><canvas ref={canvas} role="img" aria-label={`${eff} chart of ${ds}`} /></div>
      <p className="muted" style={{ marginBottom: 0 }}><b>{eff}:</b> {ADVICE[eff]}</p>
    </Frame>
  );
}
