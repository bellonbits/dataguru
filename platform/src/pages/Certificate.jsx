import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Lock, Award, Check } from 'lucide-react';
import { useProgress } from '../lib/store.jsx';
import { ALL_CHAPTERS, ALL_LABS } from '../content/courses.js';
import CertificateArt from '../components/CertificateArt.jsx';

const TRAINER = 'Peter Gatitu Mwangi';

/** FNV-1a hash → short, stable serial so a certificate can be quoted back. */
const serial = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36).toUpperCase().padStart(7, '0'); };

export default function Certificate() {
  const { state, setProfile } = useProgress();
  const lessons = ALL_CHAPTERS.filter(c => state.chapters[c.key]).length;
  const labs = ALL_LABS.filter(l => state.labs[l.key]).length;
  const earned = lessons === ALL_CHAPTERS.length && labs === ALL_LABS.length;
  const name = state.profile.name;
  const date = useMemo(() => {
    const t = [...Object.values(state.chapters), ...Object.values(state.labs)];
    return new Date(t.length ? Math.max(...t) : Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [state.chapters, state.labs]);
  const id = 'DG-' + serial(`${name}|${ALL_CHAPTERS.length}|${date}`);

  const rows = [
    { label: 'Lessons completed', a: lessons, b: ALL_CHAPTERS.length },
    { label: 'Labs completed', a: labs, b: ALL_LABS.length },
  ];
  return (
    <>
      <div className="page-head no-print"><div><h1>Certificate</h1><p>Complete every lesson and every lab to earn your Data Guru Certificate of Achievement, signed by your chief trainer.</p></div>
        {earned && <button className="btn" onClick={() => window.print()}><Printer size={18} /> Print / save as PDF</button>}</div>

      <div className="panel no-print cert-status">
        {earned ? <p style={{ margin: 0 }}><Award size={18} style={{ verticalAlign: '-3px' }} /> <b>Congratulations, you finished everything.</b> Check the name below is how you want it printed, then save as PDF (choose "Save as PDF" and turn off headers and footers).</p>
          : <p style={{ margin: '0 0 12px' }}><Lock size={16} style={{ verticalAlign: '-2px' }} /> Locked. Here is what is left:</p>}
        {!earned && rows.map(r => <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '170px 1fr 90px', gap: 14, alignItems: 'center', padding: '6px 0' }}><b>{r.label}</b><div className="bar"><i style={{ width: (r.a / r.b * 100) + '%' }} /></div><span className="muted">{r.a}/{r.b} {r.a === r.b && <Check size={14} />}</span></div>)}
        {!earned && <p className="muted" style={{ margin: '10px 0 0' }}>Mark lessons complete on each lesson page. <Link to="/assignments">Assignments</Link> lists the labs still open.</p>}
        <div className="form-row" style={{ marginTop: 14, maxWidth: 420 }}><label htmlFor="cn">Name on certificate</label><input id="cn" type="text" value={name} maxLength={40} onChange={e => setProfile({ name: e.target.value })} /></div>
      </div>

      <div className={'cert-stage' + (earned ? '' : ' locked')}>
        <div className="cert" id="certificate">
          <CertificateArt />
          <div className="cert-body">
            <div className="cert-title">CERTIFICATE</div>
            <div className="cert-sub">OF ACHIEVEMENT</div>
            <i className="cert-gem" />
            <div className="cert-pre">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
            <div className="cert-name"><span>{(name || 'Your Name').toUpperCase().split('').join(' ')}</span></div>
            <p className="cert-text">for successfully completing all {ALL_CHAPTERS.length} lessons and {ALL_LABS.length} hands-on labs of the Data Guru programme, covering Excel, Power BI, SQL, Python and Data Science.</p>
            <div className="cert-sign">
              <div><div className="cert-sig">{TRAINER}</div><b>{TRAINER.toUpperCase()}</b><span>CHIEF TRAINER</span></div>
              <div className="cert-meta"><b>{date.toUpperCase()}</b><span>DATE OF COMPLETION</span><em>{id}</em></div>
            </div>
          </div>
          {!earned && <div className="cert-watermark">PREVIEW</div>}
        </div>
      </div>
    </>
  );
}
