import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { COURSES, ALL_CHAPTERS, ALL_LABS } from '../content/courses.js';
import { todayKey } from './util.js';

const KEY_BASE = 'dataguru.v2';
const DEFAULT = { chapters: {}, opened: {}, labs: {}, quiz: {}, notes: {}, activity: {}, badgesSeen: [],
  profile: { name: 'Learner', role: 'Data analyst in training', goal: 5, theme: 'light', apiKey: '' } };
function load(KEY, name) { try { let raw = localStorage.getItem(KEY); if (!raw && KEY.endsWith('.guest')) raw = localStorage.getItem(KEY_BASE); const r = JSON.parse(raw); if (r) return { ...DEFAULT, ...r, profile: { ...DEFAULT.profile, ...(r.profile || {}), ...(name ? { name } : {}) } }; } catch (e) { /* ignore */ } return name ? { ...DEFAULT, profile: { ...DEFAULT.profile, name } } : DEFAULT; }

const Ctx = createContext(null);
export const useProgress = () => useContext(Ctx);

/** Badge definitions: each is computed from state, so they cannot drift. */
export const BADGES = [
  { id: 'first-lab', title: 'First Run', desc: 'Complete your first lab', tone: 'lime', test: (s) => Object.keys(s.labs).length >= 1 },
  { id: 'streak3', title: '3 Day Streak', desc: 'Study three days in a row', tone: 'orange', test: (s, m) => m.streak >= 3 },
  { id: 'streak7', title: '7 Days Streak', desc: 'Study seven days in a row', tone: 'orange', test: (s, m) => m.streak >= 7 },
  { id: 'quiz-ace', title: 'Quiz Ace', desc: 'Score 100% on any quiz', tone: 'blue', test: (s) => Object.values(s.quiz).some(q => q.score === q.total && q.total > 0) },
  { id: 'sql-10', title: 'Query Master', desc: 'Complete 5 SQL labs', tone: 'blue', test: (s) => Object.keys(s.labs).filter(k => k.startsWith('sql/')).length >= 5 },
  { id: 'py-10', title: 'Pythonista', desc: 'Complete 5 Python labs', tone: 'purple', test: (s) => Object.keys(s.labs).filter(k => k.startsWith('python/')).length >= 5 },
  { id: 'course', title: 'Course Complete', desc: 'Finish every chapter of one subject', tone: 'gold', test: (s, m) => m.courseProgress.some(c => c.pct === 100) },
  { id: 'scholar', title: 'Top Performer', desc: 'Finish 10 chapters', tone: 'gold', test: (s) => Object.keys(s.chapters).length >= 10 },
];

export function chapterPct(state, ch) {
  if (state.chapters[ch.key]) return 100;
  let p = state.opened[ch.key] ? 20 : 0;
  const labsDone = ch.labs.filter(l => state.labs[l.key]).length;
  if (ch.labs.length) p += Math.round((labsDone / ch.labs.length) * 45); else p += state.opened[ch.key] ? 25 : 0;
  const q = state.quiz[ch.key];
  if (ch.quiz.length) p += q ? Math.round((q.score / q.total) * 35) : 0; else p += state.opened[ch.key] ? 10 : 0;
  return Math.min(99, p);
}

function computeStreak(activity) {
  let streak = 0; const d = new Date();
  if (!activity[todayKey(d)]) d.setDate(d.getDate() - 1); // today may not have started yet
  while (activity[todayKey(d)]) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

export function ProgressProvider({ children, userId = 'guest', userName }) {
  const KEY = `${KEY_BASE}.${userId}`;
  const [state, setState] = useState(() => load(KEY, userName));
  useEffect(() => { try { const { apiKey, ...rest } = state.profile; localStorage.setItem(KEY, JSON.stringify({ ...state, profile: { ...rest, apiKey } })); } catch (e) { /* ignore */ } }, [state]); // eslint-disable-line
  useEffect(() => { document.documentElement.dataset.theme = state.profile.theme; }, [state.profile.theme]);

  const log = (s, n = 1) => { const k = todayKey(); return { ...s, activity: { ...s.activity, [k]: (s.activity[k] || 0) + n } }; };
  const api = useMemo(() => ({
    open: key => setState(s => (s.opened[key] ? s : log({ ...s, opened: { ...s.opened, [key]: Date.now() } }, 1))),
    toggleChapter: (key, on) => setState(s => { const chapters = { ...s.chapters }; if (on) chapters[key] = Date.now(); else delete chapters[key]; return on ? log({ ...s, chapters }, 2) : { ...s, chapters }; }),
    completeLab: key => setState(s => (s.labs[key] ? s : log({ ...s, labs: { ...s.labs, [key]: Date.now() } }, 3))),
    setQuiz: (key, score, total) => setState(s => { const p = s.quiz[key]; if (p && p.score >= score) return s; return log({ ...s, quiz: { ...s.quiz, [key]: { score, total, at: Date.now() } } }, 2); }),
    setNote: (key, txt) => setState(s => { const notes = { ...s.notes }; if (txt) notes[key] = txt; else delete notes[key]; return { ...s, notes }; }),
    setProfile: patch => setState(s => ({ ...s, profile: { ...s.profile, ...patch } })),
    reset: () => setState(DEFAULT),
    importState: json => setState(() => ({ ...DEFAULT, ...json, profile: { ...DEFAULT.profile, ...(json.profile || {}) } })),
  }), []);

  const derived = useMemo(() => {
    const courseProgress = COURSES.map(c => {
      const done = c.chapters.filter(ch => state.chapters[ch.key]).length;
      const avg = c.chapters.length ? c.chapters.reduce((a, ch) => a + chapterPct(state, ch), 0) / c.chapters.length : 0;
      return { id: c.id, done, total: c.chapters.length, pct: done === c.chapters.length && done > 0 ? 100 : Math.round(avg) };
    });
    const overall = Math.round(ALL_CHAPTERS.reduce((a, ch) => a + chapterPct(state, ch), 0) / Math.max(1, ALL_CHAPTERS.length));
    const streak = computeStreak(state.activity);
    const m = { streak, courseProgress, overall };
    const weekPoints = (() => { let n = 0; const d = new Date(); for (let i = 0; i < 7; i++) { n += state.activity[todayKey(d)] || 0; d.setDate(d.getDate() - 1); } return n; })();
    const badges = BADGES.map(b => ({ ...b, earned: b.test(state, m) }));
    return { ...m, badges, weekPoints, labsDone: Object.keys(state.labs).length, chaptersDone: Object.keys(state.chapters).length, totalLabs: ALL_LABS.length,
      pct: ch => chapterPct(state, ch) };
  }, [state]);

  const value = useMemo(() => ({ state, ...api, ...derived }), [state, api, derived]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useToast() { return useCallback(msg => window.dispatchEvent(new CustomEvent('dg-toast', { detail: msg })), []); }
