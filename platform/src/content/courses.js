import notes from './notes.json';
import { EXTRAS } from './extras/index.js';

export const COURSE_META = [
  { id: 'excel', title: 'Excel', color: '#1f8a4c', tint: '#e3f6ea', tagline: 'Formulas, lookups, pivots and clean data', pages: 'Book pp. 1–50', level: 'Beginner',
    about: 'Spreadsheets are where most analysts start. Master the functions that matter: SUMIFS, XLOOKUP, IFS. Then move on to pivot tables, charts and data cleaning.' },
  { id: 'powerbi', title: 'Power BI', color: '#c98a00', tint: '#fff2cc', tagline: 'Power Query, star schemas, DAX and dashboards', pages: 'Book pp. 51–112', level: 'Intermediate',
    about: 'Turn raw tables into an interactive model. Learn Power Query transforms, star-schema modelling, and the DAX functions behind every measure.' },
  { id: 'sql', title: 'SQL', color: '#2f62e0', tint: '#e2eaff', tagline: 'Query, join, aggregate and design databases', pages: 'Book pp. 113–190', level: 'Beginner',
    about: 'The language of data. From SELECT to joins, GROUP BY, subqueries, views and normalization, and every query runs live in your browser.' },
  { id: 'python', title: 'Python', color: '#7c45d0', tint: '#eee4ff', tagline: 'Core Python, NumPy, Pandas and plotting', pages: 'Book pp. 191–245', level: 'Beginner',
    about: 'From variables and loops to DataFrames, joins and Matplotlib charts, with a real Python runtime running in your browser tab.' },
  { id: 'ds', title: 'Data Science', color: '#d4560f', tint: '#ffe6d6', tagline: 'The workflow, tools and roadmap', pages: 'Book pp. 246–254', level: 'Overview',
    about: 'See the whole picture: components, workflow, tools, applications, challenges and a roadmap to follow.' },
];

const wordsToMin = md => Math.max(2, Math.round(md.split(/\s+/).length / 180));

export const COURSES = COURSE_META.map(m => {
  const chapters = (notes[m.id] || []).map((c, i) => {
    const ex = (EXTRAS[m.id] && EXTRAS[m.id][c.id]) || {};
    return { ...c, key: `${m.id}/${c.id}`, course: m.id, index: i, minutes: wordsToMin(c.md), labs: (ex.labs || []).map((l, li) => ({ ...l, key: `${m.id}/${c.id}/lab${li}` })), quiz: ex.quiz || [], extras: ex };
  });
  return { ...m, chapters };
});
export const courseById = id => COURSES.find(c => c.id === id);
export const ALL_CHAPTERS = COURSES.flatMap(c => c.chapters);
export const chapterByKey = key => ALL_CHAPTERS.find(c => c.key === key);
export const ALL_LABS = ALL_CHAPTERS.flatMap(c => c.labs.map(l => ({ ...l, chapter: c })));
export const ALL_TASKS = ALL_LABS.filter(l => l.task);

/** Reading order helpers */
export function neighbours(key) {
  const i = ALL_CHAPTERS.findIndex(c => c.key === key);
  return { prev: ALL_CHAPTERS[i - 1] || null, next: ALL_CHAPTERS[i + 1] || null };
}
