import { lazy, Suspense } from 'react';
const W = {
  joins: lazy(() => import('./Joins.jsx')), pivot: lazy(() => import('./Pivot.jsx')), chart: lazy(() => import('./ChartLab.jsx')),
  condfmt: lazy(() => import('./CondFmt.jsx')), sparklines: lazy(() => import('./Sparklines.jsx')), goalseek: lazy(() => import('./GoalSeek.jsx')),
  powerquery: lazy(() => import('./PowerQuery.jsx')), dashboard: lazy(() => import('./Dashboard.jsx')), starschema: lazy(() => import('./StarSchema.jsx')),
  confusion: lazy(() => import('./Confusion.jsx')), regression: lazy(() => import('./Regression.jsx')), workflow: lazy(() => import('./Workflow.jsx')),
  roadmap: lazy(() => import('./Roadmap.jsx')), xltable: lazy(() => import('./XlTable.jsx')), validation: lazy(() => import('./Validation.jsx')),
};
export default function Widget(props) {
  const C = W[props.name];
  if (!C) return <div className="lab"><b>Unknown widget “{props.name}”</b></div>;
  return <Suspense fallback={<div className="lab"><span className="spinner" />Loading…</div>}><C {...props} /></Suspense>;
}
