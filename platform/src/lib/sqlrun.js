// In-browser SQL (SQLite via sql.js) with a small T-SQL compatibility shim, because the book's SQL is SQL Server style.
import initSqlJs from 'sql.js';
import { rewriteCalls } from './util.js';

const wasmUrl = new URL('../../node_modules/sql.js/dist/sql-wasm.wasm', import.meta.url).href;
let SQLP;
export const loadSql = () => SQLP || (SQLP = initSqlJs({ locateFile: () => (typeof window === 'undefined' ? decodeURIComponent(new URL(wasmUrl).pathname) : wasmUrl) }));

const PRESETS = {
  company: `
CREATE TABLE Departments (DepartmentID INT PRIMARY KEY, DepartmentName TEXT);
INSERT INTO Departments VALUES (1,'Sales'),(2,'Marketing'),(3,'Finance'),(4,'IT');
CREATE TABLE Employees (EmployeeID INT PRIMARY KEY, FirstName TEXT, LastName TEXT, DepartmentID INT);
INSERT INTO Employees VALUES (1,'John','Smith',1),(2,'Sarah','Johnson',2),(3,'Alex','Brown',NULL),(4,'David','Lee',3);
CREATE TABLE MoreEmployees (EmployeeID INT PRIMARY KEY, FirstName TEXT, LastName TEXT, DepartmentID INT);
INSERT INTO MoreEmployees VALUES (5,'Mary','White',2),(6,'John','Doe',1),(7,'Alex','Smith',NULL),(8,'Jane','Lee',3);`,
  shop: `
CREATE TABLE Customers (CustomerID INT PRIMARY KEY, CustomerName TEXT, City TEXT);
INSERT INTO Customers VALUES (100,'John Smith','New York'),(200,'Sarah Johnson','London'),(300,'Alex Brown','Paris');
CREATE TABLE Orders (OrderID INT PRIMARY KEY, CustomerID INT, OrderDate TEXT, TotalAmount REAL);
INSERT INTO Orders VALUES (1,100,'2022-01-01',250),(2,200,'2022-02-01',150),(3,100,'2022-03-01',100),(4,300,'2022-04-01',300),(5,200,'2022-05-01',200);
CREATE TABLE customer (customer_id INT, name TEXT, country TEXT, total_spent REAL);
INSERT INTO customer VALUES (1,'Ann','USA',80),(2,'Bo','USA',30),(3,'Cy','UK',20),(4,'Di','UK',40),(5,'Eli','Nigeria',120),(6,'Fay','Nigeria',75);`,
  hr: `
CREATE TABLE employees (employee_id INT PRIMARY KEY, first_name TEXT, last_name TEXT, MiddleName TEXT, age INT, salary REAL, department TEXT, id INT);
INSERT INTO employees VALUES (1001,'John','Doe',NULL,28,50000,'Sales',1000),(1002,'Jane','Smith','Ann',35,60000,'Marketing',1001),(1003,'Bob','Johnson',NULL,42,70000,'Finance',1002),(1004,'Mary','Williams','K',51,80000,'IT',1003),(1005,'Sam','Smith',NULL,23,45000,'Sales',1004);
CREATE TABLE managers (manager_id INT, first_name TEXT, last_name TEXT, department TEXT);
INSERT INTO managers VALUES (1,'Bob','Johnson','Finance'),(2,'Mary','Williams','IT');
CREATE TABLE customers (customer_id INT PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, phone TEXT, state TEXT, total_purchase_amount REAL);
INSERT INTO customers VALUES (1,'Ann','Lee','ann@gmail.com','555-0101','CA',1200),(2,'Ben','Cruz','ben@yahoo.com','555-0102','NY',650),(3,'Cat','Diaz','cat@gmail.com','555-0103','CA',300),(4,'Dan','Poe','dan@outlook.com','555-0104','TX',90);
CREATE TABLE orders (id INT, order_id INT, customer_id INT, order_date TEXT, delivery_date TEXT, amount REAL, total_amount REAL);
INSERT INTO orders VALUES (100,1,1,'2023-01-05','2023-01-09',120.456,1500),(101,2,2,'2023-02-10','2023-02-25',80.5,90),(102,3,3,'2023-03-15','2023-05-01',45.999,300);
CREATE TABLE addresses (customer_id INT, address TEXT);
INSERT INTO addresses VALUES (1,'12 Main Street'),(2,'9 Oak Ave'),(3,'77 Main Street');
CREATE TABLE students1 (name TEXT, age INT, gender TEXT); INSERT INTO students1 VALUES ('Ola',20,'M'),('Ife',21,'F'),('Kay',19,'F');
CREATE TABLE students2 (name TEXT, age INT, gender TEXT); INSERT INTO students2 VALUES ('Ife',21,'F'),('Tunde',22,'M');
CREATE TABLE books1 (title TEXT, author TEXT, year INT); INSERT INTO books1 VALUES ('Dune','Herbert',1965),('Emma','Austen',1815);
CREATE TABLE books2 (title TEXT, author TEXT, year INT); INSERT INTO books2 VALUES ('Emma','Austen',1815),('Ulysses','Joyce',1922);
CREATE TABLE numbers (value REAL, dividend INT, divisor INT); INSERT INTO numbers VALUES (-5.5,10,3),(3,17,5),(-12,9,4);
CREATE TABLE transactions (amount REAL); INSERT INTO transactions VALUES (100),(-40),(25.5);
CREATE TABLE sales (amount REAL, price REAL); INSERT INTO sales VALUES (10.256,1),(99.999,2),(5.5,3);
CREATE TABLE temperature (celsius REAL); INSERT INTO temperature VALUES (0),(21.5),(37),(100);`,
};
export const SQL_PRESETS = Object.keys(PRESETS);

