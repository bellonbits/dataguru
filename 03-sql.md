# SQL

Source: *Data Analysis Made Easy*, pp. 113–190. The book shows its queries as screenshots. The queries below are reconstructed from the surrounding text. They use standard SQL, with MySQL and SQL Server variants noted.

## Sample data used throughout the book

**Employees**

| EmployeeID | FirstName | LastName | DepartmentID |
|---|---|---|---|
| 1 | John | Smith | 1 |
| 2 | Sarah | Johnson | 2 |
| 3 | Alex | Brown | NULL |
| 4 | David | Lee | 3 |

**Departments**

| DepartmentID | DepartmentName |
|---|---|
| 1 | Sales |
| 2 | Marketing |
| 3 | Finance |
| 4 | IT |

## Chapter 1: What is SQL?

SQL (Structured Query Language) manages and queries relational databases.

- **Database** is an organized collection of data. A **table** has **columns** (fields) and **rows** (records).
- **Primary key** uniquely identifies a row. **Foreign key** references another table's primary key.
- **Index** speeds up lookups.
- **Query** is a request for data.
- **View** is a virtual table defined by a query.
- **Alias** is a temporary name. `SELECT column_name AS alias FROM table_name AS t;` (`AS` is optional.)

## Chapter 2: Managing databases

```sql
CREATE DATABASE sales;
CREATE TABLE customers (
  customer_id    INT PRIMARY KEY,
  customer_name  VARCHAR(100),
  customer_email VARCHAR(50)
);

ALTER TABLE customers ADD customer_phone VARCHAR(20);
ALTER TABLE customers ALTER COLUMN customer_email VARCHAR(100);  -- SQL Server; MySQL: MODIFY COLUMN

DROP TABLE customers;
DROP DATABASE sales;
```

## Chapter 3: Insert, update, delete

```sql
INSERT INTO employees (employee_id, first_name, last_name, salary)
VALUES (1001, 'John', 'Doe', 50000);

INSERT INTO employees (employee_id, first_name, last_name, salary)
VALUES (1002, 'Jane', 'Smith', 60000),
       (1003, 'Bob', 'Johnson', 70000),
       (1004, 'Mary', 'Williams', 80000);   -- multi-row

UPDATE employees SET salary = 60000 WHERE employee_id = 1001;
UPDATE employees SET first_name = 'Samantha' WHERE last_name = 'Smith';

DELETE FROM employees WHERE employee_id = 1001;
DELETE FROM employees WHERE salary < 50000;
```

Always include a `WHERE` on UPDATE and DELETE. Without one, every row is affected.

## Chapter 4: Basic SELECT

```sql
SELECT FirstName, LastName FROM Employees;
SELECT DepartmentName FROM Departments;
SELECT FirstName, LastName FROM Employees WHERE DepartmentID = 1;   -- John Smith
SELECT DepartmentName FROM Departments WHERE DepartmentName <> 'IT';
SELECT * FROM Employees LIMIT 2;              -- MySQL/Postgres; SQL Server: SELECT TOP 2 *
SELECT * FROM Employees ORDER BY FirstName;   -- ascending by default
SELECT * FROM Departments ORDER BY DepartmentName DESC;
```

Clause order: `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT`.

## Chapter 5: Filtering rows

```sql
WHERE DepartmentID = 1 AND LastName = 'Smith'        -- AND: all conditions true
WHERE DepartmentID = 1 OR LastName = 'Brown'         -- OR: at least one
WHERE DepartmentID IS NULL                           -- NULL test: use IS NULL, never = NULL
WHERE LastName LIKE 'S%'                             -- % = any string, _ = one character
WHERE LastName LIKE 'B%' AND DepartmentID IS NULL    -- Alex Brown
```

Note: the book says "last name starts with S" returns Smith and Johnson. Johnson starts with J, so only Smith actually matches.

## Chapter 6: Sorting

```sql
SELECT * FROM employees ORDER BY salary ASC;
SELECT * FROM employees ORDER BY last_name ASC, first_name ASC;   -- multi-column
SELECT * FROM employees ORDER BY salary DESC;
SELECT * FROM employees ORDER BY last_name DESC, first_name DESC;
```

## Chapter 7: Joins

| Join | Returns |
|---|---|
| `INNER JOIN` | Only rows with a match in both tables |
| `LEFT JOIN` | All left rows plus matches. Non-matches get NULLs. |
| `RIGHT JOIN` | All right rows plus matches |
| `FULL OUTER JOIN` | All rows from both sides |

