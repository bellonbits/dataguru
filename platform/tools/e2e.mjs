import { launch } from './shot.mjs';
const BASE = process.env.BASE || 'http://localhost:4173/';
const b = await launch(); let fails = 0;
const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 } }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push('pageerror: ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/favicon|fonts\.g/.test(m.text())) errs.push('console: ' + m.text()); });
const ok = (c, msg) => { console.log(c ? 'ok  ' : 'FAIL', msg); if (!c) fails++; };
const go = async h => { await p.goto(BASE + '#' + h); await p.waitForTimeout(400); };
const fillEditor = async (nth, text) => { const e = p.locator('.editor').nth(nth); await e.fill(text); };

// 0. the app is gated: continue as guest
await p.goto(BASE + '#/'); await p.getByRole('button', { name: /Continue as guest/ }).click(); await p.waitForTimeout(400);
// 1. dashboard
await go('/'); ok(await p.locator('h1').first().innerText().then(t => /Hi, Learner/.test(t)), 'dashboard greeting');
ok(await p.locator('.subject-card').count() === 5, 'five subject cards');
// 2. SQL lab: solve INNER JOIN
await go('/subjects/sql/ch7');
const sqlLab = p.locator('.lab', { hasText: 'INNER JOIN' }).filter({ has: p.locator('.editor') }).first();
await sqlLab.locator('.editor').fill('SELECT e.FirstName, e.LastName, d.DepartmentName FROM Employees e INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;');
await sqlLab.getByRole('button', { name: /Check answer/ }).click(); await sqlLab.locator('.verdict.ok').waitFor({ timeout: 20000 }).then(() => ok(true, 'SQL check accepts correct answer'), () => ok(false, 'SQL check accepts correct answer'));
await sqlLab.locator('.editor').fill('SELECT FirstName FROM Employees;'); await sqlLab.getByRole('button', { name: /Check answer/ }).click(); await sqlLab.locator('.verdict.bad').waitFor({ timeout: 10000 }).then(() => ok(true, 'SQL check rejects wrong answer'), () => ok(false, 'SQL check rejects wrong answer'));
// join widget
await p.getByRole('radio', { name: /LEFT JOIN/ }).first().click(); ok((await p.locator('.widget').first().innerText()).includes('LEFT JOIN:'), 'join visualizer responds');
// 3. Excel lab
await go('/subjects/excel/ch3');
const xl = p.locator('.lab', { hasText: 'Core functions' }).first();
for (const [ref, f] of [['D1', '=SUM(A1:A6)'], ['D2', '=AVERAGE(A1:A6)'], ['D3', '=COUNT(A1:A6)'], ['D4', '=MAX(A1:A6)'], ['D5', '=MIN(A1:A6)']]) { const c = xl.locator(`input[aria-label="${ref}"]`); await c.click(); await c.fill(f); await c.press('Enter'); }
await xl.getByRole('button', { name: /Check answer/ }).click(); ok(await xl.locator('.verdict.ok').count() === 1, 'Excel check accepts formulas');
// 4. DAX lab
await go('/subjects/powerbi/ch4');
const dax = p.locator('.lab', { hasText: 'SUMX: row by row' }).first(); await dax.locator('.editor').fill('Revenue = SUMX(Sales, Sales[Price] * Sales[Quantity])'); await dax.getByRole('button', { name: /Check answer/ }).click(); ok(await dax.locator('.verdict.ok').count() === 1, 'DAX check accepts measure');
await dax.getByRole('button', { name: /Evaluate/ }).click(); ok((await dax.locator('.out').innerText()).includes('67,791') || (await dax.locator('.out').innerText()).includes('67791'), 'DAX evaluate shows total');
// 5. Python lab (loads Pyodide from CDN)
await go('/subjects/python/ch2');
const py = p.locator('.lab', { hasText: 'Variables and f-strings' }).first(); await py.locator('.editor').fill('name = "John"\nage = 30\nprint(f"{name} is {age}")');
await py.getByRole('button', { name: /Check answer/ }).click(); await py.locator('.verdict').waitFor({ timeout: 120000 }); ok(await py.locator('.verdict.ok').count() === 1, 'Python check accepts correct answer (real Pyodide)');
// plot lab
await go('/subjects/python/ch14'); const pl = p.locator('.lab', { hasText: 'Line, scatter and histogram' }).first(); await pl.getByRole('button', { name: /^Run/ }).click(); await pl.locator('.out img').first().waitFor({ timeout: 120000 }).then(() => ok(true, 'Matplotlib figure rendered'), () => ok(false, 'Matplotlib figure rendered'));
// 6. quiz
await go('/subjects/sql/ch5'); const qz = p.locator('.quiz'); await qz.locator('.q').first().locator('.opt').nth(1).click(); ok(await qz.locator('.opt.right').count() >= 1, 'quiz marks answer');
// 7. widgets render
for (const [h, sel] of [['/subjects/excel/ch9', 'PivotTable'], ['/subjects/excel/ch7', 'Choose the right chart'], ['/subjects/excel/ch5', 'Conditional formatting rules'], ['/subjects/excel/ch10', 'Goal Seek'], ['/subjects/powerbi/ch2', 'Power Query'], ['/subjects/powerbi/ch3', 'star schema'], ['/subjects/powerbi/ch7', 'cross-filtering'], ['/subjects/ds/ch1', 'Regression playground'], ['/subjects/ds/ch2', 'Order the workflow']]) { await go(h); await p.waitForTimeout(500); ok(await p.locator('.widget', { hasText: new RegExp(sel, 'i') }).count() > 0, 'widget renders: ' + sel); }
// dashboard widget cross-filter
await go('/subjects/powerbi/ch7'); const before = await p.locator('.kpi b').first().innerText(); await p.locator('.chips button', { hasText: '2022' }).click(); const after = await p.locator('.kpi b').first().innerText(); ok(before !== after, 'dashboard slicer changes KPI');
// 8. search + tutor + settings
await p.locator('#content').press('/'); await p.keyboard.type('SUMIFS'); await p.waitForTimeout(300); ok(await p.locator('.search-pop a').count() > 0, 'topbar search shows results');
await go('/tutor'); await p.getByLabel('Ask the tutor').fill('difference between WHERE and HAVING'); await p.getByRole('button', { name: /^Ask$/ }).click(); await p.waitForTimeout(600); ok((await p.locator('.msgs').innerText()).toLowerCase().includes('having'), 'tutor answers from notes');
await go('/settings'); await p.locator('#th').selectOption('dark'); ok(await p.evaluate(() => document.documentElement.dataset.theme) === 'dark', 'dark theme toggles');
// 9. progress persisted
await go('/achievements'); ok((await p.locator('.stat b').nth(3).innerText()).includes('/'), 'achievements show lab count');
await go('/'); await p.screenshot({ path: '/tmp/dash-dark.png' });
// 10. mobile
const m = await b.newPage({ viewport: { width: 390, height: 800 } }); await m.goto(BASE + '#/'); await m.waitForTimeout(500); await m.screenshot({ path: '/tmp/mobile.png' });
ok(await m.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2), 'mobile: no horizontal scroll');
ok(errs.length === 0, 'no console/page errors ' + (errs.length ? JSON.stringify(errs.slice(0, 4)) : ''));
await b.close(); console.log(fails ? `\n${fails} FAILED` : '\nall e2e checks passed'); process.exit(fails ? 1 : 0);
