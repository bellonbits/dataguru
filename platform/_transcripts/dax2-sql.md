# DAX ch6 + SQL screenshots (verbatim highlights)
SWITCH(Expression, Value1, Result1, Value2, Result2, ..., DefaultResult)
SalesData[CommissionRate] = SWITCH(SalesData[Product], "Product A",0.1, "Product B",0.2, "Product C",0.3, 0.05)
CustomerData[AgeGroup] = SWITCH(TRUE(), CustomerData[Age] < 18,"Under 18", CustomerData[Age] < 30,"18-29", CustomerData[Age] < 50,"30-49", CustomerData[Age] >= 50,"50 or older")
## SQL
CREATE DATABASE sales; CREATE TABLE customers (customer_id INT, customer_name VARCHAR(50), customer_email VARCHAR(50));
ALTER TABLE customers ADD customer_phone VARCHAR(15); ALTER TABLE customers ALTER COLUMN customer_email VARCHAR(100);
DROP DATABASE sales; DROP TABLE customers;
INSERT INTO employees (employee_id, first_name, last_name, salary) VALUES (1001,'John','Doe',50000);
multi: (1002,'Jane','Smith',60000),(1003,'Bob','Johnson',70000),(1004,'Mary','Williams',80000)
UPDATE employees SET salary = 60000 WHERE employee_id = 1001; UPDATE employees SET first_name='Samantha' WHERE last_name='Smith';
DELETE FROM employees WHERE employee_id = 1001; DELETE FROM employees WHERE salary < 50000;
SELECT FirstName, LastName FROM Employees; SELECT DepartmentName FROM Departments;
WHERE DepartmentID = 1 ; WHERE DepartmentName != 'IT' ; SELECT * FROM Employees LIMIT 2;
Book's "first employee per department" (p135): SELECT Employees.FirstName, Employees.LastName, Departments.DepartmentName FROM Departments INNER JOIN Employees ON Departments.DepartmentID = Employees.DepartmentID WHERE Employees.EmployeeID IN (SELECT EmployeeID FROM Employees WHERE DepartmentID = Departments.DepartmentID ORDER BY EmployeeID LIMIT 1);
ORDER BY FirstName ASC ; ORDER BY DepartmentName DESC
AND: WHERE DepartmentID = 1 AND LastName = 'Smith' ; DepartmentID = 2 AND FirstName = 'Sarah'
OR: DepartmentID = 1 OR LastName = 'Brown' ; DepartmentID = 2 OR FirstName = 'David'
WHERE DepartmentID IS NULL ; WHERE LastName LIKE 'S%' ; WHERE LastName LIKE 'B%' AND DepartmentID IS NULL
## SQL dialect = T-SQL / SQL Server (DATEADD, DATEDIFF(interval,...), DATEPART, LEN, IF..BEGIN..END, PRINT), with some MySQL (LIMIT, IFNULL)
ORDER BY salary ASC; ORDER BY last_name ASC, first_name ASC; ORDER BY salary DESC; ORDER BY last_name DESC, first_name DESC
INNER JOIN: SELECT Employees.FirstName, Employees.LastName, Departments.DepartmentName FROM Employees INNER JOIN Departments ON Employees.DepartmentID = Departments.DepartmentID;
(reverse) FROM Departments INNER JOIN Employees ON ... ; LEFT JOIN both directions; RIGHT JOIN both; FULL OUTER JOIN both (book's syntax: table1.column_name = table2.column_name)
SELECT SUM(TotalAmount) as Total, COUNT(OrderID) as NumOrders FROM Orders; SELECT AVG(TotalAmount) as AvgTotal FROM Orders;
SELECT Customers.CustomerName, SUM(Orders.TotalAmount) AS TotalAmount FROM Customers INNER JOIN Orders ON Customers.CustomerID = Orders.CustomerID GROUP BY Customers.CustomerName;
SELECT COUNT(DISTINCT Orders.CustomerID) as NumCustomers FROM Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID WHERE Customers.City = 'New York';
SELECT country, SUM(total_spent) AS total_revenue FROM customer GROUP BY country;
SELECT country, AVG(total_spent) AS avg_order_value FROM customer GROUP BY country HAVING avg_order_value > 50;   [book uses alias in HAVING (MySQL ok)]
SELECT * FROM Employees UNION SELECT * FROM MoreEmployees; UNION ALL version
SELECT CONCAT(FirstName,' ',LastName) AS FullName FROM Employees; CONCAT(FirstName,' ',IFNULL(MiddleName,''),' ',LastName)
SELECT SUBSTRING(FirstName,1,3) AS Initials; SUBSTRING(LastName, LEN(LastName)-1, 2) AS LastTwoChars
SELECT * FROM orders WHERE customer_id IN (SELECT customer_id FROM customers WHERE state='CA'); SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);
UPPER(FirstName) AS UppercaseName; LOWER(DepartmentName) AS LowercaseName; TRIM(LastName) AS TrimmedName; UPPER(LOWER(FirstName)) AS Name; SELECT FirstName, TRIM(LastName) AS TrimmedName FROM Employees WHERE LastName LIKE '%o%';
ABS(number): SELECT ABS(value) FROM numbers; SELECT ABS(SUM(amount)) FROM transactions; ROUND(number,num_decimal_places): ROUND(amount,2); ROUND(celsius * 1.8 + 32); MOD(dividend, divisor)
DATEADD(interval, number, date): DATEADD(day,30,order_date) AS new_date; DATEADD(month,3,order_date); DATEDIFF(interval,start_date,end_date): DATEDIFF(day,order_date,delivery_date) AS days_to_delivery; month version months_to_delivery; DATEPART(year, order_date) AS order_year
IF condition BEGIN ... END ELSE BEGIN ... END
IF (SELECT age FROM employees WHERE id=1000) < 30 BEGIN UPDATE employees SET salary = salary * 1.1 WHERE id = 1000 END ELSE BEGIN UPDATE employees SET salary = salary * 1.05 WHERE id = 1000 END
IF (SELECT total_amount FROM orders WHERE id=100) > 1000 BEGIN PRINT 'You have a discount of 10%' END
CASE expression WHEN value1 THEN result1 ... ELSE default_result END
SELECT customer_name, total_purchase_amount, CASE WHEN total_purchase_amount >= 1000 THEN 'Platinum' WHEN total_purchase_amount >= 500 THEN 'Gold' ELSE 'Regular' END AS customer_type FROM customers;
SELECT employee_id, first_name, last_name, salary, CASE WHEN salary < 50000 THEN 'Low' WHEN salary >= 50000 AND salary < 80000 THEN 'Medium' WHEN salary >= 80000 THEN 'High' END AS 'Salary Range' FROM employees;
## SQL set ops/views/normalization (verbatim)
students1 UNION/INTERSECT students2 (name,age,gender); books1 UNION/INTERSECT books2 (title,author,year); employees EXCEPT managers (employee_id/manager_id, first_name,last_name,department); table1 EXCEPT table2
CREATE VIEW customer_info AS SELECT customer_id, first_name, last_name, email, phone FROM customers; SELECT * FROM customer_info WHERE email LIKE '%gmail.com';
ALTER VIEW customer_info AS SELECT customer_id, first_name, last_name, email, phone, address FROM customers INNER JOIN addresses ON customers.customer_id = addresses.customer_id; ... WHERE address LIKE '%Main Street'; DROP VIEW customer_info;
Normalization: CREATE TABLE employees(employee_id INT PRIMARY KEY, first_name VARCHAR(50), last_name VARCHAR(50), department_id INT, salary DECIMAL(10,2));
addresses(address_id PK, employee_id INT, address VARCHAR(100), city VARCHAR(50), state VARCHAR(50), zip_code VARCHAR(10), FOREIGN KEY (employee_id) REFERENCES employees(employee_id));
phone_numbers(phone_number_id PK, employee_id, phone_number VARCHAR(20), FK); departments(department_id PK, department_name VARCHAR(50)); ALTER TABLE employees ADD FOREIGN KEY (department_id) REFERENCES departments(department_id);
zip_codes(zip_code VARCHAR(10) PK, state, city); ALTER TABLE addresses ADD FOREIGN KEY (zip_code) REFERENCES zip_codes(zip_code);
## Python screenshots: standard code matching prose. Notables:
invalid names: 3var=30 (starts with number), my-var=40 (dash), my_var!=50 (special char). valid: my_variable=10, myVar="Hello", _myVar=20
dict examples: {"name":"John","age":30,"city":"New York"}, {1:"apple",2:"banana",3:"cherry"}
loops vs comprehension for squares [1,4,9,16,25] and evens of 1..9 -> [2,4,6,8]
x=5,y=2: + 7, - 3, * 10, / 2.5, % 1, ** 25 ; comparisons T,F,F,T,T,F ; logical: x>3 and y<5 True; x>3 or y<1 True; not(x>3 and y<1) True
augmented assign x+=2 ... ; bitwise x=5,y=3: & 1, | 7, ^ 6, ~x -6, x<<2 20, x>>1 2 ; membership 2 in [1..5] True, 6 not in x True
if age=20 -> eligible; age=15 elif 17 else -> "You are not old enough to vote yet."; for fruits; while i<=5 print 1..5
break at 5 prints 0-4; continue prints 0-4,6-9