```sql
SELECT e.FirstName, e.LastName, d.DepartmentName
FROM Employees e
INNER JOIN Departments d ON e.DepartmentID = d.DepartmentID;
```
- **INNER:** John/Sales, Sarah/Marketing, David/Finance. Alex has no department and IT has no employee, so both are dropped.
- **LEFT (Employees first):** the INNER rows plus Alex Brown with a NULL department.
- **LEFT (Departments first):** all four departments, and IT shows NULL employee columns.
- **RIGHT:** every department appears, and IT is listed with NULLs.
- **FULL OUTER:** Alex/NULL and IT/NULL both appear.

You can join on multiple columns with `ON a.x = b.x AND a.y = b.y`.

## Chapter 8: Aggregation

Sample **Orders** (5 rows totalling 1000.00) and **Customers** (John Smith/New York, Sarah Johnson/London, Alex Brown/Paris).

```sql
SELECT SUM(TotalAmount) AS Total, COUNT(*) AS NumOrders FROM Orders;   -- 1000.00, 5
SELECT AVG(TotalAmount) AS AvgTotal FROM Orders;                        -- 200.00

SELECT c.CustomerName, SUM(o.TotalAmount) AS TotalAmount
FROM Orders o JOIN Customers c ON o.CustomerID = c.CustomerID
GROUP BY c.CustomerName;                       -- John 350, Sarah 350, Alex 300

SELECT country, SUM(revenue) FROM customer GROUP BY country;

SELECT country, AVG(order_value) AS avg_order_value
FROM customer GROUP BY country
HAVING AVG(order_value) > 50;
```

- `WHERE` filters rows **before** grouping.
- `HAVING` filters groups **after** aggregation.
- Most databases do not allow the alias in HAVING, so repeat the expression, as above.

## Chapter 9: Combining and modifying data

```sql
SELECT * FROM Employees UNION     SELECT * FROM MoreEmployees;   -- removes duplicates
SELECT * FROM Employees UNION ALL SELECT * FROM MoreEmployees;   -- keeps duplicates (faster)

SELECT CONCAT(FirstName, ' ', LastName) AS FullName FROM Employees;
SELECT CONCAT(FirstName, ' ', IFNULL(MiddleName,''), ' ', LastName) FROM Employees; -- MySQL; SQL Server: ISNULL

SELECT SUBSTRING(FirstName, 1, 3) AS Initials FROM Employees;              -- Joh, Sar, Ale, Dav
SELECT SUBSTRING(LastName, LEN(LastName)-1, 2) AS LastTwoChars FROM Employees;  -- th, on, wn, ee
```

Note: the book's first-example table happens to have no duplicates, so UNION and UNION ALL look identical there.

## Chapter 10: Subqueries

A subquery is a query nested inside another query.

```sql
SELECT * FROM orders
WHERE customer_id IN (SELECT customer_id FROM customers WHERE state = 'CA');

SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

## Chapter 11: String manipulation

```sql
SELECT UPPER(FirstName) AS UppercaseName FROM Employees;
SELECT LOWER(DepartmentName) AS LowercaseName FROM Departments;
SELECT TRIM(LastName) AS TrimmedName FROM Employees;
SELECT UPPER(LOWER(FirstName)) AS Name FROM Employees;               -- functions can be nested
SELECT FirstName, TRIM(LastName) AS TrimmedName FROM Employees WHERE LastName LIKE '%o%';
```

## Chapter 12: Numeric manipulation

```sql
SELECT ABS(value) FROM numbers;                       -- absolute value
SELECT SUM(ABS(amount)) FROM transactions;
SELECT ROUND(amount, 2) FROM sales;                   -- 2 decimal places
SELECT ROUND(celsius * 9/5 + 32, 0) AS fahrenheit FROM temperature;
SELECT MOD(dividend, divisor) FROM numbers;           -- remainder (or dividend % divisor)
```

## Chapter 13: Date and time

```sql
SELECT DATEADD(day, 30, order_date)   AS new_date FROM orders;    -- SQL Server syntax
SELECT DATEADD(month, 3, order_date)  AS new_date FROM orders;
SELECT DATEDIFF(day,   order_date, delivery_date) AS days_to_delivery   FROM orders;
SELECT DATEDIFF(month, order_date, delivery_date) AS months_to_delivery FROM orders;
SELECT DATEPART(year, order_date) AS order_year FROM orders;
```

MySQL uses `DATE_ADD(order_date, INTERVAL 30 DAY)` and `EXTRACT(YEAR FROM order_date)`.

## Chapter 14: Conditional logic

SQL's SWITCH equivalent is `CASE`.

```sql
SELECT customer_name, total_purchase_amount,
  CASE WHEN total_purchase_amount >= 1000 THEN 'Platinum'
       WHEN total_purchase_amount >= 500  THEN 'Gold'
       ELSE 'Regular' END AS customer_type
