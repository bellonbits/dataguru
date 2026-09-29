import { q } from './helpers.js';

// Labs run on SQLite in the browser. Presets: company (Employees/Departments), shop (Orders/Customers), hr (generic tables).
export default {
  overview: {
    quiz: [
      q('What does SQL stand for?', ['Simple Query Logic', 'Structured Query Language', 'Sequential Question List', 'Stored Query Library'], 1, 'SQL is the Structured Query Language, the standard way to manage and query relational databases.'),
      q('Which SQL dialect does the book mostly use?', ['Oracle PL/SQL', 'SQL Server (T-SQL) with some MySQL', 'Only SQLite', 'Only PostgreSQL'], 1, 'DATEADD, DATEDIFF, DATEPART, LEN and IF…BEGIN…END are T-SQL. The in-browser sandbox translates the common ones.'),
    ],
  },
  'sample-data-used-throughout-the-book': {
    labs: [{ type: 'sql', title: 'Explore the sample tables', db: 'company', starter: 'SELECT * FROM Employees;\n\nSELECT * FROM Departments;' }],
    quiz: [q('In the sample data, why does Alex Brown have no department name in a LEFT JOIN result?', ['He was deleted', 'His DepartmentID is NULL so nothing matches', 'Departments has no rows', 'LEFT JOIN hides names'], 1, 'A NULL DepartmentID matches no row in Departments, so the joined columns are NULL.')],
  },
  ch1: {
    labs: [{ type: 'sql', title: 'Aliases', db: 'company', task: 'Select FirstName under the alias GivenName and LastName under the alias Surname from Employees.', starter: 'SELECT ', solution: 'SELECT FirstName AS GivenName, LastName AS Surname FROM Employees;', hint: 'column_name AS alias_name, separated by a comma.' }],
    quiz: [
      q('A primary key…', ['can contain duplicates', 'uniquely identifies each row', 'always is a text column', 'links to another table’s primary key'], 1, 'A primary key is unique per row. A foreign key is the column that references another table’s primary key.'),
      q('What is a view?', ['A backup of a table', 'A virtual table defined by a query', 'A kind of index', 'A user account'], 1, 'A view is a saved SELECT that behaves like a table but stores no data of its own.'),
      q('What is an index for?', ['Speeding up searches', 'Encrypting data', 'Renaming columns', 'Sorting the whole table permanently'], 0, 'An index is a data structure that lets the database find rows quickly.'),
      q('Is the keyword AS required to create an alias?', ['Yes, always', 'No, it is optional', 'Only for tables', 'Only for columns'], 1, 'SELECT col alias FROM t works the same as SELECT col AS alias FROM t.'),
    ],
  },
  ch2: {
    labs: [
      { type: 'sql', title: 'Create and alter a table', db: 'hr', task: 'Create a table products(product_id INT, product_name TEXT, price REAL). Then add a column category TEXT to it.', starter: '-- SQLite has no CREATE DATABASE: your practice database already exists.\n', solution: 'CREATE TABLE products (product_id INT, product_name TEXT, price REAL);\nALTER TABLE products ADD category TEXT;', verify: "SELECT name FROM pragma_table_info('products') ORDER BY cid;", ordered: true, hint: 'ALTER TABLE products ADD category TEXT;' },
      { type: 'sql', title: 'Drop a table', db: 'hr', task: 'Drop the table managers, then prove it is gone by listing all table names.', starter: '', solution: "DROP TABLE managers;\nSELECT name FROM sqlite_master WHERE type='table';", hint: 'DROP TABLE table_name; then query sqlite_master.' },
    ],
    quiz: [
      q('Which statement changes the structure of an existing table?', ['UPDATE', 'ALTER', 'INSERT', 'SELECT'], 1, 'ALTER TABLE adds, removes or modifies columns. UPDATE changes row values.'),
      q('DROP TABLE customers; does what?', ['Empties the table but keeps it', 'Deletes the table and its data', 'Renames the table', 'Hides the table'], 1, 'DROP removes the table itself. DELETE FROM removes rows but keeps the table.'),
      q('In CREATE TABLE, VARCHAR(50) means…', ['A number up to 50', 'Text up to 50 characters', 'A date', '50 rows'], 1, 'VARCHAR(n) is variable-length text with a maximum of n characters.'),
    ],
  },
  ch3: {
    labs: [
      { type: 'sql', title: 'INSERT rows', db: 'hr', task: 'Insert two employees in one statement: (2001, "Ada", "Obi", NULL, 30, 65000, "IT", 2001) and (2002, "Kofi", "Mensah", NULL, 27, 52000, "Sales", 2002). Then run a SELECT of employee_id, first_name.', starter: 'INSERT INTO employees (employee_id, first_name, last_name, MiddleName, age, salary, department, id)\nVALUES ', solution: "INSERT INTO employees (employee_id, first_name, last_name, MiddleName, age, salary, department, id) VALUES (2001,'Ada','Obi',NULL,30,65000,'IT',2001),(2002,'Kofi','Mensah',NULL,27,52000,'Sales',2002);\nSELECT employee_id, first_name FROM employees;", hint: 'VALUES (…), (…); separate rows with a comma.' },
      { type: 'sql', title: 'UPDATE with WHERE', db: 'hr', task: 'Set the salary of employee 1001 to 60000, then show employee_id and salary for everyone.', starter: '', solution: 'UPDATE employees SET salary = 60000 WHERE employee_id = 1001;\nSELECT employee_id, salary FROM employees;', hint: 'Always include WHERE, or every row changes.' },
      { type: 'sql', title: 'DELETE with WHERE', db: 'hr', task: 'Delete every employee earning less than 50000, then show the remaining employee_ids.', starter: '', solution: 'DELETE FROM employees WHERE salary < 50000;\nSELECT employee_id FROM employees;', hint: 'DELETE FROM employees WHERE salary < 50000;' },
    ],
    quiz: [
      q('What happens if you run UPDATE employees SET salary = 0; with no WHERE?', ['Nothing, it is an error', 'Every row gets salary 0', 'Only the first row changes', 'It asks for confirmation'], 1, 'Without WHERE, UPDATE and DELETE affect all rows. This is the classic beginner disaster.'),
      q('Which inserts several rows in one statement?', ['INSERT INTO t VALUES (1),(2),(3);', 'INSERT MANY INTO t;', 'INSERT t (1,2,3);', 'ADD ROWS t;'], 0, 'List multiple value tuples separated by commas.'),
      q('DELETE FROM t; versus DROP TABLE t;', ['Identical', 'DELETE removes rows, DROP removes the table', 'DROP removes rows, DELETE removes the table', 'DELETE is not valid SQL'], 1, 'DELETE keeps the (now empty) table; DROP deletes its structure too.'),
    ],
  },
  ch4: {
    labs: [
      { type: 'sql', title: 'SELECT specific columns', db: 'company', task: 'List the FirstName and LastName of every employee.', starter: '', solution: 'SELECT FirstName, LastName FROM Employees;', hint: 'SELECT col1, col2 FROM table;' },
      { type: 'sql', title: 'WHERE', db: 'company', task: 'List every department name except IT.', starter: '', solution: "SELECT DepartmentName FROM Departments WHERE DepartmentName != 'IT';", hint: "Use != 'IT' (or <>)." },
      { type: 'sql', title: 'ORDER BY and LIMIT', db: 'company', task: 'Show the two employees whose FirstName comes first alphabetically (all columns).', starter: '', solution: 'SELECT * FROM Employees ORDER BY FirstName ASC LIMIT 2;', ordered: true, hint: 'ORDER BY first, then LIMIT 2.' },
    ],
    quiz: [
      q('Which clause limits the number of rows returned (MySQL / SQLite)?', ['TOP', 'LIMIT', 'ROWS', 'MAX'], 1, 'LIMIT n in MySQL, PostgreSQL and SQLite. SQL Server uses SELECT TOP n.'),
      q('What is the default sort direction of ORDER BY?', ['Descending', 'Ascending', 'Random', 'By primary key'], 1, 'ASC is the default.'),
      q('Pick the correct clause order.', ['SELECT, WHERE, FROM, ORDER BY', 'SELECT, FROM, WHERE, ORDER BY', 'FROM, SELECT, ORDER BY, WHERE', 'WHERE, SELECT, FROM, ORDER BY'], 1, 'SELECT … FROM … WHERE … ORDER BY … LIMIT.'),
    ],
  },
  ch5: {
    labs: [
      { type: 'sql', title: 'AND / OR', db: 'company', task: 'Find employees in department 1 or with last name "Brown".', starter: '', solution: "SELECT * FROM Employees WHERE DepartmentID = 1 OR LastName = 'Brown';", hint: 'OR returns rows meeting at least one condition.' },
      { type: 'sql', title: 'IS NULL', db: 'company', task: 'Find employees with no department assigned.', starter: '', solution: 'SELECT * FROM Employees WHERE DepartmentID IS NULL;', hint: 'Never write = NULL.' },
      { type: 'sql', title: 'LIKE', db: 'company', task: 'Find employees whose last name starts with "S" (all columns).', starter: '', solution: "SELECT * FROM Employees WHERE LastName LIKE 'S%';", hint: "'S%' means S followed by anything." },
      { type: 'sql', title: 'LIKE + NULL together', db: 'company', task: 'Find employees whose last name starts with "B" AND have no department.', starter: '', solution: "SELECT * FROM Employees WHERE LastName LIKE 'B%' AND DepartmentID IS NULL;" },
    ],
    quiz: [
      q('Why does WHERE DepartmentID = NULL return nothing?', ['NULL cannot be typed', 'NULL is never equal to anything; use IS NULL', 'The column is an integer', 'It is a typo for NOT NULL'], 1, 'Comparing to NULL with = yields unknown, not true. Use IS NULL / IS NOT NULL.'),
      q('LIKE \'%son\' matches…', ['Names starting with son', 'Names ending with son', 'Names containing only son', 'Names with three letters'], 1, '% matches any run of characters, so %son means “anything, then son”.'),
      q('In LIKE, what does _ (underscore) match?', ['Any string', 'Exactly one character', 'A space only', 'Nothing'], 1, '% = zero or more characters, _ = exactly one character.'),
      q('AND vs OR: which returns MORE rows for the same two conditions?', ['AND', 'OR', 'They return the same', 'Depends on ORDER BY'], 1, 'OR needs only one condition to be true, so it returns at least as many rows as AND.'),
    ],
  },
  ch6: {
    labs: [
      { type: 'sql', title: 'Sort by two columns', db: 'hr', task: 'List all employees sorted by last_name ascending and then first_name ascending.', starter: '', solution: 'SELECT * FROM employees ORDER BY last_name ASC, first_name ASC;', ordered: true },
      { type: 'sql', title: 'Highest salaries first', db: 'hr', task: 'List first_name and salary, highest salary first.', starter: '', solution: 'SELECT first_name, salary FROM employees ORDER BY salary DESC;', ordered: true },
    ],
    quiz: [
      q('ORDER BY last_name, first_name sorts…', ['By first_name, then last_name', 'By last_name, and ties are broken by first_name', 'Randomly', 'Only by last_name'], 1, 'The first column is the primary sort; later columns break ties.'),
      q('Which keyword sorts from largest to smallest?', ['ASC', 'DESC', 'MAX', 'REVERSE'], 1, 'DESC = descending.'),
    ],
  },
  ch7: {
    labs: [
      { type: 'widget', name: 'joins', title: 'Join visualizer: pick a join and see the rows' },
      { type: 'sql', title: 'INNER JOIN', db: 'company', task: 'Show FirstName, LastName and DepartmentName for employees that have a matching department.', starter: '', solution: 'SELECT e.FirstName, e.LastName, d.DepartmentName FROM Employees e INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;', hint: 'ON e.DepartmentID = d.DepartmentID' },
      { type: 'sql', title: 'LEFT JOIN from Departments', db: 'company', task: 'List every department with its employees (FirstName, LastName). Departments with no employees must still appear.', starter: '', solution: 'SELECT d.DepartmentName, e.FirstName, e.LastName FROM Departments d LEFT JOIN Employees e ON d.DepartmentID = e.DepartmentID;', hint: 'Put Departments on the LEFT side.' },
      { type: 'sql', title: 'Find employees with no department', db: 'company', task: 'Use a LEFT JOIN and a NULL test to list employees whose department does not exist (FirstName only).', starter: '', solution: 'SELECT e.FirstName FROM Employees e LEFT JOIN Departments d ON e.DepartmentID = d.DepartmentID WHERE d.DepartmentID IS NULL;', hint: 'After a LEFT JOIN, unmatched rows have NULL in the right table’s columns.' },
    ],
    quiz: [
      q('Which join keeps every row from the left table?', ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'None'], 1, 'LEFT JOIN keeps all left rows and fills NULLs where the right table has no match.'),
      q('Employees INNER JOIN Departments returns 3 rows for the sample data. Why not 4?', ['A bug', 'Alex Brown has a NULL department so he has no match', 'IT is missing', 'INNER JOIN limits to 3'], 1, 'INNER JOIN drops rows without a match in both tables.'),
      q('What does FULL OUTER JOIN return?', ['Only matches', 'All rows from both tables, with NULLs where there is no match', 'Only the left table', 'Only unmatched rows'], 1, 'It combines LEFT and RIGHT joins.'),
      q('How do you avoid ambiguous column names when joining?', ['You cannot', 'Prefix columns with table names or aliases (e.DepartmentID)', 'Use SELECT *', 'Rename the database'], 1, 'Qualify each column with its table or alias.'),
    ],
  },
  ch8: {
    labs: [
      { type: 'sql', title: 'SUM and COUNT', db: 'shop', task: 'In one query return the total of TotalAmount as Total and the number of orders as NumOrders.', starter: '', solution: 'SELECT SUM(TotalAmount) AS Total, COUNT(OrderID) AS NumOrders FROM Orders;' },
      { type: 'sql', title: 'GROUP BY with a join', db: 'shop', task: 'Show each CustomerName with the total of their orders (TotalAmount).', starter: '', solution: 'SELECT c.CustomerName, SUM(o.TotalAmount) AS TotalAmount FROM Customers c INNER JOIN Orders o ON c.CustomerID = o.CustomerID GROUP BY c.CustomerName;', hint: 'GROUP BY the non-aggregated column.' },
      { type: 'sql', title: 'HAVING', db: 'shop', task: 'From table customer: show each country and its average total_spent, but only countries whose average is above 50.', starter: '', solution: 'SELECT country, AVG(total_spent) AS avg_order_value FROM customer GROUP BY country HAVING AVG(total_spent) > 50;', hint: 'HAVING filters groups after aggregation.' },
      { type: 'sql', title: 'COUNT DISTINCT', db: 'shop', task: 'Count how many distinct customers placed orders from New York.', starter: '', solution: "SELECT COUNT(DISTINCT o.CustomerID) AS NumCustomers FROM Orders o INNER JOIN Customers c ON o.CustomerID = c.CustomerID WHERE c.City = 'New York';" },
    ],
    quiz: [
      q('WHERE vs HAVING?', ['They are identical', 'WHERE filters rows before grouping; HAVING filters groups after', 'HAVING filters rows before grouping', 'WHERE only works with numbers'], 1, 'Use WHERE for row conditions and HAVING for conditions on aggregates.'),
      q('Which column may appear in SELECT with GROUP BY country and no aggregate?', ['Any column', 'Only country (the grouped column)', 'No columns', 'Only numeric columns'], 1, 'Non-aggregated selected columns must be in GROUP BY.'),
      q('COUNT(*) vs COUNT(col)?', ['Same', 'COUNT(*) counts rows; COUNT(col) skips NULLs in col', 'COUNT(col) counts rows', 'COUNT(*) ignores NULL rows'], 1, 'COUNT(col) counts only non-NULL values.'),
      q('AVG(TotalAmount) over 250,150,100,300,200 equals…', ['150', '200', '250', '1000'], 1, 'Sum 1000 divided by 5 orders = 200.'),
    ],
  },
  ch9: {
    labs: [
      { type: 'sql', title: 'UNION vs UNION ALL', db: 'company', task: 'Combine the FirstName column of Employees and MoreEmployees, keeping duplicates ("John" and "Alex" appear twice).', starter: '', solution: 'SELECT FirstName FROM Employees UNION ALL SELECT FirstName FROM MoreEmployees;', hint: 'UNION ALL keeps duplicates.' },
      { type: 'sql', title: 'CONCAT', db: 'company', task: 'Return one column FullName = FirstName + space + LastName for each employee.', starter: '', solution: "SELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM Employees;" },
      { type: 'sql', title: 'SUBSTRING', db: 'company', task: 'Return the first three letters of each FirstName as Initials.', starter: '', solution: 'SELECT SUBSTRING(FirstName, 1, 3) AS Initials FROM Employees;', hint: 'SUBSTRING(string, start, length); start at 1.' },
      { type: 'sql', title: 'Last two characters', db: 'company', task: 'Return the last two characters of each LastName (the book uses LEN).', starter: '', solution: 'SELECT SUBSTRING(LastName, LEN(LastName) - 1, 2) AS LastTwoChars FROM Employees;', hint: 'Start at LEN(LastName) - 1.' },
    ],
    quiz: [
      q('UNION vs UNION ALL?', ['UNION keeps duplicates', 'UNION removes duplicates, UNION ALL keeps them', 'They are identical', 'UNION ALL removes NULLs'], 1, 'UNION does an extra de-duplication step; UNION ALL is faster.'),
      q('What must be true for two SELECTs to be UNIONed?', ['Same table', 'Same number of columns with compatible types', 'Same WHERE', 'Same ORDER BY'], 1, 'Column counts must match and types be compatible.'),
      q('CONCAT(first, NULL, last) in SQL Server / MySQL…', ['Returns NULL in MySQL, treats NULL as empty in SQL Server', 'Always errors', 'Returns the first name only in all databases', 'Returns 0'], 0, 'Behaviour differs; wrap columns in IFNULL/ISNULL/COALESCE to be safe.'),
    ],
  },
  ch10: {
    labs: [
      { type: 'sql', title: 'Subquery with IN', db: 'shop', task: 'List all orders (all columns) placed by customers who live in London.', starter: '', solution: "SELECT * FROM Orders WHERE CustomerID IN (SELECT CustomerID FROM Customers WHERE City = 'London');", hint: 'WHERE CustomerID IN (SELECT …)' },
      { type: 'sql', title: 'Subquery for a calculation', db: 'hr', task: 'List employees whose salary is above the average salary.', starter: '', solution: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);', hint: 'Compare salary to (SELECT AVG(salary) FROM employees).' },
    ],
    quiz: [
      q('A subquery is…', ['A query with no FROM', 'A query nested inside another query', 'A query on a view', 'A stored procedure'], 1, 'It runs first (or per row) and feeds a value or list to the outer query.'),
      q('WHERE salary > (SELECT AVG(salary) FROM employees) returns…', ['Everyone', 'Employees earning more than the average', 'The average', 'Employees earning exactly the average'], 1, 'The subquery yields one number that the outer WHERE compares with.'),
    ],
  },
  ch11: {
    labs: [
      { type: 'sql', title: 'UPPER / LOWER / TRIM', db: 'company', task: 'Show FirstName in uppercase as UppercaseName and department names in lowercase as LowercaseName (two separate SELECTs are fine; the last result is checked: department names lowercase).', starter: 'SELECT UPPER(FirstName) AS UppercaseName FROM Employees;\n', solution: 'SELECT UPPER(FirstName) AS UppercaseName FROM Employees;\nSELECT LOWER(DepartmentName) AS LowercaseName FROM Departments;' },
      { type: 'sql', title: 'Pattern + TRIM', db: 'company', task: 'Show FirstName and TRIM(LastName) as TrimmedName for employees whose last name contains the letter "o".', starter: '', solution: "SELECT FirstName, TRIM(LastName) AS TrimmedName FROM Employees WHERE LastName LIKE '%o%';" },
    ],
    quiz: [
      q('TRIM(\'  hi  \') returns…', ['hi', '  hi', 'hi  ', '  hi  '], 0, 'TRIM removes leading and trailing spaces.'),
      q('UPPER(LOWER(FirstName)) returns…', ['lowercase', 'UPPERCASE (functions nest, inner runs first)', 'the original text', 'an error'], 1, 'The inner LOWER runs first, then UPPER converts the result.'),
    ],
  },
  ch12: {
    labs: [
      { type: 'sql', title: 'ABS and ROUND', db: 'hr', task: 'Show ABS(value) for every row of the numbers table.', starter: '', solution: 'SELECT ABS(value) FROM numbers;' },
      { type: 'sql', title: 'Celsius to Fahrenheit', db: 'hr', task: 'Convert each celsius value in temperature to Fahrenheit (celsius * 1.8 + 32) rounded to a whole number.', starter: '', solution: 'SELECT ROUND(celsius * 1.8 + 32) AS fahrenheit FROM temperature;' },
      { type: 'sql', title: 'MOD', db: 'hr', task: 'Return the remainder of dividend / divisor for each row in numbers.', starter: '', solution: 'SELECT MOD(dividend, divisor) FROM numbers;' },
    ],
    quiz: [
      q('ROUND(3.14159, 2) returns…', ['3', '3.1', '3.14', '3.142'], 2, 'The second argument is the number of decimal places.'),
      q('MOD(17, 5) returns…', ['3', '2', '12', '3.4'], 1, '17 = 3 × 5 + 2, so the remainder is 2.'),
      q('ABS(-5.5) returns…', ['-5.5', '5.5', '0', '5'], 1, 'ABS returns the absolute (positive) value.'),
    ],
  },
  ch13: {
    labs: [
      { type: 'sql', title: 'DATEADD', db: 'hr', task: 'Add 30 days to each order_date in orders, as new_date.', starter: '', solution: 'SELECT DATEADD(day, 30, order_date) AS new_date FROM orders;', hint: 'DATEADD(interval, number, date). The sandbox translates it for SQLite.' },
      { type: 'sql', title: 'DATEDIFF', db: 'hr', task: 'Calculate the days between order_date and delivery_date as days_to_delivery.', starter: '', solution: 'SELECT DATEDIFF(day, order_date, delivery_date) AS days_to_delivery FROM orders;' },
      { type: 'sql', title: 'DATEPART', db: 'hr', task: 'Extract the year of each order_date as order_year.', starter: '', solution: 'SELECT DATEPART(year, order_date) AS order_year FROM orders;' },
    ],
    quiz: [
      q('DATEDIFF(day, \'2023-01-05\', \'2023-01-09\') in T-SQL is…', ['4', '-4', '9', '5'], 0, 'start_date first, end_date second: 4 days between them.'),
      q('Which function extracts the year from a date in T-SQL?', ['YEARONLY', 'DATEPART(year, d)', 'DATEADD(year, d)', 'EXTRACTYEAR'], 1, 'DATEPART(interval, date).'),
      q('MySQL does not have DATEADD(day, 30, d). What is the MySQL form?', ['DATE_ADD(d, INTERVAL 30 DAY)', 'ADDDAYS(d, 30)', 'd + 30 days', 'DATEPLUS(d, 30)'], 0, 'Every dialect names date functions differently, so learn the concept and look up the syntax.'),
    ],
  },
  ch14: {
    labs: [
      { type: 'sql', title: 'CASE: customer tiers', db: 'hr', task: 'From customers return first_name, total_purchase_amount and customer_type: Platinum if >= 1000, Gold if >= 500, otherwise Regular.', starter: '', solution: "SELECT first_name, total_purchase_amount, CASE WHEN total_purchase_amount >= 1000 THEN 'Platinum' WHEN total_purchase_amount >= 500 THEN 'Gold' ELSE 'Regular' END AS customer_type FROM customers;", hint: 'CASE WHEN … THEN … WHEN … THEN … ELSE … END' },
      { type: 'sql', title: 'CASE: salary bands', db: 'hr', task: 'From employees return first_name, salary and a Salary Range column: Low below 50000, Medium from 50000 to 79999, High from 80000.', starter: '', solution: "SELECT first_name, salary, CASE WHEN salary < 50000 THEN 'Low' WHEN salary >= 50000 AND salary < 80000 THEN 'Medium' WHEN salary >= 80000 THEN 'High' END AS 'Salary Range' FROM employees;" },
    ],
    quiz: [
      q('SQL has no SWITCH statement. What is its equivalent?', ['CHOOSE', 'CASE', 'MATCH', 'IF ELSE only'], 1, 'CASE … WHEN … THEN … END is the SQL conditional expression.'),
      q('The book’s IF … BEGIN … END and PRINT are…', ['Standard SQL', 'T-SQL procedural code (SQL Server)', 'MySQL-only', 'PostgreSQL-only'], 1, 'They run inside batches or stored procedures in SQL Server. SQLite has no procedural language.'),
      q('What does CASE return when no WHEN matches and there is no ELSE?', ['0', 'An error', 'NULL', 'The first branch'], 2, 'Add ELSE to avoid unexpected NULLs.'),
    ],
  },
  ch15: {
    labs: [
      { type: 'sql', title: 'INTERSECT', db: 'hr', task: 'List the students who appear in both students1 and students2 (name, age, gender).', starter: '', solution: 'SELECT name, age, gender FROM students1 INTERSECT SELECT name, age, gender FROM students2;' },
      { type: 'sql', title: 'EXCEPT', db: 'hr', task: 'List employees (first_name, last_name, department) who are NOT also managers.', starter: '', solution: 'SELECT first_name, last_name, department FROM employees EXCEPT SELECT first_name, last_name, department FROM managers;', hint: 'EXCEPT = first result minus second result.' },
    ],
    quiz: [
      q('INTERSECT returns…', ['Rows in either result', 'Rows in both results', 'Rows only in the first', 'Rows only in the second'], 1, 'Only rows present in both queries.'),
      q('EXCEPT (MINUS in Oracle) returns…', ['Rows in both', 'Distinct rows in the first result but not the second', 'All rows', 'Rows in the second only'], 1, 'It subtracts the second result set from the first.'),
    ],
  },
  ch16: {
    labs: [
      { type: 'sql', title: 'Create and query a view', db: 'hr', task: 'Create a view customer_info with customer_id, first_name, last_name, email from customers, then select all rows from it where email ends with gmail.com.', starter: '', solution: "CREATE VIEW customer_info AS SELECT customer_id, first_name, last_name, email FROM customers;\nSELECT * FROM customer_info WHERE email LIKE '%gmail.com';" },
      { type: 'sql', title: 'View with a join', db: 'hr', task: 'Create a view customer_addr joining customers to addresses (customer_id, first_name, address). Then select rows whose address ends with "Main Street". (SQLite has no ALTER VIEW: just create it.)', starter: '', solution: "CREATE VIEW customer_addr AS SELECT c.customer_id, c.first_name, a.address FROM customers c INNER JOIN addresses a ON c.customer_id = a.customer_id;\nSELECT * FROM customer_addr WHERE address LIKE '%Main Street';" },
    ],
    quiz: [
      q('A view stores…', ['A copy of the data', 'The query definition only', 'An index', 'A trigger'], 1, 'The data still lives in the base tables.'),
      q('Which are good reasons to use a view?', ['Simplify complex queries', 'Expose only some columns for security', 'Make the base table faster to write to', 'Reuse logic'], [0, 1, 3], 'Views simplify, restrict and reuse; they do not speed up writes.'),
    ],
  },
  ch17: {
    labs: [
      { type: 'sql', title: 'Design a normalized schema', db: 'hr', task: 'Create tables departments(department_id INT PRIMARY KEY, department_name TEXT) and staff(staff_id INT PRIMARY KEY, name TEXT, department_id INT, FOREIGN KEY (department_id) REFERENCES departments(department_id)).', starter: '', solution: 'CREATE TABLE departments (department_id INT PRIMARY KEY, department_name TEXT);\nCREATE TABLE staff (staff_id INT PRIMARY KEY, name TEXT, department_id INT, FOREIGN KEY (department_id) REFERENCES departments(department_id));', verify: "SELECT \"table\", \"from\", \"to\" FROM pragma_foreign_key_list('staff');", hint: 'The FOREIGN KEY clause goes inside the CREATE TABLE parentheses.' },
    ],
    quiz: [
      q('First Normal Form (1NF) requires…', ['No foreign keys', 'Atomic (indivisible) values in every column', 'Only one table', 'A date column'], 1, 'Each cell holds a single value, with no repeating groups.'),
      q('A transitive dependency (violates 3NF) is when…', ['A non-key column depends on another non-key column', 'A key depends on a key', 'Two tables share a name', 'A column is NULL'], 0, 'Example: state depends on zip_code, not on the employee. Move it to a zip_codes table.'),
      q('Why normalize?', ['To reduce redundancy and improve integrity', 'To make queries always faster', 'To avoid using keys', 'To save table names'], 0, 'Less duplicated data means fewer update anomalies. Reads may need more joins.'),
    ],
  },
  'dialect-note-from-the-screenshots': {
    quiz: [q('Which is T-SQL (SQL Server) rather than MySQL?', ['LIMIT 5', 'IFNULL(a, b)', 'DATEADD(day, 30, d)', 'AUTO_INCREMENT'], 2, 'DATEADD(interval, n, date) is SQL Server. MySQL uses DATE_ADD(d, INTERVAL n DAY).')],
  },
};
