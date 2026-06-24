export const API = import.meta.env.VITE_API_URL || '';

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

export function rebuildContainer(id) {
  const old = document.getElementById(id);
  if (!old) return null;
  const fresh = old.cloneNode(false);
  old.parentNode.replaceChild(fresh, old);
  return fresh;
}

function cacheKey(path) {
  return `api_cache::${path}`;
}

function cacheGet(path) {
  try {
    const raw = localStorage.getItem(cacheKey(path));
    if (!raw) return null;
    const { data, expires } = JSON.parse(raw);
    return Date.now() < expires ? data : null;
  } catch {
    return null;
  }
}

function cacheSet(path, data, ttlMs = 300_000) {
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify({ data, expires: Date.now() + ttlMs }));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function clearCache() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('api_cache::'))
    .forEach((k) => localStorage.removeItem(k));
}

export async function api(path, { ttl } = {}) {
  const cached = cacheGet(path);
  if (cached) return cached;

  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  if (ttl) cacheSet(path, data, ttl);
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.errors?.join(', ') || `Error ${res.status}`);
  }
  return res.json();
}

export function localDateString(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateSlots(start, end, duration = 30) {
  const slots = [];
  let current = start;
  while (current + duration <= end) {  // Cambiado: <= para incluir el último slot
    slots.push({
      start: current,
      end: current + duration,
      label: `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`,
    });
    current += duration;
  }
  return slots;
}

export function minutesSinceMidnight(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
