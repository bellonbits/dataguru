// Runs every lab's reference solution through the same checker the UI uses, so no lab ships with a broken answer.
import { EXTRAS } from '../src/content/extras/index.js';
import { openDb, runSql, lastTable } from '../src/lib/sqlrun.js';
import { createEngine } from '../src/lib/dax-engine.js';
import { DAX_TABLES, DAX_RELATIONS } from '../src/lib/dax-data.js';
import { Sheet, parseRef } from '../src/lib/sheet.js';
import { valuesEqual } from '../src/lib/util.js';
import { BOOT } from '../src/lib/pyrun.js';
let PY = null;
async function py() { if (!PY) { globalThis.prompt = () => null; const { loadPyodide } = await import('pyodide'); PY = await loadPyodide(); await PY.loadPackage(['numpy', 'pandas', 'matplotlib', 'micropip', 'sqlite3']); await PY.runPythonAsync(BOOT); await PY.runPythonAsync("import micropip\nawait micropip.install('seaborn')"); await PY.runPythonAsync('__dg_patch_seaborn()'); } return PY; }

const only = process.argv[2]; let pass = 0, fail = 0, skip = 0;
const report = (ok, name, msg = '') => { ok ? pass++ : fail++; if (!ok) console.log('FAIL', name, msg); };
const same = (a, b, ordered) => { if (!a || !b || a.rows.length !== b.rows.length) return false; const n = r => r.map(x => x.map(v => (typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v))); let x = n(a.rows), y = n(b.rows); if (!ordered) { const k = r => JSON.stringify(r); x = x.sort((p, q) => k(p).localeCompare(k(q))); y = y.sort((p, q) => k(p).localeCompare(k(q))); } return x.every((r, i) => r.length === y[i].length && r.every((v, j) => valuesEqual(v, y[i][j]))); };

for (const [course, chapters] of Object.entries(EXTRAS)) {
  if (only && only !== course) continue;
  for (const [cid, ex] of Object.entries(chapters)) {
    // quiz sanity
    for (const [i, qz] of (ex.quiz || []).entries()) {
      const ans = Array.isArray(qz.answer) ? qz.answer : [qz.answer];
      report(ans.every(a => a >= 0 && a < qz.options.length) && qz.options.length >= 2 && qz.why, `${course}/${cid} quiz#${i}`, 'bad answer index or missing explanation');
    }
    for (const [li, lab] of (ex.labs || []).entries()) {
      const name = `${course}/${cid}/lab${li} ${lab.title}`;
      try {
        if (lab.type === 'sql' && lab.solution) {
          const a = await openDb(lab.db || 'company'), b = await openDb(lab.db || 'company');
          const got = runSql(a, lab.solution); const err = got.find(r => r.type === 'error');
          if (err) { report(false, name, err.text); continue; }
          let g = lastTable(got); let w = lastTable(runSql(b, lab.solution));
          if (lab.verify) { g = lastTable(runSql(a, lab.verify)); w = lastTable(runSql(b, lab.verify)); }
          // a starter that is only a partial statement must not already pass
          report(!!g && same(g, w, lab.ordered), name, 'solution produced no comparable result');
          if (lab.starter && lab.starter.trim() && !/^--/.test(lab.starter.trim())) { const c = await openDb(lab.db || 'company'); const s = lastTable(runSql(c, lab.starter)); if (s && same(s, w, lab.ordered) && lab.solution !== lab.starter) console.log('WARN starter already solves', name); }
        } else if (lab.type === 'sql') { const a = await openDb(lab.db || 'company'); const r = runSql(a, lab.starter || ''); report(!r.some(x => x.type === 'error') || !lab.starter, name + ' (starter runs)', r.find(x => x.type === 'error')?.text); }
        else if (lab.type === 'dax') {
          const e = createEngine(DAX_TABLES(), DAX_RELATIONS); const src = lab.solutionCode || lab.solution || lab.starter; const res = e.load(src);
          if (res.errors.length) { report(false, name, res.errors[0]); continue; }
          if (lab.expect !== undefined) { const m = res.measures[res.measures.length - 1]; const v = m ? e.evaluate(m, { slicer: [], visual: [] }) : e.evaluate(res.exprs[res.exprs.length - 1], { slicer: [], visual: [] }); report(valuesEqual(typeof v === 'number' ? Math.round(v * 1e4) / 1e4 : v, lab.expect), name, `got ${v} expected ${lab.expect}`); }
          else report(true, name);
        } else if (lab.type === 'excel') {
          const S = new Sheet(lab.sheet || [], lab.rows, lab.cols);
          if (lab.checks) {
            for (const [ref, f] of Object.entries(lab.answers || {})) { const p = parseRef(ref); S.set(p.row, p.col, f); }
            for (const c of lab.checks) { const p = parseRef(c.cell); const v = S.value(p.row, p.col); report(!(v && v.error) && valuesEqual(v, c.expect) && String(S.raw[p.row][p.col]).startsWith('='), name + ' ' + c.cell, `got ${JSON.stringify(v)} expected ${JSON.stringify(c.expect)} raw=${S.raw[p.row][p.col]}`); }
          } else report(true, name);
          S.destroy();
        } else if (lab.type === 'python') {
          if (process.argv[3] === '--nopy') { skip++; continue; }
          const P = await py(); const ns = P.globals.get('dict')(); let out = [];
          P.setStdout({ batched: s => out.push(s) });
          if (!lab.solution && !lab.starter) { report(false, name, 'no code'); continue; }
          if (!lab.task) { try { await P.runPythonAsync(lab.starter, { globals: ns }); report(true, name); } catch (e) { report(false, name + ' (starter)', String(e.message).split('\n').slice(-3).join(' | ')); } continue; }
          try { await P.runPythonAsync(lab.solution, { globals: ns }); } catch (e) { report(false, name + ' (solution)', String(e.message).split('\n').slice(-3).join(' | ')); continue; }
          if (lab.expect !== undefined) report(out.join('\n').trim() === String(lab.expect).trim(), name, `printed ${JSON.stringify(out.join('\n'))}`);
          if (lab.check) { try { await P.runPythonAsync(lab.check, { globals: ns }); report(true, name); } catch (e) { report(false, name + ' (check)', String(e.message).split('\n').slice(-2).join(' | ')); } }
          // the untouched starter must NOT already pass
          if (lab.check && lab.starter) { const ns2 = P.globals.get('dict')(); let passed = false; try { await P.runPythonAsync(lab.starter, { globals: ns2 }); await P.runPythonAsync(lab.check, { globals: ns2 }); passed = true; } catch (e) { /* good */ } if (passed) console.log('WARN starter already passes', name); }
        }
        else if (lab.type === 'widget') { skip++; }
      } catch (e) { report(false, name, e.message); }
    }
  }
}
console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped (python + widgets are tested in the browser)`);
process.exit(fail ? 1 : 0);
