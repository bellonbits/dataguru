# Data Guru: interactive learning platform

A Vite + React app built from *Data Analysis Made Easy* (Ezekiel Aleke). It has every note from the book, hands-on labs that run **in the browser** (no backend, no installs), quizzes, progress tracking and a study dashboard.

## Run it

```bash
cd platform
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (host anywhere)
npm run preview    # serve the production build on :4173
```

An internet connection is needed the first time you use the Python lab (Pyodide is downloaded from a CDN) and for web fonts.

## Accounts and sign-in

Pages: **/login**, **/signup** (with a one-time recovery code), **/forgot** (reset with that code), plus account settings (change password, delete account) and **Continue as guest**.

These are **device-local accounts**: there is no server. Passwords are salted and hashed with PBKDF2 (150,000 iterations) in the browser, sessions live in `localStorage`/`sessionStorage`, and each account keeps its own progress. This keeps casual snoopers out but is not real security, since anyone with access to the browser profile can read or delete the data. The whole thing sits behind `service` in `src/lib/auth.jsx`. To use a real backend, replace those functions and keep their signatures. Email-based password reset then becomes possible.

## Pages

| Page | What it does |
|---|---|
| Dashboard | Greeting and streak, subjects, continue learning, recommendations, study plan, calendar, badges, progress gauge |
| Subjects → Course → Lesson | 5 subjects, 62 lessons: notes, runnable code blocks, labs, quiz, personal notes |
| Library | All notes, cheat sheets, flashcards, resources (book PDF, remote-job sites, docs) |
| Live Labs | SQL, Python, Excel and DAX sandboxes and timed challenges |
| Assignments | Every auto-graded exercise and its status |
| Achievements | Badges (computed from real activity), stats, study heat map |
| Certificate | Unlocks when every lesson and lab is complete: printable Certificate of Achievement signed by the chief trainer (Save as PDF) |
| AI Tutor | Offline answers from the notes, or Claude (bring your own API key in Settings) |
| Settings | Name, theme, weekly goal, export / import / reset progress |

## How the labs work

- **SQL**: SQLite (sql.js). A small shim translates the book's T-SQL (`DATEADD`, `DATEDIFF`, `DATEPART`, `LEN`) for SQLite.
- **Python**: real CPython via Pyodide, with NumPy, pandas, Matplotlib and seaborn. Sample files `data.csv`, `data.json`, `database.db` are provided.
- **Excel**: HyperFormula, plus rewrites for `XLOOKUP`, `AVERAGEIFS`, `VALUE` and bare `TRUE`/`FALSE`. `UNIQUE` (dynamic arrays) is not supported.
- **DAX**: a purpose-built engine in `src/lib/dax-engine.js`. It supports the functions the book teaches (aggregations, X-iterators, `FILTER`, `CALCULATE`, `ALL`/`ALLEXCEPT`/`ALLSELECTED`, `KEEPFILTERS`, `LOOKUPVALUE`, `VAR`/`RETURN`, `EARLIER`, date and text functions). Time intelligence (`DATESYTD`, …) needs real Power BI.
- **Interactive widgets**: join visualizer, PivotTable builder, chart chooser, conditional formatting, sparklines, Goal Seek and Data Tables, Power Query steps, Excel Tables, data validation, a cross-filtering dashboard, star-schema builder, regression playground, confusion-matrix calculator, workflow ordering and roadmap.

## Content pipeline

```
../0N-*.md study notes  ──(npm run notes)──►  src/content/notes.json
src/content/extras/*.js  (labs + quizzes per chapter)
```

Edit the markdown notes in the parent folder, then run `npm run notes`. Labs and quizzes live in `src/content/extras/`.

## Tests

```bash
npm run test:dax                 # the book's DAX examples on the practice data
node tools/test-labs.mjs         # runs every lab's reference solution through the same checker the UI uses (SQL, Python, Excel, DAX) and validates every quiz
node tools/e2e-auth.mjs          # sign-up, sign-in, recovery, guest isolation, lockout, delete account
node tools/e2e.mjs               # drives the built app in Chromium (needs `npm run preview` and Playwright's Chromium)
```

## Notes and limits

- Progress, notes and settings live in `localStorage`. There is no account and nothing is uploaded. The optional Claude API key is stored locally and sent only to `api.anthropic.com`.
- Code in the PDF was screenshots; it was transcribed from the images (see `_transcripts/`), and several of the book's own technical errors are corrected in the notes and flagged.
