# Excel

Source: *Data Analysis Made Easy* by Ezekiel Aleke, pp. 1–50. The book shows most formulas as screenshots. The formulas below are reconstructed from the surrounding text.

## Chapter 1: What is Excel?

Excel is Microsoft's spreadsheet software for organizing, analyzing and visualizing data.

| Term | Meaning |
|---|---|
| Workbook | A file containing one or more worksheets |
| Worksheet | A single sheet where data is entered and analysed |
| Cell | One box on a worksheet |
| Range | Two or more adjacent cells (e.g. `A1:A10`) |
| Formula | An equation that calculates from cells and returns a result |
| Function | A predefined formula (SUM, AVERAGE, MAX, MIN…) |
| Chart | Graphical representation of worksheet data |
| Pivot table | Summarizes and analyzes large data sets |
| Conditional formatting | Formats cells automatically based on conditions |
| Data validation | Restricts what can be entered in a cell |
| Power Pivot | Data-modelling tool: table relationships, calculated columns, measures |

## Chapter 2: Manage data in cells and ranges

**Sorting** (Home → Sort & Filter)
- Sort A to Z or Z to A sorts by the first column.
- Custom Sort lets you sort by several columns or by a specific criterion.

**Filtering** (Data → Filter)
- Use the drop-down on a column header.
- Text, number and date filters are available. For example, Date Filters → Between takes a start and an end date.

**Formulas**
- Start with `=`, e.g. `=A1+B1`.
- `=AVERAGE(A1:A10)`
- `=SUMIF(B:B,"Product A",C:C)` sums column C where column B is "Product A".

## Chapter 3: Excel functions

### Math and statistics
| Function | Purpose | Example |
|---|---|---|
| `SUM` | Adds values. Accepts several ranges. | `=SUM(A1:A5, B1:B5)` |
| `AVERAGE` | Arithmetic mean | `=AVERAGE(A1:A5)` |
| `COUNT` | Counts cells containing numbers | `=COUNT(A1:A5)` |
| `MAX` / `MIN` | Highest / lowest value | `=MAX(A1:A5)` |

### Text
| Function | Purpose | Example |
|---|---|---|
| `CONCATENATE` | Joins text | `=CONCATENATE(A1," ",B1)` |
| `LEFT(text,n)` | First n characters | `=LEFT(A1,5)` |
| `RIGHT(text,n)` | Last n characters | `=RIGHT(C2,4)` |
| `LOWER` / `UPPER` / `PROPER` | Change case | `=PROPER(A2)` |
| `TRIM` | Removes leading and trailing spaces | `=TRIM(A2)` |

### Lookup
- **`XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])`**
  - It is the newer replacement for VLOOKUP.
  - Example: `=XLOOKUP("Product A",A2:A10,B2:B10)`.
  - Match modes: 0 is exact (default), -1 is the next smaller item, 1 is the next larger item, 2 is wildcard.
  - Search modes: 1 searches first to last (default), -1 searches last to first.
  - The book's own description of the match modes (its "1: first match / 2: last match" list) is loose. The list above is the actual behaviour.
- **`VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`**
  - The lookup value must be in the first column of the table.
  - `FALSE` means exact match. `TRUE` or omitted means approximate.
  - Example: `=VLOOKUP("John Doe",A2:B10,2,FALSE)`.

### Logical
- `AND(c1,c2,…)` is TRUE only if all conditions are TRUE. Example: `=AND(B2>80,C2>80,D2>80)`.
- `OR(c1,c2,…)` is TRUE if any condition is TRUE. Example: `=OR(B2=4,B2=5)`.

### Conditional aggregation
| Function | Example |
|---|---|
| `COUNTIF(range,criteria)` | `=COUNTIF(A1:A10,">5")` |
| `COUNTIFS` | `=COUNTIFS(A1:A10,">5",A1:A10,"<10")` |
| `SUMIF` | `=SUMIF(A1:A10,">5")` |
| `SUMIFS(sum_range, range1, crit1, …)` | `=SUMIFS(C:C,B:B,"apple",C:C,">5")` |
| `AVERAGEIF` / `AVERAGEIFS` | Same pattern, returns the average |
| `MINIFS` / `MAXIFS` | Min or max under several criteria, e.g. `=MINIFS(D:D,A:A,"West",B:B,"Product B",C:C,">"&DATE(2022,1,1))` |

