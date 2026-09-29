import { launch } from './shot.mjs';
const BASE = process.env.BASE || 'http://localhost:4173/';
const b = await launch(); let fails = 0;
const ok = (c, m) => { console.log(c ? 'ok  ' : 'FAIL', m); if (!c) fails++; };
const ctx = await b.newContext({ viewport: { width: 1500, height: 950 } }); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !/favicon|fonts\./.test(m.text()) && errs.push(m.text()));
const go = async h => { await p.goto(BASE + '#' + h); await p.waitForTimeout(350); };
const email = `test${Date.now()}@example.com`, PW = 'Secret123', NPW = 'Brand9New';
const fill = async (l, v) => p.getByLabel(l, { exact: true }).fill(v);

await go('/'); ok(p.url().endsWith('#/login'), 'unauthenticated visit redirects to /login');
await p.screenshot({ path: '/tmp/login.png' });
// validation
await p.getByRole('button', { name: /Sign in/ }).click(); ok(await p.getByText('Enter a valid email address.').count() === 1, 'login validates empty email');
await fill('Email', 'nobody@example.com'); await fill('Password', 'whatever1A'); await p.getByRole('button', { name: /Sign in/ }).click(); await p.getByText('Incorrect email or password.').waitFor(); ok(true, 'unknown account is rejected without revealing which field');
// sign up
await p.getByRole('link', { name: 'Create an account' }).click(); await p.waitForTimeout(300);
await p.getByRole('button', { name: /Create account/ }).click(); ok(await p.locator('.af-err').count() >= 3, 'signup shows validation errors');
await fill('Full name', 'Test Learner'); await fill('Email', email); await fill('Password', 'weak'); await p.waitForTimeout(100); ok(await p.locator('.meter').count() === 1, 'password strength meter shows');
await fill('Password', PW); await fill('Confirm password', 'Different1'); await p.locator('.af-check input').check(); await p.getByRole('button', { name: /Create account/ }).click(); ok(await p.getByText('Passwords do not match.').count() === 1, 'mismatched confirm rejected');
await fill('Confirm password', PW); await p.screenshot({ path: '/tmp/signup.png' });
await p.getByRole('button', { name: /Create account/ }).click(); await p.locator('.recovery code').waitFor({ timeout: 15000 });
const code = (await p.locator('.recovery code').innerText()).trim(); ok(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/.test(code), 'recovery code shown: ' + code);
const cont = p.getByRole('button', { name: /Continue to my dashboard/ }); ok(await cont.isDisabled(), 'continue disabled until code is acknowledged');
await p.screenshot({ path: '/tmp/recovery.png' });
await p.locator('.af-check input').check(); await cont.click(); await p.waitForTimeout(500);
ok(/Hi, Test/.test(await p.locator('h1').first().innerText()), 'lands on dashboard greeting the new user');
ok((await p.locator('.who').innerText()).includes(email), 'topbar shows account email');
// progress belongs to the account
await go('/subjects/sql/ch1'); await p.getByRole('button', { name: /Mark complete/ }).click(); await go('/');
const acct = await p.locator('.stat-mini').innerText(); ok(/1\s*lessons done/.test(acct.replace(/\n/g, ' ')), 'progress recorded for this account');
// sign out
await p.locator('.user').click(); await p.getByRole('menuitem', { name: /Sign out/ }).click(); await p.waitForTimeout(400); ok(p.url().endsWith('#/login'), 'sign out returns to /login');
await go('/settings'); ok(p.url().endsWith('#/login'), 'protected page redirects after sign out');
// wrong then right password
await fill('Email', email); await fill('Password', 'Wrong1234'); await p.getByRole('button', { name: /Sign in/ }).click(); await p.getByText('Incorrect email or password.').waitFor(); ok(true, 'wrong password rejected');
await fill('Password', PW); await p.getByRole('button', { name: /Sign in/ }).click(); await p.waitForTimeout(600); ok(/Hi, Test/.test(await p.locator('h1').first().innerText()), 'correct password signs in');
// guest is isolated
await p.locator('.user').click(); await p.getByRole('menuitem', { name: /Sign out/ }).click(); await p.waitForTimeout(300);
await p.getByRole('button', { name: /Continue as guest/ }).click(); await p.waitForTimeout(500);
ok(/Hi, Learner/.test(await p.locator('h1').first().innerText()), 'guest mode works');
ok(/0\s*lessons done/.test((await p.locator('.stat-mini').innerText()).replace(/\n/g, ' ')), "guest does not see the account's progress");
await p.locator('.user').click(); await p.getByRole('menuitem', { name: /Leave guest mode/ }).click(); await p.waitForTimeout(300);
// recovery flow
await p.getByRole('link', { name: 'Forgot password?' }).click(); await p.waitForTimeout(300);
await fill('Email', email); await fill('Recovery code', 'AAAA-BBBB-CCCC'); await fill('New password', NPW); await fill('Confirm new password', NPW); await p.getByRole('button', { name: /Reset password/ }).click(); await p.getByText('do not match').waitFor(); ok(true, 'wrong recovery code rejected');
await fill('Recovery code', code.toLowerCase()); await p.getByRole('button', { name: /Reset password/ }).click(); await p.locator('.recovery code').waitFor({ timeout: 15000 });
const code2 = (await p.locator('.recovery code').innerText()).trim(); ok(code2 !== code, 'reset issues a NEW recovery code (old one is single-use)');
await p.locator('.af-check input').check(); await p.getByRole('button', { name: /Continue to my dashboard/ }).click(); await p.waitForTimeout(400);
ok(/Hi, Test/.test(await p.locator('h1').first().innerText()), 'reset signs the user in');
// old password fails, new works
await p.locator('.user').click(); await p.getByRole('menuitem', { name: /Sign out/ }).click(); await p.waitForTimeout(300);
await fill('Email', email); await fill('Password', PW); await p.getByRole('button', { name: /Sign in/ }).click(); await p.getByText('Incorrect email or password.').waitFor(); ok(true, 'old password no longer works');
await fill('Password', NPW); await p.getByRole('button', { name: /Sign in/ }).click(); await p.waitForTimeout(600); ok(/Hi, Test/.test(await p.locator('h1').first().innerText()), 'new password works');
// change password in settings + delete account
await go('/settings'); await fill('Current password', NPW); await fill('New password', 'Third3Pass'); await fill('Confirm new password', 'Third3Pass'); await p.getByRole('button', { name: 'Change password' }).click(); await p.getByText('Password changed.').waitFor(); ok(true, 'change password in settings');
p.once('dialog', d => d.accept()); await fill('Confirm with your password', 'Third3Pass'); await p.getByRole('button', { name: 'Delete my account' }).click(); await p.waitForTimeout(600); ok(p.url().endsWith('#/login'), 'delete account signs out');
await fill('Email', email); await fill('Password', 'Third3Pass'); await p.getByRole('button', { name: /Sign in/ }).click(); await p.getByText('Incorrect email or password.').waitFor(); ok(true, 'deleted account cannot sign in');
// lockout
for (let i = 0; i < 5; i++) { await fill('Password', 'Nope' + i + 'aA'); await p.getByRole('button', { name: /Sign in/ }).click(); await p.waitForTimeout(350); }
ok(await p.getByText(/Too many attempts/).count() > 0, 'lockout after repeated failures');
// storage hygiene: passwords never stored in clear
const dump = await p.evaluate(() => JSON.stringify({ ...localStorage }));
ok(!/Secret123|Brand9New|Third3Pass/.test(dump), 'no plaintext password in storage');
// mobile
const m = await b.newPage({ viewport: { width: 390, height: 800 } }); await m.goto(BASE + '#/login'); await m.waitForTimeout(500); await m.screenshot({ path: '/tmp/login-mobile.png' });
ok(await m.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), 'mobile login: no horizontal scroll');
ok(errs.length === 0, 'no console errors ' + (errs.length ? JSON.stringify(errs.slice(0, 3)) : ''));
await b.close(); console.log(fails ? `\n${fails} FAILED` : '\nall auth checks passed'); process.exit(fails ? 1 : 0);
