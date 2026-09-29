import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';

const PRESETS = { 'Balanced spam filter': [80, 10, 20, 90], 'Fraud detection (rare positives)': [8, 12, 12, 968], 'Cancer screening (missing cases is costly)': [45, 40, 5, 910] };
export default function Confusion({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [[tp, fp, fn, tn], set] = useState(PRESETS['Balanced spam filter']);
  const n = tp + fp + fn + tn, acc = (tp + tn) / n, prec = tp / (tp + fp || 1), rec = tp / (tp + fn || 1), f1 = (2 * prec * rec) / (prec + rec || 1);
  const slider = (v, i, label, hint) => <label className="field" title={hint}>{label} <input type="range" min={0} max={1000} value={v} onChange={e => { const a = [tp, fp, fn, tn]; a[i] = +e.target.value; set(a); done(); }} /><b style={{ minWidth: 40 }}>{v}</b></label>;
  const pct = x => (x * 100).toFixed(1) + '%';
  return (
    <Frame title={title} finished={finished} desc="A classifier predicted positive or negative. Move the counts and watch each metric. Try the “Fraud detection” preset: accuracy looks great while recall is poor.">
      <div className="chips" style={{ marginBottom: 8 }}>{Object.keys(PRESETS).map(k => <button key={k} className="chip" onClick={() => { set(PRESETS[k]); done(); }}>{k}</button>)}</div>
      <div className="cols2"><div>{slider(tp, 0, 'True positives', 'Predicted positive, really positive')}{slider(fp, 1, 'False positives', 'Predicted positive, really negative')}{slider(fn, 2, 'False negatives', 'Predicted negative, really positive')}{slider(tn, 3, 'True negatives', 'Predicted negative, really negative')}</div>
        <table className="data" aria-label="Confusion matrix"><thead><tr><th /><th>Predicted +</th><th>Predicted −</th></tr></thead><tbody><tr><th>Actual +</th><td style={{ background: '#c6efce' }}>{tp}</td><td style={{ background: '#ffc7ce' }}>{fn}</td></tr><tr><th>Actual −</th><td style={{ background: '#ffc7ce' }}>{fp}</td><td style={{ background: '#c6efce' }}>{tn}</td></tr></tbody></table></div>
      <div className="kpis"><div className="kpi"><b>{pct(acc)}</b><span>Accuracy (TP+TN)/all</span></div><div className="kpi"><b>{pct(prec)}</b><span>Precision TP/(TP+FP)</span></div><div className="kpi"><b>{pct(rec)}</b><span>Recall TP/(TP+FN)</span></div><div className="kpi"><b>{pct(f1)}</b><span>F1 score</span></div></div>
      <p className="muted" style={{ marginBottom: 0 }}>Precision: of the cases flagged, how many were right? Recall: of the real cases, how many did we find? F1 balances the two.</p>
    </Frame>
  );
}
