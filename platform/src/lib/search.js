import { ALL_CHAPTERS, courseById } from '../content/courses.js';

const strip = md => md.replace(/```[\s\S]*?```/g, m => m.replace(/```\w*/g, ' ')).replace(/[`*_>#|]/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ');
let index;
function build() {
  return ALL_CHAPTERS.map(ch => ({ ch, title: ch.title, text: strip(ch.md), course: courseById(ch.course).title }));
}
const tokens = q => q.toLowerCase().split(/[^a-z0-9_%]+/).filter(t => t.length > 1);

/** Ranked full-text search over all notes. Title hits weigh most. */
export function searchNotes(q, limit = 12) {
  index = index || build();
  const ts = tokens(q); if (!ts.length) return [];
  const out = [];
  for (const d of index) {
    const lt = d.text.toLowerCase(), ti = d.title.toLowerCase();
    let score = 0, first = -1;
    for (const t of ts) {
      if (ti.includes(t)) score += 8;
      if (d.course.toLowerCase().includes(t)) score += 1;
      let i = lt.indexOf(t), n = 0; if (first < 0 && i >= 0) first = i;
      while (i >= 0 && n < 20) { n++; i = lt.indexOf(t, i + t.length); }
      score += Math.min(n, 12) * (t.length > 3 ? 1.2 : 0.6);
      if (n === 0) score -= 2;
    }
    if (score > 0 && (first >= 0 || ts.some(t => ti.includes(t)))) {
      const s = Math.max(0, first - 60);
      out.push({ ...d, score, snippet: (s > 0 ? '…' : '') + d.text.slice(s, s + 200) + '…' });
    }
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}
