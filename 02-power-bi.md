# Power BI

Source: *Data Analysis Made Easy*, pp. 51–112. The book shows its DAX code as screenshots. The formulas below are written from the surrounding text.

Where the book's prose is inaccurate, this file says so and gives the correct behaviour.

## Chapter 1: What is Power BI?

Power BI is Microsoft's business-intelligence and visualization tool.

| Term | Meaning |
|---|---|
| Workspace | Shared environment where a team collaborates on reports and dashboards |
| Dataset | Imported and transformed data used by reports |
| Fact table | Central table of a star schema. Holds numeric, measurable facts. |
| Dimension table | Descriptive context for facts (who, what, when, where) |
| Report | Multi-page interactive set of visuals built on a dataset |
| Dashboard | One-page collection of tiles (visuals or KPIs) from reports |
| Visualization | Chart, table, map, etc. |
| Tile | One component of a dashboard |
| Filter / Slicer | Limit displayed data. A slicer is an on-canvas filter control. |
| Measure | Calculation evaluated at query time, e.g. sum, average, count |
| Calculated column | Formula evaluated per row and stored in the table. It is static and ignores report filter context. |
| Drill-down | Move from a summary view to more detail |
| Power Query | ETL and cleansing tool |
| Power BI Desktop | Windows authoring app |
| Power BI Service | Cloud service for viewing and sharing |

## Chapter 2: Power Query

Power Query is an ETL tool (extract, transform, load). It is also available in Excel.

- It connects to Excel, SQL, web APIs, JSON, XML, SharePoint and more.
- It supports a no-code UI or M code (a functional language).
- Queries are refreshable, and you can view query dependencies.
- **UI parts:** Ribbon, Query Editor, Navigation pane, Query Settings, Preview, Formula bar, and Applied Steps. Each step is recorded and can be edited or deleted.

**Workflow**
1. Home → Transform Data opens the editor.
2. Get Data connects to a source.
3. Transform the data:
   - Filter rows.
   - Change data types.
   - Split or merge columns.
   - Pivot or unpivot.
   - Group by.
   - Add conditional columns.
   - Rename columns.
   - Sort.
4. Combine sources:
   - **Append** stacks similar tables.
   - **Merge** joins different tables.
5. Preview and refine.
6. Close & Apply loads the result into the model.

## Chapter 3: Data modelling

- **Relationships** connect a primary key in one table to a foreign key in another.
- **Star schema** is a fact table (e.g. Sales) plus dimension tables (Products, Customers, Date, Geography).
- **Cardinality:** 1:1, 1:M, M:M. Avoid M:M by using a bridge table or aggregation.
- **Cross-filter direction:** Single or Both.
- **Role-playing dimensions:** one Date table used as Order Date and Ship Date.
- **Calculated tables** and **hierarchies** (Year > Quarter > Month > Day).
- **Normalization** reduces redundancy. **Denormalization** speeds up querying, and star schemas are denormalized.

**Build steps**
1. Load and clean the data.
2. Create relationships in Model View.
3. Design the star schema and avoid circular relationships.
4. Add DAX columns and measures.
5. Optimize by removing unused columns and using aggregations and hierarchies.

**Best practices**
- Use a star schema.
- Create a proper Date table.
- Use friendly names.
- Avoid M:M relationships.
- Minimize columns.
- Validate relationships.

**Example sales model**
- Fact: `Sales(DateKey, ProductKey, CustomerKey, SalesAmount, Quantity)`.
- Dimensions: Date, Product, Customer, each related 1:M to Sales.
- Measures:

```dax
Total Sales   = SUM(Sales[Sales Amount])
Average Sales = AVERAGE(Sales[Sales Amount])
Sales Growth % =
VAR Prev = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
RETURN DIVIDE([Total Sales] - Prev, Prev)
```

The book writes growth with `PREVIOUSYEAR(SUM(...))`. That is not valid DAX, because time-intelligence functions take a date column, so the version above uses `SAMEPERIODLASTYEAR`.

## Chapter 4: DAX aggregation functions