### Other
- `UNIQUE(range)` returns the distinct values and removes duplicates. Combining two ranges is written `=UNIQUE({A2:A9;B2:B9})` in the book.
- `=LEFT(B2, FIND("@",B2)-1)` extracts the username from an email address.

## Chapter 4: IF, IFS and SWITCH

- **`IF(test, value_if_true, value_if_false)`**
  - Bonus: `=IF(B2>10000, B2*0.05, 0)`.
  - Nested grades: `=IF(A2>=90,"A",IF(A2>=80,"B","C"))`.
- **`IFS(cond1, val1, cond2, val2, …)`** returns the value for the first TRUE condition. It errors if none is true, so end with `TRUE, default`.
  - Example: `=IFS(A2>=90,"A",A2>=80,"B",A2>=70,"C",TRUE,"F")`.
  - Discount tiers: under $10 gets none, $10–20 gets 5%, over $20 gets 10%.
- **`SWITCH(expression, value1, result1, …, [default])`** matches an expression against exact values.
  - Example: `=SWITCH(A2,"Kenya","Africa","France","Europe","Unknown")`.
  - The book's commission example is printed as `=SWITCH(B2<5000, B2*0.01, B2<10000, B2*0.02, B2>=10000, B2*0.03)`. That does not work as written, because SWITCH compares the first argument to each value and here it would compare TRUE/FALSE to a number. The working form is `=SWITCH(TRUE, B2<5000, B2*0.01, B2<10000, B2*0.02, B2*0.03)`, or use `IFS`.
  - The country example in the book: `=SWITCH(A2,"USA","North America","China","Asia","South Africa","Africa","Brazil","South America","Australia","Australia","Unknown")`.

## Chapter 5: Conditional formatting and data validation

**Conditional formatting** (Home → Conditional Formatting)
- Highlight Cells Rules, e.g. Less Than 0 with a red fill.
- Top/Bottom Rules.
- Color Scales, e.g. red-yellow-green for a heat map.

**Data validation** (Data → Data Validation)
- Types: Whole Number, Decimal, List, Date, Custom (a formula).
- You can also set an input message and an error alert.

## Chapter 6: Excel tables

- Create one with Insert → Table, and tick "My table has headers".
- Benefits:
  - Structured format.
  - Built-in sorting and filtering.
  - PivotTable integration.
  - Automatic formatting.
  - The table expands automatically when you add rows.

## Chapter 7: Charts and graphics

Steps: select data → Insert tab → choose chart → customize (titles, labels, legend, axes, styles).

| Chart | Best for |
|---|---|
| Column | Comparing categories |
| Bar | Comparing categories, especially long labels or many categories |
| Line | Trends over time |
| Area | Trends over time, with the area below the line filled |
| Pie | Percentage breakdown of a whole |
| Scatter | Relationship between two variables |

## Chapter 8: Sparklines and data bars

- **Sparklines** are tiny charts inside a cell. Insert → Sparklines → Line, then pick the data range.
- **Data bars** are in-cell bars for relative magnitude. Home → Conditional Formatting → Data Bars.

## Chapter 9: PivotTables and PivotCharts

1. Select the data, including headers.
2. Insert → PivotTable.
3. Choose the source range and place it on a new or existing worksheet.
4. Drag fields into the four areas:
   - **Rows** groups by row.
   - **Columns** groups by column.
   - **Values** summarizes.
   - **Filters** filters the whole table.
5. Customize the layout, filters and calculation type.
6. For a PivotChart, click a cell in the PivotTable → Insert → PivotChart, then style it in Chart Design and Format.

## Chapter 10: What-if analysis

| Tool | Use |
|---|---|
| Goal Seek | Find the input needed to reach a target output |
| Data Tables | Show results for combinations of two variables, e.g. price × quantity |
| Scenario Manager | Save and compare sets of inputs |
| Solver | Optimize under constraints |

## Chapter 11: Data cleaning

- Remove duplicates: Data → Remove Duplicates.
- Remove blank rows: Find & Select → Go To Special → Blanks → Delete.
- Fix spelling and unwanted characters with Find & Replace. Leave "Replace with" empty to delete a character.
- Convert text to numbers with Format Cells → Number.
- Handle missing data: `=IF(ISBLANK(A2),"Default Value",A2)`.
- Standardize with `LOWER`, `UPPER`, `PROPER`, `TRIM` and `SUBSTITUTE`.
