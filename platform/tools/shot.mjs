import { chromium } from 'playwright-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const base = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const dirs = fs.readdirSync(base).filter(d => d.startsWith('chromium-'));
const findExe = d => { const root = path.join(base, d); const cands = ['chrome-mac/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium', 'chrome-mac-x64/Chromium.app/Contents/MacOS/Chromium']; return cands.map(c => path.join(root, c)).find(fs.existsSync); };
export const exe = dirs.map(findExe).find(Boolean);
export async function launch() { return chromium.launch({ executablePath: exe, headless: true }); }
if (process.argv[1].endsWith('shot.mjs')) {
  const [url, out, w = 1500, h = 1000] = process.argv.slice(2);
  const b = await launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  await p.screenshot({ path: out }); console.log('errors:', errs.length ? errs : 'none'); await b.close();
}