export async function openDb(preset = 'company') {
  const SQL = await loadSql();
  const db = new SQL.Database();
  db.exec(PRESETS[preset] || PRESETS.company);
  const fn = (name, f) => db.create_function(name, f);
  fn('LEN', s => (s == null ? null : String(s).length));
  fn('MOD', (a, b) => (b === 0 ? null : a % b));
  fn('ISNULL', (a, b) => (a == null ? b : a));
  fn('CONCAT', (...a) => a.map(x => (x == null ? '' : x)).join(''));
  fn('GETDATE', () => new Date().toISOString().slice(0, 19).replace('T', ' '));
  return db;
}

const UNIT = { day: 'day', days: 'day', dd: 'day', d: 'day', month: 'month', months: 'month', mm: 'month', m: 'month', year: 'year', years: 'year', yy: 'year', yyyy: 'year' };
const q = a => a.trim();
/** Translate the book's T-SQL bits into SQLite. Returns {sql, notes[]} */
export function tsqlToSqlite(sql) {
  const notes = [];
  let out = sql;
  out = rewriteCalls(out, 'DATEADD', a => {
    const u = UNIT[q(a[0]).toLowerCase()]; if (!u) return `DATEADD(${a.join(',')})`;
    notes.push('DATEADD → date(x, "+n unit")');
    return `date(${a[2]}, printf('%+d ${u}', ${a[1]}))`;
  });
  out = rewriteCalls(out, 'DATEDIFF', a => {
    const u = UNIT[q(a[0]).toLowerCase()]; if (!u) return `DATEDIFF(${a.join(',')})`;
    notes.push('DATEDIFF → julianday / strftime arithmetic');
    if (u === 'day') return `CAST(julianday(${a[2]}) - julianday(${a[1]}) AS INTEGER)`;
    if (u === 'month') return `((CAST(strftime('%Y', ${a[2]}) AS INTEGER) - CAST(strftime('%Y', ${a[1]}) AS INTEGER)) * 12 + CAST(strftime('%m', ${a[2]}) AS INTEGER) - CAST(strftime('%m', ${a[1]}) AS INTEGER))`;
    return `(CAST(strftime('%Y', ${a[2]}) AS INTEGER) - CAST(strftime('%Y', ${a[1]}) AS INTEGER))`;
  });
  out = rewriteCalls(out, 'DATEPART', a => {
    const u = UNIT[q(a[0]).toLowerCase()]; if (!u) return `DATEPART(${a.join(',')})`;
    notes.push('DATEPART → strftime');
    return `CAST(strftime('${{ year: '%Y', month: '%m', day: '%d' }[u]}', ${a[1]}) AS INTEGER)`;
  });
  return { sql: out, notes: [...new Set(notes)] };
}

/** Split into statements on ; outside quotes. */
export function splitStatements(sql) {
  const out = []; let cur = '', qch = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (qch) { cur += c; if (c === qch) qch = null; continue; }
    if (c === "'" || c === '"') { qch = c; cur += c; continue; }
    if (c === '-' && sql[i + 1] === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
    if (c === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Run statements. Returns [{type:'table',cols,rows}|{type:'info',text}|{type:'error',text}] */
export function runSql(db, text) {
  const results = [];
  for (const raw of splitStatements(text)) {
    const s = raw.replace(/\s+/g, ' ');
    if (/^CREATE DATABASE\b/i.test(s)) { results.push({ type: 'info', text: `Simulated: "${raw}". In SQL Server this creates a new database. Here your practice database already exists, so go straight to CREATE TABLE.` }); continue; }
    if (/^DROP DATABASE\b/i.test(s)) { results.push({ type: 'info', text: `Simulated: "${raw}". In SQL Server this deletes a whole database. Use "Reset data" to restore this sandbox.` }); continue; }
    if (/^ALTER TABLE \S+ ALTER COLUMN\b/i.test(s)) { results.push({ type: 'info', text: 'SQLite cannot change a column type in place. In SQL Server / PostgreSQL this statement works as written. Nothing was changed here.' }); continue; }
    if (/^(IF\b|PRINT\b|BEGIN\b|DECLARE\b)/i.test(s)) { results.push({ type: 'info', text: 'IF … BEGIN … END, PRINT and DECLARE are T-SQL procedural code. SQLite has no procedural language, so study the notes and use CASE expressions in queries instead.' }); continue; }
    if (/^ALTER (VIEW)\b/i.test(s)) { results.push({ type: 'info', text: 'SQLite has no ALTER VIEW. Use DROP VIEW … then CREATE VIEW … instead.' }); continue; }
    const { sql, notes } = tsqlToSqlite(raw);
    try {
      const before = db.getRowsModified();
      const res = db.exec(sql);
      if (res.length) {
        const r = res[res.length - 1];
        results.push({ type: 'table', cols: r.columns, rows: r.values, notes });
      } else {
        const n = db.getRowsModified();
        results.push({ type: 'info', text: /^(INSERT|UPDATE|DELETE)/i.test(s) ? `OK. ${n} row(s) affected.` : 'OK.', notes });
      }
      void before;
    } catch (e) { results.push({ type: 'error', text: e.message }); }
  }
  return results;
}
export const lastTable = results => [...results].reverse().find(r => r.type === 'table');
