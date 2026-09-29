export const CHEATS = [
  { id: 'excel', title: 'Excel functions', rows: [
    ['=SUM(A1:A5)', 'Add numbers'], ['=AVERAGE(range)', 'Mean'], ['=COUNT(range)', 'Count numeric cells'], ['=MAX / =MIN(range)', 'Largest / smallest'],
    ['=SUMIFS(sum, r1, c1, r2, c2)', 'Sum with several conditions'], ['=COUNTIFS(r1,c1,r2,c2)', 'Count with several conditions'], ['=AVERAGEIFS(avg, r1, c1)', 'Average with conditions'],
    ['=MINIFS / =MAXIFS(vals, r, c)', 'Smallest / largest that meets criteria'], ['=XLOOKUP(v, lookup, return)', 'Modern lookup (exact by default)'], ['=VLOOKUP(v, table, col, FALSE)', 'Older lookup: FALSE = exact'],
    ['=IF(test, yes, no)', 'One condition'], ['=IFS(c1, v1, c2, v2, TRUE, else)', 'Many conditions, first TRUE wins'], ['=SWITCH(x, a, r1, b, r2, default)', 'Match exact values'],
    ['=LEFT / RIGHT(text, n)', 'First / last n characters'], ['=TRIM / UPPER / LOWER / PROPER(text)', 'Clean and re-case text'], ['=UNIQUE(range)', 'Distinct values (365)'] ] },
  { id: 'dax', title: 'DAX patterns', rows: [
    ['Total = SUM(Sales[Amount])', 'Basic measure'], ['SUMX(Sales, [Price]*[Qty])', 'Row-by-row, then sum'], ['CALCULATE(expr, filter…)', 'Change the filter context'], ['CALCULATE(SUM(x), ALL(Sales[Region]))', 'Ignore a filter'],
    ['CALCULATE(SUM(x), ALLEXCEPT(Sales, Sales[Region]))', 'Keep only some filters'], ['DIVIDE(a, b, alt)', 'Safe division'], ['DIVIDE(SUM(x), CALCULATE(SUM(x), ALLSELECTED()))', '% of total'],
    ['FILTER(Table, cond)', 'Rows that meet a condition'], ['DISTINCTCOUNT(col)', 'Unique values'], ['SWITCH(TRUE(), c1, r1, c2, r2, else)', 'Multi-branch IF'], ['VAR x = … RETURN …', 'Named intermediate values'], ['LOOKUPVALUE(result, col, value, default)', 'Look up a value'] ] },
  { id: 'sql', title: 'SQL clauses', rows: [
    ['SELECT cols FROM t WHERE cond', 'Basic query'], ['ORDER BY col DESC', 'Sort'], ['LIMIT n', 'First n rows (SQL Server: TOP n)'], ['WHERE x IS NULL', 'Test for NULL'], ['WHERE name LIKE \'S%\'', '% = any text, _ = one char'],
    ['a JOIN b ON a.id = b.id', 'Inner join'], ['a LEFT JOIN b ON …', 'Keep all left rows'], ['GROUP BY col HAVING SUM(x) > 100', 'Group then filter groups'], ['UNION / UNION ALL / INTERSECT / EXCEPT', 'Set operators'],
    ['CASE WHEN c THEN a ELSE b END', 'Conditional'], ['CREATE VIEW v AS SELECT …', 'Saved query'], ['INSERT INTO t (cols) VALUES (…)', 'Add rows'], ['UPDATE t SET c = v WHERE …', 'Change rows (always use WHERE)'], ['DELETE FROM t WHERE …', 'Remove rows (always use WHERE)'] ] },
  { id: 'python', title: 'Python & pandas', rows: [
    ['[x**2 for x in nums if x>0]', 'List comprehension'], ['pd.read_csv("f.csv")', 'Load a CSV'], ['df.head() / df.info() / df.describe()', 'Look at the data'], ['df[df.age > 30]', 'Filter rows'],
    ['df.groupby("k")["v"].sum()', 'Group and aggregate'], ['df.dropna() / df.fillna(0)', 'Missing values'], ['df.drop_duplicates()', 'Remove duplicate rows'], ['df["d"] = pd.to_datetime(df["d"])', 'Fix a data type'],
    ['pd.merge(a, b, on="k", how="left")', 'Join DataFrames'], ['pd.concat([a, b], ignore_index=True)', 'Stack DataFrames'], ['df.plot(kind="bar", x="a", y="b")', 'Quick chart'], ['re.findall(r"\\d+", text)', 'Regular expressions'] ] },
];
export const RESOURCES = {
  jobs: [
    ['LinkedIn Jobs', 'https://www.linkedin.com/jobs/'], ['DataJobs', 'https://datajobs.com/'], ['Hired', 'https://hired.com/'], ['CareerBuilder', 'https://www.careerbuilder.com/'],
    ['FlexJobs (data analysis)', 'https://www.flexjobs.com/search?search=data+analysis&location='], ['Glassdoor', 'https://www.glassdoor.com/index.htm'], ['Indeed Nigeria', 'https://ng.indeed.com/'], ['Shortened link from the book (unverified)', 'https://t.co/CnGzmlytfJ'],
  ],
  docs: [
    ['Microsoft Excel help', 'https://support.microsoft.com/excel'], ['Power BI documentation', 'https://learn.microsoft.com/power-bi/'], ['DAX reference', 'https://learn.microsoft.com/dax/'], ['SQLite documentation', 'https://www.sqlite.org/docs.html'],
    ['Python documentation', 'https://docs.python.org/3/'], ['pandas user guide', 'https://pandas.pydata.org/docs/user_guide/'], ['NumPy user guide', 'https://numpy.org/doc/stable/user/'], ['Matplotlib tutorials', 'https://matplotlib.org/stable/tutorials/'],
  ],
  author: [['Author on X', 'https://twitter.com/ezekiel_aleke'], ['Book website', 'https://dataanalysismadeeasy.com'], ['Telegram community', 'https://t.me/DATAANALYSISMADEEASY']],
};
