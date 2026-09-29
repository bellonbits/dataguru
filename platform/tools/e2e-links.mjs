import { launch } from './shot.mjs';
const BASE = process.env.BASE || 'http://localhost:4173/'; const b = await launch(); let fails = 0;
const ok = (c, m) => { console.log(c ? 'ok  ' : 'FAIL', m); if (!c) fails++; };
const p = await b.newPage({ viewport: { width: 1500, height: 900 } });
await p.goto(BASE + '#/'); await p.getByRole('button', { name: /Continue as guest/ }).click(); await p.waitForTimeout(300);
await p.goto(BASE + '#/subjects/sql/ch7'); await p.waitForTimeout(500);
const route = () => p.evaluate(() => location.hash);
const scrolled = () => p.evaluate(() => document.getElementById('content').scrollTop);
for (const [label, id] of [['Practice (4)', 'practice'], ['Quiz', 'quiz'], ['My notes', 'mynotes'], ['Notes', 'notes']]) {
  await p.locator('.jump').getByText(label, { exact: label !== 'Practice (4)' }).click(); await p.waitForTimeout(900);
  ok((await route()) === '#/subjects/sql/ch7', `"${label}" keeps the route`);
  ok(!(await p.getByText('Page not found').count()), `"${label}" does not show Page not found`);
  if (id !== 'notes') ok((await scrolled()) > 100, `"${label}" scrolls to its section`);
}
await p.locator('.toc').first().getByText('Quiz').click(); await p.waitForTimeout(800); ok((await route()) === '#/subjects/sql/ch7', 'rail "On this page" link keeps the route');
await p.goto(BASE + '#/assignments'); await p.waitForTimeout(400); await p.locator('.ch-row').first().click(); await p.waitForTimeout(1200);
ok(/#\/subjects\/.+/.test(await route()) && !(await p.getByText('Page not found').count()), 'assignment deep link opens its lesson'); ok((await scrolled()) > 100, 'assignment deep link scrolls to #practice');
await p.keyboard.press('Tab'); await p.getByText('Skip to content').focus(); await p.getByText('Skip to content').press('Enter'); await p.waitForTimeout(200);
ok(!(await p.getByText('Page not found').count()), 'skip link does not break routing');
await b.close(); console.log(fails ? `\n${fails} FAILED` : '\nall link checks passed'); process.exit(fails ? 1 : 0);
