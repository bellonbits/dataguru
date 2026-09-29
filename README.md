# dataguru

Study notes and an interactive learning platform (Vite + React, in [`platform/`](platform/)) built from *Data Analysis Made Easy* by Ezekiel Aleke. See [`platform/README.md`](platform/README.md) to run it.

> The book PDF is not included in this repository. To enable the Library → "Download PDF" button, place your own copy at `platform/public/resources/DATA-ANALYSIS-MADE-EASY.pdf`.

## Study notes

Notes on the 263-page PDF by Ezekiel Aleke, split into one file per section.

| File | Section | Pages | Chapters |
|---|---|---|---|
| [01-excel.md](01-excel.md) | Excel | 1–50 | 11 |
| [02-power-bi.md](02-power-bi.md) | Power BI (Power Query, modelling, DAX, visuals) | 51–112 | 7 |
| [03-sql.md](03-sql.md) | SQL | 113–190 | 17 |
| [04-python.md](04-python.md) | Python (core, NumPy, Pandas, plotting) | 191–245 | 15 |
| [05-data-science.md](05-data-science.md) | Data Science | 246–254 | 4 |
| [06-remote-jobs.md](06-remote-jobs.md) | 8 websites for remote jobs | 255 | — |

## Things to know

- **Formulas and code are screenshots in the PDF.** The text extraction only had the surrounding prose. The formulas and code in these notes are reconstructed from that prose, not copied.
- **Some of the book's technical descriptions are inaccurate.** Where I noticed one (DAX `COUNTA`, `MINA`, `ALLSELECTED`, XLOOKUP match modes, SQL `LIKE` example, and others), the notes give the correct behaviour and say so.
- **Python chapters 15–17 are missing from the body.** The table of contents lists Data Science, Scikit-Learn and Web Scraping under Python, but the body ends at Seaborn.
