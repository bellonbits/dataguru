// Spreadsheet engine wrapper: HyperFormula plus rewrites for functions it lacks (XLOOKUP, AVERAGEIFS) and bare TRUE/FALSE.
import { HyperFormula } from 'hyperformula';
import { rewriteCalls } from './util.js';

export const colName = i => { let s = ''; i++; while (i > 0) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
export const parseRef = ref => { const m = /^([A-Z]+)(\d+)$/i.exec(ref); if (!m) return null; let c = 0; for (const ch of m[1].toUpperCase()) c = c * 26 + ch.charCodeAt(0) - 64; return { col: c - 1, row: +m[2] - 1 }; };

export function toHf(raw) {
  if (typeof raw !== 'string' || raw[0] !== '=') return raw;
  if (/\bUNIQUE\s*\(/i.test(raw)) return '=NA()';
  let f = raw;
  f = rewriteCalls(f, 'XLOOKUP', a => `${a[3] ? 'IFERROR(' : ''}INDEX(${a[2]},MATCH(${a[0]},${a[1]},0))${a[3] ? ',' + a[3] + ')' : ''}`);
  f = rewriteCalls(f, 'VALUE', a => `(${a[0]}*1)`);
  f = rewriteCalls(f, 'AVERAGEIFS', a => {
    const rest = a.slice(1); return `(SUMIFS(${a[0]},${rest.join(',')})/COUNTIFS(${rest.join(',')}))`;
  });
  // bare TRUE / FALSE (outside strings) -> TRUE() / FALSE()
  f = f.split(/("[^"]*")/).map((p, i) => (i % 2 ? p : p.replace(/\b(TRUE|FALSE)\b(?!\s*\()/gi, m => m.toUpperCase() + '()'))).join('');
  // SWITCH(TRUE, ...) works after the rewrite above; criteria with dates like ">1/1/2022" are left as text
  return f;
}

export class Sheet {
  constructor(data, rows, cols) {
    this.rows = Math.max(rows || 0, data.length + 2, 8); this.cols = Math.max(cols || 0, ...data.map(r => r.length), 5);
    this.raw = Array.from({ length: this.rows }, (_, r) => Array.from({ length: this.cols }, (_, c) => (data[r] && data[r][c] !== undefined ? data[r][c] : '')));
    this.hf = HyperFormula.buildFromArray(this.raw.map(r => r.map(v => (v === '' ? null : toHf(v)))), { licenseKey: 'gpl-v3' });
  }
  set(r, c, v) {
    this.raw[r][c] = v;
    this.hf.setCellContents({ sheet: 0, row: r, col: c }, [[toHf(v === '' ? null : v)]]);
  }
  value(r, c) {
    const v = this.hf.getCellValue({ sheet: 0, row: r, col: c });
    if (v && typeof v === 'object' && 'value' in v) return { error: v.value };
    return v === null || v === undefined ? '' : v;
  }
  display(r, c) { const v = this.value(r, c); return v && v.error ? v.error : typeof v === 'number' ? String(Math.round(v * 1e8) / 1e8) : typeof v === 'boolean' ? String(v).toUpperCase() : String(v); }
  destroy() { this.hf.destroy(); }
}
