import { lazy, Suspense } from 'react';
const SqlLab = lazy(() => import('./SqlLab.jsx'));
const PythonLab = lazy(() => import('./PythonLab.jsx'));
const ExcelLab = lazy(() => import('./ExcelLab.jsx'));
const DaxLab = lazy(() => import('./DaxLab.jsx'));
const Widget = lazy(() => import('./widgets/Widget.jsx'));

/** Renders any lab spec: {type:'sql'|'python'|'excel'|'dax'|'widget', ...}. */
export default function Lab({ spec, labKey, course, inline }) {
  const P = { ...spec, labKey, course, inline };
  const el = { sql: <SqlLab {...P} />, python: <PythonLab {...P} />, excel: <ExcelLab {...P} />, dax: <DaxLab {...P} />, widget: <Widget {...P} /> }[spec.type];
  return <Suspense fallback={<div className="lab"><span className="spinner" />Loading lab…</div>}>{el}</Suspense>;
}
