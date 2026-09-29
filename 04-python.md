# Python

Source: *Data Analysis Made Easy*, pp. 191–245. The book shows its code as screenshots. The code below is reconstructed from the surrounding text.

The table of contents lists 17 Python chapters. The body contains 15 (introduction through Seaborn). Data Science, Scikit-Learn machine learning and Web Scraping are listed but not included in the PDF. The Data Science section is covered separately in `05-data-science.md`.

## Chapter 1: Key terms

- **Variable:** a name that refers to a value.
- **Data types:** int, float, str, bool, list, tuple, set, dict.
- **Operators:** symbols for arithmetic, comparison and logic.
- **Function:** a reusable block of code, defined with `def`.
- **Control structures:** if/else and loops.
- **Module:** a `.py` file you can import.
- **Package:** a collection of modules, installed with `pip`.
- **Class and object:** a blueprint, and an instance of it.
- **Exception handling:** `try` / `except`.
- **Iterators and generators:** lazy, memory-friendly sequences.

## Chapter 2: Variables

```python
x = 5
x = 10; x = 20          # can be reassigned
print(x)                # 20   (# starts a comment)
```

Naming rules:
- Letters, digits and underscores only.
- Must not start with a digit.
- Case-sensitive.
- Cannot be a keyword such as `if`, `else` or `while`.

Valid: `my_var`, `_x`, `name2`. Invalid: `2name`, `my-var`, `class`.

Common types: integer (`5`), float (`3.14`), string (`"Hello"`), boolean (`True`).

## Chapter 3: Data types

```python
i = 42                       # int
f = 3.14                     # float
b = True                     # bool
s = "Python"                 # str (single or double quotes)
lst = [1, "a", 3.5]          # list: ordered, mutable, mixed types
tup = (1, 2, 3)              # tuple: ordered, immutable
st = {1, 2, 3}               # set: unordered, unique items
d = {"name": "John", "age": 30}   # dict: key-value pairs
```

Others include complex numbers and bytes.

## Chapter 4: List comprehension

Syntax: `[expression for item in iterable if condition]`

```python
my_list = [1, 2, 3, 4, 5]
squares = [num ** 2 for num in my_list]          # [1, 4, 9, 16, 25]
evens   = [num for num in my_list if num % 2 == 0]   # [2, 4]
```

## Chapter 5: Operators

| Type | Operators |
|---|---|
| Arithmetic | `+ - * / // % **` |
| Comparison | `== != > < >= <=` |
| Logical | `and or not` |
| Assignment | `= += -= *= /= //= %= **=` |
| Bitwise | `& \| ^ ~ << >>` |
| Membership | `in`, `not in` |

## Chapter 6: Control structures

```python
age = 18
if age >= 18:
    print("You are eligible to vote!")
elif age == 17:
    print("You can vote next year!")
else:
    print("You are not old enough to vote yet.")

for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

i = 0
while i < 5:
    print(i); i += 1
```

## Chapter 7: Transfer statements and exceptions

```python
for i in range(10):
    if i == 5: break        # exits the loop -> prints 0..4
    print(i)

for i in range(10):
    if i == 5: continue     # skips iteration -> prints 0-4, 6-9
    print(i)

def add(a, b):
    return a + b            # ends the function, hands back a value
result = add(2, 3)          # 5

try:
    x = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
```

## Chapter 8: Functions and classes

```python
def greet(name="Anonymous"):        # default parameter
    """Docstring: describes the function."""
    print("Hello,", name)

def calculate(num1, num2):          # multiple return values (a tuple)
    return num1 + num2, num1 * num2
result1, result2 = calculate(3, 4)

class Person:
    def __init__(self, name, age):  # constructor; self = the new object
        self.name, self.age = name, age
    def get_name(self): return self.name
    def get_age(self):  return self.age
    def set_name(self, name): self.name = name
    def set_age(self, age):   self.age = age

person1 = Person("Alice", 30)
person1.set_age(31)
```

## Chapter 9: Regular expressions (`re` module)

| Function | Purpose |
|---|---|
| `re.search(p, s)` | First match anywhere in the string |
| `re.match(p, s)` | Match at the start of the string only |
| `re.findall(p, s)` | List of all non-overlapping matches |
| `re.sub(p, repl, s)` | Replace matches |

