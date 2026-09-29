// In-browser Python via Pyodide (loaded from CDN on first use).
import { loadScript } from './util.js';
const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
let pyP, stdoutBuf = [], stderrBuf = [];

export const BOOT = `
import os, sys, io, base64, warnings, builtins
os.environ['MPLBACKEND'] = 'AGG'
warnings.filterwarnings('ignore', message='.*(non-interactive|non-GUI).*')
from js import prompt as _js_prompt
def _dg_input(msg=''):
    v = _js_prompt(str(msg))
    if v is None: raise EOFError('input cancelled')
    print(str(msg) + str(v)); return str(v)
builtins.input = _dg_input
open('data.csv','w').write("""id,name,age,salary,date
1,John,28,50000,2024-01-15
2,Jane,,60000,2024-02-20
3,Sara,35,55000,2024-03-05
4,Mark,42,,2024-03-18
2,Jane,,60000,2024-02-20
6,Amy,31,72000,2024-04-02
7,Omar,29,48000,2024-04-25
""")
open('data.json','w').write('[{"name":"John","age":28,"city":"Lagos"},{"name":"Jane","age":31,"city":"Nairobi"},{"name":"Sara","age":35,"city":"Accra"}]')
import sqlite3
_c = sqlite3.connect('database.db'); _c.execute('DROP TABLE IF EXISTS table1')
_c.execute('CREATE TABLE table1 (id INT, item TEXT, qty INT)'); _c.executemany('INSERT INTO table1 VALUES (?,?,?)', [(1,'pen',10),(2,'book',4),(3,'bag',2)]); _c.commit(); _c.close()
def __dg_collect():
    out = []
    if 'matplotlib.pyplot' in sys.modules:
        plt = sys.modules['matplotlib.pyplot']
        for n in plt.get_fignums():
            fig = plt.figure(n); buf = io.BytesIO()
            fig.savefig(buf, format='png', dpi=90, bbox_inches='tight')
            out.append(base64.b64encode(buf.getvalue()).decode())
        plt.close('all')
    return out
def __dg_patch_seaborn():
    import seaborn as sns, pandas as pd, numpy as np
    def load_dataset(name, **kw):
        r = np.random.default_rng(7)
        if name == 'tips':
            bill = np.round(r.gamma(4, 5, 120) + 5, 2)
            return pd.DataFrame({'total_bill': bill, 'tip': np.round(bill * r.normal(.16, .04, 120).clip(.05, .3), 2),
                'sex': r.choice(['Male','Female'], 120), 'smoker': r.choice(['Yes','No'], 120),
                'day': r.choice(['Thur','Fri','Sat','Sun'], 120), 'time': r.choice(['Lunch','Dinner'], 120), 'size': r.integers(1, 6, 120)})
        if name == 'flights':
            rows = []
            for y in range(1949, 1961):
                for i, m in enumerate(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']):
                    rows.append((y, m, int((110 + (y - 1949) * 28) * (1 + .25 * np.sin(i / 12 * 2 * np.pi - 1)) + r.normal(0, 6))))
            return pd.DataFrame(rows, columns=['year','month','passengers'])
        raise ValueError('Offline sandbox only has the "tips" and "flights" practice datasets (generated locally).')
    sns.load_dataset = load_dataset
`;

export function loadPython(onStatus = () => {}) {
  if (pyP) return pyP;
  pyP = (async () => {
    onStatus('Loading Python runtime (first run takes ~10–20 s)…');
    await loadScript(CDN + 'pyodide.js');
    const py = await window.loadPyodide({ indexURL: CDN });
    py.setStdout({ batched: s => stdoutBuf.push(s) });
    py.setStderr({ batched: s => stderrBuf.push(s) });
    await py.loadPackage('sqlite3');
    await py.runPythonAsync(BOOT);
    return py;
  })().catch(e => { pyP = null; throw e; });
  return pyP;
}

/** Create an isolated namespace for one lab. */
export async function newNamespace(onStatus) {
  const py = await loadPython(onStatus);
  return py.globals.get('dict')();
}

/** Run code. Returns {stdout, stderr, error, figures[]}. */
export async function runPython(code, ns, onStatus = () => {}) {
  const py = await loadPython(onStatus);
  stdoutBuf = []; stderrBuf = [];
  let error = null;
  try {
    const needs = ['numpy', 'pandas', 'matplotlib', 'seaborn', 'scipy', 'sklearn'].filter(m => new RegExp('\\b(import|from)\\s+' + m + '\\b').test(code));
    if (/\.plot\b|\.hist\(|\.boxplot|\bplt\.|\bsns\./.test(code) && !needs.includes('matplotlib')) needs.push('matplotlib');
    if (needs.includes('matplotlib') && /\.plot\b|\.hist\(|\.boxplot/.test(code) && !needs.includes('pandas') && /\bpd\b|pandas/.test(code)) needs.push('pandas');
    if (needs.length) {
      onStatus('Loading ' + needs.join(', ') + '…');
      const std = needs.filter(n => n !== 'seaborn');
      if (needs.includes('seaborn')) std.push('pandas', 'numpy', 'matplotlib');
      await py.loadPackage([...new Set(std.map(n => (n === 'sklearn' ? 'scikit-learn' : n)))]);
      if (needs.includes('seaborn')) { await py.loadPackage('micropip'); await py.pyimport('micropip').install('seaborn'); await py.runPythonAsync('__dg_patch_seaborn()'); }
    }
    onStatus('Running…');
    py.globals.set('__dg_code', code);
    await py.runPythonAsync(code, { globals: ns });
  } catch (e) {
    const msg = String(e.message || e);
    // keep only the user-facing tail of the traceback
    const lines = msg.split('\n').filter(l => !/pyodide\/|_pyodide|File "\/lib\/python/.test(l));
    const idx = lines.findIndex(l => /Traceback/.test(l));
    error = (idx >= 0 ? lines.slice(idx) : lines).join('\n').trim();
  }
  let figures = [];
  try { figures = py.runPython('__dg_collect()').toJs(); } catch (e) { /* no figures */ }
  onStatus('');
  return { stdout: stdoutBuf.join('\n'), stderr: stderrBuf.join('\n'), error, figures };
}
