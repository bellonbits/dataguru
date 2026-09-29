/* Mini DAX engine for the learning platform.
 * Supports the subset taught in the book: aggregations, iterators (X functions), FILTER, CALCULATE,
 * ALL/ALLEXCEPT/ALLSELECTED/KEEPFILTERS, VALUES/DISTINCT, LOOKUPVALUE, IF/SWITCH, date functions, VAR/RETURN.
 * It is NOT the real DAX engine: no time-intelligence (DATESYTD etc.), no GROUPBY/EARLIER, one relationship
 * (Product -> Sales). Unsupported functions raise a clear error. */
const DAXImpl = (function () {
  'use strict';

  // ---------------------------------------------------------------- tokenizer
  function tokenize(src) {
    const t = []; let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) { i++; continue; }
      if (c === '-' && src[i + 1] === '-' || c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
      if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1]))) {
        let j = i; while (j < src.length && /[0-9.]/.test(src[j])) j++;
        t.push({ k: 'num', v: parseFloat(src.slice(i, j)) }); i = j; continue;
      }
      if (c === '"') {
        let j = i + 1, s = '';
        while (j < src.length) { if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; } s += src[j++]; }
        if (j >= src.length) throw new Error('Unterminated string literal');
        t.push({ k: 'str', v: s }); i = j + 1; continue;
      }
      if (c === "'") { const j = src.indexOf("'", i + 1); if (j < 0) throw new Error('Unterminated table name'); t.push({ k: 'id', v: src.slice(i + 1, j), quoted: true }); i = j + 1; continue; }
      if (c === '[') { const j = src.indexOf(']', i); if (j < 0) throw new Error('Missing ]'); t.push({ k: 'br', v: src.slice(i + 1, j) }); i = j + 1; continue; }
      if (/[A-Za-z_]/.test(c)) {
        let j = i; while (j < src.length && /[A-Za-z0-9_.]/.test(src[j])) j++;
        t.push({ k: 'id', v: src.slice(i, j) }); i = j; continue;
      }
      const two = src.slice(i, i + 2);
      if (['<=', '>=', '<>', '&&', '||', '!='].includes(two)) { t.push({ k: 'op', v: two === '!=' ? '<>' : two }); i += 2; continue; }
      if ('+-*/^=<>&(),{};'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
      throw new Error("Unexpected character '" + c + "'");
    }
    return t;
  }

  // ---------------------------------------------------------------- parser (precedence climbing)
  function parse(src) {
    const toks = tokenize(src); let p = 0;
    const peek = () => toks[p], next = () => toks[p++];
    const isOp = v => peek() && peek().k === 'op' && peek().v === v;
    const isId = v => peek() && peek().k === 'id' && !peek().quoted && peek().v.toUpperCase() === v;
    const expect = v => { if (!isOp(v)) throw new Error("Expected '" + v + "'" + (peek() ? " but found '" + peek().v + "'" : ' at end of formula')); p++; };
    const PREC = { '||': 1, '&&': 2, '=': 3, '<>': 3, '<': 3, '>': 3, '<=': 3, '>=': 3, '&': 4, '+': 5, '-': 5, '*': 6, '/': 6, '^': 7 };
    function expr(min = 0) {
      let left = unary();
      for (;;) {
        const t = peek();
        if (!t || t.k !== 'op' || !(t.v in PREC) || PREC[t.v] < min) break;
        p++; const right = expr(PREC[t.v] + 1);
        left = { t: 'bin', op: t.v, l: left, r: right };
      }
      return left;
    }
    function unary() {
      if (isOp('-')) { p++; return { t: 'neg', e: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      if (isId('NOT') && toks[p + 1] && toks[p + 1].v === '(') { p++; expect('('); const e = expr(); expect(')'); return { t: 'not', e }; }
      return primary();
    }
    function primary() {
      const t = next();
      if (!t) throw new Error('Formula ended unexpectedly');
      if (t.k === 'num') return { t: 'num', v: t.v };
      if (t.k === 'str') return { t: 'str', v: t.v };
      if (t.k === 'br') return { t: 'col', table: null, col: t.v };
      if (t.k === 'op' && t.v === '(') { const e = expr(); expect(')'); return e; }
      if (t.k === 'op' && t.v === '{') { const items = []; if (!isOp('}')) { do { items.push(expr()); } while (isOp(',') && p++); } expect('}'); return { t: 'set', items }; }
      if (t.k === 'id') {
        const up = t.v.toUpperCase();
        if (!t.quoted && up === 'TRUE' && !isOp('(')) return { t: 'bool', v: true };
        if (!t.quoted && up === 'FALSE' && !isOp('(')) return { t: 'bool', v: false };
        if (!t.quoted && up === 'VAR') {
          const vars = [];
          for (;;) {
            const name = next(); expect('='); const e = expr(); vars.push([name.v, e]);
            if (isId('VAR')) { p++; continue; }
            if (isId('RETURN')) { p++; break; }
            throw new Error('VAR must be followed by RETURN');
          }
          return { t: 'var', vars, body: expr() };
        }
        if (isOp('(')) {
          p++; const args = [];
          if (!isOp(')')) { do { args.push(isOp(',') || isOp(')') ? { t: 'blank' } : expr()); } while (isOp(',') && p++); }
          expect(')');
          return { t: 'fn', name: up, args };
        }
        if (peek() && peek().k === 'br') { const c = next(); return { t: 'col', table: t.v, col: c.v }; }
        return { t: 'table', name: t.v };
      }
      throw new Error("Unexpected '" + t.v + "'");
    }
    const e = expr();
    if (p < toks.length) throw new Error("Unexpected '" + toks[p].v + "' (check parentheses and commas)");
    return e;
  }

  // ---------------------------------------------------------------- model
  class Model {
    /** tables: {Name: {cols:[..], rows:[{col:val}]}}; relations: [{from:'Sales.Product', to:'Product.ProductName'}] */
    constructor(tables, relations) {
      this.tables = {}; this.relations = relations || []; this.measures = {};
      for (const [n, t] of Object.entries(tables)) this.addTable(n, t.cols, t.rows);
    }
    addTable(name, cols, rows) { rows.forEach((r, i) => { r.__id = i; }); this.tables[name] = { name, cols: cols.slice(), rows }; }
    table(name) {
      const nt = x => nk(x).replace(/s$/, '');
      const k = Object.keys(this.tables).find(x => nt(x) === nt(name));
      if (!k) throw new Error("Table '" + name + "' not found. Available: " + Object.keys(this.tables).join(', '));
      return this.tables[k];
    }
    colName(tbl, col) {
      const k = tbl.cols.find(c => nk(c) === nk(col));
      if (!k) throw new Error("Column '" + col + "' not found in " + tbl.name + '. Columns: ' + tbl.cols.join(', '));
      return k;
    }
    findColumn(col, rowCtx) { // unqualified [col]
      if (rowCtx && this.tables[rowCtx.table]) { const t = this.tables[rowCtx.table]; const k = t.cols.find(c => nk(c) === nk(col)); if (k) return { table: t.name, col: k }; }
      const hits = Object.values(this.tables).filter(t => t.cols.some(c => nk(c) === nk(col)));
      if (hits.length === 1) return { table: hits[0].name, col: hits[0].cols.find(c => nk(c) === nk(col)) };
      if (hits.length > 1) throw new Error('Column [' + col + '] is ambiguous; write Table[' + col + ']');
      return null;
    }
  }

  // ---------------------------------------------------------------- evaluator
  const nk = s => String(s).toLowerCase().replace(/[\s_]/g, '');
  const isTable = v => v && typeof v === 'object' && v.__table;
  const num = v => v === null || v === undefined ? 0 : typeof v === 'boolean' ? (v ? 1 : 0) : typeof v === 'number' ? v : (isNaN(parseFloat(v)) ? NaN : parseFloat(v));
  const dateParts = v => { const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) throw new Error("'" + v + "' is not a date"); return [+m[1], +m[2], +m[3]]; };
  const pad = n => String(n).padStart(2, '0');
  const cmp = (a, b) => { if (a === null) a = typeof b === 'string' ? '' : 0; if (b === null) b = typeof a === 'string' ? '' : 0; return a < b ? -1 : a > b ? 1 : 0; };

  class Ctx {
    constructor(model) { this.model = model; this.filters = []; this.row = null; this.outer = []; this.vars = {}; this.measures = model.measures; }
    clone() { const c = new Ctx(this.model); c.filters = this.filters.slice(); c.row = this.row; c.outer = this.outer; c.vars = this.vars; return c; }
    enterRow(row) { const c = this.clone(); if (this.row) c.outer = [this.row].concat(this.outer); c.row = row; return c; }
  }

  function rowsOf(model, tableName, ctx) {
    const t = model.table(tableName); let rows = t.rows;
    for (const f of ctx.filters) {
      if (f.table === t.name) rows = rows.filter(r => f.rows.has(r.__id));
      else { // propagate across a relationship: filter on the 'one' side restricts the 'many' side
        for (const rel of model.relations) {
          const [mt, mc] = rel.from.split('.'), [ot, oc] = rel.to.split('.');
          if (mt === t.name && ot === f.table) {
            const okVals = new Set(); model.tables[ot].rows.forEach(r => { if (f.rows.has(r.__id)) okVals.add(r[oc]); });
            rows = rows.filter(r => okVals.has(r[mc]));
          }
        }
      }
    }
    return rows;
  }
  const tableVal = (model, name, rows, cols) => ({ __table: true, name, rows, cols: cols || model.table(name).cols });

  function colValues(model, ctx, ref) {
    const t = model.table(ref.table);
    return rowsOf(model, t.name, ctx).map(r => r[ref.col]);
  }
  function resolveCol(model, node, ctx) {
    if (node.table) { const t = model.table(node.table); return { table: t.name, col: model.colName(t, node.col) }; }
    const r = model.findColumn(node.col, ctx.row); if (!r) return null; return r;
  }

  const AGG = {
    SUM: v => v.length ? v.reduce((a, b) => a + num(b), 0) : null,
    AVERAGE: v => { const n = v.filter(x => x !== null); return n.length ? n.reduce((a, b) => a + num(b), 0) / n.length : null; },
    MIN: v => { const n = v.filter(x => x !== null); return n.length ? n.reduce((a, b) => cmp(b, a) < 0 ? b : a) : null; },
    MAX: v => { const n = v.filter(x => x !== null); return n.length ? n.reduce((a, b) => cmp(b, a) > 0 ? b : a) : null; },
    COUNT: v => v.filter(x => typeof x === 'number').length,
    COUNTA: v => v.filter(x => x !== null && x !== '').length,
    COUNTBLANK: v => v.filter(x => x === null || x === '').length,
    DISTINCTCOUNT: v => new Set(v).size,
    DISTINCTCOUNTNOBLANK: v => new Set(v.filter(x => x !== null && x !== '')).size,
    MINA: v => AGG.MIN(v), MAXA: v => AGG.MAX(v), AVERAGEA: v => AGG.AVERAGE(v),
  };
  const ITER = { SUMX: AGG.SUM, AVERAGEX: AGG.AVERAGE, MINX: AGG.MIN, MAXX: AGG.MAX, COUNTX: AGG.COUNT, COUNTAX: AGG.COUNTA };

  function evalNode(n, ctx) {
    const model = ctx.model;
    switch (n.t) {
      case 'num': case 'str': case 'bool': return n.v;
      case 'blank': return null;
      case 'neg': return -num(evalNode(n.e, ctx));
      case 'not': return !evalNode(n.e, ctx);
      case 'set': return n.items.map(i => evalNode(i, ctx));
      case 'var': {
        const c = ctx.clone(); c.vars = Object.assign({}, ctx.vars);
        for (const [name, e] of n.vars) c.vars[name.toLowerCase()] = evalNode(e, c);
        return evalNode(n.body, c);
      }
      case 'table': {
        const low = n.name.toLowerCase();
        if (low in ctx.vars) return ctx.vars[low];
        return tableVal(model, model.table(n.name).name, rowsOf(model, n.name, ctx));
      }
      case 'col': {
        if (!n.table && n.col.toLowerCase() in ctx.vars) return ctx.vars[n.col.toLowerCase()];
        if (!n.table && ctx.row && !ctx.model.tables[ctx.row.table]) { const k = Object.keys(ctx.row.data).find(x => x.toLowerCase() === n.col.toLowerCase()); if (k) return ctx.row.data[k]; }
        if (!n.table && ctx.measures[n.col.toLowerCase()]) return evalMeasure(n.col, ctx);
        const ref = resolveCol(model, n, ctx);
        if (!ref) throw new Error("Cannot find column or measure [" + n.col + "]");
        if (ctx.row && ctx.row.table === ref.table) return ctx.row.data[ref.col];
        throw new Error(ref.table + '[' + ref.col + '] is a whole column here. Wrap it in an aggregation such as SUM(), or use an iterator such as SUMX().');
      }
      case 'bin': {
        if (n.op === '&&') return !!evalNode(n.l, ctx) && !!evalNode(n.r, ctx);
        if (n.op === '||') return !!evalNode(n.l, ctx) || !!evalNode(n.r, ctx);
        const a = evalNode(n.l, ctx), b = evalNode(n.r, ctx);
        switch (n.op) {
          case '+': return num(a) + num(b); case '-': return num(a) - num(b); case '*': return num(a) * num(b);
          case '/': { const d = num(b); if (d === 0) return Infinity; return num(a) / d; }
          case '^': return Math.pow(num(a), num(b));
          case '&': return String(a === null ? '' : a) + String(b === null ? '' : b);
          case '=': return cmp(a, b) === 0; case '<>': return cmp(a, b) !== 0;
          case '<': return cmp(a, b) < 0; case '>': return cmp(a, b) > 0; case '<=': return cmp(a, b) <= 0; case '>=': return cmp(a, b) >= 0;
        }
        throw new Error('Unknown operator ' + n.op);
      }
      case 'fn': return callFn(n, ctx);
    }
    throw new Error('Cannot evaluate ' + n.t);
  }

  function evalMeasure(name, ctx) {
    const m = ctx.measures[name.toLowerCase()];
    if (!m) throw new Error('Unknown measure [' + name + ']');
    if (m.evaluating) throw new Error('Circular reference in [' + name + ']');
    m.evaluating = true;
    try { return evalNode(m.ast, ctx); } finally { m.evaluating = false; }
  }

  // Turn a CALCULATE filter argument into a filter object (or a modifier).
  function filterFromArg(arg, ctx, out) {
    const model = ctx.model;
    if (arg.t === 'fn') {
      const f = arg.name;
      if (f === 'ALL' || f === 'ALLNOBLANKROW') {
        if (!arg.args.length) { out.remove.push({ all: true }); return; }
        for (const a of arg.args) {
          if (a.t === 'table') out.remove.push({ table: model.table(a.name).name });
          else if (a.t === 'col') { const r = resolveCol(model, a, ctx); out.remove.push({ table: r.table, col: r.col }); }
          else throw new Error('ALL() expects a table or columns');
        }
        return;
      }
      if (f === 'ALLEXCEPT') {
        const t = model.table(arg.args[0].name); const keep = arg.args.slice(1).map(a => resolveCol(model, a, ctx).col);
        out.remove.push({ table: t.name, except: keep }); return;
      }
      if (f === 'ALLSELECTED') {
        if (!arg.args.length) { out.remove.push({ all: true, layer: 'visual' }); return; }
        for (const a of arg.args) {
          if (a.t === 'table') out.remove.push({ table: model.table(a.name).name, layer: 'visual' });
          else { const r = resolveCol(model, a, ctx); out.remove.push({ table: r.table, col: r.col, layer: 'visual' }); }
        }
        return;
      }
      if (f === 'KEEPFILTERS') { const inner = { add: [], remove: [] }; filterFromArg(arg.args[0], ctx, inner); inner.add.forEach(x => out.add.push(Object.assign(x, { keep: true }))); return; }
      if (f === 'REMOVEFILTERS') { return filterFromArg({ t: 'fn', name: 'ALL', args: arg.args }, ctx, out); }
    }
    // boolean expression over one table -> row set. Evaluate with every row of the table (ignoring filters on mentioned cols)
    const refs = []; collectCols(arg, refs, ctx);
    if (refs.length && arg.t !== 'fn' && arg.t !== 'table') {
      const tbl = refs[0].table;
      if (refs.some(r => r.table !== tbl)) throw new Error('A CALCULATE filter can only reference one table');
      const t = model.table(tbl); const rows = new Set();
      const cols = [...new Set(refs.map(r => r.col))];
      const c2 = ctx.clone();
      for (const r of t.rows) { if (evalNode(arg, ctx.enterRow({ table: t.name, data: r })) === true) rows.add(r.__id); }
      out.add.push({ table: t.name, cols, rows }); return;
    }
    const v = evalNode(arg, ctx);
    if (isTable(v)) { out.add.push({ table: v.name, cols: null, rows: new Set(v.rows.map(r => r.__id)) }); return; }
    throw new Error('Unsupported filter argument in CALCULATE');
  }
  function collectCols(n, out, ctx) {
    if (!n || typeof n !== 'object') return;
    if (n.t === 'col') { const r = resolveCol(ctx.model, n, ctx); if (r) out.push(r); return; }
    if (n.t === 'fn' && (n.name === 'FILTER' || n.name in ITER)) return;
    for (const k of ['l', 'r', 'e']) if (n[k]) collectCols(n[k], out, ctx);
    if (n.args) n.args.forEach(a => collectCols(a, out, ctx));
  }
  function applyFilters(ctx, spec) {
    const c = ctx.clone(); let fl = c.filters;
    // context transition: the current row becomes a filter
    if (ctx.row && ctx.model.tables[ctx.row.table]) {
      const t = ctx.model.tables[ctx.row.table]; const rc = ctx.row.cols;
      const rows = new Set(rc ? t.rows.filter(r => rc.every(k => r[k] === ctx.row.data[k])).map(r => r.__id) : [ctx.row.data.__id]);
      fl = fl.concat([{ table: t.name, cols: rc || null, rows, layer: 'calc' }]);
    }
    for (const r of spec.remove) {
      fl = fl.filter(f => {
        if (r.layer && f.layer !== r.layer) return true;
        if (r.all) return false;
        if (f.table !== r.table) return true;
        if (r.except) return !!f.cols && f.cols.every(x => r.except.includes(x));
        if (r.col) return !(f.cols === null || f.cols.includes(r.col));
        return false;
      });
    }
    for (const a of spec.add) {
      if (!a.keep && a.cols) fl = fl.filter(f => !(f.table === a.table && f.cols && f.cols.some(x => a.cols.includes(x))));
      fl = fl.concat([{ table: a.table, cols: a.cols, rows: a.rows, layer: 'calc' }]);
    }
    c.filters = fl; if (ctx.row) c.outer = [ctx.row].concat(ctx.outer); c.row = null;
    return c;
  }

  function iterate(tableArg, exprArg, ctx, fn) {
    const t = evalNode(tableArg, ctx);
    if (!isTable(t)) throw new Error('First argument must be a table (for example a table name or FILTER(...))');
    return t.rows.map(r => fn(ctx.enterRow({ table: t.name, data: r, cols: t.partial ? t.cols : null })));
  }

  function callFn(n, ctx) {
    const model = ctx.model, a = n.args, f = n.name;
    const need = (min, max) => { if (a.length < min || (max !== undefined && a.length > max)) throw new Error(f + '() takes ' + (max === min ? min : min + (max ? '–' + max : ' or more')) + ' argument(s)'); };
    if (f in AGG) {
      need(1, 1); const ref = resolveCol(model, a[0], ctx);
      if (a[0].t !== 'col' || !ref) throw new Error(f + '() expects a column such as Table[Column]');
      return AGG[f](colValues(model, ctx, ref));
    }
    if (f in ITER) {
      need(2, 2); const vals = iterate(a[0], a[1], ctx, c => evalNode(a[1], c));
      return ITER[f](vals);
    }
    switch (f) {
      case 'COUNTROWS': { need(1, 1); const t = evalNode(a[0], ctx); if (!isTable(t)) throw new Error('COUNTROWS() expects a table'); return t.rows.length; }
      case 'DIVIDE': { need(2, 3); const d = num(evalNode(a[1], ctx)); return d === 0 || !isFinite(d) ? (a[2] ? evalNode(a[2], ctx) : null) : num(evalNode(a[0], ctx)) / d; }
      case 'BLANK': return null;
      case 'TRUE': return true; case 'FALSE': return false;
      case 'EARLIER': { const k = a[1] ? num(evalNode(a[1], ctx)) : 1; const row = ctx.outer[k - 1]; if (!row) throw new Error('EARLIER() needs an outer row context'); const key = Object.keys(row.data).find(x => x.toLowerCase() === a[0].col.toLowerCase()); if (!key) throw new Error('EARLIER: column ' + a[0].col + ' not in outer row'); return row.data[key]; }
      case 'ERROR': throw new Error(String(evalNode(a[0], ctx)));
      case 'ISBLANK': { const v = evalNode(a[0], ctx); return v === null || v === undefined; }
      case 'IF': { need(2, 3); const c = evalNode(a[0], ctx); return c ? evalNode(a[1], ctx) : (a[2] ? evalNode(a[2], ctx) : null); }
      case 'IFERROR': try { return evalNode(a[0], ctx); } catch (e) { return evalNode(a[1], ctx); }
      case 'AND': return a.every(x => evalNode(x, ctx)); case 'OR': return a.some(x => evalNode(x, ctx));
      case 'SWITCH': {
        const v = evalNode(a[0], ctx); const rest = a.slice(1); const hasDefault = rest.length % 2 === 1;
        for (let i = 0; i + 1 < rest.length; i += 2) if (cmp(v, evalNode(rest[i], ctx)) === 0) return evalNode(rest[i + 1], ctx);
        return hasDefault ? evalNode(rest[rest.length - 1], ctx) : null;
      }
      case 'FILTER': {
        need(2, 2); const t = evalNode(a[0], ctx); if (!isTable(t)) throw new Error('FILTER() expects a table as first argument');
        const rows = t.rows.filter(r => evalNode(a[1], ctx.enterRow({ table: t.name, data: r, cols: t.partial ? t.cols : null })) === true);
        return Object.assign(tableVal(model, t.name, rows, t.cols), { partial: t.partial });
      }
      case 'ALL': case 'ALLNOBLANKROW': {
        const x = a[0]; if (!x) throw new Error('ALL() needs a table or column when used as a table');
        if (x.t === 'table') { const t = model.table(x.name); return tableVal(model, t.name, t.rows); }
        const r = resolveCol(model, x, ctx); const t = model.table(r.table);
        return { __table: true, name: t.name, rows: distinctRows(t.rows, r.col), cols: [r.col], partial: true };
      }
      case 'VALUES': case 'DISTINCT': {
        const x = a[0]; if (x.t === 'table') return evalNode(x, ctx);
        const r = resolveCol(model, x, ctx); const rows = rowsOf(model, r.table, ctx);
        return { __table: true, name: r.table, rows: distinctRows(rows, r.col), cols: [r.col], partial: true };
      }
      case 'SELECTEDVALUE': {
        const r = resolveCol(model, a[0], ctx); const vals = [...new Set(colValues(model, ctx, r))];
        return vals.length === 1 ? vals[0] : (a[1] ? evalNode(a[1], ctx) : null);
      }
      case 'CALCULATE': case 'CALCULATETABLE': {
        need(1); const spec = { add: [], remove: [] };
        for (const arg of a.slice(1)) filterFromArg(arg, ctx, spec);
        const c = applyFilters(ctx, spec);
        if (f === 'CALCULATETABLE') return evalNode(a[0], c);
        return evalNode(a[0], ctx.row ? Object.assign(c, { row: null }) : c);
      }
      case 'LOOKUPVALUE': {
        need(3); const res = resolveCol(model, a[0], ctx); const t = model.table(res.table);
        const pairs = []; for (let i = 1; i + 1 < a.length; i += 2) pairs.push([resolveCol(model, a[i], ctx), evalNode(a[i + 1], ctx)]);
        const hit = t.rows.find(r => pairs.every(([c, v]) => cmp(r[c.col], v) === 0));
        return hit ? hit[res.col] : (a.length % 2 === 0 ? evalNode(a[a.length - 1], ctx) : null);
      }
      case 'RELATED': { const ref = resolveCol(model, a[0], ctx); if (!ctx.row) throw new Error('RELATED() needs a row context'); const rel = model.relations.find(r => r.to.startsWith(ref.table + '.') && r.from.startsWith(ctx.row.table + '.')); if (!rel) throw new Error('No relationship found'); const fk = ctx.row.data[rel.from.split('.')[1]]; const hit = model.tables[ref.table].rows.find(r => r[rel.to.split('.')[1]] === fk); return hit ? hit[ref.col] : null; }
      case 'SUMMARIZE': {
        const t = evalNode(a[0], ctx); const cols = []; const exts = [];
        for (let i = 1; i < a.length; i++) { if (a[i].t === 'str') { exts.push([a[i].v, a[i + 1]]); i++; } else cols.push(resolveCol(model, a[i], ctx)); }
        const groups = new Map();
        for (const r of t.rows) { const k = cols.map(c => r[c.col]).join('\u0001'); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); }
        const rows = []; let id = 0;
        for (const rs of groups.values()) {
          const row = { __id: id++ }; cols.forEach(c => { row[c.col] = rs[0][c.col]; });
          const c2 = ctx.clone(); c2.filters = ctx.filters.concat([{ table: t.name, cols: cols.map(c => c.col), rows: new Set(rs.map(r => r.__id)), layer: 'calc' }]);
          exts.forEach(([nm, e]) => { row[nm] = evalNode(e, c2); });
          rows.push(row);
        }
        return { __table: true, name: t.name + '_summary', rows, cols: cols.map(c => c.col).concat(exts.map(e => e[0])), synthetic: true, isSummary: true };
      }
      case 'CALENDAR': {
        const s = evalNode(a[0], ctx), e = evalNode(a[1], ctx); const rows = []; let id = 0;
        for (let d = new Date(s + 'T00:00:00Z'); d <= new Date(e + 'T00:00:00Z'); d = new Date(d.getTime() + 864e5)) rows.push({ __id: id++, Date: d.toISOString().slice(0, 10) });
        return { __table: true, name: 'Calendar', rows, cols: ['Date'], synthetic: true };
      }
      case 'DATE': { need(3, 3); const d = new Date(Date.UTC(num(evalNode(a[0], ctx)), num(evalNode(a[1], ctx)) - 1, num(evalNode(a[2], ctx)))); return d.toISOString().slice(0, 10); }
      case 'TODAY': return new Date().toISOString().slice(0, 10);
      case 'NOW': return new Date().toISOString().slice(0, 19).replace('T', ' ');
      case 'YEAR': return dateParts(evalNode(a[0], ctx))[0];
      case 'MONTH': return dateParts(evalNode(a[0], ctx))[1];
      case 'DAY': return dateParts(evalNode(a[0], ctx))[2];
      case 'WEEKDAY': { const [y, m, d] = dateParts(evalNode(a[0], ctx)); const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); const type = a[1] ? num(evalNode(a[1], ctx)) : 1; return type === 2 ? (w === 0 ? 7 : w) : type === 3 ? (w + 6) % 7 : w + 1; }
      case 'DATEDIFF': {
        const [y1, m1, d1] = dateParts(evalNode(a[0], ctx)), [y2, m2, d2] = dateParts(evalNode(a[1], ctx));
        const unit = (a[2].t === 'table' || a[2].t === 'col' ? (a[2].name || a[2].col) : String(evalNode(a[2], ctx))).toUpperCase();
        const t1 = Date.UTC(y1, m1 - 1, d1), t2 = Date.UTC(y2, m2 - 1, d2);
        if (unit === 'DAY') return Math.round((t2 - t1) / 864e5);
        if (unit === 'WEEK') return Math.trunc((t2 - t1) / (7 * 864e5));
        if (unit === 'MONTH') return (y2 - y1) * 12 + (m2 - m1);
        if (unit === 'QUARTER') return Math.trunc(((y2 - y1) * 12 + (m2 - m1)) / 3);
        if (unit === 'YEAR') return y2 - y1;
        throw new Error('DATEDIFF unit must be DAY, WEEK, MONTH, QUARTER or YEAR');
      }
      case 'DATEVALUE': return String(evalNode(a[0], ctx)).slice(0, 10);
      case 'LEFT': return String(evalNode(a[0], ctx)).slice(0, a[1] ? num(evalNode(a[1], ctx)) : 1);
      case 'RIGHT': { const s = String(evalNode(a[0], ctx)); const k = a[1] ? num(evalNode(a[1], ctx)) : 1; return s.slice(Math.max(0, s.length - k)); }
      case 'UPPER': return String(evalNode(a[0], ctx)).toUpperCase();
      case 'LOWER': return String(evalNode(a[0], ctx)).toLowerCase();
      case 'CONCATENATE': return String(evalNode(a[0], ctx)) + String(evalNode(a[1], ctx));
      case 'FORMAT': return String(evalNode(a[0], ctx));
      case 'ROUND': { const k = Math.pow(10, a[1] ? num(evalNode(a[1], ctx)) : 0); return Math.round(num(evalNode(a[0], ctx)) * k) / k; }
      case 'ABS': return Math.abs(num(evalNode(a[0], ctx)));
      case 'INT': return Math.floor(num(evalNode(a[0], ctx)));
      case 'SQRT': return Math.sqrt(num(evalNode(a[0], ctx)));
      case 'MAXA_': return null;
    }
    const unsupported = ['EARLIEST', 'GROUPBY', 'DATESYTD', 'DATESMTD', 'DATESQTD', 'TOTALYTD', 'SAMEPERIODLASTYEAR', 'PREVIOUSYEAR', 'DATEADD', 'PARALLELPERIOD', 'TIME', 'HOUR', 'MINUTE', 'SECOND', 'TEXT', 'ISFILTERED', 'RANKX', 'TOPN'];
    if (unsupported.includes(f)) throw new Error(f + '() is real DAX but is not supported by this practice engine. Try it in Power BI Desktop.');
    throw new Error('Unknown function ' + f + '()');
  }
  function distinctRows(rows, col) {
    const seen = new Set(), out = []; let id = 0;
    for (const r of rows) if (!seen.has(r[col])) { seen.add(r[col]); out.push({ __id: r.__id, [col]: r[col] }); }
    return out;
  }

  // ---------------------------------------------------------------- definitions & running
  /** Split editor text into definitions. A definition starts at an unindented line "Name = ..." (or "Table[Col] = ...",
   *  or a bare "= ...") while brackets are balanced; VAR/RETURN lines continue the current definition. */
  function splitDefinitions(text) {
    const defs = []; let cur = null, depth = 0;
    const startRe = /^(?!\s)(?!(?:VAR|RETURN)\b)('[^']*'|[^=()\n"'\[\]<>!:]*)(\[[^\]]+\])?\s*:?=(?![=<>])/i;
    for (const line of text.split('\n')) {
      if (/^\s*(--|\/\/)/.test(line)) continue;
      if (depth === 0 && startRe.test(line)) { cur = [line]; defs.push(cur); }
      else if (cur) cur.push(line);
      else if (line.trim()) { cur = [line]; defs.push(cur); }
      let inStr = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') inStr = !inStr;
        else if (!inStr && (ch === '(' || ch === '[')) depth++;
        else if (!inStr && (ch === ')' || ch === ']')) depth--;
      }
      if (depth < 0) depth = 0;
    }
    return defs.map(d => d.join('\n').trim()).filter(Boolean);
  }
  function parseDefinition(def) {
    const src = def.replace(/^(\s*(--|\/\/).*\n)+/g, '').trim(); if (!src) return null;
    // find first '=' or ':=' outside brackets/parens
    let depth = 0, idx = -1;
    for (let i = 0; i < src.length; i++) {
      const c = src[i]; if (c === '(' || c === '[') depth++; else if (c === ')' || c === ']') depth--;
      else if (c === '=' && depth === 0) { idx = i; break; }
    }
    if (idx < 0) return { kind: 'expr', src, ast: parse(src) };
    let lhs = src.slice(0, idx).trim(), body = src.slice(idx + 1).trim();
    if (lhs.endsWith(':')) lhs = lhs.slice(0, -1).trim();
    const colMatch = lhs.match(/^'?([^'\[\]]+)'?\[([^\]]+)\]$/);
    if (colMatch) return { kind: 'column', table: colMatch[1].trim(), col: colMatch[2].trim(), ast: parse(body), src };
    return { kind: 'measure', name: lhs.replace(/^'|'$/g, '') || 'Result', ast: parse(body), src };
  }

  const TABLE_FNS = ['CALENDAR', 'SUMMARIZE', 'DISTINCT', 'VALUES', 'ALL', 'FILTER', 'CALCULATETABLE'];
  function createEngine(tables, relations) {
    const model = new Model(JSON.parse(JSON.stringify(tables)), relations);
    return {
      model,
      /** Load definitions; returns {measures:[names], columns:[..], tables:[..], errors:[..], exprs:[ast]} */
      load(text) {
        const res = { measures: [], columns: [], tables: [], exprs: [], errors: [] };
        model.measures = {};
        // drop previously added calculated columns / tables
        for (const t of Object.values(model.tables)) if (t.added) t.added.forEach(c => { t.cols = t.cols.filter(x => x !== c); t.rows.forEach(r => delete r[c]); }), t.added = [];
        for (const k of Object.keys(model.tables)) if (model.tables[k].synthetic) delete model.tables[k];
        for (const d of splitDefinitions(text)) {
          try {
            const def = parseDefinition(d); if (!def) continue;
            if (def.kind === 'measure' && def.ast.t === 'fn' && TABLE_FNS.includes(def.ast.name)) {
              const v = evalNode(def.ast, new Ctx(model));
              const rows = v.rows.map((r, i) => Object.assign({}, r, { __id: i }));
              model.addTable(def.name, v.cols, rows); model.tables[def.name].synthetic = true;
              res.tables.push(def.name);
            } else if (def.kind === 'measure') {
              model.measures[def.name.toLowerCase()] = { name: def.name, ast: def.ast };
              res.measures.push(def.name);
            } else if (def.kind === 'column') {
              const t = model.table(def.table);
              t.rows.forEach(r => { const c = new Ctx(model); c.row = { table: t.name, data: r }; r[def.col] = evalNode(def.ast, c); });
              if (!t.cols.includes(def.col)) { t.cols.push(def.col); (t.added = t.added || []).push(def.col); }
              res.columns.push(t.name + '[' + def.col + ']');
            } else {
              res.exprs.push(def);
            }
          } catch (e) { res.errors.push(e.message); }
        }
        return res;
      },
      /** Evaluate a measure or an expression AST under filter layers ({slicer:[{table,col,values}], visual:[...]}) */
      evaluate(nameOrDef, layers) {
        const ctx = new Ctx(model);
        for (const layer of ['slicer', 'visual']) for (const f of (layers && layers[layer]) || []) {
          const t = model.table(f.table); const rows = new Set(t.rows.filter(r => f.values.includes(r[f.col])).map(r => r.__id));
          ctx.filters.push({ table: t.name, cols: [f.col], rows, layer });
        }
        if (typeof nameOrDef === 'string') return evalMeasure(nameOrDef, ctx);
        return evalNode(nameOrDef.ast, ctx);
      },
      distinct(table, col) { const t = model.table(table); return [...new Set(t.rows.map(r => r[col]))]; },
    };
  }

  return { createEngine, parse, tokenize, isTable };
})();
export const { createEngine, parse, tokenize, isTable } = DAXImpl;
export default DAXImpl;
