import { q } from './helpers.js';

// DAX labs run on the in-browser DAX engine against the practice data model (Sales, Products, Customers, Employees, Orders, Tasks).
export default {
  overview: { quiz: [q('Power BI Desktop vs Power BI Service?', ['Desktop authors reports on Windows; Service shares them in the cloud', 'They are the same thing', 'Service is a database', 'Desktop is only for dashboards'], 0, 'You build in Desktop, publish to the Service, then share dashboards.')] },
  ch1: {
    labs: [{ type: 'dax', title: 'Measure vs calculated column', starter: '-- A calculated column is computed per row and stored:\nSales[Size] = IF(Sales[SalesAmount] > 1000, "Large", "Small")\n\n-- A measure is computed at query time, in the current filter context:\nLarge Orders = COUNTROWS(FILTER(Sales, Sales[Size] = "Large"))\n\nTotal Sales = SUM(Sales[SalesAmount])', groupBy: 'Sales.Region' }],
    quiz: [
      q('A calculated column…', ['Is evaluated per row and stored in the table', 'Reacts to slicers like a measure', 'Only exists in the report canvas', 'Is written in M'], 0, 'It is static: it ignores the report’s filter context. Measures respond to filters.'),
      q('Which table type holds numeric, measurable data?', ['Fact table', 'Dimension table', 'Calendar table', 'Lookup table'], 0, 'Dimension tables describe who/what/when/where.'),
      q('A slicer is…', ['An on-canvas control that filters visuals', 'A DAX function', 'A data source', 'A kind of measure'], 0, 'Filters can also be set in the filter pane.'),
      q('Dashboards live in…', ['The Power BI Service', 'Power Query', 'Excel only', 'DAX'], 0, 'A dashboard is a one-page collection of tiles pinned from reports.'),
    ],
  },
  ch2: {
    labs: [{ type: 'widget', name: 'powerquery', title: 'Power Query: build Applied Steps' }],
    quiz: [
      q('What does ETL stand for?', ['Extract, Transform, Load', 'Edit, Test, Launch', 'Enter, Trim, List', 'Export, Translate, Link'], 0, 'Power Query is the ETL tool inside Power BI.'),
      q('Append vs Merge queries?', ['Append stacks similar tables; Merge joins tables on keys', 'They are the same', 'Append joins; Merge stacks', 'Both delete rows'], 0, 'Append = UNION, Merge = JOIN.'),
      q('Which language underlies Power Query’s advanced editor?', ['M', 'DAX', 'SQL', 'R'], 0, 'DAX is for the model; M is for transformations.'),
      q('Where do you see every transformation you applied?', ['Applied Steps pane', 'Fields pane', 'Format pane', 'Bookmarks'], 0, 'Each step can be edited or deleted, and the query replays from the source on refresh.'),
      q('After cleaning your data you click…', ['Close & Apply', 'Publish only', 'Export', 'Refresh preview'], 0, 'It loads the result into the data model.'),
    ],
  },
  ch3: {
    labs: [{ type: 'widget', name: 'starschema', title: 'Build a star schema' }],
    quiz: [
      q('In a star schema, relationships are typically…', ['One-to-many from dimension to fact', 'Many-to-many everywhere', 'One-to-one only', 'From fact to fact'], 0, 'Each dimension key appears once in the dimension and many times in the fact table.'),
      q('Cross-filter direction “Single” means…', ['Filters flow from the one side to the many side only', 'Filters flow both ways', 'No filtering', 'Only one slicer allowed'], 0, 'Use “Both” sparingly; it can create ambiguity.'),
      q('Which are best practices?', ['Use a star schema', 'Create a Date table', 'Include every column “just in case”', 'Avoid many-to-many relationships'], [0, 1, 3], 'Minimize columns to keep the model small and fast.'),
      q('A role-playing dimension is…', ['One Date table used as Order Date and Ship Date', 'A hidden table', 'A measure', 'A slicer'], 0, 'Create multiple relationships (only one active) or duplicate the table.'),
    ],
  },
  ch4: {
    labs: [
      { type: 'dax', title: 'SUM', task: 'Write a measure that returns the total of Sales[SalesAmount].', starter: 'Total Sales Amount = ', solution: 'Total Sales Amount = SUM(Sales[SalesAmount])', expect: 67791, groupBy: 'Sales.Region', hint: 'SUM(Table[Column])' },
      { type: 'dax', title: 'COUNTROWS with FILTER', task: 'Count the sales rows whose Price is above 100.', starter: 'Big Ticket Sales = ', solution: 'Big Ticket Sales = COUNTROWS(FILTER(Sales, Sales[Price] > 100))', expect: 23, hint: 'COUNTROWS(FILTER(Sales, condition))' },
      { type: 'dax', title: 'DISTINCTCOUNT', task: 'How many different products appear in Sales?', starter: 'Products Sold = ', solution: 'Products Sold = DISTINCTCOUNT(Sales[Product])', expect: 6 },
      { type: 'dax', title: 'MAXX with FILTER', task: 'What is the highest salary among employees younger than 30?', starter: 'Max Young Salary = ', solution: 'Max Young Salary = MAXX(FILTER(Employees, Employees[Age] < 30), [Salary])', expect: 64000, hint: 'MAXX(table, expression) evaluates the expression for each row.' },
      { type: 'dax', title: 'SUMX: row by row', task: 'Total revenue computed as Price × Quantity per row, then summed.', starter: 'Revenue = ', solution: 'Revenue = SUMX(Sales, Sales[Price] * Sales[Quantity])', expect: 67791, hint: 'SUMX iterates the table and adds the expression’s results.' },
      { type: 'dax', title: 'DATEDIFF', task: 'How many years lie between 1 Jan 1980 and 1 Jan 2022?', starter: 'Years = ', solution: 'Years = DATEDIFF(DATE(1980, 1, 1), DATE(2022, 1, 1), YEAR)', expect: 42 },
      { type: 'dax', title: 'Calculated table with CALENDAR', task: 'Create a Calendar table for all of 2021, then a measure Days that counts its rows.', starter: 'Calendar = CALENDAR(DATE(2021, 1, 1), DATE(2021, 12, 31))\n\nDays = ', solution: 'Calendar = CALENDAR(DATE(2021, 1, 1), DATE(2021, 12, 31))\n\nDays = COUNTROWS(Calendar)', expect: 365 },
    ],
    quiz: [
      q('SUM vs SUMX?', ['SUM adds a column; SUMX evaluates an expression per row then adds', 'Identical', 'SUMX is for text', 'SUM ignores filters'], 0, 'SUMX(Sales, [Price]*[Qty]) is revenue; SUM cannot multiply two columns.'),
      q('COUNT vs COUNTA?', ['COUNT counts numeric values; COUNTA counts non-blank values of any type', 'Same', 'COUNTA counts blanks', 'COUNT is for text'], 0, 'The book’s description of COUNTA (“even if blank”) is inaccurate.'),
      q('DISTINCTCOUNT counts…', ['Unique values in a column', 'All rows', 'Blank cells', 'Tables'], 0, 'DISTINCTCOUNTNOBLANK skips the blank value.'),
      q('COUNTROWS(table) returns…', ['The number of rows', 'The number of columns', 'The sum', 'The max'], 0, 'It works on tables and table expressions like FILTER(…).'),
      q('WEEKDAY(date) with the default return type gives Monday as…', ['1', '2', '0', '7'], 1, 'Default: Sunday = 1 … Saturday = 7. Use return type 2 to make Monday 1.'),
    ],
  },
  ch5: {
    labs: [
      { type: 'dax', title: 'CALCULATE with a column filter', task: 'Total sales for the West region only.', starter: 'West Sales = ', solution: 'West Sales = CALCULATE(SUM(Sales[SalesAmount]), Sales[Region] = "West")', expect: 12539, hint: 'CALCULATE(expression, filter1, filter2…)' },
      { type: 'dax', title: 'CALCULATE with FILTER on dates', task: 'Sales from 1 Jan 2022 to 31 Mar 2022.', starter: 'Q1 2022 = ', solution: 'Q1 2022 = CALCULATE(SUM(Sales[SalesAmount]), FILTER(Sales, Sales[Date] >= DATE(2022,1,1) && Sales[Date] <= DATE(2022,3,31)))', expect: 4454 },
      { type: 'dax', title: 'ALL and ALLSELECTED: % of total', task: 'Create a % of total measure. Use “Rows: Sales[Region]” below, then add a Year slicer and watch the denominator.', starter: 'Total Sales = SUM(Sales[SalesAmount])\n\nShare of all regions = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Sales[Region])))\n\nShare of selection = DIVIDE([Total Sales], CALCULATE([Total Sales], ALLSELECTED(Sales[Region])))', groupBy: 'Sales.Region', solution: 'Share of selection = DIVIDE([Total Sales], CALCULATE([Total Sales], ALLSELECTED(Sales[Region])))', hint: 'ALL ignores every filter on the column; ALLSELECTED keeps the slicer selection but drops the row filter.' },
      { type: 'dax', title: 'ALLEXCEPT', starter: 'Total Sales = SUM(Sales[SalesAmount])\n\nCategory total for the same region = CALCULATE([Total Sales], ALLEXCEPT(Sales, Sales[Region]))\n\nAll sales = CALCULATE([Total Sales], ALL(Sales))', groupBy: 'Sales.Region' },
      { type: 'dax', title: 'LOOKUPVALUE', task: 'Return the product name for ID "P001" from Products, or "Unknown" if it does not exist.', starter: 'Product Name = ', solution: 'Product Name = LOOKUPVALUE(Products[ProductName], Products[ProductID], "P001", "Unknown")', expect: 'Trail Bike' },
      { type: 'dax', title: 'DIVIDE instead of /', task: 'Return -1 (not an error) when dividing 5 by 0.', starter: 'Safe = ', solution: 'Safe = DIVIDE(5, 0, -1)', expect: -1 },
      { type: 'dax', title: 'VAR and RETURN', task: 'Growth: (2022 sales − 2021 sales) / 2021 sales using VAR for each year.', starter: 'Growth =\nVAR Prev = CALCULATE(SUM(Sales[SalesAmount]), Sales[Year] = 2021)\nVAR Cur = ', solution: 'Growth =\nVAR Prev = CALCULATE(SUM(Sales[SalesAmount]), Sales[Year] = 2021)\nVAR Cur = CALCULATE(SUM(Sales[SalesAmount]), Sales[Year] = 2022)\nRETURN DIVIDE(Cur - Prev, Prev)', expect: 0.6422, hint: 'Finish with RETURN DIVIDE(Cur - Prev, Prev)' },
    ],
    quiz: [
      q('CALCULATE does what?', ['Evaluates an expression in a modified filter context', 'Adds two numbers', 'Creates a table', 'Sorts data'], 0, 'It is the most important DAX function.'),
      q('ALL(Sales[Region]) inside CALCULATE…', ['Removes the filter on Region', 'Selects all regions in a slicer', 'Counts regions', 'Deletes the column'], 0, 'Use it for “% of grand total” calculations.'),
      q('ALLEXCEPT(Sales, Sales[Region]) keeps…', ['Only the filter on Region', 'Everything but Region', 'No filters', 'Only slicers'], 0, 'It removes all other filters on the table.'),
      q('ALLSELECTED differs from ALL because it…', ['Keeps filters the user selected in slicers or outer filters', 'Is faster', 'Ignores the visual entirely', 'Only works on dates'], 0, 'The book’s wording on this is inverted; it is used for % of visible total.'),
      q('KEEPFILTERS…', ['Adds a filter without overwriting the existing one on that column', 'Removes filters', 'Keeps the file open', 'Copies filters to another table'], 0, 'Normally CALCULATE’s filter replaces the existing filter on the same column.'),
      q('Why prefer DIVIDE(a, b) over a / b?', ['It handles division by zero gracefully', 'It is spelled shorter', 'It rounds', 'It filters'], 0, 'It returns BLANK (or your alternate result) instead of an error.'),
    ],
  },
  ch6: {
    labs: [
      { type: 'dax', title: 'IF in a calculated column', task: 'Add a calculated column Sales[SalesCategory] = "High" if SalesAmount > 1000, else "Low". Then a measure High Rows counting the High rows.', starter: 'Sales[SalesCategory] = \n\nHigh Rows = ', solution: 'Sales[SalesCategory] = IF(Sales[SalesAmount] > 1000, "High", "Low")\n\nHigh Rows = COUNTROWS(FILTER(Sales, Sales[SalesCategory] = "High"))', expect: 22 },
      { type: 'dax', title: 'SWITCH by value', task: 'Employees[Rate] = commission rate by department: Sales 0.1, Finance 0.2, IT 0.3, anything else 0.05. Then Total Commission = SUMX(Employees, Salary × Rate).', starter: 'Employees[Rate] = SWITCH(Employees[Department],\n    "Sales", 0.1,\n    \n)\n\nTotal Commission = ', solution: 'Employees[Rate] = SWITCH(Employees[Department], "Sales", 0.1, "Finance", 0.2, "IT", 0.3, 0.05)\n\nTotal Commission = SUMX(Employees, Employees[Salary] * Employees[Rate])', expect: 87400, hint: 'The last argument of SWITCH is the default.' },
      { type: 'dax', title: 'SWITCH(TRUE()): ranges', task: 'Customers[AgeGroup]: "Under 18", "18-29", "30-49", "50 or older". Then count the customers aged 50 or older.', starter: 'Customers[AgeGroup] = SWITCH(TRUE(),\n    Customers[Age] < 18, "Under 18",\n    \n)\n\nSenior Count = ', solution: 'Customers[AgeGroup] = SWITCH(TRUE(), Customers[Age] < 18, "Under 18", Customers[Age] < 30, "18-29", Customers[Age] < 50, "30-49", Customers[Age] >= 50, "50 or older")\n\nSenior Count = COUNTROWS(FILTER(Customers, Customers[AgeGroup] = "50 or older"))', expect: 2 },
    ],
    quiz: [
      q('SWITCH(TRUE(), cond1, r1, cond2, r2, default) is used to…', ['Test ranges/conditions in order like nested IFs', 'Match exact values only', 'Loop', 'Convert types'], 0, 'The first TRUE condition wins.'),
      q('In DAX, a calculated column formula…', ['Is evaluated for each row', 'Is evaluated once per visual', 'Cannot use IF', 'Cannot reference other columns'], 0, 'This is “row context”.'),
    ],
  },
  ch7: {
    labs: [{ type: 'widget', name: 'dashboard', title: 'Interactive dashboard: cross-filtering' }],
    quiz: [
      q('Best visual for a trend over time?', ['Line chart', 'Pie chart', 'Table', 'Card'], 0, 'Bars/columns compare categories; pies show composition.'),
      q('Cross-filtering means…', ['Selecting a value in one visual filters the others', 'Deleting duplicates', 'Merging tables', 'Changing colours'], 0, 'It is on by default between visuals on a page.'),
      q('Key Influencers is an example of…', ['An AI-driven visual', 'A standard chart', 'A map', 'A slicer'], 0, 'Also: Decomposition Tree and Smart Narratives.'),
      q('Which practices make reports better?', ['Keep it simple', 'Use consistent colours and fonts', 'Add every possible visual to one page', 'Highlight key insights'], [0, 1, 3], 'Too many visuals slow the report and hide the message.'),
    ],
  },
};
