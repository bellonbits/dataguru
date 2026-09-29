import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Device-local accounts. There is no server: users are stored in this browser's localStorage and passwords are
 * salted + hashed with PBKDF2 (WebCrypto). This protects against casual snooping, NOT against someone with access
 * to the browser profile. To use a real backend, replace the functions in `service` and keep the same signatures.
 */
const USERS = 'dataguru.users', SESSION = 'dataguru.session', GUEST = 'dataguru.guest', LOCK = 'dataguru.lock';
const read = (k, store = localStorage) => { try { return JSON.parse(store.getItem(k)); } catch (e) { return null; } };
const write = (k, v, store = localStorage) => { try { store.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };
const drop = (k) => { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) { /* ignore */ } };

const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function hash(secret, saltB64) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: unb64(saltB64), iterations: 150000, hash: 'SHA-256' }, key, 256));
}
const newSalt = () => b64(crypto.getRandomValues(new Uint8Array(16)));
const norm = e => String(e).trim().toLowerCase();
const same = (a, b) => a.length === b.length && [...a].reduce((x, c, i) => x | (c.charCodeAt(0) ^ b.charCodeAt(i)), 0) === 0;
export function recoveryCode() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; const r = crypto.getRandomValues(new Uint8Array(12)); const s = [...r].map(x => A[x % A.length]).join(''); return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`; }

export const passwordIssues = p => [
  p.length < 8 && 'at least 8 characters', !/[a-z]/.test(p) && 'a lowercase letter', !/[A-Z]/.test(p) && 'an uppercase letter', !/\d/.test(p) && 'a number',
].filter(Boolean);
export function passwordStrength(p) {
  let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
  return { score: Math.min(4, s), label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][Math.min(4, s)] };
}
export const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

/** Throttle: 5 wrong attempts locks that email for 30 s (client-side courtesy, not real protection). */
function lockState(email) { const l = read(LOCK) || {}; const e = l[norm(email)]; return e && e.until > Date.now() ? Math.ceil((e.until - Date.now()) / 1000) : 0; }
function noteFail(email) { const l = read(LOCK) || {}; const k = norm(email); const e = l[k] || { n: 0 }; e.n += 1; if (e.n >= 5) { e.until = Date.now() + 30000; e.n = 0; } l[k] = e; write(LOCK, l); }
function clearFails(email) { const l = read(LOCK) || {}; delete l[norm(email)]; write(LOCK, l); }

export const service = {
  async signUp({ name, email, password }) {
    const users = read(USERS) || [];
    if (users.some(u => u.email === norm(email))) throw new Error('An account with this email already exists. Try signing in instead.');
    const salt = newSalt(), code = recoveryCode(), rsalt = newSalt();
    const user = { id: crypto.randomUUID(), name: name.trim(), email: norm(email), salt, hash: await hash(password, salt), rsalt, rhash: await hash(code.replace(/-/g, ''), rsalt), createdAt: Date.now() };
    write(USERS, [...users, user]);
    return { user: pub(user), recoveryCode: code };
  },
  async signIn({ email, password }) {
    const wait = lockState(email); if (wait) throw new Error(`Too many attempts. Try again in ${wait} seconds.`);
    const u = (read(USERS) || []).find(x => x.email === norm(email));
    const h = u ? await hash(password, u.salt) : await hash(password, newSalt()); // same work whether or not the account exists
    if (!u || !same(h, u.hash)) { noteFail(email); throw new Error('Incorrect email or password.'); }
    clearFails(email); return pub(u);
  },
  async resetWithRecovery({ email, code, password }) {
    const wait = lockState(email); if (wait) throw new Error(`Too many attempts. Try again in ${wait} seconds.`);
    const users = read(USERS) || []; const u = users.find(x => x.email === norm(email));
    const h = u ? await hash(code.replace(/[\s-]/g, '').toUpperCase(), u.rsalt) : await hash(code, newSalt());
    if (!u || !same(h, u.rhash)) { noteFail(email); throw new Error('That email and recovery code do not match.'); }
    clearFails(email);
    const salt = newSalt(), rsalt = newSalt(), fresh = recoveryCode();
    Object.assign(u, { salt, hash: await hash(password, salt), rsalt, rhash: await hash(fresh.replace(/-/g, ''), rsalt) });
    write(USERS, users); return { user: pub(u), recoveryCode: fresh };
  },
  async changePassword({ id, current, password }) {
    const users = read(USERS) || []; const u = users.find(x => x.id === id);
    if (!u || !same(await hash(current, u.salt), u.hash)) throw new Error('Your current password is incorrect.');
    u.salt = newSalt(); u.hash = await hash(password, u.salt); write(USERS, users);
  },
  async deleteAccount({ id, password }) {
    const users = read(USERS) || []; const u = users.find(x => x.id === id);
    if (!u || !same(await hash(password, u.salt), u.hash)) throw new Error('Password is incorrect.');
    write(USERS, users.filter(x => x.id !== id)); try { localStorage.removeItem(`dataguru.v2.${id}`); } catch (e) { /* ignore */ }
  },
  updateName(id, name) { const users = read(USERS) || []; const u = users.find(x => x.id === id); if (u) { u.name = name.trim(); write(USERS, users); } },
};
const pub = u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const load = () => { const s = read(SESSION, sessionStorage) || read(SESSION); if (s && (read(USERS) || []).some(u => u.id === s.id)) return { user: (read(USERS) || []).map(pub).find(u => u.id === s.id), guest: false }; return { user: null, guest: !!(read(GUEST, sessionStorage) || read(GUEST)) }; };
  const [st, setSt] = useState(load);
  const start = useCallback((user, remember) => { drop(SESSION); drop(GUEST); write(SESSION, { id: user.id }, remember ? localStorage : sessionStorage); setSt({ user, guest: false }); }, []);
  const api = useMemo(() => ({
    ...st, ready: !!(st.user || st.guest),
    async signUp(f) { return service.signUp(f); }, // session starts in finish(), after the recovery code is acknowledged
    finish(user) { start(user, true); },
    async signIn(f) { const u = await service.signIn(f); start(u, f.remember); return u; },
    async reset(f) { return service.resetWithRecovery(f); },
    guestMode() { drop(SESSION); write(GUEST, true, sessionStorage); setSt({ user: null, guest: true }); },
    signOut() { drop(SESSION); drop(GUEST); setSt({ user: null, guest: false }); },
    async changePassword(f) { return service.changePassword({ id: st.user.id, ...f }); },
    async deleteAccount(f) { await service.deleteAccount({ id: st.user.id, ...f }); drop(SESSION); setSt({ user: null, guest: false }); },
    rename(name) { service.updateName(st.user.id, name); setSt(s => ({ ...s, user: { ...s.user, name } })); },
  }), [st, start]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