Syntax:

| Token | Meaning |
|---|---|
| `.` | Any single character except a newline |
| `*` | Zero or more of the previous |
| `+` | One or more of the previous |
| `?` | Zero or one of the previous |
| `[]` | Any one character in the set |
| `\|` | Either pattern |
| `()` | Group |
| `^` | Start of the string |

```python
import re
s = "The quick brown fox jumps over the lazy dog"
re.search("quick", s).group()    # 'quick'
re.match("^The", s)              # match object
re.findall("o", s)               # ['o','o','o','o']
re.sub("brown", "red", s)
```

## Chapter 10: NumPy

- NumPy is "Numerical Python". Its key features are:
  - The N-dimensional array (`ndarray`).
  - **Broadcasting**: operating on arrays of different shapes.
  - **Vectorized computation**: whole-array operations, much faster than Python loops.
- A 1-D array is a vector and a 2-D array is a matrix. All elements share one dtype.

```python
import numpy as np
a = np.array([1, 2, 3, 4])
a[0]                 # indexing
a + a, a * 2         # element-wise
np.sqrt(a)           # vectorized function
```

## Chapter 11: Pandas

- **Series** is a 1-D labelled array.
- **DataFrame** is a 2-D table where each column is a Series.
- Operations:
  - Filtering with boolean masks.
  - `groupby` plus aggregation (sum, mean, count, min, max, std).
  - Merging with inner, outer, left and right joins.
  - Reshaping with `melt` (wide to long) and `pivot` (long to wide).

**Loading data**
```python
import pandas as pd
df = pd.read_csv("data.csv")            # delimiter, header, encoding options
df = pd.read_excel("data.xlsx", sheet_name="Sheet1")
df = pd.read_json("data.json")          # orient, lines options
df = pd.read_sql("SELECT * FROM t", conn)
tables = pd.read_html(url)              # list of DataFrames
```

## Chapter 12: Data cleaning and preparation

```python
df.dropna(inplace=True)                                     # drop rows with missing values
df["col"].fillna(df["col"].mean(), inplace=True)            # fill with the mean
df.drop_duplicates(inplace=True)
df["age"]  = df["age"].astype(int)
df["date"] = pd.to_datetime(df["date"])
```

Newer pandas versions discourage `inplace=True` on a column. Use `df["col"] = df["col"].fillna(...)` instead.

## Chapter 13: Joining DataFrames

```python
merged = pd.merge(df1, df2, on="key", how="inner")   # only matching keys (e.g. B, D)
merged = pd.merge(df1, df2, on="key", how="left")    # all of df1, NaN where no match
merged = pd.merge(df1, df2, on="key", how="right")   # all of df2
merged = pd.merge(df1, df2, on="DepartmentID", how="outer")  # everything, NaN gaps
combined = pd.concat([df1, df2], axis=0, ignore_index=True)  # stack rows (axis=1 = side by side)
```

## Chapter 14: Plotting with pandas

Uses `df.plot(kind=...)`. The example DataFrame has 100 points: `x = np.linspace(0, 10, 100)`, `y = np.sin(x)`.

```python
df.plot(x="x", y="y", kind="line")
df.plot(x="x", y="y", kind="bar")
df.plot(x="x", y="y", kind="scatter")
df["y"].plot(kind="hist")
```

## Chapter 15: Matplotlib and Seaborn

```python
import numpy as np, matplotlib.pyplot as plt
x = np.linspace(0, 10, 100)
plt.plot(x, np.sin(x)); plt.title("Sine"); plt.xlabel("x"); plt.ylabel("sin(x)"); plt.show()

fig, (ax1, ax2) = plt.subplots(2, 1)       # subplots
ax1.plot(x, np.sin(x)); ax2.plot(x, np.cos(x))

plt.bar(["A", "B", "C"], [10, 20, 15])     # bar chart

import seaborn as sns                       # pip install seaborn
tips = sns.load_dataset("tips")
sns.scatterplot(data=tips, x="total_bill", y="tip")          # positive relationship
sns.lineplot(data=sns.load_dataset("flights"), x="year", y="passengers")   # rising trend
sns.barplot(data=tips, x="day", y="total_bill")              # mean bill per day
plt.show()
```
