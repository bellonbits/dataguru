// Turns ../0N-*.md study notes into src/content/notes.json (one chapter per "## " heading).
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..', '..');
const courses = [
  { id: 'excel',   file: '01-excel.md' },
  { id: 'powerbi', file: '02-power-bi.md' },
  { id: 'sql',     file: '03-sql.md' },
  { id: 'python',  file: '04-python.md' },
  { id: 'ds',      file: '05-data-science.md' },
];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const out = {};
for (const c of courses) {
  const md = fs.readFileSync(path.join(root, c.file), 'utf8');
  const lines = md.split('\n');
  const chapters = [];
  let cur = null, intro = [], inFence = false;
  for (const line of lines) {
    if (line.startsWith('```')) inFence = !inFence;
    const m = !inFence && line.match(/^## (.+)$/);
    if (m) { cur = { title: m[1].trim(), body: [] }; chapters.push(cur); continue; }
    if (cur) cur.body.push(line); else intro.push(line);
  }
  if (!chapters.length) chapters.push({ title: 'Overview', body: lines.filter(l => !l.startsWith('# ')) });
  const introText = intro.filter(l => !l.startsWith('# ')).join('\n').trim();
  const list = [];
  if (introText && c.id !== 'jobs') list.push({ id: 'overview', title: 'Overview', md: introText });
  chapters.forEach((ch, i) => {
    const title = ch.title.replace(/^Chapter\s+(\d+):\s*/i, '$1. ');
    const num = ch.title.match(/^Chapter\s+(\d+)/i);
    list.push({ id: num ? 'ch' + num[1] : slug(ch.title), title, md: ch.body.join('\n').trim() });
  });
  out[c.id] = list;
}
fs.writeFileSync(path.join(root, 'platform', 'src', 'content', 'notes.json'), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) console.log(k, v.length, v.map(x => x.id).join(','));
