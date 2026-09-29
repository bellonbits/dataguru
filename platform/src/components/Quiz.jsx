import { useEffect, useState } from 'react';
import { useProgress } from '../lib/store.jsx';

/** items: [{q, options[], answer: index | index[], why}] */
export default function Quiz({ quizKey, items }) {
  const { state, setQuiz } = useProgress();
  const [round, setRound] = useState(0);
  const [res, setRes] = useState(() => items.map(() => null));
  useEffect(() => setRes(items.map(() => null)), [round, items]);
  const answered = res.filter(Boolean).length;
  const score = res.filter(r => r && r.ok).length;
  useEffect(() => { if (answered === items.length && items.length) setQuiz(quizKey, score, items.length); }, [answered]); // eslint-disable-line
  const best = state.quiz[quizKey];
  return (
    <section className="quiz" aria-label="Quiz" key={round}>
      {items.map((it, i) => <Question key={i} n={i + 1} it={it} onDone={ok => setRes(r => r.map((x, j) => (j === i ? { ok } : x)))} />)}
      <div className="quiz-summary" aria-live="polite">
        {answered < items.length ? `${answered} of ${items.length} answered` : `Score: ${score} / ${items.length}${score === items.length ? ' 🎉 Perfect!' : '. Read the explanations and try again.'}`}
      </div>
      <div className="quiz-actions">
        {best && <span className="muted">Best: {best.score}/{best.total}</span>}
        <button className="btn sm ghost" onClick={() => setRound(r => r + 1)}>Retry</button>
      </div>
    </section>
  );
}

function Question({ n, it, onDone }) {
  const multi = Array.isArray(it.answer); const answers = multi ? it.answer : [it.answer];
  const [chosen, setChosen] = useState([]); const [done, setDone] = useState(false);
  const finish = sel => { const ok = sel.length === answers.length && answers.every(a => sel.includes(a)); setDone(true); onDone(ok); };
  const pick = i => {
    if (done) return;
    if (multi) setChosen(c => (c.includes(i) ? c.filter(x => x !== i) : [...c, i]));
    else { setChosen([i]); finish([i]); }
  };
  const ok = done && chosen.length === answers.length && answers.every(a => chosen.includes(a));
  return (
    <div className="q">
      <p className="qtext"><b>{n}.</b> {it.q}{multi && <span className="muted"> (select all that apply)</span>}</p>
      <div className="opts" role={multi ? 'group' : 'radiogroup'}>
        {it.options.map((o, i) => (
          <button key={i} type="button" role={multi ? 'checkbox' : 'radio'} aria-checked={chosen.includes(i)} disabled={done}
            className={'opt' + (!done && chosen.includes(i) ? ' picked' : '') + (done && answers.includes(i) ? ' right' : '') + (done && chosen.includes(i) && !answers.includes(i) ? ' wrong' : '')}
            onClick={() => pick(i)}><span className="letter">{String.fromCharCode(65 + i)}</span><span>{o}</span></button>
        ))}
      </div>
      {multi && !done && <button className="btn sm" style={{ marginTop: 8 }} onClick={() => chosen.length && finish(chosen)}>Check answer</button>}
      {done && <div className={'feedback ' + (ok ? 'ok' : 'bad')}>{ok ? 'Correct. ' : 'Not quite. '}{it.why}</div>}
    </div>
  );
}
