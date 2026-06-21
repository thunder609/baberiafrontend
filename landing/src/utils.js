export const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

export function rebuildContainer(id) {
  const old = document.getElementById(id);
  if (!old) return null;
  const fresh = old.cloneNode(false);
  old.parentNode.replaceChild(fresh, old);
  return fresh;
}

export async function api(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
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
  while (current < end) {
    const slotEnd = current + duration;
    if (slotEnd <= end) {
      slots.push({
        start: current,
        end: slotEnd,
        label: `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`,
      });
    }
    current += duration;
  }
  return slots;
}

export function minutesSinceMidnight(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