| Function | What it does | Example |
|---|---|---|
| `SUM(col)` | Adds a column | `Total = SUM(sales[sales_amount])` |
| `SUMX(table, expr)` | Row-by-row expression, then sums | `SUMX(sales, sales[price]*sales[qty])` |
| `COUNT(col)` | Counts non-blank **numeric** values | `COUNT(Sales[Revenue])` |
| `COUNTA(col)` | Counts non-blank values of any type | `COUNTA(Customers[Phone])` |
| `COUNTAX(table, expr)` | COUNTA over an expression per row | `COUNTAX(Sales, Sales[Product])` |
| `COUNTBLANK(col)` | Counts blank values | `COUNTBLANK(sales[price])` |
| `COUNTROWS(table)` | Rows in a table or table expression | `COUNTROWS(FILTER(sales, sales[price]>100))` |
| `DISTINCTCOUNT(col)` | Distinct values, counting blank as one | `DISTINCTCOUNT(sales[product])` |
| `DISTINCTCOUNTNOBLANK(col)` | Distinct values, excluding blank | `DISTINCTCOUNTNOBLANK(sales[price])` |
| `MIN` / `MAX` | Smallest / largest value | `MIN(sales[price])` |
| `MINX` / `MAXX(table, expr)` | Min / max of an expression per row | `MAXX(sales, sales[price]*sales[qty])` |
| `MINA` / `MAXA` | Like MIN / MAX but also evaluates text and logical values | `MINA(sales[price])` |
| `AVERAGE(col)` | Mean | `AVERAGE(students[age])` |
| `AVERAGEX(table, expr)` | Mean of an expression per row | `AVERAGEX(sales, sales[price]/sales[qty])` |
| `AVERAGEA(col)` | Mean that includes text and logical values | `AVERAGEA(sales[price])` |

Where the book's prose is wrong:
- `COUNTA` counts non-blank values. It does not count blanks.
- `MINA`, `MAXA` and `AVERAGEA` do not "ignore blanks" or "include nulls". They treat text as 0 and TRUE as 1, and skip empty cells.
- `SUMX` takes a table and an expression, so filter first with `CALCULATE` or `FILTER`.

### Date and time functions
| Function | Purpose | Example |
|---|---|---|
| `CALENDAR(start, end)` | Table with one date column | `Calendar = CALENDAR(DATE(2021,1,1), DATE(2021,12,31))` |
| `DATE(y,m,d)` | Build a date | `DATE(2022,2,14)` |
| `DATEDIFF(d1, d2, unit)` | Difference in DAY, MONTH, YEAR, etc. | `DATEDIFF(DATE(2021,1,1), DATE(2021,12,31), DAY)` |
| `DATEVALUE(text)` | Text to date | `DATEVALUE(sales[order_date])` |
| `DAY` / `MONTH` / `YEAR` | Extract a component | `YEAR(sales[date])` |
| `HOUR` / `MINUTE` | Extract a time component | `HOUR(orders[order_time])` |
| `NOW()` / `TODAY()` | Current datetime / date | `TODAY()` |
| `TIME(h,m,s)` | Build a time | `TIME(8,30,0)` |
| `WEEKDAY(date, [type])` | Day of week as a number | `IF(WEEKDAY(t[date],2)<=5,"Weekday","Weekend")` |

Example calculated columns:
```dax
Days Since = DATEDIFF(t[date_column], TODAY(), DAY)
Status     = IF(tasks[due_date] < TODAY(), "Overdue", "Not Overdue")
```

## Chapter 5: DAX filter functions

| Function | Purpose |
|---|---|
| `FILTER(table, condition)` | Returns the rows meeting a condition. Combine conditions with `&&` and `||`. |
| `CALCULATE(expr, filters…)` | Evaluates an expression in a modified filter context. This is the most important DAX function. |
| `ALL(table or column)` | Removes filters |
| `ALLEXCEPT(table, col…)` | Removes all filters except those on the listed columns |
| `ALLSELECTED()` | Removes filters from the current visual but keeps the user's outer selections |
| `KEEPFILTERS(filter)` | Intersects a new filter with the existing one instead of overriding it |
| `LOOKUPVALUE(result_col, search_col, value, [alt])` | Returns a value from a column where another column matches |
| `BLANK()` | Returns a blank |
| `ERROR("msg")` | Raises a custom error |

