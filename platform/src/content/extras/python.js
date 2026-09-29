import { q } from './helpers.js';

// Python labs run on Pyodide. `check` (Python asserts) or `expect` (exact printed output) decide correctness.
export default {
  overview: {
    quiz: [
      q('Which are Python built-in data types?', ['list', 'tuple', 'dict', 'DataFrame'], [0, 1, 2], 'list, tuple, dict and set are built in. DataFrame comes from the pandas library.'),
      q('What installs a Python package?', ['pip install name', 'python get name', 'import name', 'npm add name'], 0, 'pip is Python’s package installer. import only loads something already installed.'),
    ],
  },
  ch1: {
    labs: [{ type: 'python', title: 'Hello, Python', starter: 'print("Hello, Data Guru!")', hint: 'Press Run. print() shows values.' }],
    quiz: [
      q('A module is…', ['A file of Python code you can import', 'A kind of loop', 'A data type', 'A comment'], 0, 'Packages are collections of modules.'),
      q('What defines a function?', ['def', 'func', 'lambda only', 'function'], 0, '`def name(args):` starts a function definition.'),
      q('Exception handling uses…', ['try / except', 'if / else', 'for / while', 'import / as'], 0, 'try runs code that might fail; except handles the error.'),
    ],
  },
  ch2: {
    labs: [
      { type: 'python', title: 'Variables and f-strings', task: 'Create variables name = "John" and age = 30, then print exactly: John is 30', starter: '# your code here\n', expect: 'John is 30', solution: 'name = "John"\nage = 30\nprint(f"{name} is {age}")', hint: 'print(f"{name} is {age}") or print(name, "is", age)' },
      { type: 'python', title: 'Reassigning', task: 'Set x to 10, then to 20, then print x.', starter: '', expect: '20', solution: 'x = 10\nx = 20\nprint(x)' },
    ],
    quiz: [
      q('Which is a VALID variable name?', ['3var', 'my-var', '_my_var', 'my_var!'], 2, 'Names can contain letters, digits and underscores, and cannot start with a digit.'),
      q('Are Python variable names case-sensitive?', ['Yes', 'No', 'Only for functions', 'Only in classes'], 0, 'Age and age are different variables.'),
      q('After x = 10 then x = 20, x equals…', ['10', '20', '30', 'an error'], 1, 'The most recent assignment wins.'),
    ],
  },
  ch3: {
    labs: [
      { type: 'python', title: 'Build a dictionary', task: 'Create a dict called person with keys name ("John"), age (30) and city ("New York").', starter: 'person = ', check: "assert person == {'name': 'John', 'age': 30, 'city': 'New York'}, 'person should have name, age and city'", solution: 'person = {"name": "John", "age": 30, "city": "New York"}' },
      { type: 'python', title: 'Tuples are immutable', starter: 't = (1, 2, 3)\ntry:\n    t[0] = 99\nexcept TypeError as e:\n    print("Error:", e)\n\nl = [1, 2, 3]\nl[0] = 99\nprint(l)' },
    ],
    quiz: [
      q('Which data type is an ordered collection that CANNOT be changed?', ['list', 'tuple', 'set', 'dict'], 1, 'Tuples are immutable.'),
      q('A set…', ['keeps duplicates', 'stores unique items with no fixed order', 'stores key-value pairs', 'is always sorted'], 1, 'Duplicates vanish: {1, 1, 2} is {1, 2}.'),
      q('What type is 3.14?', ['int', 'float', 'str', 'bool'], 1, 'Numbers with a decimal point are floats.'),
      q('Which data type stores key → value pairs?', ['list', 'tuple', 'dict', 'set'], 2, 'A dict maps keys to values.'),
    ],
  },
  ch4: {
    labs: [
      { type: 'python', title: 'List comprehension', task: 'Using a list comprehension, build result: the squares of only the EVEN numbers from 1 to 10.', starter: 'nums = list(range(1, 11))\nresult = ', check: 'assert result == [4, 16, 36, 64, 100], f"got {result}"', solution: 'nums = list(range(1, 11))\nresult = [n ** 2 for n in nums if n % 2 == 0]', hint: '[expression for item in iterable if condition]' },
    ],
    quiz: [
      q('[x*2 for x in [1,2,3]] equals…', ['[2, 4, 6]', '[1, 2, 3]', '[1, 4, 9]', '6'], 0, 'The expression is applied to each element.'),
      q('Where does the filter go in a list comprehension?', ['At the end: … for x in xs if cond', 'At the start', 'In the middle of the expression', 'Comprehensions cannot filter'], 0, '[expr for item in iterable if condition]'),
    ],
  },
  ch5: {
    labs: [
      { type: 'python', title: 'Arithmetic operators', task: 'Define r as the remainder of 17 divided by 5, p as 2 to the power 10, and d as the whole-number quotient of 7 divided by 2.', starter: '', check: 'assert (r, p, d) == (2, 1024, 3), f"got {(r, p, d)}"', solution: 'r = 17 % 5\np = 2 ** 10\nd = 7 // 2' },
    ],
    quiz: [
      q('5 / 2 equals…', ['2', '2.5', '3', '2.0 only in Python 2'], 1, '/ is true division; use // for whole-number division.'),
      q('Which operator tests membership?', ['in', 'is', '==', 'has'], 0, '2 in [1, 2, 3] is True.'),
      q('5 & 3 (bitwise AND) equals…', ['1', '7', '6', '8'], 0, '0101 & 0011 = 0001.'),
      q('x += 2 means…', ['x = x + 2', 'x = 2', 'x == x + 2', 'x = x * 2'], 0, 'Augmented assignment.'),
    ],
  },
  ch6: {
    labs: [
      { type: 'python', title: 'if / elif / else', task: 'Write a function grade(score) that returns "A" for 90+, "B" for 80–89 and "C" otherwise.', starter: 'def grade(score):\n    ', check: "assert [grade(95), grade(85), grade(60), grade(90), grade(80)] == ['A', 'B', 'C', 'A', 'B']", solution: 'def grade(score):\n    if score >= 90:\n        return "A"\n    elif score >= 80:\n        return "B"\n    else:\n        return "C"' },
      { type: 'python', title: 'for loop', task: 'Compute total: the sum of all numbers from 1 to 100 that are divisible by 3.', starter: 'total = 0\n', check: 'assert total == 1683, f"got {total}"', solution: 'total = 0\nfor n in range(1, 101):\n    if n % 3 == 0:\n        total += n' },
    ],
    quiz: [
      q('What does elif mean?', ['else if: another condition to test', 'end if', 'else loop', 'a typo'], 0, 'Python checks if, then each elif, then else.'),
      q('while i <= 5: print(i); i += 1 prints…', ['1 to 5', '0 to 5', '1 to 4', 'nothing'], 0, 'Starting at 1 it prints until i becomes 6.'),
    ],
  },
  ch7: {
    labs: [
      { type: 'python', title: 'break', task: 'Find the first number above 50 that is divisible by 7. Store it in found and stop looping as soon as you have it.', starter: 'found = None\nfor n in range(51, 200):\n    ', check: 'assert found == 56, f"got {found}"', solution: 'found = None\nfor n in range(51, 200):\n    if n % 7 == 0:\n        found = n\n        break' },
      { type: 'python', title: 'Exceptions', task: 'Write safe_divide(a, b) that returns a / b, or None if b is zero.', starter: 'def safe_divide(a, b):\n    ', check: 'assert safe_divide(10, 2) == 5 and safe_divide(1, 0) is None', solution: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None' },
    ],
    quiz: [
      q('continue…', ['Ends the loop', 'Skips the rest of this iteration', 'Ends the program', 'Restarts the loop'], 1, 'The loop goes on to the next item.'),
      q('break…', ['Skips one iteration', 'Ends the loop immediately', 'Raises an exception', 'Returns a value'], 1, 'Control passes to the first statement after the loop.'),
      q('Which block runs only if an error occurs in try?', ['else', 'except', 'finally only', 'for'], 1, 'except handles the exception (finally always runs).'),
    ],
  },
  ch8: {
    labs: [
      { type: 'python', title: 'A class', task: 'Write a class Person with __init__(self, name, age) and a method greet() that returns "Hi, I am <name>".', starter: 'class Person:\n    ', check: "p = Person('Alice', 25)\nassert p.name == 'Alice' and p.age == 25 and p.greet() == 'Hi, I am Alice'", solution: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def greet(self):\n        return f"Hi, I am {self.name}"' },
      { type: 'python', title: 'Multiple return values', task: 'Write calculate(a, b) returning the sum and the product.', starter: 'def calculate(a, b):\n    ', check: 'assert calculate(2, 3) == (5, 6)', solution: 'def calculate(a, b):\n    return a + b, a * b' },
    ],
    quiz: [
      q('__init__ is…', ['A constructor called when an object is created', 'A loop', 'A module', 'A comment'], 0, 'self refers to the new object.'),
      q('def greet(name="Anonymous") means…', ['name is required', 'name has a default value', 'name is a constant', 'greet returns "Anonymous"'], 1, 'Calling greet() uses the default.'),
    ],
  },
  ch9: {
    labs: [
      { type: 'python', title: 'findall', task: 'From the text, extract all runs of digits into a list called nums.', starter: 'import re\ntext = "Order 12 shipped on day 7 of 2024"\nnums = ', check: "assert nums == ['12', '7', '2024'], f'got {nums}'", solution: 'import re\ntext = "Order 12 shipped on day 7 of 2024"\nnums = re.findall(r"\\d+", text)', hint: 'The pattern \\d+ means one or more digits.' },
      { type: 'python', title: 'sub', task: 'Replace "brown" with "red" in the sentence and store it in new_text.', starter: 'import re\nsentence = "The quick brown fox jumps over the lazy dog"\nnew_text = ', check: "assert new_text == 'The quick red fox jumps over the lazy dog'", solution: 'import re\nsentence = "The quick brown fox jumps over the lazy dog"\nnew_text = re.sub("brown", "red", sentence)' },
    ],
    quiz: [
      q('re.match vs re.search?', ['match only matches at the start of the string; search finds it anywhere', 'They are identical', 'search is only for numbers', 'match returns a list'], 0, 'Use search to look anywhere in the string.'),
      q('In a regex, + means…', ['zero or one', 'one or more', 'zero or more', 'exactly one'], 1, '* = zero or more, ? = zero or one.'),
      q('re.findall returns…', ['The first match only', 'A list of all non-overlapping matches', 'A boolean', 'A count'], 1, 'Always a list.'),
    ],
  },
  ch10: {
    labs: [
      { type: 'python', title: 'Vectorized arithmetic', task: 'Create arr = np.arange(1, 6) and compute out = arr * 2 + 1 without a loop.', starter: 'import numpy as np\n', check: 'assert list(out) == [3, 5, 7, 9, 11]', solution: 'import numpy as np\narr = np.arange(1, 6)\nout = arr * 2 + 1' },
      { type: 'python', title: 'Element-wise addition', starter: 'import numpy as np\n\narr1 = np.array([1, 2, 3])\narr2 = np.array([4, 5, 6])\nprint(arr1 + arr2)\nprint(arr1 * arr2)\nprint(np.array([[1, 2], [3, 4]]).sum(axis=0))' },
    ],
    quiz: [
      q('Vectorized computation means…', ['Operating on whole arrays at once, without Python loops', 'Drawing vectors', 'Using lists of lists', 'Compiling to C'], 0, 'It is much faster than looping element by element.'),
      q('np.array([1,2,3]) + 5 gives…', ['[6 7 8]', '[1 2 3 5]', 'an error', '11'], 0, 'Broadcasting adds 5 to every element.'),
    ],
  },
  ch11: {
    labs: [
      { type: 'python', title: 'Load a CSV', task: 'Load data.csv into df and store the mean of the salary column (missing values are skipped) in avg.', starter: 'import pandas as pd\n', check: 'assert abs(avg - 57500) < 1e-6, f"got {avg}"', solution: 'import pandas as pd\ndf = pd.read_csv("data.csv")\navg = df["salary"].mean()', hint: 'pd.read_csv("data.csv") then df["salary"].mean().' },
      { type: 'python', title: 'Filter and group', starter: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "dept": ["Sales", "IT", "Sales", "IT", "HR"],\n    "salary": [50, 80, 60, 90, 55],\n})\nprint(df[df.salary > 55])\nprint(df.groupby("dept")["salary"].agg(["sum", "mean", "count"]))' },
    ],
    quiz: [
      q('A DataFrame is…', ['A 2-D table with labelled rows and columns', 'A 1-D array', 'A chart', 'A file format'], 0, 'Each column is a Series.'),
      q('Which reads an Excel file?', ['pd.read_excel()', 'pd.open_xls()', 'pd.load()', 'pd.xlsx()'], 0, 'Also read_csv, read_json, read_sql and read_html.'),
      q('df[df.age > 30] does…', ['Boolean filtering: keeps rows where age > 30', 'Sorts by age', 'Deletes age', 'Groups by age'], 0, 'The inner expression makes a True/False mask.'),
    ],
  },
  ch12: {
    labs: [
      { type: 'python', title: 'Clean a messy dataset', task: 'Load data.csv, drop duplicate rows, fill missing age values with the mean age, and convert the date column to datetime. Result must be in df.', starter: 'import pandas as pd\ndf = pd.read_csv("data.csv")\n', check: 'assert len(df) == 6, f"expected 6 rows after dropping duplicates, got {len(df)}"\nassert df["age"].isna().sum() == 0, "age still has missing values"\nassert str(df["date"].dtype).startswith("datetime"), "date should be datetime"', solution: 'import pandas as pd\ndf = pd.read_csv("data.csv")\ndf = df.drop_duplicates()\ndf["age"] = df["age"].fillna(df["age"].mean())\ndf["date"] = pd.to_datetime(df["date"])', hint: 'Use df.drop_duplicates(), df["age"].fillna(df["age"].mean()) and pd.to_datetime().' },
    ],
    quiz: [
      q('df.dropna() does…', ['Drops rows containing missing values', 'Fills missing values', 'Drops duplicates', 'Drops columns named NA'], 0, 'fillna() replaces them instead.'),
      q('Which converts a text column to dates?', ['pd.to_datetime(df["d"])', 'df["d"].astype(date)', 'date(df["d"])', 'df.dates()'], 0, 'astype(int) is for numbers; to_datetime for dates.'),
      q('Modern pandas advice for fillna on one column?', ['df["c"] = df["c"].fillna(v)', 'df["c"].fillna(v, inplace=True) always', 'df.fillna = v', 'Use a loop'], 0, 'Assigning the result avoids chained-assignment warnings.'),
    ],
  },
  ch13: {
    labs: [
      { type: 'python', title: 'Outer join', task: 'Merge df1 and df2 on "key" with an outer join into merged. Rows: A, B, C, D, E, F.', starter: 'import pandas as pd\ndf1 = pd.DataFrame({"key": ["A", "B", "C", "D"], "value": [1, 2, 3, 4]})\ndf2 = pd.DataFrame({"key": ["B", "D", "E", "F"], "value": [5, 6, 7, 8]})\nmerged = ', check: 'assert sorted(merged["key"]) == list("ABCDEF") and len(merged) == 6', solution: 'import pandas as pd\ndf1 = pd.DataFrame({"key": ["A", "B", "C", "D"], "value": [1, 2, 3, 4]})\ndf2 = pd.DataFrame({"key": ["B", "D", "E", "F"], "value": [5, 6, 7, 8]})\nmerged = pd.merge(df1, df2, on="key", how="outer")' },
      { type: 'python', title: 'Inner, left and concat', starter: 'import pandas as pd\ndf1 = pd.DataFrame({"key": ["A", "B", "C", "D"], "value": [1, 2, 3, 4]})\ndf2 = pd.DataFrame({"key": ["B", "D", "E", "F"], "value": [5, 6, 7, 8]})\nprint(pd.merge(df1, df2, on="key", how="inner"))\nprint(pd.merge(df1, df2, on="key", how="left"))\nprint(pd.concat([df1, df2], axis=0, ignore_index=True))' },
    ],
    quiz: [
      q('pd.merge(a, b, on="k", how="left") keeps…', ['Only matching rows', 'All rows of a', 'All rows of b', 'No rows'], 1, 'Unmatched right-side columns become NaN.'),
      q('pd.concat([a, b], axis=0) …', ['Stacks rows', 'Places side by side', 'Joins on key', 'Sorts'], 0, 'axis=1 puts DataFrames side by side.'),
    ],
  },
  ch14: {
    labs: [
      { type: 'python', title: 'Pandas plotting', task: 'Plot the y column of data against x as a bar chart and give the axes a title "Sine bars" (store the axes in ax).', starter: 'import pandas as pd, numpy as np\ndata = pd.DataFrame({"x": np.linspace(0, 10, 12).round(1), "y": np.sin(np.linspace(0, 10, 12)).round(2)})\nax = ', check: "assert ax.get_title() == 'Sine bars'", solution: 'import pandas as pd, numpy as np\ndata = pd.DataFrame({"x": np.linspace(0, 10, 12).round(1), "y": np.sin(np.linspace(0, 10, 12)).round(2)})\nax = data.plot(kind="bar", x="x", y="y")\nax.set_title("Sine bars")' },
      { type: 'python', title: 'Line, scatter and histogram', starter: 'import pandas as pd, numpy as np\nx = np.linspace(0, 10, 100)\ndata = pd.DataFrame({"x": x, "y": np.sin(x)})\ndata.plot(kind="line", x="x", y="y")\ndata.plot(kind="scatter", x="x", y="y")\ndata["y"].plot(kind="hist", bins=20)' },
    ],
    quiz: [
      q('df.plot(kind="hist") shows…', ['Trend over time', 'Distribution of one variable in bins', 'Relationship between two variables', 'Proportions'], 1, 'Histograms bin continuous data.'),
      q('Which chart shows the relationship between two variables?', ['scatter', 'pie', 'hist', 'bar'], 0, 'Each row becomes a point (x, y).'),
    ],
  },
  ch15: {
    labs: [
      { type: 'python', title: 'Matplotlib line chart', task: 'Plot sin(x) for x from 0 to 2π using fig, ax = plt.subplots(). Title it "Sine Function".', starter: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nx = np.linspace(0, 2 * np.pi, 100)\nfig, ax = plt.subplots()\n', check: "assert ax.get_title() == 'Sine Function' and len(ax.lines) == 1", solution: 'import numpy as np\nimport matplotlib.pyplot as plt\n\nx = np.linspace(0, 2 * np.pi, 100)\nfig, ax = plt.subplots()\nax.plot(x, np.sin(x))\nax.set_title("Sine Function")' },
      { type: 'python', title: 'Seaborn on the tips data', starter: 'import seaborn as sns\nimport matplotlib.pyplot as plt\n\ntips = sns.load_dataset("tips")   # a locally generated stand-in for the classic dataset\nsns.scatterplot(x="total_bill", y="tip", data=tips)\nplt.show()\n\nsns.barplot(x="day", y="total_bill", data=tips)\nplt.show()' },
    ],
    quiz: [
      q('plt.subplots(2) creates…', ['Two subplots in one figure', 'Two figures', 'A 2-D array', 'A scatter plot'], 0, 'It returns a figure and an array of axes.'),
      q('Seaborn is built on top of…', ['Matplotlib', 'NumPy only', 'Excel', 'SQLite'], 0, 'It offers high-level statistical plots and works well with DataFrames.'),
    ],
  },
};
