import { searchNotes } from './search.js';

/** Common beginner errors with plain-English explanations (used by the offline tutor). */
export const ERROR_HELP = [
  [/#name\?/i, 'Excel shows #NAME? when it does not recognise a function or a name. Check the spelling, and put text in "quotes".'],
  [/#n\/a/i, '#N/A from a lookup means the value was not found. With VLOOKUP make sure the 4th argument is FALSE and the lookup column is the leftmost column; with XLOOKUP check for trailing spaces (use TRIM).'],
  [/#value!/i, '#VALUE! usually means text where a number was expected (e.g. numbers stored as text). Convert with VALUE() or Format Cells → Number.'],
  [/#div\/0/i, 'You divided by zero. Guard it: =IF(B2=0,0,A2/B2), or in DAX use DIVIDE(a, b).'],
  [/no such (column|table)/i, 'SQL cannot find that column or table. Check spelling and which table you selected. Use the "Tables in this database" list under the editor.'],
  [/syntax error/i, 'A syntax error means the statement is malformed. Look for a missing comma, quote or parenthesis, or a clause in the wrong order (SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY).'],
  [/(indentationerror|unexpected indent)/i, 'Python uses indentation to define blocks. Indent the body of if / for / def by the same amount (4 spaces) and do not mix tabs and spaces.'],
  [/keyerror/i, 'A KeyError means that dictionary key or DataFrame column does not exist. Print df.columns and check the exact spelling and case.'],
  [/nameerror/i, 'A NameError means you used a variable that has not been defined yet. Run the cell that creates it first, and check the spelling.'],
  [/modulenotfounderror/i, 'That package is not loaded in the browser sandbox. NumPy, pandas, Matplotlib and seaborn are supported.'],
  [/(is null|= null)/i, 'In SQL, NULL is never equal to anything, even NULL. Use WHERE col IS NULL / IS NOT NULL.'],
  [/(group by|not in group)/i, 'Every selected column must either appear in GROUP BY or be inside an aggregate such as SUM() or COUNT().'],
];

const STOP = new Set('what how why does the and for with can you use using when where which explain difference between tell about is are do i a an of in to me'.split(' '));
const bestParas = (md, q) => {
  const ts = q.toLowerCase().split(/[^a-z0-9_%]+/).filter(t => t.length > 2 && !STOP.has(t));
  const paras = md.split(/\n\s*\n/).map(p => p.trim()).filter(p => p && !/^\|?[-\s|:]+\|?$/.test(p));
  return paras.map(p => ({ p, s: ts.reduce((a, t) => a + (p.toLowerCase().includes(t) ? 1 : 0), 0) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 2).map(x => x.p);
};

/** Offline tutor: retrieve the most relevant notes and craft a grounded answer. */
export function offlineAnswer(question) {
  const err = ERROR_HELP.find(([re]) => re.test(question));
  const hits = searchNotes(question.replace(/\b(what|how|why|does|is|are|do|explain|difference|between)\b/gi, ' '), 3);
  const sources = hits.map(h => ({ key: h.ch.key, course: h.ch.course, id: h.ch.id, title: h.title }));
  let text = '';
  if (err) text += err[1] + '\n\n';
  if (hits.length) {
    const paras = bestParas(hits[0].ch.md, question);
    if (paras.length) text += (err ? 'From the notes:\n\n' : 'Here is what the notes say:\n\n') + paras.join('\n\n');
    else text += `The most relevant lesson is “${hits[0].title}”.`;
  } else if (!err) text = 'I could not find that in the notes. Try a specific function or concept, like “SUMIFS”, “LEFT JOIN”, “CALCULATE” or “groupby”.';
  return { text: text.trim(), sources };
}

/** Optional: use Claude if the learner supplied their own API key. Retrieval keeps the answer grounded in the book. */
export async function claudeAnswer(question, apiKey, history = []) {
  const hits = searchNotes(question, 3);
  const ctx = hits.map(h => `## ${h.course}: ${h.title}\n${h.ch.md.slice(0, 2500)}`).join('\n\n');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 700,
      system: 'You are a patient data-analysis tutor for beginners (Excel, Power BI/DAX, SQL, Python, data science). Answer briefly with a small example. Prefer the course notes below; say so if the notes do not cover the question.\n\nCOURSE NOTES:\n' + ctx,
      messages: [...history.slice(-6), { role: 'user', content: question }] }),
  });
  if (!res.ok) throw new Error(res.status === 401 ? 'The API key was rejected. Check it in Settings.' : `The API request failed (${res.status}).`);
  const j = await res.json();
  return { text: j.content.map(c => c.text || '').join('').trim(), sources: hits.map(h => ({ key: h.ch.key, course: h.ch.course, id: h.ch.id, title: h.title })) };
}