Examples:
```dax
West Sales    = SUMX(FILTER(Sales, Sales[Region] = "West"), Sales[SalesAmount])
Female AvgAge = AVERAGEX(FILTER(Customer, Customer[Gender] = "Female"), Customer[Age])
Cal Sales     = CALCULATE(SUM(Sales[Sales Amount]), Sales[State] = "California")
Q1 2022       = CALCULATE(SUM(Sales[Sales Amount]),
                  Sales[Date] >= DATE(2022,1,1), Sales[Date] <= DATE(2022,3,31))
All States    = CALCULATE(SUM(Sales[Sales Amount]), ALL(Sales[State]))
Only State    = CALCULATE(SUM(Sales[Sales Amount]), ALLEXCEPT(Sales, Sales[State]))
% of Total    = DIVIDE(SUM(Sales[Sales Amount]),
                  CALCULATE(SUM(Sales[Sales Amount]), ALLSELECTED(Sales)))
Product Name  = LOOKUPVALUE(Products[Name], Products[ID], "P001", "Unknown")
Safe Divide   = IF([Denominator] = 0, ERROR("Division by zero"), [Numerator]/[Denominator])
```

The book's `ALLSELECTED` description is inverted. It keeps the user's selections and removes only the inner filters, which is why it is used for percent-of-total measures.

## Chapter 6: IF and SWITCH in DAX

```dax
Level = IF(Sales[Amount] > 1000, "High", "Low")
Salary Band = IF(Emp[Salary] > AVERAGE(Emp[Salary]), "Above Average", "Below Average")

Commission =
SWITCH(Sales[Product],
    "A", 0.05,
    "B", 0.08,
    0.03)                       -- last value is the default

Age Group =
SWITCH(TRUE(),
    Customer[Age] < 18, "Minor",
    Customer[Age] < 65, "Adult",
    "Senior")
```

`SWITCH(TRUE(), …)` gives multi-condition logic that reads like a nested IF. This is the pattern the book's age and gender example uses.

Note: in `AVERAGE(Emp[Salary])` inside a calculated column, the average is over the whole column.

## Chapter 7: Data visualization

**Concepts.** A *report* is multi-page. A *dashboard* is a single page of tiles. *Visuals* are the individual charts.

| Category | Visuals |
|---|---|
| Standard | Bar/column, line, pie/donut, table/matrix, card, scatter |
| Advanced | Treemap, waterfall, gauge, KPI |
| Custom | AppSource visuals: bullet chart, heatmap, Sankey |
| Maps | Map, Filled map, ArcGIS |
| AI-driven | Key Influencers, Decomposition Tree, Smart Narratives |

**Steps**
1. Load data.
2. Create a report.
3. Choose a visual and drag fields into Axis, Values and Legend.
4. Format it: titles, labels, tooltips, colors.
5. Add interactivity: cross-filtering, slicers, drill-through, bookmarks, tooltips.
6. Publish to the Power BI Service and share.

**Best practices**
- Pick the right chart: bar or column for comparison, line for trends, pie or treemap for composition.
- Keep it simple and use consistent colors and fonts.
- Highlight the key insights.
- Enable drill-down.
- Optimize performance by limiting data points and using aggregations.

**Example sales dashboard**
- Bar chart of sales by category.
- Line chart of monthly trend.
- Map of sales by country.
- KPI of revenue vs target.
- Slicer for year or region.

**Advanced techniques:** custom tooltips, paginated reports, themes, R and Python visuals, and DAX-driven dynamic interactions.

**Challenges:**
- Choosing the right visual: follow the chart guidelines above.
- Large datasets: aggregate or filter.
- Slow reports: use Performance Analyzer.
