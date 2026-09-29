import { useState, Children, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Play, Copy, Check } from 'lucide-react';
import Lab from './labs/Lab.jsx';

const RUNNABLE = { python: 'python', py: 'python', sql: 'sql', dax: 'dax' };
const text = n => (typeof n === 'string' ? n : Array.isArray(n) ? n.map(text).join('') : isValidElement(n) ? text(n.props.children) : '');

function CodeBlock({ lang, code, course, chapterKey, children }) {
  const [open, setOpen] = useState(false); const [copied, setCopied] = useState(false);
  const kind = RUNNABLE[lang]; const runnable = kind && !(lang === 'sql' && /\bCREATE DATABASE\b/i.test(code) && false);
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch (e) { /* clipboard blocked */ } };
  const guessDb = /Departments|MoreEmployees/.test(code) ? 'company' : /Customers|Orders|customer\b/.test(code) && /CustomerID|total_spent|TotalAmount/.test(code) ? 'shop' : 'hr';
  return (
    <>
      <div className="codeblock">
        <div className="cb-bar"><span className="lang">{lang || 'text'}</span>
          <button onClick={copy} aria-label="Copy code">{copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}</button>
          {runnable && <button className="run" onClick={() => setOpen(o => !o)} aria-expanded={open}><Play size={12} /> {open ? 'Close' : 'Try it'}</button>}</div>
        <pre><code className={lang ? `hljs language-${lang}` : 'hljs'}>{children}</code></pre>
      </div>
      {open && <div className="inline-lab"><Lab spec={{ type: kind, title: 'Try it', starter: code, db: guessDb }} labKey={`${chapterKey}/try-${lang}-${code.length}`} course={course} inline /></div>}
    </>
  );
}

export default function Markdown({ md, course, chapterKey }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
      components={{
        pre({ children }) {
          const codeEl = Children.toArray(children).find(isValidElement);
          const cls = (codeEl && codeEl.props.className) || ''; const lang = (/language-([\w-]+)/.exec(cls) || [])[1];
          const raw = text(codeEl ? codeEl.props.children : '').replace(/\n$/, '');
          return <CodeBlock lang={lang} code={raw} course={course} chapterKey={chapterKey}>{codeEl ? codeEl.props.children : ''}</CodeBlock>;
        },
        a({ href, children }) { return /^https?:/.test(href || '') ? <a href={href} target="_blank" rel="noreferrer noopener">{children}</a> : <a href={href}>{children}</a>; },
      }}>{md}</ReactMarkdown>
  );
}
