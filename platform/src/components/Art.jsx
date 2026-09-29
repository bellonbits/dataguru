import { useId } from 'react';

/** Glossy 3D-ish subject illustrations, drawn in SVG so there are no image assets. */
export function SubjectArt({ id, size = 96 }) {
  const u = useId().replace(/:/g, '');
  const g = (n, a, b) => <linearGradient id={`${n}${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>;
  const shadow = <ellipse cx="60" cy="108" rx="34" ry="5" fill="#000" opacity=".10" />;
  const art = {
    excel: <>
      <defs>{g('a', '#4fd08a', '#127a44')}{g('b', '#ffffff', '#d5efe0')}</defs>
      {shadow}
      <rect x="22" y="14" width="70" height="88" rx="10" fill={`url(#b${u})`} stroke="#bfe3cd" />
      {[0, 1, 2, 3].map(r => [0, 1, 2].map(c => <rect key={r + '-' + c} x={30 + c * 19} y={24 + r * 17} width="15" height="12" rx="3" fill={r === 0 ? '#1f8a4c' : '#e4f4ea'} opacity={r === 0 ? 0.9 : 1} />))}
      <rect x="6" y="40" width="50" height="50" rx="12" fill={`url(#a${u})`} /><path d="M20 55l22 20M42 55L20 75" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    </>,
    powerbi: <>
      <defs>{g('a', '#ffd84d', '#e39a00')}{g('b', '#ffe89a', '#f2b51a')}{g('c', '#fff3c4', '#f7c948')}</defs>
      {shadow}
      <rect x="20" y="58" width="24" height="44" rx="8" fill={`url(#c${u})`} /><rect x="48" y="36" width="24" height="66" rx="8" fill={`url(#b${u})`} /><rect x="76" y="14" width="24" height="88" rx="8" fill={`url(#a${u})`} />
      <rect x="20" y="58" width="24" height="10" rx="5" fill="#fff" opacity=".45" /><rect x="48" y="36" width="24" height="10" rx="5" fill="#fff" opacity=".45" /><rect x="76" y="14" width="24" height="10" rx="5" fill="#fff" opacity=".45" />
    </>,
    sql: <>
      <defs>{g('a', '#7fa8ff', '#2450d6')}{g('b', '#a8c3ff', '#4f7bf0')}</defs>
      {shadow}
      {[70, 46, 22].map((y, i) => <g key={y}><path d={`M22 ${y + 10}v16c0 8 17 14 38 14s38-6 38-14V${y + 10}`} fill={`url(#a${u})`} /><ellipse cx="60" cy={y + 10} rx="38" ry="14" fill={`url(#b${u})`} /><ellipse cx="50" cy={y + 6} rx="15" ry="4" fill="#fff" opacity=".35" />{i < 2 && <path d={`M22 ${y + 26}c0 8 17 14 38 14s38-6 38-14`} stroke="#fff" opacity=".25" fill="none" />}</g>)}
    </>,
    python: <>
      <defs>{g('a', '#9a6bff', '#5426b8')}{g('b', '#ffe066', '#f0a500')}</defs>
      {shadow}
      <path d="M58 12c-20 0-22 9-22 16v12h24v6H28c-11 0-18 8-18 22 0 15 9 22 18 22h9V78c0-9 8-16 18-16h22c8 0 15-7 15-15V28c0-9-9-16-32-16z" fill={`url(#a${u})`} />
      <path d="M62 108c20 0 22-9 22-16V80H60v-6h32c11 0 18-8 18-22 0-15-9-22-18-22h-9v12c0 9-8 16-18 16H42c-8 0-15 7-15 15v20c0 9 9 16 35 16z" fill={`url(#b${u})`} />
      <circle cx="48" cy="26" r="4" fill="#fff" /><circle cx="72" cy="94" r="4" fill="#fff" />
    </>,
    ds: <>
      <defs>{g('a', '#ffa66b', '#e2520e')}{g('b', '#ffe1cc', '#ffc199')}</defs>
      {shadow}
      <path d="M48 14h24v28l26 46c5 10-2 20-14 20H36c-12 0-19-10-14-20l26-46z" fill={`url(#b${u})`} stroke="#ffb98a" />
      <path d="M40 66h40l14 26c4 8-1 16-11 16H37c-10 0-15-8-11-16z" fill={`url(#a${u})`} />
      <circle cx="52" cy="84" r="5" fill="#fff" opacity=".8" /><circle cx="68" cy="94" r="4" fill="#fff" opacity=".7" /><circle cx="62" cy="76" r="3" fill="#fff" opacity=".7" />
      <rect x="44" y="10" width="32" height="8" rx="4" fill="#ffb98a" />
    </>,
  }[id] || null;
  return <svg width={size} height={size} viewBox="0 0 120 116" aria-hidden="true">{art}</svg>;
}

/** Friendly tutor robot mascot. */
export function Robot({ size = 120 }) {
  const u = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 140 150" aria-hidden="true">
      <defs>
        <linearGradient id={`b${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#cfd6e4" /></linearGradient>
        <linearGradient id={`v${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b2540" /><stop offset="1" stopColor="#0a0f1e" /></linearGradient>
      </defs>
      <ellipse cx="72" cy="142" rx="34" ry="5" fill="#000" opacity=".12" />
      <path d="M40 92c-10-6-18-20-10-26" stroke="#dfe5f1" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M104 96c14 4 26 0 28-14" stroke="#dfe5f1" strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="44" y="84" width="56" height="48" rx="22" fill={`url(#b${u})`} /><rect x="58" y="98" width="28" height="10" rx="5" fill="#2ec4ff" opacity=".85" />
      <rect x="26" y="26" width="92" height="66" rx="30" fill={`url(#b${u})`} /><rect x="35" y="35" width="74" height="46" rx="22" fill={`url(#v${u})`} />
      <circle cx="58" cy="58" r="9" fill="#2ec4ff" /><circle cx="86" cy="58" r="9" fill="#2ec4ff" /><circle cx="55" cy="55" r="3" fill="#fff" /><circle cx="83" cy="55" r="3" fill="#fff" />
      <path d="M64 72q8 6 16 0" stroke="#2ec4ff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="14" y="48" width="12" height="24" rx="6" fill="#2ec4ff" /><rect x="118" y="48" width="12" height="24" rx="6" fill="#2ec4ff" />
      <path d="M72 26V14" stroke="#cfd6e4" strokeWidth="4" strokeLinecap="round" /><circle cx="72" cy="11" r="5" fill="#ff7a59" />
    </svg>
  );
}

const TONES = { lime: ['#f6ffb0', '#b6e02c', '#5b7d00'], orange: ['#ffd08a', '#ff8a1f', '#a13d00'], blue: ['#b9d3ff', '#3f7cff', '#153c96'], purple: ['#e0cbff', '#8a52f0', '#4a1d99'], gold: ['#ffeaa1', '#f0b000', '#7a5300'] };
/** Hexagon achievement badge. `glyph` is a small SVG path group. */
export function BadgeArt({ tone = 'gold', glyph = 'star', size = 78, locked = false }) {
  const u = useId().replace(/:/g, ''); const [a, b, c] = TONES[tone] || TONES.gold;
  const glyphs = {
    flame: <path d="M40 18c4 10 14 14 14 28 0 9-6 16-14 16s-14-7-14-15c0-6 3-9 6-13 1 5 4 7 6 7-1-8-1-15 2-23z" fill="#fff" />,
    star: <path d="M40 16l6.5 13.5 14.8 2-10.8 10.4 2.6 14.7L40 49.6 26.9 56.6l2.6-14.7L18.7 31.5l14.8-2z" fill="#fff" />,
    book: <><rect x="24" y="20" width="32" height="40" rx="4" fill="#fff" /><path d="M32 30h16M32 38h16M32 46h10" stroke={b} strokeWidth="3" strokeLinecap="round" /></>,
    bolt: <path d="M44 14L26 42h12l-4 24 20-30H42z" fill="#fff" />,
    check: <path d="M24 42l11 11 21-24" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    db: <><ellipse cx="40" cy="26" rx="16" ry="6" fill="#fff" /><path d="M24 26v22c0 3 7 6 16 6s16-3 16-6V26" fill="#fff" opacity=".85" /></>,
    code: <path d="M32 28L20 40l12 12M48 28l12 12-12 12" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    trophy: <path d="M28 20h24v14c0 8-5 13-12 13s-12-5-12-13zM28 24h-8c0 8 4 12 10 13M52 24h8c0 8-4 12-10 13M40 47v9m-9 0h18" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="#fff" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true" style={{ filter: locked ? 'grayscale(1) opacity(.45)' : 'drop-shadow(0 6px 8px rgba(0,0,0,.18))' }}>
      <defs><linearGradient id={`h${u}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} /></linearGradient></defs>
      <path d="M40 4l31 18v36L40 76 9 58V22z" fill={`url(#h${u})`} /><path d="M40 10l25 14.5v31L40 70 15 55.5v-31z" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
      {glyphs[glyph]}
    </svg>
  );
}
export const BADGE_GLYPH = { 'first-lab': 'bolt', streak3: 'flame', streak7: 'flame', 'quiz-ace': 'star', 'sql-10': 'db', 'py-10': 'code', course: 'trophy', scholar: 'book' };

export function Ring({ pct, size = 46, stroke = 4, color = '#7f6bff' }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% complete`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.24} fill="var(--muted)" fontWeight="600">{pct}%</text>
    </svg>
  );
}

/** Semicircle gauge (like the reference "Learning progress"). */
export function Gauge({ pct, label }) {
  const R = 118, cx = 140, cy = 140, len = Math.PI * R;
  const p = Math.max(0, Math.min(100, pct));
  const arc = `M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`;
  return (
    <svg viewBox="0 0 280 170" width="100%" role="img" aria-label={`${label}: ${p}%`}>
      <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c7f000" /><stop offset=".7" stopColor="#b8f53d" /><stop offset="1" stopColor="#b18cff" /></linearGradient></defs>
      <path d={arc} fill="none" stroke="var(--line)" strokeWidth="20" strokeLinecap="round" />
      <path d={arc} fill="none" stroke="url(#gg)" strokeWidth="20" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p / 100)} style={{ transition: 'stroke-dashoffset .8s ease' }} />
      <text x={cx} y={cy - 20} textAnchor="middle" fontSize="40" fontWeight="700" fill="var(--ink)">{p}%</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="15" fill="var(--muted)">{label}</text>
    </svg>
  );
}

const PALETTE = [['#dff5b4', '#7cbd1e'], ['#d6e4ff', '#3b6cf0'], ['#ffe2cf', '#e2681c'], ['#ecdcff', '#8a52f0'], ['#ffeaa8', '#d49a00']];
/** Generated thumbnail for a chapter card. */
export function Thumb({ seed = 0, glyph = '</>', minutes }) {
  const [bg, fg] = PALETTE[seed % PALETTE.length];
  const dots = Array.from({ length: 14 }, (_, i) => ({ x: (i * 47 + seed * 31) % 200, y: (i * 29 + seed * 17) % 110, r: 2 + ((i + seed) % 4) }));
  return (
    <div className="thumb" style={{ background: `linear-gradient(135deg, ${bg}, #fff)` }}>
      <svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={fg} opacity=".18" />)}
        <path d={`M0 ${80 - (seed % 3) * 8} Q 50 ${40 + (seed % 4) * 10}, 100 ${70 - (seed % 2) * 20} T 200 ${50 + (seed % 3) * 10} V110 H0z`} fill={fg} opacity=".16" />
        <text x="100" y="66" textAnchor="middle" fontSize="40" fontWeight="800" fill={fg} opacity=".9" fontFamily="JetBrains Mono, monospace">{glyph}</text>
      </svg>
      {minutes ? <span className="dur">{String(minutes).padStart(2, '0')}:00</span> : null}
    </div>
  );
}
