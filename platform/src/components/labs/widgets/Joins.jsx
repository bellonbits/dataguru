import { useState } from 'react';
import Frame, { useFrame } from './Frame.jsx';
import { DataTable } from '../SqlLab.jsx';

const EMP = [[1, 'John', 'Smith', 1], [2, 'Sarah', 'Johnson', 2], [3, 'Alex', 'Brown', null], [4, 'David', 'Lee', 3]];
const DEP = [[1, 'Sales'], [2, 'Marketing'], [3, 'Finance'], [4, 'IT']];
const TYPES = {
  INNER: 'Only rows that match in both tables.', LEFT: 'Every employee, matched or not.', RIGHT: 'Every department, matched or not.', FULL: 'Every row from both tables.',
};
export default function Joins({ title, labKey }) {
  const { finished, done } = useFrame(labKey); const [t, setT] = useState('INNER');
  const rows = [];
  for (const e of EMP) { const d = DEP.find(x => x[0] === e[3]); if (d) rows.push([e[1], e[2], d[1], 'match']); else if (t === 'LEFT' || t === 'FULL') rows.push([e[1], e[2], null, 'employee only']); }
  if (t === 'RIGHT' || t === 'FULL') for (const d of DEP) if (!EMP.some(e => e[3] === d[0])) rows.push([null, null, d[1], 'department only']);
  if (t === 'RIGHT') { rows.length = 0; for (const d of DEP) { const es = EMP.filter(e => e[3] === d[0]); if (es.length) es.forEach(e => rows.push([e[1], e[2], d[1], 'match'])); else rows.push([null, null, d[1], 'department only']); } }
  return (
    <Frame title={title} finished={finished} desc="Employees (left) and Departments (right) come from the book. Alex Brown has no department, and IT has no employees.">
      <div className="cols2"><div><b>Employees</b><DataTable cols={['ID', 'First', 'Last', 'DeptID']} rows={EMP} /></div><div><b>Departments</b><DataTable cols={['ID', 'Name']} rows={DEP} /></div></div>
      <div className="chips" role="radiogroup" aria-label="Join type" style={{ margin: '10px 0' }}>{Object.keys(TYPES).map(k => <button key={k} role="radio" aria-checked={t === k} className={'chip' + (t === k ? ' on' : '')} onClick={() => { setT(k); done(); }}>{k === 'FULL' ? 'FULL OUTER' : k} JOIN</button>)}</div>
      <p style={{ margin: '4px 0' }}><b>{t === 'FULL' ? 'FULL OUTER' : t} JOIN:</b> {TYPES[t]} <b>{rows.length}</b> rows.</p>
      <DataTable cols={['FirstName', 'LastName', 'DepartmentName', 'Why this row?']} rows={rows} />
    </Frame>
  );
}
