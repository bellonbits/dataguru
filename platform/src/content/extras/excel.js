import { q } from './helpers.js';

// Excel labs use a real formula engine. `checks` are the cells graded; `answers` are the reference formulas (used by the test-suite).
export default {
  overview: {
    quiz: [q('Which is NOT one of the main Excel building blocks in chapter 1?', ['Workbook', 'Worksheet', 'Cell', 'Compiler'], 3, 'Workbook → worksheet → cell / range. There is no compiler.')],
  },
  ch1: {
    labs: [{ type: 'excel', title: 'Excel sandbox', sheet: [['Item', 'Qty', 'Price', 'Total'], ['Pen', 10, 1.5, '=B2*C2'], ['Book', 4, 12, '=B3*C3'], ['Bag', 2, 30, '=B4*C4'], ['', '', 'Grand total', '=SUM(D2:D4)']], cols: 6, rows: 10 }],
    quiz: [
      q('A range is…', ['A single cell', 'A group of two or more adjacent cells', 'A whole workbook', 'A chart'], 1, 'For example A1:A10.'),
      q('What is the difference between a formula and a function?', ['None', 'A formula is any equation; a function is a predefined calculation such as SUM', 'A function is always text', 'A formula is only for numbers'], 1, '=A1+B1 is a formula. SUM is a function you can use inside formulas.'),
      q('Which tool summarizes large data sets by dragging fields?', ['Pivot table', 'Data validation', 'Sparkline', 'Goal Seek'], 0, 'PivotTables group, filter and summarize.'),
    ],
  },
  ch2: {
    labs: [
      { type: 'widget', name: 'xltable', title: 'Sort and filter a table' },
      { type: 'excel', title: 'Average and SUMIF', task: 'In F2 calculate the average of the Sales column (C2:C7). In F3 total the Sales for product "Widget" with SUMIF.', sheet: [['Product', 'Region', 'Sales', '', 'Question', 'Answer'], ['Widget', 'West', 120, '', 'Average sales', ''], ['Gadget', 'East', 80, '', 'Total for Widget', ''], ['Widget', 'East', 95], ['Gizmo', 'West', 60], ['Widget', 'West', 150], ['Gadget', 'West', 70]], cols: 6, rows: 10, checks: [{ cell: 'F2', expect: 95.8333333333 }, { cell: 'F3', expect: 365 }], answers: { F2: '=AVERAGE(C2:C7)', F3: '=SUMIF(A2:A7,"Widget",C2:C7)' }, solution: 'F2: =AVERAGE(C2:C7)\nF3: =SUMIF(A2:A7,"Widget",C2:C7)', hint: 'SUMIF(range, criteria, sum_range)' },
    ],
    quiz: [
      q('Where is Custom Sort found?', ['Home → Sort & Filter', 'Insert → Chart', 'View → Zoom', 'Formulas → Name Manager'], 0, 'Custom Sort lets you sort by several columns.'),
      q('What must every formula start with?', ['@', '=', '#', '$'], 1, 'The equals sign tells Excel a formula follows.'),
      q('=SUMIF(B:B,"Product A",C:C) adds…', ['Column B where C is Product A', 'Column C where column B equals "Product A"', 'Everything', 'Only column A'], 1, 'The last argument is the range that is summed.'),
    ],
  },
  ch3: {
    labs: [
      { type: 'excel', title: 'Core functions', task: 'Fill D1:D5 using SUM, AVERAGE, COUNT, MAX and MIN over A1:A6.', sheet: [[12, '', 'Total', ''], [7, '', 'Average', ''], [3, '', 'Count', ''], [20, '', 'Highest', ''], [15, '', 'Lowest', ''], [9]], cols: 5, rows: 9, checks: [{ cell: 'D1', expect: 66 }, { cell: 'D2', expect: 11 }, { cell: 'D3', expect: 6 }, { cell: 'D4', expect: 20 }, { cell: 'D5', expect: 3 }], answers: { D1: '=SUM(A1:A6)', D2: '=AVERAGE(A1:A6)', D3: '=COUNT(A1:A6)', D4: '=MAX(A1:A6)', D5: '=MIN(A1:A6)' }, solution: 'D1 =SUM(A1:A6)   D2 =AVERAGE(A1:A6)   D3 =COUNT(A1:A6)   D4 =MAX(A1:A6)   D5 =MIN(A1:A6)' },
      { type: 'excel', title: 'Text functions', task: 'B2: the trimmed, properly capitalised name. B3: the name in UPPERCASE. B4: the first 4 characters of the trimmed name. C2: the first name only (text before the space in B2).', sheet: [['Raw', 'Clean', 'First name'], [' john SMITH ', '', ''], ['ada obi', '', ''], ['KOFI mensah', '', '']], cols: 4, rows: 8, checks: [{ cell: 'B2', expect: 'John Smith' }, { cell: 'B3', expect: 'ADA OBI' }, { cell: 'B4', expect: 'KOFI' }, { cell: 'C2', expect: 'John' }], answers: { B2: '=PROPER(TRIM(A2))', B3: '=UPPER(A3)', B4: '=LEFT(TRIM(A4),4)', C2: '=LEFT(B2,FIND(" ",B2)-1)' }, solution: 'B2 =PROPER(TRIM(A2))   B3 =UPPER(A3)   B4 =LEFT(TRIM(A4),4)   C2 =LEFT(B2,FIND(" ",B2)-1)', hint: 'FIND(" ", text) gives the position of the first space.' },
      { type: 'excel', title: 'Lookups: VLOOKUP and XLOOKUP', task: 'E2: price of "Gizmo" with VLOOKUP (exact match). E3: price of "Doohickey" with XLOOKUP. E4: XLOOKUP for "Nothing" that shows "Not found" when missing.', sheet: [['Product', 'Price', '', 'Question', 'Answer'], ['Widget', 25, '', 'Gizmo (VLOOKUP)', ''], ['Gadget', 40, '', 'Doohickey (XLOOKUP)', ''], ['Gizmo', 15, '', 'Nothing (XLOOKUP)', ''], ['Doohickey', 60], ['Thingamajig', 8]], cols: 5, rows: 9, checks: [{ cell: 'E2', expect: 15 }, { cell: 'E3', expect: 60 }, { cell: 'E4', expect: 'Not found' }], answers: { E2: '=VLOOKUP("Gizmo",A2:B6,2,FALSE)', E3: '=XLOOKUP("Doohickey",A2:A6,B2:B6)', E4: '=XLOOKUP("Nothing",A2:A6,B2:B6,"Not found")' }, solution: 'E2 =VLOOKUP("Gizmo",A2:B6,2,FALSE)\nE3 =XLOOKUP("Doohickey",A2:A6,B2:B6)\nE4 =XLOOKUP("Nothing",A2:A6,B2:B6,"Not found")', hint: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])' },
      { type: 'excel', title: 'Conditional aggregation', task: 'F2: total sales of Widget. F3: number of West sales over 100. F4: average sales of Widget in the West. F5: largest East sale.', sheet: [['Product', 'Region', 'Sales', '', 'Question', 'Answer'], ['Widget', 'West', 120, '', 'Widget total', ''], ['Gadget', 'East', 80, '', 'West sales > 100', ''], ['Widget', 'East', 95, '', 'Widget in West, average', ''], ['Gizmo', 'West', 60, '', 'Largest East sale', ''], ['Widget', 'West', 150], ['Gadget', 'West', 70], ['Gizmo', 'East', 40]], cols: 6, rows: 10, checks: [{ cell: 'F2', expect: 365 }, { cell: 'F3', expect: 2 }, { cell: 'F4', expect: 135 }, { cell: 'F5', expect: 95 }], answers: { F2: '=SUMIFS(C2:C8,A2:A8,"Widget")', F3: '=COUNTIFS(B2:B8,"West",C2:C8,">100")', F4: '=AVERAGEIFS(C2:C8,A2:A8,"Widget",B2:B8,"West")', F5: '=MAXIFS(C2:C8,B2:B8,"East")' }, solution: 'F2 =SUMIFS(C2:C8,A2:A8,"Widget")\nF3 =COUNTIFS(B2:B8,"West",C2:C8,">100")\nF4 =AVERAGEIFS(C2:C8,A2:A8,"Widget",B2:B8,"West")\nF5 =MAXIFS(C2:C8,B2:B8,"East")', hint: 'SUMIFS(sum_range, criteria_range1, criteria1, …): the sum range comes FIRST.' },
      { type: 'excel', title: 'AND / OR', task: 'In E2:E4 return TRUE if the student scored above 80 in ALL three subjects.', sheet: [['Student', 'Math', 'English', 'Science', 'All > 80?'], ['Ann', 85, 90, 78, ''], ['Ben', 92, 88, 95, ''], ['Cy', 70, 95, 82, '']], cols: 5, rows: 8, checks: [{ cell: 'E2', expect: false }, { cell: 'E3', expect: true }, { cell: 'E4', expect: false }], answers: { E2: '=AND(B2>80,C2>80,D2>80)', E3: '=AND(B3>80,C3>80,D3>80)', E4: '=AND(B4>80,C4>80,D4>80)' }, solution: 'E2 =AND(B2>80,C2>80,D2>80)  (copy down)' },
    ],
    quiz: [
      q('XLOOKUP vs VLOOKUP?', ['XLOOKUP looks in any column and can return from any column', 'They are identical', 'VLOOKUP is newer', 'XLOOKUP only works on numbers'], 0, 'VLOOKUP needs the lookup value in the leftmost column and a column index number.'),
      q('=VLOOKUP("x", A2:B10, 2, TRUE) does…', ['An exact match', 'An approximate match', 'Nothing', 'Returns column 1'], 1, 'The fourth argument TRUE (or omitted) means approximate. Use FALSE for exact.'),
      q('In SUMIFS the FIRST argument is…', ['The first criteria range', 'The range to sum', 'The first criterion', 'A count'], 1, 'Unlike SUMIF, SUMIFS starts with the sum_range.'),
      q('=AND(B2>80, C2>80) returns TRUE when…', ['Either is true', 'Both are true', 'Neither is true', 'B2 equals C2'], 1, 'OR returns TRUE if any condition is true.'),
      q('=LEFT(B2, FIND("@", B2) - 1) on an email returns…', ['The domain', 'The username before @', 'The @ position', 'The whole address'], 1, 'FIND gives the position of @, and one less is the length of the username.'),
    ],
  },
  ch4: {
    labs: [
      { type: 'excel', title: 'IF: bonus', task: 'C2:C4: a 5% bonus on Sales if Sales are above 10,000, otherwise 0.', sheet: [['Employee', 'Sales', 'Bonus'], ['Ann', 12000, ''], ['Ben', 8000, ''], ['Cy', 15000, '']], cols: 4, rows: 8, checks: [{ cell: 'C2', expect: 600 }, { cell: 'C3', expect: 0 }, { cell: 'C4', expect: 750 }], answers: { C2: '=IF(B2>10000,B2*0.05,0)', C3: '=IF(B3>10000,B3*0.05,0)', C4: '=IF(B4>10000,B4*0.05,0)' }, solution: '=IF(B2>10000, B2*0.05, 0)' },
      { type: 'excel', title: 'IFS: grades', task: 'B2:B6: A for 90+, B for 80+, C for 70+, D for 60+, otherwise F. Use IFS.', sheet: [['Score', 'Grade'], [95], [84], [71], [66], [40]], cols: 3, rows: 9, checks: [{ cell: 'B2', expect: 'A' }, { cell: 'B3', expect: 'B' }, { cell: 'B4', expect: 'C' }, { cell: 'B5', expect: 'D' }, { cell: 'B6', expect: 'F' }], answers: { B2: '=IFS(A2>=90,"A",A2>=80,"B",A2>=70,"C",A2>=60,"D",TRUE,"F")', B3: '=IFS(A3>=90,"A",A3>=80,"B",A3>=70,"C",A3>=60,"D",TRUE,"F")', B4: '=IFS(A4>=90,"A",A4>=80,"B",A4>=70,"C",A4>=60,"D",TRUE,"F")', B5: '=IFS(A5>=90,"A",A5>=80,"B",A5>=70,"C",A5>=60,"D",TRUE,"F")', B6: '=IFS(A6>=90,"A",A6>=80,"B",A6>=70,"C",A6>=60,"D",TRUE,"F")' }, solution: '=IFS(A2>=90,"A",A2>=80,"B",A2>=70,"C",A2>=60,"D",TRUE,"F")', hint: 'End with TRUE, "F" as the catch-all.' },
      { type: 'excel', title: 'SWITCH: lookup by exact value', task: 'B2:B5: map the country to its continent with SWITCH (USA → North America, China → Asia, Brazil → South America). Anything else is "Unknown".', sheet: [['Country', 'Continent'], ['USA'], ['China'], ['Brazil'], ['Peru']], cols: 3, rows: 8, checks: [{ cell: 'B2', expect: 'North America' }, { cell: 'B3', expect: 'Asia' }, { cell: 'B4', expect: 'South America' }, { cell: 'B5', expect: 'Unknown' }], answers: { B2: '=SWITCH(A2,"USA","North America","China","Asia","Brazil","South America","Unknown")', B3: '=SWITCH(A3,"USA","North America","China","Asia","Brazil","South America","Unknown")', B4: '=SWITCH(A4,"USA","North America","China","Asia","Brazil","South America","Unknown")', B5: '=SWITCH(A5,"USA","North America","China","Asia","Brazil","South America","Unknown")' }, solution: '=SWITCH(A2,"USA","North America","China","Asia","Brazil","South America","Unknown")' },
    ],
    quiz: [
      q('IFS with no TRUE condition returns…', ['0', 'blank', 'An error (#N/A)', 'The first value'], 2, 'End your IFS with TRUE, default to avoid this.'),
      q('SWITCH is best for…', ['Comparing an expression to exact values', 'Ranges like >= 90', 'Text search', 'Counting'], 0, 'For ranges use IFS, or SWITCH(TRUE, …).'),
      q('=IF(A2>=90,"A",IF(A2>=80,"B","C")) for A2=85 returns…', ['A', 'B', 'C', 'An error'], 1, 'The first test fails, the nested test succeeds.'),
    ],
  },
  ch5: {
    labs: [{ type: 'widget', name: 'condfmt', title: 'Conditional formatting rules' }, { type: 'widget', name: 'validation', title: 'Data validation rules' }],
    quiz: [
      q('Conditional formatting changes…', ['A cell’s value', 'A cell’s appearance when a condition is met', 'A formula', 'The sheet name'], 1, 'The data itself is unchanged.'),
      q('Which data validation type gives a dropdown?', ['Whole number', 'Date', 'List', 'Custom'], 2, 'List validation offers a dropdown of allowed items.'),
      q('Custom validation uses…', ['A formula that must be TRUE', 'A colour', 'A macro', 'Only numbers'], 0, 'For example =A1+B1>50.'),
    ],
  },
  ch6: {
    labs: [{ type: 'widget', name: 'xltable', title: 'Excel Tables in action' }],
    quiz: [
      q('What happens when you type a new row directly under an Excel Table?', ['Nothing', 'The table expands to include it', 'An error appears', 'The table splits'], 1, 'Automatic expansion is one of the main benefits.'),
      q('Where do you create a table?', ['Insert → Table', 'Home → Format', 'Data → Consolidate', 'View → Freeze'], 0, 'Tick “My table has headers”.'),
    ],
  },
  ch7: {
    labs: [{ type: 'widget', name: 'chart', title: 'Choose the right chart' }],
    quiz: [
      q('Best chart for a trend over time?', ['Pie', 'Line', 'Scatter', 'Bar with 30 categories'], 1, 'Lines connect points in time order.'),
      q('Best chart for the relationship between advertising spend and sales?', ['Scatter', 'Pie', 'Area', 'Column'], 0, 'Each point is one (x, y) pair.'),
      q('When is a bar chart better than a column chart?', ['Never', 'When category labels are long or there are many categories', 'When there is only one series', 'For dates'], 1, 'Horizontal bars leave room for long labels.'),
    ],
  },
  ch8: {
    labs: [{ type: 'widget', name: 'sparklines', title: 'Sparklines' }],
    quiz: [
      q('A sparkline is…', ['A chart embedded inside one cell', 'A full-page chart', 'A formula', 'A pivot chart'], 0, 'Insert → Sparklines.'),
      q('Data bars are added from…', ['Insert → Chart', 'Home → Conditional Formatting', 'Data → Filter', 'Review → Comments'], 1, 'They are a conditional-formatting rule.'),
    ],
  },
  ch9: {
    labs: [{ type: 'widget', name: 'pivot', title: 'Build a PivotTable' }],
    quiz: [
      q('The four PivotTable areas are…', ['Rows, Columns, Values, Filters', 'X, Y, Z, W', 'Header, Body, Footer, Total', 'Sum, Count, Average, Max'], 0, 'Rows and Columns group; Values summarize; Filters restrict.'),
      q('A PivotChart is created from…', ['A PivotTable', 'A macro', 'Nothing', 'A slicer only'], 0, 'Select a cell in the PivotTable → Insert → PivotChart.'),
      q('Dragging Product Category to Rows and Region to Columns with Sales Amount in Values shows…', ['Total sales for each category by region', 'A list of products', 'The average price', 'Nothing'], 0, 'This is the book’s example.'),
    ],
  },
  ch10: {
    labs: [{ type: 'widget', name: 'goalseek', title: 'Goal Seek and Data Tables' }],
    quiz: [
      q('Goal Seek answers…', ['What input gives this output?', 'What is the average?', 'What is the correlation?', 'How many duplicates?'], 0, 'It changes one input until the formula reaches your target.'),
      q('Which what-if tool optimises under constraints?', ['Solver', 'Goal Seek', 'Data Table', 'Scenario Manager'], 0, 'Solver handles several variables and constraints.'),
      q('A two-variable Data Table shows…', ['Results for every combination of two inputs', 'Only one result', 'A chart', 'A list of scenarios'], 0, 'For example price × quantity → revenue.'),
    ],
  },
  ch11: {
    labs: [
      { type: 'excel', title: 'Clean messy text and numbers', task: 'B2:B4: trim extra spaces and capitalise each word. B6: turn the text "1,200" into the number 1200 (SUBSTITUTE then VALUE). B7: if A7 is blank show "Unknown", otherwise the value.', sheet: [['Raw', 'Clean'], [' lagos ', ''], ['ABUJA', ''], ['  port   harcourt', ''], [''], ['1,200', ''], ['', '']], cols: 3, rows: 10, checks: [{ cell: 'B2', expect: 'Lagos' }, { cell: 'B3', expect: 'Abuja' }, { cell: 'B4', expect: 'Port Harcourt' }, { cell: 'B6', expect: 1200 }, { cell: 'B7', expect: 'Unknown' }], answers: { B2: '=PROPER(TRIM(A2))', B3: '=PROPER(TRIM(A3))', B4: '=PROPER(TRIM(A4))', B6: '=VALUE(SUBSTITUTE(A6,",",""))', B7: '=IF(ISBLANK(A7),"Unknown",A7)' }, solution: 'B2 =PROPER(TRIM(A2))\nB6 =VALUE(SUBSTITUTE(A6,",",""))\nB7 =IF(ISBLANK(A7),"Unknown",A7)', hint: 'TRIM also collapses repeated internal spaces.' },
    ],
    quiz: [
      q('Which feature removes duplicate rows?', ['Data → Remove Duplicates', 'Home → Sort', 'Insert → Table', 'View → Filter'], 0, 'Choose which columns define a duplicate.'),
      q('How do you delete blank rows quickly?', ['Find & Select → Go To Special → Blanks → Delete', 'Retype the data', 'Hide them', 'Use SUM'], 0, 'Go To Special selects all blank cells at once.'),
      q('Numbers stored as text will…', ['Break calculations like SUM', 'Work normally', 'Turn red', 'Be sorted first'], 0, 'Convert with VALUE() or Format Cells → Number.'),
      q('Which standardise case?', ['LOWER', 'UPPER', 'PROPER', 'TRIM'], [0, 1, 2], 'TRIM removes spaces; it does not change case.'),
    ],
  },
};
