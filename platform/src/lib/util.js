/** Split "a, f(b, c), 'x,y'" at top-level commas. */
export function splitArgs(s) {
  const out = []; let depth = 0, cur = '', q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '(' || ch === '{' || ch === '[') depth++;
    if (ch === ')' || ch === '}' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim() || out.length) out.push(cur.trim());
  return out;
}
/** Replace every call NAME(...) with fn(argsArray) -> string. Nesting and quotes are respected. */
export function rewriteCalls(src, name, fn) {
  const re = new RegExp('\\b' + name + '\\s*\\(', 'gi'); let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    let i = re.lastIndex, depth = 1, q = null;
    for (; i < src.length && depth; i++) { const ch = src[i]; if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '(') depth++; else if (ch === ')') depth--; }
    if (depth) break;
    const inner = src.slice(re.lastIndex, i - 1);
    out += src.slice(last, m.index) + fn(splitArgs(inner).map(a => rewriteCalls(a, name, fn)));
    last = i; re.lastIndex = i;
  }
  return out + src.slice(last);
}
export function fmtNum(v) {
  if (typeof v !== 'number') return v; if (!isFinite(v)) return String(v);
  return Math.abs(v) >= 1000 ? v.toLocaleString(undefined, { maximumFractionDigits: 2 }) : String(Math.round(v * 1e6) / 1e6);
}
export function valuesEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b));
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
}
export const loadScript = (() => {
  const seen = {};
  return src => seen[src] || (seen[src] = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = src; s.onload = res;
    s.onerror = () => { delete seen[src]; rej(new Error('Could not load ' + src + '. Check your internet connection.')); };
    document.head.append(s);
  }));
})();
export const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const cx = (...a) => a.filter(Boolean).join(' ');
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