FROM customers;

SELECT employee_id, first_name, last_name, salary,
  CASE WHEN salary < 50000 THEN 'Low'
       WHEN salary < 80000 THEN 'Medium'
       ELSE 'High' END AS 'Salary Range'
FROM employees;
```

The `IF` statement is T-SQL style (SQL Server) and runs a block conditionally. This is the book's code:
```sql
IF (SELECT age FROM employees WHERE id = 1000) < 30
BEGIN
    UPDATE employees SET salary = salary * 1.1 WHERE id = 1000
END
ELSE
BEGIN
    UPDATE employees SET salary = salary * 1.05 WHERE id = 1000
END

IF (SELECT total_amount FROM orders WHERE id = 100) > 1000
BEGIN
    PRINT 'You have a discount of 10%'
END
```

## Chapter 15: Combining queries (set operators)

Both queries must have the same number of columns with compatible types.

| Operator | Result |
|---|---|
| `UNION` | Combined distinct rows |
| `INTERSECT` | Rows in both results |
| `EXCEPT` | Rows in the first result and not the second (`MINUS` in Oracle) |

```sql
SELECT name, age, gender FROM students1 UNION     SELECT name, age, gender FROM students2;
SELECT title, author, year FROM books1  INTERSECT SELECT title, author, year FROM books2;
SELECT first_name, last_name, department FROM employees
EXCEPT
SELECT first_name, last_name, department FROM managers;
```

## Chapter 16: Views

```sql
CREATE VIEW customer_info AS
SELECT customer_id, first_name, last_name, email, phone FROM customers;

SELECT * FROM customer_info WHERE email LIKE '%gmail.com';

ALTER VIEW customer_info AS                     -- MySQL: CREATE OR REPLACE VIEW
SELECT c.customer_id, c.first_name, c.last_name, c.email, c.phone, a.address
FROM customers c INNER JOIN addresses a ON c.customer_id = a.customer_id;

DROP VIEW customer_info;
```

Uses: simplify complex queries and restrict which columns users can see (security).

## Chapter 17: Normalization

The goal is less redundancy and better integrity.

| Form | Rule |
|---|---|
| **1NF** | Every column holds atomic (indivisible) values. There are no repeating groups. |
| **2NF** | 1NF, plus every non-key column depends on the whole primary key. |
| **3NF** | 2NF, plus no transitive dependencies (a non-key column depending on another non-key column). |

The book's worked example (page 196–197 screenshots) starts from `employees(employee_id, first_name, last_name, address, city, state, zip_code, phone_number, department_id, salary)`. It splits this into three parts:
- Separate `address` and `phone` tables.
- A `departments` table.
- A `zip_codes` table, because state depends on zip code.

The book's wording on 1NF is loose: 1NF means splitting multi-valued or composite data, not storing every phone digit in its own column.


### Normalization: the book's actual DDL

```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50),
  department_id INT, salary DECIMAL(10,2));

CREATE TABLE addresses (
  address_id INT PRIMARY KEY, employee_id INT, address VARCHAR(100),
  city VARCHAR(50), state VARCHAR(50), zip_code VARCHAR(10),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id));

CREATE TABLE phone_numbers (
  phone_number_id INT PRIMARY KEY, employee_id INT, phone_number VARCHAR(20),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id));

CREATE TABLE departments (department_id INT PRIMARY KEY, department_name VARCHAR(50));
ALTER TABLE employees ADD FOREIGN KEY (department_id) REFERENCES departments(department_id);

CREATE TABLE zip_codes (zip_code VARCHAR(10) PRIMARY KEY, state VARCHAR(50), city VARCHAR(50));
ALTER TABLE addresses ADD FOREIGN KEY (zip_code) REFERENCES zip_codes(zip_code);
```

## Dialect note (from the screenshots)

The book's code is mostly **T-SQL (SQL Server)**: `DATEADD(day, 30, d)`, `DATEDIFF(day, a, b)`, `DATEPART`, `LEN`, `IF … BEGIN … END`, `PRINT`. It also uses MySQL/PostgreSQL forms in places (`LIMIT`, `IFNULL`, alias in `HAVING`). The in-browser SQL playground runs SQLite, so the lessons give an SQLite equivalent next to each T-SQL form.
