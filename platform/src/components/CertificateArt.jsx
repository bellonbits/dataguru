/** Geometric border in the certificate's navy / green / gold palette. Seeded, so it is identical on every render and print. */
const PAL = ['#2f2b7c', '#5aa383', '#f0c23e'];
const W = 1684, H = 1202, S = 62;
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function build() {
  const r = rng(20240611), pick = () => PAL[Math.floor(r() * 3)], out = [];
  const cols = Math.ceil(W / S), rows = Math.ceil(H / S);
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) {
    const x = cx * S, y = cy * S;
    const edge = Math.min(cx, cy, cols - 1 - cx, rows - 1 - cy);            // cells from the nearest edge
    const corner = Math.min(Math.min(cx, cols - 1 - cx), Math.min(cy, rows - 1 - cy)) < 3 && (cx < 5 || cx > cols - 6) && (cy < 5 || cy > rows - 6);
    const p = corner ? 0.62 : edge === 0 ? 0.5 : edge === 1 ? 0.3 : edge === 2 ? 0.1 : 0;
    const centre = cx >= 6 && cx <= cols - 7;                                // keep title and signatures clear
    if (r() > p || (centre && edge > 0)) continue;
    const kind = r(), c = [pick(), pick(), pick(), pick()], h = S / 2, m = S * 0.9, o = (S - m) / 2;
    const g = (k, d) => <g key={`${cx}-${cy}-${k}`}>{d}</g>;
    if (kind < 0.42) { // pinwheel square
      out.push(g('p', <g transform={`translate(${x + o},${y + o})`}>
        <polygon points={`0,0 ${m},0 ${m / 2},${m / 2}`} fill={c[0]} /><polygon points={`${m},0 ${m},${m} ${m / 2},${m / 2}`} fill={c[1]} />
        <polygon points={`${m},${m} 0,${m} ${m / 2},${m / 2}`} fill={c[2]} /><polygon points={`0,${m} 0,0 ${m / 2},${m / 2}`} fill={c[3]} /></g>));
    } else if (kind < 0.7) { // diamond
      const d = S * 0.62, cxm = x + h, cym = y + h;
      out.push(g('d', <g>
        <polygon points={`${cxm},${cym - d} ${cxm + d},${cym} ${cxm},${cym}`} fill={c[0]} /><polygon points={`${cxm + d},${cym} ${cxm},${cym + d} ${cxm},${cym}`} fill={c[1]} />
        <polygon points={`${cxm},${cym + d} ${cxm - d},${cym} ${cxm},${cym}`} fill={c[2]} /><polygon points={`${cxm - d},${cym} ${cxm},${cym - d} ${cxm},${cym}`} fill={c[0]} /></g>));
    } else if (kind < 0.86) { // big triangle
      const rot = Math.floor(r() * 4) * 90;
      out.push(g('t', <polygon transform={`rotate(${rot} ${x + h} ${y + h})`} points={`${x},${y + S} ${x + S},${y + S} ${x + h},${y}`} fill={c[0]} />));
    } else { // half square
      const rot = Math.floor(r() * 4) * 90;
      out.push(g('h', <g transform={`rotate(${rot} ${x + h} ${y + h})`}><polygon points={`${x},${y} ${x + S},${y} ${x},${y + S}`} fill={c[1]} /><polygon points={`${x + S},${y} ${x + S},${y + S} ${x},${y + S}`} fill={c[2]} opacity=".92" /></g>));
    }
  }
  return out;
}
const SHAPES = build();

export default function CertificateArt() {
  return <svg className="cert-art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"><rect width={W} height={H} fill="#fff" />{SHAPES}</svg>;
}
